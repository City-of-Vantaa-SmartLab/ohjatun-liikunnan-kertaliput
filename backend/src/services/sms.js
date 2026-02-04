const axios = require('axios');
const i18n = require('../i18n').i18n();
const db = require('../db');
const logger = require('../utils/logging');
const utils = require('../utils');
const { formatInTimeZone } = require('date-fns-tz');

const teliaEndPoint = 'https://ws.mkv.telia.fi/restsms/lekabrest/send';
const teliaUsername = process.env.TELIA_USERNAME;
const teliaPassword = process.env.TELIA_PASSWORD;
const teliaUser = process.env.TELIA_USER;

const formatDate = (date) => {
    return formatInTimeZone(date, 'Europe/Helsinki', i18n.dateFormats.display);
};

const maskName = (name) => {
    if (!name) return '';
    const s = name.trim();
    if (s.length <= 2) return s[0] + '_'.repeat(Math.max(0, s.length - 1));
    return s[0] + '_'.repeat(s.length - 2) + s.slice(-1);
}

const sendMessageToUser = async (user, message) => {
    try {
        const phoneNumber = user.phoneNumber;
        logger.log('SMS', `Send SMS to ${maskName(user.username)} / ${utils.users.maskPhone(phoneNumber)}`);
        const request = generateTeliaMessageRequest(phoneNumber, message);
        const response = await axios.post(teliaEndPoint, request);
        if (response && response.data.accepted[0].to === phoneNumber.slice(1)) {
            return response;
        }
    } catch (error) {
        logger.error('SMS', `Failed to send SMS: ${error.message}`);
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
