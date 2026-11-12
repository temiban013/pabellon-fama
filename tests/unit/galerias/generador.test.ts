import { describe, it, expect } from 'vitest';
import { cpSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  construirContenido,
  generarGaleria,
  medirImagen,
  RUTA_DATOS,
} from '../../../scripts/galerias/generador';
import { leerManifiesto } from '../../../scripts/galerias/manifiesto';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';

const RAIZ = process.cwd();
const FIXTURE = join(RAIZ, 'tests/fixtures/galeria-novena');

describe('generador de la galería de la Novena', () => {
  it('mide el flyer con sharp: 1024x1536', async () => {
    const dim = await medirImagen(join(RAIZ, 'public', EXALTACION_2026.flyer.src));
    expect(dim).toEqual({ width: 1024, height: 1536 });
  });

  it('contenido: encabezado de archivo generado y flyer como primera foto', () => {
    const contenido = construirContenido(leerManifiesto(FIXTURE), { width: 1024, height: 1536 });
    expect(contenido).toContain('ARCHIVO GENERADO — no editar a mano');
    expect(contenido).toContain('"id": "invitacion"');
    expect(contenido.indexOf('"id": "invitacion"')).toBeLessThan(
      contenido.indexOf('"id": "fixture-001"'),
    );
    expect(contenido).toContain('"pie": "La invitación"');
  });

  it('escribe el archivo de datos desde el fixture (en una raíz temporal)', async () => {
    const raiz = mkdtempSync(join(tmpdir(), 'raiz-'));
    const flyerRel = join('public', EXALTACION_2026.flyer.src);
    mkdirSync(dirname(join(raiz, flyerRel)), { recursive: true });
    cpSync(join(RAIZ, flyerRel), join(raiz, flyerRel));

    const { salida, fotos } = await generarGaleria(FIXTURE, raiz);
    expect(fotos).toBe(4);
    expect(salida).toBe(join(raiz, RUTA_DATOS));

    const texto = readFileSync(salida, 'utf-8');
    expect(texto).toContain('"width": 1024');
    expect(texto).toContain('"width": 1067');
    expect(texto).toContain('/galerias/novena-exaltacion-2026/full/fixture-002.webp');
    expect(texto).toContain('/galerias/novena-exaltacion-2026/og-1200x630.jpg');
    // pie null en el manifest no genera la clave `pie`: flyer + fixture-002
    expect(texto.match(/"pie":/g)).toHaveLength(2);
    expect(texto).toContain('credito: null');
  });
});
