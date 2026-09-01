/**
 * Embed de YouTube con dominio de privacidad (youtube-nocookie) y carga lazy.
 * Extraído de VisitasDistinguidas (PF-054) para reutilizarse en visitas,
 * noticias y perfiles de exaltados.
 *
 * PF-058: bajo el video se muestra la divulgación de uso de IA cuando el video tiene
 * crédito registrado en `creditos-ia.ts`. Como museo, noticias y perfiles renderizan
 * por aquí, declarar el crédito una vez cubre las tres superficies.
 */

import Link from "next/link";
import { getResumenCreditoIA } from "@/data/creditos-ia";

interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
  /** Clases adicionales de layout (márgenes, max-width) sobre el contenedor */
  className?: string;
}

export function YouTubeEmbed({
  youtubeId,
  title,
  className,
}: YouTubeEmbedProps) {
  const resumenIA = getResumenCreditoIA(youtubeId);

  // El className del llamante va en el <figure>, no en la caja de proporción: si
  // fuera al mismo div que `aspect-video`, el texto del crédito entraría dentro de
  // la razón de aspecto y la rompería.
  return (
    <figure className={className}>
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {resumenIA && (
        <figcaption className="mt-2 text-sm leading-relaxed text-gray-600">
          Este video usa {resumenIA} creados con inteligencia artificial. Las
          fotografías y el testimonio son auténticos.{" "}
          <Link
            href="/como-se-hace"
            className="font-medium text-pabellon-green-800 underline underline-offset-2 hover:text-pabellon-green-900"
          >
            Cómo se hace
          </Link>
        </figcaption>
      )}
    </figure>
  );
}
