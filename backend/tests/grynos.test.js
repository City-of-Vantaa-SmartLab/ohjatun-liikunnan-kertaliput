const seed = require('../src/seed/db-seed');
const db = require('../src/db');
const mockData = require('./testdata');
const datefns = require('date-fns');
describe('getCourses API call', () => {
    beforeAll(async () => {
        return await seed.loadMockCoursesToDatabase();
    });

    test('should load course data', async () => {
        const startRange = new Date();
        const endRange = datefns.addDays(new Date(), 8);
        let courses = await db.courses.getCourses(startRange, endRange);
        courses = courses.sort((a, b) => a.id - b.id);
        expect(courses).not.toBeNull();
        expect(courses).toHaveLength(24);
        const courseObj = courses[0];
        expect(courseObj.name).toEqual('English Course');
        expect(courseObj.price).toEqual(86);
        expect(courseObj.location).toHaveLength(1);
        expect(courseObj.teachingSession).toHaveLength(1);
    });

    test('should load course by Id', async () => {
        const course = await db.courses.getCourseById('2');
        expect(course).not.toBeNull();
        expect(course.name).toEqual('Zumba Class');
        expect(course.price).toEqual(76);
        expect(course.location).toHaveLength(1);
        expect(course.teachingSession).toHaveLength(1);
    });

    test('validate the map reduce fucntion', async () => {
        const response = await db.courses.reduceCoursesByDate(mockData.courses);
        const responseObj = response['04-18-2018'][0];
        expect(response['04-18-2018']).toHaveLength(4);
        expect(responseObj.name).toEqual('English Conversation');
        expect(responseObj.price).toEqual(3);
        expect(responseObj.location).toEqual('Tapiola, Vindängens skola');
        expect(responseObj.startDate).toEqual('2018-04-18T07:00:00.000Z');
        expect(responseObj.endDate).toEqual('2018-04-18T08:30:00.000Z');
    });

    test('should load all events', async () => {
        const events = await db.events.getEvents();
        expect(events).not.toBeNull();
        expect(events).toHaveLength(24);
    });

    test('should load event by Id', async () => {
        const event = await db.events.getEventById('1');
        expect(event).not.toBeNull();
        expect(event.teachingplace).toEqual(
            'Tikkurila, Vantaan opistotalo, 170 Luokka'
        );
    });
});
