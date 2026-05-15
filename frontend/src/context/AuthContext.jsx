import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('blog-admin-token'));

  const isAdmin = !!token;

  function login(t) {
    localStorage.setItem('blog-admin-token', t);
    setToken(t);
  }

  function logout() {
    localStorage.removeItem('blog-admin-token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
