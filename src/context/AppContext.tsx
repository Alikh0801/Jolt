import React, { createContext, useContext, useMemo, useState } from 'react';
import { ServiceCategoryId, Usta, mockUstas } from '../data/mock';

export type Role = 'customer' | 'provider';

interface ActiveRequest {
  category: ServiceCategoryId;
  note: string;
  usta: Usta;
}

interface AppContextValue {
  role: Role | null;
  setRole: (role: Role) => void;
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;
  activeRequest: ActiveRequest | null;
  startRequest: (category: ServiceCategoryId, note: string) => void;
  clearRequest: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);

  const value = useMemo<AppContextValue>(
    () => ({
      role,
      setRole,
      isOnline,
      setIsOnline,
      activeRequest,
      startRequest: (category, note) => {
        const usta = mockUstas[Math.floor(Math.random() * mockUstas.length)];
        setActiveRequest({ category, note, usta });
      },
      clearRequest: () => setActiveRequest(null),
      resetApp: () => {
        setRole(null);
        setActiveRequest(null);
      },
    }),
    [role, isOnline, activeRequest]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
