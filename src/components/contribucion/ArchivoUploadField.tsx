"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import {
  formatFileSize,
  MAX_TOTAL_SIZE,
  MAX_FILES,
} from "@/lib/utils/image-compression";

interface ArchivoUploadFieldProps {
  archivos: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  error?: string;
  isCompressing?: boolean;
}

export default function ArchivoUploadField({
  archivos,
  onAdd,
  onRemove,
  disabled = false,
  error,
  isCompressing = false,
}: ArchivoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const prevCountRef = useRef(archivos.length);

  const totalSize = archivos.reduce((sum, f) => sum + f.size, 0);
  const sizeRatio = totalSize / MAX_TOTAL_SIZE;
  const canAddMore = archivos.length < MAX_FILES;

  // Flash green border when files are successfully added.
  // setState-in-effect is intentional: this reacts to external prop changes
  // (archivos array) and triggers a UI animation flash. Equivalent
  // useSyncExternalStore would not improve clarity here.
  useEffect(() => {
    if (archivos.length > prevCountRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = archivos.length;
  }, [archivos.length]);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onAdd(Array.from(fileList));
      if (inputRef.current) inputRef.current.value = "";
    },
    [onAdd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || isCompressing) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, isCompressing, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isCompressing) setIsDragOver(true);
    },
    [disabled, isCompressing]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const sizeBarColor =
    sizeRatio > 0.875
      ? "bg-red-500"
      : sizeRatio > 0.75
        ? "bg-yellow-500"
        : "bg-pabellon-green-500";

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Documentos de Soporte (Opcional)
      </label>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && !isCompressing && canAddMore && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled && !isCompressing && canAddMore) inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center gap-2 px-6 py-6 border-2 border-dashed rounded-lg transition-all min-h-[100px] ${
          disabled || isCompressing || !canAddMore
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : isDragOver
              ? "border-pabellon-gold-500 bg-pabellon-gold-50 cursor-pointer"
              : justAdded
                ? "border-pabellon-green-500 bg-pabellon-green-50 cursor-pointer"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        {isCompressing ? (
          <>
            <svg className="animate-spin w-7 h-7 text-pabellon-gold-600" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm text-gray-600">Comprimiendo imágenes...</span>
          </>
        ) : justAdded ? (
          <>
            <CheckCircleIcon className="w-7 h-7 text-pabellon-green-600" />
            <span className="text-sm font-medium text-pabellon-green-700">
              {archivos.length === 1 ? "Archivo agregado" : "Archivos agregados"}
            </span>
            {canAddMore && (
              <span className="text-xs text-pabellon-green-600">
                Puedes agregar {MAX_FILES - archivos.length} más
              </span>
            )}
          </>
        ) : !canAddMore ? (
          <>
            <CheckCircleIcon className="w-7 h-7 text-gray-400" />
            <span className="text-sm text-gray-500">
              Máximo de {MAX_FILES} archivos alcanzado
            </span>
          </>
        ) : (
          <>
            <ArrowUpTrayIcon className="w-7 h-7 text-gray-400" />
            <span className="text-sm text-gray-600 text-center">
              {archivos.length > 0
                ? "Agregar más archivos"
                : "Arrastra archivos aquí o haz clic para seleccionar"}
            </span>
            <span className="text-xs text-gray-400">
              JPEG, PNG, WebP o PDF — Máximo {MAX_FILES} archivos, 2 MB cada uno
            </span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          multiple
          className="hidden"
          disabled={disabled || isCompressing || !canAddMore}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* File list */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          {archivos.map((archivo, index) => (
            <div
              key={`${archivo.name}-${archivo.size}-${index}`}
              className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-pabellon-green-200 animate-in"
            >
              {/* Thumbnail or icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                {archivo.type === "application/pdf" ? (
                  <DocumentIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <FilePreview file={archivo} />
                )}
              </div>

              {/* Filename + size */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {archivo.name}
                </p>
                <p className="text-xs text-pabellon-green-600 flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  Listo — {formatFileSize(archivo.size)}
                </p>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={disabled || isCompressing}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                aria-label={`Eliminar ${archivo.name}`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Total size bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{archivos.length} archivo{archivos.length !== 1 ? "s" : ""}</span>
              <span>{formatFileSize(totalSize)} / {formatFileSize(MAX_TOTAL_SIZE)}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${sizeBarColor}`}
                style={{ width: `${Math.min(sizeRatio * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Inline image preview using FileReader data URL (more reliable than blob URLs) */
function FilePreview({ file }: { file: File }) {
  const [src, setSrc] = useState<string>("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Reset preview state when a new File arrives, then load it via FileReader.
    // setState-in-effect here is appropriate: the file prop is an external input
    // and we must clear stale state synchronously before async read begins.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFailed(false);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSrc(reader.result);
      }
    };
    reader.onerror = () => setFailed(true);
    reader.readAsDataURL(file);
  }, [file]);

  if (failed || !src) {
    return (
      <span className="text-[10px] text-gray-400 text-center leading-tight">
        IMG
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
    />
  );
}
