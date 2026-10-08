import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Access token lives in memory only
let accessToken = null;
export const tokenStore = {
  get: () => accessToken,
  set: (token) => { accessToken = token; },
  clear: () => { accessToken = null; },
};

// AuthContext registers a callback so the client can log the user out on hard failure
let onAuthFailure = null;
export function setAuthFailureHandler(fn) {
  onAuthFailure = fn;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send the refresh cookie
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoints where a 401 means "wrong credentials", not "token expired"
const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const skip = NO_REFRESH.some((path) => original?.url?.startsWith(path));

    if (status !== 401 || original._retry || skip) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      // Share one refresh call across concurrent 401s
      refreshPromise ??= api
        .post('/auth/refresh')
        .then((res) => res.data.data)
        .finally(() => { refreshPromise = null; });

      const { accessToken: newToken } = await refreshPromise;
      tokenStore.set(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      tokenStore.clear();
      onAuthFailure?.();
      return Promise.reject(refreshError);
    }
  }
);

// Pull the message out of the backend's { success:false, error:{ message, details } } shape
export function getErrorMessage(error, fallback = 'Something went wrong') {
  const data = error?.response?.data;
  if (data?.error?.details?.length) {
    return data.error.details.map((d) => d.message).join('. ');
  }
  return data?.error?.message || fallback;
}