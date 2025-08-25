import { MetadataRoute } from "next";
import { exaltados } from "@/data/exaltados";

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

  // Páginas individuales de exaltados
  const exaltadosPages: MetadataRoute.Sitemap = exaltados.map((exaltado) => ({
    url: `${baseUrl}/directorio/${exaltado.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Páginas de categorías de deporte
  const deportes = Array.from(new Set(exaltados.flatMap((e) => e.deporte)));
  const deportePages: MetadataRoute.Sitemap = deportes.map((deporte) => ({
    url: `${baseUrl}/directorio/deporte/${deporte
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Páginas de años de exaltación
  const years = Array.from(new Set(exaltados.map((e) => e.yearInducted)));
  const yearPages: MetadataRoute.Sitemap = years.map((year) => ({
    url: `${baseUrl}/directorio/año/${year}`,
    lastModified: currentDate,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  return [...mainPages, ...exaltadosPages, ...deportePages, ...yearPages];
}
