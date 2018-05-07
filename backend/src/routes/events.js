const express = require('express');
const models = require('../models');
const db = require('../db');
const router = express.Router();
const utils = require('../utils');

const getEventById = async (req, res) => {
    try {
        const eventId = Number(req.params.id);
        const validationErrors = utils.events.validateEventId(eventId);
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            const events = await db.events.getEventById(eventId);
            if (events.length !== 0) {
                res.status(200).json(events);
            } else {
                res.sendStatus(404);
            }
        }
    } catch (err) {
        res.status(500).json(`Failed to get events. Error: ${err.message}`);
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await db.events.getEvents();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json(`Failed to get events. Error: ${err.message}`);
    }
};

router.get('/', getEvents);
router.get('/:id', getEventById);

module.exports = router;
