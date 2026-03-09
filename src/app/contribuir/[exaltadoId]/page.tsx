import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as genMeta } from "@/lib/seo";
import { getExaltadoById } from "@/data/exaltados-all";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs
          variant="dark"
          items={[
            { label: "Directorio", href: "/directorio" },
            { label: nombreCompleto, href: `/directorio/${exaltadoId}` },
            { label: "Contribuir" },
          ]}
        />

        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-pabellon-green-800 mb-3">
            Contribuir Información
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comparte datos, estadísticas o anécdotas sobre
          </p>
          <p className="text-lg font-semibold text-pabellon-green-700">
            {nombreCompleto}
          </p>
        </div>

        <ContribucionForm exaltadoId={exaltadoId} exaltadoNombre={nombreCompleto} />
      </div>
    </main>
  );
}
