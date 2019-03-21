const randtoken = require('rand-token');
const db = require('../src/db');
const Sequelize = require('sequelize');
const utils = require('../src/utils');
const sequelize = require('../src/sequalize_pg');

describe('Users API testing.', async () => {
    beforeAll(async () => {
        return await sequelize.sync();
    });
    let token = randtoken.generate(16);
    let user = {
        username: 'test user',
        phoneNumber: '+358123412345',
        pin: '1234',
        token: token,
    };
    test('should create user and get usr by token', async () => {
        await db.users.deleteUser(user.phoneNumber);
        await db.users.createUser(user);
        const dbuser = await db.users.getUserByToken(token);
        expect(dbuser).not.toBeNull();
        expect(dbuser.username).toEqual(user.username);
        expect(dbuser.phoneNumber).toEqual(user.phoneNumber);
        expect(dbuser.pin).toEqual(user.pin);
        expect(dbuser.token).toEqual(user.token);
    });

    test('should not create user with duplicate phone number', async () => {
        let error = 'No Errors';
        try {
            await db.users.createUser(user);
        } catch (err) {
            error = err;
        }
        expect(error.name).toEqual('SequelizeUniqueConstraintError');
        expect(error.message).toEqual('Validation error');
    });

    test('should update user and get user by phone and pin', async () => {
        user.username = 'test Updated';
        user.pin = '1232';

        await db.users.updateUser(user, user.phoneNumber);
        const dbuser = await db.users.getUserByPhoneAndPin(
            user.phoneNumber,
            user.pin
        );
        expect(dbuser).not.toBeNull();
        expect(dbuser.username).toEqual(user.username);
        expect(dbuser.phoneNumber).toEqual(user.phoneNumber);
        expect(dbuser.pin).toEqual(user.pin);
        expect(dbuser.token).toEqual(user.token);
    });

    test('delete user by phone', async () => {
        const phoneNumber = '+358123412345';
        await db.users.deleteUser(phoneNumber);
        const dbuser = await db.users.getUser(phoneNumber);
        expect(dbuser).toBeNull();
    });

    test('check for valid username', () => {
        const invalidUsername = 'Username is not valid';
        expect(utils.users.validateUsername('ABCDEF')).toBeUndefined();
        expect(utils.users.validateUsername('1234')).toBeUndefined();
        expect(utils.users.validateUsername('')).toEqual(invalidUsername);
        expect(utils.users.validateUsername(1234)).toEqual(invalidUsername);
    });

    test('check for valid Pin', () => {
        const invalidPin = 'Pin is not valid';
        expect(utils.users.validateUserPin(1234)).toEqual(invalidPin);
        expect(utils.users.validateUserPin(123)).toEqual(invalidPin);
        expect(utils.users.validateUserPin(12345)).toEqual(invalidPin);
        expect(utils.users.validateUserPin('1234')).toBeUndefined();
    });

    test('check saldo update is working properly', async () => {
        const number = '+358' + randtoken.generate(9, '0123456789');
        user.phoneNumber = number;
        await db.users.createUser(user);
        let dbuser = await db.users.getUserByToken(token);
        expect(dbuser.balance).toEqual(0);
        await db.reservations.updateUserBalance(dbuser.id, 1.5);
        dbuser = await db.users.getUserByToken(token);
        expect(dbuser.balance).toEqual(1.5);
        await db.reservations.updateUserBalance(dbuser.id, 0);
        dbuser = await db.users.getUserByToken(token);
        expect(dbuser.balance).toEqual(0);
    });

    test('check for valid phone numbers', () => {
        const phoneNumberInvalid = 'Phone number is not valid';
        expect(utils.users.validateUserPhone(30856)).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('sdstr')).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('123 123')).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('123')).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('+358503 085600')).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('+358503 ABC 085600')).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('+358 - 503 - 085600')).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('+(358)503 085600')).toEqual(
            phoneNumberInvalid
        );
        expect(utils.users.validateUserPhone('+3')).toBeUndefined();
        expect(utils.users.validateUserPhone('+358')).toBeUndefined();
        expect(utils.users.validateUserPhone('+1234545456')).toBeUndefined();
    });
});
