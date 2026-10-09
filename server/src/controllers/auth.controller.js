import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';

const REFRESH_COOKIE = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT_REFRESH_EXPIRES
};

// function sendAuthResponse(res, { user, accessToken, refreshToken }, statusCode = 200) {
//   res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
//   return sendSuccess(res, { user, accessToken }, statusCode);
// }

function sendAuthResponse(res, { user, accessToken, refreshToken }, statusCode = 200) {
    res.locals.activity = { user: user._id, entityId: user._id, meta: { email: user.email } };
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
    return sendSuccess(res, { user, accessToken }, statusCode);
  }

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendAuthResponse(res, result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendAuthResponse(res, result);
});

export const googleCallback = asyncHandler(async (req, res) => {
  // Passport placed the User document on req.user
  const { user, refreshToken } = await authService.oauthLogin(req.user);

  res.locals.activity = { user: user._id, entityId: user._id, meta: { email: user.email, provider: 'google' } };
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  res.redirect(`${env.clientUrl}/oauth/callback`);
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.cookies[REFRESH_COOKIE]);
  sendAuthResponse(res, result);
});


// export const logout = asyncHandler(async (req, res) => {
//   await authService.logout(req.cookies[REFRESH_COOKIE]);
//   res.clearCookie(REFRESH_COOKIE, { ...cookieOptions, maxAge: undefined });
//   sendSuccess(res, { message: 'Logged out' });
// });

  
export const logout = asyncHandler(async (req, res) => {
    const userId = await authService.logout(req.cookies[REFRESH_COOKIE]);
    if (userId) res.locals.activity = { user: userId, entityId: userId };
    res.clearCookie(REFRESH_COOKIE, { ...cookieOptions, maxAge: undefined });
    sendSuccess(res, { message: 'Logged out' });
  });

  

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user });
});