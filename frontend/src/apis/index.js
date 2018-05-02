// Is an abstraction to communicate with backend

const BASE_PATH = '/api';

const myFetch = async (url, config = {}) => {
    const response = await window.fetch(BASE_PATH + url, {
        headers: { 'content-type': 'application/json', ...config.headers },
        method: config.method || 'GET',
        body: JSON.stringify(config.body),
    });
    if (response.status >= 200 && response.status < 300)
        return await response.json();
    else throw new Error('Error in making request');
};

export const login = ({ pin, phoneNumber }) =>
    myFetch(`/users/login`, {
        method: 'POST',
        body: {
            pin,
            phoneNumber,
        },
    });

export const register = ({ username, phoneNumber }) =>
    myFetch(`/users`, {
        method: 'POST',
        body: {
            username,
            phoneNumber,
        },
    });

export const fetchCourses = (config) => {
    const queries = Object.keys(config)
        .map((key) => `${key}=${config[key]}`)
        .join('&');
    return myFetch(`/courses?${encodeURI(queries)}`);
};
