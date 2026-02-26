import React, { createContext, useContext, useState, useCallback } from 'react';
import { currentUser, type User } from './mock-data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return localStorage.getItem('collabsphere_auth') ? currentUser : null;
  });

  const login = useCallback(async (_email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    localStorage.setItem('collabsphere_auth', 'true');
    setUser(currentUser);
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 1000));
    const newUser = { ...currentUser, name, email };
    localStorage.setItem('collabsphere_auth', 'true');
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('collabsphere_auth');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
