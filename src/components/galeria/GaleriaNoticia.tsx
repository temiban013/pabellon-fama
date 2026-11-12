"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { TourLightbox, type LightboxPhoto } from "@/components/museo/TourLightbox";
import type { Galeria, FotoGaleria } from "@/data/galerias/types";

interface GaleriaNoticiaProps {
  galeria: Galeria;
}

/**
 * Las fotos alojadas en Vercel Blob ya vienen dimensionadas (WebP de 480 px
 * la miniatura, ~1600 px la completa): se sirven con `unoptimized` para no
 * gastar cuota del optimizador de imágenes de Vercel ni transferirlas dos
 * veces. Las rutas locales (p. ej. el flyer de la invitación) sí pasan por
 * el optimizador.
 */
const esRemota = (src: string): boolean => src.startsWith("https://");

/** Mapea una foto de galería al formato del visor (pie -> caption). */
function aFotoVisor(foto: FotoGaleria): LightboxPhoto {
  return {
    src: foto.src,
    alt: foto.alt,
    caption: foto.pie,
    unoptimized: esRemota(foto.src),
  };
}

/**
 * Sección «Galería de la ceremonia»: cuadrícula de miniaturas (carga
 * diferida) + visor a pantalla completa con teclado (←/→/Esc), deslizar
 * en pantallas táctiles y foco devuelto a la miniatura al cerrar.
 */
export function GaleriaNoticia({ galeria }: GaleriaNoticiaProps) {
  const { fotos, titulo, credito } = galeria;
  const [abierta, setAbierta] = useState<number | null>(null);
  const botonOrigen = useRef<HTMLElement | null>(null);

  const fotosVisor = useMemo(() => fotos.map(aFotoVisor), [fotos]);

  const abrir = (indice: number, boton: HTMLElement) => {
    botonOrigen.current = boton;
    setAbierta(indice);
  };

  const cerrar = useCallback(() => {
    setAbierta(null);
    // Tras desmontar el visor, devolver el foco a la miniatura que lo abrió.
    requestAnimationFrame(() => botonOrigen.current?.focus());
  }, []);

  if (fotos.length === 0) return null;

  return (
    <section
      aria-labelledby="galeria-titulo"
      className="mt-10 border-t border-gray-200 pt-8"
    >
      <h2
        id="galeria-titulo"
        className="mb-1 text-2xl font-bold text-pabellon-green-800"
      >
        {titulo}
      </h2>
      <p className="mb-5 text-sm text-gray-600">
        {fotos.length} {fotos.length === 1 ? "foto" : "fotos"}. Toque o pulse una
        foto para verla en grande.
      </p>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {fotos.map((foto, indice) => {
          const vertical = foto.height > foto.width;
          return (
            <li key={foto.id} className="min-w-0">
              <button
                type="button"
                onClick={(e) => abrir(indice, e.currentTarget)}
                aria-label={`Ampliar foto ${indice + 1} de ${fotos.length}: ${foto.alt}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pabellon-green-600 focus-visible:ring-offset-2"
              >
                <Image
                  src={foto.thumb}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 220px"
                  unoptimized={esRemota(foto.thumb)}
                  className={`transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                    vertical ? "object-contain" : "object-cover"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {credito && (
        <p className="mt-4 text-sm text-gray-600">Crédito: {credito}</p>
      )}

      {abierta !== null && (
        <TourLightbox
          photos={fotosVisor}
          initialIndex={abierta}
          title={titulo}
          onClose={cerrar}
        />
      )}
    </section>
  );
}
