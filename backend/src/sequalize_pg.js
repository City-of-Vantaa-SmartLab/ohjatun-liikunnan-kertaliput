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
const sequelize = new Sequelize(connectionString, {
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
