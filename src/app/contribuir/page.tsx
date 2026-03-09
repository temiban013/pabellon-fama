import { Metadata } from "next";
import { generateMetadata as genMeta, seoConfigs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import ContribucionForm from "@/components/contribucion/ContribucionForm";

export const metadata: Metadata = genMeta(seoConfigs.contribuir);

export default function ContribuirPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs
          variant="dark"
          items={[
            { label: "Contribuir Información" },
          ]}
        />

        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-pabellon-green-800 mb-3">
            Contribuir Información
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ayúdanos a preservar y enriquecer el legado deportivo humacaeño.
            Comparte estadísticas, datos biográficos o anécdotas sobre nuestros exaltados.
          </p>
        </div>

        <ContribucionForm />
      </div>
    </main>
  );
}
