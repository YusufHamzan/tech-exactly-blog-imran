import { Comment, Post } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { assertOwnerOrAdmin } from '../utils/permissions.js';

const AUTHOR_FIELDS = 'name avatar';

async function ensurePostExists(postId) {
  // Goes through the soft-delete hook, so deleted posts count as missing
  const exists = await Post.exists({ _id: postId });
  if (!exists) throw ApiError.notFound('Post not found');
}

async function findCommentOrFail(postId, id) {
  // Scoped to the post so /posts/A/comments/X can't touch a comment from post B
  const comment = await Comment.findOne({ _id: id, post: postId });
  if (!comment) throw ApiError.notFound('Comment not found');
  return comment;
}

export async function createComment(postId, { content }, user) {
  await ensurePostExists(postId);
  const comment = await Comment.create({ content, post: postId, author: user._id });
  return comment.populate('author', AUTHOR_FIELDS);
}

export async function listComments(postId, { page, limit }) {
  await ensurePostExists(postId);

  const filter = { post: postId };
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: 1 }) // oldest first, reads like a conversation
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean(),
    Comment.countDocuments(filter),
  ]);

  return {
    comments,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function updateComment(postId, id, { content }, user) {
  const comment = await findCommentOrFail(postId, id);
  assertOwnerOrAdmin(user, comment.author, 'You can only edit your own comments');

  comment.content = content;
  await comment.save();
  return comment.populate('author', AUTHOR_FIELDS);
}

export async function deleteComment(postId, id, user) {
  const comment = await findCommentOrFail(postId, id);
  assertOwnerOrAdmin(user, comment.author, 'You can only delete your own comments');

  await comment.deleteOne();
}