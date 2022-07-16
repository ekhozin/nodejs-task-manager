class CustomError extends Error {
  constructor(message, statusCode, data) {
    super(message);
        
    this.statusCode = statusCode;

    if (data) {
      this.data = data;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
