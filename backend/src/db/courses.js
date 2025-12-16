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
                    'address', 'id'],
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
                    status: 0

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
                attributes: [
                    ['path', 'location'],
                    'address',
                    'id'],
            },
            {
                model: models.events,
                as: 'teachingSession',
                attributes: [
                    ['id', 'eventId'],
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                    'teachingplace',
                    'status'
                ],
                where: {
                    status: 0
                }
            },
        ],

        validate: false,
    });
};
const getCourseById = (id) => {
    return models.courses.findOne({
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
                    'status'
                ],
                where: {
                    status: 0
                }
            },
        ],
        where: {
            id,
        },
        validate: false,
    });
};

const reduceCoursesByDate = async courses => {
    const mappedCourses =
        courses
            .filter(course => course.teachingSession[0]) // Removes courses that doesn't have any teaching sessions
            .map((course) => {
                return {
                    id: course.id,
                    name: course.name,
                    code: course.code,
                    priceMaterial: course.priceMaterial,
                    description: course.description,
                    minStudentCount: course.minStudentCount,
                    maxStudentCount: course.maxStudentCount,
                    acceptedCount: course.acceptedCount,
                    internetEnrollment: course.internetEnrollment,
                    firstEnrollmentDate: course.firstEnrollmentDate ? course.firstEnrollmentDate.toString() : null,
                    lastEnrollmentDate: course.lastEnrollmentDate ? course.lastEnrollmentDate.toString() : null,
                    firstSessionWeekDay: course.firstSessionWeekDay,
                    firstSessionDate: course.firstSessionDate ? course.firstSessionDate.toString() : null,
                    lastSessionDate: course.lastSessionDate ? course.lastSessionDate.toString() : null,
                    single_payment_count: course.single_payment_count,
                    company_name: course.company_name,
                    course_type_id: course.course_type_id,
                    course_type_name: course.course_type_name,
                    teacher: course.teacher,
                    location: course.location[0] ? course.location[0].dataValues.location : null,
                    address: course.location[0] ? course.location[0].dataValues.address : null,
                    teachingSession: course.teachingSession,
                }
            });
    const updatedCourses = await Promise.all(mappedCourses.map(async course => {
        const teachingSession = await Promise.all(course.teachingSession.map(async session => {
            const reservedCount = await reservations.getReservationCount(
                session.dataValues.eventId
            );
            session.dataValues.reservedCount = reservedCount.count;
            return session.dataValues;
        }));
        return {
            ...course,
            teachingSession
        }
    }));

    const reducedCourses = updatedCourses.reduce((obj, course) => {
        const teachingSessions = course.teachingSession.sort((a, b) => datefns.compareDesc(a.startDate, b.startDate));
        for (let teachingSession of teachingSessions) {
            if (teachingSession) {
                const courseToAdd = {
                    ...course
                }
                const price = utils.courses.getCoursePrice(
                    courseToAdd.course_type_id,
                    teachingSession.startDate.toString()
                );
                const date = datefns.format(teachingSession.startDate.toString(), 'MM-DD-YYYY');
                obj[date] = obj[date] || [];
                delete courseToAdd.teachingSession;
                courseToAdd.eventId = teachingSession.eventId;
                courseToAdd.startDate = teachingSession.startDate.toString();
                courseToAdd.endDate = teachingSession.endDate.toString();
                courseToAdd.price = price;
                courseToAdd.reservedCount = teachingSession.reservedCount;
                courseToAdd.status = teachingSession.status;
                obj[date].push(courseToAdd);
            }
        }
        return obj;
    }, {});
    for (let date in reducedCourses) {
        let courses = reducedCourses[date];
        courses = courses.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        reducedCourses[date] = courses;
    }
    return reducedCourses;
};

module.exports = {
    getCourses,
    getAllCourses,
    reduceCoursesByDate,
    getCourseById,
};
