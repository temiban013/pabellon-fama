import { ANALYTICS_CONFIG } from './constants';

export const debugAnalytics = () => {
  if (!ANALYTICS_CONFIG.DEBUG || typeof window === 'undefined') return;
  
  console.log('🔍 Analytics Debug Information:');
  console.log('GA Measurement ID:', ANALYTICS_CONFIG.GA_MEASUREMENT_ID);
  console.log('GTM ID:', ANALYTICS_CONFIG.GTM_ID);
  console.log('Client Domain:', ANALYTICS_CONFIG.CLIENT_DOMAIN);
  console.log('Client Name:', ANALYTICS_CONFIG.CLIENT_NAME);
  console.log('Client Email:', ANALYTICS_CONFIG.CLIENT_EMAIL);
  console.log('Environment:', ANALYTICS_CONFIG.ENVIRONMENT);
  
  // Check if gtag is loaded
  if (window.gtag) {
    console.log('✅ Google Analytics loaded successfully');
    
    // Test event
    window.gtag('event', 'debug_test', {
      event_category: 'debug',
      event_label: 'analytics_debug_test',
      debug_mode: true
    });
    
    console.log('📤 Test event sent');
  } else {
    console.log('❌ Google Analytics not loaded');
  }
  
  // Check dataLayer
  if (window.dataLayer) {
    console.log('📊 DataLayer entries:', window.dataLayer.length);
    console.log('Latest dataLayer entries:', window.dataLayer.slice(-5));
  }
};

// Auto-run in development
if (ANALYTICS_CONFIG.DEBUG && typeof window !== 'undefined') {
  (window as unknown as { debugAnalytics: typeof debugAnalytics }).debugAnalytics = debugAnalytics;
  console.log('🛠️ Analytics debug mode enabled. Run debugAnalytics() in console for details.');
}

export default debugAnalytics;