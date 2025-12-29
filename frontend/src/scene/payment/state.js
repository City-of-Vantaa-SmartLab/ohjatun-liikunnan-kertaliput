import { observable, action, makeObservable } from 'mobx';
import qs from 'qs';

class PaymentFormState {
    requestToClose = false;
    paymentFailed = true;

    constructor(userStore) {
        this.userStore = userStore;
        makeObservable(this, {
            requestToClose: observable,
            paymentFailed: observable,
            validateRequest: action.bound,
        });
    }

    validateRequest(request) {
        if (request && request.length > 0) {
            const parsed = qs.parse(request.slice(1));
            if (parsed.status === '0') {
                this.paymentFailed = false;
                return parsed;
            }
        }
    }
}

export default PaymentFormState;
