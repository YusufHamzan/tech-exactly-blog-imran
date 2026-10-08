import { api, API_URL } from './client.js';

const unwrap = (res) => res.data.data;

export const authApi = {
  register: (data) => api.post('/auth/register', data).then(unwrap),
  login: (data) => api.post('/auth/login', data).then(unwrap),
  refresh: () => api.post('/auth/refresh').then(unwrap),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me').then(unwrap),
};

// Plain link, not an XHR: the browser must follow Google's redirects
export const googleLoginUrl = `${API_URL}/auth/google`;