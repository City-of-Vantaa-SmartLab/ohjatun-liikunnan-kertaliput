const axios = require('axios');
const i18n = require('../i18n').i18n();
const db = require('../db');
const datefns = require('date-fns');
const { formatToTimeZone } = require('date-fns-timezone');
const format = 'YYYY-MM-DD HH:mm:ss.SSS [GMT]Z (z)';

const teliaEndPoint = 'https://ws.mkv.telia.fi/restsms/lekabrest/send';
const teliaUsername = process.env.TELIA_USERNAME;
const teliaPassword = process.env.TELIA_PASSWORD;
const teliaUser = process.env.TELIA_USER;

const formatDate = (date) => {
    const formattedDate = formatToTimeZone(date, format, { timeZone: 'Europe/Helsinki' });
    return datefns.format(formattedDate, i18n.reservations.dateFormat);
};

const sendMessageToUser = async (user, message) => {
    try {
        const phoneNumber = user.phoneNumber;
        console.log(
            `Sending SMS for user ${user.username} to number ${phoneNumber}`
        );
        const request = generateTeliaMessageRequest(phoneNumber, message);
        const response = await axios.post(teliaEndPoint, request);
        if (response && response.data.accepted[0].to === phoneNumber.slice(1)) {
            return response;
        }
    } catch (error) {
        console.log(`Failed to send SMS to the User: ${error.message}`);
    }
};

const generateTeliaMessageRequest = (phoneNumber, message) => {
    return {
        username: teliaUsername,
        password: teliaPassword,
        from: teliaUser,
        to: [phoneNumber],
        message: message,
    };
};

const buildCancellationMessage = async (reservation) => {
    const [event, course] = await Promise.all([
        db.events.getEventById(reservation.eventId),
        db.courses.getCourseById(reservation.courseId)]);

    const time = formatDate(event.dataValues.startDate);
    const place = event.dataValues.teachingplace;
    const name = course.name;
    const message = i18n.reservations.cancellationMessage
        .replace('{name}', name)
        .replace('{place}', place)
        .replace('{time}', time);
    return message;
}

module.exports = {
    sendMessageToUser,
    generateTeliaMessageRequest,
    buildCancellationMessage
};
