import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pabellón de la Fama del Deporte Humacaeño",
  description:
    "Museo y Pabellón de la Fama que honra la excelencia deportiva de Humacao, Puerto Rico. Museo Manuel Rivera Guevara.",
  keywords: [
    "deporte",
    "Humacao",
    "Puerto Rico",
    "museo",
    "pabellón",
    "fama",
    "atletas",
    "Manuel Rivera Guevara",
  ],
  authors: [{ name: "Pabellón de la Fama del Deporte Humacaeño" }],
  creator: "Pabellón de la Fama del Deporte Humacaeño",
  publisher: "Pabellón de la Fama del Deporte Humacaeño",

  openGraph: {
    title: "Pabellón de la Fama del Deporte Humacaeño",
    description: "Honrando la excelencia deportiva de Humacao, Puerto Rico",
    url: "https://pabellon.org",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
    locale: "es_PR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Agregar imagen cuando esté disponible
        width: 1200,
        height: 630,
        alt: "Pabellón de la Fama del Deporte Humacaeño",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Pabellón de la Fama del Deporte Humacaeño",
    description: "Honrando la excelencia deportiva de Humacao, Puerto Rico",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  viewport: "width=device-width, initial-scale=1",

  // Agregar cuando estén disponibles
  // verification: {
  //   google: 'google-verification-code',
  //   yandex: 'yandex-verification-code',
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Favicons - agregar cuando estén disponibles */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme color para mobile browsers */}
        <meta name="theme-color" content="#15803d" />
        <meta name="msapplication-TileColor" content="#15803d" />

        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {/* Skip to content para accesibilidad */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pabellon-gold-500 text-white px-4 py-2 rounded-lg z-50"
        >
          Saltar al contenido principal
        </a>

        {/* Main app wrapper */}
        <div id="root" className="min-h-screen flex flex-col">
          {children}
        </div>

        {/* Scripts adicionales si son necesarios */}
        {/* <script>console.log('Pabellón de la Fama loaded');</script> */}
      </body>
    </html>
  );
}
