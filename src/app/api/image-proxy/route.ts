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

// Rate limiting storage (in-memory, resets on deployment)
const rateLimits = new Map<string, { count: number; resetAt: number; firstAttempt: number }>();

// Rate limit configuration - tuned for image proxy
// Calendar pages load multiple images, so we need a higher limit with shorter window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute (not 1 hour like registro)
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per IP
const RATE_LIMIT_CLEANUP_INTERVAL = 5 * 60 * 1000; // Cleanup every 5 minutes

let lastCleanup = Date.now();
function cleanupRateLimits() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, limit] of rateLimits.entries()) {
    if (limit.resetAt < now) {
      rateLimits.delete(key);
    }
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupRateLimits();
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || limit.resetAt < now) {
    const resetAt = now + RATE_LIMIT_WINDOW;
    rateLimits.set(ip, { count: 1, resetAt, firstAttempt: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt };
  }

  if (limit.count < RATE_LIMIT_MAX_REQUESTS) {
    limit.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - limit.count, resetAt: limit.resetAt };
  }

  return { allowed: false, remaining: 0, resetAt: limit.resetAt };
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;
  return "unknown";
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Rate limit check
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Límite de solicitudes excedido. Intenta de nuevo en un momento." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateLimit.resetAt.toString(),
          "Retry-After": retryAfter.toString(),
        },
      }
    );
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
