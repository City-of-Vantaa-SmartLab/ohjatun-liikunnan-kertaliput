import stringInterpolator from 'interpolate';
import dateFns from 'date-fns';

export const getErrorDetail = (course, errorMessages) => {
    if (!course || !course.reasons || course.reasons.length === 0) return;
    const type = course.reasons[0];
    const {
        openTime,
        closeTime,
        resource,
        auth,
        reserved,
        noTickets,
    } = errorMessages;

    if (type === 'reserved')
        return {
            longMessage: reserved.longMessage,
            shortMessage: reserved.shortMessage,
            colorCode: 'green',
            type,
        };
    if (type === 'openTime')
        return {
            longMessage: stringInterpolator(openTime.longMessage, {
                date: dateFns.format(
                    dateFns.subDays(course.startDate, 3),
                    'DD.MM'
                ),
                time: dateFns.format(course.startDate, 'HH:mm'),
            }),
            shortMessage: openTime.shortMessage,
            colorCode: 'errorReservationTime',
            type,
        };
    if (type === 'closingTime')
        return {
            longMessage: stringInterpolator(closeTime.longMessage, {
                numberOfFreeSeats:
                    course.single_payment_count - course.reservedCount,
            }),
            shortMessage: closeTime.shortMessage,
            colorCode: 'errorReservationTime',
            type,
        };
    if (type === 'noTickets')
        return {
            longMessage: noTickets.longMessage,
            shortMessage: noTickets.shortMessage,
            colorCode: 'errorReservationNoTicket',
            type,
        };
    if (type === 'resource')
        return {
            longMessage: resource.longMessage,
            shortMessage: resource.shortMessage,
            colorCode: 'errorReservationResource',
            type,
        };
    if (type === 'auth')
        return {
            longMessage: auth.longMessage,
            shortMessage: auth.shortMessage,
            colorCode: 'errorReservationAuth',
            type,
        };
};
