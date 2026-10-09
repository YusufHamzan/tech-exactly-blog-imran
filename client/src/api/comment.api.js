import { api } from './client.js';

export const commentsApi = {
  list: (postId, params) =>
    api.get(`/posts/${postId}/comments`, { params }).then((r) => ({ comments: r.data.data.comments, meta: r.data.meta })),
  create: (postId, content) => api.post(`/posts/${postId}/comments`, { content }).then((r) => r.data.data.comment),
  update: (postId, id, content) =>
    api.patch(`/posts/${postId}/comments/${id}`, { content }).then((r) => r.data.data.comment),
  remove: (postId, id) => api.delete(`/posts/${postId}/comments/${id}`),
};