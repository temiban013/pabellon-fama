import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { todosLosExaltados } from "@/data/exaltados-all";
import { DirectorioGrid } from "@/components/directorio/DirectorioGrid";
import { type Exaltado } from "@/lib/types";
import {
  deporteDeSegmento,
  deportesDelDirectorio,
} from "@/lib/directorio/deportes";

interface DeportePageProps {
  params: Promise<{
    deporte: string;
  }>;
}

export async function generateMetadata({
  params,
}: DeportePageProps): Promise<Metadata> {
  const { deporte } = await params;
  const pagina = deporteDeSegmento(deporte);

  if (!pagina) {
    return generateSEOMetadata({
      title: "Deporte no encontrado",
      description: "El deporte solicitado no tiene exaltados en el directorio.",
      noIndex: true,
    });
  }

  return generateSEOMetadata({
    title: `${pagina.nombre} - Exaltados del Pabellón`,
    description: `Conoce a los ${pagina.exaltados.length} exaltados del deporte ${pagina.nombre} en el Pabellón de la Fama del Deporte Humacaeño.`,
    keywords: [pagina.nombre, "atletas", "exaltados", "Humacao"],
    // Canónica sin acentos, la misma de sitemap.xml.
    url: `/directorio/deporte/${pagina.slug}`,
  });
}

// Una página por deporte individual; quien tiene varios sale en cada una.
export function generateStaticParams() {
  return deportesDelDirectorio().map(({ slug }) => ({ deporte: slug }));
}

export default async function DeportePage({ params }: DeportePageProps) {
  const { deporte } = await params;
  const pagina = deporteDeSegmento(deporte);

  if (!pagina) {
    notFound();
  }

  const deporteDecoded = pagina.nombre;
  const atletasDelDeporte = pagina.exaltados;

  // Transform the data to match Exaltado type
  const exaltadosTransformed: Exaltado[] = atletasDelDeporte.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    apellidos: e.apellidos,
    nombreCompleto: e.nombreCompleto,
    deporte: e.deporte,
    categoria: (e.categoria || "atleta") as Exaltado["categoria"],
    anoExaltacion: e.anoExaltacion,
    exaltacion: e.exaltacion,
    anoNacimiento: e.anoNacimiento,
    lugarNacimiento: e.lugarNacimiento,
    biografia: e.biografia,
    logros: e.logros,
    reconocimientos: e.reconocimientos,
    foto: e.foto,
    fotoFoco: todosLosExaltados.find((r) => r.id === e.id)?.fotoFoco,
    galeria: e.galeria,
    estado: e.estado,
    fechaNacimiento: e.fechaNacimiento,
    fechaFallecimiento: e.fechaFallecimiento,
    apodo: e.apodo,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Exaltados de {deporteDecoded}
          </h1>
          <p className="text-xl text-blue-100">
            {atletasDelDeporte.length === 1
              ? "1 exaltado en esta disciplina"
              : `${atletasDelDeporte.length} exaltados en esta disciplina`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectorioGrid exaltados={exaltadosTransformed} />
      </div>
    </div>
  );
}
