import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import { Suspense } from "react";
import {
  generateMetadata as generateSEOMetadata,
  generateJsonLd,
  seoConfigs,
} from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NitainoCredit } from "@/components/shared/NitainoCredit";
import { Providers } from "@/components/providers/Providers";
import Analytics from "@/components/analytics/Analytics";
import CookieConsent from "@/components/analytics/CookieConsent";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { IconLinks } from "@/components/SEO/IconLinks";
import Script from "next/script";
import "./globals.css";

// Fuentes optimizadas
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-slab",
  preload: true,
});

// Metadata estática del sitio
export const metadata: Metadata = generateSEOMetadata(seoConfigs.home);

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0066CC" },
    { media: "(prefers-color-scheme: dark)", color: "#0066CC" },
  ],
  colorScheme: "light",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const organizationJsonLd = generateJsonLd("organization", {});

  return (
    <html
      lang="es-PR"
      className={`${inter.variable} ${robotoSlab.variable}`}
      suppressHydrationWarning
    >
      <head>

        {/* Iconos y PWA */}
        <IconLinks />

        {/* DNS prefetch for deferred analytics */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Structured Data - Organización */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        {/* Verification Tags */}
        <meta
          name="google-site-verification"
          content="your-google-verification-code"
        />
        <meta name="msvalidate.01" content="your-bing-verification-code" />

        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="language" content="Spanish" />
        <meta name="geo.region" content="PR-HUM" />
        <meta name="geo.placename" content="Humacao, Puerto Rico" />
        <meta name="geo.position" content="18.1500;-65.8333" />
        <meta name="ICBM" content="18.1500, -65.8333" />

        {/* Performance Hints - Preload removed due to unused resource warning */}
        {/* Font preload commented out until we have actual custom fonts
        <link
          rel="preload"
          href="/fonts/custom-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        */}
      </head>

      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5CNPGJ4D"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Providers para estado global */}
        <Providers>
          <ClientLayout>
            {/* Skip to main content - Accesibilidad */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
            >
              Saltar al contenido principal
            </a>

            {/* Layout Structure */}
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              <Header />

              {/* Main Content */}
              <main id="main-content" className="flex-grow" role="main">
                {children}
              </main>

              {/* Footer */}
              <Footer />
              <NitainoCredit lang="es" variant="full" utmSource="pabellon-fama" />
            </div>

            {/* Toast Container */}
            <div id="toast-root" />
          </ClientLayout>
        </Providers>

        {/* Analytics y Scripts */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <CookieConsent />

        {/* Google Tag Manager - interaction-first loading (scroll/mousemove/touch/keydown + 5s fallback) */}
        <Script
          id="gtm-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var loaded = false;
                function loadGTM() {
                  if (loaded) return;
                  loaded = true;
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-5CNPGJ4D');
                }
                ['mousemove','scroll','keydown','touchstart'].forEach(function(e) {
                  document.addEventListener(e, loadGTM, {once: true, passive: true});
                });
                setTimeout(loadGTM, 5000);
              })();
            `,
          }}
        />


        {/* Emergency Contact Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPoint",
              telephone: "+1-787-410-1237",
              contactType: "customer service",
              availableLanguage: ["Spanish", "English"],
              areaServed: "PR",
            }),
          }}
        />
      </body>
    </html>
  );
}
