import { getIO } from './index.js';

function safeEmit(fn) {
  try {
    fn(getIO());
  } catch (err) {
    // Sockets must never break the HTTP response
    console.error('Socket emit failed:', err.message);
  }
}

export function emitCommentCreated(comment, post) {
  const payload = { comment, postId: String(post._id), postSlug: post.slug, postTitle: post.title };
  safeEmit((io) => {
    io.to(`post:${post._id}`).emit('comment:created', payload);
    const authorId = String(post.author._id ?? post.author);
    const commenterId = String(comment.author._id ?? comment.author);
    if (authorId !== commenterId) {
      io.to(`user:${authorId}`).emit('notify:comment', {
        ...payload,
        message: `${comment.author?.name ?? 'Someone'} commented on "${post.title}"`,
      });
    }
  });
}

export function emitCommentUpdated(comment, postId) {
  safeEmit((io) => io.to(`post:${postId}`).emit('comment:updated', { comment, postId: String(postId) }));
}

export function emitCommentDeleted(commentId, postId) {
  safeEmit((io) => io.to(`post:${postId}`).emit('comment:deleted', { commentId, postId: String(postId) }));
}

export function emitPostCreated(post) {
  safeEmit((io) => io.emit('post:created', { post }));
}