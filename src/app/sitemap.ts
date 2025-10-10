import { MetadataRoute } from "next";
import { todosLosExaltados } from "@/data/exaltados-all";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Páginas principales
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/directorio`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/revistas`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/junta`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/historia`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/museo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/enlaces`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/horario`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/calendario`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Páginas de revistas (8 revistas)
  const revistaPages: MetadataRoute.Sitemap = Array.from({ length: 8 }, (_, i) => ({
    url: `${baseUrl}/revistas/${i + 1}`,
    lastModified: currentDate,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  // Páginas individuales de exaltados (81 total - todos con slugs semánticos)
  const exaltadosPages: MetadataRoute.Sitemap = todosLosExaltados.map((exaltado) => ({
    url: `${baseUrl}/directorio/${exaltado.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8, // Increased priority for individual profiles
  }));

  // Páginas de categorías de deporte
  const deportes = Array.from(new Set(todosLosExaltados.flatMap((e) => e.deportes)));
  const deportePages: MetadataRoute.Sitemap = deportes.map((deporte) => ({
    url: `${baseUrl}/directorio/deporte/${deporte
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, "-")}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...mainPages, ...revistaPages, ...exaltadosPages, ...deportePages];
}
