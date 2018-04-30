const models = require('../models');
const datefns = require('date-fns');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getCourses = (startDate, endDate) => {
    return models.courses.findAll({
        attributes: [
            'id',
            'name',
            'code',
            'price',
            'priceMaterial',
            'description',
            'minStudentCount',
            'maxStudentCount',
            'acceptedCount',
            'firstEnrollmentDate',
            'lastEnrollmentDate',
            'firstSessionWeekDay',
            'firstSessionDate',
            'lastSessionDate',
            'internetEnrollment',
        ],
        include: [
            {
                model: models.locations,
                as: 'location',
                attributes: [['path', 'location']],
            },
            {
                model: models.events,
                as: 'teachingSession',
                attributes: [
                    ['id', 'eventId'],
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                ],
                where: {
                    start: { [Op.between]: [startDate, endDate] },
                },
            },
        ],

        validate: false,
    });
};

const getCourseById = (id) => {
    return models.courses.findAll({
        attributes: [
            'id',
            'name',
            'code',
            'price',
            'priceMaterial',
            'description',
            'minStudentCount',
            'maxStudentCount',
            'acceptedCount',
            'firstEnrollmentDate',
            'lastEnrollmentDate',
            'firstSessionWeekDay',
            'firstSessionDate',
            'lastSessionDate',
            'internetEnrollment',
        ],
        include: [
            {
                model: models.locations,
                as: 'location',
                attributes: [['path', 'location']],
            },
            {
                model: models.events,
                as: 'teachingSession',
                attributes: [
                    ['id', 'eventId'],
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                ],
            },
        ],
        where: {
            id,
        },
        validate: false,
    });
};

const reduceCoursesByDate = (courses) => {
    return courses
        .filter((course) => course.location[0])
        .filter((course) => course.teachingSession[0])
        .map((course) => ({
            id: course.id,
            name: course.name,
            price: course.price,
            code: course.code,
            priceMaterial: course.priceMaterial,
            description: course.description,
            minStudentCount: course.minStudentCount,
            maxStudentCount: course.maxStudentCount,
            acceptedCount: course.acceptedCount,
            internetEnrollment: course.internetEnrollment,
            firstEnrollmentDate: course.firstEnrollmentDate,
            lastEnrollmentDate: course.lastEnrollmentDate,
            firstSessionWeekDay: course.firstSessionWeekDay,
            firstSessionDate: course.firstSessionDate,
            lastSessionDate: course.lastSessionDate,
            location: course.location[0].dataValues.location,
            eventId: course.teachingSession[0].dataValues.eventId,
            startDate: course.teachingSession[0].dataValues.startDate,
            endDate: course.teachingSession[0].dataValues.endDate,
        }))
        .reduce((obj, course) => {
            const date = datefns.format(course.startDate, 'MM-DD-YYYY');
            obj[date] = obj[date] || [];
            obj[date].push(course);
            return obj;
        }, {});
};

module.exports = { getCourses, reduceCoursesByDate, getCourseById };
