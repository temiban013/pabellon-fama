import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pabellon.org"),
  title: {
    default: "Pabellón de la Fama del Deporte Humacaeño",
    template: "%s | Pabellón de la Fama del Deporte Humacaeño",
  },
  description:
    "Museo y Pabellón de la Fama que honra la excelencia deportiva de Humacao, Puerto Rico. Museo Manuel Rivera Guevara. Fundado en 1996.",
  keywords: [
    "pabellón de la fama",
    "deporte humacaeño",
    "Humacao",
    "Puerto Rico",
    "museo deportivo",
    "Manuel Rivera Guevara",
    "atletas puertorriqueños",
    "historia deportiva",
    "exaltados",
    "deporte boricua",
    "baloncesto",
    "béisbol",
    "atletismo",
    "boxeo",
    "voleibol",
  ],
  authors: [
    {
      name: "Pabellón de la Fama del Deporte Humacaeño",
      url: "https://pabellon.org",
    },
  ],
  creator: "Pabellón de la Fama del Deporte Humacaeño",
  publisher: "Pabellón de la Fama del Deporte Humacaeño",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "sports",
  classification: "Museum, Sports Hall of Fame",

  openGraph: {
    title: "Pabellón de la Fama del Deporte Humacaeño",
    description:
      "Honrando la excelencia deportiva de Humacao, Puerto Rico desde 1996. Museo Manuel Rivera Guevara.",
    url: "https://pabellon.org",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
    locale: "es_PR",
    type: "website",
    countryName: "Puerto Rico",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pabellón de la Fama del Deporte Humacaeño - Museo Manuel Rivera Guevara",
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg",
        width: 1080,
        height: 1080,
        alt: "Logo Pabellón de la Fama del Deporte Humacaeño",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@pabellonfama",
    creator: "@pabellonfama",
    title: "Pabellón de la Fama del Deporte Humacaeño",
    description:
      "Honrando la excelencia deportiva de Humacao, Puerto Rico desde 1996",
    images: {
      url: "/twitter-image.jpg",
      alt: "Pabellón de la Fama del Deporte Humacaeño",
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // verification: {
  //   google: process.env.GOOGLE_SITE_VERIFICATION,
  //   yandex: process.env.YANDEX_VERIFICATION,
  //   yahoo: process.env.YAHOO_VERIFICATION,
  //   other: {
  //     "msvalidate.01": process.env.BING_VERIFICATION || "",
  //   },
  // },

  // alternates: {
  //   canonical: "https://pabellon.org",
  //   languages: {
  //     "es-PR": "https://pabellon.org",
  //     es: "https://pabellon.org/es",
  //     en: "https://pabellon.org/en",
  //   },
  // },

  // archives: ["https://pabellondelafamahumacao.blogspot.com/"],

  // assets: ["https://pabellon.org/assets"],

  other: {
    "geo.region": "PR",
    "geo.placename": "Humacao",
    "geo.position": "18.15;-65.83",
    ICBM: "18.15, -65.83",
    "DC.title": "Pabellón de la Fama del Deporte Humacaeño",
    "DC.creator": "Pabellón de la Fama del Deporte Humacaeño",
    "DC.subject": "Deporte, Museo, Puerto Rico, Humacao, Atletas",
    "DC.description":
      "Museo y Pabellón de la Fama que honra la excelencia deportiva de Humacao, Puerto Rico.",
    "DC.publisher": "Pabellón de la Fama del Deporte Humacaeño",
    "DC.contributor": "Junta de Directores PFDH",
    "DC.date": "1996",
    "DC.type": "Website",
    "DC.format": "text/html",
    "DC.identifier": "https://pabellon.org",
    "DC.language": "es-PR",
    "DC.coverage": "Puerto Rico, Humacao",
    "DC.rights": "© 2025 Pabellón de la Fama del Deporte Humacaeño",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#15803d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme colors */}
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

        {/* Toast Provider Wrapper */}
        <ToastProvider>
          {/* Main app wrapper */}
          <div id="root" className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
