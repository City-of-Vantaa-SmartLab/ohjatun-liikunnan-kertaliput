const express = require('express');
const router = express.Router();

router.use('/events', require('./events'));
router.use('/users', require('./users'));
router.use('/courses', require('./courses'));
router.use('/reservations', require('./reservations'));
router.use('/payments', require('./payments'));
router.use('/reports', require('./reports'));

router.get('/{*splat}', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
