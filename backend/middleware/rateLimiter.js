const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 10, // 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});