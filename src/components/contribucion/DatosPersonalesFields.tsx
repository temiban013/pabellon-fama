// components/contribucion/DatosPersonalesFields.tsx
"use client";

import type { DatosPersonalesContribuidos } from "@/lib/types/contribucion";

interface DatosPersonalesFieldsProps {
  datos: DatosPersonalesContribuidos | undefined;
  onUpdate: (field: keyof DatosPersonalesContribuidos, value: string) => void;
}

const fields: {
  field: keyof DatosPersonalesContribuidos;
  label: string;
  placeholder: string;
}[] = [
  {
    field: "fechaNacimiento",
    label: "Fecha de Nacimiento",
    placeholder: "Ej: 15 de marzo de 1950",
  },
  {
    field: "lugarNacimiento",
    label: "Lugar de Nacimiento",
    placeholder: "Ej: Barrio Mariana, Humacao",
  },
  {
    field: "estatura",
    label: "Estatura",
    placeholder: "Ej: 5'11\"",
  },
  {
    field: "peso",
    label: "Peso (en años activos)",
    placeholder: "Ej: 185 lbs",
  },
  {
    field: "fechaFallecimiento",
    label: "Fecha de Fallecimiento",
    placeholder: "Ej: 10 de enero de 2020",
  },
  {
    field: "escuelas",
    label: "Escuelas/Universidades",
    placeholder: "Ej: Escuela Antonia Sáez, UPR Humacao",
  },
  {
    field: "inicioDeporte",
    label: "Inicio en el Deporte",
    placeholder: "Ej: Comenzó a jugar béisbol a los 12 años en la liga infantil...",
  },
];

export default function DatosPersonalesFields({
  datos,
  onUpdate,
}: DatosPersonalesFieldsProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700">
        Datos Personales / Biográficos
      </h4>
      <p className="text-xs text-gray-500">
        Complete solo los campos de los que tenga información. Todos son
        opcionales.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ field, label, placeholder }) => {
          const isLongField =
            field === "escuelas" || field === "inicioDeporte";
          return (
            <div
              key={field}
              className={`space-y-1 ${isLongField ? "sm:col-span-2" : ""}`}
            >
              <label className="block text-xs font-medium text-gray-600">
                {label}
              </label>
              {isLongField ? (
                <textarea
                  value={datos?.[field] ?? ""}
                  onChange={(e) => onUpdate(field, e.target.value)}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={datos?.[field] ?? ""}
                  onChange={(e) => onUpdate(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
