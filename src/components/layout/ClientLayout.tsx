'use client';

import { useAutoTracking } from '@/hooks/useAutoTracking';
import { useEffect } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Enable auto-tracking for all pages
  useAutoTracking();

  // Debug analytics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/analytics/debug').then(({ debugAnalytics }) => {
        // Run debug after a short delay to ensure GA is loaded
        setTimeout(debugAnalytics, 2000);
      });
    }
  }, []);

  return <>{children}</>;
}