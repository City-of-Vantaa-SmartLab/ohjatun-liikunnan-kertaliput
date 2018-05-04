const db = require('../sequalize_pg');
const Sequelize = require('sequelize');
const courses = require('./courses');
const events = require('./events');

const reservations = db.define('reservations', {
    courseId: Sequelize.INTEGER,
    eventId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    ticketType: {
        type: Sequelize.STRING,
        defaultValue: 'Single_Ticket',
    },
    ticketPrice: Sequelize.DOUBLE,
    bookingStatus: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
    },
});
reservations.belongsTo(courses);
reservations.belongsTo(events);
module.exports = reservations;
