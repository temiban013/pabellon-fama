// src/app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pabellón de la Fama del Deporte Humacaeño",
    short_name: "Pabellón Humacaeño",
    description:
      "Pabellón de la Fama que honra la excelencia deportiva de Humacao, Puerto Rico. Museo Manuel Rivera Guevara.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#15803d",
    orientation: "portrait-primary",
    categories: ["sports", "education", "museum", "culture"],
    lang: "es-PR",
    scope: "/",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      //   {
      //     name: "Directorio de Exaltados",
      //     short_name: "Directorio",
      //     description: "Ver todos los atletas exaltados",
      //     url: "/directorio",
      //     icons: [
      //       {
      //         src: "/icons/directorio-96x96.png",
      //         sizes: "96x96",
      //         type: "image/png",
      //       },
      //     ],
      //   },
      {
        name: "Museo Virtual",
        short_name: "Museo",
        description: "Tour virtual del Museo Manuel Rivera Guevara",
        url: "/museo",
        icons: [
          {
            src: "/icons/museo-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      //   {
      //     name: "Horarios",
      //     short_name: "Horarios",
      //     description: "Información de contacto y horarios",
      //     url: "/horario",
      //     icons: [
      //       {
      //         src: "/icons/horario-96x96.png",
      //         sizes: "96x96",
      //         type: "image/png",
      //       },
      //     ],
      //   },
    ],
  };
}
