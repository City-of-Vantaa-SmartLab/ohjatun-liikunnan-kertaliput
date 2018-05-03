import { decorate, observable, action, autorun, computed } from 'mobx';
import {
    toStringFromObject,
    processPhoneNumber,
    validatePhoneNumber,
} from 'utils';
import { login, checkLoginStatus } from '../apis';

// constants
const DEFAULT_PIN = {
    '0': '',
    '1': '',
    '2': '',
    '3': '',
};

class userStore {
    isAuthenticating = false;
    authenticationFailed = false;
    pinCode = DEFAULT_PIN;
    username = null;
    phoneNumber = null;
    token = null;
    balance = 0;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.checkAuthenticationStatusOnStart();
    }

    checkAuthenticationStatusOnStart = async () => {
        try {
            const userData = await checkLoginStatus();
            this.setCredentials(userData);
        } catch (error) {
            console.error(error);
        }
    };
    // computed values
    get isAuthenticated() {
        // user is authenticated if there exists a token, otherwise they are guests
        return this.token && this.username && this.phoneNumber;
    }
    get phoneNumberIncorrect() {
        return validatePhoneNumber(this.phoneNumber);
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
                const userData = await login({
                    pin: toStringFromObject(this.pinCode),
                    phoneNumber: processPhoneNumber(this.phoneNumber),
                });
                this.setCredentials(userData);
            } catch (err) {
                this.authenticationFailed = true;
                console.error(err);
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
    });
}

export default decorate(userStore, {
    isAuthenticating: observable,
    isAuthenticated: computed,
    authenticationFailed: observable,
    phoneNumberIncorrect: computed,
    token: observable,
    phoneNumber: observable,
    balance: observable,
    pinCode: observable,
    checkAuthenticationStatusOnStart: action,
    setPhoneNumber: action,
    setInputCode: action,
    setCredentials: action,
});
