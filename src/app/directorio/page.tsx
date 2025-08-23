import type { Metadata, Viewport } from "next";
import { DirectorioClient } from "@/components/directorio/DirectorioClient";

export const metadata: Metadata = {
  title: "Directorio de Exaltados | Pabellón de la Fama del Deporte Humacaeño",
  description:
    "Explora el directorio completo de atletas, propulsores y figuras deportivas exaltados en el Pabellón de la Fama del Deporte Humacaeño desde 1996.",
  keywords: [
    "directorio exaltados",
    "atletas humacaeños",
    "deportistas Puerto Rico",
    "pabellón de la fama",
    "béisbol humacao",
    "atletismo puerto rico",
    "boxeo humacao",
    "fútbol humacao",
    "baloncesto humacao",
  ],
  openGraph: {
    title: "Directorio de Exaltados - Pabellón de la Fama Humacaeño",
    description:
      "Conoce a los 78+ atletas y figuras deportivas que han sido exaltados por su contribución al deporte humacaeño.",
    url: "https://pabellon.org/directorio",
    type: "website",
    images: [
      {
        url: "/og-directorio.jpg",
        width: 1200,
        height: 630,
        alt: "Directorio de Exaltados del Pabellón de la Fama",
      },
    ],
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
              Humacao, Puerto Rico. Desde 1996, honramos la excelencia deportiva
              de nuestra comunidad.
            </p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-md border border-pabellon-gold-200">
              <div className="text-2xl lg:text-3xl font-bold text-pabellon-gold-600 mb-1">
                78+
              </div>
              <p className="text-sm font-medium text-pabellon-green-700">
                Exaltados
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
                8
              </div>
              <p className="text-sm font-medium text-pabellon-green-700">
                Exaltaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Componente cliente con funcionalidades interactivas */}
      <DirectorioClient />
    </div>
  );
}
