const STATUS_CODES = require('../constants/statusCodes');
const CustomError = require('../errors/CustomError');

const handleCastErrorDB = (error) => {
    return new CustomError(
        `Invalid ${error.path}: ${error.value}`,
        STATUS_CODES.BAD_REQUEST,
    );
}; 

const handleDuplicateFieldsErrorDB = (error) => {
    const value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

    return new CustomError(
        `Duplicate field value: ${value}. Please use another value.`,
        STATUS_CODES.BAD_REQUEST,
    );
};

const handleValidationErrorDB = (error) => {
    const errors = Object
        .entries(error.errors)
        .map(
            ([fieldName, errorData]) => `${fieldName}: ${errorData.message}`,
        );
    const message = `Invalid input data. ${errors.join('. ')}`;

    return new CustomError(
        message,
        STATUS_CODES.BAD_REQUEST,
    );
};

/**
 * Handles errors.
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const errorMiddleware = (err, req, res, next) => {
    console.log(err)
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
            },
        });
    }

    /**
     * Handle DB errors
     */
    if (err.name === 'CastError') {
        const error = handleCastErrorDB(err);

        return res.status(error.statusCode).json({
            error: {
                message: error.message,
            },
        });
    }

    if (err.code === 11000) {
        const error = handleDuplicateFieldsErrorDB(err);

        return res.status(error.statusCode).json({
            error: {
                message: error.message,
            },
        });
    }
 
    if (err.name === 'ValidationError') {
        const error = handleValidationErrorDB(err);

        return res.status(error.statusCode).json({
            error: {
                message: error.message,
            },
        });
    }

    return res.status(STATUS_CODES.SERVER_ERROR).json({
        message: 'Internal server error',
    });
};

module.exports = errorMiddleware;
