import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { exaltados } from "@/data/exaltados";
import { DirectorioGrid } from "@/components/directorio/DirectorioGrid";
import { type Exaltado } from "@/lib/types";

interface DeportePageProps {
  params: Promise<{
    deporte: string;
  }>;
}

export async function generateMetadata({
  params,
}: DeportePageProps): Promise<Metadata> {
  const { deporte } = await params;
  const deporteDecoded = decodeURIComponent(deporte).replace(/-/g, " ");
  const atletasDelDeporte = exaltados.filter(
    (e) => e.sport.toLowerCase() === deporteDecoded.toLowerCase()
  );

  return generateSEOMetadata({
    title: `${deporteDecoded} - Exaltados del Pabellón`,
    description: `Conoce a los ${atletasDelDeporte.length} exaltados del deporte ${deporteDecoded} en el Pabellón de la Fama del Deporte Humacaeño.`,
    keywords: [deporteDecoded, "atletas", "exaltados", "Humacao"],
    url: `/directorio/deporte/${deporte}`,
  });
}

export function generateStaticParams() {
  const deportes = Array.from(new Set(exaltados.map((e) => e.sport)));
  return deportes.map((deporte) => ({
    deporte: deporte.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function DeportePage({ params }: DeportePageProps) {
  const { deporte } = await params;
  const deporteDecoded = decodeURIComponent(deporte).replace(/-/g, " ");
  const atletasDelDeporte = exaltados.filter(
    (e) => e.sport.toLowerCase() === deporteDecoded.toLowerCase()
  );

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
            {atletasDelDeporte.length} atletas exaltados en esta disciplina
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectorioGrid exaltados={exaltadosTransformed} />
      </div>
    </div>
  );
}
