import { emitCommentCreated, emitCommentUpdated, emitCommentDeleted } from '../sockets/events.js';
import * as commentService from '../services/comment.service.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export const listComments = asyncHandler(async (req, res) => {
  const { comments, meta } = await commentService.listComments(
    req.params.postId,
    req.validated.query
  );
  sendSuccess(res, { comments }, 200, meta);
});

export const createComment = asyncHandler(async (req, res) => {
  const { comment, post } = await commentService.createComment(req.params.postId, req.body, req.user);
  res.locals.activity = { entityId: comment._id, meta: { postId: req.params.postId } };
  emitCommentCreated(comment, post);
  sendSuccess(res, { comment }, 201);
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.postId,
    req.params.id,
    req.body,
    req.user
  );
  emitCommentUpdated(comment, req.params.postId);
  sendSuccess(res, { comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.postId, req.params.id, req.user);
  emitCommentDeleted(req.params.id, req.params.postId);
  sendSuccess(res, { message: 'Comment deleted' });
});