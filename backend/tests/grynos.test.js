const seed = require('../src/seed/db-seed');
const db = require('../src/db');
const mockData = require('./testdata');
describe('getCourses API call', () => {
    beforeAll(() => {
        return seed.loadMockCoursesToDatabase();
    });

    test('should load course data', async () => {
        const courses = await db.courses.getCourses('2018-05-02', '2018-05-19');
        expect(courses).not.toBeNull();
        expect(courses).toHaveLength(20);
        const courseObj = courses[0];
        expect(courseObj.name).toEqual('Englantia perustasolla A1+/A2');
        expect(courseObj.price).toEqual(6);
        expect(courseObj.location).toHaveLength(1);
        expect(courseObj.teachingSession).toHaveLength(1);
    });

    test('should load course by Id', async () => {
        const course = await db.courses.getCourseById('1');
        expect(course).not.toBeNull();
        expect(course.name).toEqual('Englantia perustasolla A1+/A2');
        expect(course.price).toEqual(86);
        expect(course.location).toHaveLength(1);
        expect(course.teachingSession).toHaveLength(1);
    });

    test('validate the map reduce fucntion', () => {
        const response = db.courses.reduceCoursesByDate(mockData.courses);
        const responseObj = response['04-18-2018'][0];
        expect(response['04-18-2018']).toHaveLength(4);
        expect(responseObj.name).toEqual('English Conversation');
        expect(responseObj.price).toEqual(43);
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
        const events = await db.events.getEventById('1');
        const event = events[0];
        expect(event).not.toBeNull();
        expect(event.dataValues.teachingplace).toEqual(
            'Tikkurila, Vantaan opistotalo, 170 Luokka'
        );
    });
});
