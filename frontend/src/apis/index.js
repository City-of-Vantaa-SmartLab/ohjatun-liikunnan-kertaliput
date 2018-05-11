// Is an abstraction to communicate with backend

const BASE_PATH = '/api';

const myFetch = async (url, config = {}) => {
    const response = await window.fetch(BASE_PATH + url, {
        headers: { 'content-type': 'application/json', ...config.headers },
        method: config.method || 'GET',
        credentials: 'same-origin',
        body: JSON.stringify(config.body),
    });
    if (response.status >= 200 && response.status < 300) {
        try {
            return await response.json();
        } catch (error) {
            console.log('Not a json :)');
        }
    } else throw new Error('Error in making request');
};

export const checkLoginStatus = () => myFetch(`/users/me`);

export const login = ({ pin, phoneNumber }) =>
    myFetch(`/users/login`, {
        headers: {
            credentials: 'same-origin',
        },
        method: 'POST',
        body: {
            pin,
            phoneNumber,
        },
    });

export const logout = () =>
    myFetch(`/users/logout`, {
        method: 'POST',
    });

export const register = ({ username, phoneNumber }) =>
    myFetch(`/users`, {
        method: 'POST',
        body: {
            username,
            phoneNumber,
        },
    });

export const resetPin = ({ phoneNumber }) =>
    myFetch(`/users/reset-pin`, {
        method: 'POST',
        body: {
            phoneNumber,
        },
    });
export const fetchCourses = (config) => {
    const queries = Object.keys(config)
        .map((key) => `${key}=${config[key]}`)
        .join('&');
    return myFetch(`/courses?${encodeURI(queries)}`);
};

export const reserveTicket = ({ courseId, eventId }) =>
    myFetch(`/reservations`, {
        method: 'POST',
        body: {
            courseId,
            eventId,
        },
    });

export const fetchReservedCourses = () => myFetch(`/reservations`);
