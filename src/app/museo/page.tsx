import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

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
      {/* Header simplificado para esta página */}
      <header className="bg-white shadow-lg border-b-4 border-pabellon-gold-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/museo" className="flex items-center space-x-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 rounded-full p-2 shadow-lg border-2 border-pabellon-brown-700 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-pabellon-green-800 rounded-full flex items-center justify-center text-pabellon-gold-400 font-bold text-xs leading-none text-center">
                  <div>
                    <div className="text-[8px]">MUSEO</div>
                    <div className="text-[6px]">MRG</div>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-pabellon-green-800 group-hover:text-pabellon-green-700 transition-colors">
                  Museo Manuel Rivera Guevara
                </h1>
                <p className="text-sm lg:text-base text-pabellon-gold-600 font-medium">
                  Pabellón de la Fama del Deporte Humacaeño
                </p>
              </div>
            </Link>
            <nav className="hidden lg:flex space-x-4">
              <Link href="/" className="nav-link">
                ← Volver al Pabellón
              </Link>
              <a href="#tour-virtual" className="nav-link">
                Tour Virtual
              </a>
              <a href="#exhibiciones" className="nav-link">
                Exhibiciones
              </a>
              <a href="#horarios" className="nav-link">
                Horarios
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content">
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
                Explora nuestras salas y exhibiciones desde la comodidad de tu
                hogar
              </p>
            </div>

            {/* Imagen del museo con tour virtual */}
            <div className="relative max-w-5xl mx-auto mb-12">
              <div className="relative group cursor-pointer">
                <div className="bg-white p-4 rounded-2xl shadow-2xl border border-pabellon-gold-200">
                  {/* Simulación de la fachada del museo real */}
                  <div className="aspect-video bg-gradient-to-b from-pabellon-green-100 to-pabellon-green-200 rounded-lg overflow-hidden relative">
                    {/* Fachada del museo basada en la imagen del PDF */}
                    <div className="absolute inset-0">
                      {/* Cielo */}
                      <div className="w-full h-1/3 bg-gradient-to-b from-blue-300 to-blue-200"></div>

                      {/* Edificio del museo */}
                      <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-b from-gray-200 to-gray-300">
                        {/* Letrero principal */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-2 text-sm font-bold text-center">
                          <div>
                            MUSEO PABELLÓN DE LA FAMA DEL DEPORTE HUMACAEÑO
                          </div>
                          <div className="text-xs mt-1">
                            MANUEL RIVERA GUEVARA
                          </div>
                        </div>

                        {/* Puertas del museo */}
                        <div className="absolute bottom-0 left-1/4 w-1/6 h-1/2 bg-pabellon-brown-700 border-t-4 border-pabellon-brown-800"></div>
                        <div className="absolute bottom-0 left-1/2 w-1/6 h-1/2 bg-pabellon-brown-700 border-t-4 border-pabellon-brown-800 transform -translate-x-1/2"></div>
                        <div className="absolute bottom-0 right-1/4 w-1/6 h-1/2 bg-pabellon-brown-700 border-t-4 border-pabellon-brown-800"></div>

                        {/* Ventanas */}
                        <div className="absolute top-1/3 left-8 w-12 h-8 bg-blue-400 border border-gray-400"></div>
                        <div className="absolute top-1/3 right-8 w-12 h-8 bg-blue-400 border border-gray-400"></div>
                      </div>
                    </div>

                    {/* Overlay de tour virtual */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white text-pabellon-green-800 px-8 py-4 rounded-lg font-bold shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                          🎯 Iniciar Tour Virtual
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de tour */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-pabellon p-6 text-center">
                <div className="text-4xl mb-4">🚶‍♂️</div>
                <h3 className="text-lg font-semibold text-pabellon-green-800 mb-2">
                  Tour Autoguiado
                </h3>
                <p className="text-sm text-pabellon-green-600 mb-4">
                  Explora el museo a tu propio ritmo con información interactiva
                </p>
                <button className="btn-pabellon w-full">Comenzar</button>
              </div>

              <div className="card-pabellon p-6 text-center">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-lg font-semibold text-pabellon-green-800 mb-2">
                  Visita Guiada
                </h3>
                <p className="text-sm text-pabellon-green-600 mb-4">
                  Tour narrado con información detallada de nuestros curadores
                </p>
                <button className="btn-pabellon w-full">Iniciar</button>
              </div>

              <div className="card-pabellon p-6 text-center">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-lg font-semibold text-pabellon-green-800 mb-2">
                  Tour Familiar
                </h3>
                <p className="text-sm text-pabellon-green-600 mb-4">
                  Experiencia educativa diseñada especialmente para familias
                </p>
                <button className="btn-pabellon w-full">Empezar</button>
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
                  Conoce las biografías, logros y contribuciones de los atletas
                  y figuras deportivas que han sido exaltados al Pabellón de la
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
                  rica historia del deporte en Humacao desde principios del
                  siglo XX.
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
                  Disfruta de documentales, entrevistas y material audiovisual
                  que complementa tu experiencia en el museo.
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
                      9:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-pabellon-green-700">
                      Sábados
                    </span>
                    <span className="text-pabellon-green-600">
                      10:00 AM - 2:00 PM
                    </span>
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
                      [Dirección exacta del museo]
                      <br />
                      Humacao, Puerto Rico 00791
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-pabellon-green-700 mb-2">
                      Teléfono
                    </h4>
                    <p className="text-pabellon-green-600">(787) XXX-XXXX</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-pabellon-green-700 mb-2">
                      Email
                    </h4>
                    <p className="text-pabellon-green-600">
                      museo@pabellon.org
                    </p>
                  </div>

                  <div className="pt-6">
                    <button className="btn-pabellon w-full mb-4">
                      📞 Reservar Visita Grupal
                    </button>
                    <button className="bg-white border-2 border-pabellon-green-700 text-pabellon-green-700 hover:bg-pabellon-green-700 hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 w-full">
                      🗺️ Ver en Google Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
