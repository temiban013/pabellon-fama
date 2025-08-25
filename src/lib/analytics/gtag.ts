import { ANALYTICS_CONFIG } from './constants';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !ANALYTICS_CONFIG.GA_MEASUREMENT_ID) {
    return;
  }

  // gtag function should already be available from the loaded script
  // Just configure it
  window.dataLayer = window.dataLayer || [];
  
  // Only set up gtag if it doesn't exist (fallback)
  if (typeof window.gtag !== 'function') {
    window.gtag = function(...args: unknown[]) { 
      window.dataLayer.push(args); 
    };
  }
  
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    cookie_domain: ANALYTICS_CONFIG.CLIENT_DOMAIN,
    cookie_flags: 'SameSite=Strict;Secure',
    send_page_view: false, // Handle manually
    debug_mode: ANALYTICS_CONFIG.DEBUG,
    client_name: ANALYTICS_CONFIG.CLIENT_NAME
  });

  if (ANALYTICS_CONFIG.DEBUG) {
    console.log('🔍 GA4 Initialized:', ANALYTICS_CONFIG.GA_MEASUREMENT_ID);
  }
};

// Page view tracking
export const trackPageView = (url: string, title?: string | null) => {
  if (typeof window === 'undefined' || !ANALYTICS_CONFIG.GA_MEASUREMENT_ID) {
    return;
  }

  // Check if gtag is available
  if (typeof window.gtag !== 'function') {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.warn('📄 Page view tracking delayed - gtag not ready yet');
    }
    return;
  }

  window.gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href
  });

  if (ANALYTICS_CONFIG.DEBUG) {
    console.log('📄 Page view tracked:', url);
  }
};

// Custom event tracking
export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined' || !ANALYTICS_CONFIG.GA_MEASUREMENT_ID) {
    return;
  }

  // Check if gtag is available
  if (typeof window.gtag !== 'function') {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.warn('🎯 Event tracking delayed - gtag not ready yet');
    }
    return;
  }

  const eventData = {
    client_domain: ANALYTICS_CONFIG.CLIENT_DOMAIN,
    environment: ANALYTICS_CONFIG.ENVIRONMENT,
    ...parameters
  };

  window.gtag('event', eventName, eventData);

  if (ANALYTICS_CONFIG.DEBUG) {
    console.log('🎯 Event tracked:', eventName, eventData);
  }
};

// Enhanced ecommerce tracking for donations or merchandise (future use)
export const trackPurchase = (transactionData: {
  transaction_id: string;
  value: number;
  currency: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  trackEvent('purchase', {
    transaction_id: transactionData.transaction_id,
    value: transactionData.value,
    currency: transactionData.currency,
    items: transactionData.items
  });
};

// User timing tracking for performance monitoring
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
) => {
  trackEvent('timing_complete', {
    event_category: category,
    name: variable,
    value: Math.round(value),
    event_label: label
  });
};