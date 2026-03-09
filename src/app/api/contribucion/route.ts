// app/api/contribucion/route.ts - API for community data contributions
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContribucion } from "@/lib/validations/contribucion";
import { getExaltadoById } from "@/data/exaltados-all";
import {
  buildAdminNotificationEmail,
  buildContributorConfirmationEmail,
} from "@/lib/email/contribucion-template";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting storage (in-memory, resets on deployment)
// For production with multiple instances, use Redis or Vercel KV
const rateLimits = new Map<
  string,
  { count: number; resetAt: number; firstAttempt: number }
>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per window
const RATE_LIMIT_CLEANUP_INTERVAL = 10 * 60 * 1000; // Clean up every 10 minutes

// Cleanup old rate limit entries periodically
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

// Check rate limit for IP address
function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  cleanupRateLimits();

  const now = Date.now();
  const limit = rateLimits.get(ip);

  // No previous requests or window expired
  if (!limit || limit.resetAt < now) {
    const resetAt = now + RATE_LIMIT_WINDOW;
    rateLimits.set(ip, { count: 1, resetAt, firstAttempt: now });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetAt,
    };
  }

  // Within rate limit
  if (limit.count < RATE_LIMIT_MAX_REQUESTS) {
    limit.count++;
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - limit.count,
      resetAt: limit.resetAt,
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetAt: limit.resetAt,
  };
}

// Get client IP address
function getClientIp(request: NextRequest): string {
  // Check various headers for IP (Vercel provides these)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;

  return "unknown";
}

// Headers de seguridad para API
const apiHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

// Función helper para respuestas de error
function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    { success: false, error },
    { status, headers: apiHeaders }
  );
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Map tipoContribucion to Spanish labels
const tipoLabels: Record<string, string> = {
  estadisticas: "Estadísticas",
  "datos-personales": "Datos Personales",
  trayectoria: "Trayectoria Deportiva",
  reconocimientos: "Reconocimientos",
  conexiones: "Conexiones y Relaciones",
  correccion: "Corrección de Datos",
  otro: "Otro",
};

// Handler principal para POST
export async function POST(request: NextRequest) {
  try {
    // Check rate limit first (before any processing)
    // Skip rate limiting in E2E test environment (detected by test API key)
    const isE2ETestMode = process.env.RESEND_API_KEY?.startsWith("re_test_");

    if (!isE2ETestMode) {
      const clientIp = getClientIp(request);
      const rateLimit = checkRateLimit(clientIp);

      if (!rateLimit.allowed) {
        const minutesUntilReset = Math.ceil(
          (rateLimit.resetAt - Date.now()) / 60000
        );

        return NextResponse.json(
          {
            success: false,
            error: `Has excedido el límite de contribuciones. Por favor, intenta nuevamente en ${minutesUntilReset} minutos.`,
          },
          {
            status: 429,
            headers: {
              ...apiHeaders,
              "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": rateLimit.resetAt.toString(),
              "Retry-After": Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            },
          }
        );
      }
    }

    // Verificar Content-Type (accept both multipart/form-data and application/json for backwards compat)
    const contentType = request.headers.get("content-type");
    const isMultipart = contentType?.includes("multipart/form-data");
    const isJson = contentType?.includes("application/json");

    if (!isMultipart && !isJson) {
      return errorResponse("Content-Type debe ser multipart/form-data o application/json", 415);
    }

    // Parsear body — extract form data and optional files
    let body;
    let archivos: File[] = [];

    try {
      if (isMultipart) {
        const formDataRaw = await request.formData();
        const datosRaw = formDataRaw.get("datos");
        if (!datosRaw || typeof datosRaw !== "string") {
          return errorResponse("Campo 'datos' requerido en FormData", 400);
        }
        body = JSON.parse(datosRaw);
        archivos = formDataRaw
          .getAll("archivos")
          .filter((item): item is File => item instanceof File && item.size > 0);
      } else {
        body = await request.json();
      }
    } catch {
      return errorResponse("Datos inválidos en el cuerpo de la petición", 400);
    }

    // Validate attached files
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB per file
    const MAX_TOTAL_SIZE = 4 * 1024 * 1024; // 4 MB total

    if (archivos.length > 5) {
      return errorResponse("Máximo 5 archivos permitidos", 422);
    }

    for (const archivo of archivos) {
      if (!ALLOWED_FILE_TYPES.includes(archivo.type)) {
        return errorResponse(
          `Tipo de archivo no permitido: ${archivo.name}. Solo JPEG, PNG, WebP y PDF.`,
          422
        );
      }
      if (archivo.size > MAX_FILE_SIZE) {
        return errorResponse(
          `El archivo ${archivo.name} excede el límite de 2 MB`,
          422
        );
      }
    }

    const totalFileSize = archivos.reduce((sum, f) => sum + f.size, 0);
    if (totalFileSize > MAX_TOTAL_SIZE) {
      return errorResponse("Los archivos exceden el límite total de 4 MB", 422);
    }

    // Inject file count for Zod validation and email template
    body.cantidadArchivos = archivos.length;

    // Honeypot check BEFORE Zod validation
    if (body.honeypot) {
      return errorResponse("Datos inválidos", 422);
    }

    // Validar datos con Zod
    const validation = validateContribucion(body);
    if (!validation.success) {
      const errorMessages = validation.error.issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return errorResponse(`Datos inválidos: ${errorMessages}`, 422);
    }

    const validatedData = validation.data;

    // Verify exaltado exists
    const exaltado = getExaltadoById(validatedData.exaltadoId);
    if (!exaltado) {
      return errorResponse("Exaltado no encontrado", 404);
    }

    // HTML-escape all text fields
    const safeNombre = escapeHtml(validatedData.contribuidorNombre);
    const safeEmail = escapeHtml(validatedData.contribuidorEmail);
    const safeTelefono = validatedData.contribuidorTelefono
      ? escapeHtml(validatedData.contribuidorTelefono)
      : undefined;
    const safeExaltadoNombre = escapeHtml(validatedData.exaltadoNombre);
    const safeInformacion = escapeHtml(validatedData.informacion);
    const safeFuente = escapeHtml(validatedData.fuenteInformacion);
    const safeRelacionDetalle = validatedData.relacionDetalle
      ? escapeHtml(validatedData.relacionDetalle)
      : undefined;

    // Escape estadisticas if present
    const safeEstadisticas = validatedData.estadisticasEspecificas?.map((e) => ({
      categoria: escapeHtml(e.categoria),
      dato: escapeHtml(e.dato),
      valor: escapeHtml(e.valor),
      temporadaOAno: e.temporadaOAno ? escapeHtml(e.temporadaOAno) : undefined,
      equipo: e.equipo ? escapeHtml(e.equipo) : undefined,
    }));

    // Escape datos personales if present
    const safeDatosPersonales = validatedData.datosPersonales
      ? {
          fechaNacimiento: validatedData.datosPersonales.fechaNacimiento
            ? escapeHtml(validatedData.datosPersonales.fechaNacimiento)
            : undefined,
          lugarNacimiento: validatedData.datosPersonales.lugarNacimiento
            ? escapeHtml(validatedData.datosPersonales.lugarNacimiento)
            : undefined,
          estatura: validatedData.datosPersonales.estatura
            ? escapeHtml(validatedData.datosPersonales.estatura)
            : undefined,
          peso: validatedData.datosPersonales.peso
            ? escapeHtml(validatedData.datosPersonales.peso)
            : undefined,
          fechaFallecimiento: validatedData.datosPersonales.fechaFallecimiento
            ? escapeHtml(validatedData.datosPersonales.fechaFallecimiento)
            : undefined,
          escuelas: validatedData.datosPersonales.escuelas
            ? escapeHtml(validatedData.datosPersonales.escuelas)
            : undefined,
          inicioDeporte: validatedData.datosPersonales.inicioDeporte
            ? escapeHtml(validatedData.datosPersonales.inicioDeporte)
            : undefined,
        }
      : undefined;

    // Generate contribution reference ID
    const refId = `contrib-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Generate timestamp
    const timestamp = new Date().toLocaleString("es-PR", {
      timeZone: "America/Puerto_Rico",
      dateStyle: "long",
      timeStyle: "short",
    });

    const tipoLabel =
      tipoLabels[validatedData.tipoContribucion] ||
      validatedData.tipoContribucion;

    // Build email HTML
    const adminHtml = buildAdminNotificationEmail({
      exaltadoId: validatedData.exaltadoId,
      exaltadoNombre: safeExaltadoNombre,
      contribuidorNombre: safeNombre,
      contribuidorEmail: safeEmail,
      contribuidorTelefono: safeTelefono,
      relacionConExaltado: validatedData.relacionConExaltado,
      relacionDetalle: safeRelacionDetalle,
      tipoContribucion: validatedData.tipoContribucion,
      tipoLabel,
      informacion: safeInformacion,
      estadisticasEspecificas: safeEstadisticas,
      datosPersonales: safeDatosPersonales,
      fuenteInformacion: safeFuente,
      cantidadArchivos: archivos.length,
      refId,
      timestamp,
    });

    const confirmationHtml = buildContributorConfirmationEmail({
      contribuidorNombre: safeNombre,
      exaltadoNombre: safeExaltadoNombre,
      tipoLabel,
      refId,
    });

    // Convert files to Resend-compatible attachments
    const attachments = await Promise.all(
      archivos.map(async (archivo) => ({
        content: Buffer.from(await archivo.arrayBuffer()),
        filename: archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_"),
      }))
    );

    // Send emails (skip in E2E test mode)
    if (!isE2ETestMode) {
      try {
        // Send admin notification (with file attachments)
        const { error: adminError } = await resend.emails.send({
          from: "Pabellón PFDH <noreply@pfdh.org>",
          to: ["informa@pfdh.org", "pabellonfdh@gmail.com"],
          replyTo: validatedData.contribuidorEmail,
          subject: `📝 Nueva contribución: ${validatedData.exaltadoNombre} — ${tipoLabel}`,
          html: adminHtml,
          attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (adminError) {
          console.error(
            "Error enviando email de notificación admin:",
            adminError
          );
          throw new Error(`Error enviando email: ${adminError.message}`);
        }

        // Send contributor confirmation
        const { error: confirmError } = await resend.emails.send({
          from: "Pabellón PFDH <noreply@pfdh.org>",
          to: validatedData.contribuidorEmail,
          subject:
            "Gracias por contribuir — Pabellón de la Fama del Deporte Humacaeño",
          html: confirmationHtml,
        });

        if (confirmError) {
          console.error(
            "Error enviando email de confirmación:",
            confirmError
          );
          // Don't fail the request if confirmation email fails
          // The admin already received the contribution
        }
      } catch (emailError) {
        console.error("Error enviando emails:", emailError);
        return errorResponse(
          "Error al enviar la notificación. Por favor, intenta nuevamente o contáctanos directamente.",
          500
        );
      }
    }

    // Respuesta de éxito
    return NextResponse.json(
      {
        success: true,
        data: {
          id: refId,
          exaltadoNombre: validatedData.exaltadoNombre,
        },
        message: "Contribución enviada exitosamente",
      },
      { status: 201, headers: apiHeaders }
    );
  } catch (error) {
    console.error("Error en API de contribución:", error);

    // No exponer detalles internos en producción
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Error interno: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        : "Error interno del servidor. Por favor, intenta nuevamente.";

    return errorResponse(errorMessage, 500);
  }
}

// Otros métodos no permitidos
export async function GET() {
  return errorResponse("Método no permitido", 405);
}

export async function PUT() {
  return errorResponse("Método no permitido", 405);
}

export async function DELETE() {
  return errorResponse("Método no permitido", 405);
}
