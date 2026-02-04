const auth = require('../auth');
const express = require('express');
const router = express.Router();
const db = require('../db');
const utils = require('../utils');
const crypto = require('crypto');
const services = require('../services');
const i18n = require('../i18n').i18n();
const logger = require('../utils/logging');
const getUser = async (req, res) => {
    try {
        const phoneNumber = req.query.phoneNumber;
        const validationErrors = utils.users.validateUserPhone(phoneNumber);
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            const user = await db.users.getUser(phoneNumber);
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).json(`Failed to get user. Error: ${err.message}`);
    }
};

const checkLogin = async (req, res) => {
    const pendingPayment = await db.payments.getPendingPaymentOfUser(req.user.dataValues.id);
    if(pendingPayment){
        if(utils.payments.checkPendingPaymentIsValid(pendingPayment)){
            req.user.dataValues.pendingPayment = pendingPayment;
        } else {
            await db.payments.deletePaymentByOrderNumber(pendingPayment["order_number"])
        }
    }
    res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
    try {
        const user = req.body;
        const validationErrors = utils.users.validateUserObj(user);
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            const authUser = req.user;
            await db.users.updateUser(user, authUser.phoneNumber);
            res.status(200).json('Updated user details');
        }
    } catch (err) {
        res
            .status(500)
            .json(`Failed to update user details. Error: ${err.message}`);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        const validationErrors = utils.users.validateUserPhone(
            user.phoneNumber
        );
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            await db.users.deleteUser(user.phoneNumber);
            res.status(200).json('Deleted user');
        }
    } catch (err) {
        res.status(500).json(`Failed to delete user. Error: ${err.message}`);
    }
};

const createUser = async (req, res) => {
    try {
        const user = req.body;
        const validationErrors = utils.users.validateUserObj(user);
        if (validationErrors) {
            return res.status(422).json(validationErrors);
        }
        logger.log('Users', `Creating new user with phone number ${utils.users.maskPhone(user.phoneNumber)}`);
        const dbUser = await db.users.getUser(user.phoneNumber);
        if (dbUser) {
            return res.status(409).json('PhoneNumber already exists!.');
        }
        const token = crypto.randomBytes(16).toString('hex');
        user.token = token;
        const pin = crypto.randomInt(1000, 10000).toString();
        user.pin = pin;
        const createdUser = await db.users.createUser(user);
        const message = i18n.users.register.confirmationSms
            .replace('{pin}', pin);
        if (!process.env.TELIA_USERNAME) {
            logger.log('Users', `New user created with phone number ${createdUser.phoneNumber} and PIN ${pin}`);
            return res
                .status(201)
                .json(
                    'Successfully created the account. Your login PIN is in console log.'
                );
        }
        const response = await services.sms.sendMessageToUser(
            createdUser,
            message
        );
        if (response) {
            logger.log('Users', 'User created successfully.');
            return res
                .status(201)
                .json(
                    `Successfully created the account. Your login PIN will arrive shortly in your phone number ${
                    createdUser.phoneNumber
                    }.`
                );
        } else {
            logger.error('Users', 'Sending SMS failed for new user.');
            return res
                .status(500)
                .json(`Sending SMS failed for "${user.phoneNumber}". Please try again.`);
        }
    } catch (err) {
        logger.error('Users', `Failed to create new user. Error: ${err.message}`);
        res
            .status(500)
            .json('Failed to create new user.');
    }
};

const login = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const pin = req.body.pin;
        const validationErrors = utils.users.validateUserPhoneAndPin(
            phoneNumber,
            pin
        );
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            const user = await db.users.getUserByPhoneAndPin(phoneNumber, pin);
            if (user) {
                const pendingPayment  = await db.payments.getPendingPaymentOfUser(user.id);
                if (pendingPayment) {
                    if(utils.payments.checkPendingPaymentIsValid(pendingPayment)){
                        user.dataValues.pendingPayment = pendingPayment;
                    } else {
                        await db.payments.deletePaymentByOrderNumber(pendingPayment["order_number"])
                    }
                }
                res
                    .cookie('token', user.token, {
                        signed: true,
                        httpOnly: true,
                    })
                    .status(200)
                    .json(user);
            } else {
                res.status(401).json('Phone number or PIN is incorrect!.');
            }
        }
    } catch (err) {
        res.status(500).json(`Failed to login. Error: ${err.message}`);
    }
};

const logout = async (req, res) => {
    res
        .clearCookie('token')
        .status(200)
        .send('Ok');
};

const resetPin = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const validationErrors = utils.users.validateUserPhone(phoneNumber);
        if (validationErrors) {
            res.status(422).json(validationErrors);
        } else {
            const user = await db.users.getUser(phoneNumber);
            if (user) {
                const pin = crypto.randomInt(1000, 10000).toString();
                user.pin = pin;
                await db.users.updateUser(user, phoneNumber);
                const message = i18n.users.resetPin.confirmationSms
                    .replace('{pin}', pin);
                if (!process.env.TELIA_USERNAME) {
                    logger.log('Users', `PIN reset for user with phone number ${user.phoneNumber}. New PIN is ${pin}`);
                    return  res
                        .status(201)
                        .json(
                            'Successfully Reset the PIN. Your new PIN is in console log.'
                        );
                }

                const response = await services.sms.sendMessageToUser(
                    user,
                    message
                );
                if (response) {
                    res
                        .status(201)
                        .json(
                            `Successfully Reset the PIN. New PIN will arrive shortly in your phone number ${phoneNumber}.`
                        );
                } else {
                    res
                        .status(500)
                        .json(
                            `Sending SMS failed for "${phoneNumber}". Please try again.`
                        );
                }
            } else {
                res.status(401).json('Phone number is not valid!.');
            }
        }
    } catch (err) {
        res
            .status(500)
            .json(`Failed to generate new PIN. Error: ${err.message}`);
    }
};

router.post('/', createUser);
router.put('/me', auth.requireAuth, updateUser);
router.get('/me', auth.requireAuth, checkLogin);
router.get('/:phoneNumber', auth.requireAuth, getUser);
router.delete('/me', auth.requireAuth, deleteUser);
router.post('/login', login);
router.post('/logout', auth.requireAuth, logout);
router.post('/reset-pin', resetPin);

module.exports = router;
