/**
 * Client-side image compression using the native Canvas API.
 * Reduces phone photos (3-8 MB) to ~200-500 KB to fit within Vercel's 4.5 MB body limit.
 * No external libraries required.
 */

export const MAX_DIMENSION = 1920;
export const JPEG_QUALITY = 0.85;
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB per file (after compression)
export const MAX_TOTAL_SIZE = 4 * 1024 * 1024; // 4 MB total for all files
export const MAX_FILES = 5;
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_TYPES)[number];

export function validateFileType(file: File): boolean {
  return (ALLOWED_TYPES as readonly string[]).includes(file.type);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compress an image file using createImageBitmap + Canvas API.
 * Uses createImageBitmap() instead of Image() for better compatibility
 * with motion photos (Google Pixel .MP.jpg) and other edge-case formats.
 * - Resizes to max 1920px on the longest side
 * - Outputs as JPEG at 85% quality
 * - Returns the original file if it's a PDF or if compressed is larger
 */
export async function compressImage(file: File): Promise<File> {
  // PDFs pass through unchanged
  if (!isImageFile(file)) {
    return file;
  }

  try {
    // createImageBitmap handles motion photos and other formats
    // that the Image() constructor chokes on
    const bitmap = await createImageBitmap(file);

    let { width, height } = bitmap;

    // Calculate new dimensions if exceeding max
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );

    if (!blob) {
      return file;
    }

    // If compressed is larger than original, return original
    if (blob.size >= file.size) {
      return file;
    }

    // Build new filename with .jpg extension
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch {
    // Fallback: if createImageBitmap also fails, return original
    return file;
  }
}
