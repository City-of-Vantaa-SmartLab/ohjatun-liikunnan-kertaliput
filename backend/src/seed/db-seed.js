const data = require('./mockdata.js').courses;
const db = require('../sequalize_pg');
const models = require('../models');
const mapCourseFromGrynos = require('../grynos').mapCourseFromGrynos;

const loadMockCoursesToDatabase = async () => {
    try {
        await db.sync({ force: true });
        await Promise.all(
            data.course.map(mapCourseFromGrynos).map((course) => {
                return models.courses.create(course, {
                    include: [
                        { model: models.locations, as: 'location' },
                        { model: models.events, as: 'teachingSession' },
                    ],
                });
            })
        );
    } catch (error) {
        console.log('Oh no! Something went wrong! ', error);
    }
};

module.exports = { loadMockCoursesToDatabase };
