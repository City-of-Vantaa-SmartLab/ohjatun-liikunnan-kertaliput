const Sequelize = require('sequelize');
let connectionString;
if (process.env.DATABASE_URL) {
    connectionString = process.env.DATABASE_URL;
} else if (
    process.env.USERNAME &&
    process.env.PASSWORD &&
    process.env.HOST &&
    process.env.DATABASE
) {
    const { USERNAME, PASSWORD, HOST, DATABASE } = process.env;
    connectionString = `postgres://${USERNAME}:${PASSWORD}@${HOST}:5432/${DATABASE}`;
} else {
    connectionString = `postgres://postgres:password@localhost:5432/vantaa_pwa`;
}
const Op = Sequelize.Op;
const sequelize = new Sequelize(connectionString, {
    operatorsAliases: Op,
    logging: true,
});

module.exports = sequelize;
