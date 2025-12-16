const express = require('express');
const db = require('../db');
const router = express.Router();
const utils = require('../utils');

const { formatInTimeZone } = require('date-fns-tz');
const i18n = require('../i18n').i18n();

const { Parser } = require('json2csv');

const getReportForCurrentYear = async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const report = await generateReportFile(year);
        if (!report) { res.status(500).json(`No events found for that date.`); }
        else {
            res.setHeader('Content-disposition', `attachment; filename=report-${year}.csv`);
            res.setHeader('Content-type', 'application/CSV');
            res.charset = 'UTF-8';
            res.write(report);
            res.end();
        }
    } catch (err) {
        res.status(500).json(`Failed to get events. Error: ${err.message}`);
    }
};

const getReportForYear = async (req, res) => {
    try {
        const year = Number(req.params.year);
        const validationErrors = utils.reports.validateYear(year);
        if (validationErrors) { return res.status(422).json(validationErrors); }
        const report = await generateReportFile(year);
        if (!report) { res.status(500).json(`No events found for that date.`); }
        else {
            res.setHeader('Content-disposition', `attachment; filename=report-${year}.csv`);
            res.setHeader('Content-type', 'application/CSV');
            res.charset = 'UTF-8';
            res.write(report);
            res.end();
        }
    } catch (err) {
        res.status(500).json(`Failed to get events. Error: ${err.message}`);
    }
};

const generateReportFile = async (year) => {
    const rawReport = (await db.reports.getReportDetails(year))[0];
    if (rawReport.length < 1) return undefined;
    const mappedReports = rawReport.map(entry => rawEntryToReportEntry(entry));
    const fields = ["Päivä", "Alkamisaika", "Tunnin nimi", "Hinta", "Myytyjen lippujen määrä"];
    const parser = new Parser({ fields, delimiter: ';' });
    return parser.parse(mappedReports);
}

const rawEntryToReportEntry = (entry) => {
    const formattedDate = formatDate(entry.start_date);
    return {
        "Päivä": formattedDate.substring(0, 10),
        "Alkamisaika": formattedDate.substring(11, 19),
        "Tunnin nimi": entry.name,
        "Hinta": formatCost(utils.courses.getCoursePrice(entry.course_id, entry.start_date)),
        "Myytyjen lippujen määrä": entry.ticket_total
    }
}

const formatCost = (value) => {
    return parseFloat(value).toFixed(2).replace('.', ',');
}

const formatDate = (date) => {
    return formatInTimeZone(date, 'Europe/Helsinki', i18n.dateFormats.display);
};

router.get('/', getReportForCurrentYear)
router.get('/:year', getReportForYear);

module.exports = router;
