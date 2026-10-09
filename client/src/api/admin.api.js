import { api, cleanParams } from './client.js';

const paged = (key) => (r) => ({ items: r.data.data[key], meta: r.data.meta });

export const adminApi = {
  stats: () => api.get('/admin/stats').then((r) => r.data.data.stats),

  users: (params) => api.get('/admin/users', { params: cleanParams(params) }).then(paged('users')),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data.data.user),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  posts: (params) => api.get('/admin/posts', { params: cleanParams(params) }).then(paged('posts')),
  restorePost: (id) => api.patch(`/admin/posts/${id}/restore`),
  destroyPost: (id) => api.delete(`/admin/posts/${id}`),

  comments: (params) => api.get('/admin/comments', { params: cleanParams(params) }).then(paged('comments')),

  activity: (params) => api.get('/admin/activity', { params: cleanParams(params) }).then(paged('activities')),
};