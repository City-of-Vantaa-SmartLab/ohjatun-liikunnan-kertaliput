const seed = require('../src/seed/db-seed');
const db = require('../src/db');
const models = require('../src/models');
const mockData = require('./testdata');
const coursesToUpdate = require('../src/seed/mockDataForUpdate').updateCourses;
const updateCoursesToDb = require('../src/grynos').updateCoursesToDb;
const { setHours, addDays } = require('date-fns');

describe('getCourses API call', () => {
    beforeAll(async () => {
        return await seed.loadMockCoursesToDatabase();
    });

    test('should load course data', async () => {
        const startRange = setHours(new Date(), 0);
        const endRange = setHours(addDays(new Date(), 8), 23);
        let courses = await db.courses.getCourses(startRange, endRange);
        courses = courses.sort((a, b) => a.id - b.id);
        expect(courses).not.toBeNull();
        expect(courses).toHaveLength(24);
        const courseObj = courses[0];
        expect(courseObj.name).toEqual('English Course');
        expect(courseObj.price).toEqual(86);
        expect(courseObj.location).toHaveLength(1);
        expect(courseObj.teachingSession).toHaveLength(2);
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
        expect(responseObj.price).toEqual(3.5);
        expect(responseObj.location).toEqual('Tapiola, Vindängens skola');
        expect(responseObj.startDate).toEqual('2018-04-18T07:00:00.000Z');
        expect(responseObj.endDate).toEqual('2018-04-18T08:30:00.000Z');
    });

    test('should load all events', async () => {
        const events = await db.events.getEvents();
        expect(events).not.toBeNull();
        expect(events).toHaveLength(25);
    });

    test('should load event by Id', async () => {
        const event = await db.events.getEventById('1');
        expect(event).not.toBeNull();
        expect(event.teachingplace).toEqual(
            'Tikkurila, Vantaan opistotalo, 170 Luokka'
        );
    });

    test('should update seats when single payment seats is greater than current number', async () => {
        let reservation = {
            courseId: 1,
            eventId: 1,
            ticketType: 'Single_Ticket',
            ticketPrice: 90.5,
            bookingStatus: 1,
        };

        const user = {
            username: 'test user',
            pin: 1234,
        };

        let reservationId = 2;
        const defaultBalance = 0;

        const createdUser = await models.users.create(user);
        reservation.userId = createdUser.id;
        const dbReservation = await db.reservations.createReservation(
            reservation
        );

        const activeCourse = await db.courses.getCourseById(coursesToUpdate[0].id);
        const activeSession = activeCourse.dataValues.teachingSession;
        expect(activeSession[0].dataValues.status).toEqual(0);
        expect(activeSession[1].dataValues.status).toEqual(0);

        const updatedCourses = await updateCoursesToDb(coursesToUpdate);

        expect(updatedCourses[0].dataValues.single_payment_count).toEqual(10);
        expect(updatedCourses[1].dataValues.single_payment_count).toEqual(4);
        expect(updatedCourses[2].dataValues.single_payment_count).toEqual(11);
        expect(updatedCourses[3].dataValues.single_payment_count).toEqual(5);

        const cancelledCourse = await db.courses.getCourseById(updatedCourses[0].dataValues.id);
        const cancelledSession = cancelledCourse.dataValues.teachingSession;
        expect(cancelledSession[0].dataValues.status).toEqual(0);
        expect(cancelledSession[1]).toBeUndefined();

        const anotherActiveCourse = await db.courses.getCourseById(coursesToUpdate[1].id);
        const anotherActiveSession = anotherActiveCourse.dataValues.teachingSession;
        expect(anotherActiveSession[0].dataValues.status).toEqual(0);
    });
});
