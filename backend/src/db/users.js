const models = require('../models');
const db = require('../sequalize_pg');

const createUser = async (user) => {
    await models.users.create(user);
    return await getUser(user.phoneNumber);
};

const getUser = (phoneNumber) =>
    models.users.findOne({
        where: { phoneNumber },
    });

const getUserById = (id) =>
    models.users.findOne({
        where: { id },
    });

const getUserByPhoneAndPin = (phoneNumber, pin) => {
    return models.users.findOne({
        where: { phoneNumber, pin },
    });
};

const getUserByToken = (token) => {
    return models.users.findOne({
        where: { token },
    });
};

const updateUser = (user, phoneNumber) => {
    return models.users.update(
        {
            pin: user.pin,
            username: user.username,
        },
        {
            where: { phoneNumber },
        }
    );
};

const deleteUser = (phoneNumber) => {
    return models.users.destroy({
        where: { phoneNumber },
    });
};

module.exports = {
    getUser,
    getUserById,
    getUserByToken,
    getUserByPhoneAndPin,
    updateUser,
    createUser,
    deleteUser,
};
