'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { initGA, trackPageView } from '@/lib/analytics/gtag';
import { trackWebVitals } from '@/lib/analytics/analytics';
import { ANALYTICS_CONFIG } from '@/lib/analytics/constants';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views - delay until gtag is ready
  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    // Try tracking immediately, then retry if gtag isn't ready
    const tryTrackPageView = () => {
      if (typeof window.gtag === 'function') {
        trackPageView(url);
        return true;
      }
      return false;
    };

    if (!tryTrackPageView()) {
      // If gtag isn't ready, wait a bit and retry
      const retryTimer = setTimeout(() => {
        tryTrackPageView();
      }, 100);

      return () => clearTimeout(retryTimer);
    }
  }, [pathname, searchParams]);

  // Track Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(trackWebVitals);
        onFCP(trackWebVitals);
        onLCP(trackWebVitals);
        onTTFB(trackWebVitals);
        onINP(trackWebVitals);
      }).catch(console.error);
    }
  }, []);

  // Listen for cookie consent changes
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent) => {
      const { preferences } = event.detail;
      if (preferences.analytics && typeof window.gtag === 'function') {
        // Re-initialize tracking with consent
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        trackPageView(url);
        
        if (ANALYTICS_CONFIG.DEBUG) {
          console.log('🍪 Analytics enabled after consent');
        }
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    };
  }, [pathname, searchParams]);

  // Global error tracking
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (ANALYTICS_CONFIG.DEBUG) {
        console.error('Global error caught:', event.error);
      }
      
      // Track error to analytics
      import('@/lib/analytics/analytics').then(({ trackError }) => {
        trackError(event.error || new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (ANALYTICS_CONFIG.DEBUG) {
        console.error('Unhandled promise rejection:', event.reason);
      }
      
      import('@/lib/analytics/analytics').then(({ trackError }) => {
        const error = event.reason instanceof Error 
          ? event.reason 
          : new Error(String(event.reason));
        trackError(error, { type: 'unhandled_promise_rejection' });
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!ANALYTICS_CONFIG.GA_MEASUREMENT_ID) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.warn('GA Measurement ID not found');
    }
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={initGA}
      />
      
      {/* Debug mode indicator */}
      {ANALYTICS_CONFIG.DEBUG && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-md text-xs z-50">
          Analytics Debug Mode
        </div>
      )}
    </>
  );
}