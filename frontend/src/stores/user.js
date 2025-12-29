import {
    makeObservable,
    observable,
    action,
    autorun,
    computed,
    runInAction,
} from 'mobx';
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
        makeObservable(this, {
            isAuthenticating: observable,
            isAuthenticated: computed,
            authenticationFailed: observable,
            phoneNumberIncorrect: computed,
            freezePinCode: computed,
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
            addBalance: action,
            requestAddBalance: action,
            resetCredentials: action,
            logout: action.bound,
        });

        // Setup autoruns AFTER makeObservable
        this.setupReactions();
        this.checkAuthenticationStatusOnStart();
    }

    setupReactions() {
        // reactions that do SIDE EFFECTS
        this.authenticateReaction = autorun(async () => {
            if (this.freezePinCode) {
                runInAction(() => {
                    this.isAuthenticating = true;
                });
                try {
                    const userData = await login({
                        pin: toStringFromObject(this.pinCode),
                        phoneNumber: processPhoneNumber(this.phoneNumber),
                    });
                    this.setCredentials(userData);
                } catch (err) {
                    runInAction(() => {
                        this.authenticationFailed = true;
                    });
                    console.error(err);
                }
            }
        });

        this.fetchUserReservedCoursesOnAuth = autorun(async () => {
            if (this.isAuthenticated) {
                try {
                    const reservedCourses = await fetchReservedCourses();
                    runInAction(() => {
                        this.reservedCourses = reservedCourses;
                    });
                } catch (error) {
                    console.error(
                        'Cannot fetch reserved courses for this user',
                        error
                    );
                }
            }
        });

        this.authenticationFailedReaction = autorun(() => {
            if (this.authenticationFailed) {
                runInAction(() => {
                    this.isAuthenticating = false;
                });
                // this effect is delay after 1 seconds
                window.setTimeout(() => {
                    runInAction(() => {
                        this.authenticationFailed = false;
                        this.pinCode = DEFAULT_PIN;
                    });
                }, 1000);
            }
        });

        this.authenticationSuccessfulReaction = autorun(() => {
            if (!this.isAuthenticated) return;

            runInAction(() => {
                this.isAuthenticating = false;
                this.authenticationFailed = false;
            });
        });
    }

    checkAuthenticationStatusOnStart = async () => {
        try {
            const userData = await checkLoginStatus();
            this.setCredentials(userData);
        } catch (error) {
            console.log('Not logged in.');
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
        // Validate position and prevent changes when PIN is complete
        if (this.freezePinCode || position < 0 || position > 3) return false;

        // Allow empty string (for backspace) or single digit 0-9
        if (value !== '' && !/^[0-9]$/.test(value)) return false;

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
            const providersResponse = await requestAddBalanceApi(amount);
            if (providersResponse.providers) {
                console.log(
                    'Got payment providers, count: ' +
                        providersResponse.providers.length
                );
                return providersResponse.providers;
            } else {
            }
            throw new Error('Did not get an array of payment providers.');
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
}

export default userStore;
