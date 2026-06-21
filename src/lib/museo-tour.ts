/**
 * Museo Virtual — datos del recorrido 360°
 *
 * El panorama equirectangular (2048×1024, foto 360° original del museo) es la sala real
 * del Museo Manuel Rivera Guevara.
 * Cada "hotspot" se coloca sobre un display físico usando coordenadas yaw/pitch (en grados)
 * leídas sobre el panorama. Al pulsar un hotspot se abre una galería con las fotos de cercanía
 * de ese display.
 *
 * Las fotos viven en /images/museo/tour/fotos/foto-NN.jpg (+ -thumb). El índice NN corresponde
 * al orden cronológico de captura; tras la depuración (2026-06-20) sólo sobreviven 62 de las 89
 * tomas originales — se eliminaron las tomas amplias casi duplicadas conservando los acercamientos
 * nítidos. Por eso la numeración NN tiene huecos (p. ej. no existe foto-13): los slugs se mantienen
 * estables a propósito.
 *
 * Las coordenadas yaw/pitch se calibraron visualmente con el editor (/museo/editor, sólo en
 * desarrollo, 2026-06-20). El editor exporta yaw en 0..360° (aumenta hacia la derecha); el visor
 * normaliza el ángulo, por lo que también son válidos valores negativos (−180..180). pitch: 0° =
 * horizonte, positivo hacia arriba, negativo hacia abajo. Los displays centrales (vitrina-*) miran
 * hacia abajo (pitch negativo); los paneles del perímetro (panel-exaltados-*) miran al horizonte.
 */

export interface TourPhoto {
  /** Ruta de la imagen de cercanía a tamaño completo. */
  src: string;
  /** Texto alternativo en español (obligatorio por accesibilidad). */
  alt: string;
  /** Miniatura para la cuadrícula/galería. */
  thumb: string;
  /** Pie de foto opcional mostrado en el visor. */
  caption?: string;
}

export interface TourHotspot {
  id: string;
  /** Posición sobre el panorama, en grados. */
  yaw: number;
  pitch: number;
  /** Etiqueta corta (aria-label / tooltip). */
  label: string;
  /** Fotos de cercanía de este display (1 o más). */
  photos: TourPhoto[];
}

const FOTOS = "/images/museo/tour/fotos";

/** Helper para construir una TourPhoto a partir del índice NN. */
function foto(nn: number, alt: string, caption?: string): TourPhoto {
  const id = String(nn).padStart(2, "0");
  return {
    src: `${FOTOS}/foto-${id}.jpg`,
    thumb: `${FOTOS}/foto-${id}-thumb.jpg`,
    alt,
    caption,
  };
}

export const panorama = {
  src: "/images/museo/tour/panorama.jpg",
  srcMobile: "/images/museo/tour/panorama-mobile.jpg",
  caption: "Museo Manuel Rivera Guevara — Pabellón de la Fama del Deporte Humacaeño",
  attribution: "Recorrido 360° · Pabellón de la Fama del Deporte Humacaeño",
  /** Vista inicial: mirando la pared principal de Exaltados (Propulsores). */
  defaultYaw: 48,
  defaultPitch: -2,
} as const;

/**
 * 26 hotspots, uno por display físico. Fotos asignadas según docs/museo-tour-catalog.md
 * (depuradas tras la revisión 2026-06-20). Las coordenadas yaw/pitch son semillas por región;
 * calíbralas con /museo/editor.
 */
export const hotspots: TourHotspot[] = [
  {
    id: "entrada-general",
    yaw: 190.4,
    pitch: -3.7,
    label: "Vista general de la entrada",
    photos: [
      foto(1, "Vista general del museo desde la entrada: mesa con trofeos de béisbol, gorra «PR» y pared de Exaltados al fondo", "Vista general de la sala"),
      foto(2, "Vista de la sala principal del museo desde otro ángulo, con la mesa central de trofeos"),
    ],
  },
  {
    id: "exhibit-laboy-antartica",
    yaw: 159.6,
    pitch: 8.4,
    label: "Alfredo «Juny» Laboy — Maratón Antártica 2024",
    photos: [
      foto(3, "Vitrina de Alfredo «Juny» Laboy: medallas del Antarctic Ice Marathon y bandera de Puerto Rico (2024)", "Alfredo «Juny» Laboy — Maratón Antártica 2024"),
    ],
  },
  {
    id: "mesa-trofeos-beisbol",
    yaw: 153.8,
    pitch: -5.4,
    label: "Mesa central — Trofeos de béisbol",
    photos: [
      foto(4, "Trofeos de béisbol (Torneo Municipal y Estatal) y gorra azul «PR» firmada en la mesa central", "Trofeos de béisbol — campeonatos de Humacao"),
      foto(5, "Ángulo bajo de la mesa con trofeos de béisbol y figura de atleta con el escudo de Humacao"),
    ],
  },
  {
    id: "vitrina-guante-julio-cora",
    yaw: 173.3,
    pitch: -6,
    label: "Guante de Oro de Julio S. Cora (1992)",
    photos: [
      foto(6, "Guante bañado en oro Rawlings de Julio S. Cora, Premio Defensas de Oro 1992", "Guante de Oro de Julio S. Cora (Rawlings, 1992)"),
    ],
  },
  {
    id: "mesa-copas-2021-orientales",
    yaw: 193,
    pitch: -7,
    label: "Copas 2021 y Orientales de Humacao",
    photos: [
      foto(7, "Copas de béisbol 2021 (Grises de Humacao), libro de visitas y foto de los Orientales 2012", "Copas 2021 de los Grises de Humacao"),
      foto(8, "Libro de visitas y foto del equipo Orientales de Humacao, Campeones AA Juvenil 2012"),
    ],
  },
  {
    id: "pared-lateral-beisbol-historico",
    yaw: 234.3,
    pitch: -3.8,
    label: "Béisbol histórico — pared lateral",
    photos: [
      foto(9, "Esquina con jersey de Puerto Rico firmado, recortes históricos y trofeo de béisbol de Playa Humacao 1982", "Béisbol histórico — pared lateral"),
      foto(10, "Trofeo de madera y bronce: Playa Humacao, Campeón Nacional Clase A 1982"),
    ],
  },
  {
    id: "panel-exaltados-beisbol",
    yaw: 250.9,
    pitch: 2.3,
    label: "Exaltados — Béisbol",
    photos: [
      foto(11, "Panel de Exaltados de Béisbol: ocho placas conmemorativas sobre pared negra", "Exaltados — Béisbol"),
      // TODO verificar in situ: foto-72 puede pertenecer a Pista y Campo en lugar de Béisbol.
      foto(72, "Panel de Exaltados con doce placas conmemorativas en pared negra"),
    ],
  },
  {
    id: "vitrina-pista-campo-fotos-historicas",
    yaw: 283,
    pitch: -43,
    label: "Pista y Campo — fotos históricas (Manuel Rivera)",
    photos: [
      foto(26, "Relevo 4×400, medalla de oro — Juegos Centroamericanos y del Caribe 1959 (Frank Rivera, Manuel Rivera, Ovidio de Jesús e Iván Rodríguez)", "Relevo 4×400 — oro 1959"),
      foto(15, "Foto del relevo 4×100: Manuel Rivera cruzando la meta (récord 41.2), Richardson, Texas", "Manuel Rivera — relevo 4×100"),
      foto(17, "Foto de carrera clásica en estadio centroamericano, atleta de Puerto Rico (dorsal 118)"),
      foto(28, "Atletas de Puerto Rico felicitados en la pista tras una competencia (dorsal 118)"),
    ],
  },
  {
    id: "vitrina-recortes-manuel-rivera",
    yaw: 243.1,
    pitch: -38.4,
    label: "Recortes de prensa — Manuel Rivera",
    photos: [
      foto(18, "Recorte completo «Manuel Rivera hizo 10.6 al derrotar a Whitfield» (El Imparcial), con foto de la carrera y foto grupal", "Manuel Rivera vence a Whitfield (10.6)"),
      foto(20, "Titular «Manuel Rivera hizo 10.6 al derrotar a Whitfield»"),
      foto(22, "Scrapbook: «Manuel Rivera empata marca de 200 metros» y recortes relacionados"),
      foto(27, "Recorte «Gran homenaje del deporte en Humacao» con fotos de la ceremonia de premios"),
      foto(24, "Retrato de joven atleta con uniforme de Puerto Rico en un campo"),
    ],
  },
  {
    id: "vitrina-boxeo-historico",
    yaw: 4.3,
    pitch: -18.1,
    label: "Boxeo histórico (Sixto Escobar, Chú Silva)",
    photos: [
      foto(32, "Boxeadores Eugenio López y Tito Mills junto al árbitro Sixto Escobar", "Eugenio López, Sixto Escobar y Tito Mills"),
      foto(29, "Fotografía histórica del Primer Club de Boxeo en Humacao", "Primer Club de Boxeo en Humacao"),
      foto(31, "Colage histórico de boxeo y halterofilia: club de boxeo, Sixto Escobar y Jesús «Chú» Silva"),
      // TODO verificar in situ: foto-30 (Chú Silva, halterofilia) puede pertenecer a vitrina-halterofilia-fotos.
      foto(30, "Jesús «Chú» Silva levantando pesas, XI Juegos Centroamericanos y del Caribe, Panamá 1970"),
    ],
  },
  {
    id: "vitrina-halterofilia-fotos",
    yaw: 7.9,
    pitch: -11.6,
    label: "Halterofilia (Jossie Marrero, Vargas Castro)",
    photos: [
      foto(34, "José Luis «Jossie» Marrero Rodríguez con su trofeo del Pabellón de la Fama — Halterofilia", "José Luis «Jossie» Marrero — Halterofilia"),
      foto(36, "Andrés Vargas Castro en acción de levantamiento de pesas", "Andrés Vargas Castro — Halterofilia"),
    ],
  },
  {
    id: "vitrina-futbol-libros-medallas",
    yaw: 349.2,
    pitch: -8.9,
    label: "Fútbol — libros L. R. Álvarez y medallas",
    photos: [
      foto(40, "Portada del libro «El fútbol nos cayó del cielo — memorias del fútbol humacaeño (1956-2000)»", "Libros de fútbol de L. R. Álvarez"),
      foto(38, "Libro «Política, Migración y Fútbol en las Antillas Hispanas» de Luis Reinaldo Álvarez Vázquez"),
      foto(39, "Medallas históricas de fútbol y el libro «El fútbol nos cayó del cielo» sobre fondo rojo"),
    ],
  },
  {
    id: "vitrina-futbol-equipos-historicos",
    yaw: 356.6,
    pitch: -7,
    label: "Fútbol — equipos históricos (Jumacao FC, Saso Tulier)",
    photos: [
      foto(42, "Foto del equipo Jumacao FC (1961) con la lista de jugadores", "Jumacao FC, 1961"),
      foto(47, "Trilogía de hermanos Álvarez (Paco Rey, Pepe y Rey) del Jumacao FC y Yaju FC, 1964"),
      foto(48, "Juan «Saso» Tulier Cruz con su trofeo del Pabellón de la Fama — Fútbol", "Juan «Saso» Tulier Cruz — Fútbol"),
      foto(50, "Acción del partido Suizos vs. Jumacao FC, 1960"),
    ],
  },
  {
    id: "vitrina-fundacional-junta-1998",
    yaw: 193.6,
    pitch: -11.4,
    label: "1ra. Junta de Directores (1998)",
    photos: [
      foto(44, "Primera Junta de Directores del Pabellón de la Fama del Deporte Humacaeño, 1998", "1ra. Junta de Directores, 1998"),
    ],
  },
  {
    id: "vitrina-beisbol-guantes-vintage",
    yaw: 318.9,
    pitch: -14.9,
    label: "Béisbol — guantes vintage (Conejo López, Toribio Peña)",
    photos: [
      foto(52, "Guante de béisbol de Rubén «Conejo» López y foto de Néstor Morales Santiago", "Guante de Rubén «Conejo» López"),
      foto(56, "Guante de béisbol antiguo y desgastado de Pedro «Toribio» Peña", "Guante vintage de Pedro «Toribio» Peña"),
    ],
  },
  {
    id: "vitrina-beisbol-fotos-veteranos",
    yaw: 307.9,
    pitch: -16.9,
    label: "Béisbol — veteranos (Tremendo Trabuco)",
    photos: [
      foto(54, "Equipo histórico de Humacao «Tremendo Trabuco» y retrato de Melquiades Silva Anderson con trofeo", "«Tremendo Trabuco» y Melquiades Silva"),
      foto(58, "Beisbolistas veteranos Rubén «Conejo» López, Carlos «Memelo» López y Julio «Yuyo» Cora", "Conejo, Memelo y Yuyo"),
    ],
  },
  {
    id: "vitrina-beisbol-documentos-historicos",
    yaw: 271.1,
    pitch: -18.8,
    label: "Béisbol — documentos históricos (rosters, programas)",
    photos: [
      foto(62, "Recorte «Eternos compañeros» (Primera Hora, 2010) sobre los medallistas de béisbol de 1959", "«Eternos compañeros», 2010"),
      foto(64, "Foto de los beisbolistas Milton Crespo e Ivan Carradero con uniformes de Humacao", "Milton Crespo e Ivan Carradero"),
      foto(68, "Beisbolistas Gilberto Puig, Ángel «Pipa» Sierra y Víctor «Regalito» Hernández", "Puig, Sierra y Hernández"),
      foto(63, "Roster del juego Cayey AA vs. Humacao AA (ca. 1959), patrocinado por General Electric Center"),
      foto(66, "Página de El Imparcial (1960): «Rafael Ocasio se retira» del béisbol activo"),
      foto(69, "Recorte «Rafael Ocasio se retira» (El Imparcial, 1960) en la vitrina de béisbol"),
      foto(71, "Vitrina de béisbol: programa de inauguración de 1966 y recorte «Rafael Ocasio se retira»"),
    ],
  },
  {
    id: "panel-exaltados-pista-campo",
    yaw: 284.8,
    pitch: 3.1,
    label: "Exaltados — Pista y Campo",
    photos: [
      foto(73, "Panel de Exaltados de Pista y Campo con siete placas conmemorativas", "Exaltados — Pista y Campo"),
      foto(74, "Cuatro placas de Exaltados de Pista y Campo: Virgilio Wilkes, Juan Ramón García y otros"),
    ],
  },
  {
    id: "panel-exaltados-boxeo",
    yaw: 306.4,
    pitch: -3.3,
    label: "Exaltados — Boxeo (guantes Cleto Reyes)",
    photos: [
      foto(75, "Panel de Exaltados de Boxeo con guantes Cleto Reyes y placas conmemorativas", "Exaltados — Boxeo (guantes Cleto Reyes)"),
    ],
  },
  {
    id: "panel-exaltados-lucha",
    yaw: 315.8,
    pitch: -0.7,
    label: "Exaltados — Lucha",
    photos: [
      foto(76, "Panel de Exaltados de Lucha con tres placas y un trofeo", "Exaltados — Lucha"),
    ],
  },
  {
    id: "panel-exaltados-futbol",
    yaw: 321.7,
    pitch: -0.4,
    label: "Exaltados — Fútbol",
    photos: [
      foto(77, "Panel de Exaltados de Fútbol con placas y un balón decorativo sobre pedestal", "Exaltados — Fútbol"),
      foto(79, "Placas de Exaltados de Fútbol con emblema de balón (incluye a Francisco «Paco» Rey Vázquez) y balón decorativo sobre pedestal"),
    ],
  },
  {
    id: "panel-exaltados-propulsores",
    yaw: 76.1,
    pitch: -3,
    label: "Exaltados — Propulsores",
    photos: [
      foto(85, "Panel de Exaltados Propulsores con tres placas conmemorativas", "Exaltados — Propulsores"),
      foto(86, "Cinco placas de Exaltados del panel de Propulsores"),
      foto(87, "Vista general de los paneles de Exaltados al fondo de la sala"),
      // TODO verificar in situ: foto-88 y foto-89 pueden pertenecer a Directores/Propulsores.
      foto(88, "Panel lateral de Exaltados con cuatro placas conmemorativas"),
      foto(89, "Panel de Exaltados con ocho placas, incluyendo propulsores y directores fundadores"),
    ],
  },
  {
    id: "panel-exaltados-halterofilia",
    yaw: 334,
    pitch: 1.6,
    label: "Exaltados — Halterofilia",
    photos: [
      foto(80, "Panel de Exaltados de Halterofilia con placas y trofeo de levantador", "Exaltados — Halterofilia"),
      foto(81, "Detalle de las placas del panel de Exaltados de Halterofilia"),
    ],
  },
  {
    id: "panel-exaltados-baloncesto-natacion",
    yaw: 26.3,
    pitch: 2,
    label: "Exaltados — Baloncesto y Natación",
    photos: [
      foto(82, "Paneles de Exaltados de Baloncesto y Natación en la esquina, con trofeos", "Exaltados — Baloncesto y Natación"),
    ],
  },
  {
    id: "panel-exaltados-tiro-ciclismo",
    yaw: 34.6,
    pitch: -2.7,
    label: "Exaltados — Tiro y Ciclismo",
    photos: [
      foto(83, "Paneles de Exaltados de Tiro y Ciclismo en la pared lateral", "Exaltados — Tiro y Ciclismo"),
    ],
  },
  {
    id: "panel-exaltados-pasofino-softbol",
    yaw: 42.1,
    pitch: -3.7,
    label: "Exaltados — Paso Fino y Sóftbol",
    photos: [
      foto(84, "Paneles de Exaltados de Paso Fino y Sóftbol con trofeo de caballo", "Exaltados — Paso Fino y Sóftbol"),
    ],
  },
];

/**
 * Índices de las 62 fotografías que sobrevivieron a la depuración (con huecos a propósito).
 * Fuente de la decisión: docs/museo-tour-NEXT-SESSION.md (revisión 2026-06-20).
 */
const KEPT = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 17, 18, 20, 22, 24, 26, 27, 28, 29, 30, 31, 32, 34, 36,
  38, 39, 40, 42, 44, 47, 48, 50, 52, 54, 56, 58, 62, 63, 64, 66, 68, 69, 71, 72, 73, 74, 75, 76,
  77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
] as const;

/** Galería completa: las 62 fotos del museo, para la cuadrícula y el modo alterno. */
export const galeria: TourPhoto[] = KEPT.map((nn) =>
  foto(nn, `Fotografía ${nn} del Museo Manuel Rivera Guevara`),
);
