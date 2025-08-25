import exaltadosData from './exaltados.json';

interface ExaltadoRaw {
  id: string;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  deporte: string[];
  categoria: string;
  anoExaltacion: number;
  exaltacion?: string;
  anoNacimiento?: number;
  lugarNacimiento?: string;
  biografia: string;
  logros: string[];
  reconocimientos: string[];
  foto?: string;
  galeria?: string[];
  estado: 'activo' | 'fallecido';
  fechaNacimiento?: string | null;
  fechaFallecimiento?: string | null;
  apodo?: string | null;
}

interface ExaltadoWithSlug extends ExaltadoRaw {
  slug: string;
  name: string;
  sport: string;
  yearInducted: number;
  biography: string;
  photo?: string;
  achievements?: string[];
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function flattenExaltadosData(): ExaltadoWithSlug[] {
  const exaltados: ExaltadoWithSlug[] = [];

  Object.entries(exaltadosData).forEach(([deporte, categorias]) => {
    if (deporte === 'estadisticas') return;

    if (categorias && typeof categorias === 'object' && !Array.isArray(categorias)) {
      Object.entries(categorias).forEach(([, personas]) => {
        if (Array.isArray(personas)) {
          personas.forEach((persona: ExaltadoRaw) => {
            exaltados.push({
              ...persona,
              slug: createSlug(persona.nombreCompleto || persona.nombre),
              name: persona.nombreCompleto || persona.nombre,
              sport: persona.deporte.join(', '),
              yearInducted: persona.anoExaltacion,
              biography: persona.biografia,
              photo: persona.foto,
              achievements: persona.logros || [],
            });
          });
        }
      });
    }
  });

  return exaltados;
}

export const exaltados = flattenExaltadosData();