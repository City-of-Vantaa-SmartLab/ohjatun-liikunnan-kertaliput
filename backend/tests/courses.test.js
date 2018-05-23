const utils = require('../src/utils');
describe('Grynos Price Calculation', () => {
    test('Validate Prices', () => {});
    let price = utils.courses.getCoursePrice(1, new Date(2018, 5, 10, 16, 0));
    expect(price).toEqual(2.5);
    price = utils.courses.getCoursePrice(2, new Date(2018, 5, 10, 17, 0));
    expect(price).toEqual(2.5);
    price = utils.courses.getCoursePrice(3, new Date(2018, 5, 10, 16, 0));
    expect(price).toEqual(4.0);
    price = utils.courses.getCoursePrice(4, new Date(2018, 5, 10, 17, 0));
    expect(price).toEqual(4.0);
});
