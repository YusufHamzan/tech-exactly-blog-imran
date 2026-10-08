import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RefreshToken } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const SALT_ROUNDS = 12;

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const { exp } = jwt.decode(refreshToken);

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(exp * 1000),
  });

  return { accessToken, refreshToken };
}

export async function register({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Invalid email or password');

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

export async function refresh(oldToken) {
  if (!oldToken) throw ApiError.unauthorized('Refresh token missing');

  let payload;
  try {
    payload = verifyRefreshToken(oldToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const stored = await RefreshToken.findOne({ token: oldToken });
  if (!stored || stored.revoked) {
    throw ApiError.unauthorized('Refresh token revoked');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('User no longer exists');

  // Rotation: the old refresh token is single-use.
  stored.revoked = true;
  await stored.save();

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}


export async function logout(token) {
  if (!token) return null;
  const stored = await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
  return stored?.user ?? null;
}

