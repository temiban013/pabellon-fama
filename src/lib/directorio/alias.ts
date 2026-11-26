/**
 * Direcciones viejas de los perfiles.
 *
 * Antes de los ids canónicos, `/directorio/<slug>` usaba un slug derivado del
 * nombre completo en `exaltados.json`. Algunos no coinciden con el id actual
 * (p. ej. `julio-yuyo-luzunaris-maldonado` → `julio-yuyo-maldonado`). Esas
 * direcciones redirigen de forma permanente al perfil canónico.
 */
import { exaltados } from "@/data/exaltados";
import { todosLosExaltados } from "@/data/exaltados-all";

const idsCanonicos = new Set(todosLosExaltados.map((e) => e.id));

/** Mapa `slug viejo → id canónico`, solo con los slugs que difieren del id. */
export const ALIAS_DE_PERFILES: ReadonlyMap<string, string> = new Map(
  exaltados
    .filter((e) => e.slug !== e.id && !idsCanonicos.has(e.slug) && idsCanonicos.has(e.id))
    .map((e) => [e.slug, e.id] as const),
);

/** Id canónico al que apunta un slug viejo, o `undefined` si no es un alias. */
export function idCanonicoDeAlias(slug: string): string | undefined {
  return ALIAS_DE_PERFILES.get(slug);
}
