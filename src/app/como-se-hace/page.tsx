// src/app/como-se-hace/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Info } from "lucide-react";
import { generateMetadata, seoConfigs, generateBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  ...seoConfigs.comoSeHace,
  url: "https://pabellondelafama.com/como-se-hace",
});

/** Lo que sí se genera o asiste con IA. */
const categoriasIA = [
  {
    titulo: "Música de fondo",
    descripcion:
      "Las piezas instrumentales de nuestras entrevistas son originales y se generaron con inteligencia artificial para cada producción. No provienen de grabaciones existentes.",
  },
  {
    titulo: "Gráficos en pantalla",
    descripcion:
      "Las tarjetas de título, los rótulos con los nombres, las miniaturas y los gráficos de estadísticas se diseñaron con asistencia de inteligencia artificial. Los datos que muestran provienen de las revistas oficiales del Pabellón.",
  },
  {
    titulo: "Subtítulos",
    descripcion:
      "La transcripción inicial se hace con reconocimiento automático de voz y luego se revisa y corrige a mano, comparándola con la investigación de cada entrevista. Aun así puede quedar algún error, sobre todo en nombres propios y apodos.",
  },
  {
    titulo: "Investigación y edición",
    descripcion:
      "El trabajo de documentación y el montaje del video se apoyan en herramientas de inteligencia artificial. Toda afirmación histórica se verifica contra las revistas del Pabellón y la memoria de sus directivos antes de publicarse, y cada corte lo revisa y aprueba una persona.",
  },
];

/** Lo que no se altera. Esta sección es tan importante como la anterior. */
const loAutentico = [
  {
    titulo: "Fotografías",
    descripcion:
      "Provienen del archivo institucional del Pabellón y de las revistas oficiales. No se generan ni se alteran con inteligencia artificial.",
  },
  {
    titulo: "Testimonio y voz",
    descripcion:
      "Lo que dicen nuestros entrevistados es su grabación real, sin alterar. Nadie ha sido recreado, doblado ni sintetizado.",
  },
  {
    titulo: "Video de la entrevista",
    descripcion:
      "La imagen de las entrevistas es la grabación original. Los planos de detalle salen de esa misma toma, sin material añadido.",
  },
];

/**
 * Detalle por entrevista.
 *
 * Cada herramienta se nombra solo donde hay respaldo documental en el expediente de
 * producción; «Sí» a secas significa que la categoría aplica pero la herramienta no
 * consta por escrito. La entrevista a Keishla García no aparece con música porque la
 * suya no se generó con inteligencia artificial.
 */
const detallePorEntrevista = [
  {
    entrevista: "Ángel Luis «Pipá» Sierra Ruffat",
    fecha: "agosto 2026",
    musica: "Google Gemini (modelo Lyria)",
    graficos: "Claude Design",
    subtitulos: "Whisper, corregidos a mano",
  },
  {
    entrevista: "José Luis «Josie» Marrero Rodríguez",
    fecha: "agosto 2026",
    musica: "Google Gemini",
    graficos: "Sí",
    subtitulos: "Whisper, corregidos a mano",
  },
  {
    entrevista: "Rafael «Rafa» Ocasio",
    fecha: "julio 2026",
    musica: "Google Gemini (modelo Lyria)",
    graficos: "Claude Design",
    subtitulos: "Pendientes",
  },
  {
    entrevista: "Keishla Marie García Cruz",
    fecha: "julio 2026",
    musica: "No se usó música generada con IA",
    graficos: "Sí",
    subtitulos: "—",
  },
];

export default function ComoSeHacePage() {
  const breadcrumbs = generateBreadcrumbs([
    { name: "Inicio", url: "/" },
    { name: "Cómo se hace", url: "/como-se-hace" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-pabellon-green-900 to-pabellon-green-700 text-white py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center text-pabellon-green-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Link>

            <div className="flex items-center mb-4">
              <Info className="h-8 w-8 mr-3 shrink-0" />
              <h1 className="text-3xl sm:text-4xl font-bold">
                Cómo se hacen nuestras entrevistas
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-pabellon-green-100 max-w-3xl">
              Usamos herramientas de inteligencia artificial en la producción de
              nuestros videos. Lo decimos abiertamente porque el Pabellón es un
              archivo histórico: su valor depende de que se sepa con claridad qué
              es documento y qué es producción.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Lo generado con IA */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex items-center mb-6">
              <Sparkles className="h-7 w-7 text-pabellon-gold-600 mr-3 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Lo que se genera con inteligencia artificial
              </h2>
            </div>

            <dl className="space-y-6">
              {categoriasIA.map((item) => (
                <div key={item.titulo}>
                  <dt className="text-lg font-semibold text-gray-900">
                    {item.titulo}
                  </dt>
                  <dd className="mt-1 text-gray-700 leading-relaxed">
                    {item.descripcion}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Lo auténtico */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-8 border-l-4 border-pabellon-green-700">
            <div className="flex items-center mb-6">
              <ShieldCheck className="h-7 w-7 text-pabellon-green-700 mr-3 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Lo que no se altera
              </h2>
            </div>

            <dl className="space-y-6">
              {loAutentico.map((item) => (
                <div key={item.titulo}>
                  <dt className="text-lg font-semibold text-gray-900">
                    {item.titulo}
                  </dt>
                  <dd className="mt-1 text-gray-700 leading-relaxed">
                    {item.descripcion}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Detalle por entrevista */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Detalle por entrevista
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Nombramos la herramienta donde consta por escrito en nuestro
              expediente de producción.
            </p>

            {/* La tabla desborda en móvil: se desplaza dentro de su contenedor */}
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[42rem] text-sm text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-gray-900">
                    <th scope="col" className="py-3 pr-4 font-semibold">
                      Entrevista
                    </th>
                    <th scope="col" className="py-3 pr-4 font-semibold">
                      Música
                    </th>
                    <th scope="col" className="py-3 pr-4 font-semibold">
                      Gráficos
                    </th>
                    <th scope="col" className="py-3 font-semibold">
                      Subtítulos
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {detallePorEntrevista.map((fila) => (
                    <tr
                      key={fila.entrevista}
                      className="border-b border-gray-100 align-top"
                    >
                      <th
                        scope="row"
                        className="py-4 pr-4 font-medium text-gray-900"
                      >
                        {fila.entrevista}
                        <span className="block font-normal text-gray-500">
                          {fila.fecha}
                        </span>
                      </th>
                      <td className="py-4 pr-4">{fila.musica}</td>
                      <td className="py-4 pr-4">{fila.graficos}</td>
                      <td className="py-4">{fila.subtitulos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-sm text-gray-600 leading-relaxed">
              ¿Tienes alguna pregunta sobre cómo producimos nuestro contenido?
              Escríbenos desde la{" "}
              <Link
                href="/horario"
                className="font-medium text-pabellon-green-800 underline underline-offset-2 hover:text-pabellon-green-900"
              >
                página de contacto
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
