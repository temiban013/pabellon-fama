// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import ExaltadoPage from "@/app/directorio/[slug]/page";
import { exaltados } from "@/data/exaltados";
import { todosLosExaltados } from "@/data/exaltados-all";
import { ALIAS_DE_PERFILES, idCanonicoDeAlias } from "@/lib/directorio/alias";

// El setup global simula `next/navigation`; aquí hace falta el módulo real,
// que lanza los errores de redirección y de 404 con su `digest`.
vi.unmock("next/navigation");

const pagina = (slug: string) => ExaltadoPage({ params: Promise.resolve({ slug }) });

describe("direcciones viejas de /directorio/[slug]", () => {
  const ids = new Set(todosLosExaltados.map((e) => e.id));

  it("hay 21 alias y cada uno apunta a un id canónico distinto de sí mismo", () => {
    expect(ALIAS_DE_PERFILES.size).toBe(21);
    for (const [alias, id] of ALIAS_DE_PERFILES) {
      expect(ids.has(alias), alias).toBe(false);
      expect(ids.has(id), alias).toBe(true);
    }
    // Todo slug viejo que no es id canónico está en el mapa.
    for (const viejo of exaltados.filter((e) => !ids.has(e.slug))) {
      expect(idCanonicoDeAlias(viejo.slug), viejo.slug).toBe(viejo.id);
    }
  });

  it.each([...ALIAS_DE_PERFILES])("%s redirige con 308 a /directorio/%s", async (alias, id) => {
    await expect(pagina(alias)).rejects.toMatchObject({
      digest: `NEXT_REDIRECT;replace;/directorio/${id};308;`,
    });
  });

  it("un id canónico no es alias y su página se arma sin redirigir", async () => {
    expect(idCanonicoDeAlias("julio-yuyo-maldonado")).toBeUndefined();
    await expect(pagina("julio-yuyo-maldonado")).resolves.toBeDefined();
  });

  it("un slug que no es id ni alias da 404", async () => {
    await expect(pagina("no-existe-este-exaltado")).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_HTTP_ERROR_FALLBACK;404"),
    });
  });
});
