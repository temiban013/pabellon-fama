import { trackEvent } from './gtag';
import { STANDARD_EVENTS, EVENT_CATEGORIES } from './constants';

// Form submission tracking
export const trackFormSubmission = (formName: string, formData: Record<string, unknown> = {}) => {
  trackEvent(STANDARD_EVENTS.FORM_SUBMISSION, {
    event_category: EVENT_CATEGORIES.FORM,
    event_label: formName,
    form_name: formName,
    form_location: window.location.pathname,
    ...formData
  });
};

// File download tracking
export const trackFileDownload = (fileName: string, fileUrl: string, fileType: string) => {
  trackEvent(STANDARD_EVENTS.FILE_DOWNLOAD, {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    event_label: fileName,
    file_name: fileName,
    file_type: fileType,
    download_url: fileUrl,
    page_location: window.location.pathname
  });
};

// External link tracking
export const trackExternalLink = (linkUrl: string, linkText?: string) => {
  trackEvent(STANDARD_EVENTS.EXTERNAL_LINK, {
    event_category: EVENT_CATEGORIES.NAVIGATION,
    event_label: linkUrl,
    link_url: linkUrl,
    link_text: linkText,
    page_location: window.location.pathname
  });
};

// Scroll depth tracking
export const trackScrollDepth = (percentage: number) => {
  trackEvent(STANDARD_EVENTS.SCROLL_DEPTH, {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    event_label: `${percentage}%`,
    scroll_percentage: percentage,
    page_location: window.location.pathname
  });
};

// Site search tracking
export const trackSiteSearch = (searchTerm: string, resultsCount?: number | null) => {
  trackEvent(STANDARD_EVENTS.SITE_SEARCH, {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    event_label: searchTerm,
    search_term: searchTerm,
    search_results_count: resultsCount,
    page_location: window.location.pathname
  });
};

// Error tracking
export const trackError = (error: Error, errorInfo: Record<string, unknown> = {}) => {
  trackEvent(STANDARD_EVENTS.ERROR_TRACKING, {
    event_category: EVENT_CATEGORIES.ERROR,
    event_label: error.message || 'Unknown error',
    error_message: error.message,
    error_stack: error.stack,
    page_location: window.location.pathname,
    user_agent: navigator.userAgent,
    ...errorInfo
  });
};

// Custom Pabellón events

// Track when someone views an exaltado profile
export const trackExaltadoView = (exaltadoInfo: {
  name: string;
  year?: string;
  sport?: string;
  category?: string;
}) => {
  trackEvent(STANDARD_EVENTS.EXALTADO_VIEW, {
    event_category: EVENT_CATEGORIES.EXALTADOS,
    event_label: exaltadoInfo.name,
    exaltado_name: exaltadoInfo.name,
    exaltado_year: exaltadoInfo.year,
    exaltado_sport: exaltadoInfo.sport,
    exaltado_category: exaltadoInfo.category,
    page_location: window.location.pathname
  });
};

// Track registration events
export const trackRegistration = {
  start: (registrationType: string) => {
    trackEvent(STANDARD_EVENTS.REGISTRATION_START, {
      event_category: EVENT_CATEGORIES.REGISTRATION,
      event_label: registrationType,
      registration_type: registrationType,
      page_location: window.location.pathname
    });
  },
  
  complete: (registrationType: string, registrationId?: string) => {
    trackEvent(STANDARD_EVENTS.REGISTRATION_COMPLETE, {
      event_category: EVENT_CATEGORIES.REGISTRATION,
      event_label: registrationType,
      registration_type: registrationType,
      registration_id: registrationId,
      page_location: window.location.pathname
    });
  }
};

// Track museum tour views
export const trackMuseumTour = (section?: string) => {
  trackEvent(STANDARD_EVENTS.MUSEUM_TOUR, {
    event_category: EVENT_CATEGORIES.MUSEUM,
    event_label: section || 'general',
    museum_section: section,
    page_location: window.location.pathname
  });
};

// Track calendar event views
export const trackCalendarEventView = (eventInfo: {
  title: string;
  date?: string;
  category?: string;
}) => {
  trackEvent(STANDARD_EVENTS.CALENDAR_EVENT_VIEW, {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    event_label: eventInfo.title,
    calendar_event_title: eventInfo.title,
    calendar_event_date: eventInfo.date,
    calendar_event_category: eventInfo.category,
    page_location: window.location.pathname
  });
};

// Track contact form submissions
export const trackContactFormSubmit = (subject?: string) => {
  trackEvent(STANDARD_EVENTS.CONTACT_FORM_SUBMIT, {
    event_category: EVENT_CATEGORIES.FORM,
    event_label: subject || 'general_inquiry',
    contact_subject: subject,
    page_location: window.location.pathname
  });
};

// Web Vitals tracking
export const trackWebVitals = (metric: {
  name: string;
  id: string;
  value: number;
  delta?: number;
  rating?: string;
}) => {
  if (typeof window === 'undefined') return;

  trackEvent(metric.name.toLowerCase(), {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating
  });
};