const sequelize = require('./sequalize_pg');
const axios = require('axios');
const models = require('./models');
const db = require('./db');
const services = require('./services');
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
        console.error(`${(new Date).toISOString()} error fetching course details for ${course.code}: ${e.message}`);
        throw e;
    }
};

const fetchCoursesFromGrynos = async () => {
    if (!url) {
      console.log("Warning: no Grynos URL set in environment.");
      return;
    }
    const response = await axios(url);
    console.log("Courses response data.total: " + response.data.total);
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
    console.log((new Date).toISOString() + ' Executing fetchAndSaveCoursesToDb');
    try {
        const courses = await fetchCoursesFromGrynos();
        return await updateCoursesToDb(courses);
    } catch (e) {
        console.error((new Date).toISOString() + " " + e.message);
    }
}
const updateCoursesToDb = async (courses) => {
    try {
        await sequelize.sync();
        const dbCourses = await db.courses.getAllCourses();
        const dbCourseIds = dbCourses.map(course => course.id);
        if (courses) {
            return await Promise.all(
                courses.map(async (course) => {
                    if (dbCourseIds.includes(course.id)) {
                        const dbCourse = dbCourses.find(item => item.id === course.id);
                        await handleCancellations(dbCourse, dbCourse.teachingSession, course.teachingSession);
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
            console.error(`No courses available from Grynos.`);
        }
    } catch (error) {
        console.error(`Failed to update courses to database: ${error}`);
    }

}

const updateSinglePaymentTickets = async (dbCourse, course) => {
    dbCourse.single_payment_count = course.single_payment_count;
    return models.courses.update(
        { single_payment_count: course.single_payment_count },
        { returning: true, where: { id: course.id } }
    ).then(function ([rowsUpdate, [updatedCourse]]) {
        return updatedCourse;
    }).catch(error => {
        console.log('failed to update single payment tickets', error);
        throw error;
    });
}

const handleCancellations = async (course, existingTeachingSessions, newTeachingSessions) => {
    try {
        for (let existingSession of existingTeachingSessions) {
            const newSession = newTeachingSessions.find(item => item.id === existingSession.dataValues.eventId);
            if (newSession && newSession.status === -2 && existingSession.dataValues.status !== newSession.status) {
                console.log('Going to cancel reservation for event', existingSession.dataValues.eventId);
                const reservations = await db.reservations.getReservationsByEventId(existingSession.dataValues.eventId);
                if (reservations) {
                    await cancelReservations(reservations);
                }
                console.log('Cancelling event', newSession.id);
                return models.events.update(
                    { status: -2 },
                    { returning: true, where: { id: newSession.id } });
            }
        }
    } catch (error) {
        console.log('Failed to handleCancellations', error);
    }
};

const cancelReservations = async (reservations) => {
    try {
        for (let reservation of reservations) {
            console.log((new Date).toISOString() + ' Executing cancel reservation for reservation', reservation.dataValues.id);
            await db.reservations.cancelReservation(reservation.dataValues.id);
            const [message, dbUser] = await Promise.all([services.sms.buildCancellationMessage(reservation.dataValues), db.users.getUserById(reservation.dataValues.userId)]);
            const response = await services.sms.sendMessageToUser(
                dbUser,
                message
            );
        }
    } catch (error) {
        console.log('cancelling reservation failed', error);
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
