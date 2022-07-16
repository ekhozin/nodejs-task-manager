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
        .reduce(
            (acc, [fieldName, errorData]) => {
                acc[fieldName] = errorData.message;

                return acc;
            },
            {},
        );

    return new CustomError(
        'Invalid input data',
        STATUS_CODES.BAD_REQUEST,
        errors,
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
    console.log(err);
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                data: err.data,
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
                data: error.data,
            },
        });
    }
 
    if (err.name === 'ValidationError') {
        const error = handleValidationErrorDB(err);

        return res.status(error.statusCode).json({
            error: {
                message: error.message,
                data: error.data,
            },
        });
    }

    return res.status(STATUS_CODES.SERVER_ERROR).json({
        message: 'Internal server error',
    });
};

module.exports = errorMiddleware;
