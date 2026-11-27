// @vitest-environment node
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { generateStaticParams } from "@/app/directorio/deporte/[deporte]/page";
import { exaltados } from "@/data/exaltados";
import { SITE_URL } from "@/lib/constants/site";
import {
  deporteDeSegmento,
  deportesDelDirectorio,
  slugDeporte,
} from "@/lib/directorio/deportes";

const ids = (segmento: string) => deporteDeSegmento(segmento)?.exaltados.map((e) => e.id) ?? [];

describe("páginas por deporte", () => {
  it("el slug no lleva acentos, mayúsculas ni espacios", () => {
    expect(slugDeporte("Béisbol")).toBe("beisbol");
    expect(slugDeporte("Lucha Olímpica")).toBe("lucha-olimpica");
  });

  it("hay una página por deporte individual, nunca por combinación de deportes", () => {
    const slugs = deportesDelDirectorio().map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, slug).toMatch(/^[a-z0-9-]+$/);
    }
    expect(generateStaticParams().map((p) => p.deporte).sort()).toEqual([...slugs].sort());
  });

  it("todo exaltado sale en la página de cada uno de sus deportes", () => {
    for (const exaltado of exaltados) {
      for (const deporte of exaltado.deporte) {
        expect(ids(slugDeporte(deporte)), `${exaltado.id} en ${deporte}`).toContain(exaltado.id);
      }
    }
  });

  it("José Escalera sale en Atletismo y en Béisbol; Víctor Hernández, en Béisbol y en Softbol", () => {
    expect(ids("atletismo")).toContain("jose-escalera");
    expect(ids("beisbol")).toContain("jose-escalera");
    expect(ids("beisbol")).toContain("victor-vitin-hernandez-lopez");
    expect(ids("softbol")).toContain("victor-vitin-hernandez-lopez");
  });

  it("la dirección con acentos o codificada lleva al mismo deporte", () => {
    expect(deporteDeSegmento("b%C3%A9isbol")?.slug).toBe("beisbol");
    expect(deporteDeSegmento("béisbol")?.slug).toBe("beisbol");
    expect(deporteDeSegmento("Lucha-Olímpica")?.slug).toBe("lucha-olimpica");
  });

  it("una combinación de deportes o un deporte sin exaltados no tiene página", () => {
    expect(deporteDeSegmento("b%C3%A9isbol,-softbol")).toBeUndefined();
    expect(deporteDeSegmento("ajedrez")).toBeUndefined();
  });

  it("Jaime Tolentino y Miguel A. López Reyes salen en su deporte con el año 2002", () => {
    for (const id of ["jaime-tolentino", "miguel-lopez-reyes"]) {
      const exaltado = exaltados.find((e) => e.id === id)!;
      expect(exaltado.anoExaltacion, id).toBe(2002);
      expect(ids(slugDeporte(exaltado.deporte[0])), id).toContain(id);
    }
  });

  it("sitemap.xml publica exactamente las páginas por deporte que existen", () => {
    const enSitemap = sitemap()
      .map((entrada) => entrada.url)
      .filter((url) => url.startsWith(`${SITE_URL}/directorio/deporte/`))
      .sort();
    expect(enSitemap).toEqual(
      deportesDelDirectorio()
        .map((d) => `${SITE_URL}/directorio/deporte/${d.slug}`)
        .sort(),
    );
  });
});
