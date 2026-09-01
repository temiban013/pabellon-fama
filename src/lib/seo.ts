// src/lib/seo.ts
import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  canonical?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org";
const siteName = "Pabellón de la Fama del Deporte Humacaeño";
const defaultDescription =
  "Museo del Pabellón de la Fama del Deporte Humacaeño Manuel Rivera Guevara. Honrando la excelencia deportiva de Humacao, Puerto Rico desde 1996.";
const defaultImage = `${baseUrl}/images/og-default.jpg`;

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = defaultImage,
  url = baseUrl,
  type = "website",
  noIndex = false,
  canonical,
}: SEOConfig): Metadata {
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const defaultKeywords = [
    "Pabellón de la Fama",
    "Deporte Humacaeño",
    "Humacao",
    "Puerto Rico",
    "Manuel Rivera Guevara",
    "Museo Deportivo",
    "Atletas Puertorriqueños",
    "Historia Deportiva",
  ];

  return {
    metadataBase: new URL(baseUrl),
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords].join(", "),
    authors: [{ name: "Pabellón de la Fama del Deporte Humacaeño" }],
    creator: siteName,
    publisher: siteName,

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: canonical || fullUrl,
    },

    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_PR",
      type,
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@PabellonHumacao",
    },

    other: {
      "application-name": siteName,
      "apple-mobile-web-app-title": "Pabellón PFDH",
      "msapplication-TileColor": "#0066CC",
      "theme-color": "#0066CC",
    },
  };
}

// Configuraciones específicas por página
export const seoConfigs = {
  home: {
    title: siteName,
    description: defaultDescription,
    keywords: ["inicio", "museo", "exaltados", "registro"],
  },

  directorio: {
    title: "Directorio de Exaltados",
    description:
      "Conoce a todos los exaltados al Pabellón de la Fama del Deporte Humacaeño. Atletas, propulsores y personalidades que han marcado la historia deportiva de Humacao.",
    keywords: ["exaltados", "atletas", "directorio", "búsqueda", "deporte"],
  },

  junta: {
    title: "Junta de Directores",
    description:
      "Conoce la Junta de Directores del Pabellón de la Fama del Deporte Humacaeño, fundada en 1983. Líderes que preservan el legado deportivo de Humacao, Puerto Rico.",
    keywords: ["junta directores", "liderazgo", "organización"],
  },

  historia: {
    title: "Historia del Pabellón",
    description:
      "Explora la historia del Pabellón de la Fama del Deporte Humacaeño desde 1983 hasta hoy. Más de 40 años celebrando la excelencia deportiva de Humacao, PR.",
    keywords: ["historia", "fundación", "cronología", "desarrollo"],
  },

  museo: {
    title: "Museo Manuel Rivera Guevara",
    description:
      "Visita el Museo Manuel Rivera Guevara del Pabellón de la Fama. Exhibiciones, tour virtual y memorabilia deportiva de Humacao, Puerto Rico.",
    keywords: [
      "museo",
      "Manuel Rivera Guevara",
      "exhibiciones",
      "tour virtual",
    ],
  },

  enlaces: {
    title: "Enlaces y Recursos",
    description:
      "Accede a enlaces y recursos del Pabellón de la Fama del Deporte Humacaeño. Blog deportivo, biblioteca digital, canal de YouTube y más recursos educativos.",
    keywords: ["biblioteca", "blog", "youtube", "recursos"],
  },

  horario: {
    title: "Horario y Contacto",
    description:
      "Información de contacto, horarios de visita y ubicación del Museo del Pabellón de la Fama del Deporte Humacaeño.",
    keywords: ["horario", "contacto", "visitas", "ubicación"],
  },

  comoSeHace: {
    title: "Cómo se hacen nuestras entrevistas",
    description:
      "Divulgación del uso de inteligencia artificial en las producciones del Pabellón de la Fama del Deporte Humacaeño: qué se genera con IA y qué es material auténtico de archivo.",
    keywords: [
      "inteligencia artificial",
      "transparencia",
      "producción",
      "entrevistas",
    ],
  },

  calendario: {
    title: "Calendario de Actividades",
    description:
      "Consulta el calendario del Pabellón de la Fama del Deporte Humacaeño. Ceremonias de exaltación, exhibiciones, charlas deportivas y eventos comunitarios.",
    keywords: ["calendario", "eventos", "actividades", "ceremonias"],
  },

  contribuir: {
    title: "Contribuir Información",
    description:
      "Comparte estadísticas, datos biográficos y anécdotas sobre los exaltados al Pabellón de la Fama del Deporte Humacaeño. Tu información será revisada por la Junta de Directores.",
    keywords: ["contribuir", "información", "estadísticas", "datos", "comunidad"],
  },

  nominacion: {
    title: "Nominaciones — 9na Exaltación 2026",
    description:
      "Descarga la boleta oficial para nominar a una figura del deporte humacaeño al Pabellón de la Fama. Periodo: 22 de mayo al 31 de agosto de 2026. Entrega presencial en el museo.",
    keywords: ["nominación", "boleta", "exaltación", "9na exaltación", "2026"],
    url: "/nominacion",
  },
};

// BreadcrumbList JSON-LD para SEO
export function generateBreadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Structured Data (JSON-LD) para SEO
export function generateJsonLd(
  type: "organization" | "museum" | "event" | "person",
  data: Record<string, unknown>
) {
  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: "PFDH",
    url: baseUrl,
    logo: `${baseUrl}/images/pabellon-logo.png`,
    description: defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Humacao",
      addressRegion: "Puerto Rico",
      addressCountry: "PR",
    },
    sameAs: [
      "https://www.youtube.com/channel/UCxxxxxx",
      "https://pabellonblog.blogspot.com",
    ],
  };

  switch (type) {
    case "organization":
      return baseOrganization;

    case "museum":
      return {
        ...baseOrganization,
        "@type": "Museum",
        name: "Museo Manuel Rivera Guevara",
        parentOrganization: baseOrganization,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "15:00",
          },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Calle Antonio López #53",
          addressLocality: "Humacao",
          addressRegion: "PR",
          postalCode: "00791",
          addressCountry: "US",
        },
        telephone: "+1-787-410-1237",
        isAccessibleForFree: true,
      };

    case "person":
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: data.name,
        description: data.biography,
        memberOf: baseOrganization,
        award: data.achievements || [],
        sport: data.sport,
      };

    case "event":
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: {
          "@type": "Place",
          name: "Museo Manuel Rivera Guevara",
          address: baseOrganization.address,
        },
        organizer: baseOrganization,
      };

    default:
      return baseOrganization;
  }
}
