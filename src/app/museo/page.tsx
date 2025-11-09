import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";

// Lazy load GoogleMap component for better performance
const GoogleMap = dynamic(() => import("@/components/ui/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

export const metadata: Metadata = {
  title:
    "Museo Manuel Rivera Guevara | Pabellón de la Fama del Deporte Humacaeño",
  description:
    "Visita el Museo Manuel Rivera Guevara, sede física del Pabellón de la Fama del Deporte Humacaeño. Tour virtual, exhibiciones y horarios de visita.",
  keywords: [
    "Museo Manuel Rivera Guevara",
    "Pabellón de la Fama",
    "Humacao",
    "Puerto Rico",
    "tour virtual",
    "museo deportivo",
    "exhibiciones",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function MuseoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section del Museo */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-pabellon-brown-50 via-white to-pabellon-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className="bg-white px-8 py-8 lg:px-16 lg:py-12 border-2 border-dashed border-pabellon-brown-300 rounded-lg shadow-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-pabellon-green-800 mb-4">
                  Museo Manuel Rivera Guevara
                </h1>
                <p className="text-lg lg:text-xl text-pabellon-gold-600 font-medium">
                  Sede física del Pabellón de la Fama del Deporte Humacaeño
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-32 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-brown-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Bienvenido al hogar físico de la historia deportiva humacaeña.
              Nuestro museo alberga exhibiciones permanentes y temporales que
              honran a los atletas, entrenadores y figuras que han marcado la
              excelencia deportiva en Humacao.
            </p>
          </div>
        </div>
      </section>

      {/* Tour Virtual Section */}
      <section id="tour-virtual" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-pabellon-green-800 mb-4">
              Tour Virtual del Museo
            </h2>
            <p className="text-xl text-pabellon-green-700 max-w-2xl mx-auto">
              Próximamente: Tour virtual interactivo del museo
            </p>
          </div>

          {/* Imagen del museo con tour virtual */}
          <div className="relative max-w-5xl mx-auto mb-12">
            <div className="relative group">
              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-pabellon-gold-200">
                <div className="aspect-video bg-gradient-to-b from-pabellon-green-100 to-pabellon-green-200 rounded-lg overflow-hidden relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏛️</div>
                    <h3 className="text-2xl font-bold text-pabellon-green-800 mb-2">
                      Tour Virtual Próximamente
                    </h3>
                    <p className="text-pabellon-green-700">
                      Estamos trabajando en crear una experiencia virtual inmersiva del museo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opciones de visita */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card-pabellon p-6 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-lg font-semibold text-pabellon-green-800 mb-2">
                Visita Presencial
              </h3>
              <p className="text-sm text-pabellon-green-600 mb-4">
                Ven y conoce el museo en persona. Entrada gratuita para todos los visitantes.
              </p>
              <p className="text-sm text-pabellon-green-700 font-medium">
                Lunes a Viernes: 8:00 AM - 4:00 PM<br/>
                Sábados: 10:00 AM - 2:00 PM
              </p>
            </div>

            <div className="card-pabellon p-6 text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-lg font-semibold text-pabellon-green-800 mb-2">
                Reserva tu Visita
              </h3>
              <p className="text-sm text-pabellon-green-600 mb-4">
                Para visitas grupales o programadas, contáctanos con anticipación.
              </p>
              <p className="text-sm text-pabellon-green-700 font-medium mb-2">
                📞 (787) 410-1237
              </p>
              <p className="text-sm text-pabellon-green-700 font-medium mb-4">
                ✉️ informa@pfdh.org
              </p>
              <button className="btn-pabellon w-full">
                Llamar (787) 410-1237
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibiciones Section */}
      <section id="exhibiciones" className="py-16 bg-pabellon-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-pabellon-green-800 mb-4">
              Nuestras Exhibiciones
            </h2>
            <p className="text-xl text-pabellon-green-700">
              Descubre las salas temáticas del museo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-pabellon p-8">
              <h3 className="text-2xl font-bold text-pabellon-green-800 mb-4">
                🏆 Sala de Exaltados
              </h3>
              <p className="text-pabellon-green-700 mb-4">
                Conoce las biografías, logros y contribuciones de los atletas y
                figuras deportivas que han sido exaltados al Pabellón de la
                Fama.
              </p>
              <ul className="text-sm text-pabellon-green-600 space-y-2">
                <li>• Placas conmemorativas de todos los exaltados</li>
                <li>• Fotografías históricas</li>
                <li>• Documentos y certificados originales</li>
                <li>• Timeline interactivo de exaltaciones</li>
              </ul>
            </div>

            <div className="card-pabellon p-8">
              <h3 className="text-2xl font-bold text-pabellon-green-800 mb-4">
                🥇 Sala de Trofeos y Medallas
              </h3>
              <p className="text-pabellon-green-700 mb-4">
                Exhibición permanente de trofeos, medallas y reconocimientos
                obtenidos por atletas humacaeños en competencias locales e
                internacionales.
              </p>
              <ul className="text-sm text-pabellon-green-600 space-y-2">
                <li>• Medallas olímpicas y panamericanas</li>
                <li>• Trofeos de campeonatos nacionales</li>
                <li>• Reconocimientos especiales</li>
                <li>• Uniformes históricos</li>
              </ul>
            </div>

            <div className="card-pabellon p-8">
              <h3 className="text-2xl font-bold text-pabellon-green-800 mb-4">
                📚 Archivo Histórico
              </h3>
              <p className="text-pabellon-green-700 mb-4">
                Consulta documentos, fotografías y memorabilia que narran la
                rica historia del deporte en Humacao desde principios del siglo
                XX.
              </p>
              <ul className="text-sm text-pabellon-green-600 space-y-2">
                <li>• Periódicos y recortes históricos</li>
                <li>• Fotografías de eventos deportivos</li>
                <li>• Documentos fundacionales</li>
                <li>• Material audiovisual histórico</li>
              </ul>
            </div>

            <div className="card-pabellon p-8">
              <h3 className="text-2xl font-bold text-pabellon-green-800 mb-4">
                🎬 Sala Audiovisual
              </h3>
              <p className="text-pabellon-green-700 mb-4">
                Disfruta de documentales, entrevistas y material audiovisual que
                complementa tu experiencia en el museo.
              </p>
              <ul className="text-sm text-pabellon-green-600 space-y-2">
                <li>• Documentales sobre atletas humacaeños</li>
                <li>• Entrevistas con exaltados</li>
                <li>• Cobertura de eventos históricos</li>
                <li>• Presentaciones educativas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Horarios y Visitación */}
      <section id="horarios" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-pabellon-green-800 mb-4">
              Información de Visitas
            </h2>
            <p className="text-xl text-pabellon-green-700">
              Planifica tu visita al Museo Manuel Rivera Guevara
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-pabellon-green-800 mb-6">
                📅 Horarios de Operación
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-pabellon-green-700">
                    Lunes - Viernes
                  </span>
                  <span className="text-pabellon-green-600">
                    8:00 AM - 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-pabellon-green-700">
                    Sábados
                  </span>
                  <span className="text-red-600">Cerrado</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-pabellon-green-700">
                    Domingos
                  </span>
                  <span className="text-red-600">Cerrado</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-medium text-pabellon-green-700">
                    Días Feriados
                  </span>
                  <span className="text-red-600">Cerrado</span>
                </div>
              </div>

              <div className="mt-8 p-6 bg-pabellon-gold-50 border border-pabellon-gold-200 rounded-lg">
                <h4 className="font-bold text-pabellon-green-800 mb-2">
                  💡 Información Importante
                </h4>
                <ul className="text-sm text-pabellon-green-700 space-y-1">
                  <li>• Entrada gratuita para todos los visitantes</li>
                  <li>• Visitas grupales requieren reservación previa</li>
                  <li>• Estacionamiento disponible</li>
                  <li>• Acceso para personas con impedimentos</li>
                  <li>• Prohibido flash fotográfico en ciertas áreas</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pabellon-green-800 mb-6">
                📍 Ubicación y Contacto
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-pabellon-green-700 mb-2">
                    Dirección
                  </h4>
                  <p className="text-pabellon-green-600">
                    Centro Cultural Dra. Antonia Sáez
                    <br />
                    Humacao, Puerto Rico 00791
                    <br />
                    P.O. Box 9078, Humacao, PR 00792
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-pabellon-green-700 mb-2">
                    Contacto
                  </h4>
                  <p className="text-pabellon-green-600">
                    📞 (787) 410-1237 / (939) 529-5732<br/>
                    ✉️ informa@pfdh.org
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-pabellon-green-700 mb-4">
                    Mapa de Ubicación
                  </h4>
                  <GoogleMap 
                    address="Centro Cultural Dra. Antonia Sáez, Humacao, Puerto Rico 00791"
                  />
                </div>

                <div className="pt-6">
                  <button className="btn-pabellon w-full">
                    📞 Reservar Visita Grupal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
