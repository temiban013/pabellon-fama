import { describe, it, expect, vi } from 'vitest';
import manifest from '@/data/revistas/blob-manifest.json';
import { blobUrl, BLOB_PUBLIC_HOST_SUFFIX, type BlobPdfName } from '@/lib/revistas/blob-url';
import nextConfig from '../../../next.config';

/**
 * PF-062: los PDFs de revistas viven en Vercel Blob. `blob-manifest.json` es
 * la fuente de verdad de URLs; estas pruebas son la barrera de cobertura:
 * ninguna revista sin URL absoluta, ninguna clave huérfana y un redirect 308
 * por cada PDF. `revistasMetadata` se importa de forma dinámica porque
 * `@/data/revistas` evalúa `blobUrl` al importarse y lanzaría si el
 * manifiesto quedara sin poblar.
 */

describe('blob-manifest — cobertura de revistasMetadata', () => {
  it('toda revista tiene pdfUrl absoluta alojada en Vercel Blob', async () => {
    const { revistasMetadata } = await import('@/data/revistas');

    for (const revista of revistasMetadata) {
      expect(
        revista.pdfUrl.startsWith('https://'),
        `${revista.slug}: pdfUrl "${revista.pdfUrl}" no empieza por https://`,
      ).toBe(true);

      const host = new URL(revista.pdfUrl).host;
      expect(
        host.endsWith(BLOB_PUBLIC_HOST_SUFFIX),
        `${revista.slug}: el host "${host}" no termina en "${BLOB_PUBLIC_HOST_SUFFIX}"`,
      ).toBe(true);
    }
  });

  it('ninguna clave del manifiesto queda huérfana y hay exactamente 9 claves', async () => {
    const { revistasMetadata } = await import('@/data/revistas');

    const claves = Object.keys(manifest);
    expect(claves).toHaveLength(9);

    const nombresUsados = new Set(
      revistasMetadata.map((revista) => revista.pdfUrl.split('/').pop()),
    );

    const huerfanas = claves.filter((clave) => !nombresUsados.has(clave));
    expect(
      huerfanas,
      `Claves del manifiesto que ninguna revista usa: ${huerfanas.join(', ')}`,
    ).toEqual([]);
  });
});

describe('blobUrl — validación de claves', () => {
  it('lanza un error en español cuando el valor de la clave está vacío', async () => {
    // Inyecta un manifiesto sin poblar para que la prueba no dependa del
    // estado real de blob-manifest.json (que ya tiene las URLs desde B.2).
    vi.resetModules();
    vi.doMock('@/data/revistas/blob-manifest.json', () => ({
      default: { 'revista-01.pdf': '' },
    }));
    try {
      const { blobUrl: blobUrlSinPoblar } = await import('@/lib/revistas/blob-url');
      expect(() => blobUrlSinPoblar('revista-01.pdf')).toThrow(/manifiesto de vercel blob/i);
    } finally {
      vi.doUnmock('@/data/revistas/blob-manifest.json');
      vi.resetModules();
    }
  });

  it('lanza un error en español cuando la clave no existe en el manifiesto', () => {
    expect(() => blobUrl('clave-que-no-existe' as BlobPdfName)).toThrow(/no existe la clave/i);
  });
});

describe('next.config — redirects de revistas hacia Vercel Blob', () => {
  it('mantiene los redirects previos y agrega uno por cada clave del manifiesto', async () => {
    const { revistasMetadata } = await import('@/data/revistas');

    const lista = (await nextConfig.redirects?.()) ?? [];

    const previos: Array<{ source: string; destination: string }> = [
      { source: '/home', destination: '/' },
      { source: '/inicio', destination: '/' },
      { source: '/exaltados', destination: '/directorio' },
    ];

    for (const previo of previos) {
      const entrada = lista.find((r) => r.source === previo.source);
      expect(entrada, `Falta el redirect previo "${previo.source}"`).toBeDefined();
      expect(entrada?.destination).toBe(previo.destination);
      expect(entrada?.permanent).toBe(true);
    }

    for (const [nombre, url] of Object.entries(manifest)) {
      const revista = revistasMetadata.find(
        (r) => r.pdfUrl.split('/').pop() === nombre,
      );
      expect(revista, `No hay revista en revistasMetadata para "${nombre}"`).toBeDefined();

      const entrada = lista.find((r) => r.source === `/revistas/completas/${nombre}`);
      expect(entrada, `Falta el redirect para "${nombre}"`).toBeDefined();
      expect(entrada?.permanent).toBe(true);
      expect(entrada?.destination).toBe(revista?.pdfUrl ?? url);
    }
  });
});
