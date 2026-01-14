const POOL_ID = process.env.POOL_ID || 488;
const WATER_ID = process.env.WATER_ID || 488;
const FLOOR_ID = process.env.FLOOR_ID || 82;
const GYM_ID = process.env.GYM_ID || 82;
const POOL_WATER_PRICE_BEFORE_4 = process.env.POOL_WATER_PRICE_BEFORE_4 || 3;
const POOL_WATER_PRICE_AFTER_4 = process.env.POOL_WATER_PRICE_AFTER_4 || 4; // Also weekend price.
const FLOOR_GYM_PRICE_BEFORE_4 = process.env.FLOOR_GYM_PRICE_BEFORE_4 || 4;
const FLOOR_GYM_PRICE_AFTER_4 = process.env.FLOOR_GYM_PRICE_AFTER_4 || 6; // Also weekend price.
const DEFAULT_PRICE = process.env.DEFAULT_PRICE || 4;
const { getHours, getMinutes, isWeekend } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const i18n = require('../i18n').i18n();

module.exports = {
    validateCourseId: (courseId) => {
        if (typeof courseId !== 'number' || isNaN(courseId)) {
            return 'Course Id is not valid';
        }
    },

    getCoursePrice: (courseTypeID, startDate) => {
        const date = formatInTimeZone(new Date(startDate), 'Europe/Helsinki', i18n.dateFormats.isoTimestamp);
        const parsedDate = new Date(date);
        const startingHour = getHours(parsedDate);
        const startingMinute = getMinutes(parsedDate);
        const isWeekendDay = isWeekend(parsedDate);

        const isHigherPriceTier =
            (startingHour == 16 && startingMinute >= 15) ||
            (startingHour > 16) ||
            isWeekendDay;

        if (courseTypeID === POOL_ID || courseTypeID === WATER_ID) {
            if (isHigherPriceTier) {
                return POOL_WATER_PRICE_AFTER_4;
            } else {
                return POOL_WATER_PRICE_BEFORE_4;
            }
        } else if (courseTypeID === FLOOR_ID || courseTypeID === GYM_ID) {
            if (isHigherPriceTier) {
                return FLOOR_GYM_PRICE_AFTER_4;
            } else {
                return FLOOR_GYM_PRICE_BEFORE_4;
            }
        } else {
            return DEFAULT_PRICE;
        }
    },
};
