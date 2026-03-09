import Link from "next/link";

interface ContribucionCTAProps {
  exaltadoId: string;
  nombreExaltado: string;
}

export function ContribucionCTA({ exaltadoId, nombreExaltado }: ContribucionCTAProps) {
  return (
    <div className="bg-gradient-to-r from-pabellon-gold-50 to-pabellon-green-50 border border-pabellon-gold-300 rounded-lg p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-2 flex items-center gap-2">
        <span className="text-xl">📝</span>
        ¿Conoces más sobre {nombreExaltado}?
      </h3>
      <p className="text-sm sm:text-base text-gray-700 mb-4">
        Ayúdanos a preservar el legado deportivo humacaeño. Si tienes estadísticas,
        datos personales o anécdotas sobre este exaltado, compártelos con nosotros.
      </p>
      <Link
        href={`/contribuir/${exaltadoId}`}
        className="inline-block bg-pabellon-green-700 hover:bg-pabellon-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
      >
        Compartir información
      </Link>
      <p className="text-xs text-gray-500 mt-3">
        Tu información será revisada por la Junta de Directores antes de ser publicada.
      </p>
    </div>
  );
}
