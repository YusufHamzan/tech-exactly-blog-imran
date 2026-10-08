import * as adminService from '../services/admin.service.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  sendSuccess(res, { stats });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await adminService.listUsers(req.validated.query);
  sendSuccess(res, { users }, 200, meta);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role, req.user);
  sendSuccess(res, { user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id, req.user);
  sendSuccess(res, { message: 'User deleted' });
});

export const listAllPosts = asyncHandler(async (req, res) => {
  const { posts, meta } = await adminService.listAllPosts(req.validated.query);
  sendSuccess(res, { posts }, 200, meta);
});

export const restorePost = asyncHandler(async (req, res) => {
  const post = await adminService.restorePost(req.params.id);
  sendSuccess(res, { post });
});

export const permanentlyDeletePost = asyncHandler(async (req, res) => {
  await adminService.permanentlyDeletePost(req.params.id);
  sendSuccess(res, { message: 'Post permanently deleted' });
});

export const listAllComments = asyncHandler(async (req, res) => {
  const { comments, meta } = await adminService.listAllComments(req.validated.query);
  sendSuccess(res, { comments }, 200, meta);
});