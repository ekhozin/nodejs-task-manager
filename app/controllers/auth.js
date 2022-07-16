const asyncWrapper = require('../utils/asyncWrapper');
const STATUS_CODES = require('../constants/statusCodes');
const CustomError = require('../errors/CustomError');
const User = require('../models/User');

const registerUser = asyncWrapper(
  async (req, res) => {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(STATUS_CODES.CREATED).json({ token: user.createToken() });
  },
);

const loginUser = asyncWrapper( 
  async (req, res, next) => {
      const { password, email } = req.body;

      if (!password || !email) {
        return next(
          new CustomError(
            'Password or email is not provided',
            STATUS_CODES.BAD_REQUEST,
          ),
        );
      }

      const user = await User.findOne({ email });

      if (!user) {
        return next(
          new CustomError(
            'Invalid credentials',
            STATUS_CODES.NOT_AUTHORIZED,
          ),
        );
      }

      const isPasswordCorrect = await user.validatePassword(password);

      if (!isPasswordCorrect) {
        return next(
          new CustomError(
            'Invalid credentials',
            STATUS_CODES.NOT_AUTHORIZED,
          ),
        );
      }

      res.status(STATUS_CODES.SUCCESS).json({
        token: user.createToken(),
      });
  }
);

module.exports = { loginUser, registerUser };
