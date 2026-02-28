// app/api/admin/registraciones/route.ts - Admin API with secure auth and real email delivery
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";
import { Resend } from "resend";
import { validateRegistroApi } from "@/lib/validations";
import { type RegistroResponse, type RegistroUsuario } from "@/lib/types";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Headers de seguridad para API
const apiHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

// Configuración de archivos
const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registraciones.json");

// Función helper para respuestas de error
function errorResponse(
  error: string,
  status: number = 400
): NextResponse<RegistroResponse> {
  return NextResponse.json(
    { success: false, error },
    { status, headers: apiHeaders }
  );
}

// Función helper para respuestas de éxito
function successResponse(
  data: { id: string; email: string; mensaje: string },
  message: string = "Registro exitoso"
): NextResponse<RegistroResponse> {
  return NextResponse.json(
    { success: true, data, message },
    { status: 201, headers: apiHeaders }
  );
}

// Función para asegurar que existe el directorio de datos
async function ensureDataDirectory() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Función para leer registraciones existentes
async function readExistingRegistrations(): Promise<RegistroUsuario[]> {
  try {
    if (!existsSync(REGISTRATIONS_FILE)) {
      return [];
    }
    const data = await readFile(REGISTRATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo registraciones:", error);
    return [];
  }
}

// Función para guardar registración en archivo JSON
async function saveToJsonFile(
  userData: RegistroUsuario
): Promise<RegistroUsuario> {
  try {
    await ensureDataDirectory();

    // Leer registraciones existentes
    const existingRegistrations = await readExistingRegistrations();

    // Verificar si el email ya existe
    const emailExists = existingRegistrations.some(
      (reg) => reg.email === userData.email
    );
    if (emailExists) {
      throw new Error("Este email ya está registrado");
    }

    // Crear nueva registración
    const newRegistration: RegistroUsuario = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      fechaRegistro: new Date(),
      activo: true,
    };

    // Agregar a la lista
    existingRegistrations.push(newRegistration);

    // Guardar en archivo
    await writeFile(
      REGISTRATIONS_FILE,
      JSON.stringify(existingRegistrations, null, 2),
      "utf-8"
    );

    return newRegistration;
  } catch (error) {
    console.error("Error guardando registración:", error);
    throw error;
  }
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

// Función para enviar email de confirmación via Resend
async function sendConfirmationEmail(userData: RegistroUsuario): Promise<void> {
  const safeNombre = userData.nombre ? escapeHtml(userData.nombre) : "Usuario";
  const safeEmail = escapeHtml(userData.email);
  const safeInteres = escapeHtml(userData.interes);

  const interesLabels: Record<string, string> = {
    general: "Interés General",
    visitante: "Visitante del Museo",
    investigador: "Investigador/Estudiante",
    voluntario: "Voluntario",
  };
  const interesLabel = interesLabels[userData.interes] || safeInteres;

  const fechaRegistro = userData.fechaRegistro
    ? new Date(userData.fechaRegistro).toLocaleDateString("es-PR", {
        timeZone: "America/Puerto_Rico",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("es-PR", {
        timeZone: "America/Puerto_Rico",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const { error } = await resend.emails.send({
    from: "Pabellón PFDH <noreply@pfdh.org>",
    to: userData.email,
    subject: "Bienvenido al Pabellón de la Fama del Deporte Humacaeño",
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
            background: linear-gradient(135deg, #1a4731 0%, #166534 100%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 8px 0;
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
            border-left: 4px solid #d97706;
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
            color: #1a4731;
            display: inline-block;
            min-width: 160px;
          }
          .value {
            color: #374151;
          }
          .badge {
            display: inline-block;
            background: #d97706;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Bienvenido al Pabellón de la Fama</h1>
          <p style="margin: 0; opacity: 0.9;">Deporte Humacaeño - Museo Manuel Rivera Guevara</p>
        </div>

        <div class="content">
          <p style="font-size: 16px; margin-top: 0;">
            ¡Bienvenido, <strong>${safeNombre}</strong>! Gracias por registrarte en el
            Pabellón de la Fama del Deporte Humacaeño.
          </p>

          <p>
            Te mantendremos informado sobre nuestras actividades, eventos y noticias del
            Museo Manuel Rivera Guevara.
          </p>

          <div class="info-section">
            <h2 style="margin-top: 0; color: #1a4731; font-size: 18px;">
              Tus datos de registro
            </h2>

            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${safeEmail}</span>
            </div>

            <div class="info-row">
              <span class="label">Tipo de interés:</span>
              <span class="value">
                <span class="badge">${interesLabel}</span>
              </span>
            </div>

            <div class="info-row">
              <span class="label">Fecha de registro:</span>
              <span class="value">${fechaRegistro}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 5px 0;">
            <strong>Pabellón de la Fama del Deporte Humacaeño</strong><br>
            Museo Manuel Rivera Guevara<br>
            Centro Cultural Dra. Antonia Sáez, Humacao, Puerto Rico<br>
            787-410-1237
          </p>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("Error enviando email de confirmación via Resend:", error);
    throw new Error(`Error enviando email de confirmación: ${error.message}`);
  }
}

// Función para notificar a administradores via Resend
async function notifyAdministrators(userData: RegistroUsuario): Promise<void> {
  const safeNombre = userData.nombre ? escapeHtml(userData.nombre) : "Usuario";
  const safeEmail = escapeHtml(userData.email);
  const safeTelefono = userData.telefono
    ? escapeHtml(userData.telefono)
    : "No proporcionado";
  const safeMensaje = userData.mensaje ? escapeHtml(userData.mensaje) : "Ninguno";
  const safeInteres = escapeHtml(userData.interes);

  const interesLabels: Record<string, string> = {
    general: "Interés General",
    visitante: "Visitante del Museo",
    investigador: "Investigador/Estudiante",
    voluntario: "Voluntario",
  };
  const interesLabel = interesLabels[userData.interes] || safeInteres;

  const fechaRegistro = userData.fechaRegistro
    ? new Date(userData.fechaRegistro).toLocaleString("es-PR", {
        timeZone: "America/Puerto_Rico",
        dateStyle: "long",
        timeStyle: "short",
      })
    : new Date().toLocaleString("es-PR", {
        timeZone: "America/Puerto_Rico",
        dateStyle: "long",
        timeStyle: "short",
      });

  const { error } = await resend.emails.send({
    from: "Pabellón PFDH <noreply@pfdh.org>",
    to: ["informa@pfdh.org", "pabellonfdh@gmail.com"],
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
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Nueva Persona Registrada</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Pabellón de la Fama del Deporte Humacaeño</p>
        </div>

        <div class="content">
          <p style="font-size: 16px; margin-top: 0;">
            Se ha recibido una nueva registración a través del formulario del sitio web.
          </p>

          <div class="info-section">
            <h2 style="margin-top: 0; color: #1e3a8a; font-size: 18px;">
              Información del Registro
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
              <span class="label">Mensaje:</span>
              <span class="value">${safeMensaje}</span>
            </div>

            <div class="info-row">
              <span class="label">Fecha de Registro:</span>
              <span class="value">${fechaRegistro}</span>
            </div>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Consejo:</strong> Puedes responder directamente a este email para
              contactar a <strong>${safeNombre}</strong> en <strong>${safeEmail}</strong>
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
            Centro Cultural Dra. Antonia Sáez, Humacao, Puerto Rico
          </p>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("Error notificando a administradores via Resend:", error);
    throw new Error(`Error enviando notificación a administradores: ${error.message}`);
  }
}

// Handler GET para admin — requiere Authorization: Bearer <key>
export async function GET(request: NextRequest) {
  // Verificar que ADMIN_KEY esté configurado
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    console.error("ADMIN_KEY no está configurado en las variables de entorno");
    return NextResponse.json(
      { success: false, error: "Error de configuración del servidor" },
      { status: 500, headers: apiHeaders }
    );
  }

  // Leer el header Authorization
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401, headers: apiHeaders }
    );
  }

  const providedKey = authHeader.slice(7); // Quitar "Bearer "

  // Comparación segura en tiempo constante para prevenir timing attacks
  const providedKeyBuffer = Buffer.from(providedKey);
  const adminKeyBuffer = Buffer.from(adminKey);

  // timingSafeEqual requiere buffers del mismo tamaño
  let isValid = false;
  if (providedKeyBuffer.length === adminKeyBuffer.length) {
    isValid = crypto.timingSafeEqual(providedKeyBuffer, adminKeyBuffer);
  }

  if (!isValid) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401, headers: apiHeaders }
    );
  }

  // Autenticación exitosa — obtener registraciones
  const registraciones = await readExistingRegistrations();

  // Calcular estadísticas
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const porInteres: Record<string, number> = {};
  let ultimaSemana = 0;
  let ultimoMes = 0;

  for (const reg of registraciones) {
    // Agrupar por interés
    if (reg.interes) {
      porInteres[reg.interes] = (porInteres[reg.interes] || 0) + 1;
    }

    // Contar por período de tiempo
    if (reg.fechaRegistro) {
      const fecha = new Date(reg.fechaRegistro).getTime();
      if (fecha >= sevenDaysAgo) {
        ultimaSemana++;
      }
      if (fecha >= thirtyDaysAgo) {
        ultimoMes++;
      }
    }
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        registraciones,
        estadisticas: {
          total: registraciones.length,
          porInteres,
          ultimaSemana,
          ultimoMes,
        },
        ultimaActualizacion: new Date().toISOString(),
      },
    },
    { status: 200, headers: apiHeaders }
  );
}

// Handler principal para POST
export async function POST(request: NextRequest) {
  try {
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

    // Guardar en archivo JSON (persistencia real)
    const savedUser = await saveToJsonFile(validatedData);

    // Intentar enviar emails (no fallar el registro si falla)
    try {
      await sendConfirmationEmail(savedUser);
      await notifyAdministrators(savedUser);
    } catch (emailError) {
      console.error(
        "Error enviando emails (registro exitoso igual):",
        emailError
      );
    }

    // Respuesta de éxito
    return successResponse(
      {
        id: savedUser.id!,
        email: savedUser.email,
        mensaje: `¡Gracias ${savedUser.nombre}! Te has registrado exitosamente. Te mantendremos informado sobre nuestras actividades.`,
      },
      "Registro completado exitosamente"
    );
  } catch (error) {
    console.error("Error en API de registro:", error);

    // Error específico de email duplicado
    if (
      error instanceof Error &&
      error.message.includes("ya está registrado")
    ) {
      return errorResponse(error.message, 409);
    }

    // No exponer detalles internos en producción
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Error interno: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        : "Error interno del servidor";

    return errorResponse(errorMessage, 500);
  }
}

// Otros métodos no permitidos
export async function PUT() {
  return NextResponse.json(
    { success: false, error: "Método no permitido" },
    { status: 405, headers: apiHeaders }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "Método no permitido" },
    { status: 405, headers: apiHeaders }
  );
}
