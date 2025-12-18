const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const db = require('./sequalize_pg');
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

server.use(/^\/$/, (req, res) => {
    res.redirect('/app/');
});
server.use('/api/', require('./routes/index'));

server.use(
    '/app/',
    express.static(path.join(__dirname, '..', 'public'), { maxAge: 600000 })
);
server.get('/reports', (req, res) => {
    res.redirect('/api/reports/');
});
server.get('/reports/:year', (req, res) => {
    res.redirect(`/api/reports/${req.params.year}`)
});
server.get('/app/*splat', (req, res) => {
    res.redirect('/');
});

const startServer = () => {
    const dataSource = populateSeedData ? 'seed data' : 'Grynos API';
    const dbPopulation = populateSeedData ? loadMockCoursesToDatabase() : fetchAndSaveCoursesToDb();
    
    dbPopulation.catch(error => {
        console.log(`Failed to load initial course data from ${dataSource}:`, error.message);
        const retryMessage = populateSeedData 
            ? "Seed data will not be retried automatically."
            : `Grynos API will be retried in ${grynosUpdateInterval/1000} seconds.`;
        console.log(`Starting server anyway. ${retryMessage}`);
    }).finally(() => {
        console.log("Starting server.");
        server.listen(port, () =>
            console.log(`Server deployed at ${new Date()} and running on ${port}`)
        );
    });
}

const waitForDatabaseAndStart = async () => {
    const maxRetries = 10;
    const retryDelay = 2000;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            await db.authenticate();
            console.log('Database connection established successfully.');
            const models = require('./models'); // Ensure models are loaded
            await db.sync(); // Create tables if they don't exist
            console.log('Database tables synchronized.');
            startServer();
            return;
        } catch (error) {
            console.log(`Database connection attempt ${i + 1}/${maxRetries} failed:`, error.message);
            if (i < maxRetries - 1) {
                console.log(`Retrying in ${retryDelay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    console.error('Failed to connect to database after multiple attempts. Exiting.');
    process.exit(1);
}

resetDatabase ? clearDatabase().then(() => waitForDatabaseAndStart()) : waitForDatabaseAndStart();
