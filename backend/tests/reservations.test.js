const db = require('../src/db');
const utils = require('../src/utils');

describe('Reservation Testing', () => {
    let reservation = {
        courseId: 1,
        eventId: 1,
        ticketType: 'Single_Ticket',
        ticketPrice: 90.5,
        bookingStatus: 1,
    };

    const user = {
        username: 'test user',
        phoneNumber: '+3581234535',
        pin: 1234,
    };

    let reservationId = 1;
    const defaultBalance = 100;

    test('Should be able to create a reservations', async () => {
        await db.users.createUser(user).then((createdUser) => {
            reservation.userId = createdUser.id;
        });
        const dbReservation = await db.reservations.createReservation(
            reservation
        );
        reservationId = dbReservation.dataValues.id;
        expect(dbReservation.dataValues.userId).toEqual(reservation.userId);
        expect(dbReservation.dataValues.ticketPrice).toEqual(
            reservation.ticketPrice
        );
        expect(dbReservation.dataValues.bookingStatus).toEqual(
            reservation.bookingStatus
        );

        const dbUser = await db.users.getUserById(reservation.userId);
        expect(dbUser.balance).toEqual(
            defaultBalance - reservation.ticketPrice
        );
    });

    test('Should be able to cancel a reservations', async () => {
        const cancelledStatus = 0;
        await db.reservations.cancelReservation(reservationId);
        const cancelledReservation = await db.reservations.getReservationById(
            reservationId
        );
        expect(cancelledReservation.userId).toEqual(reservation.userId);
        expect(cancelledReservation.ticketPrice).toEqual(
            reservation.ticketPrice
        );
        expect(cancelledReservation.bookingStatus).toEqual(cancelledStatus);

        const dbUser = await db.users.getUserById(reservation.userId);
        expect(dbUser.balance).toEqual(defaultBalance);
    });

    test('Should be able to get all the reservations for a user', async () => {
        const cancelledStatus = 0;
        const reservations = await db.reservations.getReservations(
            reservation.userId
        );
        expect(reservations[0].userId).toEqual(reservation.userId);
        expect(reservations[0].ticketPrice).toEqual(reservation.ticketPrice);
        expect(reservations[0].bookingStatus).toEqual(cancelledStatus);
    });

    test('Should validate Booking Status', () => {
        const error = 'booking status is not valid';
        expect(utils.reservations.validateBookingStatus(1)).toEqual(error);
        expect(utils.reservations.validateBookingStatus(12)).toEqual(error);
        expect(utils.reservations.validateBookingStatus('12')).toEqual(error);
        expect(utils.reservations.validateBookingStatus(0)).toBeUndefined();
        expect(utils.reservations.validateBookingStatus('0')).toEqual(error);
        expect(utils.reservations.validateBookingStatus('true')).toEqual(error);
        expect(utils.reservations.validateBookingStatus('false')).toEqual(
            error
        );
    });

    test('Should validate Ticket Price', async () => {
        const error = 'Ticket Price is not valid';
        expect(utils.reservations.validateTicketPrice(0)).toEqual(error);
        expect(utils.reservations.validateTicketPrice('0')).toEqual(error);
        expect(utils.reservations.validateTicketPrice('1')).toEqual(error);
        expect(utils.reservations.validateTicketPrice('12')).toEqual(error);
        expect(utils.reservations.validateTicketPrice(-1)).toEqual(error);
        expect(utils.reservations.validateTicketPrice(10)).toBeUndefined();
    });

    test('Should validate Ticket Type', async () => {
        const error = 'Ticket Type is not valid';
        expect(
            utils.reservations.validateTicketType('Seasonal_Ticket')
        ).toEqual(error);
        expect(utils.reservations.validateTicketType(123)).toEqual(error);
        expect(
            utils.reservations.validateTicketType('Single_Ticket')
        ).toBeUndefined();
    });
});
