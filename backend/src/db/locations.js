const models = require('../models');
module.exports = {
    getLocationById: (id) => {
        return models.locations.find({
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
