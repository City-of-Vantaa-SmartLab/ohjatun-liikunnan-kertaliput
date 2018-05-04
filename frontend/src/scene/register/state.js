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

    submitData = async () => {
        try {
            const responseFromServer = await register({
                username: this.username,
                phoneNumber: processPhoneNumber(this.phoneNumber),
            });
            this.userStore.setCredentials({
                phoneNumber: responseFromServer.phoneNumber,
                username: responseFromServer.username,
            });
            this.submitSuccess = true;
            this.submitError = false;
            this.submitting = false;
        } catch (error) {
            console.error(error);
            this.submitError = true;
            this.submitting = false;
        }
    };
}

export default decorate(RegisterFormState, {
    username: observable,
    phoneNumber: observable,
    submitError: observable,
    submitting: observable,
    submitSuccess: observable,
    formIsValid: computed,
    setPhoneNumber: action.bound,
    setUsername: action.bound,
    submitData: action.bound,
});