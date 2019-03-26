const users = require('./users');
const courses = require('./courses');
const events = require('./events');
const validateReservationRequest = (reservationRequest) => {
    const eventId = reservationRequest.eventId;
    const courseId = reservationRequest.courseId;

    const eventIdError = events.validateEventId(eventId);

    if (eventIdError) {
        return eventIdError;
    }

    const courseIdError = courses.validateCourseId(courseId);

    if (courseIdError) {
        return courseIdError;
    }
};

const validateBookingStatus = (bookingStatus) => {
    if (typeof bookingStatus !== 'number' || bookingStatus) {
        return 'booking status is not valid';
    }
};

const validateTicketPrice = (ticketPrice) => {
    if (typeof ticketPrice !== 'number' || ticketPrice <= 0) {
        return 'Ticket Price is not valid';
    }
};

const validateTicketType = (ticketType) => {
    if (
        typeof ticketType !== 'string' ||
        !['Single_Ticket'].includes(ticketType)
    ) {
        return 'Ticket Type is not valid';
    }
};

const checkBalance = (balance, ticketPrice) => {
    if (balance < ticketPrice) {
        return 'You dont have enough balance to make this reservation.';
    }
};

const checkBookingLimit = (count, limit) => {
    if (count === limit) {
        return 'Tunti ehti täyttyä. Tutustu muuhun tuntitarjontaamme.';
    }
};

const validateReservationId = (reservationId) => {
    if (typeof reservationId !== 'number' || isNaN(reservationId)) {
        return 'Reservation Id is not valid';
    }
};

module.exports = {
    validateReservationRequest,
    validateBookingStatus,
    validateTicketPrice,
    validateTicketType,
    checkBalance,
    checkBookingLimit,
    validateReservationId,
};
