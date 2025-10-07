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
  },

  // Sprint 4: Revista #04 (2006) - 9 exaltados
  {
    numero: 4,
    year: 2006,
    titulo: 'Cuarta Exaltación del Pabellón',
    fechaCeremonia: '2006-11-05',
    descripcion: 'Cuarta ceremonia de exaltación del Pabellón de la Fama del Deporte Humacaeño. Cuadro de Honor 2006 y exaltación especial al equipo Doble A de 1960.',
    pdfUrl: '/revistas/completas/revista-04.pdf',
    portadaUrl: '/revistas/portadas/rev04.jpg',
    totalPaginas: 36,
    exaltadosCount: 9,
    categorias: {
      deportistas: 7,
      propulsores: 1,
      postumos: 1
    },
    rangoPaginas: {
      biografias: [14, 25],
      fotosHistoricas: [23, 25]
    }
  },

  // Sprint 5: Revista #05 (2008) - 9 exaltados
  {
    numero: 5,
    year: 2008,
    titulo: 'Quinta Exaltación del Pabellón',
    fechaCeremonia: '2008-08-15',
    descripcion: 'Quinta ceremonia de exaltación del Pabellón de la Fama del Deporte Humacaeño. Cuadro de Honor 2008 y cuadros históricos de honor 2000, 2002, 2004 y 2006.',
    pdfUrl: '/revistas/completas/revista-05.pdf',
    portadaUrl: '/revistas/portadas/rev05.jpg',
    totalPaginas: 36,
    exaltadosCount: 9,
    categorias: {
      deportistas: 7,
      propulsores: 2,
      postumos: 0
    },
    rangoPaginas: {
      biografias: [13, 21],
      fotosHistoricas: [28, 36]
    }
  },

  // Sprint 6: Revista #06 (2010) - 7 exaltados
  {
    numero: 6,
    year: 2010,
    titulo: 'Sexta Exaltación del Pabellón',
    fechaCeremonia: '2010-11-14',
    descripcion: 'Sexta ceremonia de exaltación del Pabellón de la Fama del Deporte Humacaeño. Cuadro de Honor 2010 y cuadros históricos de honor.',
    pdfUrl: '/revistas/completas/revista-06.pdf',
    portadaUrl: '/revistas/portadas/rev06.jpg',
    totalPaginas: 36,
    exaltadosCount: 7,
    categorias: {
      deportistas: 4,
      propulsores: 2,
      postumos: 1
    },
    rangoPaginas: {
      biografias: [10, 16],
      fotosHistoricas: [23, 36]
    }
  },

  // Sprint 7: Revista #07 (2012) - 10 exaltados
  {
    numero: 7,
    year: 2012,
    titulo: 'Séptima Exaltación del Pabellón',
    fechaCeremonia: '2012-11-18',
    descripcion: 'Séptima ceremonia de exaltación del Pabellón de la Fama del Deporte Humacaeño. Cuadro de Honor 2012 con homenaje al centenario de Emilio Huyke.',
    pdfUrl: '/revistas/completas/revista-07.pdf',
    portadaUrl: '/revistas/portadas/rev07.jpg',
    totalPaginas: 36,
    exaltadosCount: 10,
    categorias: {
      deportistas: 7,
      propulsores: 3,
      postumos: 0
    },
    rangoPaginas: {
      biografias: [11, 20],
      fotosHistoricas: [21, 28]
    }
  },

  // Sprint 8: Revista #08 (2015) - 6 exaltados
  {
    numero: 8,
    year: 2015,
    titulo: 'Octava Exaltación del Pabellón',
    fechaCeremonia: '2015-03-29',
    descripcion: 'Octava ceremonia de exaltación del Pabellón de la Fama del Deporte Humacaeño. Cuadro de Honor 2015 en el Centro de Arte Ángel (Lito) Peña.',
    pdfUrl: '/revistas/completas/revista-08.pdf',
    portadaUrl: '/revistas/portadas/rev08.jpg',
    totalPaginas: 28,
    exaltadosCount: 6,
    categorias: {
      deportistas: 4,
      propulsores: 1,
      postumos: 1
    },
    rangoPaginas: {
      biografias: [11, 16],
      fotosHistoricas: [20, 21]
    }
  }
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
