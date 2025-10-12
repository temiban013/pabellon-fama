import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  generateMetadata as generateSEOMetadata,
  generateJsonLd,
} from "@/lib/seo";
import { exaltados } from "@/data/exaltados";
import { todosLosExaltados } from "@/data/exaltados-all";
import { ExaltadoDetail } from "@/components/directorio/ExaltadoDetail";

interface ExaltadoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Metadata dinámica para cada exaltado (Sprint 10 - Enhanced SEO)
export async function generateMetadata({
  params,
}: ExaltadoPageProps): Promise<Metadata> {
  const { slug } = await params;

  // First check in revista data (priority)
  const exaltadoRevista = todosLosExaltados.find((e) => e.id === slug);

  if (exaltadoRevista) {
    const nombreCompleto = `${exaltadoRevista.nombre}${exaltadoRevista.apodo ? ` "${exaltadoRevista.apodo}"` : ''} ${exaltadoRevista.apellidos}`;
    const deportes = exaltadoRevista.deportes.join(", ");
    const biografia = exaltadoRevista.contenido.biografia.substring(0, 155);

    return generateSEOMetadata({
      title: `${nombreCompleto} - Exaltado PFDH`,
      description: `${nombreCompleto}, exaltado al Pabellón de la Fama del Deporte Humacaeño en ${exaltadoRevista.anoExaltacion}. ${deportes} - ${biografia}...`,
      keywords: [
        exaltadoRevista.nombre,
        exaltadoRevista.apellidos,
        ...exaltadoRevista.deportes,
        "exaltado",
        String(exaltadoRevista.anoExaltacion),
        "Humacao",
        "Pabellón de la Fama",
      ],
      url: `/directorio/${slug}`,
      type: "profile",
    });
  }

  // Fallback to old data
  const exaltado = exaltados.find((e) => e.slug === slug);

  if (!exaltado) {
    return {
      title: "Exaltado no encontrado",
      description:
        "El exaltado solicitado no fue encontrado en nuestra base de datos.",
    };
  }

  return generateSEOMetadata({
    title: `${exaltado.name} - Exaltado PFDH`,
    description: `${
      exaltado.name
    }, exaltado al Pabellón de la Fama del Deporte Humacaeño en ${
      exaltado.yearInducted
    }. ${exaltado.sport} - ${exaltado.biography.substring(0, 150)}...`,
    keywords: [
      exaltado.name,
      exaltado.sport,
      "exaltado",
      String(exaltado.yearInducted),
    ],
    image: exaltado.photo || "/images/default-athlete.jpg",
    url: `/directorio/${slug}`,
    type: "profile",
  });
}

// Generar páginas estáticas para todos los 81 exaltados (Sprint 10)
export function generateStaticParams() {
  // Use todosLosExaltados from revista system (all 81 exaltados)
  return todosLosExaltados.map((exaltado) => ({
    slug: exaltado.id,
  }));
}

export default async function ExaltadoPage({ params }: ExaltadoPageProps) {
  const { slug } = await params;

  // Primero buscar en exaltados de revistas (más reciente)
  const exaltadoRevista = todosLosExaltados.find((e) => e.id === slug);

  // Si se encuentra en revistas, convertir al formato esperado
  if (exaltadoRevista) {
    const exaltadoAdaptado = {
      id: exaltadoRevista.id,
      nombre: exaltadoRevista.nombre,
      nombreCompleto: `${exaltadoRevista.nombre}${exaltadoRevista.apodo ? ` "${exaltadoRevista.apodo}"` : ''} ${exaltadoRevista.apellidos}`,
      name: `${exaltadoRevista.nombre} ${exaltadoRevista.apellidos}`,
      deporte: exaltadoRevista.deportes,
      sport: exaltadoRevista.deportes.join(', '),
      categoria: exaltadoRevista.categoria,
      anoExaltacion: exaltadoRevista.anoExaltacion,
      yearInducted: exaltadoRevista.anoExaltacion,
      biografia: exaltadoRevista.contenido.biografia,
      biography: exaltadoRevista.contenido.biografia,
      apodo: exaltadoRevista.apodo,
      logros: exaltadoRevista.contenido.logros,
      achievements: exaltadoRevista.contenido.logros,
      reconocimientos: exaltadoRevista.contenido.reconocimientos || [],
      estado: 'activo' as const,
      slug: exaltadoRevista.id,
    };

    const personJsonLd = generateJsonLd("person", {
      name: exaltadoAdaptado.name,
      biography: exaltadoAdaptado.biography,
      sport: exaltadoAdaptado.sport,
      achievements: exaltadoAdaptado.achievements || [],
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
        <ExaltadoDetail exaltado={exaltadoAdaptado} />
      </>
    );
  }

  // Si no está en revistas, buscar en data vieja
  const exaltado = exaltados.find((e) => e.slug === slug);

  if (!exaltado) {
    notFound();
  }

  // Structured data para la persona
  const personJsonLd = generateJsonLd("person", {
    name: exaltado.name,
    biography: exaltado.biography,
    sport: exaltado.sport,
    achievements: exaltado.achievements || [],
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd),
        }}
      />

      {/* Componente de detalle */}
      <ExaltadoDetail exaltado={exaltado} />
    </>
  );
}
