import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { generateMetadata as genMeta } from "@/lib/seo";
import { getExaltadoById } from "@/data/exaltados-all";
import ContribucionForm from "@/components/contribucion/ContribucionForm";

interface PageProps {
  params: Promise<{ exaltadoId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exaltadoId } = await params;
  const exaltado = getExaltadoById(exaltadoId);

  if (!exaltado) {
    return genMeta({
      title: "Exaltado No Encontrado",
      description: "El exaltado solicitado no fue encontrado.",
      noIndex: true,
    });
  }

  const nombreCompleto = exaltado.apodo
    ? `${exaltado.nombre} "${exaltado.apodo}" ${exaltado.apellidos}`
    : `${exaltado.nombre} ${exaltado.apellidos}`;
  return genMeta({
    title: `Contribuir Información - ${nombreCompleto}`,
    description: `Comparte estadísticas, datos biográficos y anécdotas sobre ${nombreCompleto}, exaltado al Pabellón de la Fama del Deporte Humacaeño.`,
    keywords: ["contribuir", "información", nombreCompleto],
  });
}

export default async function ContribuirExaltadoPage({ params }: PageProps) {
  const { exaltadoId } = await params;
  const exaltado = getExaltadoById(exaltadoId);

  if (!exaltado) {
    notFound();
  }

  const nombreCompleto = exaltado.apodo
    ? `${exaltado.nombre} "${exaltado.apodo}" ${exaltado.apellidos}`
    : `${exaltado.nombre} ${exaltado.apellidos}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Green gradient header — matches /directorio/[exaltadoId] */}
      <div className="bg-gradient-to-r from-pabellon-green-800 to-pabellon-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/directorio/${exaltadoId}`} className="inline-flex items-center text-green-200 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Exaltado
          </Link>
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Contribuir Información</h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl">
            Comparte datos, estadísticas o anécdotas sobre
          </p>
          <p className="text-xl font-semibold text-white">
            {nombreCompleto}
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ContribucionForm exaltadoId={exaltadoId} exaltadoNombre={nombreCompleto} />
      </div>
    </main>
  );
}
