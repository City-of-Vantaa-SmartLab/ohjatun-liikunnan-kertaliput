const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const db = require('./sequalize_pg');
const logger = require('./utils/logging');
require('dotenv').config();
const loadMockCoursesToDatabase = require('./seed/db-seed')
    .loadMockCoursesToDatabase;
const fetchAndSaveCoursesToDb = require('./grynos').fetchAndSaveCoursesToDb;
const clearDatabase = require('./grynos').clearDatabase;
const auth = require('./auth');

const port = process.env.PORT || 3000;
const grynosUpdateInterval =
    process.env.GRYNOS_COURSES_UPDATE_INTERVAL || 3600000;
const populateSeedData = process.env.USE_MOCK_DATA === '1';
const resetDatabase = process.env.DROP_DATABASE_SCHEMA === 'true';
setInterval(fetchAndSaveCoursesToDb, grynosUpdateInterval);

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(cookieParser(auth.secret));
server.use(auth.resolveUser);

server.use(/^\/$/, (_req, res) => {
    res.redirect('/app/');
});
server.use('/api/', require('./routes/index'));

server.use(
    '/app/',
    express.static(path.join(__dirname, '..', 'public'), { maxAge: 600000 })
);
server.get('/reports', (_req, res) => {
    res.redirect('/api/reports/');
});
server.get('/reports/:year', (req, res) => {
    res.redirect(`/api/reports/${req.params.year}`)
});
server.get('/app/*splat', (_req, res) => {
    res.redirect('/');
});

const startServer = () => {
    const dataSource = populateSeedData ? 'seed data' : 'Grynos API';
    const dbPopulation = populateSeedData ? loadMockCoursesToDatabase() : fetchAndSaveCoursesToDb();

    dbPopulation.catch(error => {
        logger.log('Server', `Failed to load initial course data from ${dataSource}: ${error.message}`);
        const retryMessage = populateSeedData
            ? "Seed data will not be retried automatically."
            : `Grynos API will be retried in ${grynosUpdateInterval/1000} seconds.`;
        logger.log('Server', `Starting server anyway ${retryMessage}`);
    }).finally(() => {
        server.listen(port, () =>
            logger.log('Server', `Server started on port ${port}`)
        );
    });
}

const waitForDatabaseAndStart = async () => {
    const maxRetries = 10;
    const retryDelay = 2000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            await db.authenticate();
            logger.log('Database', 'Database connection established successfully.');
            await db.sync(); // Create tables if they don't exist
            logger.log('Database', 'Database tables synchronized.');
            startServer();
            return;
        } catch (error) {
            logger.log('Database', `Database connection attempt ${i + 1}/${maxRetries} failed: ${error.message}`);
            if (i < maxRetries - 1) {
                logger.log('Database', `Retrying in ${retryDelay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    logger.error('Database', 'Failed to connect to database after multiple attempts. Exiting.');
    process.exit(1);
}

resetDatabase ? clearDatabase().then(() => waitForDatabaseAndStart()) : waitForDatabaseAndStart();
