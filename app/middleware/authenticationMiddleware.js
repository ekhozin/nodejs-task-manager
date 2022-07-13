const jwt = require('jsonwebtoken');
const STATUS_CODES = require('../constants/statusCodes');
const CustomError = require('../errors/CustomError');

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(
      new CustomError(
        'Bad token',
        STATUS_CODES.NOT_AUTHORIZED,
      ),
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(
      new CustomError(
        'Not authorized',
        STATUS_CODES.NOT_AUTHORIZED,
      ),
    );
  }
};

module.exports = authenticationMiddleware;
