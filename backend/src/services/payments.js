const axios = require('axios');
const crypto = require('crypto');
const db = require('../db');
const sequalize = require('../sequalize_pg');

const removeLastSlash = (url) => {
    if (!url) return '';
    return (url[url.length - 1] === '/') ? url.substring(0, url.length - 1) : url
}

// Default values are Paytrail test credentials.
const MERCHANT_ID = process.env.MERCHANT_ID || '375917';
const MERCHANT_KEY = process.env.MERCHANT_KEY || 'SAIPPUAKAUPPIAS';
const PAYMENT_RETURN_URL = removeLastSlash(process.env.APP_BASE_URL || '') + '/api/payments/payment-return';
const PAYMENT_POST_URL = process.env.PAYMENT_POST_URL || 'https://services.paytrail.com/payments';
const VAT_PERCENTAGE = process.env.VAT_PERCENTAGE || 14;
const PAYMENT_CODE = process.env.PAYMENT_CODE;

const calculateCheckoutParamsHmac = (params, body) => {
    const hmacPayload = Object.keys(params)
        .sort()
        .filter(h => h.substring(0, "checkout-".length) === "checkout-")
        .map((key) => [key, params[key]].join(':'))
        .concat(body ? JSON.stringify(body) : '')
        .join('\n');

    return crypto.createHmac('sha256', MERCHANT_KEY).update(hmacPayload).digest('hex');
};

const getAxiosConfig = async (paymentObj, timestamp) => {
    const orderNumber = 'vantaa-order-' + timestamp.valueOf();
    const headers = {
        'checkout-account': MERCHANT_ID,
        'checkout-algorithm': 'sha256',
        'checkout-method': 'POST',
        'checkout-nonce': orderNumber,
        'checkout-timestamp': timestamp.toISOString(),
    };

    const body = {
        'stamp': orderNumber,
        'reference': orderNumber,
        'amount': paymentObj.amount * 100,
        'currency': 'EUR',
        'language': 'FI',
        "items": [
            {
                "unitPrice": paymentObj.amount * 100,
                "units": 1,
                "vatPercentage": VAT_PERCENTAGE,
                "productCode": PAYMENT_CODE,
                "description": `Liikuntalippusaldolataus|${PAYMENT_CODE}`,
                "reference": PAYMENT_CODE
            }
        ],
        'customer': {
            'email': paymentObj.username
        },
        'redirectUrls': {
            'success': PAYMENT_RETURN_URL,
            'cancel': PAYMENT_RETURN_URL
        }
    }

    const signature = calculateCheckoutParamsHmac(headers, body);
    const paymentEntity = {
        auth_code: signature,
        order_number: orderNumber,
        amount: paymentObj.amount,
        payment_status: -1,
        userId: paymentObj.userId
    };

    const paymentResponse = await db.payments.createPayment(paymentEntity);
    if (paymentResponse.id) {
        console.log('Payment saved to database: ', paymentResponse.dataValues);
        const config = {
            url: PAYMENT_POST_URL,
            method: 'post',
            headers: { ...headers,
                signature
            },
            data: body
        };
        return config;
    } else {
        throw new Error('Failed to save payment with order number: ' + orderNumber);
    }
}

const getPaymentProviders = async (paymentObj) => {
    const timestamp = new Date();
    try {
        const paymentPostConfig = await getAxiosConfig(paymentObj, timestamp);
        const response = await axios(paymentPostConfig);
        return response.data.providers;
    } catch (error) {
        console.error(`Failed to get payment methods: ${error.message}`);
        const orderNumber = 'vantaa-order-' + timestamp.valueOf();
        await sequalize.transaction(async (transaction) => {
            await db.payments.updatePaymentStatus(orderNumber, 0, transaction);
        });

        return null;
    }

};

module.exports = {
    getPaymentProviders,
    calculateCheckoutParamsHmac
};
