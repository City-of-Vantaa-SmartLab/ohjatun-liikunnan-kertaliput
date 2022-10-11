const Sequelize = require('sequelize');
let connectionString;
if (process.env.DATABASE_URL) {
    connectionString = process.env.DATABASE_URL;
} else if (
    process.env.DB_USERNAME &&
    process.env.DB_PASSWORD &&
    process.env.DB_HOST &&
    process.env.DB_NAME
) {
    const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
    connectionString = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`;
} else {
    connectionString = `postgres://postgres:password@localhost:5432/postgres`;
}
const Op = Sequelize.Op;
const sequelize = new Sequelize(connectionString, {
    operatorsAliases: Op,
    logging: false,
});

module.exports = sequelize;
