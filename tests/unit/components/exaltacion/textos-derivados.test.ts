import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'src/components/exaltacion');
const PROHIBIDOS = ['1:00 p.m.', '8 de noviembre', '8 nov'] as const;

describe('textos de fecha/hora derivados de EXALTACION_2026', () => {
  const archivos = readdirSync(DIR).filter((f) => /\.(ts|tsx)$/.test(f));

  it('hay componentes que revisar', () => {
    expect(archivos.length).toBeGreaterThan(0);
  });

  it.each(archivos)('%s no escribe fecha/hora a mano', (archivo) => {
    const contenido = readFileSync(join(DIR, archivo), 'utf8');
    for (const texto of PROHIBIDOS) {
      expect(contenido, `«${texto}» literal en ${archivo}`).not.toContain(texto);
    }
  });
});
