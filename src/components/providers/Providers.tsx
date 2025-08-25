'use client';

import { ReactNode, createContext, useContext } from 'react';
import { ToastProvider } from '@/components/ui/Toast';

interface ProvidersProps {
  children: ReactNode;
}

// Context para configuración global
const AppContext = createContext<{
  baseUrl: string;
  siteName: string;
}>({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org",
  siteName: "Pabellón de la Fama del Deporte Humacaeño",
});

export function Providers({ children }: ProvidersProps) {
  return (
    <AppContext.Provider
      value={{
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org",
        siteName: "Pabellón de la Fama del Deporte Humacaeño",
      }}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
