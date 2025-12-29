const express = require('express');
const router = express.Router();
const db = require('../db');
const { format, addWeeks, startOfDay, endOfDay } = require('date-fns');
const utils = require('../utils');
const i18n = require('../i18n').i18n();

const getCourses = async (req, res) => {
    try {
        const timestampToDate = (timestamp) => new Date(Number(timestamp));

        // Default start and end date for the last week
        const startDate = startOfDay(
            req.query.startDate
                ? timestampToDate(req.query.startDate)
                : new Date()
        );

        const endDate = endOfDay(
            req.query.endDate
                ? timestampToDate(req.query.endDate)
                : addWeeks(new Date(), 1)
        );

        const courses = await db.courses.getCourses(startDate, endDate);
        const response = await db.courses.reduceCoursesByDate(courses);
        res.status(200).json(response);
    } catch (err) {
        console.error('Error in getCourses:', err);
        res.status(500).json({ error: `Failed to get courses. Error: ${err.message}` });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await db.courses.getAllCourses();
        const response = await db.courses.reduceCoursesByDate(courses);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(`Failed to get courses. Error: ${err.message}`);
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = Number(req.params.id);
        const validationErrors = utils.courses.validateCourseId(courseId);
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            const course = await db.courses.getCourseById(courseId);
            if (course.length !== 0) {
                res.status(200).json(course);
            } else {
                res.sendStatus(404);
            }
        }
    } catch (err) {
        res.status(500).json(`Failed to get course. Error: ${err.message}`);
    }
};

router.get('/', getCourses);
router.get('/all', getAllCourses);
router.get('/:id', getCourseById);

module.exports = router;
