// src/lib/googleCalendar.ts
import { google } from "googleapis";
import { type Adjunto, type Evento, type TipoEvento } from "./types";

// Configuración del cliente de Google Calendar
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "pabellonfdh@gmail.com";

// Tipo para eventos de Google Calendar
interface GoogleCalendarEvent {
  id?: string;
  /** Presente solo en instancias expandidas de un evento recurrente (singleEvents: true). */
  recurringEventId?: string;
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
  attachments?: Array<{
    fileUrl?: string;
    title?: string;
    mimeType?: string;
    iconLink?: string;
    fileId?: string;
  }>;
}

// Interfaz para metadatos estructurados en la descripción
interface EventoMetadata {
  tipo?: TipoEvento;
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

    // Parsear usando comas O saltos de línea (Google Calendar a veces elimina los saltos)
    // Primero intentar separar por saltos de línea, si no hay, usar comas
    const separator = metadataBlock.includes("\n") ? "\n" : ",";
    const lines = metadataBlock.split(separator);

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
              ].includes(value.toLowerCase())
            ) {
              metadata.tipo = value.toLowerCase() as EventoMetadata["tipo"];
            }
            break;
          case "capacidad":
          case "capacidadmaxima":
            metadata.capacidad = parseInt(value, 10);
            break;
          case "requierereservacion":
          case "requiere_reservacion":
          case "requiereregistro":
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
 * Extrae URL de imagen de la primera línea de la descripción
 * La junta pega un Google Drive link como primera línea del evento
 */
function extractImageUrl(description: string = ""): string | null {
  // Convert <br> to newlines first (Google Calendar uses HTML for line breaks)
  let stripped = description.replace(/<br\s*\/?>/gi, "\n");
  // Then strip remaining HTML tags (<a> wrappers, etc.)
  stripped = stripped.replace(/<[^>]*>/g, "");
  const firstLine = stripped.trim().split("\n")[0]?.trim();
  if (!firstLine) return null;

  const urlMatch = firstLine.match(/^(https?:\/\/\S+)/);
  if (!urlMatch) return null;

  const url = urlMatch[1];

  // Convert Google Drive share URLs to direct image URLs
  // lh3.googleusercontent.com serves images directly (no redirect) for public files
  // drive.google.com/file/d/{ID}/view?usp=sharing
  const fileIdMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileIdMatch) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  // drive.google.com/open?id={ID}
  const openIdMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openIdMatch) {
    return `https://lh3.googleusercontent.com/d/${openIdMatch[1]}`;
  }

  // Non-Google Drive URLs pass through as-is
  return url;
}

/**
 * Limpia la descripción removiendo el bloque de metadata y HTML tags
 */
function cleanDescription(description: string = ""): string {
  // Remover bloque de metadata
  let cleaned = description.replace(/---METADATA---\s*[\s\S]*?\s*---/i, "");

  // Convert <br> to newlines (Google Calendar uses HTML for line breaks)
  cleaned = cleaned.replace(/<br\s*\/?>/gi, "\n");

  // Remover HTML tags (Google Calendar a veces formatea con HTML)
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Remove image URL from first line (if present) — after HTML is stripped
  cleaned = cleaned.replace(/^\s*https?:\/\/\S+\s*\n?/, "");

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
 * Transforma los attachments de Google Calendar al formato Adjunto.
 * Para archivos de Google Drive, conserva la URL de "view" (provee preview
 * + botón de descarga) en vez de forzar descarga directa que falla en archivos > 25MB.
 */
function transformAttachments(
  attachments?: GoogleCalendarEvent["attachments"]
): Adjunto[] | undefined {
  if (!attachments || attachments.length === 0) return undefined;

  const adjuntos: Adjunto[] = [];
  for (const a of attachments) {
    if (!a.fileUrl) continue;
    adjuntos.push({
      title: a.title || a.fileUrl,
      fileUrl: a.fileUrl,
      mimeType: a.mimeType,
      iconLink: a.iconLink,
      fileId: a.fileId,
    });
  }

  return adjuntos.length > 0 ? adjuntos : undefined;
}

/**
 * Mapea el tipo de evento basado en colorId de Google Calendar
 * Color IDs de Google Calendar:
 * 1: Lavender, 2: Sage, 3: Grape, 4: Flamingo, 5: Banana,
 * 6: Tangerine, 7: Peacock, 8: Graphite, 9: Blueberry, 10: Basil, 11: Tomato
 */
function mapColorToTipo(colorId?: string): EventoMetadata["tipo"] | undefined {
  const colorMap: Record<string, EventoMetadata["tipo"]> = {
    "9": "ceremonia", // Blueberry - Ceremonias
    "10": "museo", // Basil - Museo
    "3": "educativo", // Grape - Educativo
    "6": "especial", // Tangerine - Especial
    "8": "reunion", // Graphite - Reuniones
  };

  // Sin color (o color no mapeado) NO se clasifica aquí: se deja pasar al
  // siguiente nivel de la cadena (título) en vez de forzar "especial".
  return colorMap[colorId || ""];
}

/**
 * Último recurso de clasificación: el título del evento. La Junta no colorea
 * ni etiqueta sus eventos en Google Calendar, pero sí los titula de forma
 * consistente («Reunión Ordinaria de la Junta…», «…Exaltación…»).
 */
function inferTipoFromTitle(summary?: string): EventoMetadata["tipo"] | undefined {
  const t = (summary || "").toLowerCase();
  if (/reuni[oó]n|asamblea/.test(t)) return "reunion";
  // Fechas administrativas (cierres, límites, nominaciones) no son ceremonias
  // aunque mencionen la exaltación — se dejan caer al default "especial".
  if (/cierre|l[ií]mite|nominaci[oó]n/.test(t)) return undefined;
  if (/exaltaci[oó]n|ceremonia|premiaci[oó]n/.test(t)) return "ceremonia";
  if (/museo|exhibici[oó]n|recorrido/.test(t)) return "museo";
  if (/taller|charla|cl[ií]nica|educativ/.test(t)) return "educativo";
  return undefined;
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

  // Extraer imagen, metadata, y limpiar descripción
  const imageUrl = extractImageUrl(googleEvent.description);
  const metadata = extractMetadata(googleEvent.description);
  const cleanedDescription = cleanDescription(googleEvent.description);

  // Determinar el tipo (prioridad: metadata > colorId > título > default)
  const tipo =
    metadata.tipo ||
    mapColorToTipo(googleEvent.colorId) ||
    inferTipoFromTitle(googleEvent.summary) ||
    "especial";

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
    imagen: imageUrl || undefined,
    adjuntos: transformAttachments(googleEvent.attachments),
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
  /**
   * Meses hacia el futuro que se listan las instancias de eventos RECURRENTES.
   * Los eventos únicos no se limitan: una actividad especial lejana sigue visible.
   */
  capRecurringMonths?: number;
} = {}): Promise<Evento[]> {
  try {
    const calendar = getGoogleCalendarClient();

    const {
      timeMin = new Date(),
      timeMax,
      maxResults = 50,
      capRecurringMonths,
    } = options;

    // Llamar a la API de Google Calendar
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax?.toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
      timeZone: "America/Puerto_Rico",
    });

    let events = response.data.items || [];

    // Con singleEvents: true, cada instancia de un evento recurrente trae
    // recurringEventId. Se recortan las instancias más allá del límite.
    if (capRecurringMonths) {
      const cap = new Date(timeMin);
      cap.setMonth(cap.getMonth() + capRecurringMonths);
      events = events.filter((event) => {
        if (!event.recurringEventId) return true;
        const start = new Date(event.start?.dateTime || event.start?.date || 0);
        return start <= cap;
      });
    }

    // Transformar eventos a nuestro formato
    const transformedEvents = events
      .map((event) => transformGoogleEventToEvento(event as GoogleCalendarEvent))
      .filter((event): event is Evento => event !== null);

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
    // Los recurrentes solo se listan 3 meses hacia adelante (decisión de Mario,
    // 2026-07-18); los eventos únicos lejanos siguen apareciendo.
    capRecurringMonths: 3,
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
