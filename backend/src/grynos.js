const sequelize = require('./sequalize_pg');
const axios = require('axios');
const models = require('./models');
const db = require('./db');
const services = require('./services');
const logger = require('./utils/logging');
const url = process.env.GRYNOS_COURSE_API_URL;
const courseDetailUrl = process.env.GRYNOS_COURSE_DETAILS_API_URL;

const mapCourseFromGrynos = (course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
    descriptionInternet: course.descriptionInternet,
    price: course.price,
    priceMaterial: course.priceMaterial,
    firstSessionDate: course.firstSession,
    firstSessionWeekDay: course.firstSessionWeekdate,
    lastSessionDate: course.lastSession,
    internetEnrollment: course.internetEnrollment,
    minStudentCount: course.minStudentCount,
    maxStudentCount: course.maxStudentCount,
    firstEnrollmentDate: course.firstEnrollmentDate,
    lastEnrollmentDate: course.lastEnrollmentDate,
    acceptedCount: course.acceptedCount,
    ilmokink: course.ilmokink,
    teachingSession: course.teachingSession,
    location: course.location,
    single_payment_count: course.single_payment_count,
    course_type_id: course.course_type_id,
});

const mapCourseDetailsFromGrynos = async (course) => {
    try {
        const courseDetails = await axios(courseDetailUrl + course.code);
        return {
            ...course,
            description: courseDetails.data.descriptionInternet,
            single_payment_count: courseDetails.data.singlePaymentCount,
            company_name: courseDetails.data.companyName,
            course_type_id: courseDetails.data.courseTypeID,
            course_type_name: courseDetails.data.courseTypeName,
            teacher: courseDetails.data.teacher,
            location: courseDetails.data.location
        };
    }
    catch (e) {
        logger.error('Grynos', `Error fetching course details for ${course.code}: ${e.message}`);
        throw e;
    }
};

const fetchCoursesFromGrynos = async () => {
    if (!url) {
      logger.error('Grynos', 'No Grynos URL set in environment.');
      return;
    }
    const response = await axios(url);
    logger.log('Grynos', 'Courses response data.total: ' + response.data.total);
    if (response.data.course) {
        return await Promise.all(
            response.data.course
                .map(mapCourseFromGrynos)
                .map(mapCourseDetailsFromGrynos)
        );
    }
};

const clearDatabase = async () => {
    await sequelize.sync({ force: true });
};

const fetchAndSaveCoursesToDb = async () => {
    logger.log('Grynos', 'Updating course data');
    try {
        const courses = await fetchCoursesFromGrynos();
        return await updateCoursesToDb(courses);
    } catch (e) {
        logger.error('Grynos', e.message);
    }
}
const updateCoursesToDb = async (courses) => {
    try {
        await sequelize.sync();
        const dbCourses = await db.courses.getAllCourses();
        const dbCourseIds = dbCourses.map(course => course.id);
        if (courses) {
            // Handle all cancellations serially first to avoid race conditions on user balance updates.
            for (const course of courses) {
                if (dbCourseIds.includes(course.id)) {
                    const dbCourse = dbCourses.find(item => item.id === course.id);
                    await handleCancellations(dbCourse, dbCourse.teachingSession, course.teachingSession);
                }
            }

            // Then update all courses in parallel.
            return await Promise.all(
                courses.map(async (course) => {
                    if (dbCourseIds.includes(course.id)) {
                        const dbCourse = dbCourses.find(item => item.id === course.id);
                        const locationId = dbCourse.location && dbCourse.location.length > 0 ? dbCourse.location[0].dataValues.id : null;
                        const updatedCourses = await dbCourse.update(course);

                        for (let teachingSession of course.teachingSession) {
                            const session = await db.events.getEventById(teachingSession.id);
                            if (session) {
                                await session.update(teachingSession);
                            } else {
                                teachingSession.courseId = dbCourse.id;
                                await models.events.create(teachingSession);
                            }
                        }

                        if (locationId && course.location.length > 0) {
                            const location = await db.locations.getLocationById(locationId);
                            if (location) {
                                await location.update({ ...course.location[0] });

                            }
                        }
                        return updatedCourses;
                    } else {
                        return models.courses.create(course, {
                            include: [
                                { model: models.events, as: 'teachingSession' },
                                { model: models.locations, as: 'location' },
                            ],
                        });
                    }
                })
            );
        } else {
            logger.error('Grynos', 'No courses available from Grynos.');
        }
    } catch (error) {
        logger.error('Grynos', `Failed to update courses to database: ${error}`);
    }

}

const handleCancellations = async (_course, existingTeachingSessions, newTeachingSessions) => {
    try {
        for (const existingSession of existingTeachingSessions) {
            const newSession = newTeachingSessions.find(item => item.id === existingSession.dataValues.eventId);
            // A course teaching session status of -2 denotes that the teaching session has been cancelled.
            // If a whole course is cancelled (if it hasn't started yet), then all of the teaching sessions should be handled as cancelled, no matter their status.
            // In case of a fully cancelled course, the course's status property is -2. TODO: the status and cancellation for a whole course is not implemented.
            // The course status property is not visible in the general courses listing API, but only in course details.
            // The status should be interpreted as follows:
            // Peruttu = -2
            // Hyväksytty = 0
            // Suunnitelma = 1
            // Ehdotus = 10
            // Käynnissä = 15
            // Päättynyt = 20
            // Keskeytetty = 100
            if (newSession && newSession.status === -2 && existingSession.dataValues.status !== newSession.status) {
                logger.log('Grynos', 'Cancelling event: ' + existingSession.dataValues.eventId);
                const reservations = await db.reservations.getReservationsByEventId(existingSession.dataValues.eventId);
                if (reservations) {
                    await cancelReservations(reservations);
                }
                await models.events.update(
                    { status: -2 },
                    { returning: true, where: { id: newSession.id } });
            }
        }
    } catch (error) {
        logger.error('Grynos', 'Failed to handleCancellations', error);
    }
};

const cancelReservations = async (reservations) => {
    try {
        for (let reservation of reservations) {
            logger.log('Grynos', 'Cancelling reservation: ' + reservation.dataValues.id);
            await db.reservations.cancelReservation(reservation.dataValues.id);

            if (!process.env.TELIA_USERNAME) {
                // If no SMS service available.
                logger.log('Grynos', `Reservation cancelled for user ID ${reservation.dataValues.userId} on reservation ID ${reservation.dataValues.id}`);
                continue;
            }

            const [message, dbUser] = await Promise.all([services.sms.buildCancellationMessage(reservation.dataValues), db.users.getUserById(reservation.dataValues.userId)]);
            await services.sms.sendMessageToUser(
                dbUser,
                message
            );
        }
    } catch (error) {
        logger.error('Grynos', 'Cancelling reservation failed', error);
        throw error;
    }
}

module.exports = {
    mapCourseFromGrynos,
    fetchCoursesFromGrynos,
    fetchAndSaveCoursesToDb,
    updateCoursesToDb,
    handleCancellations,
    clearDatabase
};
