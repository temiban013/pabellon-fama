import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  generateMetadata as generateSEOMetadata,
  generateJsonLd,
} from "@/lib/seo";
import { exaltados } from "@/data/exaltados";
import { parseDateLocal } from "@/lib/date-utils";
import { todosLosExaltados } from "@/data/exaltados-all";
import { ExaltadoDetail } from "@/components/directorio/ExaltadoDetail";
import { jsonLdExaltado, metadataExaltado } from "@/lib/directorio/seo";
import { dimensionesImagenPublica } from "@/lib/imagen-publica";

/**
 * Busca al exaltado por su id canónico. Si `slug` es uno de los slugs viejos
 * (derivados del nombre completo en `exaltados.json`), devuelve el mismo
 * exaltado para que la página declare como canónica `/directorio/<id>`.
 */
function resolverExaltado(slug: string) {
  const porId = todosLosExaltados.find((e) => e.id === slug);
  if (porId) return porId;

  const viejo = exaltados.find((e) => e.slug === slug);
  return viejo ? todosLosExaltados.find((e) => e.id === viejo.id) : undefined;
}

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
  const exaltadoRevista = resolverExaltado(slug);

  if (exaltadoRevista) {
    return metadataExaltado(exaltadoRevista);
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

// Generar páginas estáticas para todos los exaltados (Sprint 10)
export function generateStaticParams() {
  // Use todosLosExaltados from revista system (todas las entradas, personas y equipos)
  return todosLosExaltados.map((exaltado) => ({
    slug: exaltado.id,
  }));
}

export default async function ExaltadoPage({ params }: ExaltadoPageProps) {
  const { slug } = await params;

  // Primero buscar en exaltados de revistas (más reciente)
  const exaltadoRevista = resolverExaltado(slug);

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
      foto: exaltadoRevista.foto,
      photo: exaltadoRevista.foto,
      estado: exaltadoRevista.estado ?? ('activo' as const),
      fechaFallecimiento: exaltadoRevista.fechaFallecimiento
        ? parseDateLocal(exaltadoRevista.fechaFallecimiento).toLocaleDateString(
            "es-PR",
            { day: "numeric", month: "long", year: "numeric" }
          )
        : undefined,
      slug: exaltadoRevista.id,
      entrevistaYoutubeId: exaltadoRevista.entrevistaYoutubeId,
    };

    const datosEstructurados = jsonLdExaltado(
      exaltadoRevista,
      exaltadoRevista.foto
        ? await dimensionesImagenPublica(exaltadoRevista.foto)
        : undefined,
    );

    return (
      <>
        {datosEstructurados.map((datos, indice) => (
          <script
            key={indice}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
          />
        ))}
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
