/**
 * URL canónica única del sitio (PF-066).
 *
 * Los demás dominios del proyecto en Vercel redirigen con 308 a www.pfdh.org,
 * así que ésa es la única que puede aparecer en canonical, sitemap, robots y
 * JSON-LD. La prueba tests/unit/seo/url-canonica.test.ts impide reintroducirlos.
 * `NEXT_PUBLIC_BASE_URL` permite sobreescribirla (se inlinea en el build,
 * por lo que también es válida en componentes cliente).
 */
const FALLBACK_SITE_URL = "https://www.pfdh.org";

export const SITE_URL: string = (process.env.NEXT_PUBLIC_BASE_URL ?? FALLBACK_SITE_URL).replace(/\/+$/, "");

export const siteUrl = (path: string = "/"): string => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
