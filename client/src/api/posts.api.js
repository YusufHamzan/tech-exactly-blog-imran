import { api, cleanParams } from './client.js';

// Drop empty params so we don't send ?search= to the backend
// const clean = (params = {}) =>
//   Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));

export const postsApi = {
  list: (params) =>
    api.get('/posts', { params: cleanParams(params) }).then((r) => ({ posts: r.data.data.posts, meta: r.data.meta })),
  getBySlug: (slug) => api.get(`/posts/${slug}`).then((r) => r.data.data.post),
  create: (data) => api.post('/posts', data).then((r) => r.data.data.post),
  update: (id, data) => api.patch(`/posts/${id}`, data).then((r) => r.data.data.post),
  remove: (id) => api.delete(`/posts/${id}`),
};