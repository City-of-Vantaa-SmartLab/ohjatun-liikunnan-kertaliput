// Bambora was acquired by Visma and renamed as Visma Pay.

const crypto = require('crypto');

const payment_return_url = process.env.PAYMENT_RETURN_URL;
const payemnt_notify_url = process.env.PAYMENT_NOTIFY_URL;

const secret = process.env.BAMBORA_SECRET_KEY;
const apiKey = process.env.BAMBORA_API_KEY;

const bamboraProductID = process.env.BAMBORA_PRODUCT_ID;
const bamboraProductTitle = process.env.BAMBORA_PRODUCT_TITLE;

const BAMBORA_TAX = process.env.BAMBORA_TAX || 10;

module.exports = {
    createPaymentModel: (paymentModel) => {
        const orderNumber = 'vantaa-order-' + Date.now();
        const message = apiKey + '|' + orderNumber;
        const authCode = crypto
            .createHmac('sha256', secret)
            .update(message)
            .digest('hex')
            .toUpperCase();

        paymentModel.auth_code = authCode;
        paymentModel.order_number = orderNumber;
        return paymentModel;
    },

    createBamboraPaymentRequest: (paymentModel) => {
        const amount = paymentModel.amount * 100;
        const preTaxAmount = Math.round(
            Number((amount * BAMBORA_TAX / (BAMBORA_TAX + 1)).toFixed(2))
        );
        const taxAmount = BAMBORA_TAX;
        return {
            version: 'w3.1',
            api_key: apiKey,
            order_number: paymentModel.order_number,
            amount: amount,
            currency: 'EUR',
            payment_method: {
                type: 'e-payment',
                return_url: payment_return_url,
                notify_url: payemnt_notify_url,
                lang: 'fi',
                selected: ['banks', 'creditcards'],
            },
            authcode: paymentModel.auth_code,
            customer: {
                firstname: paymentModel.username,
            },
            products: [
                {
                    id: bamboraProductID,
                    title: bamboraProductTitle,
                    count: 1,
                    pretax_price: preTaxAmount,
                    tax: taxAmount,
                    price: amount,
                    type: 1,
                },
            ],
        };
    },
};
