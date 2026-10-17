import { siteUrl } from "@/lib/constants/site";
import { PABELLON_CONSTANTS } from "@/lib/utils";

export const dynamic = 'force-static';

export async function GET() {
  const content = `# Pabellón de la Fama del Deporte Humacaeño

> Museo del Pabellón de la Fama del Deporte Humacaeño Manuel Rivera Guevara. Honrando la excelencia deportiva de Humacao, Puerto Rico desde ${PABELLON_CONSTANTS.FOUNDED_YEAR}.

## Páginas Clave

- [Inicio](${siteUrl("/")}): Página principal del Pabellón de la Fama
- [Directorio de Exaltados](${siteUrl("/directorio")}): Todos los atletas, propulsores y personalidades exaltados
- [Museo Manuel Rivera Guevara](${siteUrl("/museo")}): Exhibiciones, tour virtual y memorabilia deportiva
- [Junta de Directores](${siteUrl("/junta")}): Líderes que preservan el legado deportivo de Humacao desde ${PABELLON_CONSTANTS.FOUNDED_YEAR}
- [Historia del Pabellón](${siteUrl("/historia")}): Más de 25 años celebrando la excelencia deportiva
- [Calendario de Actividades](${siteUrl("/calendario")}): Ceremonias de exaltación, exhibiciones y eventos comunitarios
- [Horario y Contacto](${siteUrl("/horario")}): Información de visita y ubicación del museo

## Recursos

- [Sitemap](${siteUrl("/sitemap.xml")}): Lista canónica de URLs
- [Schema JSON-LD](${siteUrl("/")}#organization): Datos estructurados de la organización
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
