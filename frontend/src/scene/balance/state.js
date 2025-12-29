import { observable, computed, action, makeObservable } from 'mobx';

class BalanceViewState {
    amount = 0;
    formShown = false;
    askValidate = false;

    constructor() {
        makeObservable(this, {
            amount: observable,
            formShown: observable,
            askValidate: observable,
            formIncorrect: computed,
            showForm: action.bound,
            hideForm: action.bound,
            setAmount: action.bound,
            startValidate: action.bound,
        });
    }

    get formIncorrect() {
        return (
            this.askValidate &&
            (this.amount <= 0 || this.amount > 50) &&
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
        this.amount = amount;
    }
    startValidate() {
        this.askValidate = true;
    }
}

export default BalanceViewState;
