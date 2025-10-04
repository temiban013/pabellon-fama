/**
 * Metadata de todas las revistas PFDH
 * Se irá poblando con cada sprint (Sprint 1-8)
 */

import { RevistaMetadata } from '@/lib/types/revista';

export const revistasMetadata: RevistaMetadata[] = [
  // Sprint 1: Revista #01 (2000) - 23 exaltados
  {
    numero: 1,
    year: 2000,
    titulo: 'Primera Exaltación del Pabellón',
    fechaCeremonia: '2000-08-20',
    descripcion: 'Ceremonia inaugural del Pabellón de la Fama del Deporte Humacaeño. Cuadro de Honor 2000.',
    pdfUrl: '/revistas/completas/revista-01.pdf',
    portadaUrl: '/revistas/portadas/rev01.jpg',
    totalPaginas: 52,
    exaltadosCount: 23,
    categorias: {
      deportistas: 10,
      propulsores: 8,
      postumos: 5
    },
    rangoPaginas: {
      biografias: [10, 32],
      fotosHistoricas: [33, 40]
    }
  }
  // ... Se agregarán en Sprints 2-8
];

export function getRevistaByNumero(numero: number): RevistaMetadata | undefined {
  return revistasMetadata.find(r => r.numero === numero);
}

export function getAllRevistas(): RevistaMetadata[] {
  return revistasMetadata;
}

export function getTotalExaltados(): number {
  return revistasMetadata.reduce((sum, r) => sum + r.exaltadosCount, 0);
}
