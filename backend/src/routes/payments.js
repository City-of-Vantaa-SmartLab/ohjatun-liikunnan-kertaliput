const express = require('express');
const services = require('../services');
const router = express.Router();
const db = require('../db');
const auth = require('../auth');
const utils = require('../utils');
const sequalize = require('../sequalize_pg');

const BamboraReturnCodes = {
    SUCCESS: '0',
};

const PaymentProcessStatus = {
    PROCESSED: '1'
};

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

        const url = await services.payments.getPaymentRedirectUrl(paymentObj);
        res.status(301).redirect(url);
    } catch (err) {
        res
            .status(500)
            .json(`Failed to get payment redirect url. Error: ${err.message}`);
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

const paymentNotify = async (req, res) => {
    try {
        const returnCode = req.query.RETURN_CODE;
        const settled = req.query.SETTLED;
        if (returnCode === BamboraReturnCodes.SUCCESS && settled === PaymentProcessStatus.PROCESSED ) {
            const orderNumber = req.query.ORDER_NUMBER;
            const payment = await db.payments.getPendingPaymentByOrderNumber(
                orderNumber
            );
            if (!payment) {
                console.error(
                    `Cant' update payment status for the payment: ${
                        payment.order_number
                        }`
                );
                return res.status(200).json('');
            }

            if (payment.payment_status === 1) {
                console.log(
                    `Received payment-notify for the payment: ${
                        payment.order_number
                        } but it has been processed`
                );
                return res.status(200).json('');
            }

            const dbUser = await db.users.getUserById(payment.userId);
            const newBalance = payment.amount + dbUser.balance;
            await sequalize.transaction(async (transaction) => {
                await db.payments.updatePaymentStatus(
                    orderNumber,
                    settled,
                    transaction
                );

                await db.reservations.updateUserBalance(
                    dbUser.id,
                    newBalance,
                    transaction
                );
            });
            return res.status(200).json('');
        } else {
            console.error(
                `Payment has not been processed with return code: ${
                    returnCode
                } and settled: ${settled}`
            );
            res.status(400)
        }
    } catch (err) {
        console.error(
            `Payment failed with error code: ${
                err.message
                }. Please try again later`
        );
        return res.status(500);
    }
};

const paymentReturn = async (req, res) => {
    try {
        const response = req.query.RETURN_CODE;
        if (response === BamboraReturnCodes.SUCCESS) {
            const orderNumber = req.query.ORDER_NUMBER;
            const payment = await db.payments.getPaymentByOrderNumber(
                orderNumber
            );
            if (!payment) {
                console.error(
                    `Payment details not available in the system. Payment Order: ${
                        payment.order_number
                    }`
                );
                return res.redirect(`/app/payment-complete?status=1`);
            }

            if (payment.payment_status === 1) {
                console.error(
                    `This payment was already processed!. Payment Order: ${
                        payment.order_number
                    }`
                );
                return res.redirect(`/app/payment-complete?status=2`);
            }

            const dbUser = await db.users.getUserById(payment.userId);
            const newBalance = payment.amount + dbUser.balance;
            await sequalize.transaction(async (transaction) => {
                await db.payments.updatePaymentStatus(
                    orderNumber,
                    req.query.SETTLED,
                    transaction
                );

                await db.reservations.updateUserBalance(
                    dbUser.id,
                    newBalance,
                    transaction
                );
            });
            const balance = await db.reservations.getUserBalance(dbUser.id);
            res.redirect(
                `/app/payment-complete?orderNumber=${orderNumber}&amount=${
                    payment.amount
                }&balance=${newBalance}&status=0`
            );
        } else {
            console.error(
                `Payment failed with error code: ${response}. Please try again later`
            );
            return res.redirect(`/app/payment-complete?status=3`);
        }
    } catch (err) {
        console.error(
            `Payment failed with error code: ${
                err.message
            }. Please try again later`
        );
        return res.redirect(`/app/payment-complete?status=4`);
    }
};

router.get('/add-balance', auth.requireAuth, addBalance);
router.get('/get-payment-details', auth.requireAuth, getPaymentDetails);
router.get('/payment-notify', paymentNotify);
router.get('/payment-return', paymentReturn);

module.exports = router;
