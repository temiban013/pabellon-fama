/**
 * Types for the Community Contribution System
 * Feature: Enriquecimiento de Datos de Exaltados
 * Classification: [BILLABLE-NEW-FEATURE]
 */

// ============================================================
// CONTRIBUTION FORM TYPES
// ============================================================

/** Category of information being contributed */
export type TipoContribucion =
  | "estadisticas"      // Sport statistics
  | "datos-personales"  // Biographical data
  | "trayectoria"       // Career timeline
  | "reconocimientos"   // Awards and achievements
  | "conexiones"        // Relationships with other athletes
  | "correccion"        // Correction to existing data
  | "otro";             // Other/general info

/** Contributor's relationship to the exaltado */
export type RelacionContribuidor =
  | "familiar"          // Family member
  | "companero-equipo"  // Teammate
  | "entrenador"        // Coach
  | "periodista"        // Journalist
  | "aficionado"        // Fan/enthusiast
  | "historiador"       // Historian/researcher
  | "otro";             // Other

/** Main contribution submission interface */
export interface ContribucionFormData {
  // Exaltado reference
  exaltadoId: string;
  exaltadoNombre: string;        // Display name (for email readability)

  // Contributor info
  contribuidorNombre: string;
  contribuidorEmail: string;
  contribuidorTelefono?: string;
  relacionConExaltado: RelacionContribuidor;
  relacionDetalle?: string;       // "Soy su nieto", "Fui su compañero en..."

  // Contribution content
  tipoContribucion: TipoContribucion;
  informacion: string;            // Main free-text contribution (max 2000 chars)

  // Structured optional fields
  estadisticasEspecificas?: EstadisticaContribuida[];
  datosPersonales?: DatosPersonalesContribuidos;

  // Source and verification
  fuenteInformacion: string;      // "Recuerdos personales", "Archivo del periódico..."
  documentosSoporte?: string;     // Description of supporting docs they could provide

  // Anti-spam
  honeypot?: string;              // Hidden field — must be empty
}

/** Structured statistics contribution */
export interface EstadisticaContribuida {
  categoria: string;              // "Bateo", "Pitcheo", "Puntos por partido"
  dato: string;                   // "Promedio de bateo"
  valor: string;                  // ".325"
  temporadaOAno?: string;         // "1985" or "1983-1990"
  equipo?: string;                // "Criollos de Humacao"
}

/** Structured biographical data contribution */
export interface DatosPersonalesContribuidos {
  fechaNacimiento?: string;       // Free text: "15 de marzo de 1950"
  lugarNacimiento?: string;       // "Barrio Mariana, Humacao"
  estatura?: string;              // "5'11\""
  peso?: string;                  // "185 lbs"
  fechaFallecimiento?: string;    // Free text
  escuelas?: string;              // "Escuela Antonia Sáez, UPR Humacao"
  inicioDeporte?: string;         // "Comenzó a jugar béisbol a los 12 años..."
}

// ============================================================
// QUEUE / STORAGE TYPES (DEFERRED — not needed for email-only)
// ============================================================

/** Status of a contribution (for future persistent storage) */
export type EstadoContribucion =
  | "pendiente"     // Awaiting review
  | "aprobada"      // Approved, pending data update
  | "rechazada"     // Rejected (spam, inaccurate, etc.)
  | "integrada";    // Data has been merged into exaltado profile

// ============================================================
// API TYPES
// ============================================================

export interface ContribucionApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: string;
    exaltadoNombre: string;
  };
}

// ============================================================
// ENRICHMENT DISPLAY TYPES
// ============================================================

/** Extended content fields for enriched exaltado profiles */
export interface ContenidoEnriquecido {
  // Existing fields (unchanged)
  biografia: string;
  logros: string[];
  estadisticas?: Record<string, string | number | boolean>;
  reconocimientos?: string[];
  fotos?: string[];
  citas?: string[];

  // NEW: Sport-specific statistics (structured)
  estadisticasDeportivas?: EstadisticasDeportivasEnriquecidas;

  // NEW: Extended biographical data
  datosExtendidos?: DatosExtendidosExaltado;

  // NEW: Career timeline
  trayectoria?: TrayectoriaExaltado;

  // NEW: Connections to other exaltados
  conexiones?: ConexionDeportiva[];

  // NEW: Source attribution
  fuentesDatos?: FuenteDatos[];
}

/** Sport-specific statistics — union by sport type */
export interface EstadisticasDeportivasEnriquecidas {
  tipo: "beisbol" | "baloncesto" | "boxeo" | "atletismo" | "otro";
  datos: EstadisticasBeisbol | EstadisticasBaloncesto | EstadisticasBoxeo
       | EstadisticasAtletismo | EstadisticasGenerales;
}

export interface EstadisticasBeisbol {
  posiciones: string[];
  equipos: EquipoCarrera[];
  bateo?: {
    promedio?: string;
    jonrones?: number;
    carrerasImpulsadas?: number;
    hits?: number;
    anotadas?: number;
  };
  pitcheo?: {
    efectividad?: string;
    ganadasPerdidas?: string;
    ponches?: number;
    juegosCompletos?: number;
  };
  anosActivos?: string;           // "1975-1992"
  logrosDestacados?: string[];
}

export interface EstadisticasBaloncesto {
  posiciones: string[];
  equipos: EquipoCarrera[];
  promedioPuntos?: number;
  promedioRebotes?: number;
  promedioAsistencias?: number;
  torneosGanados?: string[];
  anosActivos?: string;
}

export interface EstadisticasBoxeo {
  categoriasPeso: string[];
  record?: string;                // "25-3-1"
  nocauts?: number;
  titulosGanados?: string[];
  peleasDestacadas?: string[];
  anosActivos?: string;
}

export interface EstadisticasAtletismo {
  especialidades: string[];
  recordsPersonales?: Record<string, string>;  // {"100m": "10.5s"}
  medallasOlimpicas?: string[];
  medallasCAC?: string[];         // Centroamericanos y del Caribe
  medallasPanamericanas?: string[];
  anosActivos?: string;
}

export interface EstadisticasGenerales {
  especialidad: string;
  logrosDestacados: string[];
  recordsPersonales?: Record<string, string>;
  anosActivos?: string;
}

export interface EquipoCarrera {
  nombre: string;
  anos: string;                   // "1978-1985"
  posicion?: string;
  logros?: string[];
}

/** Extended biographical data */
export interface DatosExtendidosExaltado {
  fechaNacimientoExacta?: string; // "15 de marzo de 1950"
  lugarNacimientoDetalle?: string; // "Barrio Mariana, Humacao"
  estatura?: string;
  pesoActivo?: string;            // During active years
  fechaFallecimiento?: string;
  lugarFallecimiento?: string;
  escuelas?: string[];
  inicioDeporte?: string;         // Story of how they started
  familia?: string;               // Family context relevant to sports
}

/** Career timeline entry */
export interface TrayectoriaExaltado {
  inicioCarrera?: string;
  eventosCarrera: EventoCarrera[];
  retiro?: string;
  posRetiro?: string;             // What they did after (coaching, etc.)
  legado?: string;
}

export interface EventoCarrera {
  ano: string;
  descripcion: string;
  tipo: "inicio" | "logro" | "equipo" | "titulo" | "retiro" | "otro";
}

/** Connection to another exaltado or figure */
export interface ConexionDeportiva {
  tipo: "contemporaneo" | "mentor" | "discipulo" | "companero" | "familiar" | "rival";
  nombre: string;
  exaltadoId?: string;            // If they're also an exaltado
  descripcion: string;
}

/** Data source attribution */
export interface FuenteDatos {
  tipo: "revista-pfdh" | "periodico" | "entrevista" | "familiar" | "documento-oficial" | "comunidad";
  descripcion: string;
  fecha?: string;
  contribuidoPor?: string;        // Optional: credit the contributor
}
