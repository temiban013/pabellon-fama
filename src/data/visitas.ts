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
