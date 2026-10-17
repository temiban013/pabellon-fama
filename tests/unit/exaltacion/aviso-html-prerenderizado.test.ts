import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * PF-065 (defecto post-deploy): el aviso global de la Novena Exaltación salía en el HTML
 * de Inicio en producción. Estas pruebas leen el HTML REAL que produce `next build`
 * (`.next/server/app/*.html`) y el CSS compilado que enlaza, sin mockear `usePathname`.
 *
 * Por qué se comprueba el mecanismo CSS y no solo "el aviso no está en el HTML": en
 * `next build` local `usePathname()` vale "/" durante el prerender de Inicio, pero en
 * Vercel (ISR, `revalidate`) el payload RSC de "/" trae `"c":["","index"]`, o sea la ruta
 * "/index", y una comparación por pathname falla ahí sin que el build local lo note.
 * El ocultamiento por CSS (`body:has([data-pagina=…]) .aviso-exaltacion`) no depende de
 * la ruta que vea el servidor, así que es lo que se exige.
 *
 * Requiere `pnpm build` previo. Sin build (clon limpio) las pruebas se omiten con una
 * advertencia para no romper `pnpm test:run`; con `REQUIRE_NEXT_BUILD=1` fallan en su lugar.
 */
const RAIZ = path.resolve(__dirname, '../../..');
const DIR_APP = path.join(RAIZ, '.next/server/app');
const RUTA_NOTICIA = '/noticias/novena-exaltacion-2026';
const HTML_INICIO = path.join(DIR_APP, 'index.html');
const HTML_HISTORIA = path.join(DIR_APP, 'historia.html');
const HTML_NOTICIA = path.join(DIR_APP, 'noticias/novena-exaltacion-2026.html');

const hayBuild = [HTML_INICIO, HTML_HISTORIA, HTML_NOTICIA].every((f) => existsSync(f));
const exigirBuild = process.env.REQUIRE_NEXT_BUILD === '1';

if (!hayBuild && !exigirBuild) {
  console.warn(
    '[aviso-html-prerenderizado] OMITIDO: no existe .next/server/app/*.html; ejecuta `pnpm build` antes (REQUIRE_NEXT_BUILD=1 lo convierte en fallo).',
  );
}

interface Pagina {
  html: string;
  /** HTML anterior a `<main id="main-content"`: donde el layout pone el aviso. */
  antesDeMain: string;
  /** HTML desde `<main id="main-content"`. */
  main: string;
  css: string;
}

function cargar(ruta: string): Pagina {
  const html = readFileSync(ruta, 'utf8');
  const i = html.indexOf('<main id="main-content"');
  expect(i, `${ruta} no contiene <main id="main-content"`).toBeGreaterThan(-1);
  const css = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="(\/_next\/[^"]+\.css)"/g)]
    .map((m) => readFileSync(path.join(RAIZ, '.next', (m[1] ?? '').replace('/_next/', '')), 'utf8'))
    .join('\n');
  return { html, antesDeMain: html.slice(0, i), main: html.slice(i), css };
}

/** Reglas del CSS compilado cuyo selector menciona `.aviso-exaltacion`. */
function reglasDelAviso(css: string): { selector: string; cuerpo: string }[] {
  return [...css.matchAll(/([^{}]*\.aviso-exaltacion[^{}]*)\{([^{}]*)\}/g)].map((m) => ({
    selector: (m[1] ?? '').trim(),
    cuerpo: (m[2] ?? '').replace(/\s/g, ''),
  }));
}

/** ¿Hay una regla `:has([data-pagina=<valor>])` que pone display:none al aviso? */
function reglaOcultaAvisoEn(css: string, valor: string): boolean {
  return reglasDelAviso(css).some(
    (r) =>
      r.selector.includes(':has(') &&
      new RegExp(`\\[data-pagina=["']?${valor}["']?\\]`).test(r.selector) &&
      r.cuerpo.includes('display:none'),
  );
}

function tieneAviso(p: Pagina): boolean {
  return p.antesDeMain.includes(`href="${RUTA_NOTICIA}"`);
}

function avisoConClase(p: Pagina): boolean {
  return /class="[^"]*\baviso-exaltacion\b[^"]*"[^>]*href="\/noticias\/novena-exaltacion-2026"|href="\/noticias\/novena-exaltacion-2026"[^>]*class="[^"]*\baviso-exaltacion\b/.test(
    p.antesDeMain,
  );
}

describe.skipIf(!hayBuild && !exigirBuild)('aviso de la Novena Exaltación en el HTML prerenderizado', () => {
  it('existe el build (pnpm build) con las tres páginas', () => {
    expect(
      hayBuild,
      'Falta .next/server/app/{index,historia,noticias/novena-exaltacion-2026}.html: ejecuta pnpm build antes.',
    ).toBe(true);
  });

  describe('Inicio (/)', () => {
    it('el aviso, si está en el HTML, lleva la clase aviso-exaltacion', () => {
      const p = cargar(HTML_INICIO);
      if (tieneAviso(p)) expect(avisoConClase(p)).toBe(true);
    });

    it('marca su contenido con data-pagina="inicio"', () => {
      const p = cargar(HTML_INICIO);
      expect(p.main).toContain('data-pagina="inicio"');
    });

    it('el CSS compilado oculta .aviso-exaltacion cuando hay data-pagina="inicio"', () => {
      const p = cargar(HTML_INICIO);
      expect(reglaOcultaAvisoEn(p.css, 'inicio')).toBe(true);
    });
  });

  describe('noticia de la Exaltación', () => {
    it('marca su contenido con data-pagina="noticia-exaltacion"', () => {
      const p = cargar(HTML_NOTICIA);
      expect(p.main).toContain('data-pagina="noticia-exaltacion"');
    });

    it('el CSS compilado oculta .aviso-exaltacion cuando hay data-pagina="noticia-exaltacion"', () => {
      const p = cargar(HTML_NOTICIA);
      expect(reglaOcultaAvisoEn(p.css, 'noticia-exaltacion')).toBe(true);
    });
  });

  describe('otra página (/historia)', () => {
    it('el aviso está en el HTML, con la clase y enlazando a la noticia', () => {
      const p = cargar(HTML_HISTORIA);
      expect(tieneAviso(p)).toBe(true);
      expect(avisoConClase(p)).toBe(true);
    });

    it('no lleva marcas data-pagina que activen la regla de ocultar', () => {
      const p = cargar(HTML_HISTORIA);
      expect(p.html).not.toMatch(/data-pagina="(inicio|noticia-exaltacion)"/);
    });
  });

  describe('CSS compilado', () => {
    it('toda regla sobre .aviso-exaltacion está condicionada por :has(...) (nunca oculta el aviso en todas partes)', () => {
      const reglas = reglasDelAviso(cargar(HTML_INICIO).css);
      expect(reglas.length).toBeGreaterThan(0);
      for (const r of reglas) expect(r.selector).toContain(':has(');
    });
  });
});
