const express = require('express');
const router = express.Router();
const auth = require('../auth');
const db = require('../db');
const utils = require('../utils');
const eventReservationLimit = process.env.EVENT_RESERVATION_LIMIT || 5;
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
            const event = await db.reservations.getReservationForEvent(
                reservationObj.eventId,
                reservationObj.userId
            );

            if (bookingLimitReached) {
                res.status(400).json(bookingLimitReached);
            } else if (notEnoughBalance) {
                res.status(422).json(notEnoughBalance);
            } else if (event) {
                res
                    .status(422)
                    .json(
                        'You have already made a reservation for the same event!. Try for another event.'
                    );
            } else {
                const reservation = await db.reservations.createReservation(
                    reservationObj
                );
                res.status(201).json(reservation);
            }
        }
    } catch (err) {
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
