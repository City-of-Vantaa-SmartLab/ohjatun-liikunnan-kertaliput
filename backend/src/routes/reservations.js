const express = require('express');
const router = express.Router();
const auth = require('../auth');
const db = require('../db');
const utils = require('../utils');
const services = require('../services');
const datefns = require('date-fns');
const eventReservationLimit = process.env.EVENT_RESERVATION_LIMIT || 5;
const i18n = require('../i18n').i18n();
const getReservations = async (req, res) => {
    try {
        const user = req.user;
        const dbuser = await db.users.getUser(user.phoneNumber);
        const reservations = await db.reservations.getReservations(dbuser.id);
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json(`Failed to get reservation.`);
    }
};
const formatDate = (date) => datefns.format(date, i18n.reservations.dateFormat);
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
            reservationObj.ticketPrice = course.price;

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
                res.send(422).json(i18n.reservations.errorMessages.eventExists);
                return;
            }

            if (bookingLimitReached) {
                res.status(400).json(bookingLimitReached);
                return;
            }
            if (notEnoughBalance) {
                res.status(422).json(notEnoughBalance);
                return;
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
            res.status(201).json('Created reservation successfully');
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

router.get('/', auth.requireAuth, getReservations);
router.post('/', auth.requireAuth, createReservation);
router.post('/cancel/:id', auth.requireAuth, cancelReservation);

module.exports = router;
