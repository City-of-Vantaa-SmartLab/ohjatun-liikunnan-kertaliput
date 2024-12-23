const POOL_ID = process.env.POOL_ID || 488;
const WATER_ID = process.env.WATER_ID || 488;
const FLOOR_ID = process.env.FLOOR_ID || 82;
const GYM_ID = process.env.GYM_ID || 82;
const POOL_WATER_PRICE_BEFORE_4 = process.env.POOL_WATER_PRICE_BEFORE_4 || 2.5;
const POOL_WATER_PRICE_AFTER_4 = process.env.POOL_WATER_PRICE_AFTER_4 || 3.5; // Also weekend price.
const FLOOR_GYM_PRICE_BEFORE_4 = process.env.FLOOR_GYM_PRICE_BEFORE_4 || 3.5;
const FLOOR_GYM_PRICE_AFTER_4 = process.env.FLOOR_GYM_PRICE_AFTER_4 || 5.0; // Also weekend price.
const DEFAULT_PRICE = process.env.DEFAULT_PRICE || 3.5;
const dateFns = require('date-fns');
const { formatToTimeZone } = require('date-fns-timezone');
const format = 'YYYY-MM-DD HH:mm:ss.SSS [GMT]Z (z)'

module.exports = {
    validateCourseId: (courseId) => {
        if (typeof courseId !== 'number' || isNaN(courseId)) {
            return 'Course Id is not valid';
        }
    },

    getCoursePrice: (courseTypeID, startDate) => {
        const date = formatToTimeZone(startDate, format, { timeZone: 'Europe/Helsinki' });
        const startingHour = dateFns.getHours(date);
        const startingMinute = dateFns.getMinutes(date);
        const isWeekend = dateFns.isWeekend(date);

        const isHigherPriceTier =
            (startingHour == 16 && startingMinute > 15) ||
            (startingHour > 16) ||
            isWeekend;

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
