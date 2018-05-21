const sequelize = require('./sequalize_pg');
const axios = require('axios');
const models = require('./models');
const db = require('./db');

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
});

const mapCourseDetailsFromGrynos = async (course) => {
    const courseDetails = await axios(courseDetailUrl + course.code);
    return {
        ...course,
        description: courseDetails.data.description,
        single_payment_count: courseDetails.data.singlePaymentCount,
        company_name: courseDetails.data.companyName,
        course_type_id: courseDetails.data.courseTypeID,
        course_type_name: courseDetails.data.courseTypeName,
        teacher: courseDetails.data.teacher,
    };
};

const fetchCoursesFromGrynos = async () => {
    const response = await axios(url);
    if (response.data.course) {
        return await Promise.all(
            response.data.course
                .map(mapCourseFromGrynos)
                .map(mapCourseDetailsFromGrynos)
        );
    }
};

const updateCoursesToDb = async () => {
    try {
        await sequelize.sync();
        let courses = await fetchCoursesFromGrynos();
        const dbCourses = await db.courses.getAllCourses();

        courses = courses.filter(
            (course) => !dbCourses.find((dbCourse) => course.id === dbCourse.id)
        );

        if (courses) {
            return await Promise.all(
                courses.map((course) => {
                    return models.courses.create(course, {
                        include: [
                            { model: models.locations, as: 'location' },
                            { model: models.events, as: 'teachingSession' },
                        ],
                    });
                })
            );
        } else {
            console.error(`No courses available from Grynos.`);
        }
    } catch (error) {
        console.error(`Failed to fetch course from Gryros: ${error.message}`);
    }
};

module.exports = {
    mapCourseFromGrynos,
    fetchCoursesFromGrynos,
    updateCoursesToDb,
};
