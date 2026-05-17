import { createContext, useContext, ReactNode } from 'react';
import { useSafeWallets } from '../hooks/useSafeWallets';

type SafeWalletsContextType = ReturnType<typeof useSafeWallets>;

const SafeWalletsContext = createContext<SafeWalletsContextType | null>(null);

export function SafeWalletsProvider({ children }: { children: ReactNode }) {
  const value = useSafeWallets();
  return (
    <SafeWalletsContext.Provider value={value}>
      {children}
    </SafeWalletsContext.Provider>
  );
}

export function useSafeWalletsContext(): SafeWalletsContextType {
  const ctx = useContext(SafeWalletsContext);
  if (!ctx) throw new Error('useSafeWalletsContext must be used inside SafeWalletsProvider');
  return ctx;
}
