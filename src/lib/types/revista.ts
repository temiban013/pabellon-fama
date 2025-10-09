/**
 * Types para el sistema de extracción y distribución de contenido de revistas PFDH
 * Sprint 0 - Foundation
 */

export interface RevistaMetadata {
  numero: number;
  year: number;
  titulo: string;
  fechaCeremonia: string; // YYYY-MM-DD
  descripcion: string;
  pdfUrl: string;
  portadaUrl: string;
  totalPaginas: number;
  exaltadosCount: number;
  categorias: {
    deportistas: number;
    propulsores: number;
    postumos: number;
    comunicadores?: number;
  };
  rangoPaginas: {
    biografias: [number, number];
    fotosHistoricas: [number, number];
    mensajes?: [number, number];
  };
}

export interface ExaltadoRevista {
  id: string;
  nombre: string;
  apodo?: string;
  apellidos: string;
  categoria: 'ATLETA' | 'PROPULSOR' | 'DIRIGENTE' | 'COMUNICADOR' | 'PÓSTUMO' | 'EQUIPO';
  deportes: string[];
  anoExaltacion: number;
  revistaNumero: number;
  paginaInicio: number;
  paginaFin: number;
  contenido: {
    biografia: string;
    logros: string[];
    estadisticas?: Record<string, string | number | boolean>;
    reconocimientos?: string[];
    fotos?: string[];
    citas?: string[];
  };
}

export interface FotoHistorica {
  id: string;
  titulo: string;
  descripcion?: string;
  año?: number;
  categoria: 'equipo' | 'evento' | 'persona' | 'instalacion' | 'ceremonia';
  revistaOrigen: number;
  paginaOrigen: number;
  personasEnFoto?: string[];
  deporteRelacionado?: string;
  archivoUrl: string;
}

export interface MensajeOficial {
  tipo: 'presidente' | 'alcalde' | 'honor' | 'dedicatoria';
  autor: {
    nombre: string;
    cargo: string;
  };
  año: number;
  revistaNumero: number;
  contenido: string;
  citas?: string[];
}

export interface HistoriaPabellon {
  revistaNumero: number;
  seccion: 'historia' | 'origen' | 'mision' | 'vision';
  contenido: string;
  añoReferenciado?: number;
  fotosRelacionadas?: string[];
}

export interface JuntaDirectiva {
  año: number;
  revistaNumero: number;
  miembros: Array<{
    nombre: string;
    cargo: string;
    periodo?: string;
  }>;
}

export interface CuadroHonor {
  año: number;
  categoria: string;
  equipoNombre?: string;
  logro: string;
  deporteRelacionado: string;
  integrantes?: string[];
  revistaNumero: number;
  paginaOrigen: number;
}

export interface CeremoniaMetadata {
  exaltacionNumero: number;
  fecha: string; // YYYY-MM-DD
  lugar?: string;
  maestroCeremonia?: string;
  invocacion?: string;
  programaCompleto?: {
    bienvenida: string;
    himnos: string;
    mensajes: string[];
    develacionSerigrafias: string[];
    interludios: string[];
  };
  asistentesClave?: string[];
}

export interface ArticuloDeportivo {
  titulo: string;
  autor?: string;
  tipo: 'reseña' | 'opinion' | 'homenaje' | 'historia';
  contenido: string;
  deporteRelacionado?: string;
  añoReferenciado?: number;
  revistaNumero: number;
}
