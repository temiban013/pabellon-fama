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
  },

  // Sprint 2: Revista #02 (2002) - 8 exaltados
  {
    numero: 2,
    year: 2002,
    titulo: 'Segunda Exaltación del Pabellón',
    fechaCeremonia: '2002-08-17',
    descripcion: 'Segunda ceremonia de exaltación del Pabellón de la Fama del Deporte Humacaeño. Programa 2002.',
    pdfUrl: '/revistas/completas/revista-02.pdf',
    portadaUrl: '/revistas/portadas/rev02.jpg',
    totalPaginas: 43,
    exaltadosCount: 8,
    categorias: {
      deportistas: 4,
      propulsores: 2,
      postumos: 2
    },
    rangoPaginas: {
      biografias: [16, 23],
      fotosHistoricas: [31, 33]
    }
  },

  // Sprint 3: Revista #03 (2004) - 7 exaltados
  {
    numero: 3,
    year: 2004,
    titulo: 'Tercera Exaltación del Pabellón',
    fechaCeremonia: '2004-08-22',
    descripcion: 'Tercera ceremonia de exaltación del Pabellón de la Fama del Deporte Humacaeño. Cuadros de Honor 2000, 2002 y 2004.',
    pdfUrl: '/revistas/completas/revista-03.pdf',
    portadaUrl: '/revistas/portadas/rev03.jpg',
    totalPaginas: 40,
    exaltadosCount: 7,
    categorias: {
      deportistas: 6,
      propulsores: 1,
      postumos: 0
    },
    rangoPaginas: {
      biografias: [20, 26],
      fotosHistoricas: [34, 40]
    }
  }
  // ... Se agregarán en Sprints 4-8
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
