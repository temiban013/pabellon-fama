"use client";

import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd() {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org";

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ name: "Inicio", url: baseUrl }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;

      // Nombres amigables para las rutas
      const nameMap: Record<string, string> = {
        directorio: "Directorio de Exaltados",
        junta: "Junta de Directores",
        historia: "Historia",
        museo: "Museo",
        enlaces: "Enlaces",
        horario: "Horario y Contacto",
        calendario: "Calendario",
        deporte: "Deporte",
        año: "Año",
      };

      const name =
        nameMap[path] ||
        path.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      breadcrumbs.push({
        name,
        url: `${baseUrl}${currentPath}`,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}
