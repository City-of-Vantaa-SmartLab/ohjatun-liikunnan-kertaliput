const express = require('express');
const services = require('../services');
const router = express.Router();
const db = require('../db');
const logger = require('../utils/logging');
const auth = require('../auth');
const utils = require('../utils');
const sequalize = require('../sequalize_pg');

const addBalance = async (req, res) => {
    try {
        const amount = +req.query.amount;

        const validationErrors = utils.payments.validateAmount(amount);
        if (validationErrors) {
            return res.status(422).json(validationErrors);
        }
        const dbUser = await db.users.getUser(req.user.phoneNumber);

        const paymentObj = {
            amount,
            userId: dbUser.id,
            username: dbUser.username,
        };

        // This corresponds to Paytrail API docs "Initiate new payment (POST /payments)"
        const paymentProviders = await services.payments.getPaymentProviders(paymentObj);
        if (!paymentProviders) {
            throw new Error(`Could not get payment providers.`);
        } else {
            logger.log('Payments', 'Got payment providers');
            res.status(200).json({
                providers: paymentProviders
            });
        }
    } catch (err) {
        res
            .status(500)
            .json(`Failed to initiate payment. Error: ${err.message}`);
    }
};

const getPaymentDetails = async (req, res) => {
    try {
        const orderNumber = req.query.orderNumber;
        const user = req.user;
        if (orderNumber === null) {
            return res.status(422).json('Order number is not valid');
        }
        const payment = await db.payments.getPaymentByOrderNumber(orderNumber);
        if (!payment) {
            return res
                .status(422)
                .json('Payment details not available in the system.');
        }

        const dbUser = await db.users.getUser(user.phoneNumber);
        const paymentDetails = {
            amount: payment.amount,
            status: payment.payment_status,
            balance: dbUser.balance,
        };
        res.status(200).json(paymentDetails);
    } catch (err) {
        res
            .status(500)
            .json(`Failed to get payment details. Error: ${err.message}`);
    }
};

// Check query string for technical validity.
// Return true if everything OK.
const checkQueryValidity = (query) => {
    if (!query['checkout-status']) {
        logger.error('Payments', 'Query is missing checkout-status.');
        return false;
    }
    if (!query['checkout-stamp']) {
        logger.error('Payments', 'Query is missing checkout-stamp.');
        return false;
    }
    const signature = services.payments.calculateCheckoutParamsHmac(query, '');
    if (signature != query['signature']) {
        logger.error('Payments', "Query signature doesn't match computed.");
        return false;
    }
    return true;
}

const paymentReturn = async (req, res) => {
    try {
        logger.log('Payments', 'Payment return called');

        if (!checkQueryValidity(req.query)) {
            logger.error('Payments', 'Query failed validity check.');
            return res.redirect(`/app/payment-complete?status=3`);
        }

        const checkoutStatus = req.query['checkout-status'];
        const orderNumber = req.query['checkout-stamp'];
        logger.log('Payments', `Payment checkout status ${checkoutStatus} order number ${orderNumber}`);

        const payment = await db.payments.getPaymentByOrderNumber(orderNumber);
        if (!payment) {
            logger.error('Payments', `Payment details not available in the system. Payment order: ${payment.order_number}`);
            return res.redirect(`/app/payment-complete?status=1`);
        }

        if (payment.payment_status === 1) {
            logger.error('Payments', `This payment was already processed. Payment order: ${payment.order_number}`);
            return res.redirect(`/app/payment-complete?status=2`);
        }

        if (checkoutStatus === 'ok') {
            const dbUser = await db.users.getUserById(payment.userId);
            const newBalance = payment.amount + dbUser.balance;
            await sequalize.transaction(async (transaction) => {
                await db.payments.updatePaymentStatus(orderNumber, 1, transaction);
                await db.reservations.updateUserBalance(dbUser.id, newBalance, transaction);
            });
            res.redirect(
                `/app/payment-complete?orderNumber=${orderNumber}&amount=${payment.amount}&balance=${newBalance}&status=0`
            );
        } else {
            logger.error('Payments', `Payment failed with status: ${checkoutStatus}.`);
            return res.redirect(`/app/payment-complete?status=3`);
        }
    } catch (err) {
        logger.error('Payments', `Payment failed with error message: ${err.message}.`);
        return res.redirect(`/app/payment-complete?status=4`);
    }
};

router.get('/add-balance', auth.requireAuth, addBalance);
router.get('/get-payment-details', auth.requireAuth, getPaymentDetails);
router.get('/payment-return', paymentReturn);

module.exports = router;
