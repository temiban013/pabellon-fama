import { describe, it, expect, vi } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * PF-066 — Una sola URL canónica (https://www.pfdh.org).
 *
 * Los dominios de abajo redirigen con 308 a www.pfdh.org. Si el código los
 * declara como canónicos, Google recibe señales contradictorias. Esta prueba
 * impide que alguno vuelva a entrar en src/: la URL sale siempre de
 * SITE_URL / siteUrl() en src/lib/constants/site.ts.
 */
const RAIZ = join(__dirname, '..', '..', '..');
const SRC = join(RAIZ, 'src');

const DOMINIOS_PROHIBIDOS = [
  'pabellondelafama.com',
  'pabellondefama.com',
  'pabellondelafama.org',
  'https://pabellon.org',
];

function archivosTs(dir: string): string[] {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) return archivosTs(ruta);
    return /\.(ts|tsx)$/.test(nombre) ? [ruta] : [];
  });
}

describe('URL canónica — ningún dominio de redirección en src/', () => {
  it('ningún .ts/.tsx escribe a mano un dominio que redirige', () => {
    const hallazgos: string[] = [];

    for (const archivo of archivosTs(SRC)) {
      const lineas = readFileSync(archivo, 'utf8').split('\n');
      lineas.forEach((linea, i) => {
        for (const dominio of DOMINIOS_PROHIBIDOS) {
          if (linea.includes(dominio)) {
            hallazgos.push(`${relative(RAIZ, archivo)}:${i + 1} contiene «${dominio}»`);
          }
        }
      });
    }

    expect(
      hallazgos,
      `Dominios que redirigen a www.pfdh.org y no deben escribirse a mano:\n${hallazgos.join('\n')}\n` +
        'Usa SITE_URL o siteUrl() de @/lib/constants/site.',
    ).toEqual([]);
  });
});

describe('siteUrl()', () => {
  async function cargar(baseUrl: string | undefined) {
    const anterior = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl === undefined) delete process.env.NEXT_PUBLIC_BASE_URL;
    else process.env.NEXT_PUBLIC_BASE_URL = baseUrl;
    try {
      vi.resetModules();
      return await import('@/lib/constants/site');
    } finally {
      if (anterior === undefined) delete process.env.NEXT_PUBLIC_BASE_URL;
      else process.env.NEXT_PUBLIC_BASE_URL = anterior;
    }
  }

  it('sin variable de entorno cae a https://www.pfdh.org', async () => {
    const { SITE_URL } = await cargar(undefined);
    expect(SITE_URL).toBe('https://www.pfdh.org');
  });

  it('antepone la base a una ruta con barra inicial', async () => {
    const { siteUrl } = await cargar('https://www.pfdh.org');
    expect(siteUrl('/x')).toBe('https://www.pfdh.org/x');
  });

  it('agrega la barra inicial cuando la ruta no la trae', async () => {
    const { siteUrl } = await cargar('https://www.pfdh.org');
    expect(siteUrl('x')).toBe('https://www.pfdh.org/x');
  });

  it('"/" y el valor por defecto devuelven la raíz con barra', async () => {
    const { siteUrl } = await cargar('https://www.pfdh.org');
    expect(siteUrl('/')).toBe('https://www.pfdh.org/');
    expect(siteUrl()).toBe('https://www.pfdh.org/');
  });

  it('SITE_URL no conserva barras finales de la variable de entorno', async () => {
    const { SITE_URL, siteUrl } = await cargar('https://www.pfdh.org//');
    expect(SITE_URL).toBe('https://www.pfdh.org');
    expect(siteUrl('/x')).toBe('https://www.pfdh.org/x');
  });
});
