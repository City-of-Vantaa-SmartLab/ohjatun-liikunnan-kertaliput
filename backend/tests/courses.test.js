const utils = require('../src/utils');
describe('Grynos Price Calculation', () => {
    test('Validate Prices', () => { });
    // Test after 4pm (16:00) - should use FLOOR_GYM_PRICE_AFTER_4 (defaults to 5.0)
    let date = new Date('2018-10-21 16:00:00.000 GMT+03:00 (EEST)').toString();
    let price = utils.courses.getCoursePrice(82, date);
    expect(price).toEqual(5);
    // Test before 4pm - should use FLOOR_GYM_PRICE_BEFORE_4 (defaults to 3.5)
    date = new Date('2018-10-15 15:00:00.000 GMT+03:00 (EEST)').toString();
    price = utils.courses.getCoursePrice(82, date);
    expect(price).toEqual(3.5);
    // Test pool before 4pm - should use POOL_WATER_PRICE_BEFORE_4 (defaults to 2.5)
    date = new Date('2018-05-10 15:00:00.000 GMT+03:00 (EEST)').toString();
    price = utils.courses.getCoursePrice(488, date);
    expect(price).toEqual(2.5);
    // Test pool after 4pm - should use POOL_WATER_PRICE_AFTER_4 (defaults to 3.5)
    date = new Date('2018-05-10 17:00:00.000 GMT+03:00 (EEST)').toString();
    price = utils.courses.getCoursePrice(488, date);
    expect(price).toEqual(3.5);
});
