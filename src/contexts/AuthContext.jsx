import { createContext, useContext, useState, useEffect } from 'react';
import { initDB, login as dbLogin } from '../db';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const SESSION_KEY = 'gametix_session';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Init DB and restore session on mount
  useEffect(() => {
    initDB();
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (saved) setCurrentUser(saved);
    } catch {}
    setLoading(false);
  }, []);

  function login(email, password) {
    const user = dbLogin(email, password);
    if (!user) throw new Error('Invalid email or password.');
    setCurrentUser(user);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }

  function logout() {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  const value = {
    currentUser,
    userRole: currentUser?.role || null,
    userData: currentUser,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
