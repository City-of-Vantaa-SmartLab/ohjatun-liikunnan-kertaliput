const axios = require('axios');

const teliaEndPoint = 'https://ws.mkv.telia.fi/restsms/lekabrest/send';
const teliaUsername = process.env.TELIA_USERNAME;
const teliaPassword = process.env.TELIA_PASSWORD;
const teliaUser = process.env.TELIA_USER;

const sendMessageToUser = async (phoneNumber, message) => {
    try {
        const request = generateTeliaMessageRequest(phoneNumber, message);
        const response = await axios.post(teliaEndPoint, request);
        if (
            response &&
            response.data.accepted[0].to ===
                phoneNumber.substring(1, phoneNumber.length)
        ) {
            return response;
        }
    } catch (error) {
        console.log(`Failed to send SMS to the User: ${error.message}`);
    }
};

const generateTeliaMessageRequest = (phoneNumber, message) => {
    return {
        username: teliaUsername,
        password: teliaPassword,
        from: teliaUser,
        to: [phoneNumber],
        message: message,
    };
};

module.exports = {
    sendMessageToUser,
    generateTeliaMessageRequest,
};
