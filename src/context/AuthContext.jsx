import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, clearAuthToken, getAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getAuthToken()));

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await apiClient('/auth/me');
      setUser(currentUser);
      return currentUser;
    } catch {
      clearAuthToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getAuthToken()) fetchCurrentUser();

    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password, remember = true) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email.trim().toLowerCase());
      formData.append('password', password);
      const response = await apiClient('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });
      clearAuthToken();
      (remember ? localStorage : sessionStorage).setItem('token', response.access_token);
      const currentUser = await apiClient('/auth/me');
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      clearAuthToken();
      setUser(null);
      return { success: false, message: error.message || 'Đăng nhập thất bại.' };
    }
  };

  const register = async (userData) => {
    try {
      const payload = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        full_name: userData.full_name.trim().replace(/\s+/g, ' '),
      };
      await apiClient('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
      return await login(payload.email, payload.password, true);
    } catch (error) {
      return { success: false, message: error.message || 'Đăng ký thất bại.' };
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider.');
  return context;
};
