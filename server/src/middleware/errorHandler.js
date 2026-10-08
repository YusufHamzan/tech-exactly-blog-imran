import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for ${Object.keys(err.keyValue).join(', ')}`;
  }

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      ...(err.details && { details: err.details }),
      ...(env.nodeEnv === 'development' && statusCode === 500 && { stack: err.stack }),
    },
  });
}