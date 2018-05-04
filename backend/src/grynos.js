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
    const [response] = await Promise.all([
        axios(url),
        db.sync({ force: true }),
    ]);
    return response.data.course.map(mapCourseFromGrynos);
};

const updateCoursesToDb = () => {
    try {
        const courses = fetchCourses();
        courses.forEach((course) => {
            models.courses.create(course, {
                include: [
                    { model: models.locations, as: 'location' },
                    { model: models.events, as: 'teachingSession' },
                ],
            });
        });
    } catch (error) {
        console.error('Failed to fetch course from Gryros ', error);
    }
};

module.exports = { mapCourseFromGrynos, fetchCourses, updateCoursesToDb };
