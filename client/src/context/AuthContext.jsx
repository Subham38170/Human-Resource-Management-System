import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      toast.success(`Welcome back, ${data.user.role}!`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      // Do NOT log in automatically.
      toast.success('Registration successful! Please login after verification.');
      return { success: true };
    } catch (error) {
       const msg = error.response?.data?.error || 'Registration failed';
       toast.error(msg);
       return { success: false, error: msg };
    }
  };

  const logout = async () => {
    // await api.get('/auth/logout'); // If we had a logout endpoint clearing cookies
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
