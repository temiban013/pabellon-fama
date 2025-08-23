// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function para combinar clases de Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Función para formatear fecha en español
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Puerto_Rico",
  };

  return dateObj.toLocaleDateString("es-PR", { ...defaultOptions, ...options });
}

/**
 * Función para formatear teléfono
 */
export function formatPhone(phone: string): string {
  // Remover todos los caracteres no numéricos
  const numbers = phone.replace(/\D/g, "");

  // Formatear para Puerto Rico (787/939)
  if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }

  if (numbers.length === 11 && numbers.startsWith("1")) {
    return `+1-${numbers.slice(1, 4)}-${numbers.slice(4, 7)}-${numbers.slice(
      7
    )}`;
  }

  return phone; // Devolver original si no se puede formatear
}

/**
 * Función para validar email básico
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Función para escapar HTML
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Función para truncar texto
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Función para generar slug/URL amigable
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-"); // Múltiples guiones a uno solo
}

/**
 * Función para delay/sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Función para capitalizar primera letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Función para capitalizar cada palabra
 */
export function titleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Función para obtener iniciales de un nombre
 * Maneja apodos en paréntesis y nombres del medio apropiadamente
 */
export function getInitials(name: string): string {
  // Remove content in parentheses (nicknames) and quotes
  const cleanName = name
    .replace(/\([^)]*\)/g, '') // Remove (nickname)
    .replace(/["'"]/g, '') // Remove quotes
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // Split into words and filter out empty strings and single letters (middle initials)
  const words = cleanName
    .split(' ')
    .filter(word => word.length > 0)
    .filter(word => {
      // Keep words that are not just single letters (unless they're the only words)
      return word.length > 1 || cleanName.split(' ').filter(w => w.length > 0).length <= 2;
    });
  
  if (words.length === 0) {
    return "??"; // Fallback
  } else if (words.length === 1) {
    // Single word: take first letter twice for consistency
    const initial = words[0].charAt(0).toUpperCase();
    return initial + initial;
  } else {
    // Multiple words: take first letter of first and last word
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
}

/**
 * Función para generar color basado en string (para avatars)
 */
export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Función para debounce
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Función para throttle
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Constantes específicas del Pabellón
 */
export const PABELLON_CONSTANTS = {
  FOUNDED_YEAR: 1996,
  LOCATION: "Humacao, Puerto Rico",
  MUSEUM_NAME: "Manuel Rivera Guevara",
  EMAIL_DOMAIN: "pabellon.org",
  PHONE_AREA_CODES: ["787", "939"],
  SPORTS_CATEGORIES: [
    "Atletismo",
    "Baloncesto",
    "Béisbol",
    "Boxeo",
    "Ciclismo",
    "Fútbol",
    "Gimnasia",
    "Golf",
    "Natación",
    "Tenis",
    "Voleibol",
    "Otros",
  ],
  SOCIAL_LINKS: {
    youtube: "https://youtube.com/@pabellondelafamahumacao",
    blog: "https://pabellondelafamahumacao.blogspot.com/",
    biblioteca: "https://biblioteca.pabellon.org",
  },
} as const;

/**
 * Función para validar año de exaltación
 */
export function isValidExaltationYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= PABELLON_CONSTANTS.FOUNDED_YEAR && year <= currentYear;
}

/**
 * Función para obtener años disponibles para exaltación
 */
export function getAvailableYears(): number[] {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (
    let year = PABELLON_CONSTANTS.FOUNDED_YEAR;
    year <= currentYear;
    year++
  ) {
    years.push(year);
  }

  return years.reverse(); // Más recientes primero
}
