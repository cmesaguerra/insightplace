import React, { useState, useContext, createContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Initialize state from localStorage immediately (synchronously)
const getInitialState = () => {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  const savedCompany = localStorage.getItem('company');
  
  return {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    company: savedCompany ? JSON.parse(savedCompany) : null
  };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialState();
  const [user, setUser] = useState(initialState.user);
  const [token, setToken] = useState(initialState.token);
  const [company, setCompany] = useState(initialState.company);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(true);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      setToken(data.access_token);
      setUser(data.user);
      setCompany(data.company);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('company', JSON.stringify(data.company));
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setCompany(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
    }
  };

  const value = {
    user,
    token,
    company,
    loading,
    initialized,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
