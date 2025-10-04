/**
 * Agregado de todas las fotos históricas de todas las revistas
 * Se irá poblando con cada sprint
 */

import { FotoHistorica } from '@/lib/types/revista';
// import { rev01Fotos } from '../revistas/rev01/fotos';
// import { rev02Fotos } from '../revistas/rev02/fotos';
// ... etc

export const todasLasFotosHistoricas: FotoHistorica[] = [
  // ...rev01Fotos,  // Sprint 1 (opcional)
  // ...rev02Fotos,  // Sprint 2 (opcional)
  // ...rev03Fotos,  // Sprint 3 (opcional)
  // ...rev04Fotos,  // Sprint 4 (opcional)
  // ...rev05Fotos,  // Sprint 5 (opcional)
  // ...rev06Fotos,  // Sprint 6 (opcional)
  // ...rev07Fotos,  // Sprint 7 (opcional)
  // ...rev08Fotos,  // Sprint 8 (opcional)
];

/**
 * Obtiene fotos por año
 */
export function getFotosPorAno(ano: number): FotoHistorica[] {
  return todasLasFotosHistoricas.filter(f => f.año === ano);
}

/**
 * Obtiene fotos por categoría
 */
export function getFotosPorCategoria(categoria: FotoHistorica['categoria']): FotoHistorica[] {
  return todasLasFotosHistoricas.filter(f => f.categoria === categoria);
}

/**
 * Obtiene fotos de una revista específica
 */
export function getFotosPorRevista(numero: number): FotoHistorica[] {
  return todasLasFotosHistoricas.filter(f => f.revistaOrigen === numero);
}

/**
 * Obtiene fotos por deporte
 */
export function getFotosPorDeporte(deporte: string): FotoHistorica[] {
  return todasLasFotosHistoricas.filter(f =>
    f.deporteRelacionado?.toLowerCase() === deporte.toLowerCase()
  );
}

/**
 * Obtiene fotos donde aparece un exaltado específico
 */
export function getFotosConExaltado(exaltadoId: string): FotoHistorica[] {
  return todasLasFotosHistoricas.filter(f =>
    f.personasEnFoto?.includes(exaltadoId)
  );
}
