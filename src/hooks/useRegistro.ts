// hooks/useRegistro.ts
"use client";

import { useState, useCallback, useRef } from "react";
import {
  type RegistroFormData,
  type FormState,
  type UseRegistroReturn,
  type ValidationErrors,
} from "@/lib/types";
import { validateRegistro } from "@/lib/validations";

// Estado inicial del formulario
const initialFormData: RegistroFormData = {
  email: "",
  nombre: "",
  telefono: "",
  interes: "general",
  mensaje: "",
};

const initialFormState: FormState = {
  isLoading: false,
  isSuccess: false,
  error: null,
};

export function useRegistro(): UseRegistroReturn {
  const [formData, setFormData] = useState<RegistroFormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función para actualizar un campo específico
  const updateField = useCallback(
    (field: keyof RegistroFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Limpiar error de validación del campo específico
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      // Limpiar error general si existe
      if (formState.error) {
        setFormState((prev) => ({ ...prev, error: null }));
      }
    },
    [validationErrors, formState.error]
  );

  // Función para validar el formulario
  const validateForm = useCallback((): boolean => {
    const result = validateRegistro(formData);

    if (!result.success) {
      const errors: ValidationErrors = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof RegistroFormData;
        errors[field] = error.message;
      });

      setValidationErrors(errors);
      setFormState((prev) => ({
        ...prev,
        error: "Por favor corrige los errores en el formulario",
      }));
      return false;
    }

    setValidationErrors({});
    return true;
  }, [formData]);

  // Función para enviar el formulario
  const submitForm = useCallback(async (): Promise<void> => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Validar formulario primero
    if (!validateForm()) {
      return;
    }

    // Crear nuevo abort controller
    abortControllerRef.current = new AbortController();

    setFormState({
      isLoading: true,
      isSuccess: false,
      error: null,
    });

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      if (!data.success) {
        throw new Error(data.error || "Error en el registro");
      }

      // Éxito
      setFormState({
        isLoading: false,
        isSuccess: true,
        error: null,
      });
    } catch (error) {
      // Ignorar errores de cancelación
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error inesperado al procesar el registro";

      setFormState({
        isLoading: false,
        isSuccess: false,
        error: errorMessage,
      });

      console.error("Error en registro:", error);
    }
  }, [formData, validateForm]);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormState(initialFormState);
    setValidationErrors({});

    // Cancelar cualquier request en curso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    formData,
    formState,
    validationErrors,
    updateField,
    submitForm,
    resetForm,
  };
}

// Hook adicional para manejar el estado del modal/formulario expandido
export function useRegistroModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
