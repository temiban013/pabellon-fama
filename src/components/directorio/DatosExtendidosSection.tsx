import type { DatosExtendidosExaltado } from "@/lib/types/contribucion";

interface DatosExtendidosSectionProps {
  datosExtendidos?: DatosExtendidosExaltado;
}

export function DatosExtendidosSection({ datosExtendidos }: DatosExtendidosSectionProps) {
  if (!datosExtendidos) return null;

  const fields: { label: string; value: string | string[] | undefined }[] = [
    { label: "Fecha de Nacimiento", value: datosExtendidos.fechaNacimientoExacta },
    { label: "Lugar de Nacimiento", value: datosExtendidos.lugarNacimientoDetalle },
    { label: "Estatura", value: datosExtendidos.estatura },
    { label: "Peso (años activos)", value: datosExtendidos.pesoActivo },
    { label: "Fecha de Fallecimiento", value: datosExtendidos.fechaFallecimiento },
    { label: "Lugar de Fallecimiento", value: datosExtendidos.lugarFallecimiento },
    { label: "Educación", value: datosExtendidos.escuelas },
    { label: "Inicio en el Deporte", value: datosExtendidos.inicioDeporte },
    { label: "Familia", value: datosExtendidos.familia },
  ];

  const hasAnyField = fields.some((f) =>
    Array.isArray(f.value) ? f.value.length > 0 : f.value !== undefined
  );

  if (!hasAnyField) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
        <span className="text-xl">📋</span>
        Datos Personales
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((field) => {
          if (Array.isArray(field.value)) {
            if (field.value.length === 0) return null;
            return (
              <div key={field.label} className="bg-gray-50 rounded-md p-3 sm:col-span-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  {field.label}
                </p>
                <div className="flex flex-wrap gap-1">
                  {field.value.map((item, i) => (
                    <span
                      key={i}
                      className="bg-pabellon-green-100 text-pabellon-green-800 px-2 py-1 rounded text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          if (!field.value) return null;

          // Longer text fields get full width
          const isLongText =
            field.label === "Inicio en el Deporte" ||
            field.label === "Familia";

          return (
            <div
              key={field.label}
              className={`bg-gray-50 rounded-md p-3 ${isLongText ? "sm:col-span-2" : ""}`}
            >
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                {field.label}
              </p>
              <p className="text-sm sm:text-base text-gray-800">{field.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
