// app/api/registro/route.ts - Simplified with Resend email integration
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateRegistroApi } from "@/lib/validations";
import { type RegistroUsuario } from "@/lib/types";

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
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per window
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

// Función helper para respuestas de éxito
function successResponse(
  data: unknown,
  message: string = "Operación exitosa"
): NextResponse {
  return NextResponse.json(
    { success: true, data, message },
    { status: 201, headers: apiHeaders }
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

// Función para enviar email de notificación via Resend
async function sendRegistrationEmail(
  userData: Omit<RegistroUsuario, "id" | "fechaRegistro" | "activo">
): Promise<void> {
  const timestamp = new Date().toLocaleString("es-PR", {
    timeZone: "America/Puerto_Rico",
    dateStyle: "long",
    timeStyle: "short",
  });

  // Map interest types to Spanish labels
  const interesLabels: Record<string, string> = {
    general: "Interés General",
    visitante: "Visitante del Museo",
    investigador: "Investigador/Estudiante",
    voluntario: "Voluntario",
  };

  const interesLabel = interesLabels[userData.interes] || userData.interes;

  // Escape all user input to prevent XSS
  const safeNombre = userData.nombre ? escapeHtml(userData.nombre) : "Usuario";
  const safeEmail = escapeHtml(userData.email);
  const safeTelefono = userData.telefono ? escapeHtml(userData.telefono) : "No proporcionado";
  const safeMensaje = userData.mensaje ? escapeHtml(userData.mensaje) : "";

  const { error } = await resend.emails.send({
    from: "Pabellón PFDH <noreply@pfdh.org>",
    to: "informa@pfdh.org",
    replyTo: userData.email,
    subject: `Nueva Registración - ${userData.nombre}`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-top: none;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .info-section {
            background: #f9fafb;
            padding: 20px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-row {
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #1e3a8a;
            display: inline-block;
            min-width: 140px;
          }
          .value {
            color: #374151;
          }
          .message-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .message-box h3 {
            margin-top: 0;
            color: #1e40af;
            font-size: 16px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
          .badge {
            display: inline-block;
            background: #f59e0b;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏆 Nueva Persona Registrada</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Pabellón de la Fama del Deporte Humacaeño</p>
        </div>

        <div class="content">
          <p style="font-size: 16px; margin-top: 0;">
            Se ha recibido una nueva registración a través del formulario del sitio web.
          </p>

          <div class="info-section">
            <h2 style="margin-top: 0; color: #1e3a8a; font-size: 18px;">
              📋 Información del Registro
            </h2>

            <div class="info-row">
              <span class="label">Nombre:</span>
              <span class="value"><strong>${safeNombre}</strong></span>
            </div>

            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">
                <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">
                  ${safeEmail}
                </a>
              </span>
            </div>

            <div class="info-row">
              <span class="label">Teléfono:</span>
              <span class="value">${safeTelefono}</span>
            </div>

            <div class="info-row">
              <span class="label">Tipo de Interés:</span>
              <span class="value">
                <span class="badge">${interesLabel}</span>
              </span>
            </div>

            <div class="info-row">
              <span class="label">Fecha de Registro:</span>
              <span class="value">${timestamp}</span>
            </div>
          </div>

          ${
            safeMensaje
              ? `
            <div class="message-box">
              <h3>💬 Mensaje del Usuario</h3>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${safeMensaje}</p>
            </div>
          `
              : ""
          }

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>💡 Tip:</strong> Puedes responder directamente a este email para contactar a
              <strong>${safeNombre}</strong> en <strong>${safeEmail}</strong>
            </p>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 5px 0;">
            Este email fue generado automáticamente desde el formulario de registro en
            <strong>pfdh.org</strong>
          </p>
          <p style="margin: 5px 0; color: #9ca3af;">
            Pabellón de la Fama del Deporte Humacaeño<br>
            Centro Cultural Antonia Sáez, Humacao, Puerto Rico
          </p>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("❌ Error enviando email via Resend:", error);
    throw new Error(`Error enviando email: ${error.message}`);
  }

}

// Handler principal para POST (Registro público)
export async function POST(request: NextRequest) {
  try {
    // Check rate limit first (before any processing)
    // Skip rate limiting in E2E test environment (detected by test API key)
    const isE2ETestMode = process.env.RESEND_API_KEY?.startsWith('re_test_');

    if (!isE2ETestMode) {
      const clientIp = getClientIp(request);
      const rateLimit = checkRateLimit(clientIp);

      if (!rateLimit.allowed) {
        const minutesUntilReset = Math.ceil(
          (rateLimit.resetAt - Date.now()) / 60000
        );
        console.warn(`⚠️ Rate limit exceeded for IP: ${clientIp}`);

        return NextResponse.json(
          {
            success: false,
            error: `Has excedido el límite de registros. Por favor, intenta nuevamente en ${minutesUntilReset} minutos.`,
          },
          {
            status: 429,
            headers: {
              ...apiHeaders,
              "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": rateLimit.resetAt.toString(),
              "Retry-After": (rateLimit.resetAt / 1000).toString(),
            },
          }
        );
      }

    } else {
      // E2E TEST MODE - rate limiting disabled
    }

    // Verificar Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return errorResponse("Content-Type debe ser application/json", 415);
    }

    // Parsear body
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("JSON inválido en el cuerpo de la petición", 400);
    }

    // Validar datos con Zod
    const validation = validateRegistroApi(body);
    if (!validation.success) {
      const errorMessages = validation.error.issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return errorResponse(`Datos inválidos: ${errorMessages}`, 422);
    }

    const validatedData = validation.data;

    // Enviar email de notificación via Resend
    // Skip email sending in E2E test environment to prevent 401 errors
    if (!isE2ETestMode) {
      try {
        await sendRegistrationEmail(validatedData);
      } catch (emailError) {
        console.error("❌ Error enviando email:", emailError);
        return errorResponse(
          "Error al enviar la notificación. Por favor, intenta nuevamente o contáctanos directamente.",
          500
        );
      }
    } else {
      // E2E test environment: Email sending skipped
    }

    // Respuesta de éxito
    return successResponse(
      {
        email: validatedData.email,
        mensaje: `¡Gracias ${validatedData.nombre}! Te has registrado exitosamente. Te mantendremos informado sobre nuestras actividades.`,
      },
      "Registro completado exitosamente"
    );
  } catch (error) {
    console.error("❌ Error en API de registro:", error);

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
