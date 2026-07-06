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
}

export const visitas: Visita[] = [
  {
    id: "samuel-caraballo-2026",
    src: "/images/museo/visitas/2026-07-samuel-caraballo.jpg",
    alt: "Samuel Caraballo y su esposa Miriam Martínez frente a las placas de Pista y Campo del museo",
    caption:
      "Recibimos en nuestro museo la visita del exatleta puertorriqueño Samuel Caraballo y su esposa Miriam Martínez, radicados en Newton, Massachusetts. Samuel fue uno de varios portadores de la antorcha olímpica en Barcelona 1992.",
    fecha: "3 de julio de 2026",
  },
];
