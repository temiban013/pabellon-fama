import { SITE_URL } from "@/lib/constants/site";
import { NextResponse } from "next/server";
import { todosLosExaltados } from "@/data/exaltados-all";

export async function GET() {

  // URLs canónicas: `/directorio/<id>`, las mismas de `sitemap.xml`.
  const exaltadosUrls = todosLosExaltados.map((exaltado) => `
    <url>
      <loc>${SITE_URL}/directorio/${exaltado.id}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${exaltadosUrls}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}