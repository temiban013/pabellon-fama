import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pabellón de la Fama del Deporte Humacaeño",
    short_name: "PFDH",
    description:
      "Museo del Pabellón de la Fama del Deporte Humacaeño Manuel Rivera Guevara",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066CC",
    orientation: "portrait",
    scope: "/",
    lang: "es-PR",
    categories: ["sports", "education", "entertainment"],

    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    screenshots: [
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Página de Inicio del Pabellón",
      },
      {
        src: "/screenshots/mobile-directorio.png",
        sizes: "375x812",
        type: "image/png",
        form_factor: "narrow",
        label: "Directorio de Exaltados",
      },
    ],

    shortcuts: [
      {
        name: "Directorio de Exaltados",
        short_name: "Exaltados",
        description: "Buscar en el directorio de exaltados",
        url: "/directorio",
        icons: [{ src: "/icon-96.png", sizes: "96x96" }],
      },
      {
        name: "Museo Virtual",
        short_name: "Museo",
        description: "Tour virtual del museo",
        url: "/museo",
        icons: [{ src: "/icon-96.png", sizes: "96x96" }],
      },
    ],
  };
}
