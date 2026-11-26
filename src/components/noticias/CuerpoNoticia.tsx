import Image from "next/image";
import Link from "next/link";
import { todosLosExaltados } from "@/data/exaltados-all";
import { getGaleria } from "@/data/galerias";
import type { BloqueNoticia } from "@/data/noticia-bloques";
import { nombreCompletoExaltado } from "@/lib/directorio/seo";

/**
 * Cuerpo por bloques de una noticia (PF-087): crónicas y textos firmados.
 *
 * Server Component. Todo el texto se pinta como nodos de texto; aquí no hay
 * `dangerouslySetInnerHTML`.
 */

const FOCO_FOTO_POR_DEFECTO = "center 20%";

/** Raya dorada corta que acompaña subtítulos y firma. */
function Raya({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-1 w-12 rounded bg-pabellon-gold-400 ${className}`}
    />
  );
}

type BloqueExaltados = Extract<BloqueNoticia, { tipo: "exaltados" }>;
type BloqueImagen = Extract<BloqueNoticia, { tipo: "imagen" }>;
type BloqueLista = Extract<BloqueNoticia, { tipo: "lista" }>;

function TarjetasExaltados({ bloque }: { bloque: BloqueExaltados }) {
  return (
    <ul className="my-8 space-y-4">
      {bloque.items.map((item) => {
        const exaltado = todosLosExaltados.find((e) => e.id === item.exaltadoId);
        return (
          <li key={item.exaltadoId}>
            <Link
              href={`/directorio/${item.exaltadoId}`}
              className="group grid grid-cols-[5rem_1fr] gap-x-4 gap-y-3 rounded-lg border border-gray-200 p-4 hover:border-pabellon-gold-300 hover:shadow-pabellon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pabellon-green-700 motion-safe:transition sm:grid-cols-[7rem_1fr]"
            >
              {/* Foto a la izquierda; en teléfono la semblanza baja a todo el ancho. */}
              <div className="relative aspect-[4/5] w-20 self-start overflow-hidden rounded-md bg-pabellon-green-50 sm:row-span-2 sm:w-28">
                {exaltado?.foto && (
                  <Image
                    src={exaltado.foto}
                    alt={`Foto de ${nombreCompletoExaltado(exaltado)}`}
                    fill
                    className="object-cover"
                    style={{
                      objectPosition: exaltado.fotoFoco ?? FOCO_FOTO_POR_DEFECTO,
                    }}
                    sizes="(max-width: 640px) 80px, 112px"
                  />
                )}
              </div>
              <div className="min-w-0 self-center sm:self-start">
                <h3 className="font-serif text-xl leading-snug text-pabellon-green-800">
                  {item.nombre}
                </h3>
                <p className="mt-1.5">
                  <span className="inline-block rounded-full bg-pabellon-gold-100 px-2.5 py-0.5 font-sans text-xs font-medium leading-5 text-pabellon-gold-800">
                    {item.disciplina}
                  </span>
                </p>
              </div>
              <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
                <p className="font-sans text-base leading-relaxed text-gray-700">
                  {item.semblanza}
                </p>
                <p className="mt-2 font-sans text-sm font-medium text-pabellon-green-700 group-hover:text-pabellon-green-800">
                  Ver perfil <span aria-hidden="true">→</span>
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function FotoDelCuerpo({ bloque }: { bloque: BloqueImagen }) {
  const galeria = getGaleria(bloque.galeriaId);
  const foto = galeria.fotos.find((f) => f.id === bloque.fotoId);
  if (!foto) return null;

  return (
    <figure className="my-8">
      <Image
        src={foto.src}
        alt={foto.alt}
        width={foto.width}
        height={foto.height}
        className="h-auto w-full rounded-lg"
        sizes="(max-width: 768px) 100vw, 720px"
      />
      {(bloque.pie || galeria.credito) && (
        <figcaption className="mt-2 font-sans text-sm italic text-gray-500">
          {bloque.pie}
          {bloque.pie && galeria.credito && " · "}
          {galeria.credito && `Foto: ${galeria.credito}`}
        </figcaption>
      )}
    </figure>
  );
}

function ListaConIntroduccion({ bloque }: { bloque: BloqueLista }) {
  return (
    <div className="my-8 rounded-lg border border-pabellon-green-100 bg-pabellon-green-50 p-6">
      <p className="font-serif italic text-gray-800">{bloque.introduccion}</p>
      <ul className="mt-4 grid gap-x-6 gap-y-2 font-sans text-base text-gray-800 sm:grid-cols-2">
        {bloque.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {bloque.enlace && (
        <p className="mt-5">
          <Link
            href={bloque.enlace.href}
            className="font-sans text-base font-medium text-pabellon-green-700 underline underline-offset-4 hover:text-pabellon-green-800"
          >
            {bloque.enlace.texto} <span aria-hidden="true">→</span>
          </Link>
        </p>
      )}
    </div>
  );
}

interface CuerpoNoticiaProps {
  bloques: readonly BloqueNoticia[];
}

export function CuerpoNoticia({ bloques }: CuerpoNoticiaProps) {
  const primerParrafo = bloques.findIndex((b) => b.tipo === "parrafo");

  return (
    <div className="font-serif text-lg leading-8 text-gray-800">
      {bloques.map((bloque, indice) => {
        switch (bloque.tipo) {
          case "parrafo":
            return (
              <p
                key={indice}
                className={
                  indice === primerParrafo
                    ? "mb-5 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:leading-none first-letter:text-pabellon-gold-600"
                    : "mb-5"
                }
              >
                {bloque.texto}
              </p>
            );
          case "subtitulo":
            return (
              <div key={indice} className="mb-4 mt-10 clear-both">
                <Raya className="mb-3" />
                <h2 className="font-serif text-2xl text-pabellon-green-800">
                  {bloque.texto}
                </h2>
              </div>
            );
          case "cita":
            return (
              <figure key={indice} className="my-10">
                <blockquote className="border-l-4 border-pabellon-gold-400 pl-6 font-serif text-2xl italic leading-snug text-pabellon-green-800">
                  <p>{bloque.texto}</p>
                </blockquote>
              </figure>
            );
          case "imagen":
            return <FotoDelCuerpo key={indice} bloque={bloque} />;
          case "exaltados":
            return <TarjetasExaltados key={indice} bloque={bloque} />;
          case "lista":
            return <ListaConIntroduccion key={indice} bloque={bloque} />;
          case "cierre":
            return (
              <div key={indice} className="mt-10 text-center">
                <span
                  aria-hidden="true"
                  className="mx-auto block h-px w-24 bg-pabellon-gold-400"
                />
                <p className="my-5 font-serif text-2xl font-bold text-pabellon-gold-600">
                  {bloque.texto}
                </p>
                <span
                  aria-hidden="true"
                  className="mx-auto block h-px w-24 bg-pabellon-gold-400"
                />
              </div>
            );
        }
      })}
    </div>
  );
}
