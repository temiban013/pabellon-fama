import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  generateMetadata as generateSEOMetadata,
  generateJsonLd,
} from "@/lib/seo";
import { exaltados } from "@/data/exaltados";
import { ExaltadoDetail } from "@/components/directorio/ExaltadoDetail";

interface ExaltadoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Metadata dinámica para cada exaltado
export async function generateMetadata({
  params,
}: ExaltadoPageProps): Promise<Metadata> {
  const { slug } = await params;
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

// Generar páginas estáticas para todos los exaltados
export function generateStaticParams() {
  return exaltados.map((exaltado) => ({
    slug: exaltado.slug,
  }));
}

export default async function ExaltadoPage({ params }: ExaltadoPageProps) {
  const { slug } = await params;
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
