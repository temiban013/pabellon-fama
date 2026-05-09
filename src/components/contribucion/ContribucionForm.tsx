// components/contribucion/ContribucionForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useContribucionForm } from "@/hooks/useContribucionForm";
import { useToastHelpers } from "@/components/ui/Toast";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type {
  TipoContribucion,
  RelacionContribuidor,
  ContribucionFormData,
} from "@/lib/types/contribucion";
import ExaltadoSelector from "./ExaltadoSelector";
import EstadisticasFields from "./EstadisticasFields";
import DatosPersonalesFields from "./DatosPersonalesFields";
import ArchivoUploadField from "./ArchivoUploadField";
import ContribucionExito from "./ContribucionExito";

interface ContribucionFormProps {
  exaltadoId?: string;
  exaltadoNombre?: string;
}

const TIPO_LABELS: Record<TipoContribucion, string> = {
  estadisticas: "Estadísticas Deportivas",
  "datos-personales": "Datos Personales/Biográficos",
  trayectoria: "Trayectoria/Carrera",
  reconocimientos: "Reconocimientos/Premios",
  conexiones: "Conexiones con otros Exaltados",
  correccion: "Corrección de Datos Existentes",
  otro: "Otra Información",
};

const RELACION_LABELS: Record<RelacionContribuidor, string> = {
  familiar: "Familiar",
  "companero-equipo": "Compañero de Equipo",
  entrenador: "Entrenador",
  periodista: "Periodista",
  aficionado: "Aficionado/Fanático",
  historiador: "Historiador/Investigador",
  otro: "Otro",
};

function InputField({
  type = "text",
  field,
  label,
  placeholder,
  required = false,
  value,
  error,
  disabled,
  onChange,
}: {
  type?: string;
  field: keyof ContribucionFormData;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (field: keyof ContribucionFormData, value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ExclamationCircleIcon className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContribucionForm({
  exaltadoId,
  exaltadoNombre,
}: ContribucionFormProps) {
  const {
    formData,
    formState,
    validationErrors,
    updateField,
    submitForm,
    resetForm,
    addEstadistica,
    removeEstadistica,
    updateEstadistica,
    updateDatosPersonales,
    archivos,
    addArchivos,
    removeArchivo,
    isCompressing,
  } = useContribucionForm({ exaltadoId, exaltadoNombre });

  const { success: showSuccess, error: showError } = useToastHelpers();
  const [isMounted, setIsMounted] = useState(false);
  const prevArchivosCountRef = useRef(0);

  useEffect(() => {
    // Mark client-mounted so toast effects below only fire post-hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Toast when files are successfully added
  useEffect(() => {
    if (!isMounted) return;
    const prev = prevArchivosCountRef.current;
    const curr = archivos.length;
    prevArchivosCountRef.current = curr;

    if (curr > prev) {
      const added = curr - prev;
      showSuccess(
        added === 1 ? "Archivo agregado" : `${added} archivos agregados`,
        "Los archivos se enviarán junto con tu contribución.",
        { duration: 3000 }
      );
    }
  }, [archivos.length, isMounted, showSuccess]);

  // Success toast removed — ContribucionExito component handles the success state

  useEffect(() => {
    if (formState.error && isMounted) {
      showError("Error en la contribución", formState.error, {
        persistent: false,
        duration: 8000,
      });
    }
  }, [formState.error, showError, isMounted]);

  // Scroll success message into view after the DOM swaps from form to success component
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (formState.isSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formState.isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pabellon-gold-300">
        <div className="text-center mb-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (formState.isSuccess) {
    return (
      <div ref={successRef} className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pabellon-green-300">
        <ContribucionExito onReset={resetForm} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pabellon-gold-300">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-pabellon-green-800 mb-2">
          Formulario de Contribución
        </h3>
        <p className="text-gray-600">
          Completa los campos a continuación para compartir lo que sabes sobre nuestros exaltados.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Exaltado Selection */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-pabellon-green-800 border-b border-pabellon-gold-300 pb-2 w-full">
            1. Exaltado
          </legend>
          {exaltadoId ? (
            <div className="px-4 py-3 bg-pabellon-green-50 border border-pabellon-green-300 rounded-lg">
              <span className="font-medium text-pabellon-green-800">
                {exaltadoNombre}
              </span>
            </div>
          ) : (
            <ExaltadoSelector
              value={formData.exaltadoId}
              onChange={(id, nombre) => {
                updateField("exaltadoId", id);
                updateField("exaltadoNombre", nombre);
              }}
            />
          )}
          {validationErrors.exaltadoId && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <ExclamationCircleIcon className="w-4 h-4" />
              {validationErrors.exaltadoId}
            </p>
          )}
        </fieldset>

        {/* Section 2: Contributor Info */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-pabellon-green-800 border-b border-pabellon-gold-300 pb-2 w-full">
            2. Tu Información
          </legend>

          <InputField
            field="contribuidorNombre"
            label="Nombre Completo"
            placeholder="Tu nombre completo"
            required
            value={(formData.contribuidorNombre as string) ?? ""}
            error={validationErrors.contribuidorNombre}
            disabled={formState.isLoading}
            onChange={updateField}
          />

          <InputField
            type="email"
            field="contribuidorEmail"
            label="Correo Electrónico"
            placeholder="tu@email.com"
            required
            value={(formData.contribuidorEmail as string) ?? ""}
            error={validationErrors.contribuidorEmail}
            disabled={formState.isLoading}
            onChange={updateField}
          />

          <InputField
            type="tel"
            field="contribuidorTelefono"
            label="Teléfono (Opcional)"
            placeholder="787-123-4567"
            value={(formData.contribuidorTelefono as string) ?? ""}
            error={validationErrors.contribuidorTelefono}
            disabled={formState.isLoading}
            onChange={updateField}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Relación con el Exaltado <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.relacionConExaltado}
              onChange={(e) =>
                updateField(
                  "relacionConExaltado",
                  e.target.value as RelacionContribuidor
                )
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all ${
                validationErrors.relacionConExaltado
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              disabled={formState.isLoading}
            >
              {(
                Object.entries(RELACION_LABELS) as [
                  RelacionContribuidor,
                  string,
                ][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {validationErrors.relacionConExaltado && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon className="w-4 h-4" />
                {validationErrors.relacionConExaltado}
              </p>
            )}
          </div>

          <InputField
            field="relacionDetalle"
            label="Detalle de la Relación (Opcional)"
            placeholder="Ej: Soy su nieto, Fui su compañero en los Criollos..."
            value={(formData.relacionDetalle as string) ?? ""}
            error={validationErrors.relacionDetalle}
            disabled={formState.isLoading}
            onChange={updateField}
          />
        </fieldset>

        {/* Section 3: Contribution Type */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-pabellon-green-800 border-b border-pabellon-gold-300 pb-2 w-full">
            3. Tipo de Contribución
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              Object.entries(TIPO_LABELS) as [TipoContribucion, string][]
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  formData.tipoContribucion === value
                    ? "border-pabellon-gold-500 bg-pabellon-gold-50 ring-2 ring-pabellon-gold-300"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="tipoContribucion"
                  value={value}
                  checked={formData.tipoContribucion === value}
                  onChange={(e) =>
                    updateField(
                      "tipoContribucion",
                      e.target.value as TipoContribucion
                    )
                  }
                  className="text-pabellon-gold-600 focus:ring-pabellon-gold-500"
                  disabled={formState.isLoading}
                />
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Section 4: Dynamic Content */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-pabellon-green-800 border-b border-pabellon-gold-300 pb-2 w-full">
            4. Información
          </legend>

          {formData.tipoContribucion === "estadisticas" && (
            <EstadisticasFields
              estadisticas={formData.estadisticasEspecificas ?? []}
              onAdd={addEstadistica}
              onRemove={removeEstadistica}
              onUpdate={updateEstadistica}
            />
          )}

          {formData.tipoContribucion === "datos-personales" && (
            <DatosPersonalesFields
              datos={formData.datosPersonales}
              onUpdate={updateDatosPersonales}
            />
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Información Detallada <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.informacion}
              onChange={(e) => updateField("informacion", e.target.value)}
              placeholder="Describe la información que deseas contribuir con el mayor detalle posible..."
              rows={5}
              maxLength={2000}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all resize-none ${
                validationErrors.informacion
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              disabled={formState.isLoading}
            />
            <div className="flex justify-between">
              {validationErrors.informacion ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  {validationErrors.informacion}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-500">
                {formData.informacion.length}/2000 caracteres
              </span>
            </div>
          </div>
        </fieldset>

        {/* Section 5: Source */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-pabellon-green-800 border-b border-pabellon-gold-300 pb-2 w-full">
            5. Fuente de Información
          </legend>

          <InputField
            field="fuenteInformacion"
            label="¿De dónde proviene esta información?"
            placeholder="Ej: Recuerdos personales, archivo del periódico, álbum familiar..."
            required
            value={(formData.fuenteInformacion as string) ?? ""}
            error={validationErrors.fuenteInformacion}
            disabled={formState.isLoading}
            onChange={updateField}
          />

          <ArchivoUploadField
            archivos={archivos}
            onAdd={addArchivos}
            onRemove={removeArchivo}
            disabled={formState.isLoading}
            error={validationErrors.archivos}
            isCompressing={isCompressing}
          />
        </fieldset>

        {/* Honeypot - hidden from humans */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px" }}
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.honeypot ?? ""}
            onChange={(e) => updateField("honeypot", e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={formState.isLoading || isCompressing}
            className="w-full bg-gradient-to-r from-pabellon-green-700 to-pabellon-green-800 hover:from-pabellon-green-800 hover:to-pabellon-green-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {formState.isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                    fill="none"
                  />
                  <path
                    fill="currentColor"
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Enviando contribución...
              </span>
            ) : (
              "Enviar Contribución"
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Tu información será revisada por la Junta de Directores antes de ser
            publicada. Respetamos tu privacidad.
          </p>
        </div>
      </form>
    </div>
  );
}
