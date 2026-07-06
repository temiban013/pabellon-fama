# Visitas Distinguidas — diseño

**Fecha:** 6 de julio de 2026
**Clasificación:** BILLABLE-NEW-FEATURE (aprobado por Quique)

## Problema

Quique envió una foto de la visita al museo del exatleta Samuel Caraballo y su esposa Miriam Martínez, pidiendo que aparezca en la página con un caption. El sitio no tiene ningún lugar para fotos de visitantes: la única galería con captions es el tour 360° (`src/lib/museo-tour.ts`), que es un conjunto curado de fotos de exhibiciones — una foto de visitantes no pertenece ahí.

## Decisiones (validadas con el usuario)

1. **Recurrencia:** estructura lista para crecer (pueden llegar más fotos de visitas), pero la UI muestra solo esta foto por ahora.
2. **Ubicación:** página `/museo`, nueva sección entre "Tour Virtual" y "Nuestras Exhibiciones".
3. **Título de la sección:** "Visitas Distinguidas".
4. **Enfoque:** archivo de datos nuevo (`src/data/visitas.ts`) + componente nuevo (`src/components/museo/VisitasDistinguidas.tsx`). Se descartó agregar la foto al tour 360° (mezcla semántica, foto escondida tras el botón de galería) y reutilizar `FotoHistorica` (modelo de datos atado a revistas).
5. **Caption:** ortografía corregida (Martínez, olímpica, exatleta):
   > Recibimos en nuestro museo la visita del exatleta puertorriqueño Samuel Caraballo y su esposa Miriam Martínez, radicados en Newton, Massachusetts. Samuel fue uno de varios portadores de la antorcha olímpica en Barcelona 1992.

## Arquitectura

- **Imagen:** `public/images/museo/visitas/2026-07-samuel-caraballo.jpg` — 1200×1600 (rotada según EXIF, ~290 KB). Fecha de la visita según EXIF: 3 de julio de 2026.
- **Datos:** `src/data/visitas.ts` — `interface Visita { id, src, alt, caption, fecha }` + `export const visitas: Visita[]`. Sigue el patrón de `fotos-historicas.ts` / `museo-tour.ts`.
- **Componente:** `VisitasDistinguidas.tsx` — server component (sin interactividad), mapea `visitas`. Encabezado de sección con la barra dorada del sitio; cada visita en un `card-pabellon` con foto vertical (`next/image`) a la izquierda y caption + fecha a la derecha en desktop, apilado en móvil. Todo el texto en español.
- **Integración:** `src/app/museo/page.tsx`, sección `id="visitas"` entre Tour Virtual y Exhibiciones.

## Verificación

- `npm run build` exitoso (obligatorio).
- `/museo` en dev: foto vertical correcta, acentos correctos, layout responsivo.
- Pre-deploy: Android Chrome (dispositivo real) + Chrome/Firefox desktop.
