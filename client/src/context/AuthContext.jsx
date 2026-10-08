import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth.api.js';
import { tokenStore, setAuthFailureHandler } from '../api/client.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until the first session check finishes

  const applyAuth = useCallback((data) => {
    tokenStore.set(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const clearAuth = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  // Restore the session from the refresh cookie on first load
  useEffect(() => {
    setAuthFailureHandler(clearAuth);
    authApi
      .refresh()
      .then(applyAuth)
      .catch(clearAuth)
      .finally(() => setLoading(false));
  }, [applyAuth, clearAuth]);

  const login = useCallback(async (credentials) => applyAuth(await authApi.login(credentials)), [applyAuth]);
  const register = useCallback(async (data) => applyAuth(await authApi.register(data)), [applyAuth]);
  const refreshSession = useCallback(async () => applyAuth(await authApi.refresh()), [applyAuth]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, loading, login, register, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}