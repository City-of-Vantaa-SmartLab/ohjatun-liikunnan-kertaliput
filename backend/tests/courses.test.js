const utils = require('../src/utils');
describe('Grynos Price Calculation', () => {
    test('Validate Prices', () => { });
    let date = new Date('2018-10-21 16:00:00.000 GMT+03:00 (EEST)').toString();
    let price = utils.courses.getCoursePrice(82, date);
    expect(price).toEqual(4);
    date = new Date('2018-10-15 17:00:00.000 GMT+03:00 (EEST)').toString();
    price = utils.courses.getCoursePrice(82, date);
    expect(price).toEqual(4);
    date = new Date('2018-05-10 15:00:00.000 GMT+03:00 (EEST)').toString();
    price = utils.courses.getCoursePrice(488, date);
    expect(price).toEqual(1.5);
    date = new Date('2018-05-10 17:00:00.000 GMT+03:00 (EEST)').toString();
    price = utils.courses.getCoursePrice(488, date);
    expect(price).toEqual(2.5);
});
