const models = require('../models');
const datefns = require('date-fns');
const Sequelize = require('sequelize');
const reservations = require('./reservations');
const utils = require('../utils');
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
            'single_payment_count',
            'company_name',
            'course_type_id',
            'course_type_name',
            'teacher',
        ],
        include: [
            {
                model: models.locations,
                as: 'location',
                attributes: [['path', 'location'],
                    'address'],
            },
            {
                model: models.events,
                as: 'teachingSession',
                attributes: [
                    ['id', 'eventId'],
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                    'teachingplace',
                ],
                where: {
                    start: { [Op.between]: [startDate, endDate] },
                },
            },
        ],

        validate: false,
    });
};

const getAllCourses = () => {
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
            'single_payment_count',
            'company_name',
            'course_type_id',
            'course_type_name',
            'teacher',
        ],
        include: [
            {
                model: models.locations,
                as: 'location',
                attributes: [['path', 'location'],
                    'address'],
            },
            {
                model: models.events,
                as: 'teachingSession',
                attributes: [
                    ['id', 'eventId'],
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                    'teachingplace',
                ],
            },
        ],

        validate: false,
    });
};
const getCourseById = (id) => {
    return models.courses.find({
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
            'single_payment_count',
            'company_name',
            'course_type_id',
            'course_type_name',
            'teacher',
        ],
        include: [
            {
                model: models.locations,
                as: 'location',
                attributes: [['path', 'location'],
                    'address'],
            },
            {
                model: models.events,
                as: 'teachingSession',
                attributes: [
                    ['id', 'eventId'],
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                    'teachingplace',
                ],
            },
        ],
        where: {
            id,
        },
        validate: false,
    });
};

const reduceCoursesByDate = async (courses) => {
    const mappedCourses = await Promise.all(
        courses
            .filter((course) => course.teachingSession[0]) // Removes courses that doesn't have any teaching sessions
            .map(async (course) => {
                const reservedCount = await reservations.getReservationCount(
                    course.teachingSession[0].dataValues.eventId
                );
                const price = utils.courses.getCoursePrice(
                    course.course_type_id,
                    course.teachingSession[0].dataValues.startDate
                );
                return await {
                    id: course.id,
                    name: course.name,
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
                    single_payment_count: course.single_payment_count,
                    company_name: course.company_name,
                    course_type_id: course.course_type_id,
                    course_type_name: course.course_type_name,
                    teacher: course.teacher,
                    location: course.location[0].dataValues.location,
                    address: course.location[0].dataValues.address,
                    eventId: course.teachingSession[0].dataValues.eventId,
                    startDate: course.teachingSession[0].dataValues.startDate,
                    endDate: course.teachingSession[0].dataValues.endDate,
                    price: price,
                    reservedCount: reservedCount.count,
                };
            })
    );
    return await mappedCourses.reduce((obj, course) => {
        const date = datefns.format(course.startDate, 'MM-DD-YYYY');
        obj[date] = obj[date] || [];
        obj[date].push(course);
        return obj;
    }, {});
};

module.exports = {
    getCourses,
    getAllCourses,
    reduceCoursesByDate,
    getCourseById,
};
