const models = require('../models');
module.exports = {
    getEvents: () => {
        return models.events.findAll({});
    },

    getEventById: (id) => {
        return models.events.findOne({
            attributes: [
                'id',
                ['id', 'eventId'],
                ['start', 'startDate'],
                ['end', 'endDate'],
                'teachingplace',
                'courseId'
            ],
            where: {
                id,
            },
        });
    },
};
