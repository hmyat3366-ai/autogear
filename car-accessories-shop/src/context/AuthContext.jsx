import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('autogear_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('autogear_users_db');
    const defaultUsers = [
      { name: 'Admin', email: 'admin@test.com', password: '123', role: 'admin' },
      { name: 'Test User', email: 'user@test.com', password: '123', role: 'user' }
    ];
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const login = (email, password) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const sessionUser = { name: foundUser.name, email: foundUser.email, role: foundUser.role };
      setUser(sessionUser);
      localStorage.setItem('autogear_user', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const signup = (name, email, password) => {
    if (registeredUsers.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    const newUser = { name, email, password, role: 'user' };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('autogear_users_db', JSON.stringify(updatedUsers));
    
    // Auto login after signup
    const sessionUser = { name, email, role: 'user' };
    setUser(sessionUser);
    localStorage.setItem('autogear_user', JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('autogear_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, registeredUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
