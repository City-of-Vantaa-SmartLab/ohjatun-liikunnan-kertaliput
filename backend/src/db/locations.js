const models = require('../models');
module.exports = {
    getLocationById: (id) => {
        return models.locations.findOne({
            attributes: [
                'id',
                'path',
                'address'
            ],
            where: {
                id,
            },
        });
    },
};
