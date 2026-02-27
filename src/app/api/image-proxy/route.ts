// src/app/api/image-proxy/route.ts
// Proxies Google Drive images to avoid cross-origin ORB blocking in Chrome
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["lh3.googleusercontent.com"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new Response(null, { status: response.status });
    }

    // Check Content-Length before downloading the full body
    const contentLength = response.headers.get("Content-Length");
    if (contentLength && parseInt(contentLength, 10) > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    // Validate content type is an image
    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const baseContentType = contentType.split(";")[0].trim();
    if (!ALLOWED_CONTENT_TYPES.includes(baseContentType)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
    }

    const buffer = await response.arrayBuffer();

    // Double-check size after download (Content-Length may be absent)
    if (buffer.byteLength > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
