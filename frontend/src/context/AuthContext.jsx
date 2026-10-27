import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('roomly_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('roomly_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => {
      setUser(data.user); localStorage.setItem('roomly_user', JSON.stringify(data.user));
    }).catch(() => {
      localStorage.removeItem('roomly_token'); localStorage.removeItem('roomly_user'); setUser(null);
    }).finally(() => setLoading(false));
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('roomly_token', data.token);
    localStorage.setItem('roomly_user', JSON.stringify(data.user));
    setUser(data.user); return data.user;
  };
  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('roomly_token', data.token);
    localStorage.setItem('roomly_user', JSON.stringify(data.user));
    setUser(data.user); return data.user;
  };
  const logout = () => {
    localStorage.removeItem('roomly_token'); localStorage.removeItem('roomly_user'); setUser(null);
  };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
