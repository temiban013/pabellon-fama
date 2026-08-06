import Image from "next/image";
import { visitas } from "@/data/visitas";
import { YouTubeEmbed } from "@/components/shared/YouTubeEmbed";

export function VisitasDistinguidas() {
  if (visitas.length === 0) return null;

  return (
    <section id="visitas" className="scroll-mt-6 py-16 bg-gradient-to-br from-pabellon-gold-50 via-white to-pabellon-brown-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-pabellon-green-800 mb-4">
            Visitas Distinguidas
          </h2>
          <p className="text-xl text-pabellon-green-700 max-w-2xl mx-auto">
            Figuras del deporte que nos han honrado con su visita
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-brown-600 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-8">
          {visitas.map((visita) => (
            <article
              key={visita.id}
              className="card-pabellon overflow-hidden lg:flex lg:items-center"
            >
              <div className="p-4 pb-0 lg:shrink-0 lg:p-6 lg:pr-0 lg:pb-6">
                <div
                  className="relative mx-auto w-[300px] max-w-full overflow-hidden rounded-lg lg:w-80"
                  style={{
                    aspectRatio: `${visita.imageWidth} / ${visita.imageHeight}`,
                  }}
                >
                  <Image
                    src={visita.src}
                    alt={visita.alt}
                    fill
                    sizes="(max-width: 1024px) 300px, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block self-start px-3 py-1 bg-pabellon-gold-100 text-pabellon-gold-800 rounded-full text-sm font-semibold mb-6">
                  {visita.fecha}
                </span>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {visita.caption}
                </p>
                {visita.youtubeId && (
                  <YouTubeEmbed
                    youtubeId={visita.youtubeId}
                    title={`Entrevista — visita del ${visita.fecha}`}
                    className="mx-auto mt-6 max-w-sm"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
