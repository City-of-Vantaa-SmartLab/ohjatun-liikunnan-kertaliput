const express = require('express');
const services = require('../services');
const router = express.Router();
const db = require('../db');
const auth = require('../auth');
const utils = require('../utils');

const BamboraReturnCodes = {
    SUCCESS: 0,
};

const generatePaymentRedirectUrl = async (req, res) => {
    try {
        const paymentObj = req.body;
        const validationErrors = utils.payments.validateAmount(
            paymentObj.amount
        );
        if (validationErrors) {
            return res.status(422).json(validationErrors);
        }
        const dbUser = await db.users.getUser(req.user.phoneNumber);
        paymentObj.userId = dbUser.id;
        paymentObj.username = dbUser.username;
        const url = await services.payments.getPaymentRedirectUrl(paymentObj);
        res.status(200).json(url);
    } catch (err) {
        res
            .status(500)
            .json(`Failed to get payment redirect url. Error: ${err.message}`);
    }
};

const paymentNotify = async (req, res) => {
    res.status(200).json('Payment notification request received from Bambora');
};

const paymentReturn = async (req, res) => {
    const response = req.query.RETURN_CODE;
    if (response === BamboraReturnCodes.SUCCESS) {
        const ordernumber = req.query.ORDER_NUMBER;
        const payment = await db.payments.getPayment(ordernumber);
        if (!payment) {
            return res
                .status(422)
                .json('Payment details not available in the system.');
        }
        const dbUser = await db.users.getUserById(payment.userId);
        const newBalance = payment.amount + dbUser.balance;
        await db.reservations.updateUserBalance(dbUser.id, newBalance);
        const balance = await db.reservations.getUserBalance(dbUser.id);
        res
            .status(200)
            .json(`Payment successful. Updated user balance to: ${balance}`);
    } else {
        res.status(422).json(`Payment failed. Please try again later`);
    }
};

router.post(
    '/generate-payment-redirect-url',
    auth.requireAuth,
    generatePaymentRedirectUrl
);
router.get('/payment-notify', paymentNotify);
router.get('/payment-return', paymentReturn);

module.exports = router;