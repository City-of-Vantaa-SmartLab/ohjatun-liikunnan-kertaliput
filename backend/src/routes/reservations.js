const express = require('express');
const router = express.Router();
const auth = require('../auth');
const db = require('../db');
const utils = require('../utils');
const services = require('../services');
const datefns = require('date-fns');
const eventReservationLimit = process.env.EVENT_RESERVATION_LIMIT || 5;
const i18n = require('../i18n').i18n();
const { formatToTimeZone } = require('date-fns-timezone');
const format = 'YYYY-MM-DD HH:mm:ss.SSS [GMT]Z (z)';

const getReservationsByUser = async (req, res) => {
    try {
        const user = req.user;
        const dbuser = await db.users.getUser(user.phoneNumber);
        const reservations = await db.reservations.getReservationsByUser(
            dbuser.id
        );
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json(`Failed to get reservation.`);
    }
};

const getAllReservations = async (req, res) => {
    try {
        const reservations = await db.reservations.getAllReservations();
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json(`Failed to get reservation.`);
    }
};

const getReservationCountForEvents = async (req, res) => {
    try {
        const eventReservations = await db.reservations.getReservationCountForEvents();
        res.status(200).json(eventReservations);
    } catch (err) {
        res.status(500).json(`Failed to get reservation count for events.`);
    }
};

const formatDate = (date) => {
    date = formatToTimeZone(date, format, { timeZone: 'Europe/Helsinki' });
    return datefns.format(date, i18n.reservations.dateFormat);
};

const createReservation = async (req, res) => {
    try {
        const reservationObj = req.body;
        const user = req.user;
        const validationErrors = utils.reservations.validateReservationRequest(
            reservationObj
        );
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            // Gets User Id
            const dbUser = await db.users.getUser(user.phoneNumber);
            reservationObj.userId = dbUser.id;

            // Gets ticket price for the course
            const course = await db.courses.getCourseById(
                reservationObj.courseId
            );

            //Calculate ticket price
            reservationObj.ticketPrice = utils.courses.getCoursePrice(
                course.course_type_id,
                course.teachingSession[0].dataValues.startDate
            );

            // Check whether the user have enough saldo/balance
            const notEnoughBalance = utils.reservations.checkBalance(
                dbUser.balance,
                reservationObj.ticketPrice
            );

            // Check whether already the limit for the particular event has reached.
            const existingReservations = await db.reservations.getReservationCount(
                reservationObj.eventId
            );
            const bookingLimitReached = utils.reservations.checkBookingLimit(
                existingReservations.count,
                eventReservationLimit
            );

            // Check whether the same event has been already reserverd by the user.
            const existingEvent = await db.reservations.getReservationForEvent(
                reservationObj.eventId,
                reservationObj.userId
            );

            if (existingEvent) {
                return res
                    .send(422)
                    .json(i18n.reservations.errorMessages.eventExists);
            }

            if (bookingLimitReached) {
                return res.status(400).json(bookingLimitReached);
            }
            if (notEnoughBalance) {
                return res.status(422).json(notEnoughBalance);
            }

            await db.reservations.createReservation(reservationObj);

            // Get the event details to be sent to user in the reservation SMS.
            const event = await db.events.getEventById(reservationObj.eventId);
            const startDate = formatDate(event.dataValues.startDate);

            const message = `${i18n.reservations.confirmationMessage} ${
                course.name
                }.\n${startDate}\n${event.dataValues.teachingplace}`;

            const response = await services.sms.sendMessageToUser(
                dbUser,
                message
            );
            res.status(201).json(reservationObj);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(`Failed to create reservation`);
    }
};

const cancelReservation = async (req, res) => {
    try {
        const reservationId = Number(req.params.id);
        const validationErrors = utils.reservations.validateReservationId(
            reservationId
        );
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            await db.reservations.cancelReservation(reservationId);
            res.status(200).json('Reservation cancelled successfully');
        }
    } catch (err) {
        res
            .status(500)
            .json(`Failed to cancel reservation. Error: ${err.message}`);
    }
};

router.get('/', auth.requireAuth, getReservationsByUser);
router.get('/all', auth.requireAuth, getAllReservations);
router.get('/reserved-events', auth.requireAuth, getReservationCountForEvents);
router.post('/', auth.requireAuth, createReservation);
router.post('/cancel/:id', auth.requireAuth, cancelReservation);

module.exports = router;
