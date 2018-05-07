const axios = require('axios');
const db = require('../db');
const bambora = require('./bambora');

const tokenUrl = 'https://payform.bambora.com/pbwapi/auth_payment';
const bamboraApiUrl = 'https://payform.bambora.com/pbwapi/token/';

const getPaymentRedirectUrl = async (paymentObj) => {
    const paymentModel = bambora.createPaymentModel(paymentObj);
    await db.payments.createPayment(paymentModel);
    const paymentRequest = bambora.createBamboraPaymentRequest(paymentModel);
    const response = await axios
        .post(tokenUrl, paymentRequest)
        .catch(function(error) {
            console.log(`Failed to get payment token. Error: ${error.message}`);
        });
    const token = response.data.token;
    const redirectUrl = bamboraApiUrl + token;
    return redirectUrl;
};

module.exports = { getPaymentRedirectUrl };
