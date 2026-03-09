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
import {
  compressImage,
  validateFileType,
  isImageFile,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  MAX_FILES,
} from "@/lib/utils/image-compression";

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
  const [archivos, setArchivos] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
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

  const addArchivos = useCallback(
    async (newFiles: File[]) => {
      // Clear previous file errors
      setValidationErrors((prev) => ({ ...prev, archivos: undefined }));

      // Check total count
      if (archivos.length + newFiles.length > MAX_FILES) {
        setValidationErrors((prev) => ({
          ...prev,
          archivos: `Máximo ${MAX_FILES} archivos permitidos`,
        }));
        return;
      }

      // Validate types
      for (const file of newFiles) {
        if (!validateFileType(file)) {
          setValidationErrors((prev) => ({
            ...prev,
            archivos: `Tipo de archivo no permitido: ${file.name}. Solo JPEG, PNG, WebP y PDF.`,
          }));
          return;
        }
      }

      // Compress images
      setIsCompressing(true);
      try {
        const processed: File[] = [];
        for (const file of newFiles) {
          if (isImageFile(file)) {
            const compressed = await compressImage(file);
            if (compressed.size > MAX_FILE_SIZE) {
              setValidationErrors((prev) => ({
                ...prev,
                archivos: `La imagen ${file.name} excede 2 MB incluso después de la compresión`,
              }));
              setIsCompressing(false);
              return;
            }
            processed.push(compressed);
          } else {
            // PDF — check raw size
            if (file.size > MAX_FILE_SIZE) {
              setValidationErrors((prev) => ({
                ...prev,
                archivos: `El archivo PDF ${file.name} excede 2 MB`,
              }));
              setIsCompressing(false);
              return;
            }
            processed.push(file);
          }
        }

        // Check total size
        const currentTotal = archivos.reduce((sum, f) => sum + f.size, 0);
        const newTotal =
          currentTotal + processed.reduce((sum, f) => sum + f.size, 0);
        if (newTotal > MAX_TOTAL_SIZE) {
          setValidationErrors((prev) => ({
            ...prev,
            archivos: "Los archivos exceden el límite total de 4 MB",
          }));
          setIsCompressing(false);
          return;
        }

        setArchivos((prev) => [...prev, ...processed]);
      } catch (err) {
        setValidationErrors((prev) => ({
          ...prev,
          archivos:
            err instanceof Error
              ? err.message
              : "Error al procesar los archivos",
        }));
      } finally {
        setIsCompressing(false);
      }
    },
    [archivos]
  );

  const removeArchivo = useCallback((index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
    setValidationErrors((prev) => ({ ...prev, archivos: undefined }));
  }, []);

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
      // Build FormData with JSON form data + file attachments
      const body = new FormData();
      body.append("datos", JSON.stringify(formData));
      archivos.forEach((archivo) => {
        body.append("archivos", archivo, archivo.name);
      });

      const response = await fetch("/api/contribucion", {
        method: "POST",
        body,
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
  }, [formData, archivos, validateForm]);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData(props));
    setFormState(initialFormState);
    setValidationErrors({});
    setArchivos([]);
    setIsCompressing(false);

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
    archivos,
    addArchivos,
    removeArchivo,
    isCompressing,
  };
}
