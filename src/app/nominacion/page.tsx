// src/app/nominacion/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Calendar,
  Tag,
  MapPin,
  Activity,
  Download,
} from "lucide-react";
import { generateMetadata as genMeta, seoConfigs } from "@/lib/seo";
import { NOMINACION_2026 } from "@/lib/data/nominacion-2026";
import { CountdownTimer } from "@/components/nominacion/CountdownTimer";
import { ComunicadoPrensa } from "@/components/nominacion/ComunicadoPrensa";
import { CategoriasGrid } from "@/components/nominacion/CategoriasGrid";
import { BoletaDownloadCard } from "@/components/nominacion/BoletaDownloadCard";
import { InstruccionesEntrega } from "@/components/nominacion/InstruccionesEntrega";

export const metadata: Metadata = genMeta(seoConfigs.nominacion);

const fmtFechaLarga = (d: Date) =>
  new Intl.DateTimeFormat("es-PR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Puerto_Rico",
  }).format(d);

export default function NominacionPage() {
  const { ceremonia, periodo, categorias, documentos } = NOMINACION_2026;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero — patrón canónico (idéntico a /contribuir, /historia, /junta) */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Volver al Inicio
          </Link>

          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 mr-3" aria-hidden="true" />
            <h1 className="text-4xl font-bold">
              Nominaciones al Pabellón de la Fama
            </h1>
          </div>

          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            Postula a una figura del deporte humacaeño que merece ser exaltada.
            La nominación requiere completar la boleta oficial y entregarla en
            persona, junto con la documentación de respaldo.
          </p>

          {/* Meta-grid: Periodo · Categorías · Entrega · Ceremonia */}
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-800/40 rounded-lg p-4 border border-blue-700/50">
              <dt className="flex items-center text-blue-200 text-xs uppercase tracking-wide font-semibold mb-1">
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                Periodo
              </dt>
              <dd className="text-white text-sm font-medium">
                22 mayo – 31 agosto 2026
              </dd>
            </div>

            <div className="bg-blue-800/40 rounded-lg p-4 border border-blue-700/50">
              <dt className="flex items-center text-blue-200 text-xs uppercase tracking-wide font-semibold mb-1">
                <Tag className="h-4 w-4 mr-2" aria-hidden="true" />
                Categorías
              </dt>
              <dd className="text-white text-sm font-medium">
                {categorias.length} categorías
              </dd>
            </div>

            <div className="bg-blue-800/40 rounded-lg p-4 border border-blue-700/50">
              <dt className="flex items-center text-blue-200 text-xs uppercase tracking-wide font-semibold mb-1">
                <MapPin className="h-4 w-4 mr-2" aria-hidden="true" />
                Entrega
              </dt>
              <dd className="text-white text-sm font-medium">Solo presencial</dd>
            </div>

            <div className="bg-blue-800/40 rounded-lg p-4 border border-blue-700/50">
              <dt className="flex items-center text-blue-200 text-xs uppercase tracking-wide font-semibold mb-1">
                <Activity className="h-4 w-4 mr-2" aria-hidden="true" />
                Ceremonia
              </dt>
              <dd className="text-white text-sm font-medium">
                {fmtFechaLarga(ceremonia.fecha)}
              </dd>
            </div>
          </dl>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#descargar"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
            >
              <Download className="h-5 w-5 mr-2" aria-hidden="true" />
              Descargar boleta oficial
            </a>
            <a
              href="#instrucciones"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold transition-colors"
            >
              Cómo entregar →
            </a>
          </div>
        </div>
      </div>

      {/* 2. Countdown timer (client) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CountdownTimer
          apertura={periodo.apertura}
          cierre={periodo.cierre}
          ceremonia={ceremonia.fecha}
        />
      </section>

      {/* 3. Comunicado de Prensa */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ComunicadoPrensa comunicadoPdf={documentos.comunicado} />
        </div>
      </section>

      {/* 4. Categorías */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoriasGrid />
      </section>

      {/* 5. Descargar boleta */}
      <section
        id="descargar"
        className="bg-white border-y border-gray-200 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BoletaDownloadCard
            pdfUrl={documentos.boleta.url}
            downloadFileName={documentos.boleta.downloadFileName}
            apertura={periodo.apertura}
            cierre={periodo.cierre}
          />
        </div>
      </section>

      {/* 6. Instrucciones presenciales */}
      <section
        id="instrucciones"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24"
      >
        <InstruccionesEntrega />
      </section>

      {/* 7. Closing emphasis (mismo patrón de /contribuir, /historia) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-3">
            ¿Listo para nominar?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Descarga la boleta, completa la información del candidato junto con
            los documentos requeridos, y entrégala en cualquiera de los puntos
            oficiales antes del 31 de agosto de 2026.
          </p>
          <a
            href="#descargar"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            <Download className="h-5 w-5 mr-2" aria-hidden="true" />
            Descargar boleta oficial
          </a>
        </div>
      </section>
    </main>
  );
}
