"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Image from "next/image";
import { galeria, hotspots, panorama, type TourHotspot, type TourPhoto } from "@/lib/museo-tour";
import { TourFallback } from "./TourFallback";
import { TourLightbox } from "./TourLightbox";

// El visor 360° solo funciona en el cliente (usa WebGL/window) → ssr: false.
const PanoramaViewer = dynamic(() => import("./PanoramaViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-pabellon-green-900/40 text-white">
      <span className="text-sm">Cargando recorrido 360°…</span>
    </div>
  ),
});

interface LightboxState {
  photos: TourPhoto[];
  title?: string;
}

function isWebglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function VirtualTour() {
  const [started, setStarted] = useState(false);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Detectamos WebGL al iniciar el recorrido (evento del usuario), no en un efecto.
  const startTour = () => {
    setWebglOk(isWebglAvailable());
    setStarted(true);
  };

  // El visor 360° (PSV) entra en pantalla completa sobre su propio contenedor. El lightbox se
  // renderiza fuera de ese contenedor, así que en pantalla completa quedaría bajo la "capa
  // superior" del navegador (invisible). Seguimos el elemento en pantalla completa para, cuando
  // exista, montar el lightbox dentro de él con un portal: así aparece encima del panorama sin
  // salir de pantalla completa.
  const [fullscreenEl, setFullscreenEl] = useState<Element | null>(null);
  useEffect(() => {
    const sync = () => setFullscreenEl(document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const openHotspot = (h: TourHotspot) => setLightbox({ photos: h.photos, title: h.label });
  const openGallery = () => setLightbox({ photos: galeria, title: "Galería completa del museo" });

  return (
    <div>
      {/* Marco del visor 360° */}
      <div className="relative mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-pabellon-gold-200 bg-white p-2 shadow-2xl sm:p-4">
          <div className="relative h-[58vh] min-h-[340px] w-full overflow-hidden rounded-lg bg-pabellon-green-900">
            {started && webglOk ? (
              <PanoramaViewer hotspots={hotspots} onSelectHotspot={openHotspot} />
            ) : started && webglOk === false ? (
              <div className="h-full w-full overflow-y-auto bg-white p-4">
                <TourFallback
                  hotspots={hotspots}
                  onSelectHotspot={openHotspot}
                  notice="Tu navegador no soporta la vista 360° interactiva. Explora el museo por áreas a continuación."
                />
              </div>
            ) : (
              // Estado inicial: póster + botón para iniciar el recorrido
              <>
                <Image
                  src={panorama.srcMobile}
                  alt="Vista previa del interior del Museo Manuel Rivera Guevara"
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="scale-110 object-cover blur-[3px]"
                  priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-pabellon-green-900/80 via-pabellon-green-900/65 to-pabellon-green-900/85 px-4 text-center">
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 ring-1 ring-white/25 backdrop-blur-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 5C6.5 5 2.7 8.3 1 12c1.7 3.7 5.5 7 11 7s9.3-3.3 11-7c-1.7-3.7-5.5-7-11-7zm0 11.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm0-7a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                    </svg>
                    Vista previa
                  </span>
                  <p className="mb-1 text-lg font-semibold text-white sm:text-xl">
                    Recorrido Virtual 360°
                  </p>
                  <p className="mb-6 max-w-md text-sm text-white/85">
                    Explora el interior del museo en 360°. Arrastra para mirar alrededor y pulsa los
                    puntos dorados para ver las exhibiciones de cerca.
                  </p>
                  <button
                    type="button"
                    onClick={startTour}
                    className="inline-flex items-center gap-2 rounded-lg bg-pabellon-gold-400 px-6 py-3 font-semibold text-pabellon-green-900 shadow-lg transition-colors hover:bg-pabellon-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Iniciar recorrido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {started && webglOk && (
          <p className="mt-3 text-center text-sm text-pabellon-green-600">
            Arrastra para mirar alrededor · pulsa los puntos dorados para ver de cerca
          </p>
        )}
      </div>

      {/* Índice de áreas de exhibición */}
      <div className="mx-auto mt-12 max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-bold text-pabellon-green-800">Áreas de Exhibición</h3>
          <button
            type="button"
            onClick={openGallery}
            className="inline-flex items-center gap-2 rounded-lg border border-pabellon-green-700 px-4 py-2 text-sm font-medium text-pabellon-green-700 transition-colors hover:bg-pabellon-green-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pabellon-gold-400"
          >
            🖼️ Ver galería completa (62 fotos)
          </button>
        </div>
        <TourFallback hotspots={hotspots} onSelectHotspot={openHotspot} showPoster={false} />
      </div>

      {lightbox &&
        (() => {
          const node = (
            <TourLightbox
              photos={lightbox.photos}
              title={lightbox.title}
              onClose={() => setLightbox(null)}
            />
          );
          // En pantalla completa portamos el lightbox dentro del elemento en pantalla completa
          // para que se renderice en la capa superior, encima del panorama.
          return fullscreenEl ? createPortal(node, fullscreenEl) : node;
        })()}
    </div>
  );
}
