const utils = require('../src/utils');

describe('Validation Utilities', () => {
    describe('User Validation', () => {
        describe('validateUsername', () => {
            test('should reject invalid username types and empty strings', () => {
                expect(utils.users.validateUsername(123)).toBeTruthy();
                expect(utils.users.validateUsername(null)).toBeTruthy();
                expect(utils.users.validateUsername('')).toBeTruthy();
                expect(utils.users.validateUsername({})).toBeTruthy();
            });

            test('should accept valid usernames', () => {
                expect(utils.users.validateUsername('John Doe')).toBeUndefined();
                expect(utils.users.validateUsername('a')).toBeUndefined();
                expect(utils.users.validateUsername('Test User 123')).toBeUndefined();
            });
        });

        describe('validateUserPhone', () => {
            test('should reject invalid phone number formats', () => {
                // Missing + prefix
                expect(utils.users.validateUserPhone('358123456789')).toBeTruthy();
                // Contains non-digits after +
                expect(utils.users.validateUserPhone('+358-123-456')).toBeTruthy();
                expect(utils.users.validateUserPhone('abc')).toBeTruthy();
                // Empty or non-string
                expect(utils.users.validateUserPhone('')).toBeTruthy();
                expect(utils.users.validateUserPhone(123456789)).toBeTruthy();
            });

            test('should accept valid international phone formats', () => {
                expect(utils.users.validateUserPhone('+358123456789')).toBeUndefined();
                expect(utils.users.validateUserPhone('+1234567890')).toBeUndefined();
                expect(utils.users.validateUserPhone('+44123')).toBeUndefined();
            });
        });

        describe('validateUserPin', () => {
            test('should reject pins with wrong length or type', () => {
                expect(utils.users.validateUserPin(1234)).toBeTruthy();
                expect(utils.users.validateUserPin('123')).toBeTruthy();
                expect(utils.users.validateUserPin('12345')).toBeTruthy();
                expect(utils.users.validateUserPin('')).toBeTruthy();
            });

            test('should accept 4-character pins', () => {
                expect(utils.users.validateUserPin('1234')).toBeUndefined();
                // Note: Current validation allows any 4 characters, not just digits
                expect(utils.users.validateUserPin('abcd')).toBeUndefined();
            });
        });

        describe('validateUserObj', () => {
            test('should reject user object with invalid username', () => {
                const user = { username: '', phoneNumber: '+358123456789' };
                expect(utils.users.validateUserObj(user)).toBeTruthy();
            });

            test('should reject user object with invalid phone', () => {
                const user = { username: 'John Doe', phoneNumber: '123456' };
                expect(utils.users.validateUserObj(user)).toBeTruthy();
            });

            test('should accept valid user object', () => {
                const user = { username: 'John Doe', phoneNumber: '+358123456789' };
                expect(utils.users.validateUserObj(user)).toBeUndefined();
            });
        });

        describe('validateUserPhoneAndPin', () => {
            test('should reject invalid credentials', () => {
                expect(utils.users.validateUserPhoneAndPin('123456', '1234')).toBeTruthy();
                expect(utils.users.validateUserPhoneAndPin('+358123456789', '123')).toBeTruthy();
            });

            test('should accept valid phone and pin', () => {
                expect(utils.users.validateUserPhoneAndPin('+358123456789', '1234')).toBeUndefined();
            });
        });
    });

    describe('Payment Validation', () => {
        describe('validateAmount', () => {
            test('should reject invalid amount types', () => {
                expect(utils.payments.validateAmount('10')).toBeTruthy();
                expect(utils.payments.validateAmount(NaN)).toBeTruthy();
            });

            test('should reject amounts outside valid range (1-50)', () => {
                expect(utils.payments.validateAmount(0)).toBeTruthy();
                expect(utils.payments.validateAmount(-1)).toBeTruthy();
                expect(utils.payments.validateAmount(51)).toBeTruthy();
            });

            test('should accept valid payment amounts', () => {
                expect(utils.payments.validateAmount(10)).toBeUndefined();
                expect(utils.payments.validateAmount(50)).toBeUndefined();
                expect(utils.payments.validateAmount(0.01)).toBeUndefined(); // Just above zero
            });
        });

        describe('checkPendingPaymentIsValid', () => {
            test('should validate payments less than 24 hours old', () => {
                const fresh = { createdAt: new Date() };
                expect(utils.payments.checkPendingPaymentIsValid(fresh)).toBe(true);

                const almostExpired = { createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23) }; // 23h ago
                expect(utils.payments.checkPendingPaymentIsValid(almostExpired)).toBe(true);
            });

            test('should invalidate payments 24 hours or older', () => {
                const exactlyOneDay = { createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) };
                expect(utils.payments.checkPendingPaymentIsValid(exactlyOneDay)).toBe(false);

                const veryOld = { createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) }; // 7 days
                expect(utils.payments.checkPendingPaymentIsValid(veryOld)).toBe(false);
            });
        });
    });

    // Consolidated ID validation tests - all follow same pattern
    describe('ID Validation (Common Pattern)', () => {
        const idValidators = [
            { name: 'courseId', fn: utils.courses.validateCourseId },
            { name: 'eventId', fn: utils.events.validateEventId },
            { name: 'userId', fn: utils.users.validateUserId },
        ];

        idValidators.forEach(({ name, fn }) => {
            describe(`validate${name.charAt(0).toUpperCase() + name.slice(1)}`, () => {
                test(`should reject non-numeric ${name}`, () => {
                    expect(fn('1')).toBeTruthy();
                    expect(fn(null)).toBeTruthy();
                    expect(fn(NaN)).toBeTruthy();
                });

                test(`should accept valid numeric ${name}`, () => {
                    expect(fn(1)).toBeUndefined();
                    expect(fn(123)).toBeUndefined();
                    // Note: validates 0 as valid, though it may not be a real database ID
                    expect(fn(0)).toBeUndefined();
                });
            });
        });
    });
});
