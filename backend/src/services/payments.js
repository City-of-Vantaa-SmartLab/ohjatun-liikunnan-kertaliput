const axios = require('axios');
const db = require('../db');
const bambora = require('./bambora');
const sequalize = require('../sequalize_pg');

const TOKEN_URL = 'https://www.vismapay.com/pbwapi/auth_payment';
const PAYMENT_API_URL = 'https://www.vismapay.com/pbwapi/token/';

const getPaymentRedirectUrl = async (paymentObj) => {
    const paymentModel = bambora.createPaymentModel(paymentObj);
    const pendingPayment = await db.payments.createPayment(paymentModel);
    const paymentRequest = bambora.createBamboraPaymentRequest(paymentModel);
    const response = await axios
        .post(TOKEN_URL, paymentRequest)
        .catch(function(error) {
            console.log(`Failed to get payment token. Error: ${error.message}`);
        });
    const token = response.data.token;
    if(token === undefined) {
        await sequalize.transaction(async (transaction) => {
            await db.payments.updatePaymentStatus(
              pendingPayment.dataValues["order_number"],
              0,
              transaction
            );
        });
    }
    const redirectUrl = PAYMENT_API_URL + token;
    return redirectUrl;
};

module.exports = { getPaymentRedirectUrl };