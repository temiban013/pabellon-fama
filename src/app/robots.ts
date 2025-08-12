// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://pabellon.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/test/", "/_next/", "/data/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/test/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
