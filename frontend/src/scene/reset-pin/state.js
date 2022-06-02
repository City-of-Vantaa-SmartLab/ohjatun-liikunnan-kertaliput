import { observable, decorate, computed, action } from 'mobx';
import { validatePhoneNumber, processPhoneNumber } from 'utils';
import { resetPin } from '../../apis';

class ResetPinFormState {
    phoneNumber = '';
    submitError = false;
    submitting = false;
    submitSuccess = false;

    constructor(userStore) {
        this.userStore = userStore;
    }

    get formIsValid() {
        return validatePhoneNumber(this.phoneNumber);
    }
    setPhoneNumber = (e) => (this.phoneNumber = e.target.value);

    resetPin = async () => {
        try {
            this.submitting = true;
            await resetPin({
                phoneNumber: processPhoneNumber(this.phoneNumber),
            });
            this.submitSuccess = true;
            this.submitError = false;
            this.submitting = false;
            this.userStore.authenticationFailed = false;
            // for quality of life
            this.userStore.setPhoneNumber(this.phoneNumber);
        } catch (error) {
            console.error(error);
            this.submitError = true;
            this.submitting = false;
        }
    };
}

export default decorate(ResetPinFormState, {
    phoneNumber: observable,
    submitError: observable,
    submitting: observable,
    submitSuccess: observable,
    formIsValid: computed,
    setPhoneNumber: action.bound,
    resetPin: action.bound,
});
