const courses = require('./courses');
const events = require('./events');
const models = require('../models');
const db = require('../sequalize_pg');

const getReservations = async (userId) => {
    return await models.reservations.findAll({
        where: { userId },
    });
};
// TODO: Can't we join tables and find from that table here?
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
        courseId: course.id,
        userId: reservation.userId,
        ticketType: reservation.ticketType,
        ticketPrice: reservation.ticketPrice,
        bookingStatus: reservation.bookingStatus,
        courseName: course.name,
        location: course.location[0].dataValues.location,
        startDate: event.dataValues.startDate,
        endDate: event.dataValues.endDate,
        teachingPlace: event.teachingplace,
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
