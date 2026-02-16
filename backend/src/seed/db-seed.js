const data = require('./mockdata.js').courses;
const sequelize = require('../sequalize_pg');
const models = require('../models');
const logger = require('../utils/logging');
const mapCourseFromGrynos = require('../grynos').mapCourseFromGrynos;
const database = require('../db');
const loadMockCoursesToDatabase = async () => {
    try {
        logger.log('Seed', 'Updating mock data to db');
        await sequelize.sync();
        const dbCourses = await database.courses.getAllCourses();
        const dbCourseIds = dbCourses.map(course => course.id);
        if (data.course) {
            await Promise.all(
                data.course.map(mapCourseFromGrynos).map(async (course) => {
                    if (dbCourseIds.includes(course.id)) {
                        const dbCourse = dbCourses.find(item => item.id === course.id);
                        const locationId = dbCourse.location && dbCourse.location.length > 0 ? dbCourse.location[0].dataValues.id : null;
                        dbCourse.update(course);

                        for (let teachingSession of course.teachingSession) {
                            const session = await database.events.getEventById(teachingSession.id);
                            if (session) {
                                await session.update(teachingSession);
                            } else {
                                teachingSession.courseId = dbCourse.id;
                                await models.events.create(teachingSession);
                            }
                        }

                        if (locationId && course.location.length > 0) {
                            const location = await database.locations.getLocationById(locationId);
                            if (location) {
                                await location.update({ ...course.location[0] });

                            }
                        }
                    }
                    else {
                        await models.courses.create(course, {
                            include: [
                                { model: models.events, as: 'teachingSession' },
                                { model: models.locations, as: 'location' },
                            ],
                        });
                    }

                })
            );
        } else {
            logger.error('Seed', 'No courses available from mock data.');
        }
    } catch (error) {
        logger.error('Seed', `Failed to fetch course from mock data: ${error}`);
    }
};

module.exports = { loadMockCoursesToDatabase };
