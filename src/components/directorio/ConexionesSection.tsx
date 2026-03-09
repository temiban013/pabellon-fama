import Link from "next/link";
import type { ConexionDeportiva } from "@/lib/types/contribucion";

interface ConexionesSectionProps {
  conexiones?: ConexionDeportiva[];
}

const TIPO_LABELS: Record<ConexionDeportiva["tipo"], string> = {
  contemporaneo: "Contemporáneo",
  mentor: "Mentor",
  discipulo: "Discípulo",
  companero: "Compañero",
  familiar: "Familiar",
  rival: "Rival",
};

const TIPO_COLORS: Record<ConexionDeportiva["tipo"], string> = {
  contemporaneo: "bg-blue-100 text-blue-800",
  mentor: "bg-purple-100 text-purple-800",
  discipulo: "bg-green-100 text-green-800",
  companero: "bg-pabellon-gold-100 text-pabellon-gold-800",
  familiar: "bg-pink-100 text-pink-800",
  rival: "bg-red-100 text-red-800",
};

export function ConexionesSection({ conexiones }: ConexionesSectionProps) {
  if (!conexiones || conexiones.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🤝</span>
        Conexiones Deportivas
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {conexiones.map((conexion, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-md p-3 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${TIPO_COLORS[conexion.tipo]}`}
              >
                {TIPO_LABELS[conexion.tipo]}
              </span>
            </div>
            <p className="font-semibold text-sm sm:text-base text-gray-800">
              {conexion.exaltadoId ? (
                <Link
                  href={`/directorio/${conexion.exaltadoId}`}
                  className="text-pabellon-green-700 hover:text-pabellon-green-900 underline"
                >
                  {conexion.nombre}
                </Link>
              ) : (
                conexion.nombre
              )}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {conexion.descripcion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
