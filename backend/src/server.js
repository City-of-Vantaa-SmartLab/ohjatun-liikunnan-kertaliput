const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./sequalize_pg');
require('dotenv').config();
const loadMockCoursesToDatabase = require('./seed/db-seed')
    .loadMockCoursesToDatabase;
const updateCoursesToDb = require('./grynos').updateCoursesToDb;
const clearDatabase = require('./grynos').clearDatabase;
const auth = require('./auth');

const port = process.env.PORT || 3000;
const grynosUpdateInterval =
    process.env.GRYNOS_COURSES_UPDATE_INTERVAL || 3600000;
const populateSeedData = process.env.POPULATE_SEED_DATA === '1';
const resetDatabase = process.env.DROP_DATABASE_SCHEMA === 'true';
setInterval(updateCoursesToDb, grynosUpdateInterval);

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

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
server.get('/app/**', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const startServer = () => {
    const dbPopulation = populateSeedData ? loadMockCoursesToDatabase() : updateCoursesToDb();
    dbPopulation.then(() => {
        server.listen(port, () =>
            console.log(`Server deployed at ${new Date()} and running on ${port}`)
        );
    }).catch(error => console.log('error in starting server', error));
}

resetDatabase ? clearDatabase().then(() => startServer()) : startServer();
