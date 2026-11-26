// @vitest-environment node
import { describe, expect, it } from "vitest";
import { GET as sitemapExaltados } from "@/app/sitemap-exaltados.xml/route";
import { exaltados } from "@/data/exaltados";
import { todosLosExaltados } from "@/data/exaltados-all";
import { SITE_URL } from "@/lib/constants/site";
import {
  LARGO_MAXIMO_DESCRIPCION,
  descripcionExaltado,
  jsonLdExaltado,
  metadataExaltado,
  separarOraciones,
} from "@/lib/directorio/seo";
import { dimensionesImagenPublica } from "@/lib/imagen-publica";

const porId = (id: string) => todosLosExaltados.find((e) => e.id === id)!;

describe("metadatos de /directorio/[slug]", () => {
  const victor = porId("victor-vitin-hernandez-lopez");

  it("el perfil comparte su tarjeta 1200×630 como imagen Open Graph, con URL absoluta", () => {
    const metadata = metadataExaltado(victor);
    const og = metadata.openGraph as { url: string; type: string; images: unknown[] };

    expect(og.url).toBe(`${SITE_URL}/directorio/victor-vitin-hernandez-lopez`);
    expect(og.type).toBe("profile");
    expect(og.images).toEqual([
      {
        url: `${SITE_URL}/directorio/victor-vitin-hernandez-lopez/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Víctor M. "Vitín" Hernández López, exaltación 2026 del Pabellón de la Fama del Deporte Humacaeño',
      },
    ]);
    expect(metadata.twitter?.images).toEqual([
      `${SITE_URL}/directorio/victor-vitin-hernandez-lopez/opengraph-image`,
    ]);
    expect(metadata.alternates?.canonical).toBe(
      `${SITE_URL}/directorio/victor-vitin-hernandez-lopez`,
    );
  });

  it("título y descripción no llevan género: «Exaltación <año>», también para mujeres y equipos", () => {
    expect(metadataExaltado(victor).title).toBe(
      'Víctor M. "Vitín" Hernández López · Exaltación 2026 | Pabellón de la Fama del Deporte Humacaeño',
    );
    for (const exaltado of todosLosExaltados) {
      const metadata = metadataExaltado(exaltado);
      expect(String(metadata.title), exaltado.id).not.toMatch(/exaltad[oa]\b/i);
      expect(String(metadata.description).split(".")[0], exaltado.id).not.toMatch(/exaltad[oa]\b/i);
      expect((metadata.openGraph as { title: string }).title).toBe(metadata.title);
      expect(metadata.twitter?.title).toBe(metadata.title);
    }
  });

  it("no declara una cuenta de Twitter sin verificar", () => {
    expect(metadataExaltado(victor).twitter).not.toHaveProperty("creator");
  });

  it("la descripción de Víctor termina en una oración completa de su biografía", () => {
    expect(descripcionExaltado(victor)).toBe(
      'Víctor M. "Vitín" Hernández López: Exaltación 2026 al Pabellón de la Fama del Deporte Humacaeño. Béisbol, Softbol. Nació en Humacao el 3 de agosto de 1945.',
    );
  });

  it("no parte la oración en una inicial ni en una abreviatura", () => {
    expect(separarOraciones("Nació Emilio E. Huyke Colón en Humacao. Es hijo de don Juan B. Huyke.")).toEqual([
      "Nació Emilio E. Huyke Colón en Humacao.",
      "Es hijo de don Juan B. Huyke.",
    ]);
    expect(separarOraciones("Estudió con el Dr. Pérez. Luego jugó.")).toEqual([
      "Estudió con el Dr. Pérez.",
      "Luego jugó.",
    ]);
    for (const exaltado of todosLosExaltados) {
      expect(descripcionExaltado(exaltado), exaltado.id).not.toMatch(/\s[A-ZÁÉÍÓÚÑ]\.$/);
    }
  });

  it("ninguna descripción pasa de 155 caracteres ni corta una palabra", () => {
    for (const exaltado of todosLosExaltados) {
      const descripcion = descripcionExaltado(exaltado);
      expect(descripcion.length, exaltado.id).toBeLessThanOrEqual(LARGO_MAXIMO_DESCRIPCION);
      expect(descripcion, exaltado.id).toMatch(/[.!?…]$/);

      if (descripcion.endsWith("…")) {
        // Lo que precede a «…» es un prefijo de la biografía que acaba en palabra entera.
        const biografia = exaltado.contenido.biografia.replace(/\s+/g, " ").trim();
        const fragmento = descripcion.slice(descripcion.indexOf("Humacaeño. ") + "Humacaeño. ".length, -1);
        const resto = fragmento.slice(fragmento.indexOf(". ") + 2);
        expect(biografia.startsWith(resto), exaltado.id).toBe(true);
        expect(biografia.charAt(resto.length), exaltado.id).toMatch(/[\s,;:]/);
      }
    }
  });

  it("los 86 perfiles comparten una tarjeta del mismo tamaño, también los de foto pequeña", async () => {
    for (const exaltado of todosLosExaltados) {
      const og = metadataExaltado(exaltado).openGraph as {
        images: Array<{ url: string; width: number; height: number }>;
      };
      expect(og.images[0], exaltado.id).toMatchObject({
        url: `${SITE_URL}/directorio/${exaltado.id}/opengraph-image`,
        width: 1200,
        height: 630,
      });
      // La tarjeta se arma con la foto: tiene que existir y poder leerse.
      if (exaltado.foto) {
        expect(await dimensionesImagenPublica(exaltado.foto), exaltado.id).toBeDefined();
      }
    }
  });

  it("la imagen por defecto del sitio existe y mide 1200×630", async () => {
    expect(await dimensionesImagenPublica("/images/og-default.jpg")).toEqual({
      width: 1200,
      height: 630,
    });
  });

  it("el JSON-LD de una persona es Person con foto, premio y ruta de navegación", async () => {
    const [perfil, ruta] = jsonLdExaltado(victor, await dimensionesImagenPublica(victor.foto!));

    expect(perfil).toMatchObject({
      "@type": "Person",
      url: `${SITE_URL}/directorio/victor-vitin-hernandez-lopez`,
      name: "Víctor M. Hernández López",
      alternateName: "Vitín",
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/exaltados/victor-vitin-hernandez-lopez.jpg`,
        width: 1000,
        height: 1250,
      },
      award: "Exaltación al Pabellón de la Fama del Deporte Humacaeño (2026)",
    });
    expect(perfil).not.toHaveProperty("memberOf");
    expect(perfil).not.toHaveProperty("sport");
    expect(ruta).toMatchObject({ "@type": "BreadcrumbList" });
  });

  it("un equipo sale como SportsTeam y no como persona", () => {
    const equipo = todosLosExaltados.find((e) => e.categoria === "EQUIPO")!;
    const [perfil] = jsonLdExaltado(equipo);
    expect(perfil["@type"]).toBe("SportsTeam");
    expect((metadataExaltado(equipo).openGraph as { type: string }).type).toBe("article");
  });
});

describe("sitemap-exaltados.xml", () => {
  it("lista solo las URLs canónicas /directorio/<id>, una por exaltado", async () => {
    const xml = await (await sitemapExaltados()).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    expect(urls.sort()).toEqual(
      todosLosExaltados.map((e) => `${SITE_URL}/directorio/${e.id}`).sort(),
    );

    const ids = new Set(todosLosExaltados.map((e) => e.id));
    const slugsViejos = exaltados.filter((e) => !ids.has(e.slug)).map((e) => e.slug);
    expect(slugsViejos.length).toBeGreaterThan(0);
    for (const slug of slugsViejos) {
      expect(urls).not.toContain(`${SITE_URL}/directorio/${slug}`);
    }
  });
});
