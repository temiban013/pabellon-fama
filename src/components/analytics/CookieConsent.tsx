'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { COOKIE_SETTINGS, ANALYTICS_CONFIG } from '@/lib/analytics/constants';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  // Use null as initial state to prevent hydration mismatch
  const [showConsent, setShowConsent] = useState<boolean | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Only run on client-side after hydration
    const consent = Cookies.get(COOKIE_SETTINGS.CONSENT_COOKIE);
    if (!consent) {
      setShowConsent(true);
    } else {
      setShowConsent(false);
      const savedPreferences = Cookies.get(COOKIE_SETTINGS.PREFERENCES_COOKIE);
      if (savedPreferences) {
        try {
          setPreferences(JSON.parse(savedPreferences));
        } catch (e) {
          console.error('Failed to parse cookie preferences:', e);
        }
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    
    saveConsent(allPreferences);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    
    saveConsent(minimalPreferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const cookieOptions = {
      expires: COOKIE_SETTINGS.COOKIE_EXPIRES,
      secure: true,
      sameSite: 'strict' as const
    };

    // Set consent cookie
    Cookies.set(COOKIE_SETTINGS.CONSENT_COOKIE, 'true', cookieOptions);
    
    // Set preferences cookie
    Cookies.set(COOKIE_SETTINGS.PREFERENCES_COOKIE, JSON.stringify(prefs), cookieOptions);
    
    setPreferences(prefs);
    setShowConsent(false);
    
    // Initialize analytics if consent given, without reload
    if (prefs.analytics && typeof window !== 'undefined') {
      // Dispatch a custom event to notify analytics components
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
        detail: { preferences: prefs } 
      }));
    }
  };

  // Don't render anything until client-side hydration completes
  if (showConsent !== true) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pabellon-gold p-4 shadow-lg z-50 animate-slide-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              🍪 Preferencias de Cookies
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y para propósitos de marketing. 
              Puedes elegir qué cookies aceptar.
            </p>
            
            {showDetails && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="mt-1 rounded border-gray-300 text-pabellon-blue focus:ring-pabellon-blue"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-700 block">
                      Necesarias
                    </span>
                    <span className="text-xs text-gray-500">
                      Esenciales para el funcionamiento del sitio
                    </span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="mt-1 rounded border-gray-300 text-pabellon-blue focus:ring-pabellon-blue"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-700 block">
                      Analíticas
                    </span>
                    <span className="text-xs text-gray-500">
                      Nos ayudan a entender cómo usas el sitio
                    </span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                    className="mt-1 rounded border-gray-300 text-pabellon-blue focus:ring-pabellon-blue"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-700 block">
                      Marketing
                    </span>
                    <span className="text-xs text-gray-500">
                      Para mostrar contenido relevante
                    </span>
                  </div>
                </label>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-pabellon-blue hover:underline"
            >
              {showDetails ? 'Ocultar detalles' : 'Más información'}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Rechazar Todo
            </button>
            {showDetails && (
              <button
                onClick={handleAcceptSelected}
                className="px-4 py-2 text-sm text-white bg-pabellon-blue rounded-md hover:bg-blue-700 transition-colors"
              >
                Aceptar Seleccionadas
              </button>
            )}
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm text-white bg-pabellon-green-700 rounded-md hover:bg-pabellon-green-800 transition-colors"
            >
              Aceptar Todo
            </button>
          </div>
        </div>

        {/* Privacy Policy Link */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Al continuar navegando, aceptas nuestras{' '}
            <a href="/privacidad" className="text-pabellon-blue hover:underline">
              Políticas de Privacidad
            </a>
            . Para más información: {ANALYTICS_CONFIG.CLIENT_EMAIL || 'informa@pfdh.org'}
          </p>
        </div>
      </div>
    </div>
  );
}