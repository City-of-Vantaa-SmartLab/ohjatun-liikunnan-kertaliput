const express = require('express');
const router = express.Router();
const db = require('../db');
const datefns = require('date-fns');
const utils = require('../utils');

const getCourses = async (req, res) => {
    try {
        const timestampToDate = (date) =>
            datefns.parse(Number(date), 'MM-DD-YYYY');
        const toFormattedDate = (date) => datefns.format(date);

        // Default start and end date for the last week
        const startDate = toFormattedDate(
            req.query.startDate
                ? timestampToDate(req.query.startDate)
                : new Date()
        );
        const endDate = toFormattedDate(
            req.query.endDate
                ? timestampToDate(req.query.endDate)
                : datefns.addWeeks(new Date(), 1)
        );

        const courses = await db.courses.getCourses(startDate, endDate);
        const response = db.courses.reduceCoursesByDate(courses);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(`Failed to get courses. Error: ${err.message}`);
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = Number(req.params.id);
        const validationErrors = utils.courses.validateCourseId(courseId);
        if (validationErrors) {
            res.status(422).send(validationErrors);
        } else {
            const course = await db.courses.getCourseById(courseId);
            if (course.length !== 0) {
                res.status(200).send(course);
            } else {
                res.sendStatus(404);
            }
        }
    } catch (err) {
        res.status(500).send(`Failed to get course. Error: ${err.message}`);
    }
};

router.get('/', getCourses);
router.get('/:id', getCourseById);

module.exports = router;
