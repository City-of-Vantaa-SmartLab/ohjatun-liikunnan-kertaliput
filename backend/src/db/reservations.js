const courses = require('./courses');
const events = require('./events');
const models = require('../models');
const db = require('../sequalize_pg');
const Sequelize = require('sequelize');

const getReservationsByUser = async (userId) => {
    return await models.reservations.findAll({
        include: [
            {
                model: models.courses,
                attributes: ['name', 'price', 'id', 'description'],
            },
            {
                model: models.events,
                attributes: [
                    'id',
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                    'teachingplace',
                ],
            },
        ],
        where: { userId },
    });
};

const deleteReservationById = async (reservationId) => {
    return await models.reservations.destroy({
        where: { id: reservationId },
    });
};

const getAllReservations = async () => {
    return await models.reservations.findAll({
        include: [
            {
                model: models.courses,
                attributes: ['name', 'price', 'id', 'description'],
            },
            {
                model: models.events,
                attributes: [
                    'id',
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                    'teachingplace',
                ],
            },
        ],
    });
};
// TODO: Can't we join tables and find from that table here?
const getReservationById = async (id) => {
    const reservation = await models.reservations.findOne({
        include: [
            {
                model: models.courses,
                attributes: ['name', 'price', 'id', 'description'],
            },
            {
                model: models.events,
                attributes: [
                    'id',
                    ['start', 'startDate'],
                    ['end', 'endDate'],
                    'teachingplace',
                ],
            },
        ],
        where: { id },
    });
    if (reservation === null) {
        throw new Error('Reservation could not be found!');
    }
    const response = {
        id: reservation.id,
        courseId: reservation.course.id,
        userId: reservation.userId,
        eventId: reservation.event.dataValues.id,
        ticketType: reservation.ticketType,
        ticketPrice: reservation.ticketPrice,
        bookingStatus: reservation.bookingStatus,
        courseName: reservation.course.name,
        location: reservation.event.teachingplace,
        startDate: reservation.event.dataValues.startDate,
        endDate: reservation.event.dataValues.endDate,
        teachingPlace: reservation.event.dataValues.teachingplace,
    };
    return response;
};

const getReservationCount = (eventId) => {
    return models.reservations.findAndCountAll({
        where: { eventId },
    });
};

const getReservationForEvent = (eventId, userId) => {
    return models.reservations.findOne({
        where: { eventId, userId },
    });
};

const getReservationsByEventId = (eventId) => {
    return models.reservations.findAll({
        where: { eventId },
    });
};

const getReservationCountForEvents = (eventId) => {
    return models.reservations.findAll({
        attributes: [
            'eventId',
            Sequelize.fn('count', Sequelize.col('eventId')),
        ],
        group: ['reservations.eventId'],
    });
};

const cancelReservation = async (reservationId) => {
    return db.transaction(async (transaction) => {
        return await models.reservations
            .update(
                {
                    bookingStatus: 0,
                },
                {
                    where: { id: reservationId },
                    transaction,
                }
            )
            .then(async () => {
                const reservation = await getReservationById(reservationId);
                const userId = reservation.userId;
                const balance =
                    (await getUserBalance(userId)) + reservation.ticketPrice;
                await updateUserBalance(userId, balance, transaction);
            });
    });
};

const createReservation = async (reservation) => {
    return db.transaction(async (transaction) => {
        return await models.reservations
            .create(reservation, { transaction })
            .then(async (createReservation) => {
                const userId = createReservation.userId;
                const balance =
                    (await getUserBalance(userId)) -
                    createReservation.ticketPrice;
                await updateUserBalance(userId, balance, transaction);
                return createReservation;
            });
    });
};

const updateUserBalance = (userId, balance, transaction) => {
    return models.users.update(
        {
            balance,
        },
        {
            where: { id: userId },
            transaction,
        }
    );
};

const getUserBalance = (userId) => {
    return models.users
        .findOne({
            attributes: ['balance'],
            where: { id: userId },
        })
        .then((user) => {
            if (user !== null) {
                return user.balance;
            } else {
                throw new Error('User does not exist!');
            }
        });
};

module.exports = {
    getAllReservations,
    getReservationsByUser,
    getReservationById,
    getReservationCount,
    getReservationForEvent,
    getReservationsByEventId,
    createReservation,
    cancelReservation,
    getUserBalance,
    updateUserBalance,
    getReservationCountForEvents,
    deleteReservationById
};
