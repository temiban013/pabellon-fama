"use client";

import { useState } from "react";
import Image from "next/image";
import { panorama, type TourHotspot } from "@/lib/museo-tour";

interface TourFallbackProps {
  hotspots: TourHotspot[];
  onSelectHotspot: (hotspot: TourHotspot) => void;
  /** Mensaje opcional (p. ej. cuando el navegador no soporta WebGL). */
  notice?: string;
  /** Mostrar el póster panorámico (true en modo alterno; false como índice de áreas). */
  showPoster?: boolean;
  /** Colapsar la cuadrícula a dos filas (4 áreas en móvil, 6 en escritorio) con «Ver más…». */
  collapsible?: boolean;
}

/**
 * Alternativa sin 360°: muestra un póster panorámico y tarjetas por área de exhibición.
 * Se usa cuando el navegador no soporta WebGL y como cuadrícula de áreas del recorrido.
 */
export function TourFallback({
  hotspots,
  onSelectHotspot,
  notice,
  showPoster = true,
  collapsible = false,
}: TourFallbackProps) {
  const [expanded, setExpanded] = useState(false);
  const collapsed = collapsible && !expanded;
  // Dos filas exactas por breakpoint: la cuadrícula es de 2 columnas en móvil y 3 desde sm.
  const rowLimitClass = (i: number) =>
    !collapsed || i < 4 ? "" : i < 6 ? " hidden sm:block" : " hidden";
  return (
    <div>
      {/* Póster panorámico */}
      {showPoster && (
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg sm:aspect-[21/9]">
          <Image
            src={panorama.srcMobile}
            alt="Vista panorámica del interior del Museo Manuel Rivera Guevara"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-xs text-white/80">{panorama.attribution}</p>
          </div>
        </div>
      )}

      {notice && (
        <p className="mt-4 rounded-lg bg-pabellon-gold-50 px-4 py-3 text-sm text-pabellon-green-800">
          {notice}
        </p>
      )}

      {/* Tarjetas por área */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {hotspots.map((h, i) => (
          <button
            key={h.id}
            type="button"
            onClick={() => onSelectHotspot(h)}
            className={`group overflow-hidden rounded-lg border border-pabellon-gold-200 bg-white text-left shadow-sm transition-all hover:border-pabellon-gold-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-pabellon-gold-400${rowLimitClass(i)}`}
            aria-label={`Ver fotos: ${h.label} (${h.photos.length})`}
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden">
              <Image
                src={h.photos[0].thumb}
                alt={h.photos[0].alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span className="block p-3">
              <span className="block text-sm font-semibold text-pabellon-green-800">{h.label}</span>
              <span className="mt-0.5 block text-xs text-pabellon-green-600">
                {h.photos.length} {h.photos.length === 1 ? "foto" : "fotos"}
              </span>
            </span>
          </button>
        ))}
      </div>

      {collapsible && hotspots.length > 4 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="rounded text-sm font-medium text-pabellon-green-700 underline underline-offset-4 transition-colors hover:text-pabellon-green-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pabellon-gold-400"
          >
            {expanded ? "Ver menos" : "Ver más…"}
          </button>
        </div>
      )}
    </div>
  );
}
