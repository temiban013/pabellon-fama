import { NextResponse } from "next/server";
import { exaltados } from "@/data/exaltados";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pabellon.org";

  const exaltadosUrls = exaltados.map((exaltado) => `
    <url>
      <loc>${baseUrl}/directorio/${exaltado.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
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