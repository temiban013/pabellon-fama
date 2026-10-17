'use client';

import { SITE_URL } from "@/lib/constants/site";
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
  baseUrl: SITE_URL,
  siteName: "Pabellón de la Fama del Deporte Humacaeño",
});

export function Providers({ children }: ProvidersProps) {
  return (
    <AppContext.Provider
      value={{
        baseUrl: SITE_URL,
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
