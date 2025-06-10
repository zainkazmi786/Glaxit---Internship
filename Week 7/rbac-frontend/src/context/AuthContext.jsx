
// Auth Context
import React, { createContext, useContext, useState, useEffect } from 'react';
const API_BASE_URL =import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        console.log('Profile fetched:', userData);
        setUser(userData.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      logout();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
    //   console.log('Login successful:', data.data.token);
      setToken(data.data.token);
      localStorage.setItem('token', data.data.token);
      return { success: true };
    } else {
      const error = await response.json();
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

const hasPermission = (permission) => {
    if (!user || !Array.isArray(user.permissions)) return false;
    return user.permissions.includes(permission);
    };


  const isAdmin = () => {
    if (!user || !(user.user.roles)) return false;
    return user.user.roles.some(role => role.name === 'Admin');
  };

  return (
    <AuthContext.Provider value={{
      user, token, login, register, logout, hasPermission, isAdmin, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
