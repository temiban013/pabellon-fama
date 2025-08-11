// app/api/registro/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateRegistroApi } from "@/lib/validations";
import { type RegistroResponse } from "@/lib/types";

// Headers para CORS y seguridad
const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production" ? "https://pabellon.org" : "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

// Función helper para respuestas de error
function errorResponse(
  error: string,
  status: number = 400
): NextResponse<RegistroResponse> {
  return NextResponse.json(
    { success: false, error },
    { status, headers: corsHeaders }
  );
}

// Función helper para respuestas de éxito
function successResponse(
  data: { id: string; email: string; mensaje: string },
  message: string = "Registro exitoso"
): NextResponse<RegistroResponse> {
  return NextResponse.json(
    { success: true, data, message },
    { status: 201, headers: corsHeaders }
  );
}

// Función para simular guardado en base de datos (temporal)
async function saveToDatabase(userData: Record<string, unknown>) {
  // TODO: Implementar conexión real a base de datos
  // Por ahora simulamos el proceso y guardamos en memoria/log

  const registroData = {
    id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...userData,
    email: "",
    nombre: "",
    interes: "general",
    fechaRegistro: new Date().toISOString(),
    activo: true,
    origen: "web_form",
  };

  // Log para desarrollo (en producción esto iría a la base de datos)
  console.log("🎯 Nuevo registro recibido:", {
    timestamp: new Date().toISOString(),
    email: registroData.email,
    nombre: registroData.nombre,
    interes: registroData.interes,
    id: registroData.id,
  });

  // Simular delay de base de datos
  await new Promise((resolve) => setTimeout(resolve, 100));

  return registroData;
}

// Función para enviar email de confirmación (temporal)
async function sendConfirmationEmail(userData: Record<string, unknown>) {
  // TODO: Implementar servicio de email real (SendGrid, Resend, etc.)

  console.log("📧 Email de confirmación enviado a:", userData.email);
  console.log("Contenido:", {
    asunto: "Bienvenido al Pabellón de la Fama del Deporte Humacaeño",
    mensaje: `Hola ${
      userData.nombre || "Usuario"
    }, gracias por tu interés como ${userData.interes}.`,
  });

  // Simular envío de email
  await new Promise((resolve) => setTimeout(resolve, 200));

  return { emailSent: true, emailId: `email_${Date.now()}` };
}

// Handler para OPTIONS (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
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

    // Verificar si el email ya existe (simulado)
    // TODO: Implementar verificación real en base de datos
    const existingUser = false; // Simulación
    if (existingUser) {
      return errorResponse("Este email ya está registrado", 409);
    }

    // Guardar en base de datos
    const savedUser = await saveToDatabase(validatedData);

    // Enviar email de confirmación
    try {
      await sendConfirmationEmail(savedUser);
    } catch (emailError) {
      // Log error pero no fallar el registro
      console.error("Error enviando email:", emailError);
    }

    // Respuesta de éxito
    return successResponse(
      {
        id: savedUser.id,
        email: savedUser.email,
        mensaje: `¡Gracias ${savedUser.nombre}! Te has registrado exitosamente como ${savedUser.interes}.`,
      },
      "Registro completado exitosamente"
    );
  } catch (error) {
    console.error("Error en API de registro:", error);

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
export async function GET() {
  return errorResponse("Método no permitido", 405);
}

export async function PUT() {
  return errorResponse("Método no permitido", 405);
}

export async function DELETE() {
  return errorResponse("Método no permitido", 405);
}
