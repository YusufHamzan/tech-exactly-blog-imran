import * as postService from '../services/post.service.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.body, req.user._id);
  sendSuccess(res, { post }, 201);
});

export const listPosts = asyncHandler(async (req, res) => {
  const { posts, meta } = await postService.listPosts(req.validated.query);
  sendSuccess(res, { posts }, 200, meta);
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await postService.getPostBySlug(req.params.slug);
  sendSuccess(res, { post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.body, req.user);
  sendSuccess(res, { post });
});

export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id, req.user);
  sendSuccess(res, { message: 'Post deleted' });
});