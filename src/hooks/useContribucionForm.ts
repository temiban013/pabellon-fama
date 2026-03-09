// hooks/useContribucionForm.ts
"use client";

import { useState, useCallback, useRef } from "react";
import type {
  ContribucionFormData,
  TipoContribucion,
  EstadisticaContribuida,
  DatosPersonalesContribuidos,
  RelacionContribuidor,
} from "@/lib/types/contribucion";
import { validateContribucion } from "@/lib/validations/contribucion";

type ValidationErrors = Record<string, string | undefined>;

interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

interface UseContribucionFormProps {
  exaltadoId?: string;
  exaltadoNombre?: string;
}

const createInitialFormData = (
  props?: UseContribucionFormProps
): ContribucionFormData => ({
  exaltadoId: props?.exaltadoId ?? "",
  exaltadoNombre: props?.exaltadoNombre ?? "",
  contribuidorNombre: "",
  contribuidorEmail: "",
  contribuidorTelefono: "",
  relacionConExaltado: "aficionado" as RelacionContribuidor,
  relacionDetalle: "",
  tipoContribucion: "estadisticas" as TipoContribucion,
  informacion: "",
  estadisticasEspecificas: [],
  datosPersonales: undefined,
  fuenteInformacion: "",
  documentosSoporte: "",
  honeypot: "",
});

const initialFormState: FormState = {
  isLoading: false,
  isSuccess: false,
  error: null,
};

export function useContribucionForm(props?: UseContribucionFormProps) {
  const [formData, setFormData] = useState<ContribucionFormData>(
    createInitialFormData(props)
  );
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateField = useCallback(
    (field: keyof ContribucionFormData, value: unknown) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      if (formState.error) {
        setFormState((prev) => ({ ...prev, error: null }));
      }
    },
    [validationErrors, formState.error]
  );

  const addEstadistica = useCallback(() => {
    setFormData((prev) => {
      const current = prev.estadisticasEspecificas ?? [];
      if (current.length >= 20) return prev;
      const empty: EstadisticaContribuida = {
        categoria: "",
        dato: "",
        valor: "",
        temporadaOAno: "",
        equipo: "",
      };
      return {
        ...prev,
        estadisticasEspecificas: [...current, empty],
      };
    });
  }, []);

  const removeEstadistica = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      estadisticasEspecificas: (prev.estadisticasEspecificas ?? []).filter(
        (_, i) => i !== index
      ),
    }));
  }, []);

  const updateEstadistica = useCallback(
    (index: number, field: keyof EstadisticaContribuida, value: string) => {
      setFormData((prev) => {
        const updated = [...(prev.estadisticasEspecificas ?? [])];
        if (updated[index]) {
          updated[index] = { ...updated[index], [field]: value };
        }
        return { ...prev, estadisticasEspecificas: updated };
      });
    },
    []
  );

  const updateDatosPersonales = useCallback(
    (field: keyof DatosPersonalesContribuidos, value: string) => {
      setFormData((prev) => ({
        ...prev,
        datosPersonales: {
          ...prev.datosPersonales,
          [field]: value,
        },
      }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const result = validateContribucion(formData);

    if (!result.success) {
      const errors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
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

  const submitForm = useCallback(async (): Promise<void> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!validateForm()) {
      return;
    }

    abortControllerRef.current = new AbortController();

    setFormState({
      isLoading: true,
      isSuccess: false,
      error: null,
    });

    try {
      const response = await fetch("/api/contribucion", {
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
        throw new Error(data.error || "Error al enviar la contribución");
      }

      setFormState({
        isLoading: false,
        isSuccess: true,
        error: null,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error inesperado al procesar la contribución";

      setFormState({
        isLoading: false,
        isSuccess: false,
        error: errorMessage,
      });
    }
  }, [formData, validateForm]);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData(props));
    setFormState(initialFormState);
    setValidationErrors({});

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [props]);

  return {
    formData,
    formState,
    validationErrors,
    updateField,
    validateForm,
    submitForm,
    resetForm,
    addEstadistica,
    removeEstadistica,
    updateEstadistica,
    updateDatosPersonales,
  };
}
