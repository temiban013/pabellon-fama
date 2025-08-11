import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pabellón de la Fama del Deporte Humacaeño",
  description:
    "Museo y Pabellón de la Fama que honra la excelencia deportiva de Humacao, Puerto Rico",
  keywords: "deporte, Humacao, Puerto Rico, museo, pabellón, fama, atletas",
  authors: [{ name: "Pabellón de la Fama del Deporte Humacaeño" }],
  openGraph: {
    title: "Pabellón de la Fama del Deporte Humacaeño",
    description: "Honrando la excelencia deportiva de Humacao, Puerto Rico",
    url: "https://pabellon.org",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
    locale: "es_PR",
    type: "website",
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
  verification: {
    // Agregar códigos de verificación cuando estén disponibles
    // google: 'código-de-google',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
