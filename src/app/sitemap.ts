// src/app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pabellon.org";
  const currentDate = new Date().toISOString();

  // Páginas estáticas principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    // {
    //   url: `${baseUrl}/junta`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/directorio`,
    //   lastModified: currentDate,
    //   changeFrequency: "weekly" as const,
    //   priority: 0.9,
    // },
    // {
    //   url: `${baseUrl}/historia`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly" as const,
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/enlaces`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly" as const,
    //   priority: 0.6,
    // },
    {
      url: `${baseUrl}/museo`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    // {
    //   url: `${baseUrl}/horario`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly" as const,
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/calendario`,
    //   lastModified: currentDate,
    //   changeFrequency: "weekly" as const,
    //   priority: 0.6,
    // },
  ];

  // TODO: En el futuro, añadir páginas dinámicas de exaltados
  // const exaltadosPages = await getExaltadosForSitemap();

  return [...staticPages];
}
