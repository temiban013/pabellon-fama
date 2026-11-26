// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cuerpoCronicaNovena2026 } from "@/data/cronicas/novena-exaltacion-2026";
import { todosLosExaltados } from "@/data/exaltados-all";
import { getGaleria } from "@/data/galerias";
import { textoDeBloques } from "@/data/noticia-bloques";
import {
  SLUG_CRONICA_NOVENA,
  getNoticiaBySlug,
  getRelacionadas,
  noticias,
  titularCompleto,
} from "@/data/noticias";
import { SITE_URL } from "@/lib/constants/site";
import { EXALTACION_2026 } from "@/lib/data/exaltacion-2026";
import { generateNewsArticleSchema } from "@/lib/schemas/news-article-schema";

const cronica = getNoticiaBySlug(SLUG_CRONICA_NOVENA)!;
const bloques = cuerpoCronicaNovena2026;
const deTipo = <T extends (typeof bloques)[number]["tipo"]>(tipo: T) =>
  bloques.filter(
    (b): b is Extract<(typeof bloques)[number], { tipo: T }> => b.tipo === tipo,
  );

describe("crónica de la Novena Exaltación (PF-087)", () => {
  it("es una noticia propia, firmada, con categoría «cronica» y cuerpo por bloques", () => {
    expect(cronica).toMatchObject({
      titulo: "La Ciudad Gris aplaude a sus Héroes",
      subtitulo: "Crónica de la 9na. Ceremonia de Exaltación del PFDH",
      categoria: "cronica",
      autor: { nombre: "Félix Báez Neris", descripcion: "Profesor jubilado de la UPRH" },
    });
    expect(cronica.contenido).toBeUndefined();
    expect(cronica.cuerpo).toBe(bloques);
    expect(cronica.resumen.length).toBeLessThanOrEqual(160);
    expect(titularCompleto(cronica)).toBe(
      "La Ciudad Gris aplaude a sus Héroes: Crónica de la 9na. Ceremonia de Exaltación del PFDH",
    );
  });

  it("tiene la estructura del texto de Félix: 13 párrafos, un subtítulo, cinco exaltados, la Junta y el cierre", () => {
    expect(deTipo("parrafo")).toHaveLength(13);
    expect(deTipo("subtitulo").map((b) => b.texto)).toEqual(["Exaltados – Novena Ceremonia"]);
    expect(deTipo("cierre").map((b) => b.texto)).toEqual(["¡Que viva el PFDH!"]);
    expect(bloques.at(-1)?.tipo).toBe("cierre");

    const [lista] = deTipo("lista");
    expect(lista.introduccion).toBe(
      "Gracias al excelente trabajo de la Junta de Directores integrada por:",
    );
    expect(lista.items).toHaveLength(9);
    expect(lista.enlace).toEqual({ texto: "Conoce a la Junta de Directores", href: "/junta" });
  });

  it("los cinco exaltados van en el orden de la crónica y cada id existe en el directorio", () => {
    const ids = new Set(todosLosExaltados.map((e) => e.id));
    const [exaltados] = deTipo("exaltados");

    expect(exaltados.items.map((i) => i.exaltadoId)).toEqual([
      "jose-m-pancho-rodriguez-castillo",
      "francisco-betancourt-ibern",
      "obed-santana-acosta",
      "jose-escalera",
      "victor-vitin-hernandez-lopez",
    ]);
    for (const item of exaltados.items) {
      expect(ids.has(item.exaltadoId), item.exaltadoId).toBe(true);
      expect(item.semblanza.trim().length).toBeGreaterThan(0);
    }
    expect(exaltados.items[0]).toMatchObject({
      nombre: "José M. “Pancho” Rodríguez Castillo",
      disciplina: "Boxeo",
    });
  });

  it("la foto del cambio de mando va tras su párrafo, con un pie que usa las palabras de la crónica", () => {
    const indiceParrafo = bloques.findIndex(
      (b) => b.tipo === "parrafo" && b.texto.includes("cambio de mando en la Presidencia Honorífica"),
    );
    const parrafo = bloques[indiceParrafo];
    const foto = bloques[indiceParrafo + 1];

    expect(foto).toMatchObject({
      tipo: "imagen",
      fotoId: "pxl-20261108-180937988",
      pie: "El Sr. William Méndez recibe la estatuilla oficial de manos del Sr. Antonio Maldonado López al asumir la presidencia honoraria del PFDH",
    });
    // Lo que afirma el pie está en el párrafo de Félix.
    for (const frase of ["Sr. William Méndez", "Sr. Antonio Maldonado López", "estatuilla oficial", "presidencia honoraria"]) {
      expect(parrafo.tipo === "parrafo" && parrafo.texto, frase).toContain(frase);
    }
  });

  it("cada foto del cuerpo existe en su galería y su pie no lleva nombres de exaltados", () => {
    const fotos = deTipo("imagen");
    expect(fotos).toHaveLength(2);
    for (const foto of fotos) {
      const enGaleria = getGaleria(foto.galeriaId).fotos.find((f) => f.id === foto.fotoId);
      expect(enGaleria, foto.fotoId).toBeDefined();
      for (const exaltado of todosLosExaltados.filter((e) => e.anoExaltacion === 2026)) {
        expect(foto.pie ?? "", foto.fotoId).not.toContain(exaltado.apellidos);
      }
    }
  });

  it("cada cita destacada aparece literal en un párrafo", () => {
    const parrafos = deTipo("parrafo").map((b) => b.texto);
    const citas = deTipo("cita");
    expect(citas).toHaveLength(1);
    for (const cita of citas) {
      expect(parrafos.some((p) => p.includes(cita.texto)), cita.texto).toBe(true);
    }
  });

  it("la imagen principal sale de la galería, con crédito, y la imagen para compartir mide 1200×630 y existe", () => {
    const galeria = getGaleria("novena-exaltacion-2026");
    expect(galeria.fotos.some((f) => f.src === cronica.imagen?.src)).toBe(true);
    expect(cronica.imagen?.credito).toBe(galeria.credito);
    expect(cronica.imagenOg).toMatchObject({
      src: "/images/noticias/cronica-novena-exaltacion-2026-og.jpg",
      width: 1200,
      height: 630,
    });
    const archivo = readFileSync(join(process.cwd(), "public", cronica.imagenOg!.src));
    expect(archivo.length).toBeGreaterThan(10_000);
    // Sin metadatos: un JPEG con EXIF lleva el marcador «Exif» al principio.
    expect(archivo.subarray(0, 4096).includes(Buffer.from("Exif"))).toBe(false);
  });

  it("la crónica y la noticia de la ceremonia se enlazan entre sí, y cada slug relacionado existe", () => {
    const slugs = new Set(noticias.map((n) => n.slug));
    for (const noticia of noticias) {
      for (const slug of noticia.relacionadas ?? []) {
        expect(slugs.has(slug), `${noticia.slug} → ${slug}`).toBe(true);
        expect(slug).not.toBe(noticia.slug);
      }
    }
    const ceremonia = getNoticiaBySlug(EXALTACION_2026.noticiaSlug)!;
    expect(getRelacionadas(cronica).map((n) => n.slug)).toEqual([ceremonia.slug]);
    expect(getRelacionadas(ceremonia).map((n) => n.slug)).toEqual([cronica.slug]);
    for (const noticia of [cronica, ceremonia]) {
      expect(noticia.enlaces).toEqual([
        { texto: "Revista de la Novena Exaltación", href: "/revistas/9" },
      ]);
    }
  });
});

describe("JSON-LD de la crónica", () => {
  const schema = generateNewsArticleSchema(cronica) as unknown as Record<string, unknown>;

  it("el autor es la persona que firma; el editor sigue siendo el Pabellón", () => {
    expect(schema.author).toEqual({ "@type": "Person", name: "Félix Báez Neris" });
    expect(schema.publisher).toMatchObject({ "@type": "Organization" });
  });

  it("el titular une título y subtítulo, y el subtítulo va en alternativeHeadline", () => {
    expect(schema.headline).toBe(titularCompleto(cronica));
    expect(schema.alternativeHeadline).toBe(cronica.subtitulo);
  });

  it("menciona los cinco perfiles con el mismo @id de su Person", () => {
    expect(schema.mentions).toEqual(
      [
        "jose-m-pancho-rodriguez-castillo",
        "francisco-betancourt-ibern",
        "obed-santana-acosta",
        "jose-escalera",
        "victor-vitin-hernandez-lopez",
      ].map((id) => ({ "@id": `${SITE_URL}/directorio/${id}` })),
    );
  });

  it("articleBody es el texto de los bloques, sin repetir la cita ni incluir pies de foto", () => {
    const texto = textoDeBloques(bloques);
    expect(schema.articleBody).toBe(texto.join("\n\n"));

    const cita = deTipo("cita")[0].texto;
    expect((schema.articleBody as string).split(cita)).toHaveLength(2);
    for (const foto of deTipo("imagen")) {
      if (foto.pie) expect(texto).not.toContain(foto.pie);
    }
    expect(texto[0]).toMatch(/^El pasado domingo, 8 de noviembre de 2026/);
    expect(texto.at(-1)).toBe("¡Que viva el PFDH!");
    expect(texto).toContain("José Escalera (Atletismo y Béisbol)");
    expect(texto).toContain("Sr. Héctor Ruiz, Vocal");
  });

  it("una noticia sin autor la sigue firmando el Pabellón, sin mentions", () => {
    const ceremonia = generateNewsArticleSchema(
      getNoticiaBySlug(EXALTACION_2026.noticiaSlug)!,
    ) as unknown as Record<string, unknown>;
    expect(ceremonia.author).toMatchObject({ "@type": "Organization" });
    expect(ceremonia).not.toHaveProperty("mentions");
    expect(ceremonia).not.toHaveProperty("alternativeHeadline");
  });
});
