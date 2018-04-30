const courses = require('./courses');
const events = require('./events');
const models = require('../models');
const db = require('../sequalize_pg');

const getReservations = async (userId) => {
    const data = await models.reservations.findAll({
        where: { userId },
    });
    return await Promise.all(
        data.map((reservation) => getReservationById(reservation.id))
    );
};

const getReservationById = async (id) => {
    const reservation = await models.reservations.find({
        where: { id },
    });
    if (reservation === null) {
        throw new Error('Reservation could not be found!');
    }
    const course = await courses.getCourseById(reservation.courseId);
    const event = await events.getEventById(reservation.eventId);
    const response = {
        id: reservation.id,
        userId: reservation.userId,
        ticketType: reservation.ticketType,
        ticketPrice: reservation.ticketPrice,
        bookingStatus: reservation.bookingStatus,
        courseName: course[0].dataValues.name,
        location: course[0].dataValues.location[0].dataValues.location,
        startDate: event[0].dataValues.startDate,
        endDate: event[0].dataValues.endDate,
        teachingPlace: event[0].dataValues.teachingplace,
    };
    return response;
};

const getReservationCount = (eventId) => {
    return models.reservations.findAndCountAll({
        where: { eventId },
    });
};

const getReservationForEvent = (eventId, userId) => {
    return models.reservations.find({
        where: { eventId, userId },
    });
};

const cancelReservation = async (reservationId) => {
    return await models.reservations
        .update(
            {
                bookingStatus: 0,
            },
            {
                where: { id: reservationId },
            }
        )
        .then(async () => {
            const reservation = await getReservationById(reservationId);
            const userId = reservation.userId;
            const balance =
                (await getUserBalance(userId)) + reservation.ticketPrice;
            updateUserBalance(userId, balance);
        });
};

const createReservation = async (reservation) => {
    return await models.reservations
        .create(reservation)
        .then(async (createReservation) => {
            const userId = createReservation.userId;
            const balance =
                (await getUserBalance(userId)) - createReservation.ticketPrice;
            await updateUserBalance(userId, balance);
            return createReservation;
        });
};

const updateUserBalance = (userId, balance) => {
    return models.users.update(
        {
            balance,
        },
        {
            where: { id: userId },
        }
    );
};

const getUserBalance = (userId) => {
    return models.users
        .find({
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
    getReservations,
    getReservationById,
    getReservationCount,
    getReservationForEvent,
    createReservation,
    cancelReservation,
    getUserBalance,
    updateUserBalance,
};
