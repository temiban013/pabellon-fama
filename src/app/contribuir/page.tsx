import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { generateMetadata as genMeta, seoConfigs } from "@/lib/seo";
import ContribucionForm from "@/components/contribucion/ContribucionForm";

export const metadata: Metadata = genMeta(seoConfigs.contribuir);

export default function ContribuirPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Blue gradient header — matches historia, junta, etc. */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Link>
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Contribuir Información</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            Ayúdanos a preservar y enriquecer el legado deportivo humacaeño.
            Comparte estadísticas, datos biográficos o anécdotas sobre nuestros exaltados.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ContribucionForm />
      </div>
    </main>
  );
}
