/**
 * Agregado de todos los exaltados de todas las revistas
 * Se irá poblando con cada sprint
 */

import { ExaltadoRevista } from '@/lib/types/revista';
import { rev01Exaltados } from './revistas/rev01/exaltados';
import { rev02Exaltados } from './revistas/rev02/exaltados';
import { rev03Exaltados } from './revistas/rev03/exaltados';
import { rev04Exaltados } from './revistas/rev04/exaltados';
import { rev05Exaltados } from './revistas/rev05/exaltados';
import { rev06Exaltados } from './revistas/rev06/exaltados';
import { rev07Exaltados } from './revistas/rev07/exaltados';
// ... etc

export const todosLosExaltados: ExaltadoRevista[] = [
  ...rev01Exaltados,  // Sprint 1 - 23 exaltados
  ...rev02Exaltados,  // Sprint 2 - 8 exaltados
  ...rev03Exaltados,  // Sprint 3 - 7 exaltados
  ...rev04Exaltados,  // Sprint 4 - 9 exaltados
  ...rev05Exaltados,  // Sprint 5 - 9 exaltados
  ...rev06Exaltados,  // Sprint 6 - 7 exaltados
  ...rev07Exaltados,  // Sprint 7 - 10 exaltados
  // ...rev08Exaltados,  // Sprint 8
];

/**
 * Busca un exaltado por ID
 */
export function getExaltadoById(id: string): ExaltadoRevista | undefined {
  return todosLosExaltados.find(e => e.id === id);
}

/**
 * Obtiene exaltados de una revista específica
 */
export function getExaltadosPorRevista(numero: number): ExaltadoRevista[] {
  return todosLosExaltados.filter(e => e.revistaNumero === numero);
}

/**
 * Obtiene exaltados por deporte
 */
export function getExaltadosPorDeporte(deporte: string): ExaltadoRevista[] {
  return todosLosExaltados.filter(e =>
    e.deportes.some(d => d.toLowerCase() === deporte.toLowerCase())
  );
}

/**
 * Obtiene exaltados por categoría
 */
export function getExaltadosPorCategoria(
  categoria: ExaltadoRevista['categoria']
): ExaltadoRevista[] {
  return todosLosExaltados.filter(e => e.categoria === categoria);
}

/**
 * Obtiene exaltados por año de exaltación
 */
export function getExaltadosPorAno(ano: number): ExaltadoRevista[] {
  return todosLosExaltados.filter(e => e.anoExaltacion === ano);
}

/**
 * Obtiene todos los deportes únicos
 */
export function getTodosLosDeportes(): string[] {
  const deportes = new Set<string>();
  todosLosExaltados.forEach(e => {
    e.deportes.forEach(d => deportes.add(d));
  });
  return Array.from(deportes).sort();
}

/**
 * Obtiene estadísticas generales
 */
export function getEstadisticasGenerales() {
  return {
    totalExaltados: todosLosExaltados.length,
    porCategoria: {
      atletas: todosLosExaltados.filter(e => e.categoria === 'ATLETA').length,
      propulsores: todosLosExaltados.filter(e => e.categoria === 'PROPULSOR').length,
      dirigentes: todosLosExaltados.filter(e => e.categoria === 'DIRIGENTE').length,
      comunicadores: todosLosExaltados.filter(e => e.categoria === 'COMUNICADOR').length,
      postumos: todosLosExaltados.filter(e => e.categoria === 'PÓSTUMO').length,
    },
    deportes: getTodosLosDeportes(),
    añosActivos: Array.from(
      new Set(todosLosExaltados.map(e => e.anoExaltacion))
    ).sort(),
  };
}
