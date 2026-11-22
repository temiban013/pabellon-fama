import { SITE_URL, siteUrl } from "@/lib/constants/site";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DirectorioClient } from "@/components/directorio/DirectorioClient";
import { PABELLON_CONSTANTS } from "@/lib/utils";
import { getTotalesExaltados } from "@/lib/exaltados-totales";

/** Totales calculados de los datos (PF-074, D101): no se escriben a mano. */
const totales = getTotalesExaltados();

/** Año actual en Puerto Rico (AST), para el rango "DC.date". */
const anioActual = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: "America/Puerto_Rico",
}).format(new Date());

export const metadata: Metadata = {
  title: "Directorio de Exaltados | Pabellón de la Fama del Deporte Humacaeño",
  description:
    `Directorio completo con ${totales.entradas} exaltados del Pabellón de la Fama del Deporte Humacaeño: ${totales.personas} atletas individuales y ${totales.equipos} equipos históricos que han marcado la excelencia deportiva en Humacao, Puerto Rico desde ${PABELLON_CONSTANTS.FOUNDED_YEAR}. Búsqueda avanzada con filtros por deporte, década, categoría y estado. Explora biografías, logros y contribuciones al deporte.`,
  keywords: [
    "directorio exaltados humacao",
    "atletas humacaeños famosos",
    "deportistas puerto rico",
    "pabellón de la fama humacao",
    "hall of fame deportivo",
    "béisbol humacao pr",
    "atletismo puerto rico",
    "boxeo humacao",
    "fútbol humacao",
    "baloncesto humacao",
    "voleibol puerto rico",
    "tenis humacao",
    "natación puerto rico",
    "deportes acuáticos",
    "deporte humacaeño",
    "historia deportiva puerto rico",
    "leyendas deportivas",
    "propulsores deportivos",
    "museo deportivo humacao",
    "manuel rivera guevara",
    "exaltación deportiva",
    "búsqueda atletas",
    "filtro deportistas",
    "biografías deportivas",
  ],
  authors: [{ name: "Pabellón de la Fama del Deporte Humacaeño" }],
  creator: "Pabellón de la Fama del Deporte Humacaeño",
  publisher: "Pabellón de la Fama del Deporte Humacaeño",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/directorio",
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
  openGraph: {
    title: "Directorio de Exaltados - Pabellón de la Fama del Deporte Humacaeño",
    description:
      `Descubre a los ${totales.entradas} exaltados del deporte humacaeño: atletas legendarios, propulsores visionarios y equipos históricos que han llevado en alto el nombre de Humacao, Puerto Rico. Desde ${PABELLON_CONSTANTS.FOUNDED_YEAR} honrando la excelencia deportiva.`,
    url: "/directorio",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
    type: "website",
    locale: "es_PR",
    images: [
      {
        url: "/images/museo/fachada-museo.jpg",
        width: 1200,
        height: 630,
        alt: `Directorio de ${totales.entradas} Exaltados del Pabellón de la Fama del Deporte Humacaeño - Atletas, Propulsores y Equipos Legendarios`,
        type: "image/jpeg",
      },
      {
        url: "/images/logo-pabellon-square.png",
        width: 400,
        height: 400,
        alt: "Logo Pabellón de la Fama del Deporte Humacaeño",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Directorio de Exaltados - Pabellón Fama Deportiva Humacao",
    description:
      `${totales.entradas} exaltados del deporte humacaeño: atletas, propulsores y equipos que han marcado la historia deportiva de Puerto Rico desde ${PABELLON_CONSTANTS.FOUNDED_YEAR}.`,
    images: ["/images/museo/fachada-museo.jpg"],
    creator: "@PabellonHumacao",
    site: "@PabellonHumacao",
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Sports Hall of Fame",
  classification: "Sports Directory",
  other: {
    "geo.region": "PR-HUM",
    "geo.placename": "Humacao",
    "geo.position": "18.150000;-65.750000",
    "ICBM": "18.150000, -65.750000",
    "DC.title": "Directorio de Exaltados del Pabellón de la Fama del Deporte Humacaeño",
    "DC.creator": "Pabellón de la Fama del Deporte Humacaeño",
    "DC.subject": "Sports Hall of Fame Directory, Puerto Rico Athletes",
    "DC.description": `Complete directory of ${totales.entradas} inductees into the Humacao Sports Hall of Fame`,
    "DC.publisher": "Pabellón de la Fama del Deporte Humacaeño",
    "DC.contributor": "Manuel Rivera Guevara Museum",
    "DC.date": `${PABELLON_CONSTANTS.FOUNDED_YEAR}-${anioActual}`,
    "DC.type": "Interactive Directory",
    "DC.format": "text/html",
    "DC.identifier": siteUrl("/directorio"),
    "DC.source": SITE_URL,
    "DC.language": "es-PR",
    "DC.relation": siteUrl("/museo"),
    "DC.coverage": "Humacao, Puerto Rico",
    "DC.rights": "© 2025 Pabellón de la Fama del Deporte Humacaeño",
    "article:section": "Sports Directory",
    "article:tag": "Hall of Fame, Puerto Rico Sports, Athletes Directory, Humacao",
    "og:street-address": "Centro Cultural Dra. Antonia Sáez",
    "og:locality": "Humacao",
    "og:region": "Puerto Rico",
    "og:postal-code": "00791",
    "og:country-name": "Puerto Rico",
    "place:location:latitude": "18.150000",
    "place:location:longitude": "-65.750000",
    "business:contact_data:street_address": "Centro Cultural Dra. Antonia Sáez",
    "business:contact_data:locality": "Humacao",
    "business:contact_data:region": "Puerto Rico",
    "business:contact_data:postal_code": "00791",
    "business:contact_data:country_name": "Puerto Rico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function DirectorioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section del Directorio */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-br from-pabellon-green-50 via-white to-pabellon-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="bg-white px-6 py-6 lg:px-12 lg:py-8 border-2 border-dashed border-pabellon-green-300 rounded-lg shadow-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pabellon-green-800 mb-3">
                  Directorio de Exaltados
                </h1>
                <p className="text-lg lg:text-xl text-pabellon-gold-600 font-medium">
                  Honrando la excelencia deportiva humacaeña
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="w-24 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-green-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Conoce a los atletas, propulsores y figuras deportivas que han
              sido exaltados por su destacada contribución al deporte en
              Humacao, Puerto Rico. Desde {PABELLON_CONSTANTS.FOUNDED_YEAR}, honramos la excelencia deportiva
              de nuestra comunidad. Utiliza los filtros avanzados para explorar
              por deporte, década, categoría y más.
            </p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-pabellon-gold-200">
              <div className="text-2xl lg:text-3xl font-bold text-pabellon-gold-600 mb-1">
                {totales.entradas}
              </div>
              <p className="text-sm font-medium text-pabellon-green-700">
                Exaltados
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totales.personas} individuos + {totales.equipos} equipos
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-pabellon-gold-200">
              <div className="text-2xl lg:text-3xl font-bold text-pabellon-gold-600 mb-1">
                12+
              </div>
              <p className="text-sm font-medium text-pabellon-green-700">
                Deportes
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-pabellon-gold-200">
              <div className="text-2xl lg:text-3xl font-bold text-pabellon-gold-600 mb-1">
                29
              </div>
              <p className="text-sm font-medium text-pabellon-green-700">
                Años
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-pabellon-gold-200">
              <div className="text-2xl lg:text-3xl font-bold text-pabellon-gold-600 mb-1">
                {totales.ceremonias}
              </div>
              <p className="text-sm font-medium text-pabellon-green-700">
                Exaltaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Componente cliente con funcionalidades interactivas */}
      <Suspense
        fallback={
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <DirectorioClient />
      </Suspense>
    </div>
  );
}
