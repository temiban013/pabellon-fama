/**
 * Timeline de ceremonias de exaltación
 * Se irá poblando con cada sprint
 */

import { CeremoniaMetadata } from '@/lib/types/revista';

export const ceremonias: CeremoniaMetadata[] = [
  // Sprint 1: Revista #01
  // {
  //   exaltacionNumero: 1,
  //   fecha: '2000-08-20',
  //   lugar: 'Humacao, Puerto Rico',
  //   // ... resto de metadata
  // },
  // Sprint 2-8: Revistas #02-08
  // ...
];

/**
 * Obtiene ceremonia por número
 */
export function getCeremoniaPorNumero(numero: number): CeremoniaMetadata | undefined {
  return ceremonias.find(c => c.exaltacionNumero === numero);
}

/**
 * Obtiene ceremonias por año
 */
export function getCeremoniasPorAno(ano: number): CeremoniaMetadata[] {
  return ceremonias.filter(c => new Date(c.fecha).getFullYear() === ano);
}

/**
 * Obtiene todas las ceremonias ordenadas por fecha
 */
export function getAllCeremoniasOrdenadas(): CeremoniaMetadata[] {
  return [...ceremonias].sort((a, b) =>
    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );
}
