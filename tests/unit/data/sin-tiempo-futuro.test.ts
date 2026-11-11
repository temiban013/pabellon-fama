import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// PF-072: la Novena Exaltación ya se celebró (2026-11-08). El texto fijo de las
// noticias y de /historia no puede volver a anunciarla en tiempo futuro.
// ComunicadoPrensa (texto literal del comunicado archivado) no se escanea.
const RAIZ = process.cwd();
const PATRON_FUTURO = /celebrará|Programada para|Faltan para/;

function archivosDe(ruta: string): string[] {
  if (!statSync(ruta).isDirectory()) return [ruta];
  return readdirSync(ruta).flatMap((nombre) => archivosDe(join(ruta, nombre)));
}

const archivos = [
  join(RAIZ, "src/data/noticias.ts"),
  ...archivosDe(join(RAIZ, "src/app/historia")),
];

describe("sin texto en tiempo futuro sobre la Novena Exaltación (PF-072)", () => {
  it("escanea noticias.ts y al menos un archivo de /historia", () => {
    expect(archivos.length).toBeGreaterThanOrEqual(2);
  });

  it.each(archivos.map((a) => [a.replace(`${RAIZ}/`, ""), a]))(
    "%s no contiene «celebrará», «Programada para» ni «Faltan para»",
    (_nombre, ruta) => {
      const texto = readFileSync(ruta, "utf8");
      expect(texto).not.toMatch(PATRON_FUTURO);
    },
  );
});
