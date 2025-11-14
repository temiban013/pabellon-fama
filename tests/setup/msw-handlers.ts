import { http, HttpResponse } from 'msw';

/**
 * Handlers de MSW para mockear las APIs
 */
export const handlers = [
  // Mock de API de registro
  http.post('/api/registro', async ({ request }) => {
    const body = await request.json();

    // Simular validación básica
    if (!body || typeof body !== 'object') {
      return HttpResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    // Simular respuesta exitosa
    return HttpResponse.json(
      {
        success: true,
        message: 'Registro enviado exitosamente',
        data: body,
      },
      { status: 200 }
    );
  }),

  // Mock de API de eventos
  http.get('/api/eventos', ({ request }) => {
    const url = new URL(request.url);
    const sport = url.searchParams.get('deporte');

    const eventos = [
      {
        id: '1',
        summary: 'Torneo de Baloncesto',
        description: 'Torneo nacional de baloncesto',
        location: 'Pabellón de la Fama',
        start: {
          dateTime: '2025-12-01T10:00:00-04:00',
          timeZone: 'America/Santo_Domingo',
        },
        end: {
          dateTime: '2025-12-01T18:00:00-04:00',
          timeZone: 'America/Santo_Domingo',
        },
        sport: 'Baloncesto',
      },
      {
        id: '2',
        summary: 'Torneo de Voleibol',
        description: 'Torneo regional de voleibol',
        location: 'Pabellón de la Fama',
        start: {
          dateTime: '2025-12-05T09:00:00-04:00',
          timeZone: 'America/Santo_Domingo',
        },
        end: {
          dateTime: '2025-12-05T17:00:00-04:00',
          timeZone: 'America/Santo_Domingo',
        },
        sport: 'Voleibol',
      },
    ];

    // Filtrar por deporte si se especifica
    const filteredEventos = sport
      ? eventos.filter((e) => e.sport === sport)
      : eventos;

    return HttpResponse.json({
      eventos: filteredEventos,
      total: filteredEventos.length,
    });
  }),

  // Mock de Resend API (para emails)
  http.post('https://api.resend.com/emails', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'API key is required' },
        { status: 401 }
      );
    }

    const body: any = await request.json();

    return HttpResponse.json({
      id: 'mock-email-id-' + Date.now(),
      from: body?.from || 'noreply@test.com',
      to: body?.to || 'recipient@test.com',
      created_at: new Date().toISOString(),
    });
  }),

  // Mock de Google Calendar API
  http.get('https://www.googleapis.com/calendar/v3/calendars/:calendarId/events', () => {
    return HttpResponse.json({
      items: [
        {
          id: 'google-event-1',
          summary: 'Evento de Google Calendar',
          description: 'Descripción del evento',
          location: 'Santo Domingo',
          start: {
            dateTime: '2025-12-10T14:00:00-04:00',
            timeZone: 'America/Santo_Domingo',
          },
          end: {
            dateTime: '2025-12-10T16:00:00-04:00',
            timeZone: 'America/Santo_Domingo',
          },
        },
      ],
      nextPageToken: null,
    });
  }),
];

/**
 * Handlers de error para pruebas de casos de fallo
 */
export const errorHandlers = [
  http.post('/api/registro', () => {
    return HttpResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }),

  http.get('/api/eventos', () => {
    return HttpResponse.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    );
  }),
];

/**
 * Handlers para pruebas de rate limiting
 */
export const rateLimitHandlers = [
  http.post('/api/registro', () => {
    return HttpResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }),
];
