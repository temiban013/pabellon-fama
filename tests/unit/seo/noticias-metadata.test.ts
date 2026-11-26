// @vitest-environment node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { generateMetadata } from "@/app/noticias/[slug]/page";
import { noticias, titularCompleto } from "@/data/noticias";
import { SITE_URL } from "@/lib/constants/site";
import { dimensionesImagenPublica } from "@/lib/imagen-publica";

vi.unmock("next/navigation");

const metadatos = (slug: string) => generateMetadata({ params: Promise.resolve({ slug }) });

type OpenGraph = {
  title: string;
  description: string;
  url: string;
  type: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  images: Array<{ url: string; width: number; height: number; alt: string }>;
};

describe("metadatos para compartir de /noticias/[slug]", () => {
  it("la crónica comparte titular, resumen, su imagen 1200×630 y la firma de Félix", async () => {
    const metadata = await metadatos("cronica-novena-exaltacion-2026");
    const og = metadata.openGraph as unknown as OpenGraph;

    expect(og.title).toBe(
      "La Ciudad Gris aplaude a sus Héroes: Crónica de la 9na. Ceremonia de Exaltación del PFDH",
    );
    expect(metadata.twitter?.title).toBe(og.title);
    expect(metadata.title).toBe(`${og.title} | Pabellón de la Fama del Deporte Humacaeño`);
    expect(og.description).toBe(metadata.description);
    expect(og.url).toBe(`${SITE_URL}/noticias/cronica-novena-exaltacion-2026`);
    expect(og.type).toBe("article");
    expect(og.publishedTime).toBe("2026-11-26T00:00:00-04:00");
    expect(og.authors).toEqual(["Félix Báez Neris"]);
    expect(og.images).toEqual([
      {
        url: "/images/noticias/cronica-novena-exaltacion-2026-og.jpg",
        width: 1200,
        height: 630,
        alt: "Los exaltados sostienen sus trofeos en fila; uno de ellos lo levanta en alto sonriente, mientras una invitada los observa",
      },
    ]);
    expect(metadata.metadataBase?.origin).toBe(new URL(SITE_URL).origin);
  });

  it("toda noticia sale con titular sin el nombre del sitio, resumen de hasta 160 caracteres e imagen con sus medidas reales", async () => {
    for (const noticia of noticias) {
      const metadata = await metadatos(noticia.slug);
      const og = metadata.openGraph as unknown as OpenGraph;

      expect(og.title, noticia.slug).toBe(titularCompleto(noticia));
      expect(og.description, noticia.slug).toBe(noticia.resumen);
      expect(og.description.length, noticia.slug).toBeLessThanOrEqual(160);
      expect(og.publishedTime, noticia.slug).toBe(`${noticia.fecha}T00:00:00-04:00`);
      expect(og.images, noticia.slug).toHaveLength(1);

      const imagen = og.images[0];
      const esperada = noticia.imagenOg ?? noticia.imagen;
      if (!esperada) {
        expect(imagen.url, noticia.slug).toBe(`${SITE_URL}/images/og-default.jpg`);
        continue;
      }
      expect(imagen, noticia.slug).toMatchObject({
        url: esperada.src,
        width: esperada.width,
        height: esperada.height,
        alt: esperada.alt,
      });
      // Las imágenes locales existen y miden lo que se declara.
      if (esperada.src.startsWith("/")) {
        expect(existsSync(join(process.cwd(), "public", esperada.src)), esperada.src).toBe(true);
        expect(await dimensionesImagenPublica(esperada.src), esperada.src).toEqual({
          width: esperada.width,
          height: esperada.height,
        });
      }
    }
  });

  it("una noticia con actualizaciones declara la fecha de la última", async () => {
    const og = (await metadatos("novena-exaltacion-2026")).openGraph as unknown as OpenGraph;
    expect(og.modifiedTime).toBe("2026-11-12T00:00:00-04:00");
    expect(og.authors).toBeUndefined();
  });
});
