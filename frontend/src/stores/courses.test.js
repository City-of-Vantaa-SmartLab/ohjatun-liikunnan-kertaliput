import { addDays, subDays, addHours, subHours } from 'date-fns';
import { isClosedYet, isOpenYet } from './courses.js';

test('function to calculate close status is correct', () => {
    const testFunc = (date) => {
        const o = { startDate: date };
        return isClosedYet(o);
    };

    let now = Date.now();
    let thens = [
        addDays(now, 2),
        subDays(now, 1),
        addHours(now, 1),
        subHours(now, 4),
    ];

    expect(testFunc(thens[0])).toBe(false);
    expect(testFunc(thens[1])).toBe(true);
    expect(testFunc(thens[2])).toBe(true);
    expect(testFunc(thens[3])).toBe(true);
    expect(testFunc(now)).toBe(true);
});

test('function to calculate open status is correct', () => {
    const testFunc = (date) => {
        const o = { startDate: date };
        return isOpenYet(o);
    };

    let now = new Date();
    let thens = [
        addDays(now, 2),
        subDays(now, 1),
        addHours(now, 2),
        addDays(now, 14),
    ];

    expect(testFunc(thens[0])).toBe(true);
    expect(testFunc(thens[1])).toBe(false);
    expect(testFunc(thens[2])).toBe(true);
    expect(testFunc(thens[3])).toBe(false);
});
