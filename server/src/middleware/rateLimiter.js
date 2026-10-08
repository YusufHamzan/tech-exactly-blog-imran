import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,                // 20 requests per IP per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many requests, please try again later'));
  },
});