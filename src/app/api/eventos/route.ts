// src/app/api/eventos/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  fetchUpcomingEvents,
  fetchEventsInRange,
  fetchEventsThisMonth,
} from "@/lib/googleCalendar";
import { type Evento } from "@/lib/types";

// Headers para CORS y seguridad
const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production" ? "https://pabellon.org" : "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache por 5 minutos
  "X-Content-Type-Options": "nosniff",
};

// Tipos para respuestas
interface EventosResponse {
  success: boolean;
  data?: Evento[];
  error?: string;
  message?: string;
  metadata?: {
    count: number;
    cached: boolean;
    timestamp: string;
  };
}

// Helper para respuestas de error
function errorResponse(error: string, status: number = 400): NextResponse {
  const response: EventosResponse = {
    success: false,
    error,
  };
  return NextResponse.json(response, { status, headers: corsHeaders });
}

// Helper para respuestas de éxito
function successResponse(
  eventos: Evento[],
  message: string = "Eventos obtenidos exitosamente"
): NextResponse {
  const response: EventosResponse = {
    success: true,
    data: eventos,
    message,
    metadata: {
      count: eventos.length,
      cached: false,
      timestamp: new Date().toISOString(),
    },
  };
  return NextResponse.json(response, { status: 200, headers: corsHeaders });
}

// Handler para OPTIONS (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Handler principal para GET
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parámetros de consulta
    const mode = searchParams.get("mode") || "upcoming"; // upcoming, range, month
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const maxResults = parseInt(searchParams.get("maxResults") || "50", 10);
    const tipo = searchParams.get("tipo"); // Filtro por tipo de evento

    let eventos: Evento[];

    // Obtener eventos según el modo
    switch (mode) {
      case "range":
        if (!startDate || !endDate) {
          return errorResponse(
            "Se requieren parámetros startDate y endDate para mode=range",
            400
          );
        }
        eventos = await fetchEventsInRange(
          new Date(startDate),
          new Date(endDate)
        );
        break;

      case "month":
        eventos = await fetchEventsThisMonth();
        break;

      case "upcoming":
      default:
        eventos = await fetchUpcomingEvents(maxResults);
        break;
    }

    // Filtrar por tipo si se especifica
    if (tipo) {
      eventos = eventos.filter((evento) => evento.tipo === tipo);
    }

    // Ordenar por fecha (más próximos primero)
    eventos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    // Log para debugging
    console.log(`📅 API /api/eventos: ${eventos.length} eventos obtenidos`, {
      mode,
      tipo: tipo || "todos",
      count: eventos.length,
    });

    return successResponse(eventos);
  } catch (error) {
    console.error("❌ Error en API /api/eventos:", error);

    // Manejo de errores específicos
    if (error instanceof Error) {
      // Error de credenciales
      if (
        error.message.includes("credenciales") ||
        error.message.includes("authentication")
      ) {
        return errorResponse(
          "Error de configuración: Credenciales de Google Calendar no configuradas correctamente",
          503
        );
      }

      // Error de API de Google
      if (error.message.includes("quota") || error.message.includes("rate")) {
        return errorResponse(
          "Límite de API alcanzado. Por favor, intente más tarde.",
          429
        );
      }

      // Otros errores
      if (process.env.NODE_ENV === "development") {
        return errorResponse(`Error: ${error.message}`, 500);
      }
    }

    // Error genérico en producción
    return errorResponse(
      "Error al obtener eventos. Por favor, intente más tarde.",
      500
    );
  }
}

// Otros métodos no permitidos
export async function POST() {
  return errorResponse("Método no permitido", 405);
}

export async function PUT() {
  return errorResponse("Método no permitido", 405);
}

export async function DELETE() {
  return errorResponse("Método no permitido", 405);
}
