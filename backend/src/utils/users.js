const phoneNumberFormat = '^[+]{1}[0-9]{1,}$';
const validateUsername = (username) => {
    if (typeof username !== 'string' || username.length === 0) {
        return 'Username is not valid';
    }
};

const validateUserId = (userId) => {
    if (typeof userId !== 'number' || isNaN(userId)) {
        return 'User Id is not valid';
    }
};

const validateUserPhone = (phoneNumber) => {
    if (
        typeof phoneNumber !== 'string' ||
        phoneNumber.length === 0 ||
        !phoneNumber.match(phoneNumberFormat)
    ) {
        return 'Phone number is not valid';
    }
};

const validateUserPin = (pin) => {
    if (typeof pin !== 'string' || pin.length !== 4) {
        return 'Pin is not valid';
    }
};

const validateUserObj = (user) => {
    const nameError = validateUsername(user.username);
    if (nameError) {
        return nameError;
    }
    const phoneError = validateUserPhone(user.phoneNumber);
    if (phoneError) {
        return phoneError;
    }
};

const validateUserPhoneAndPin = (phoneNumber, pin) => {
    const phoneError = validateUserPhone(phoneNumber);
    if (phoneError) {
        return phoneError;
    }
    const pinError = validateUserPin(pin);
    if (pinError) {
        return pinError;
    }
};

module.exports = {
    validateUsername,
    validateUserObj,
    validateUserPhone,
    validateUserPin,
    validateUserPhoneAndPin,
    validateUserId,
};
