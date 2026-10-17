import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import {
  capitalizar,
  formatearFechaLargaAST,
  formatearHoraAST,
  getFaseEvento,
} from '@/lib/exaltacion';
import { CuentaRegresivaExaltacion } from '@/components/exaltacion/CuentaRegresivaExaltacion';

/**
 * Sección de Inicio con la Novena Exaltación (PF-065 §3.1). Server Component.
 * El flyer nunca se recorta: se muestra con su proporción 2:3 completa.
 * Devuelve null cuando el evento ya fue realizado (R2); `VisibleHasta` cubre
 * el hueco entre revalidaciones de la página.
 */
export function ProximaExaltacion(): React.JSX.Element | null {
  if (getFaseEvento(EXALTACION_2026, new Date()) === 'realizada') return null;

  const { titulo, lema, inicio, sede, flyer, noticiaSlug } = EXALTACION_2026;

  const filas = [
    { Icono: Calendar, texto: capitalizar(formatearFechaLargaAST(inicio)) },
    { Icono: Clock, texto: formatearHoraAST(inicio) },
    { Icono: MapPin, texto: sede.nombre },
  ] as const;

  return (
    <section
      aria-labelledby="proxima-exaltacion-titulo"
      className="bg-gradient-to-br from-blue-900 via-blue-900 to-blue-800 py-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="mx-auto w-full max-w-xs lg:max-w-sm">
          <Image
            src={flyer.src}
            alt={flyer.alt}
            width={flyer.width}
            height={flyer.height}
            sizes="(min-width: 1024px) 384px, 320px"
            className="h-auto w-full rounded-xl shadow-2xl ring-1 ring-pabellon-gold-400/40"
          />
        </div>

        <div className="text-center lg:text-left">
          <p className="inline-block rounded-full bg-pabellon-green-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Próxima ceremonia
          </p>
          <h2
            id="proxima-exaltacion-titulo"
            className="mt-3 font-serif text-3xl font-bold text-white lg:text-4xl"
          >
            {titulo}
          </h2>
          <p className="mt-2 text-lg italic text-pabellon-gold-400">«{lema}»</p>

          <ul className="mt-6 space-y-3 text-left text-white">
            {filas.map(({ Icono, texto }) => (
              <li key={texto} className="flex items-start gap-3">
                <Icono className="mt-0.5 h-5 w-5 shrink-0 text-pabellon-gold-400" aria-hidden="true" />
                <span className="text-base lg:text-lg">{texto}</span>
              </li>
            ))}
          </ul>

          <CuentaRegresivaExaltacion variante="oscuro" className="mt-6" />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={`/noticias/${noticiaSlug}`}
              className="inline-flex items-center justify-center rounded-lg bg-pabellon-gold-400 px-6 py-3 font-semibold text-blue-900 transition-colors hover:bg-pabellon-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Ver detalles
            </Link>
            <Link
              href="/calendario"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pabellon-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
            >
              Calendario de actividades
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
