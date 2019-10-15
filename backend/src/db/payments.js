const models = require('../models');
const db = require('../sequalize_pg');

const PaymentStatus = {
    SUCCESS: 1,
    FAILED: 0,
    PENDING: -1
};

const createPayment = (paymentObj) => {
    return models.payments.create(paymentObj);
};

const getPaymentByOrderNumber = (orderNumber) => {
    return models.payments.find({ where: { order_number: orderNumber } });
};

const getPendingPaymentByOrderNumber = (orderNumber) => {
    return models.payments.find({
        where: {
            order_number: orderNumber,
            payment_status: PaymentStatus.PENDING
        }
    })
};

const updatePaymentStatus = (orderNumber, status, transaction) => {
    return models.payments.update(
        { payment_status: status },
        {
            where: { order_number: orderNumber },
        },
        {
            transaction,
        }
    );
};

const getPendingPaymentOfUser = (userId) => {
    return models.payments.findOne({
        where: {
            userId: userId,
            payment_status: PaymentStatus.PENDING
        }
    })
};

module.exports = {
    createPayment,
    updatePaymentStatus,
    getPaymentByOrderNumber,
    getPendingPaymentOfUser,
    getPendingPaymentByOrderNumber,
};
