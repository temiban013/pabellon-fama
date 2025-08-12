// src/components/forms/RegistroForm.tsx - VERSIÓN CORREGIDA
"use client";

import { useState, useEffect } from "react";
import { useRegistro } from "@/hooks/useRegistro";
import { useToastHelpers } from "@/components/ui/Toast";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface RegistroFormProps {
  isExpanded?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  className?: string;
}

// 🔧 SOLUCION: Mover InputField FUERA del componente principal
interface InputFieldProps {
  type?: string;
  field: string;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

function InputField({
  type = "text",
  field,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={field}
        name={field}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        disabled={disabled}
        autoComplete={
          field === "email"
            ? "email"
            : field === "nombre"
            ? "name"
            : field === "telefono"
            ? "tel"
            : "off"
        }
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

// 🔧 SOLUCION: SelectField también fuera del componente
interface SelectFieldProps {
  field: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
}

function SelectField({
  field,
  label,
  required = false,
  value,
  onChange,
  error,
  disabled = false,
  options,
}: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={field}
        name={field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ExclamationCircleIcon className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

interface TextareaFieldProps {
  field: string;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
}

function TextareaField({
  field,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  disabled = false,
  maxLength = 500,
  rows = 3,
}: TextareaFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={field}
        name={field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all resize-none ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        disabled={disabled}
      />
      <div className="flex justify-between items-center">
        {error ? (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            {error}
          </p>
        ) : (
          <div />
        )}
        <div className="text-xs text-gray-500">
          {value.length}/{maxLength} caracteres
        </div>
      </div>
    </div>
  );
}

export default function RegistroForm({
  isExpanded = false,
  onSuccess,
  onClose,
  className = "",
}: RegistroFormProps) {
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

  // Opciones para el select de interés
  const interesOptions = [
    { value: "general", label: "Interés General" },
    { value: "visitante", label: "Visitante del Museo" },
    { value: "investigador", label: "Investigador/Estudiante" },
    { value: "voluntario", label: "Voluntario" },
  ];

  // Efecto para manejar éxito y errores con toast
  useEffect(() => {
    if (formState.isSuccess) {
      success(
        "¡Registro Exitoso!",
        "Gracias por tu interés. Te mantendremos informado sobre nuestras actividades.",
        { duration: 6000 }
      );
      resetForm();
      setShowFullForm(false);
      if (onSuccess) onSuccess();
    }
  }, [formState.isSuccess, success, resetForm, onSuccess]);

  useEffect(() => {
    if (formState.error) {
      showError("Error en el registro", formState.error, {
        persistent: false,
        duration: 8000,
      });
    }
  }, [formState.error, showError]);

  const handleEmailSubmit = async () => {
    if (!showFullForm && formData.email) {
      setShowFullForm(true);
      return;
    }
    await submitForm();
  };

  const handleBackToBasic = () => {
    setShowFullForm(false);
    if (onClose) onClose();
  };

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
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            error={validationErrors.email}
            disabled={formState.isLoading}
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
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            error={validationErrors.email}
            disabled={formState.isLoading}
          />

          <InputField
            field="nombre"
            label="Nombre Completo"
            placeholder="Tu nombre completo"
            required
            value={formData.nombre || ""}
            onChange={(value) => updateField("nombre", value)}
            error={validationErrors.nombre}
            disabled={formState.isLoading}
          />

          <InputField
            type="tel"
            field="telefono"
            label="Teléfono"
            placeholder="787-123-4567"
            value={formData.telefono || ""}
            onChange={(value) => updateField("telefono", value)}
            error={validationErrors.telefono}
            disabled={formState.isLoading}
          />

          <SelectField
            field="interes"
            label="Tipo de Interés"
            required
            value={formData.interes}
            onChange={(value) => updateField("interes", value)}
            error={validationErrors.interes}
            disabled={formState.isLoading}
            options={interesOptions}
          />

          <TextareaField
            field="mensaje"
            label="Mensaje (Opcional)"
            placeholder="¿Hay algo específico en lo que estás interesado?"
            value={formData.mensaje || ""}
            onChange={(value) => updateField("mensaje", value)}
            error={validationErrors.mensaje}
            disabled={formState.isLoading}
            maxLength={500}
            rows={3}
          />

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={handleBackToBasic}
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

// Export named para compatibilidad
export { RegistroForm };
