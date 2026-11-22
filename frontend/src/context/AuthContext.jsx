import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sentinel_auth_user') || sessionStorage.getItem('sentinel_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('sentinel_auth_token') || sessionStorage.getItem('sentinel_auth_token') || null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const activeToken = localStorage.getItem('sentinel_auth_token') || sessionStorage.getItem('sentinel_auth_token');
      if (!activeToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await api.verifySession(activeToken);
        if (isMounted && data.status === 'valid' && data.user) {
          setUser(data.user);
          setToken(activeToken);
        }
      } catch (err) {
        // Token expired or invalid
        localStorage.removeItem('sentinel_auth_token');
        localStorage.removeItem('sentinel_auth_user');
        sessionStorage.removeItem('sentinel_auth_token');
        sessionStorage.removeItem('sentinel_auth_user');
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkSession();
    return () => { isMounted = false; };
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password, rememberMe);
      const storage = rememberMe ? localStorage : sessionStorage;
      
      // Clear opposing storage to avoid sync mismatch
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem('sentinel_auth_token');
      otherStorage.removeItem('sentinel_auth_user');

      storage.setItem('sentinel_auth_token', res.token);
      storage.setItem('sentinel_auth_user', JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
