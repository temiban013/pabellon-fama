import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { GoogleMapClient } from "@/components/ui/GoogleMapClient";
import { VirtualTour } from "@/components/museo/VirtualTour";
import { VisitasDistinguidas } from "@/components/museo/VisitasDistinguidas";
import { generateMetadata, seoConfigs, generateJsonLd, generateBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  ...seoConfigs.museo,
  url: "https://pabellondelafama.com/museo",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const museoBreadcrumbs = generateBreadcrumbs([
  { name: "Inicio", url: "https://pabellondelafama.com" },
  { name: "Museo Manuel Rivera Guevara", url: "https://pabellondelafama.com/museo" },
]);

export default function MuseoPage() {
  const museumJsonLd = generateJsonLd("museum", {});

  return (
    <>
      {/* Museum Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(museumJsonLd),
        }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(museoBreadcrumbs),
        }}
      />
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

      {/* Historia del Museo */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-pabellon-brown-50 via-white to-pabellon-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-pabellon-gold-100 text-pabellon-gold-800 rounded-full text-sm font-semibold mb-4">
              De un sueño a la realidad
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-pabellon-green-800 mb-4">
              Historia del Museo
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-brown-600 rounded-full mx-auto"></div>
          </div>

          {/* Timeline milestones */}
          <div className="relative">
            {/* Vertical line - hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pabellon-gold-300 via-pabellon-green-300 to-pabellon-gold-300" />

            {/* Milestone 1: Vision */}
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-12 mb-12">
              <div className="lg:text-right lg:pr-12">
                <div className="card-pabellon p-8">
                  <div className="flex items-center gap-3 mb-4 lg:justify-end">
                    <span className="text-3xl">💡</span>
                    <span className="inline-block px-3 py-1 bg-pabellon-gold-100 text-pabellon-gold-800 rounded-full text-sm font-bold">La Visión</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    La idea de un museo para el Pabellón de la Fama comenzó desde muy temprano
                    en su historia. El Prof. Luis Reinaldo Álvarez conceptualizó y diseñó las
                    instalaciones, sometiendo planos durante dos administraciones municipales
                    anteriores — sin lograr el apoyo necesario.
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-center">
                <div className="w-4 h-4 rounded-full bg-pabellon-gold-400 border-4 border-white shadow-lg -ml-2 z-10" />
              </div>
            </div>

            {/* Milestone 2: Support */}
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-12 mb-12">
              <div className="hidden lg:flex items-center justify-end">
                <div className="w-4 h-4 rounded-full bg-pabellon-green-500 border-4 border-white shadow-lg -mr-2 z-10" />
              </div>
              <div className="lg:pl-12">
                <div className="card-pabellon p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🤝</span>
                    <span className="inline-block px-3 py-1 bg-pabellon-green-100 text-pabellon-green-800 rounded-full text-sm font-bold">El Apoyo</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Bajo la presidencia del Sr. Enrique (Quique) Torres y la Junta de Directores —
                    Sr. Arnaldo (Larry) Ortiz, Prof. Félix Báez Neris y Sr. Juan Velázquez — se logró
                    el apoyo del Municipio Autónomo de Humacao bajo el Alcalde Hon. Julio L. Geigel
                    Pérez, con la asignación de un local en el primer nivel del remodelado Centro
                    Cultural Dra. Antonia Sáez.
                  </p>
                </div>
              </div>
            </div>

            {/* Milestone 3: Construction */}
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-12 mb-12">
              <div className="lg:text-right lg:pr-12">
                <div className="card-pabellon p-8">
                  <div className="flex items-center gap-3 mb-4 lg:justify-end">
                    <span className="text-3xl">🏗️</span>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">La Obra</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Quique Torres, coordinador general del proyecto, solicitó la colaboración del
                    Prof. Luis Reinaldo Álvarez para el diseño de las instalaciones, la coordinación
                    de las obras y la curaduría de las exposiciones de información, fotografías y
                    memorabilia deportiva.
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-center">
                <div className="w-4 h-4 rounded-full bg-amber-400 border-4 border-white shadow-lg -ml-2 z-10" />
              </div>
            </div>

            {/* Milestone 4: Opening */}
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-12 mb-12">
              <div className="hidden lg:flex items-center justify-end">
                <div className="w-4 h-4 rounded-full bg-pabellon-gold-500 border-4 border-white shadow-lg -mr-2 z-10" />
              </div>
              <div className="lg:pl-12">
                <div className="card-pabellon p-8 border-2 border-pabellon-gold-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏛️</span>
                    <span className="inline-block px-3 py-1 bg-pabellon-gold-400 text-pabellon-green-900 rounded-full text-sm font-bold">23 de octubre de 2024</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    El Museo del Pabellón de la Fama del Deporte Humacaeño abrió sus puertas
                    al público. Cuenta con un área administrativa, un archivo histórico y biblioteca,
                    y una sala de exposiciones permanente. La ceremonia formal de inauguración
                    se celebró el 29 de junio de 2025.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Torres Quote */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-pabellon-green-800 to-pabellon-green-700 rounded-2xl p-8 lg:p-12 text-white shadow-xl overflow-hidden">
              {/* Decorative quote mark */}
              <div className="absolute top-4 left-6 text-8xl font-serif text-white/10 leading-none select-none">&ldquo;</div>

              <blockquote className="relative z-10">
                <p className="text-lg lg:text-xl leading-relaxed mb-2 italic">
                  Este espacio es más que exhibiciones, es un tributo vivo al sacrificio,
                  entrega y gestas deportivas de los 78 atletas y propulsores que han sido
                  exaltados al PFDH. Cada trofeo, camiseta, fotografía y recorte de periódico
                  representa el legado de todos estos deportistas que han llenado de orgullo
                  nuestro pueblo.
                </p>
                <p className="text-lg lg:text-xl leading-relaxed italic">
                  Este museo es la casa del deporte humacaeño, pero también es la casa de
                  todos aquellos visitantes que encuentren en él, la motivación e inspiración
                  para superarse en las diferentes disciplinas del deporte.
                </p>
              </blockquote>

              <footer className="mt-8 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-pabellon-gold-400 rounded-full" />
                <div>
                  <cite className="not-italic font-bold text-pabellon-gold-300">
                    Enrique &ldquo;Quique&rdquo; Torres
                  </cite>
                  <p className="text-sm text-pabellon-green-200">
                    Presidente, Junta de Directores del PFDH
                  </p>
                </div>
              </footer>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/revistas/inauguracion-museo"
              className="inline-flex items-center gap-2 bg-pabellon-gold-400 text-pabellon-green-900 px-8 py-4 rounded-lg font-semibold hover:bg-pabellon-gold-300 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              📖 Ver Revista de Inauguración
            </Link>
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
              Recorre el interior del museo en 360° y descubre nuestras exhibiciones
            </p>
          </div>

          {/* Recorrido virtual 360° interactivo */}
          <VirtualTour />
        </div>
      </section>

      {/* Visitas Distinguidas Section */}
      <VisitasDistinguidas />

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
                  <GoogleMapClient />
                </div>

                <div className="pt-6">
                  <a href="tel:787-410-1237" className="btn-pabellon w-full inline-block text-center">
                    📞 Reservar Visita Grupal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
