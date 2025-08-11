// components/forms/RegistroFormClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRegistro } from "@/hooks/useRegistro";
import { useToastHelpers } from "@/components/ui/Toast";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface RegistroFormClientProps {
  isExpanded?: boolean;
  onSuccess?: () => void;
  className?: string;
}

export default function RegistroFormClient({
  isExpanded = false,
  onSuccess,
  className = "",
}: RegistroFormClientProps) {
  const {
    formData,
    formState,
    validationErrors,
    updateField,
    submitForm,
    resetForm,
  } = useRegistro();

  const { success, error: showError } = useToastHelpers();
  const [showFullForm, setShowFullForm] = useState(isExpanded);
  const [isMounted, setIsMounted] = useState(false);

  // Asegurar que el componente solo renderice del lado del cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Efecto para manejar éxito y errores con toast
  useEffect(() => {
    if (formState.isSuccess && isMounted) {
      success(
        "¡Registro Exitoso!",
        "Gracias por tu interés. Te mantendremos informado sobre nuestras actividades.",
        { duration: 6000 }
      );
      resetForm();
      setShowFullForm(false);
      if (onSuccess) onSuccess();
    }
  }, [formState.isSuccess, success, resetForm, onSuccess, isMounted]);

  useEffect(() => {
    if (formState.error && isMounted) {
      showError("Error en el registro", formState.error, {
        persistent: false,
        duration: 8000,
      });
    }
  }, [formState.error, showError, isMounted]);

  const handleEmailSubmit = async () => {
    if (!isExpanded && formData.email) {
      setShowFullForm(true);
      return;
    }
    await submitForm();
  };

  // Componente de campo de entrada reutilizable
  const InputField = ({
    type = "text",
    field,
    label,
    placeholder,
    required = false,
  }: {
    type?: string;
    field: keyof typeof formData;
    label: string;
    placeholder: string;
    required?: boolean;
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] || ""}
        onChange={(e) => updateField(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all ${
          validationErrors[field]
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        disabled={formState.isLoading}
      />
      {validationErrors[field] && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ExclamationCircleIcon className="w-4 h-4" />
          {validationErrors[field]}
        </p>
      )}
    </div>
  );

  // No renderizar nada hasta que esté montado del lado del cliente
  if (!isMounted) {
    return (
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 border-4 border-pabellon-gold-300 ${className}`}
      >
        <div className="text-center mb-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>

        <div className="space-y-4 animate-pulse">
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>

          <div className="h-12 bg-gray-200 rounded"></div>

          <div className="text-xs text-center">
            <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl p-8 border-4 border-pabellon-gold-300 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-pabellon-green-800 mb-2">
          COMUNÍCATE CON NOSOTROS
        </h3>
        <p className="text-gray-600">
          {showFullForm
            ? "Completa tu registro para mantenerte informado"
            : "Mantente informado sobre nuestras actividades y eventos"}
        </p>
      </div>

      {/* Formulario básico - Solo email */}
      {!showFullForm && (
        <div className="space-y-4">
          <InputField
            type="email"
            field="email"
            label="Correo Electrónico"
            placeholder="tu@email.com"
            required
          />

          <button
            onClick={handleEmailSubmit}
            disabled={formState.isLoading || !formData.email}
            className="w-full bg-gradient-to-r from-pabellon-green-700 to-pabellon-green-800 hover:from-pabellon-green-800 hover:to-pabellon-green-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
          >
            {formState.isLoading ? "Procesando..." : "Regístrate aquí"}
          </button>
        </div>
      )}

      {/* Formulario expandido */}
      {showFullForm && (
        <div className="space-y-4">
          <InputField
            type="email"
            field="email"
            label="Correo Electrónico"
            placeholder="tu@email.com"
            required
          />

          <InputField
            field="nombre"
            label="Nombre Completo"
            placeholder="Tu nombre completo"
            required
          />

          <InputField
            type="tel"
            field="telefono"
            label="Teléfono"
            placeholder="787-123-4567"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Interés <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.interes}
              onChange={(e) =>
                updateField(
                  "interes",
                  e.target.value as
                    | "visitante"
                    | "voluntario"
                    | "investigador"
                    | "general"
                )
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all ${
                validationErrors.interes
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              disabled={formState.isLoading}
            >
              <option value="general">Interés General</option>
              <option value="visitante">Visitante del Museo</option>
              <option value="investigador">Investigador/Estudiante</option>
              <option value="voluntario">Voluntario</option>
            </select>
            {validationErrors.interes && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon className="w-4 h-4" />
                {validationErrors.interes}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Mensaje (Opcional)
            </label>
            <textarea
              value={formData.mensaje || ""}
              onChange={(e) => updateField("mensaje", e.target.value)}
              placeholder="¿Hay algo específico en lo que estás interesado?"
              rows={3}
              maxLength={500}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all resize-none ${
                validationErrors.mensaje
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              disabled={formState.isLoading}
            />
            <div className="text-xs text-gray-500 text-right">
              {(formData.mensaje || "").length}/500 caracteres
            </div>
            {validationErrors.mensaje && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <ExclamationCircleIcon className="w-4 h-4" />
                {validationErrors.mensaje}
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFullForm(false)}
              disabled={formState.isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Volver
            </button>
            <button
              onClick={handleEmailSubmit}
              disabled={
                formState.isLoading || !formData.email || !formData.nombre
              }
              className="flex-2 bg-gradient-to-r from-pabellon-green-700 to-pabellon-green-800 hover:from-pabellon-green-800 hover:to-pabellon-green-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
            >
              {formState.isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
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
                  Registrando...
                </span>
              ) : (
                "Completar Registro"
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Respetamos tu privacidad. No compartimos tu información con
            terceros.
          </p>
        </div>
      )}
    </div>
  );
}
