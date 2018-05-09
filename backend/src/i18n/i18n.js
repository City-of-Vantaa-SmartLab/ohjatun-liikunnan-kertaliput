const content = require('./content.json');

// this is a store of worded content, for internationalization
let language = 'fi';
const getContents = () => {
    switch (language.toLowerCase()) {
        case 'sv':
            return content.swedish;
        case 'en':
            return content.english;
        default:
            return content.finnish;
    }
};

module.exports = { getContents };
