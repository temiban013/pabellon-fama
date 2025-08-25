import { exaltados } from "@/data/exaltados";

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export function generateDynamicSitemap(): SitemapEntry[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org";
  const currentDate = new Date();

  const entries: SitemapEntry[] = [];

  // Agregar páginas de exaltados dinámicamente
  exaltados.forEach((exaltado) => {
    entries.push({
      url: `${baseUrl}/directorio/${exaltado.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  // Agregar páginas de búsqueda por deporte
  const deportes = Array.from(new Set(exaltados.flatMap((e) => e.deporte)));
  deportes.forEach((deporte) => {
    const slug = deporte
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    entries.push({
      url: `${baseUrl}/directorio/deporte/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  return entries;
}
