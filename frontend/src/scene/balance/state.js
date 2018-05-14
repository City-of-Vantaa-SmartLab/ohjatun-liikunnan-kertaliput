import { observable, computed, decorate, action } from 'mobx';

class BalanceViewState {
    amount = 0;
    formShown = false;
    askValidate = false;

    get formIncorrect() {
        return (
            this.askValidate &&
            (this.amount < 0 || this.amount > 50) &&
            this.showForm
        );
    }

    showForm() {
        this.formShown = true;
    }
    hideForm() {
        this.formShown = false;
    }
    setAmount(amount) {
        if (this.formIncorrect) return;
        this.amount = amount;
    }
    startValidate() {
        this.askValidate = true;
    }
}

export default decorate(BalanceViewState, {
    amount: observable,
    formShown: observable,
    askValidate: observable,
    formIncorrect: computed,
    showForm: action.bound,
    hideForm: action.bound,
    setAmount: action.bound,
    startValidate: action.bound,
});
