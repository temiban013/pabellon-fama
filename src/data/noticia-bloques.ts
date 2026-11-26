/**
 * Cuerpo por bloques de una noticia (PF-087).
 *
 * Lo usan los textos con estructura propia (crónicas firmadas): subtítulos,
 * citas destacadas, fotos intercaladas, tarjetas de exaltados y listas. Las
 * noticias sencillas siguen con `contenido: string[]`. Una noticia trae
 * `contenido` o `cuerpo`, nunca los dos.
 *
 * Todo es texto plano: se pinta como nodos de texto, NUNCA como HTML.
 */
import type { GaleriaId } from "@/data/galerias";

export type BloqueNoticia =
  | { readonly tipo: "parrafo"; readonly texto: string }
  | { readonly tipo: "subtitulo"; readonly texto: string }
  /** Cita destacada: repite literalmente una frase de un `parrafo`. */
  | { readonly tipo: "cita"; readonly texto: string }
  | {
      readonly tipo: "imagen";
      readonly galeriaId: GaleriaId;
      /** `id` de una foto de esa galería. */
      readonly fotoId: string;
      /** Pie visible. Nombres de personas solo con fuente (quien tomó la foto o el texto del autor). */
      readonly pie?: string;
    }
  | {
      readonly tipo: "exaltados";
      readonly items: readonly {
        /** id vivo del directorio; debe existir en `todosLosExaltados`. */
        readonly exaltadoId: string;
        /** Nombre tal como lo escribió el autor. */
        readonly nombre: string;
        /** Disciplina tal como la escribió el autor. */
        readonly disciplina: string;
        readonly semblanza: string;
      }[];
    }
  | {
      readonly tipo: "lista";
      readonly introduccion: string;
      readonly items: readonly string[];
      readonly enlace?: { readonly texto: string; readonly href: string };
    }
  | { readonly tipo: "cierre"; readonly texto: string };

/**
 * Texto del cuerpo, un elemento por párrafo, en el orden de lectura. Es lo
 * que va a `articleBody` del JSON-LD.
 *
 * No incluye las citas destacadas (repiten una frase que ya está en un
 * párrafo) ni los pies de foto (no son texto del autor).
 */
export function textoDeBloques(bloques: readonly BloqueNoticia[]): string[] {
  const texto: string[] = [];
  for (const bloque of bloques) {
    switch (bloque.tipo) {
      case "parrafo":
      case "subtitulo":
      case "cierre":
        texto.push(bloque.texto);
        break;
      case "exaltados":
        for (const item of bloque.items) {
          texto.push(`${item.nombre} (${item.disciplina})`, item.semblanza);
        }
        break;
      case "lista":
        texto.push(bloque.introduccion, ...bloque.items);
        break;
      case "cita":
      case "imagen":
        break;
    }
  }
  return texto;
}
