/**
 * Visitas Distinguidas al Museo Manuel Rivera Guevara
 *
 * Cada entrada representa la visita de una figura destacada al museo.
 * Las fotos viven en /public/images/museo/visitas/ (verticales u
 * horizontales, optimizadas a ~1600px en su lado mayor).
 */

export interface Visita {
  id: string;
  src: string;
  alt: string;
  caption: string;
  fecha: string;
  imageWidth: number;
  imageHeight: number;
  /** ID de video de YouTube; si está presente se muestra la entrevista embebida */
  youtubeId?: string;
}

// Orden del arreglo = orden en pantalla (más reciente primero)
export const visitas: Visita[] = [
  {
    id: "josie-marrero-2026",
    src: "/images/museo/visitas/2026-07-josie-marrero.jpg",
    alt: "José Luis «Josie» Marrero Rodríguez sonriendo junto al Prof. Félix Báez Neris durante la entrevista en el Museo Manuel Rivera Guevara, frente a la pared de placas de exaltados",
    caption:
      "Recibimos la visita de José Luis «Josie» Marrero Rodríguez, exaltado del Pabellón de la Fama del Deporte Humacaeño en la Primera Exaltación, celebrada en el año 2000, en la disciplina de Levantamiento de Pesas. Entrenador nacional, presidió el Club de Levantamiento de Pesas de Humacao por más de 25 años y participó en la preparación de más de mil pesistas. De aquella visita nació la entrevista que hoy compartimos: una conversación con el Prof. Félix Báez Neris, Secretario e historiador del Pabellón, grabada en nuestro Museo Manuel Rivera Guevara.",
    fecha: "30 de julio de 2026",
    imageWidth: 1600,
    imageHeight: 900,
    youtubeId: "20nHZbx_F74",
  },
  {
    id: "rafael-ocasio-2026",
    src: "/images/museo/visitas/2026-07-rafael-ocasio.jpg",
    alt: "Verónica Rivera, Rafael «Rafa» Ocasio, Quique Torres y Francisco Cintrón durante la visita al museo, frente a la pared de placas de exaltados",
    caption:
      "Recibimos la visita de Rafael «Rafa» Ocasio, exaltado del Pabellón de la Fama del Deporte Humacaeño en 2012, en la 7ma Ceremonia de Exaltación, junto a su hermano Esteban. Rafa defendió a Humacao en el béisbol Doble A entre 1957 y 1960 — etapa que nuestro museo conserva en un recorte de El Imparcial titulado «Rafael Ocasio se retira». Le acompañaron Verónica Rivera, Quique Torres y Francisco Cintrón. De aquella visita nació la entrevista que hoy compartimos: una conversación con Quique Torres sobre sus ocho exaltaciones, el softball de 1948 y los Grises de Humacao.",
    fecha: "14 de julio de 2026",
    imageWidth: 1210,
    imageHeight: 1200,
    youtubeId: "7mxpxoJmi-g",
  },
  {
    id: "keishla-garcia-2026",
    src: "/images/museo/visitas/2026-07-keishla-garcia.jpg",
    alt: "Keishla Marie García Cruz durante su visita al museo, frente a las placas de Pista y Campo",
    caption:
      "Recibimos la visita de Keishla Marie García Cruz, atleta humacaeña de 100 metros con vallas que nos representa en México. En 2013, con apenas 8 años, fue reconocida por el Pabellón como valor joven del atletismo humacaeño.",
    fecha: "7 de julio de 2026",
    imageWidth: 775,
    imageHeight: 1315,
    youtubeId: "0-6nM8DOyKo",
  },
  {
    id: "samuel-caraballo-2026",
    src: "/images/museo/visitas/2026-07-samuel-caraballo.jpg",
    alt: "Samuel Caraballo y su esposa Miriam Martínez frente a las placas de Pista y Campo del museo",
    caption:
      "Recibimos en nuestro museo la visita del exatleta puertorriqueño Samuel Caraballo y su esposa Miriam Martínez, radicados en Newton, Massachusetts. Samuel fue uno de varios portadores de la antorcha olímpica en Barcelona 1992.",
    fecha: "3 de julio de 2026",
    imageWidth: 835,
    imageHeight: 1600,
  },
];
