"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Viewer, events as viewerEvents } from "@photo-sphere-viewer/core";
import { MarkersPlugin, events as markerEvents } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { panorama, hotspots as initialHotspots, type TourHotspot } from "@/lib/museo-tour";

const RAD2DEG = 180 / Math.PI;
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Configuración de marcadores PSV a partir de la lista de hotspots. */
function toMarkers(list: TourHotspot[], selectedId: string | null) {
  return list.map((h) => ({
    id: h.id,
    position: { yaw: `${h.yaw}deg`, pitch: `${h.pitch}deg` },
    html: `<span class="museo-edit-marker${h.id === selectedId ? " is-selected" : ""}"></span>`,
    size: { width: 26, height: 26 },
    anchor: "center center",
    tooltip: { content: `${h.label} (${h.yaw}°, ${h.pitch}°)`, position: "top center" },
  }));
}

/**
 * Editor de hotspots (solo desarrollo). Carga el panorama real y permite:
 *  - hacer clic en el panorama para leer la posición exacta yaw/pitch
 *  - seleccionar un hotspot y reubicarlo con un clic
 *  - añadir/eliminar hotspots y editar su etiqueta
 *  - exportar el arreglo `hotspots` listo para pegar en src/lib/museo-tour.ts
 *
 * No se enlaza desde ninguna parte del sitio y la ruta está protegida por env var.
 */
export default function MuseoEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersRef = useRef<MarkersPlugin | null>(null);

  const [list, setList] = useState<TourHotspot[]>(() =>
    initialHotspots.map((h) => ({ ...h })),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastClick, setLastClick] = useState<{ yaw: number; pitch: number } | null>(null);

  // refs para que los listeners (registrados una vez) lean el estado actual
  const stateRef = useRef({ list, selectedId });
  useEffect(() => {
    stateRef.current = { list, selectedId };
  });

  const markerConfigs = useMemo(() => toMarkers(list, selectedId), [list, selectedId]);

  // Inicializar el visor una sola vez. La creación se aplaza un frame con una bandera de
  // cancelación para que el doble montaje de React Strict Mode (dev) no cree dos visores en
  // el mismo contenedor (lo que deja el panorama atascado en "Loading…").
  useEffect(() => {
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (cancelled || !containerRef.current) return;
      const viewer = new Viewer({
        container: containerRef.current,
        panorama: panorama.src,
        defaultYaw: `${panorama.defaultYaw}deg`,
        defaultPitch: `${panorama.defaultPitch}deg`,
        navbar: ["zoom", "move", "fullscreen"],
        plugins: [MarkersPlugin],
      });
      viewerRef.current = viewer;
      const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      markersRef.current = markers;
      // Marcadores iniciales (el efecto de actualización sólo aplica a cambios posteriores)
      viewer.addEventListener(
        "ready",
        () => markers.setMarkers(toMarkers(stateRef.current.list, stateRef.current.selectedId)),
        { once: true },
      );

      // Clic en el panorama → leer posición; si hay hotspot seleccionado, reubicarlo
      viewer.addEventListener("click", (e: viewerEvents.ClickEvent) => {
        const yaw = round1(e.data.yaw * RAD2DEG);
        const pitch = round1(e.data.pitch * RAD2DEG);
        setLastClick({ yaw, pitch });
        const sel = stateRef.current.selectedId;
        if (sel) {
          setList((prev) => prev.map((h) => (h.id === sel ? { ...h, yaw, pitch } : h)));
        }
      });
      // Clic en un marcador → seleccionarlo
      markers.addEventListener("select-marker", (e: markerEvents.SelectMarkerEvent) =>
        setSelectedId(e.marker.id),
      );
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      viewerRef.current?.destroy();
      viewerRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Re-renderizar marcadores cuando cambian la lista o la selección.
  useEffect(() => {
    markersRef.current?.setMarkers(markerConfigs);
  }, [markerConfigs]);

  const updateField = (id: string, field: "label" | "yaw" | "pitch", value: string) =>
    setList((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, [field]: field === "label" ? value : Number(value) }
          : h,
      ),
    );

  const addHotspot = () => {
    const pos = lastClick ?? { yaw: 0, pitch: 0 };
    const id = `hotspot-${Date.now().toString(36)}`;
    setList((prev) => [
      ...prev,
      { id, yaw: pos.yaw, pitch: pos.pitch, label: "Nuevo hotspot", photos: [] },
    ]);
    setSelectedId(id);
  };

  const removeHotspot = (id: string) =>
    setList((prev) => prev.filter((h) => h.id !== id));

  const exportTs = useMemo(() => {
    const body = list
      .map((h) => {
        const photos = h.photos
          .map(
            (p) =>
              `      { src: ${JSON.stringify(p.src)}, thumb: ${JSON.stringify(p.thumb)}, alt: ${JSON.stringify(p.alt)}${p.caption ? `, caption: ${JSON.stringify(p.caption)}` : ""} },`,
          )
          .join("\n");
        return `  {\n    id: ${JSON.stringify(h.id)},\n    yaw: ${h.yaw},\n    pitch: ${h.pitch},\n    label: ${JSON.stringify(h.label)},\n    photos: [\n${photos}\n    ],\n  },`;
      })
      .join("\n");
    return `export const hotspots: TourHotspot[] = [\n${body}\n];`;
  }, [list]);

  return (
    <div className="fixed inset-0 z-[60] grid grid-rows-[1fr_auto] bg-white lg:grid-cols-[1fr_420px] lg:grid-rows-1">
      <div className="relative">
        <div ref={containerRef} className="h-full w-full" />
        <div className="pointer-events-none absolute left-3 top-3 rounded bg-black/70 px-3 py-2 font-mono text-xs text-white">
          {lastClick
            ? `Último clic → yaw: ${lastClick.yaw}°  pitch: ${lastClick.pitch}°`
            : "Haz clic en el panorama para leer yaw/pitch"}
          {selectedId && <div className="text-pabellon-gold-300">Seleccionado: {selectedId} (clic = reubicar)</div>}
        </div>
      </div>

      <aside className="flex max-h-screen flex-col gap-3 overflow-y-auto border-l border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-pabellon-green-800">Editor de hotspots</h1>
          <button
            type="button"
            onClick={addHotspot}
            className="rounded bg-pabellon-gold-400 px-3 py-1.5 text-sm font-semibold text-pabellon-green-900 hover:bg-pabellon-gold-300"
          >
            ＋ Nuevo (último clic)
          </button>
        </div>

        <ul className="space-y-2">
          {list.map((h) => (
            <li
              key={h.id}
              className={`rounded border p-2 text-sm ${h.id === selectedId ? "border-pabellon-gold-400 bg-pabellon-gold-50" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sel"
                  checked={h.id === selectedId}
                  onChange={() => setSelectedId(h.id)}
                  aria-label={`Seleccionar ${h.label}`}
                />
                <input
                  value={h.label}
                  onChange={(e) => updateField(h.id, "label", e.target.value)}
                  className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => removeHotspot(h.id)}
                  className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
                  aria-label={`Eliminar ${h.label}`}
                >
                  ✕
                </button>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                <label className="flex items-center gap-1">
                  yaw
                  <input
                    type="number"
                    step="0.1"
                    value={h.yaw}
                    onChange={(e) => updateField(h.id, "yaw", e.target.value)}
                    className="w-20 rounded border border-gray-300 px-1 py-0.5"
                  />
                </label>
                <label className="flex items-center gap-1">
                  pitch
                  <input
                    type="number"
                    step="0.1"
                    value={h.pitch}
                    onChange={(e) => updateField(h.id, "pitch", e.target.value)}
                    className="w-20 rounded border border-gray-300 px-1 py-0.5"
                  />
                </label>
                <span className="ml-auto text-gray-400">{h.photos.length} fotos</span>
              </div>

              {/* Tira de miniaturas de las fotos asignadas a este hotspot.
                  Pasa el cursor para ver el texto; clic para abrir la foto completa. */}
              {h.photos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {h.photos.map((p) => {
                    const nn = p.src.match(/foto-(\d{2})\.jpg$/)?.[1] ?? "";
                    return (
                      <a
                        key={p.src}
                        href={p.src}
                        target="_blank"
                        rel="noreferrer"
                        title={p.alt}
                        className="relative block h-14 w-14 overflow-hidden rounded border border-gray-300 hover:border-pabellon-gold-400"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.thumb} alt={p.alt} className="h-full w-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-black/70 px-1 text-[9px] leading-tight text-white">
                          {nn}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div>
          <p className="mb-1 text-sm font-semibold text-pabellon-green-800">
            Exportar a <code>src/lib/museo-tour.ts</code>
          </p>
          <textarea
            readOnly
            value={exportTs}
            onFocus={(e) => e.currentTarget.select()}
            className="h-48 w-full rounded border border-gray-300 p-2 font-mono text-[11px]"
          />
        </div>
      </aside>
    </div>
  );
}
