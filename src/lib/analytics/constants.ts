// Analytics Configuration Constants
export const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_ID,
  GTM_ID: 'GTM-5CNPGJ4D', // Already configured in layout
  CLIENT_DOMAIN: process.env.NEXT_PUBLIC_CLIENT_DOMAIN || 'pfdh.org',
  CLIENT_NAME: process.env.NEXT_PUBLIC_CLIENT_NAME || 'Pabellón de la Fama del Deporte Humacaeño',
  CLIENT_EMAIL: process.env.NEXT_PUBLIC_CLIENT_EMAIL || 'informa@pfdh.org',
  DEBUG: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true',
  ENVIRONMENT: process.env.NODE_ENV || 'production'
};

export const COOKIE_SETTINGS = {
  CONSENT_COOKIE: 'pfdh_analytics_consent',
  PREFERENCES_COOKIE: 'pfdh_analytics_preferences',
  COOKIE_DOMAIN: process.env.NEXT_PUBLIC_CLIENT_DOMAIN ? `.${process.env.NEXT_PUBLIC_CLIENT_DOMAIN}` : '.pfdh.org', // Subdomain support
  COOKIE_EXPIRES: 365 // days
};

export const STANDARD_EVENTS = {
  PAGE_VIEW: 'page_view',
  FORM_SUBMISSION: 'form_submission',
  FILE_DOWNLOAD: 'file_download',
  EXTERNAL_LINK: 'external_link_click',
  SCROLL_DEPTH: 'scroll_depth',
  SITE_SEARCH: 'site_search',
  ERROR_TRACKING: 'javascript_error',
  // Custom events for Pabellón
  EXALTADO_VIEW: 'exaltado_view',
  REGISTRATION_START: 'registration_start',
  REGISTRATION_COMPLETE: 'registration_complete',
  MUSEUM_TOUR: 'museum_tour_view',
  CALENDAR_EVENT_VIEW: 'calendar_event_view',
  CONTACT_FORM_SUBMIT: 'contact_form_submit'
};

// Analytics categories for better organization
export const EVENT_CATEGORIES = {
  ENGAGEMENT: 'engagement',
  NAVIGATION: 'navigation',
  FORM: 'form',
  ERROR: 'error',
  EXALTADOS: 'exaltados',
  MUSEUM: 'museum',
  REGISTRATION: 'registration'
};