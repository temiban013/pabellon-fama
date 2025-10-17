// src/lib/googleCalendar.ts
import { google } from "googleapis";
import { type Evento } from "./types";

// Configuración del cliente de Google Calendar
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "pabellonfdh@gmail.com";

// Tipo para eventos de Google Calendar
interface GoogleCalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  colorId?: string;
  extendedProperties?: {
    shared?: Record<string, string>;
  };
}

// Interfaz para metadatos estructurados en la descripción
interface EventoMetadata {
  tipo?: "ceremonia" | "museo" | "educativo" | "especial" | "reunion";
  capacidad?: number;
  requiereReservacion?: boolean;
  destacado?: boolean;
}

/**
 * Crea y autentica un cliente de Google Calendar usando Service Account
 */
function getGoogleCalendarClient() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!serviceAccountEmail || !privateKey) {
    throw new Error(
      "Faltan credenciales de Google Calendar. Configure GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY en .env.local"
    );
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.calendar({ version: "v3", auth });
}

/**
 * Extrae metadatos estructurados de la descripción del evento
 * Formato esperado:
 * ---METADATA---
 * tipo: ceremonia
 * capacidad: 500
 * requiereReservacion: true
 * destacado: true
 * ---
 */
function extractMetadata(description: string = ""): EventoMetadata {
  const metadata: EventoMetadata = {};

  // Buscar el bloque de metadata
  const metadataMatch = description.match(
    /---METADATA---\s*([\s\S]*?)\s*---/i
  );

  if (metadataMatch) {
    const metadataBlock = metadataMatch[1];

    // Parsear cada línea del bloque
    const lines = metadataBlock.split("\n");
    lines.forEach((line) => {
      const [key, value] = line.split(":").map((s) => s.trim());

      if (key && value) {
        switch (key.toLowerCase()) {
          case "tipo":
            if (
              [
                "ceremonia",
                "museo",
                "educativo",
                "especial",
                "reunion",
              ].includes(value)
            ) {
              metadata.tipo = value as EventoMetadata["tipo"];
            }
            break;
          case "capacidad":
            metadata.capacidad = parseInt(value, 10);
            break;
          case "requierereservacion":
          case "requiere_reservacion":
            metadata.requiereReservacion = value.toLowerCase() === "true";
            break;
          case "destacado":
            metadata.destacado = value.toLowerCase() === "true";
            break;
        }
      }
    });
  }

  return metadata;
}

/**
 * Limpia la descripción removiendo el bloque de metadata y HTML tags
 */
function cleanDescription(description: string = ""): string {
  // Remover bloque de metadata
  let cleaned = description.replace(/---METADATA---\s*[\s\S]*?\s*---/i, "");

  // Remover HTML tags (Google Calendar a veces formatea con HTML)
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Decodificar entidades HTML comunes
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return cleaned.trim();
}

/**
 * Mapea el tipo de evento basado en colorId de Google Calendar
 * Color IDs de Google Calendar:
 * 1: Lavender, 2: Sage, 3: Grape, 4: Flamingo, 5: Banana,
 * 6: Tangerine, 7: Peacock, 8: Graphite, 9: Blueberry, 10: Basil, 11: Tomato
 */
function mapColorToTipo(colorId?: string): EventoMetadata["tipo"] {
  const colorMap: Record<string, EventoMetadata["tipo"]> = {
    "9": "ceremonia", // Blueberry - Ceremonias
    "10": "museo", // Basil - Museo
    "3": "educativo", // Grape - Educativo
    "6": "especial", // Tangerine - Especial
    "8": "reunion", // Graphite - Reuniones
  };

  return colorMap[colorId || ""] || "especial";
}

/**
 * Transforma un evento de Google Calendar a nuestro formato interno
 */
function transformGoogleEventToEvento(
  googleEvent: GoogleCalendarEvent
): Evento | null {
  if (!googleEvent.start || !googleEvent.summary) {
    return null;
  }

  // Extraer metadata de la descripción
  const metadata = extractMetadata(googleEvent.description);
  const cleanedDescription = cleanDescription(googleEvent.description);

  // Determinar el tipo (prioridad: metadata > colorId > default)
  const tipo =
    metadata.tipo || mapColorToTipo(googleEvent.colorId) || "especial";

  // Parsear fecha y hora
  const startDateTime = googleEvent.start.dateTime || googleEvent.start.date;
  const endDateTime = googleEvent.end?.dateTime || googleEvent.end?.date;

  if (!startDateTime) {
    return null;
  }

  const fechaDate = new Date(startDateTime);
  const horaInicio = googleEvent.start.dateTime
    ? new Date(startDateTime).toLocaleTimeString("es-PR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Puerto_Rico",
      })
    : "Todo el día";

  const horaFin = endDateTime
    ? new Date(endDateTime).toLocaleTimeString("es-PR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Puerto_Rico",
      })
    : undefined;

  // Construir el evento
  const evento: Evento = {
    id: googleEvent.id || `event-${Date.now()}`,
    titulo: googleEvent.summary,
    descripcion: cleanedDescription || "Sin descripción",
    fecha: fechaDate,
    horaInicio,
    horaFin,
    ubicacion: googleEvent.location || "Por confirmar",
    tipo: tipo as Evento["tipo"],
    estado: "programado",
    requiresRegistro: metadata.requiereReservacion || false,
    capacidadMaxima: metadata.capacidad,
  };

  return evento;
}

/**
 * Obtiene eventos del Google Calendar
 * @param options Opciones de filtrado
 * @returns Lista de eventos transformados
 */
export async function fetchCalendarEvents(options: {
  timeMin?: Date;
  timeMax?: Date;
  maxResults?: number;
} = {}): Promise<Evento[]> {
  try {
    const calendar = getGoogleCalendarClient();

    const {
      timeMin = new Date(),
      timeMax,
      maxResults = 50,
    } = options;

    // Llamar a la API de Google Calendar
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax?.toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    // Transformar eventos a nuestro formato
    const transformedEvents = events
      .map((event) => transformGoogleEventToEvento(event as GoogleCalendarEvent))
      .filter((event): event is Evento => event !== null);

    console.log(
      `✅ Fetched ${transformedEvents.length} eventos from Google Calendar`
    );

    return transformedEvents;
  } catch (error) {
    console.error("❌ Error fetching calendar events:", error);

    // Proporcionar más detalles del error
    if (error instanceof Error) {
      throw new Error(
        `Error al obtener eventos del calendario: ${error.message}`
      );
    }

    throw new Error("Error desconocido al obtener eventos del calendario");
  }
}

/**
 * Obtiene eventos futuros (desde hoy en adelante)
 */
export async function fetchUpcomingEvents(
  maxResults: number = 20
): Promise<Evento[]> {
  const now = new Date();
  return fetchCalendarEvents({
    timeMin: now,
    maxResults,
  });
}

/**
 * Obtiene eventos en un rango de fechas específico
 */
export async function fetchEventsInRange(
  startDate: Date,
  endDate: Date
): Promise<Evento[]> {
  return fetchCalendarEvents({
    timeMin: startDate,
    timeMax: endDate,
    maxResults: 100,
  });
}

/**
 * Obtiene eventos del mes actual
 */
export async function fetchEventsThisMonth(): Promise<Evento[]> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return fetchEventsInRange(startOfMonth, endOfMonth);
}

/**
 * Obtiene la URL pública del calendario para suscripción
 */
export function getPublicCalendarUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CALENDAR_PUBLIC_URL ||
    `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
      CALENDAR_ID
    )}`
  );
}
