import { decorate, observable, action, autorun, computed } from 'mobx';
import {
    toStringFromObject,
    processPhoneNumber,
    validatePhoneNumber,
} from 'utils';
import {
    login,
    checkLoginStatus,
    logout as logoutApi,
    fetchReservedCourses,
    requestAddBalance as requestAddBalanceApi,
} from '../apis';

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
    reservedCourses = null;

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
        return Object.values(this.pinCode).every((code) => code !== '');
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
    setCredentials(userData) {
        this.token = userData.token;
        this.username = userData.username;
        this.balance = userData.balance;
        this.phoneNumber = userData.phoneNumber;
        this.authenticationFailed = false;
    }
    resetCredentials() {
        this.token = null;
        this.username = null;
        this.balance = null;
        this.phoneNumber = null;
        this.pinCode = DEFAULT_PIN;
    }
    setBalance(amount) {
        if (amount > this.balance) throw new Error('Insufficient fund!');
        else this.balance = this.balance - amount;
    }

    addBalance(amount) {
        this.balance = this.balance + amount;
    }
    async requestAddBalance(amount) {
        try {
            await requestAddBalanceApi(amount);
        } catch (error) {
            console.error(error);
        }
    }

    async logout() {
        try {
            await logoutApi();
            this.resetCredentials();
        } catch (error) {
            console.error('Cannot logout', error);
        }
    }
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
    fetchUserReservedCoursesOnAuth = autorun(async () => {
        if (this.isAuthenticated) {
            try {
                const reservedCourses = await fetchReservedCourses();
                this.reservedCourses = reservedCourses;
            } catch (error) {
                console.error(
                    'Cannot fetch reserved courses for this user',
                    error
                );
            }
        }
    });
    authenticationFailedReaction = autorun(() => {
        if (this.authenticationFailed) {
            this.isAuthenticating = false;
            // this effect is delay after 1 seconds
            window.setTimeout(() => {
                this.authenticationFailed = false;
                this.pinCodeIsSet = false;
                this.pinCode = DEFAULT_PIN;
            }, 1000);
        }
    });
    authenticationSuccessfulReaction = autorun(() => {
        if (!this.isAuthenticated) return;
        console.log('Logged in successful');

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
    reservedCourses: observable,
    checkAuthenticationStatusOnStart: action,
    setPhoneNumber: action,
    setInputCode: action,
    setCredentials: action,
    setBalance: action,
    resetCredentials: action,
    logout: action.bound,
});
