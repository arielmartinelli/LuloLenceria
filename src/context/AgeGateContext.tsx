'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AgeGateContextType {
  isVerified: boolean;
  verifyAge: () => void;
  leaveSite: () => void;
}

const AgeGateContext = createContext<AgeGateContextType | undefined>(undefined);

export function AgeGateProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean>(true); // Default true during SSR to prevent flash, checked on mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('lulo_age_verified');
    if (stored === 'true') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, []);

  const verifyAge = () => {
    setIsVerified(true);
    localStorage.setItem('lulo_age_verified', 'true');
  };

  const leaveSite = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AgeGateContext.Provider value={{ isVerified, verifyAge, leaveSite }}>
      {children}
    </AgeGateContext.Provider>
  );
}

export function useAgeGate() {
  const context = useContext(AgeGateContext);
  if (!context) {
    throw new Error('useAgeGate must be used within an AgeGateProvider');
  }
  return context;
}
