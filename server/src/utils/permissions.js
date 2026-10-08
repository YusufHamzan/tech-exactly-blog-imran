import { ApiError } from './ApiError.js';
import { ROLES } from '../constants/roles.js';

function toId(value) {
  // Accepts an ObjectId, a string, or a populated document ({ _id })
  return String(value?._id ?? value);
}

export function isOwnerOrAdmin(user, ownerId) {
  if (user.role === ROLES.ADMIN) return true;
  return toId(ownerId) === toId(user._id);
}

export function assertOwnerOrAdmin(user, ownerId, message = 'You can only modify your own resources') {
  if (!isOwnerOrAdmin(user, ownerId)) {
    throw ApiError.forbidden(message);
  }
}