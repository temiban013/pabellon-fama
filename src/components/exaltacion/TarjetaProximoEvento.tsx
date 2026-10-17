import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import { capitalizar, formatearFechaLargaAST, formatearHoraAST } from '@/lib/exaltacion';
import { CuentaRegresivaExaltacion } from '@/components/exaltacion/CuentaRegresivaExaltacion';

/**
 * Tarjeta «Próximo gran evento» de la Novena Exaltación. Se alimenta solo de
 * EXALTACION_2026 (independiente de /api/eventos). El flyer usa object-contain
 * con altura máxima: nunca se recorta (el recorte cortaría fecha y sede).
 * La visibilidad temporal la controla quien la usa, con <VisibleHasta>.
 */
export function TarjetaProximoEvento(): React.JSX.Element {
  const { flyer, titulo, lema, inicio, sede, noticiaSlug } = EXALTACION_2026;

  return (
    <section
      aria-labelledby="proximo-gran-evento-titulo"
      className="mb-8 overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md"
    >
      <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-8 lg:p-8">
        <div className="flex justify-center">
          <Image
            src={flyer.src}
            alt={flyer.alt}
            width={flyer.width}
            height={flyer.height}
            sizes="(min-width: 768px) 320px, (min-width: 640px) 60vw, 100vw"
            className="h-auto max-h-[32rem] w-auto max-w-full rounded-md object-contain shadow-lg"
          />
        </div>

        <div>
          <p className="mb-2 inline-block rounded-full bg-pabellon-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-900">
            Próximo gran evento
          </p>
          <h2
            id="proximo-gran-evento-titulo"
            className="font-serif text-3xl font-bold leading-tight text-white"
          >
            {titulo}
          </h2>
          <p className="mt-2 text-lg italic text-blue-100">«{lema}»</p>

          <ul className="mt-5 space-y-3 text-base text-white">
            <li className="flex items-start">
              <Calendar className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-pabellon-gold-400" aria-hidden="true" />
              <span>{capitalizar(formatearFechaLargaAST(inicio))}</span>
            </li>
            <li className="flex items-start">
              <Clock className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-pabellon-gold-400" aria-hidden="true" />
              <span>{formatearHoraAST(inicio)}</span>
            </li>
            <li className="flex items-start">
              <MapPin className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-pabellon-gold-400" aria-hidden="true" />
              <span>
                {sede.nombre}, {sede.municipio}
              </span>
            </li>
          </ul>

          <CuentaRegresivaExaltacion variante="oscuro" className="mt-6" />

          <Link
            href={`/noticias/${noticiaSlug}`}
            className="mt-6 inline-flex items-center rounded-lg bg-pabellon-gold-400 px-5 py-2.5 text-sm font-semibold text-blue-900 transition-colors hover:bg-pabellon-gold-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </section>
  );
}
