'use client';

import { useEffect } from 'react';
import { trackFileDownload, trackExternalLink, trackScrollDepth, trackFormSubmission } from '@/lib/analytics';

export function useAutoTracking() {
  useEffect(() => {
    // File download tracking
    const trackDownloads = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href, window.location.origin);
          const fileExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|mp4|mp3|avi|mov|jpg|jpeg|png|gif)$/i;
          
          if (fileExtensions.test(url.pathname)) {
            const fileName = url.pathname.split('/').pop() || 'unknown';
            const fileType = fileName.split('.').pop() || 'unknown';
            trackFileDownload(fileName, url.href, fileType);
          }
        } catch (error) {
          console.error('Error tracking download:', error);
        }
      }
    };

    // External link tracking
    const trackExternal = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href, window.location.origin);
          const currentDomain = window.location.hostname;
          
          // Track external links (not same domain, not localhost, not relative)
          if (url.hostname !== currentDomain && 
              !url.hostname.includes('localhost') && 
              !url.hostname.includes('pfdh.org')) {
            trackExternalLink(url.href, link.textContent || link.innerHTML);
          }
        } catch (error) {
          console.error('Error tracking external link:', error);
        }
      }
    };

    // Form submission tracking
    const trackForms = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form && form.tagName === 'FORM') {
        const formName = form.name || form.id || 'unnamed-form';
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        
        // Remove sensitive data
        const sensitiveFields = ['password', 'pwd', 'pass', 'ssn', 'social', 'credit', 'card', 'cvv', 'cvc'];
        const sanitizedData = Object.keys(formObject).reduce((acc: Record<string, unknown>, key) => {
          const element = form.elements.namedItem(key);
          const isHidden = element && 'getAttribute' in element ? element.getAttribute('type') === 'hidden' : false;
          const isSensitive = sensitiveFields.some(sensitive => 
            key.toLowerCase().includes(sensitive));
          
          if (!isHidden && !isSensitive) {
            // Only include first 50 chars of string values for privacy
            acc[key] = typeof formObject[key] === 'string' 
              ? (formObject[key] as string).substring(0, 50) 
              : formObject[key];
          }
          return acc;
        }, {});
        
        trackFormSubmission(formName, sanitizedData);
      }
    };

    // Scroll depth tracking
    let maxScrollDepth = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const triggeredThresholds = new Set<number>();
    let scrollTimer: NodeJS.Timeout;

    const trackScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (documentHeight > 0) {
          const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
          maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);

          scrollThresholds.forEach(threshold => {
            if (scrollPercentage >= threshold && !triggeredThresholds.has(threshold)) {
              triggeredThresholds.add(threshold);
              trackScrollDepth(threshold);
            }
          });
        }
      }, 150); // Debounce scroll events
    };

    // Add event listeners
    document.addEventListener('click', trackDownloads);
    document.addEventListener('click', trackExternal);
    document.addEventListener('submit', trackForms);
    window.addEventListener('scroll', trackScroll, { passive: true });

    // Track initial scroll position
    trackScroll();

    // Cleanup
    return () => {
      document.removeEventListener('click', trackDownloads);
      document.removeEventListener('click', trackExternal);
      document.removeEventListener('submit', trackForms);
      window.removeEventListener('scroll', trackScroll);
      clearTimeout(scrollTimer);
    };
  }, []);
}

export default useAutoTracking;