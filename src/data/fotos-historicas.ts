/**
 * Fotos Históricas del Pabellón de la Fama del Deporte Humacaeño
 * Sprint 11B - Historical Photo Gallery
 */

import { FotoHistorica } from '@/lib/types/revista';

export const fotosHistoricas: FotoHistorica[] = [
  // Revista 01 - 5 fotos
  {
    id: "rev1-equipos-historicos-1",
    titulo: "Humacao Stars (1937) y Campeones 1951",
    descripcion: "Dos equipos legendarios del béisbol humacaeño: Humacao Stars de 1937 y el equipo Campeón Doble A de Puerto Rico de 1951",
    año: 1951,
    categoria: "equipo",
    revistaOrigen: 1,
    paginaOrigen: 33,
    deporteRelacionado: "Béisbol",
    archivoUrl: "/images/historia/rev1-1.jpeg"
  },
  {
    id: "rev1-equipos-historicos-2",
    titulo: "Equipos Históricos de Béisbol",
    descripcion: "Colección de fotografías de equipos históricos del béisbol humacaeño",
    año: 1950,
    categoria: "equipo",
    revistaOrigen: 1,
    paginaOrigen: 34,
    deporteRelacionado: "Béisbol",
    archivoUrl: "/images/historia/rev1-2.jpeg"
  },
  {
    id: "rev1-equipos-historicos-3",
    titulo: "Momentos del Béisbol Clásico",
    descripcion: "Fotografías históricas de momentos memorables del béisbol humacaeño",
    año: 1945,
    categoria: "evento",
    revistaOrigen: 1,
    paginaOrigen: 35,
    deporteRelacionado: "Béisbol",
    archivoUrl: "/images/historia/rev1-3.jpeg"
  },
  {
    id: "rev1-equipos-historicos-4",
    titulo: "Equipos Vintage de Humacao",
    descripcion: "Equipos de béisbol de diferentes épocas del deporte humacaeño",
    año: 1940,
    categoria: "equipo",
    revistaOrigen: 1,
    paginaOrigen: 36,
    deporteRelacionado: "Béisbol",
    archivoUrl: "/images/historia/rev1-4.jpeg"
  },
  {
    id: "rev1-equipos-historicos-5",
    titulo: "Béisbol de Antaño",
    descripcion: "Fotografías de equipos y jugadores del béisbol histórico de Humacao",
    año: 1938,
    categoria: "equipo",
    revistaOrigen: 1,
    paginaOrigen: 37,
    deporteRelacionado: "Béisbol",
    archivoUrl: "/images/historia/rev1-5.jpeg"
  },

  // Revista 02 - 4 fotos
  {
    id: "rev2-equipo-royal-1946",
    titulo: "Equipo Royal (1946)",
    descripcion: "Equipo Royal de 1946 formado por Jorge 'Junfio' Rocafart. Incluye nombres de todos los integrantes del equipo",
    año: 1946,
    categoria: "equipo",
    revistaOrigen: 2,
    paginaOrigen: 31,
    deporteRelacionado: "Béisbol",
    personasEnFoto: ["Paredes", "Andrés", "Borras", "González", "Enrique", "Bojoquez", "Rafael M.", "Marco", "Carrillo", "Jorge 'Junfio' Rocafart", "Wilfredo", "Marting", "Manuel", "El Nuevo", "Pepe", "Torruell", "Luis M.", "El Truque", "Higinio", "Mimiet"],
    archivoUrl: "/images/historia/rev2-1.jpeg"
  },
  {
    id: "rev2-equipos-historicos-2",
    titulo: "Equipos Históricos de la Segunda Exaltación",
    descripcion: "Fotografías de equipos históricos presentados en la segunda ceremonia",
    año: 1950,
    categoria: "equipo",
    revistaOrigen: 2,
    paginaOrigen: 32,
    deporteRelacionado: "Béisbol",
    archivoUrl: "/images/historia/rev2-2.jpeg"
  },
  {
    id: "rev2-equipos-historicos-3",
    titulo: "Momentos Deportivos Históricos",
    descripcion: "Colección de fotografías de momentos memorables del deporte humacaeño",
    año: 1948,
    categoria: "evento",
    revistaOrigen: 2,
    paginaOrigen: 33,
    archivoUrl: "/images/historia/rev2-3.jpeg"
  },
  {
    id: "rev2-equipos-historicos-4",
    titulo: "Equipos Vintage Rev 02",
    descripcion: "Equipos deportivos de diferentes disciplinas de la época dorada",
    año: 1955,
    categoria: "equipo",
    revistaOrigen: 2,
    paginaOrigen: 34,
    archivoUrl: "/images/historia/rev2-4.jpeg"
  },

  // Revista 03 - 2 fotos
  {
    id: "rev3-equipos-historicos-1",
    titulo: "Equipos Históricos Rev 03",
    descripcion: "Fotografías de equipos históricos presentados en la tercera exaltación",
    año: 1952,
    categoria: "equipo",
    revistaOrigen: 3,
    paginaOrigen: 30,
    deporteRelacionado: "Béisbol",
    archivoUrl: "/images/historia/rev3-1.jpeg"
  },
  {
    id: "rev3-equipos-historicos-2",
    titulo: "Momentos Deportivos Rev 03",
    descripcion: "Colección de momentos históricos del deporte humacaeño",
    año: 1953,
    categoria: "evento",
    revistaOrigen: 3,
    paginaOrigen: 31,
    archivoUrl: "/images/historia/rev3-2.jpeg"
  },

  // Revista 05 - 2 fotos
  {
    id: "rev5-equipos-historicos-1",
    titulo: "Equipos Históricos Rev 05",
    descripcion: "Fotografías de equipos y momentos deportivos históricos de la quinta exaltación",
    año: 1960,
    categoria: "equipo",
    revistaOrigen: 5,
    paginaOrigen: 35,
    archivoUrl: "/images/historia/rev5.1.jpeg"
  },
  {
    id: "rev5-equipos-historicos-2",
    titulo: "Momentos Deportivos Rev 05",
    descripcion: "Colección de fotografías históricas del deporte humacaeño",
    año: 1962,
    categoria: "evento",
    revistaOrigen: 5,
    paginaOrigen: 36,
    archivoUrl: "/images/historia/rev5-2.jpeg"
  },

  // Revista 06 - 4 fotos
  {
    id: "rev6-equipos-softball-rifle",
    titulo: "Equipos de Softball y Rifle/Pistola",
    descripcion: "Equipo de softball y Equipo de Rifle y Pistola de la Guardia Nacional de Puerto Rico. Incluye nombres de integrantes: Latin Rodríguez y Gerald López",
    año: 1970,
    categoria: "equipo",
    revistaOrigen: 6,
    paginaOrigen: 23,
    deporteRelacionado: "Softball",
    personasEnFoto: ["Latin Rodríguez", "Gerald López"],
    archivoUrl: "/images/historia/rev6-1.jpeg"
  },
  {
    id: "rev6-equipos-historicos-2",
    titulo: "Equipos Deportivos Rev 06",
    descripcion: "Fotografías de equipos históricos de diferentes disciplinas",
    año: 1972,
    categoria: "equipo",
    revistaOrigen: 6,
    paginaOrigen: 24,
    archivoUrl: "/images/historia/rev6-2.jpeg"
  },
  {
    id: "rev6-equipos-historicos-3",
    titulo: "Momentos Deportivos Rev 06",
    descripcion: "Colección de momentos memorables del deporte humacaeño",
    año: 1975,
    categoria: "evento",
    revistaOrigen: 6,
    paginaOrigen: 25,
    archivoUrl: "/images/historia/rev6-3.jpeg"
  },
  {
    id: "rev6-equipos-historicos-4",
    titulo: "Equipos Vintage Rev 06",
    descripcion: "Equipos deportivos históricos de la sexta exaltación",
    año: 1978,
    categoria: "equipo",
    revistaOrigen: 6,
    paginaOrigen: 26,
    archivoUrl: "/images/historia/rev6-4.jpeg"
  },

  // Revista 08 - 2 fotos
  {
    id: "rev8-maldonado-levantamiento-pesas",
    titulo: "Fernando Maldonado y Equipo de Levantamiento de Pesas",
    descripcion: "Fotografía individual de Fernando Maldonado y el Equipo de Levantamiento de Pesas de Humacao, Campeón 1986 División Intermedia. 'Mente Sana Cuerpo Sano'",
    año: 1986,
    categoria: "evento",
    revistaOrigen: 8,
    paginaOrigen: 20,
    deporteRelacionado: "Levantamiento de Pesas",
    personasEnFoto: ["Fernando Maldonado"],
    archivoUrl: "/images/historia/rev8-1.jpeg"
  },
  {
    id: "rev8-equipos-historicos-2",
    titulo: "Momentos Deportivos Rev 08",
    descripcion: "Fotografías históricas de deportistas y equipos de la octava exaltación",
    año: 1985,
    categoria: "evento",
    revistaOrigen: 8,
    paginaOrigen: 21,
    archivoUrl: "/images/historia/rev8-2.jpeg"
  },
];

// Helper functions

export function getAllFotosHistoricas(): FotoHistorica[] {
  return fotosHistoricas;
}

export function getFotosByRevista(revistaNumero: number): FotoHistorica[] {
  return fotosHistoricas.filter(foto => foto.revistaOrigen === revistaNumero);
}

export function getFotosByCategoria(categoria: FotoHistorica['categoria']): FotoHistorica[] {
  return fotosHistoricas.filter(foto => foto.categoria === categoria);
}

export function getFotosByDeporte(deporte: string): FotoHistorica[] {
  return fotosHistoricas.filter(foto =>
    foto.deporteRelacionado?.toLowerCase() === deporte.toLowerCase()
  );
}

export function getFotosByDecada(decada: number): FotoHistorica[] {
  return fotosHistoricas.filter(foto => {
    if (!foto.año) return false;
    const fotoDecada = Math.floor(foto.año / 10) * 10;
    return fotoDecada === decada;
  });
}

export function getRevistasConFotos(): number[] {
  const revistas = [...new Set(fotosHistoricas.map(f => f.revistaOrigen))];
  return revistas.sort((a, b) => a - b);
}

export function getDecadasDisponibles(): number[] {
  const decadas = fotosHistoricas
    .filter(f => f.año)
    .map(f => Math.floor(f.año! / 10) * 10);
  return [...new Set(decadas)].sort();
}

export function getDeportesConFotos(): string[] {
  const deportes = fotosHistoricas
    .filter(f => f.deporteRelacionado)
    .map(f => f.deporteRelacionado!);
  return [...new Set(deportes)].sort();
}

export function getFotoById(id: string): FotoHistorica | undefined {
  return fotosHistoricas.find(foto => foto.id === id);
}
