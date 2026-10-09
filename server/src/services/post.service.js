import slugify from 'slugify';
import { Post, Comment } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { assertOwnerOrAdmin } from '../utils/permissions.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const AUTHOR_FIELDS = 'name avatar';

async function attachCommentCounts(posts) {
  if (posts.length === 0) return posts;

  const counts = await Comment.aggregate([
    { $match: { post: { $in: posts.map((p) => p._id) } } },
    { $group: { _id: '$post', count: { $sum: 1 } } },
  ]);

  const byPost = new Map(counts.map((c) => [String(c._id), c.count]));
  return posts.map((p) => ({ ...p, commentCount: byPost.get(String(p._id)) ?? 0 }));
}

async function generateUniqueSlug(title) {
  const base = slugify(title, { lower: true, strict: true, trim: true }) || 'post';
  let slug = base;
  let counter = 1;

  // Include soft-deleted posts: the slug index is unique across all documents
  while (await Post.exists({ slug }).setOptions({ withDeleted: true })) {
    counter += 1;
    slug = `${base}-${counter}`;
  }
  return slug;
}


export async function createPost({ title, content }, authorId) {
  const slug = await generateUniqueSlug(title);
  const post = await Post.create({ title, content, slug, author: authorId });
  return post.populate('author', AUTHOR_FIELDS);
}

export async function listPosts({ page, limit, author, search }) {
  const filter = {};
  if (author) filter.author = author;
  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter),
  ]);

  return {
    posts: await attachCommentCounts(posts),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };

}

export async function getPostBySlug(slug) {
  const post = await Post.findOne({ slug }).populate('author', AUTHOR_FIELDS);
  if (!post) throw ApiError.notFound('Post not found');

  const commentCount = await Comment.countDocuments({ post: post._id });
  return { ...post.toJSON(), commentCount };
}

export async function updatePost(id, data, user) {
  const post = await Post.findById(id);
  if (!post) throw ApiError.notFound('Post not found');

  assertOwnerOrAdmin(user, post.author, 'You can only edit your own posts');

  if (data.title !== undefined) post.title = data.title;
  if (data.content !== undefined) post.content = data.content;
  await post.save();

  return post.populate('author', AUTHOR_FIELDS);
}

export async function deletePost(id, user) {
  const post = await Post.findById(id);
  if (!post) throw ApiError.notFound('Post not found');

  assertOwnerOrAdmin(user, post.author, 'You can only delete your own posts');

  await post.softDelete();
}