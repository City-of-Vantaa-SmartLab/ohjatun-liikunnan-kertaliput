const db = require('./sequalize_pg');
const axios = require('axios');
const models = require('./models');

const url = process.env.GRYNOS_COURSE_API_URL;

const mapCourseFromGrynos = (course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
    description: course.description,
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
});

const fetchCourses = async () => {
    const response = await axios(url);
    if (response.data.course) {
        return response.data.course.map(mapCourseFromGrynos);
    }
};

const updateCoursesToDb = async () => {
    try {
        const courses = await fetchCourses();
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

module.exports = { mapCourseFromGrynos, fetchCourses, updateCoursesToDb };
