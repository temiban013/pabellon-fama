/**
 * Embed de YouTube con dominio de privacidad (youtube-nocookie) y carga lazy.
 * Extraído de VisitasDistinguidas (PF-054) para reutilizarse en visitas,
 * noticias y perfiles de exaltados.
 */

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
  return (
    <div
      className={`aspect-video w-full overflow-hidden rounded-lg${
        className ? ` ${className}` : ""
      }`}
    >
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
  );
}
