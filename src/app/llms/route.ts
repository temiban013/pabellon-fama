export const dynamic = 'force-static';

export async function GET() {
  const content = `# Pabellón de la Fama del Deporte Humacaeño

> Museo del Pabellón de la Fama del Deporte Humacaeño Manuel Rivera Guevara. Honrando la excelencia deportiva de Humacao, Puerto Rico desde 1996.

## Páginas Clave

- [Inicio](https://pabellon.org/): Página principal del Pabellón de la Fama
- [Directorio de Exaltados](https://pabellon.org/directorio): Todos los atletas, propulsores y personalidades exaltados
- [Museo Manuel Rivera Guevara](https://pabellon.org/museo): Exhibiciones, tour virtual y memorabilia deportiva
- [Junta de Directores](https://pabellon.org/junta): Líderes que preservan el legado deportivo de Humacao desde 1983
- [Historia del Pabellón](https://pabellon.org/historia): Más de 40 años celebrando la excelencia deportiva
- [Calendario de Actividades](https://pabellon.org/calendario): Ceremonias de exaltación, exhibiciones y eventos comunitarios
- [Horario y Contacto](https://pabellon.org/horario): Información de visita y ubicación del museo

## Recursos

- [Sitemap](https://pabellon.org/sitemap.xml): Lista canónica de URLs
- [Schema JSON-LD](https://pabellon.org#organization): Datos estructurados de la organización
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
