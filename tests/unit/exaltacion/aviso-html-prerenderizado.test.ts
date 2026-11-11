import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { EXALTACION_2026 } from '@/lib/data/exaltacion-2026';
import { getFaseEvento } from '@/lib/exaltacion';

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
 * PF-072: las pruebas son sensibles a la fase del evento EN EL MOMENTO DEL BUILD (no la del
 * reloj de la prueba), porque el HTML estático congela la fase con que se generó. Se toma
 * la fecha de modificación de `.next/BUILD_ID` y se evalúa `getFaseEvento` con ella:
 * - fase "proxima"/"hoy": el aviso está en las páginas (salvo Inicio y la noticia, que lo
 *   ocultan por CSS) y las reglas CSS / marcas `data-pagina` se exigen como antes.
 * - fase "realizada": NINGUNA página prerenderizada contiene el aviso (su «Ver detalles →»,
 *   clase `aviso-exaltacion`), ni la tarjeta «Próximo gran evento», ni el JSON-LD `Event`
 *   de la Exaltación en Inicio. Las marcas `data-pagina` y la regla CSS se conservan
 *   (inofensivas) y se siguen comprobando.
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

/** Fase del evento cuando se hizo el build (mtime de BUILD_ID, o del HTML de Inicio). */
const ARCHIVO_BUILD = existsSync(path.join(RAIZ, '.next/BUILD_ID'))
  ? path.join(RAIZ, '.next/BUILD_ID')
  : HTML_INICIO;
const faseDelBuild = hayBuild
  ? getFaseEvento(EXALTACION_2026, statSync(ARCHIVO_BUILD).mtime)
  : 'proxima';
const avisoVigente = faseDelBuild !== 'realizada';

/** Todos los .html prerenderizados bajo .next/server/app (recursivo). */
function htmlsPrerenderizados(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const ruta = path.join(dir, d.name);
    if (d.isDirectory()) return htmlsPrerenderizados(ruta);
    return d.name.endsWith('.html') ? [ruta] : [];
  });
}
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

  describe.skipIf(avisoVigente)('build posterior al evento (fase realizada, PF-072)', () => {
    it('ninguna página prerenderizada contiene el aviso ni la tarjeta «Próximo gran evento»', () => {
      const paginas = htmlsPrerenderizados(DIR_APP);
      expect(paginas.length).toBeGreaterThan(0);
      for (const ruta of paginas) {
        const html = readFileSync(ruta, 'utf8');
        // Solo el «Ver detalles →» del aviso (span dorado subrayado); ExaltadoCard usa el
        // mismo texto en /directorio y no es parte de PF-072.
        expect(html, `${ruta} contiene «Ver detalles →» del aviso`).not.toContain(
          'text-pabellon-gold-400 underline">Ver detalles →',
        );
        expect(html, `${ruta} contiene la clase aviso-exaltacion`).not.toContain('aviso-exaltacion');
        expect(html, `${ruta} contiene «Próximo gran evento»`).not.toContain('Próximo gran evento');
      }
    });

    it('Inicio no trae el JSON-LD Event de la Exaltación', () => {
      const html = readFileSync(HTML_INICIO, 'utf8');
      const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
        (m) => m[1] ?? '',
      );
      for (const b of bloques) expect(b).not.toContain(EXALTACION_2026.titulo);
    });
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
    it.skipIf(!avisoVigente)('el aviso está en el HTML, con la clase y enlazando a la noticia', () => {
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
