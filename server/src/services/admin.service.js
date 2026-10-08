import { User, Post, Comment, RefreshToken } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import { ROLES } from '../constants/roles.js';

const AUTHOR_FIELDS = 'name email avatar';

function buildMeta(page, limit, total) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) || 1 };
}

// ---------- Dashboard ----------

export async function getStats() {
  const [totalUsers, adminUsers, totalPosts, deletedPosts, totalComments] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.ADMIN }),
    Post.countDocuments(),                      // hook excludes deleted
    Post.countDocuments({ isDeleted: true }).setOptions({ withDeleted: true }),
    Comment.countDocuments(),
  ]);

  return { totalUsers, adminUsers, totalPosts, deletedPosts, totalComments };
}

// ---------- Users ----------

export async function listUsers({ page, limit, role, search }) {
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-__v').lean(),
    User.countDocuments(filter),
  ]);

  return { users, meta: buildMeta(page, limit, total) };
}

export async function updateUserRole(targetId, role, actingAdmin) {
  if (String(targetId) === String(actingAdmin._id)) {
    throw ApiError.badRequest('You cannot change your own role');
  }

  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');

  user.role = role;
  await user.save();
  return user;
}

export async function deleteUser(targetId, actingAdmin) {
  if (String(targetId) === String(actingAdmin._id)) {
    throw ApiError.badRequest('You cannot delete your own account');
  }

  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');

  // Clean up everything that belongs to the user
  await Promise.all([
    Post.updateMany(
      { author: targetId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() }
    ),
    Comment.deleteMany({ author: targetId }),
    RefreshToken.deleteMany({ user: targetId }),
  ]);

  await user.deleteOne();
}

// ---------- Posts ----------

export async function listAllPosts({ page, limit, status, search }) {
  const filter = {};
  if (status === 'active') filter.isDeleted = false;
  if (status === 'deleted') filter.isDeleted = true;
  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };

  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .setOptions({ withDeleted: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter).setOptions({ withDeleted: true }),
  ]);

  return { posts, meta: buildMeta(page, limit, total) };
}

export async function restorePost(id) {
  const post = await Post.findOne({ _id: id, isDeleted: true }).setOptions({ withDeleted: true });
  if (!post) throw ApiError.notFound('Deleted post not found');

  post.isDeleted = false;
  post.deletedAt = null;
  await post.save();
  return post.populate('author', AUTHOR_FIELDS);
}

export async function permanentlyDeletePost(id) {
  const post = await Post.findById(id).setOptions({ withDeleted: true });
  if (!post) throw ApiError.notFound('Post not found');

  await Comment.deleteMany({ post: id });
  await post.deleteOne();
}

// ---------- Comments ----------

export async function listAllComments({ page, limit, post, author }) {
  const filter = {};
  if (post) filter.post = post;
  if (author) filter.author = author;

  const skip = (page - 1) * limit;
  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .populate('post', 'title slug isDeleted')
      .lean(),
    Comment.countDocuments(filter),
  ]);

  return { comments, meta: buildMeta(page, limit, total) };
}