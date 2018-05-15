const db = require('../sequalize_pg');
const Sequelize = require('sequelize');
const locations = require('./locations');
const events = require('./events');

const courses = db.define('courses', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    code: Sequelize.STRING,
    name: Sequelize.TEXT,
    description: Sequelize.TEXT,
    descriptionInternet: Sequelize.TEXT,
    price: Sequelize.FLOAT,
    priceMaterial: Sequelize.FLOAT,
    firstSessionDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    firstSessionWeekDay: Sequelize.STRING,
    lastSessionDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    internetEnrollment: Sequelize.BOOLEAN,
    minStudentCount: Sequelize.INTEGER,
    maxStudentCount: Sequelize.INTEGER,
    firstEnrollmentDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    lastEnrollmentDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    acceptedCount: Sequelize.INTEGER,
    ilmokink: Sequelize.STRING,
    single_payment_count: Sequelize.INTEGER,
    company_name: Sequelize.STRING,
    course_type_id: Sequelize.INTEGER,
    course_type_name: Sequelize.STRING,
    teacher: Sequelize.STRING,
});
courses.hasMany(locations, { as: 'location' });
courses.hasMany(events, { as: 'teachingSession' });
module.exports = courses;
