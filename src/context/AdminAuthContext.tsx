'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const session = localStorage.getItem('lulo_admin_authenticated');
    if (session === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string): boolean => {
    // Simple secure PIN/Password check for admin access
    if (password === 'lulo1234' || password === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('lulo_admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('lulo_admin_authenticated');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
