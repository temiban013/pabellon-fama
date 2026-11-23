// @vitest-environment node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getAllRevistas, getRevistaBySlug } from "@/data/revistas";
import { SITE_URL } from "@/lib/constants/site";
import { dimensionesPortada, jsonLdRevista, metadataRevista } from "@/lib/revistas/seo";

describe("metadatos de /revistas/[slug]", () => {
  const revista9 = getRevistaBySlug("9")!;

  it("la revista 9 comparte su portada como imagen Open Graph, con URL absoluta y dimensiones reales", async () => {
    const dimensiones = await dimensionesPortada(revista9.portadaUrl);
    expect(dimensiones).toEqual({ width: 800, height: 1012 });

    const metadata = metadataRevista(revista9, dimensiones);
    const og = metadata.openGraph as { url: string; images: Array<Record<string, unknown>> };

    expect(og.url).toBe(`${SITE_URL}/revistas/9`);
    expect(og.images).toEqual([
      {
        url: `${SITE_URL}/revistas/portadas/rev09.jpg`,
        width: 800,
        height: 1012,
        alt: "Portada de la revista: Novena Exaltación del Pabellón (2026)",
      },
    ]);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/revistas/9`);
    expect(metadata.twitter?.images).toEqual([`${SITE_URL}/revistas/portadas/rev09.jpg`]);
  });

  it("la descripción cabe en un resultado de búsqueda (160 caracteres o menos)", () => {
    expect(String(metadataRevista(revista9).description).length).toBeLessThanOrEqual(160);
  });

  it("toda revista tiene portada en public/ y sale con ella como imagen Open Graph", async () => {
    for (const revista of getAllRevistas()) {
      expect(existsSync(join(process.cwd(), "public", revista.portadaUrl)), revista.slug).toBe(true);
      const dimensiones = await dimensionesPortada(revista.portadaUrl);
      expect(dimensiones, revista.slug).toBeDefined();
      const og = metadataRevista(revista, dimensiones).openGraph as { images: Array<{ url: string }> };
      expect(og.images[0].url).toBe(`${SITE_URL}${revista.portadaUrl}`);
    }
  });

  it("una portada que no se puede leer no da dimensiones", async () => {
    expect(await dimensionesPortada("/revistas/portadas/no-existe.jpg")).toBeUndefined();
  });

  it("el JSON-LD describe la revista 9 y su ruta de navegación", () => {
    const [publicacion, ruta] = jsonLdRevista(revista9);

    expect(publicacion).toMatchObject({
      "@type": "PublicationIssue",
      url: `${SITE_URL}/revistas/9`,
      issueNumber: 9,
      datePublished: "2026-11-08",
      pagination: "1-40",
      image: `${SITE_URL}/revistas/portadas/rev09.jpg`,
      encoding: { contentUrl: revista9.pdfUrl, encodingFormat: "application/pdf" },
    });
    expect(ruta).toMatchObject({ "@type": "BreadcrumbList" });
    expect((ruta.itemListElement as unknown[]).length).toBe(3);
  });

  it("la edición especial no lleva número de revista", () => {
    const [publicacion] = jsonLdRevista(getRevistaBySlug("inauguracion-museo")!);
    expect(publicacion).not.toHaveProperty("issueNumber");
    expect(publicacion.datePublished).toBe("2025-06-29");
  });
});
