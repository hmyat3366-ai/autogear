import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('autogear_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const API_URL = 'https://autogear-api.onrender.com/api';

  useEffect(() => {
    // Only fetch users if logged in as admin
    if (user?.role === 'admin') {
      fetch(`${API_URL}/users`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRegisteredUsers(data);
          } else {
            setRegisteredUsers([]);
          }
        })
        .catch(err => console.error('Failed to fetch users:', err));
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('autogear_user', JSON.stringify(data.user));
        localStorage.setItem('autogear_token', data.token);
        return true;
      } else {
        console.error(data.error);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('autogear_user', JSON.stringify(data.user));
        localStorage.setItem('autogear_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.error || 'Signup failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('autogear_user');
    localStorage.removeItem('autogear_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, registeredUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
