const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utils/asyncWrapper');
const STATUS_CODES = require('../constants/statusCodes');
const CustomError = require('../errors/CustomError');
const User = require('../models/User');

const registerUser = asyncWrapper(
  async (req, res, next) => {
    res.send('register');
  },
);

const loginUser = asyncWrapper( 
  async (req, res, next) => {
      const { password, username } = req.body;

      // call db
      // const task = await Task.create(req.body);
      if (!password || !username) {
        return next(
          new CustomError(
            'Password or username is not provided',
            STATUS_CODES.BAD_REQUEST,
          ),
        );
      }

      // Temporary solution
      const id = new Date().getDate();

      const token = jwt.sign(
        { username, id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' },
      );

      res.status(STATUS_CODES.SUCCESS).json({ token });
  }
);

module.exports = { loginUser, registerUser };
