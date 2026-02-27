/**
 * Shared constants for Exaltados display
 * Extracted to prevent recreation on every render
 * Performance optimization - Sprint: Performance Audit
 */

// Mapeo para mostrar nombres más descriptivos de categorías
export const CATEGORIAS_LABELS: Record<string, string> = {
  atleta: "Atleta",
  jugador: "Jugador",
  boxeador: "Boxeador",
  propulsor: "Propulsor",
  cronista: "Cronista Deportivo",
  equipo: "Equipo",
  promotor: "Promotor",
  dirigente: "Dirigente",
  entrenador: "Entrenador",
  arbitro: "Árbitro",
  comentarista: "Comentarista",
  benefactor: "Benefactor",
  "atleta-propulsor": "Atleta-Propulsor",
  "jugador-propulsor": "Jugador-Propulsor",
  "jugador-dirigente": "Jugador-Dirigente",
};

// Colores por categoría - para badges y cards
export const CATEGORY_COLORS: Record<string, string> = {
  atleta: "bg-blue-100 text-blue-800",
  jugador: "bg-green-100 text-green-800",
  propulsor: "bg-purple-100 text-purple-800",
  entrenador: "bg-orange-100 text-orange-800",
  arbitro: "bg-yellow-100 text-yellow-800",
  cronista: "bg-indigo-100 text-indigo-800",
  equipo: "bg-red-100 text-red-800",
  boxeador: "bg-red-100 text-red-800",
  "atleta-propulsor": "bg-teal-100 text-teal-800",
  "jugador-propulsor": "bg-cyan-100 text-cyan-800",
  "jugador-dirigente": "bg-emerald-100 text-emerald-800",
};

// Colores con borde para detail view
export const CATEGORY_COLORS_WITH_BORDER: Record<string, string> = {
  atleta: "bg-blue-100 text-blue-800 border-blue-200",
  jugador: "bg-green-100 text-green-800 border-green-200",
  propulsor: "bg-purple-100 text-purple-800 border-purple-200",
  entrenador: "bg-orange-100 text-orange-800 border-orange-200",
  arbitro: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cronista: "bg-indigo-100 text-indigo-800 border-indigo-200",
  equipo: "bg-red-100 text-red-800 border-red-200",
  boxeador: "bg-red-100 text-red-800 border-red-200",
  "atleta-propulsor": "bg-teal-100 text-teal-800 border-teal-200",
  "jugador-propulsor": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "jugador-dirigente": "bg-emerald-100 text-emerald-800 border-emerald-200",
};

// Emojis por deporte
export const SPORT_EMOJIS: Record<string, string> = {
  Atletismo: "🏃",
  Béisbol: "⚾",
  Baloncesto: "🏀",
  Boxeo: "🥊",
  Fútbol: "⚽",
  Voleibol: "🏐",
  Natación: "🏊",
  Ciclismo: "🚴",
  Tenis: "🎾",
  Golf: "⛳",
  "Paso Fino": "🐎",
  "Levantamiento de pesas": "🏋️",
  "Lucha Olímpica": "🤼",
  "Artes Marciales": "🥋",
  Tiro: "🎯",
  Gallos: "🐓",
  "Deportes Varios": "🏆",
  "Cronista Deportivo": "📝",
};

// Helper functions
export const getCategoryColor = (categoria: string): string => {
  return CATEGORY_COLORS[categoria] || "bg-gray-100 text-gray-800";
};

export const getCategoryColorWithBorder = (categoria: string): string => {
  return (
    CATEGORY_COLORS_WITH_BORDER[categoria] ||
    "bg-gray-100 text-gray-800 border-gray-200"
  );
};

export const getSportEmoji = (deporte: string): string => {
  return SPORT_EMOJIS[deporte] || "🏆";
};

export const getCategoryLabel = (categoria: string): string => {
  return CATEGORIAS_LABELS[categoria] || categoria;
};
