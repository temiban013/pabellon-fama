import { describe, it, expect } from 'vitest';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  BLOB_BASE_URL,
  DIRECTORIO_POR_DEFECTO,
  leerManifiesto,
  pathnameFull,
  pathnameThumb,
  PATHNAME_OG,
  resolverDirectorioMedia,
  urlBlob,
} from '../../../scripts/galerias/manifiesto';

const FIXTURE = join(process.cwd(), 'tests/fixtures/galeria-novena');

type ManifiestoCrudo = {
  evento: string;
  seleccion: {
    id: string;
    alt: string;
    categoria: string;
    thumb: { width: number };
    full: { archivo: string };
  }[];
  destacadas: { portada: string; og: { width: number } };
};

/** Copia el fixture a un directorio temporal aplicando `mutar` al JSON. */
function fixtureMutado(mutar: (m: ManifiestoCrudo) => void): string {
  const dir = mkdtempSync(join(tmpdir(), 'galeria-'));
  cpSync(FIXTURE, dir, { recursive: true });
  const manifiesto = JSON.parse(
    readFileSync(join(dir, 'manifest.json'), 'utf-8'),
  ) as ManifiestoCrudo;
  mutar(manifiesto);
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifiesto));
  return dir;
}

describe('resolverDirectorioMedia', () => {
  it('prefiere GALERIA_NOVENA_DIR si contiene manifest.json', () => {
    const dir = resolverDirectorioMedia({ GALERIA_NOVENA_DIR: '/x' }, () => true);
    expect(dir).toBe('/x');
  });

  it('falla con mensaje claro si GALERIA_NOVENA_DIR no tiene manifest.json', () => {
    expect(() => resolverDirectorioMedia({ GALERIA_NOVENA_DIR: '/x' }, () => false)).toThrow(
      /no existe manifest\.json/,
    );
  });

  it('usa la ruta por defecto de pabellon-media si existe', () => {
    expect(resolverDirectorioMedia({}, (ruta) => ruta === DIRECTORIO_POR_DEFECTO)).toBe(
      DIRECTORIO_POR_DEFECTO,
    );
  });

  it('sin variable y sin ruta por defecto lanza un error en español', () => {
    expect(() => resolverDirectorioMedia({}, () => false)).toThrow(/GALERIA_NOVENA_DIR/);
  });
});

describe('leerManifiesto', () => {
  it('acepta el fixture', () => {
    const m = leerManifiesto(FIXTURE);
    expect(m.seleccion).toHaveLength(3);
    expect(m.destacadas.portada).toBe('fixture-001');
  });

  it('rechaza ids repetidos', () => {
    const dir = fixtureMutado((m) => {
      m.seleccion[1].id = 'fixture-001';
    });
    expect(() => leerManifiesto(dir)).toThrow(/id repetido/);
  });

  it('rechaza alt vacío', () => {
    const dir = fixtureMutado((m) => {
      m.seleccion[0].alt = '  ';
    });
    expect(() => leerManifiesto(dir)).toThrow(/alt/);
  });

  it('rechaza dimensiones no positivas', () => {
    const dir = fixtureMutado((m) => {
      m.seleccion[0].thumb.width = 0;
    });
    expect(() => leerManifiesto(dir)).toThrow(/thumb\.width/);
  });

  it('rechaza una categoría desconocida', () => {
    const dir = fixtureMutado((m) => {
      m.seleccion[0].categoria = 'otra';
    });
    expect(() => leerManifiesto(dir)).toThrow(/categoria/);
  });

  it('rechaza una portada que no está en la selección', () => {
    const dir = fixtureMutado((m) => {
      m.destacadas.portada = 'no-existe';
    });
    expect(() => leerManifiesto(dir)).toThrow(/portada/);
  });

  it('rechaza un og que no es 1200x630', () => {
    const dir = fixtureMutado((m) => {
      m.destacadas.og.width = 1000;
    });
    expect(() => leerManifiesto(dir)).toThrow(/1200x630/);
  });

  it('rechaza un evento distinto', () => {
    const dir = fixtureMutado((m) => {
      m.evento = 'otro';
    });
    expect(() => leerManifiesto(dir)).toThrow(/evento/);
  });

  it('rechaza archivos de derivados que no siguen el patrón por id', () => {
    const dir = fixtureMutado((m) => {
      m.seleccion[0].full.archivo = 'derivados/full/otro.webp';
    });
    expect(() => leerManifiesto(dir)).toThrow(/full\.archivo/);
  });

  it('informa claramente si falta el manifest.json', () => {
    expect(() => leerManifiesto(join(tmpdir(), 'no-existe-galeria'))).toThrow(
      /No se pudo leer/,
    );
  });
});

describe('URLs deterministas de Blob', () => {
  it('coinciden con los pathnames acordados', () => {
    expect(pathnameFull('a')).toBe('galerias/novena-exaltacion-2026/full/a.webp');
    expect(pathnameThumb('a')).toBe('galerias/novena-exaltacion-2026/thumb/a.webp');
    expect(PATHNAME_OG).toBe('galerias/novena-exaltacion-2026/og-1200x630.jpg');
    expect(urlBlob(PATHNAME_OG)).toBe(`${BLOB_BASE_URL}/${PATHNAME_OG}`);
  });
});
