const auth = require('../auth');
const express = require('express');
const router = express.Router();
const models = require('../models');
const db = require('../db');
const utils = require('../utils');
const randtoken = require('rand-token');
const dateFns = require('date-fns');

const getUser = async (req, res) => {
    try {
        const phoneNumber = req.query.phoneNumber;
        const validationErrors = utils.users.validateUserPhone(phoneNumber);
        if (validationErrors) {
            res.status(422).send(validationErrors);
        } else {
            const user = await db.users.getUser(phoneNumber);
            res.status(200).send(user);
        }
    } catch (err) {
        res.status(500).send(`Failed to get user. Error: ${err.message}`);
    }
};

const checkLogin = async (req, res) => {
    res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
    try {
        const user = req.body;
        const validationErrors = utils.users.validateUserObj(user);
        if (validationErrors) {
            res.status(422).send(validationErrors);
        } else {
            const authUser = req.user;
            await db.users.updateUser(user, authUser.phoneNumber);
            res.status(200).send('Updated user details');
        }
    } catch (err) {
        res
            .status(500)
            .send(`Failed to update user details. Error: ${err.message}`);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        const validationErrors = utils.users.validateUserPhone(
            user.phoneNumber
        );
        if (validationErrors) {
            res.status(422).send(validationErrors);
        } else {
            await db.users.deleteUser(user.phoneNumber);
            res.status(200).send('Deleted user');
        }
    } catch (err) {
        res.status(500).send(`Failed to delete user. Error: ${err.message}`);
    }
};

const createUser = async (req, res) => {
    try {
        const user = req.body;
        const validationErrors = utils.users.validateUserObj(user);
        if (validationErrors) {
            res.status(422).send(validationErrors);
        } else {
            const token = randtoken.generate(16);
            user.token = token;
            const pin = randtoken.generate(4, '0123456789');
            user.pin = pin;
            const createdUser = await db.users.createUser(user);
            console.log(`User PIN Generated: ${pin}`);
            res.status(201).send(createdUser);
        }
    } catch (err) {
        res
            .status(500)
            .send(`Failed to create new user. Error: ${err.message}`);
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
            res.status(422).send(validationErrors);
        } else {
            const user = await db.users.getUserByPhoneAndPin(phoneNumber, pin);
            if (user) {
                res
                    .cookie('token', user.token, {
                        signed: true,
                        httpOnly: true,
                    })
                    .status(200)
                    .send(user);
            } else {
                res.status(401).send('Phone number or PIN is incorrect!.');
            }
        }
    } catch (err) {
        res.status(500).send(`Failed to login. Error: ${err.message}`);
    }
};

const resetPin = async (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        const validationErrors = utils.users.validateUserPhone(phoneNumber);
        if (validationErrors) {
            res.status(422).send(validationErrors);
        } else {
            const user = await db.users.getUser(phoneNumber);
            if (user) {
                const pin = randtoken.generate(4, '0123456789');
                user.pin = pin;
                await db.users.updateUser(user);
                console.log(`New PIN Generated: ${pin}`);
                res.status(200).send('New PIN generated!');
            } else {
                res.status(401).send('Phone number is not valid!.');
            }
        }
    } catch (err) {
        res
            .status(500)
            .send(`Failed to generate new PIN. Error: ${err.message}`);
    }
};

router.post('/', createUser);
router.put('/me', auth.requireAuth, updateUser);
router.get('/me', auth.requireAuth, checkLogin);
router.get('/:phoneNumber', auth.requireAuth, getUser);
router.delete('/me', auth.requireAuth, deleteUser);
router.post('/login', login);
router.post('/reset-pin', resetPin);

module.exports = router;
