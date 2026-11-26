import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { parseDateLocal } from "@/lib/date-utils";
import { todosLosExaltados } from "@/data/exaltados-all";
import { ExaltadoDetail } from "@/components/directorio/ExaltadoDetail";
import { idCanonicoDeAlias } from "@/lib/directorio/alias";
import { jsonLdExaltado, metadataExaltado } from "@/lib/directorio/seo";
import { dimensionesImagenPublica } from "@/lib/imagen-publica";

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

  const exaltado = todosLosExaltados.find((e) => e.id === slug);

  if (!exaltado) {
    return {
      title: "Exaltado no encontrado",
      description:
        "El exaltado solicitado no fue encontrado en nuestra base de datos.",
    };
  }

  return metadataExaltado(exaltado);
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

  const exaltadoRevista = todosLosExaltados.find((e) => e.id === slug);

  if (!exaltadoRevista) {
    // Dirección vieja (slug derivado del nombre): 308 al perfil canónico.
    const idCanonico = idCanonicoDeAlias(slug);
    if (idCanonico) {
      permanentRedirect(`/directorio/${idCanonico}`);
    }
    notFound();
  }

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
    fotoFoco: exaltadoRevista.fotoFoco,
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
