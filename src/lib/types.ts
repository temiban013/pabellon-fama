// ==================================================
// INTERFACES PRINCIPALES DEL PABELLÓN
// ==================================================

export interface Exaltado {
  id: string;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  deporte: string[];
  categoria: CategoriaExaltado;
  anoExaltacion: number;
  exaltacion?: string; // e.g., "1ra. Exaltación", "6ta. Exaltación"
  anoNacimiento?: number;
  lugarNacimiento?: string;
  biografia: string;
  logros: Logro[] | string[]; // Allow both structured objects and string arrays
  reconocimientos: Reconocimiento[] | string[]; // Allow both structured objects and string arrays
  foto?: string;
  galeria?: string[];
  estadisticas?: EstadisticaDeportiva[];
  estado: "activo" | "fallecido";
  // New biographical fields
  fechaNacimiento?: string | null;
  fechaFallecimiento?: string | null;
  apodo?: string | null;
  especialidad?: string;
  carreraEntrenador?: string;
  carreraCompetitiva?: Record<string, string>;
  carreraMLB?: Record<string, unknown>;
  carreraJugador?: string;
  carreraAdministrativa?: Record<string, string>;
  contribucion?: string;
  record?: string;
  campeonatos?: Record<string, string>;
  fechaCampeonato?: string;
  jugadoresClave?: string[];
  carreraInternacional?: string;
  equipos?: string[];
  carreraAcademica?: string;
  carreraOlimpica?: Record<string, string>;
  rolesPrincipales?: Record<string, string>;
  deportesPromovidos?: string[];
  familia?: string;
  logroPionero?: string;
  inicioProyecto?: string;
  carreraPeriodistica?: string;
  servicioPublico?: string;
  rolFundador?: string;
  rol?: string;
  posicion?: string;
  seleccionNacional?: string;
  clubes?: string[];
  cargosPrincipales?: Record<string, string>;
  participacionOlimpica?: string;
  victoriasInternacionales1968?: string[];
  estadisticasMLB?: Record<string, unknown>;
}

export type CategoriaExaltado =
  | "atleta"
  | "jugador"
  | "boxeador"
  | "entrenador"
  | "dirigente"
  | "promotor"
  | "propulsor"
  | "comentarista"
  | "cronista"
  | "arbitro"
  | "benefactor"
  | "equipo"
  | "atleta-propulsor"
  | "jugador-propulsor";

export interface Logro {
  id: string;
  titulo: string;
  descripcion: string;
  ano: number;
  nivel: "local" | "nacional" | "internacional" | "olimpico";
  competencia?: string;
  posicion?: string;
}

export interface Reconocimiento {
  id: string;
  titulo: string;
  otorgadoPor: string;
  fecha: Date;
  descripcion?: string;
  tipo: "premio" | "medalla" | "certificado" | "titulo" | "homenaje";
}

export interface EstadisticaDeportiva {
  temporada: string;
  estadistica: string;
  valor: string | number;
  unidad?: string;
}

// ==================================================
// JUNTA DE DIRECTORES
// ==================================================

export interface MiembroJunta {
  id: string;
  nombre: string;
  apellidos: string;
  cargo: CargoJunta;
  biografia: string;
  foto?: string;
  email?: string;
  telefono?: string;
  anoIngreso: number;
  contribuciones: string[];
  activo: boolean;
}

export type CargoJunta =
  | "presidente"
  | "vicepresidente"
  | "secretario"
  | "tesorero"
  | "vocal"
  | "director"
  | "asesor"
  | "fundador";

// ==================================================
// EVENTOS Y CALENDARIO
// ==================================================

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  tipo: TipoEvento;
  estado: EstadoEvento;
  organizador?: string;
  capacidadMaxima?: number;
  registrados?: number;
  requiresRegistro: boolean;
  costo?: number;
  imagen?: string;
}

export type TipoEvento =
  | "ceremonia-exaltacion"
  | "actividad-educativa"
  | "tour-museo"
  | "conferencia"
  | "reunion-junta"
  | "evento-especial"
  | "competencia"
  | "homenaje";

export type EstadoEvento =
  | "programado"
  | "confirmado"
  | "cancelado"
  | "completado"
  | "pospuesto";

// ==================================================
// MUSEO Y EXHIBICIONES
// ==================================================

export interface ExhibicionMuseo {
  id: string;
  titulo: string;
  descripcion: string;
  sala: string;
  artefactos: Artefacto[];
  fechaInicio: Date;
  fechaFin?: Date;
  curador?: string;
  esPermamente: boolean;
  imagen?: string;
  orden: number;
}

export interface Artefacto {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoArtefacto;
  donante?: string;
  fechaDonacion?: Date;
  valor?: number;
  estado: EstadoArtefacto;
  ubicacion: string;
  imagenes: string[];
  dimensiones?: {
    alto: number;
    ancho: number;
    profundidad?: number;
    unidad: "cm" | "in" | "m";
  };
}

export type TipoArtefacto =
  | "trofeo"
  | "medalla"
  | "uniforme"
  | "equipo-deportivo"
  | "fotografia"
  | "documento"
  | "placa"
  | "diploma"
  | "reliquia";

export type EstadoArtefacto =
  | "exhibido"
  | "almacenado"
  | "en-restauracion"
  | "prestado"
  | "perdido";

// ==================================================
// CONTENIDO Y ENLACES
// ==================================================

export interface EnlaceExterno {
  id: string;
  titulo: string;
  descripcion: string;
  url: string;
  tipo: TipoEnlace;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  icono?: string;
}

export type TipoEnlace =
  | "biblioteca"
  | "blog"
  | "youtube"
  | "red-social"
  | "documento"
  | "recurso-externo";

export interface EntradaBlog {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  autor: string;
  fechaPublicacion: Date;
  fechaActualizacion?: Date;
  categorias: string[];
  tags: string[];
  imagen?: string;
  publicado: boolean;
  slug: string;
}

// ==================================================
// CONFIGURACIÓN Y ADMINISTRACIÓN
// ==================================================

export interface ConfiguracionSitio {
  nombreOrganizacion: string;
  nombreMuseo: string;
  direccion: DireccionFisica;
  contacto: InformacionContacto;
  horarios: HorarioOperacion[];
  redesSociales: RedSocial[];
  configuracionSeo: ConfiguracionSeo;
}

export interface DireccionFisica {
  calle: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}

export interface InformacionContacto {
  telefono?: string;
  email: string;
  emailSecundario?: string;
  fax?: string;
  sitioWeb: string;
}

export interface HorarioOperacion {
  dia: DiaSemana;
  abierto: boolean;
  horaApertura?: string;
  horaCierre?: string;
  notas?: string;
}

export type DiaSemana =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

export interface RedSocial {
  plataforma: PlataformaRedSocial;
  url: string;
  activa: boolean;
  seguidores?: number;
}

export type PlataformaRedSocial =
  | "facebook"
  | "instagram"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "linkedin";

export interface ConfiguracionSeo {
  tituloSitio: string;
  descripcionSitio: string;
  palabrasClave: string[];
  imagenCompartir: string;
  autor: string;
}

// ==================================================
// UTILIDADES Y HELPERS
// ==================================================

export interface PaginationParams {
  pagina: number;
  limite: number;
  totalItems?: number;
  totalPaginas?: number;
}

export interface FiltrosDirectorio {
  deporte?: string[];
  categoria?: CategoriaExaltado[];
  anoDesde?: number;
  anoHasta?: number;
  busqueda?: string;
  ordenarPor?: "nombre" | "ano" | "deporte";
  direccion?: "asc" | "desc";
}

export interface EstadisticasSitio {
  totalExaltados: number;
  totalEventos: number;
  visitantesRegistrados: number;
  deportesRepresentados: number;
  anosOperacion: number;
}

// ==================================================
// TIPOS DE FORMULARIOS
// ==================================================

export interface FormularioRegistro {
  nombre: string;
  email: string;
  interes: string;
  telefono?: string;
  comentarios?: string;
}

export interface FormularioContacto {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  tipoConsulta:
    | "general"
    | "visita"
    | "donacion"
    | "investigacion"
    | "sugerencia";
}

// ==================================================
// HOOKS PERSONALIZADOS TYPES
// ==================================================

export interface UseSearchResult<T> {
  resultados: T[];
  cargando: boolean;
  error: string | null;
  buscar: (termino: string) => Promise<void>;
  limpiar: () => void;
}

export interface UsePaginationResult {
  paginaActual: number;
  totalPaginas: number;
  siguientePagina: () => void;
  paginaAnterior: () => void;
  irAPagina: (pagina: number) => void;
  puedeRetroceder: boolean;
  puedeAvanzar: boolean;
}

/// lib/types.ts
export interface RegistroUsuario {
  id?: string;
  email: string;
  nombre?: string;
  telefono?: string;
  interes: "visitante" | "voluntario" | "investigador" | "general";
  mensaje?: string;
  fechaRegistro?: Date;
  activo?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

// Estados del formulario de registro
export type RegistroFormData = Pick<
  RegistroUsuario,
  "email" | "nombre" | "telefono" | "interes" | "mensaje"
>;

// Respuesta del API de registro
export interface RegistroResponse extends ApiResponse {
  data?: {
    id: string;
    email: string;
    mensaje: string;
  };
}

// Tipos para los hooks personalizados
export interface UseRegistroReturn {
  formData: RegistroFormData;
  formState: FormState;
  validationErrors: ValidationErrors;
  updateField: (field: keyof RegistroFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

// Tipos para errores de validación
export interface ValidationErrors {
  email?: string;
  nombre?: string;
  telefono?: string;
  interes?: string;
  mensaje?: string;
}
