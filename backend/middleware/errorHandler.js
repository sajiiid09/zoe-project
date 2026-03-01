import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details, err.code);
  }

  console.error(err.stack || err);

  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message || 'Something went wrong!',
    500,
    process.env.NODE_ENV === 'production' ? null : { stack: err.stack }
  );
};
