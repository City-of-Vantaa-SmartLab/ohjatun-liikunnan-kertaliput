const db = require('../sequalize_pg');
const Sequelize = require('sequelize');
const DEFAULT_SALDO = process.env.DEFAULT_SALDO || 0;
const model = db.define('users', {
    username: Sequelize.STRING,
    phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
    },
    pin: Sequelize.STRING,
    token: Sequelize.STRING,
    phoneNumberConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    balance: {
        type: Sequelize.DOUBLE,
        defaultValue: DEFAULT_SALDO,
    },
});

module.exports = model;
