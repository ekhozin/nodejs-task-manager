const STATUS_CODES = require('../constants/statusCodes');

const notFoundController = (req, res) => {
    res.status(STATUS_CODES.NOT_FOUND).send('Route does not exist');
};

module.exports = notFoundController;
