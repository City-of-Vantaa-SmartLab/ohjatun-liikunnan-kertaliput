import { observable, decorate, computed, action } from 'mobx';
import {
    validateUsername,
    validatePhoneNumber,
    processPhoneNumber,
} from 'utils';
import { register } from '../../apis';

class RegisterFormState {
    username = '';
    phoneNumber = '';
    submitError = false;
    submitting = false;
    submitSuccess = false;
    phoneNumberAlreadyExists = false;
    agreedToTermsOfService = false;
    termsOfServiceShown = false;
    // for internal use
    _usedTouch = false;

    constructor(userStore) {
        this.userStore = userStore;
    }

    get formIsValid() {
        return (
            validatePhoneNumber(this.phoneNumber) &&
            validateUsername(this.username)
        );
    }

    setUsername = (e) => (this.username = e.target.value);
    setPhoneNumber = (e) => (this.phoneNumber = e.target.value);
    checkAgreeToTermAndService = (e) => {
        if (e.type === 'click') {
            !this._usedTouch &&
                (this.agreedToTermsOfService = !this.agreedToTermsOfService);
        }
        if (e.type === 'touchstart') {
            this.agreedToTermsOfService = !this.agreedToTermsOfService;
            this._usedTouch = true;
        }
    };
    showTermsOfService = () => (this.termsOfServiceShown = true);
    hideTermsOfService = () => (this.termsOfServiceShown = false);

    submitData = async () => {
        try {
            await register({
                username: this.username,
                phoneNumber: processPhoneNumber(this.phoneNumber),
            });
            this.userStore.setCredentials({
                phoneNumber: this.phoneNumber,
                username: this.username,
            });
            this.submitSuccess = true;
            this.submitError = false;
            this.submitting = false;
        } catch (error) {
            console.error(error);
            this.submitError = 'validation';
            this.submitting = false;
            if (error.code === '409') {
                this.submitError = 'alreadyExist';
            }
        }
    };
}

export default decorate(RegisterFormState, {
    username: observable,
    phoneNumber: observable,
    submitError: observable,
    submitting: observable,
    agreedToTermsOfService: observable,
    termsOfServiceShown: observable,
    phoneNumberAlreadyExists: observable,
    submitSuccess: observable,
    formIsValid: computed,
    setPhoneNumber: action.bound,
    setUsername: action.bound,
    submitData: action.bound,
    checkAgreeToTermAndService: action.bound,
    showTermsOfService: action.bound,
    hideTermsOfService: action.bound,
});
