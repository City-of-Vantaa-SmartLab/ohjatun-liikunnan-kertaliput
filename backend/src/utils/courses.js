const POOL_ID = process.env.POOL_ID || 1;
const WATER_ID = process.env.WATER_ID || 2;
const FLOOR_ID = process.env.FLOOR_ID || 3;
const GYM_ID = process.env.GYM_ID || 4;
const POOL_WATER_PRICE_BEFORE_4 = process.env.POOL_WATER_PRICE_BEFORE_4 || 1.5;
const POOL_WATER_PRICE_AFTER_4 = process.env.POOL_WATER_PRICE_AFTER_4 || 2.5;
const FLOOR_GYM_PRICE_BEFORE_4 = process.env.FLOOR_GYM_PRICE_BEFORE_4 || 2.5;
const FLOOR_GYM_PRICE_AFTER_4 = process.env.FLOOR_GYM_PRICE_AFTER_4 || 4.0;
const DEFAULT_PRICE = process.env.DEFAULT_PRICE || 3.0;
const dateFns = require('date-fns');

module.exports = {
    validateCourseId: (courseId) => {
        if (typeof courseId !== 'number' || isNaN(courseId)) {
            return 'Course Id is not valid';
        }
    },

    getCoursePrice: (courseTypeID, startDate) => {
        const startingTime = dateFns.getHours(startDate);
        const isWeekend = dateFns.isWeekend(startDate);

        if (courseTypeID === POOL_ID || courseTypeID == WATER_ID) {
            if (startingTime <= 16 && !isWeekend) {
                return POOL_WATER_PRICE_BEFORE_4;
            } else {
                return POOL_WATER_PRICE_AFTER_4;
            }
        } else if (courseTypeID === FLOOR_ID || courseTypeID == GYM_ID) {
            if (startingTime <= 16 && !isWeekend) {
                return FLOOR_GYM_PRICE_BEFORE_4;
            } else {
                return FLOOR_GYM_PRICE_AFTER_4;
            }
        } else {
            return DEFAULT_PRICE;
        }
    },
};
