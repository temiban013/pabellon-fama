import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { todosLosExaltados } from "@/data/exaltados-all";
import { getRevistasExaltacion } from "@/data/revistas";
import { rev09Exaltados } from "@/data/revistas/rev09/exaltados";
import {
  calcularTotalesExaltados,
  getTotalesExaltados,
} from "@/lib/exaltados-totales";
import exaltadosJson from "@/data/exaltados.json";

// PF-074 (D101): los totales de las páginas se calculan de los datos. Esta prueba
// es la barrera: falla si alguien vuelve a escribir un total a mano en esos
// archivos o si `exaltados.json` se desfasa de las revistas.

const RAIZ = process.cwd();

describe("calcularTotalesExaltados", () => {
  it("personas son las entradas que no son EQUIPO; ceremonias, las revistas de exaltación", () => {
    const t = calcularTotalesExaltados(
      [
        { categoria: "ATLETA" },
        { categoria: "PROPULSOR" },
        { categoria: "EQUIPO" },
      ],
      [{ year: 2000 }, { year: 2002 }, { year: 2015 }],
    );
    expect(t).toEqual({
      personas: 2,
      equipos: 1,
      entradas: 3,
      ceremonias: 3,
      primerAnio: 2000,
      ultimoAnio: 2015,
    });
  });

  it("sin revistas no inventa años", () => {
    const t = calcularTotalesExaltados([], []);
    expect(t).toMatchObject({ ceremonias: 0, primerAnio: 0, ultimoAnio: 0 });
  });
});

describe("totales del sitio", () => {
  it("coinciden con los datos: personas + equipos = entradas, ceremonias = revistas de exaltación", () => {
    const t = getTotalesExaltados();
    expect(t.entradas).toBe(todosLosExaltados.length);
    expect(t.personas).toBe(
      todosLosExaltados.filter((e) => e.categoria !== "EQUIPO").length,
    );
    expect(t.equipos).toBe(
      todosLosExaltados.filter((e) => e.categoria === "EQUIPO").length,
    );
    expect(t.ceremonias).toBe(getRevistasExaltacion().length);
  });

  it("los cinco de la Novena entran a los datos (83 personas, 3 equipos, 86 entradas)", () => {
    expect(rev09Exaltados).toHaveLength(5);
    const t = getTotalesExaltados();
    expect(t.personas).toBe(83);
    expect(t.equipos).toBe(3);
    expect(t.entradas).toBe(86);
  });

  it("los ids de todos los exaltados son únicos", () => {
    const ids = todosLosExaltados.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("exaltados.json (estadisticas) coincide con las revistas y trae las mismas personas", () => {
    const t = getTotalesExaltados();
    const est = exaltadosJson.estadisticas;
    expect(est.totalExaltados).toBe(t.personas);
    expect(est.totalEquipos).toBe(t.equipos);
    expect(est.totalEntradas).toBe(t.entradas);

    const idsJson = new Set<string>();
    for (const [deporte, grupos] of Object.entries(exaltadosJson)) {
      if (deporte === "estadisticas") continue;
      for (const lista of Object.values(grupos as Record<string, { id: string }[]>)) {
        lista.forEach((p) => idsJson.add(p.id));
      }
    }
    expect(idsJson.size).toBe(t.entradas);
    const idsRevistas = new Set(todosLosExaltados.map((e) => e.id));
    expect([...idsJson].filter((id) => !idsRevistas.has(id))).toEqual([]);
    expect([...idsRevistas].filter((id) => !idsJson.has(id))).toEqual([]);
  });
});

/**
 * Quita del texto las cifras de época, que se quedan escritas a propósito.
 * Cada entrada: archivo -> [desde, hasta) (se elimina ese tramo).
 */
const CIFRAS_DE_EPOCA: Record<string, [string, string][]> = {
  // Blog de Félix: «78 exaltados», «8 exaltaciones» (cifras del blog).
  "src/app/enlaces/page.tsx": [['id: "blog-felix"', 'id: "exposiciones-fotograficas"']],
  // Entrada «2015» de la cronología: «78 deportistas ... 2000 y 2015».
  "src/app/historia/page.tsx": [["año: 2015,", "año: 2016,"]],
  // Cita textual de Quique Torres en la inauguración del Museo (2025): «los 78 atletas y propulsores».
  "src/app/museo/page.tsx": [["<blockquote", "</blockquote>"]],
};

const ARCHIVOS_CON_TOTALES = [
  "src/app/directorio/page.tsx",
  "src/app/enlaces/page.tsx",
  "src/app/historia/page.tsx",
  "src/app/museo/page.tsx",
  "src/components/sections/MuseumShowcase.tsx",
  "src/app/directorio/[slug]/page.tsx",
];

function sinCifrasDeEpoca(ruta: string): string {
  let texto = readFileSync(join(RAIZ, ruta), "utf8");
  for (const [desde, hasta] of CIFRAS_DE_EPOCA[ruta] ?? []) {
    const i = texto.indexOf(desde);
    const j = texto.indexOf(hasta, i + desde.length);
    expect(i, `${ruta}: falta el inicio «${desde}» del tramo de época`).toBeGreaterThanOrEqual(0);
    expect(j, `${ruta}: falta el final «${hasta}» del tramo de época`).toBeGreaterThan(i);
    texto = texto.slice(0, i) + texto.slice(j);
  }
  return texto;
}

describe("sin totales escritos a mano (PF-074, D101)", () => {
  it.each(ARCHIVOS_CON_TOTALES)("%s no escribe totales de exaltados a mano", (ruta) => {
    const texto = sinCifrasDeEpoca(ruta);
    // Un total de personas: «83 exaltados», «78 deportistas», «86 biografías»...
    expect(texto).not.toMatch(
      /\b(7\d|8\d|9\d)\s+(exaltados|deportistas|atletas|individuos|biograf\w*|personas|inductees)/i,
    );
    // Los totales de entradas, personas y equipos de cualquier etapa.
    expect(texto).not.toMatch(/\b(78|81|83|86)\b/);
    // Un total de ceremonias o revistas: «8 ceremonias», «nueve revistas oficiales»...
    expect(texto).not.toMatch(/\b(\d+|ocho|nueve)\s+(ceremonias|exaltaciones|revistas oficiales)/i);
    // Un número suelto (8 o 9) en su propia línea, como las tarjetas de /directorio.
    expect(texto).not.toMatch(/^\s*[89]\s*$/m);
  });
});
