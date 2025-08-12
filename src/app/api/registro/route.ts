// app/api/registro/route.ts - Enhanced with admin support
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { validateRegistroApi } from "@/lib/validations";
import { type RegistroUsuario } from "@/lib/types";

// Headers para CORS y seguridad
const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production" ? "https://pabellon.org" : "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

// Configuración de archivos
const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registraciones.json");

// Clave administrativa (en producción debería estar en env variables)
const ADMIN_KEY = process.env.ADMIN_KEY;

// Función helper para respuestas de error
function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    { success: false, error },
    { status, headers: corsHeaders }
  );
}

// Función helper para respuestas de éxito
function successResponse(
  data: unknown,
  message: string = "Operación exitosa"
): NextResponse {
  return NextResponse.json(
    { success: true, data, message },
    { status: data === null ? 200 : 201, headers: corsHeaders }
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

// Función para generar estadísticas
function generateStatistics(registrations: RegistroUsuario[]) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Contar por tipo de interés
  const porInteres = registrations.reduce((acc, reg) => {
    acc[reg.interes] = (acc[reg.interes] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Contar por fecha
  const ultimaSemana = registrations.filter(
    (reg) => reg.fechaRegistro && new Date(reg.fechaRegistro) >= oneWeekAgo
  ).length;

  const ultimoMes = registrations.filter(
    (reg) => reg.fechaRegistro && new Date(reg.fechaRegistro) >= oneMonthAgo
  ).length;

  return {
    total: registrations.length,
    porInteres,
    ultimaSemana,
    ultimoMes,
  };
}

// Función para verificar autenticación admin
function verifyAdminAuth(request: NextRequest): boolean {
  const key = request.nextUrl.searchParams.get("key");
  return key === ADMIN_KEY;
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

    // Log para verificación
    console.log("🎯 NUEVA REGISTRACIÓN GUARDADA:", {
      timestamp: newRegistration.fechaRegistro?.toISOString(),
      email: newRegistration.email,
      nombre: newRegistration.nombre,
      interes: newRegistration.interes,
      id: newRegistration.id,
      archivo: REGISTRATIONS_FILE,
    });

    return newRegistration;
  } catch (error) {
    console.error("❌ Error guardando registración:", error);
    throw error;
  }
}

// Función para enviar email de confirmación (mejorada)
async function sendConfirmationEmail(userData: RegistroUsuario): Promise<void> {
  // TODO: Implementar servicio de email real (SendGrid, Resend, etc.)

  const emailContent = {
    to: userData.email,
    subject: "Bienvenido al Pabellón de la Fama del Deporte Humacaeño",
    html: `
      <h2>¡Bienvenido ${userData.nombre}!</h2>
      <p>Gracias por registrarte en el Pabellón de la Fama del Deporte Humacaeño.</p>
      <p><strong>Tus datos de registro:</strong></p>
      <ul>
        <li>Email: ${userData.email}</li>
        <li>Tipo de interés: ${userData.interes}</li>
        <li>Fecha de registro: ${userData.fechaRegistro?.toLocaleDateString(
          "es-PR"
        )}</li>
      </ul>
      <p>Te mantendremos informado sobre nuestras actividades y eventos.</p>
      <hr>
      <p><em>Pabellón de la Fama del Deporte Humacaeño - Museo Manuel Rivera Guevara</em></p>
    `,
  };

  console.log("📧 EMAIL DE CONFIRMACIÓN (Simulado):", emailContent);

  // En producción, aquí irían servicios como:
  // - SendGrid: await sgMail.send(emailContent)
  // - Resend: await resend.emails.send(emailContent)
  // - Nodemailer: await transporter.sendMail(emailContent)

  // Simular delay de envío
  await new Promise((resolve) => setTimeout(resolve, 200));
}

// Función para notificar a administradores
async function notifyAdministrators(userData: RegistroUsuario): Promise<void> {
  const adminNotification = {
    to: ["admin@pabellon.org", "felix@pabellon.org"], // Emails de Kike y Felix
    subject: `Nueva Registración - ${userData.nombre}`,
    html: `
      <h3>Nueva persona registrada en el sitio web</h3>
      <p><strong>Detalles:</strong></p>
      <ul>
        <li>Nombre: ${userData.nombre}</li>
        <li>Email: ${userData.email}</li>
        <li>Teléfono: ${userData.telefono || "No proporcionado"}</li>
        <li>Tipo de interés: ${userData.interes}</li>
        <li>Mensaje: ${userData.mensaje || "Ninguno"}</li>
        <li>Fecha: ${userData.fechaRegistro?.toLocaleString("es-PR")}</li>
      </ul>
      <p>Esta persona ha expresado interés como: <strong>${
        userData.interes
      }</strong></p>
    `,
  };

  console.log(
    "📨 NOTIFICACIÓN A ADMINISTRADORES (Simulado):",
    adminNotification
  );
}

// Handler para OPTIONS (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Handler para GET (Admin dashboard data)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación administrativa
    if (!verifyAdminAuth(request)) {
      return errorResponse("Acceso no autorizado", 401);
    }

    // Leer todas las registraciones
    const registrations = await readExistingRegistrations();

    // Ordenar por fecha más reciente primero
    const sortedRegistrations = registrations.sort((a, b) => {
      const dateA = a.fechaRegistro ? new Date(a.fechaRegistro).getTime() : 0;
      const dateB = b.fechaRegistro ? new Date(b.fechaRegistro).getTime() : 0;
      return dateB - dateA;
    });

    // Generar estadísticas
    const estadisticas = generateStatistics(registrations);

    // Respuesta para el dashboard admin
    const adminData = {
      registraciones: sortedRegistrations,
      estadisticas,
      ultimaActualizacion: new Date().toISOString(),
    };

    return successResponse(adminData, "Datos administrativos obtenidos");
  } catch (error) {
    console.error("❌ Error en GET admin:", error);
    return errorResponse("Error interno del servidor", 500);
  }
}

// Handler principal para POST (Registro público)
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
        "⚠️ Error enviando emails (registro exitoso igual):",
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
    console.error("❌ Error en API de registro:", error);

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
  return errorResponse("Método no permitido", 405);
}

export async function DELETE() {
  return errorResponse("Método no permitido", 405);
}
