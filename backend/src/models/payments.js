const db = require('../sequalize_pg');
const Sequelize = require('sequelize');

const model = db.define('payment_requests', {
    auth_code: Sequelize.TEXT,
    order_number: Sequelize.STRING,
    amount: Sequelize.DOUBLE,
    payment_status: {
        type: Sequelize.INTEGER,
        defaultValue: -1,
    },
    userId: Sequelize.INTEGER,
});

module.exports = model;
