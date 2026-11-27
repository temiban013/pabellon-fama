import { SITE_URL } from "@/lib/constants/site";
import { MetadataRoute } from "next";
import { todosLosExaltados } from "@/data/exaltados-all";
import { deportesDelDirectorio } from "@/lib/directorio/deportes";
import { getAllRevistas } from "@/data/revistas";
import { getNoticias } from "@/data/noticias";


export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Páginas principales
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/directorio`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/revistas`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/junta`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/historia`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/museo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/enlaces`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/horario`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/calendario`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/como-se-hace`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contribuir`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/noticias`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Páginas de noticias (data-driven, PF-051)
  const noticiaPages: MetadataRoute.Sitemap = getNoticias().map((noticia) => ({
    url: `${SITE_URL}/noticias/${noticia.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Páginas de revistas (data-driven)
  const revistaPages: MetadataRoute.Sitemap = getAllRevistas().map((revista) => ({
    url: `${SITE_URL}/revistas/${revista.slug}`,
    lastModified: currentDate,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  // Páginas individuales de exaltados (81 total - todos con slugs semánticos)
  const exaltadosPages: MetadataRoute.Sitemap = todosLosExaltados.map((exaltado) => ({
    url: `${SITE_URL}/directorio/${exaltado.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8, // Increased priority for individual profiles
  }));

  // Páginas de categorías de deporte
  // Las mismas que genera /directorio/deporte/[deporte] (misma fuente y mismo slug).
  const deportePages: MetadataRoute.Sitemap = deportesDelDirectorio().map(({ slug }) => ({
    url: `${SITE_URL}/directorio/deporte/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...mainPages,
    ...noticiaPages,
    ...revistaPages,
    ...exaltadosPages,
    ...deportePages,
  ];
}
