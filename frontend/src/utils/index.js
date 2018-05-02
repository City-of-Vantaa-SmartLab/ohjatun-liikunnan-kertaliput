import { inject, observer } from 'mobx-react';
import fiLocale from 'date-fns/locale/fi';
import stores from '../stores';

export const connect = (...stores) => (component) => {
    return inject(...stores)(observer(component));
};

export const getLocale = () => {
    if (stores.i18nStore.language === 'fi') return fiLocale;
    // add cases for swedish later
};

export const toStringFromObject = (obj) => Object.values(obj).join('');

export const processPhoneNumber = (phoneNumber) =>
    phoneNumber.replace(/^0/, '+358').replace(/\s/g, '');

export const serialize = (
    serializableTarget = {},
    propertySelector = (target) => target
) => {
    // a small wrapper for JSON stringify in case
    try {
        return JSON.stringify(propertySelector(serializableTarget));
    } catch (error) {
        console.log(error, 'Cannot serialize');
    }
};

export const hydrateFromStorage = (name) => {
    const value = window.localStorage.getItem(name);
    if (value) return JSON.parse(value);
    else throw new Error('Cannot hydrate from storage');
};

export const persistToStorage = (name, data) => {
    try {
        window.localStorage.setItem(name, serialize(data));
    } catch (error) {
        console.err(error, 'Cannot persist to storage');
    }
};

export const pipable = (obj) => {
    const pipe = (...funcList) =>
        funcList.reduce(
            (resultFromLast, currentFunc) => currentFunc(resultFromLast),
            { ...obj }
        );
    return {
        pipe,
    };
};

export const validatePhoneNumber = (phoneNumberString) =>
    /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(
        phoneNumberString
    );

export const validateUsername = (username) => {
    // no contrains now for username
    return true;
};
