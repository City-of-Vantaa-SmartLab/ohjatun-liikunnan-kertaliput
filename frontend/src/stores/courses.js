import { decorate, observable, computed, action } from 'mobx';
import mockCourse from './course-mock.json';
import dateFns from 'date-fns';
import { fetchCourses, reserveTicket } from '../apis';

const isAvailableByTime = (courseItem) =>
    // within 3 days from now
    dateFns.differenceInDays(courseItem.startDate, new Date()) < 3 &&
    // and must not be 1 hours before starting time
    dateFns.differenceInHours(courseItem.startDate, new Date()) > 1;

const hasSufficientFund = (balance, courseItem) => courseItem.price <= balance;
const isAvailable = (balance, courseItem) => {
    const satisfyTimeContrain = isAvailableByTime(courseItem);
    const satisfyResourceConstrain = hasSufficientFund(balance, courseItem);
    return {
        isAvailable: satisfyTimeContrain && satisfyResourceConstrain,
        reason: [
            satisfyTimeContrain && 'time',
            satisfyResourceConstrain && 'resource',
        ],
    };
};

class courseStore {
    courseList = [];
    isFetchingCourses = true;
    useMockCourse = false;
    filters = {
        date: new Date(), // today
    };
    courseInFocus = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
        const checkEvery5Sec = () => {
            // schedule this checking every 5 seconds
            // when browser is idle, to avoid hagging resources for UI
            window.setTimeout(() => {
                window.requestIdleCallback(
                    () => {
                        this.checkAvailability();
                        checkEvery5Sec();
                    },
                    {
                        timeout: Infinity,
                    }
                );
            }, 5000);
        };

        this.fetchCourses();
        checkEvery5Sec();
    }

    // this check the availability regarding time constrains
    checkAvailability() {
        if (!this.courseList || this.courseList.length === 0) return;
        // loop throught courseList recursively
        // add an evaluation to the item
        Object.keys(this.courseList).forEach(
            (key) =>
                (this.courseList[key] = this.courseList[key].map(
                    (courseItem) => ({
                        ...courseItem,
                        ...isAvailable(
                            this.rootStore.userStore.balance,
                            courseItem
                        ),
                    })
                ))
        );
    }

    async fetchCourses(startDate = Date.now()) {
        const endDate = dateFns.addDays(startDate, 14).getTime();
        this.isFetchingCourses = true;

        try {
            const data = await fetchCourses({ startDate, endDate });
            this.useMockCourse = false;
            this.courseList = data;
            // as soon as the courses are available in store, we will apply check on them
            this.checkAvailability();
        } catch (error) {
            console.log(error);
            this.courseList = mockCourse;
            this.useMockCourse = true;
        }

        this.isFetchingCourses = false;
    }

    getCourses() {
        if (this.isFetchingCouses) return [];
        if (this.filters.date) {
            const key = dateFns.format(this.filters.date, 'MM-DD-YYYY');
            const filtered = this.courseList[key];
            return filtered || [];
        }
        return this.courseList;
    }

    get courseIdList() {
        const takeId = (item) => item.id;
        return Object.values(this.courseList).map((arr) => arr.map(takeId));
    }

    setFilters(filters) {
        this.filters = filters;
    }

    selectCourse(course) {
        this.courseInFocus = course;
    }

    async reserveCourse(course) {
        try {
            await reserveTicket({
                courseId: course.id,
                eventId: course.eventId,
            });
            this.rootStore.userStore.setBalance(course.price);
            this.selectCourse(null);
            // @TODO: handle failure states: Error messages, etc
        } catch (error) {
            console.error('Cannot reserve course', error);
            return false;
        }
    }
}

export default decorate(courseStore, {
    courseList: observable.deep,
    courseIdList: computed,
    isFetchingCourses: observable,
    fetchCourse: action.bound,
    courseInFocus: observable,
    filters: observable,
    useMockCourse: observable,
    checkAvailability: action,
    reserveCourse: action,
});
