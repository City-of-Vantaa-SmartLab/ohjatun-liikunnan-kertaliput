import { decorate, observable, computed, action } from 'mobx';
import mockCourse from './course-mock.json';
import dateFns from 'date-fns';
import { fetchCourses, reserveTicket } from '../apis';

export const isOpenYet = (courseItem) => {
    // within 3 days from now
    const diff = dateFns.differenceInHours(courseItem.startDate, new Date());
    return diff >= 0 && diff < 72;
};

export const isClosedYet = (courseItem) => {
    // and must not be 1 hours before starting time
    const diff = dateFns.differenceInHours(courseItem.startDate, new Date());
    return diff < 1;
};

const hasSufficientFund = (balance, courseItem) => courseItem.price <= balance;

const hasBeenReserved = (reservedCourseList, courseItem) => {
    return reservedCourseList.find(
        (item) =>
            item.eventId === courseItem.eventId && item.bookingStatus === 1
    );
};
const hasEnoughTickets = (courseItem) => {
    return courseItem.reservedCount < courseItem.single_payment_count;
};
const isAvailable = (
    balance,
    courseItem,
    authenticationStatus,
    reservedCourseList
) => {
    const openedYet = isOpenYet(courseItem);
    const closedYet = isClosedYet(courseItem);
    const enoughFund = hasSufficientFund(balance, courseItem);
    const notReserved = !hasBeenReserved(reservedCourseList || [], courseItem);
    const hasTickets = hasEnoughTickets(courseItem);
    return {
        reasons: [
            !authenticationStatus && 'auth',
            !notReserved && 'reserved',
            !openedYet && 'openTime',
            closedYet && 'closingTime',
            !hasTickets && 'noTickets',
            !enoughFund && 'resource',
        ].filter((reason) => typeof reason !== 'boolean'),
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
                if (window.requestIdleCallback)
                    window.requestIdleCallback(
                        () => {
                            this.checkAvailability();
                            checkEvery5Sec();
                        },
                        {
                            timeout: Infinity,
                        }
                    );
                else {
                    this.checkAvailability();
                    checkEvery5Sec();
                }
            }, 5000);
        };

        const checkEveryFewMins = () => {
            // schedule this checking to find if any data
            // in backend has changed
            window.setTimeout(() => {
                if (window.requestIdleCallback)
                    window.requestIdleCallback(
                        () => {
                            this.fetchCourses();
                            checkEveryFewMins();
                        },
                        {
                            timeout: Infinity,
                        }
                    );
                else {
                    this.fetchCourses();
                    checkEveryFewMins();
                }
            }, 30000);
        };

        this.fetchCourses();
        checkEvery5Sec();
        checkEveryFewMins();
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
                            courseItem,
                            this.rootStore.userStore.isAuthenticated,
                            this.rootStore.userStore.reservedCourses
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
            if (course !== null) {
                const reservation = await reserveTicket({
                    courseId: course.id,
                    eventId: course.eventId,
                });
                this.rootStore.userStore.setBalance(course.price);
                reservation.bookingStatus = 1;
                await this.fetchCourses();
                this.rootStore.userStore.reservedCourses.push(reservation);
                // @TODO: handle failure states: Error messages, etc
            }
            this.selectCourse(null);
            this.checkAvailability();
        } catch (error) {
            console.log('Cannot reserve course ', error.message);
            this.rootStore.userStore.checkAuthenticationStatusOnStart();
            await this.fetchCourses();
            return error.message;
        }
    }

    checkAvailabilityOnAction = action(() => {
        if (this.rootStore.userStore.isAuthenticated) {
            window.requestIdleCallback(this.checkAvailability);
        }
    });
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
