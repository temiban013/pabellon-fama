// @vitest-environment node
import { describe, expect, it } from "vitest";
import { exaltados } from "@/data/exaltados";
import { todosLosExaltados } from "@/data/exaltados-all";
import { getRevistaByNumero } from "@/data/revistas";
import { FORMATO_FECHA_HISTORICA, formatearFechaHistorica } from "@/lib/date-utils";
import { jsonLdExaltado, metadataExaltado } from "@/lib/directorio/seo";

const porId = (id: string) => todosLosExaltados.find((e) => e.id === id)!;

describe("formatearFechaHistorica (PF-088)", () => {
  it("un año solo se muestra como año", () => {
    expect(formatearFechaHistorica("2022")).toEqual({ texto: "2022", soloAno: true });
  });

  it("una fecha completa se muestra en español, sin desfase de zona horaria", () => {
    expect(formatearFechaHistorica("2026-05-09")).toEqual({
      texto: "9 de mayo de 2026",
      soloAno: false,
    });
    expect(formatearFechaHistorica("1932-02-22").texto).toBe("22 de febrero de 1932");
  });

  it("otro texto se devuelve tal cual", () => {
    expect(formatearFechaHistorica("2023-03")).toEqual({ texto: "2023-03", soloAno: false });
  });
});

describe("fechas de nacimiento y fallecimiento de los exaltados (PF-088)", () => {
  it("toda fecha es YYYY o YYYY-MM-DD", () => {
    for (const e of todosLosExaltados) {
      for (const fecha of [e.fechaNacimiento, e.fechaFallecimiento]) {
        if (fecha !== undefined) expect(fecha, e.id).toMatch(FORMATO_FECHA_HISTORICA);
      }
    }
  });

  it("si hay fecha de fallecimiento, el estado es «fallecido»", () => {
    for (const e of todosLosExaltados) {
      if (e.fechaFallecimiento) expect(e.estado, e.id).toBe("fallecido");
    }
  });

  it.each([
    ["pedro-j-davila-poupart", "1940", "2022"],
    ["milton-rosario-soto", "1940-10-07", "2025"],
    ["juan-de-dios-ortiz", "1943-10-17", "2019"],
    ["pedro-tolentino", "1932-02-22", "2021"],
    ["juan-tulier", "1932", "2025"],
  ])("%s: nació en %s, falleció en %s", (id, nacimiento, fallecimiento) => {
    expect(porId(id)).toMatchObject({
      estado: "fallecido",
      fechaNacimiento: nacimiento,
      fechaFallecimiento: fallecimiento,
    });
    // exaltados.json (páginas por deporte) lleva el mismo estado y el mismo año.
    const enJson = exaltados.find((e) => e.id === id)!;
    expect(enJson.estado, id).toBe("fallecido");
    expect(enJson.fechaFallecimiento, id).toBe(fallecimiento);
    expect(enJson.fechaNacimiento?.slice(0, 4), id).toBe(nacimiento.slice(0, 4));
  });

  it("Papuso conserva su fecha completa", () => {
    const papuso = porId("miguel-papuso-garcia-cruz");
    expect(papuso.fechaFallecimiento).toBe("2026-05-09");
    expect(formatearFechaHistorica(papuso.fechaFallecimiento!).texto).toBe("9 de mayo de 2026");
  });

  it("el JSON-LD del perfil lleva birthDate y deathDate con el valor crudo", () => {
    const [tolentino] = jsonLdExaltado(porId("pedro-tolentino"));
    expect(tolentino).toMatchObject({ birthDate: "1932-02-22", deathDate: "2021" });
    const [tulier] = jsonLdExaltado(porId("juan-tulier"));
    expect(tulier).toMatchObject({ birthDate: "1932", deathDate: "2025" });
    const [vivo] = jsonLdExaltado(porId("jose-escalera"));
    expect(vivo).not.toHaveProperty("deathDate");
  });
});

describe("respuestas del historiador del 2026-11-27 (PF-088)", () => {
  it("la Segunda Exaltación fue el 3 de noviembre de 2002", () => {
    expect(getRevistaByNumero(2)?.fechaCeremonia).toBe("2002-11-03");
  });

  it("el año de exaltación coincide entre los datos de revistas y exaltados.json, en los 86", () => {
    for (const e of todosLosExaltados) {
      const enJson = exaltados.find((j) => j.id === e.id);
      expect(enJson, e.id).toBeDefined();
      expect(enJson!.anoExaltacion, e.id).toBe(e.anoExaltacion);
    }
  });

  it("«Paciencia» es segundo nombre de Carmen, no apodo", () => {
    const carmen = porId("carmen-paciencia-marrero");
    expect(carmen.nombre).toBe("Carmen Paciencia");
    expect(carmen.apodo).toBeUndefined();
    expect(metadataExaltado(carmen).title).toBe(
      "Carmen Paciencia Marrero Berrios · Exaltación 2000 | Pabellón de la Fama del Deporte Humacaeño",
    );
    expect(jsonLdExaltado(carmen)[0]).not.toHaveProperty("alternateName");
  });

  it("Francisco Betancourt Ibern lleva el apodo «Pancho»", () => {
    const betancourt = porId("francisco-betancourt-ibern");
    expect(betancourt.apodo).toBe("Pancho");
    expect(metadataExaltado(betancourt).title).toBe(
      'Francisco "Pancho" Betancourt Ibern · Exaltación 2026 | Pabellón de la Fama del Deporte Humacaeño',
    );
    expect(jsonLdExaltado(betancourt)[0]).toMatchObject({ alternateName: "Pancho" });
  });
});
