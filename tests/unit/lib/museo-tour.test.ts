import { describe, it, expect } from "vitest";
import { hotspots, galeria, panorama } from "@/lib/museo-tour";

describe("museo-tour manifest", () => {
  it("tiene 26 hotspots con ids únicos", () => {
    expect(hotspots).toHaveLength(26);
    const ids = hotspots.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("no referencia ninguna foto eliminada en la depuración", () => {
    const dropped = new Set([
      12, 13, 14, 16, 19, 21, 23, 25, 33, 35, 37, 41, 43, 45, 46, 49, 51, 53, 55, 57, 59, 60, 61,
      65, 67, 70, 78,
    ]);
    const all = [...hotspots.flatMap((h) => h.photos), ...galeria];
    for (const p of all) {
      const nn = Number(p.src.match(/foto-(\d{2})\.jpg$/)?.[1]);
      expect(dropped.has(nn), `${p.src} fue eliminada`).toBe(false);
    }
  });

  it("cada hotspot tiene al menos una foto", () => {
    for (const h of hotspots) {
      expect(h.photos.length, `hotspot ${h.id}`).toBeGreaterThan(0);
    }
  });

  it("las coordenadas yaw/pitch están dentro de rango", () => {
    // El editor exporta yaw en 0..360; el visor también acepta valores negativos (−180..180).
    for (const h of hotspots) {
      expect(h.yaw, `yaw ${h.id}`).toBeGreaterThanOrEqual(-180);
      expect(h.yaw, `yaw ${h.id}`).toBeLessThanOrEqual(360);
      expect(h.pitch, `pitch ${h.id}`).toBeGreaterThanOrEqual(-90);
      expect(h.pitch, `pitch ${h.id}`).toBeLessThanOrEqual(90);
    }
  });

  it("cada foto de hotspot tiene src, thumb y alt", () => {
    for (const h of hotspots) {
      for (const p of h.photos) {
        expect(p.src).toMatch(/^\/images\/museo\/tour\/fotos\/foto-\d{2}\.jpg$/);
        expect(p.thumb).toMatch(/^\/images\/museo\/tour\/fotos\/foto-\d{2}-thumb\.jpg$/);
        expect(p.alt.length, `alt for ${p.src}`).toBeGreaterThan(0);
      }
    }
  });

  it("cada hotspot tiene una etiqueta en español no vacía", () => {
    for (const h of hotspots) {
      expect(h.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("la galería completa contiene las 62 fotos depuradas", () => {
    expect(galeria).toHaveLength(62);
    for (const p of galeria) {
      expect(p.src).toMatch(/foto-\d{2}\.jpg$/);
      expect(p.thumb).toMatch(/foto-\d{2}-thumb\.jpg$/);
      expect(p.alt.length).toBeGreaterThan(0);
    }
  });

  it("el panorama define fuentes de escritorio y móvil y vista inicial", () => {
    expect(panorama.src).toMatch(/panorama\.jpg$/);
    expect(panorama.srcMobile).toMatch(/panorama-mobile\.jpg$/);
    expect(typeof panorama.defaultYaw).toBe("number");
    expect(typeof panorama.defaultPitch).toBe("number");
    expect(panorama.attribution.length).toBeGreaterThan(0);
  });
});
