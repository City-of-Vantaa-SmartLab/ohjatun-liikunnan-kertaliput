import { decorate, observable, action, autorun, computed } from 'mobx';
import {
    serialize,
    toStringFromObject,
    processPhoneNumber,
    hydrateFromStorage,
    persistToStorage,
} from 'utils';
import API from '../apis';

// constants
const BACKEND_API = new API();
const DEFAULT_PIN = {
    '0': '',
    '1': '',
    '2': '',
    '3': '',
};

class UserStore {
    isAuthenticating = false;
    authenticationFailed = false;
    pinCode = DEFAULT_PIN;
    username = undefined;
    phoneNumber = undefined;
    token = undefined;
    balance = 0;

    constructor() {
        try {
            const userData = hydrateFromStorage('user');
            this.setCredentials(userData);
        } catch (error) {
            console.error(error);
        }
    }
    // computed values
    get isAuthenticated() {
        // user is authenticated if there exists a token, otherwise they are guests
        return this.token && this.username && this.phoneNumber;
    }
    get phoneNumberIncorrect() {
        return this.phoneNumber.match(
            /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
        );
    }
    get freezePinCode() {
        return (
            Object.values(this.pinCode).every((code) => code !== '') &&
            !this.phoneNumberIncorrect
        );
    }

    // actions, that alters state
    setPhoneNumber(input) {
        this.phoneNumber = input;
    }

    setInputCode = (position, value) => {
        // sets inputCode
        // pin code array only have 4 digits
        if (
            this.freezePinCode ||
            position < 0 ||
            position > 3 ||
            value > 10 ||
            isNaN(value)
        )
            return false;
        this.pinCode[position] = value;
        return true;
    };
    setCredentials = (userData) => {
        this.token = userData.token;
        this.username = userData.username;
        this.balance = userData.balance;
        this.phoneNumber = userData.phoneNumber;
    };

    // reactions that do SIDE EFFECTS
    authenticateReaction = autorun(async () => {
        if (this.freezePinCode) {
            this.isAuthenticating = true;
            try {
                const userData = await BACKEND_API.login({
                    pin: toStringFromObject(this.pinCode),
                    phoneNumber: processPhoneNumber(this.phoneNumber),
                });
                // @TODO: Token is a "for now" placeholder implementation. To be removed when official
                // strategy for token is decided.
                this.setCredentials(userData);
            } catch (err) {
                this.authenticationFailed = true;
                console.log(err);
            }
        }
    });
    authenticationFailedReaction = autorun(() => {
        if (this.authenticationFailed) {
            this.pinCodeIsSet = false;
            this.isAuthenticating = false;
            window.setTimeout(() => {
                this.authenticationFailed = false;
                this.pinCode = DEFAULT_PIN;
            }, 1500);
        }
    });
    authenticationSuccessfulReaction = autorun(() => {
        if (!this.isAuthenticated) return;
        console.log('Logged in successful, persisting to local storage');
        this.isAuthenticating = false;
        this.authenticationFailed = false;
        persistToStorage('user', {
            username: this.username,
            token: this.token,
            phoneNumber: this.phoneNumber,
            balance: this.balance,
        });
    });
}

export default decorate(UserStore, {
    isAuthenticating: observable,
    isAuthenticated: computed,
    authenticationFailed: observable,
    phoneNumberIncorrect: computed,
    token: observable,
    phoneNumber: observable,
    balance: observable,
    pinCode: observable,
    setPhoneNumber: action,
    setInputCode: action,
    setCredentials: action,
});
