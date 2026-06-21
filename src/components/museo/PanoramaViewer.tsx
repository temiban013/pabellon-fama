"use client";

import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin, events as markerEvents } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { panorama, type TourHotspot } from "@/lib/museo-tour";

interface PanoramaViewerProps {
  hotspots: TourHotspot[];
  onSelectHotspot: (hotspot: TourHotspot) => void;
}

const MARKER_HTML = `<span class="museo-hotspot" aria-hidden="true"><span class="museo-hotspot__dot"></span></span>`;

/**
 * Visor 360° (Photo Sphere Viewer v5). Solo cliente — se carga con dynamic({ ssr: false }).
 * Coloca un marcador por cada hotspot y emite onSelectHotspot al pulsarlo.
 */
export default function PanoramaViewer({ hotspots, onSelectHotspot }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelectHotspot);
  const [loading, setLoading] = useState(true);

  // Mantener la referencia al callback actualizada sin reinicializar el visor.
  useEffect(() => {
    onSelectRef.current = onSelectHotspot;
  });

  // La creación se aplaza un frame con una bandera de cancelación para que el doble montaje de
  // React Strict Mode (dev) no cree dos visores en el mismo contenedor (lo que deja el panorama
  // atascado en "Loading…").
  const viewerRef = useRef<Viewer | null>(null);
  useEffect(() => {
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (cancelled || !containerRef.current) return;
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      const viewer = new Viewer({
        container: containerRef.current,
        panorama: isMobile ? panorama.srcMobile : panorama.src,
        caption: panorama.attribution,
        defaultYaw: `${panorama.defaultYaw}deg`,
        defaultPitch: `${panorama.defaultPitch}deg`,
        navbar: ["zoom", "move", "caption", "fullscreen"],
        loadingTxt: "Cargando recorrido 360°…",
        plugins: [
          MarkersPlugin.withConfig({
            markers: hotspots.map((h) => ({
              id: h.id,
              position: { yaw: `${h.yaw}deg`, pitch: `${h.pitch}deg` },
              html: MARKER_HTML,
              size: { width: 40, height: 40 },
              anchor: "center center",
              className: "museo-hotspot-marker",
              tooltip: { content: h.label, position: "top center" },
            })),
          }),
        ],
      });
      viewerRef.current = viewer;

      const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      markers.addEventListener("select-marker", (e: markerEvents.SelectMarkerEvent) => {
        const hotspot = hotspots.find((h) => h.id === e.marker.id);
        if (hotspot) onSelectRef.current(hotspot);
      });
      viewer.addEventListener("ready", () => setLoading(false), { once: true });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
    // hotspots/panorama son estáticos; inicializamos una sola vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-pabellon-green-900/40 text-white">
          <span className="text-sm">Cargando recorrido 360°…</span>
        </div>
      )}
    </div>
  );
}
