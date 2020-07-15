module.exports = {
    validateAmount: (amount) => {
        if (
            typeof amount !== 'number' ||
            isNaN(amount) ||
            amount <= 0 ||
            amount > 50
        ) {
            return 'Amount not valid. Please try with a valid amount';
        }
    },

    checkPendingPaymentIsValid: (pendingPayment) => {
        const paymentDate = new Date(pendingPayment.createdAt)
        const now = new Date()
        const diff = now.getTime() - paymentDate.getTime();
        const daysOld = diff/(60*60*24*1000);
        return daysOld < 1;
    }
};
