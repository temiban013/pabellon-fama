import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchCalendarEvents,
  fetchUpcomingEvents,
  fetchEventsInRange,
  fetchEventsThisMonth,
  getPublicCalendarUrl,
} from '@/lib/googleCalendar';

// Mock googleapis
vi.mock('googleapis', () => {
  const mockCalendarApi = {
    events: {
      list: vi.fn(),
    },
  };

  return {
    google: {
      auth: {
        JWT: vi.fn().mockImplementation(() => ({})),
      },
      calendar: vi.fn((_config: any) => mockCalendarApi),
    },
  };
});

describe('googleCalendar.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id';
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test.iam.gserviceaccount.com';
    process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nTEST_KEY\n-----END PRIVATE KEY-----';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchCalendarEvents', () => {
    it('transforma eventos de Google Calendar correctamente', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Ceremonia de Exaltación',
              description: 'Ceremonia anual de exaltación',
              location: 'Pabellón de la Fama, Santo Domingo',
              start: {
                dateTime: '2025-12-01T19:00:00-04:00',
                timeZone: 'America/Santo_Domingo',
              },
              end: {
                dateTime: '2025-12-01T22:00:00-04:00',
                timeZone: 'America/Santo_Domingo',
              },
              colorId: '9',
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos).toHaveLength(1);
      expect(eventos[0]).toMatchObject({
        id: 'event-1',
        titulo: 'Ceremonia de Exaltación',
        descripcion: 'Ceremonia anual de exaltación',
        ubicacion: 'Pabellón de la Fama, Santo Domingo',
        tipo: 'ceremonia',
        estado: 'programado',
      });
    });

    it('filtra eventos sin datos esenciales (sin start o summary)', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento Válido',
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
            },
            {
              id: 'event-2',
              // Sin summary
              start: {
                dateTime: '2025-12-02T10:00:00-04:00',
              },
            },
            {
              id: 'event-3',
              summary: 'Evento Sin Fecha',
              // Sin start
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos).toHaveLength(1);
      expect(eventos[0].id).toBe('event-1');
    });

    it('maneja eventos de día completo correctamente', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento de Día Completo',
              description: 'Descripción del evento',
              start: {
                date: '2025-12-01',
              },
              end: {
                date: '2025-12-01',
              },
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos).toHaveLength(1);
      expect(eventos[0].horaInicio).toBe('Todo el día');
    });

    it('extrae metadata de la descripción correctamente', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento con Metadata',
              description: `Evento especial
---METADATA---
tipo: educativo
capacidad: 100
requiereReservacion: true
destacado: true
---
Descripción del evento`,
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos).toHaveLength(1);
      expect(eventos[0].tipo).toBe('educativo');
      expect(eventos[0].capacidadMaxima).toBe(100);
      expect(eventos[0].requiresRegistro).toBe(true);
      expect(eventos[0].descripcion).toBe('Evento especial\n\nDescripción del evento');
    });

    it('maneja metadata con separadores por comas', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento con Metadata',
              description: `---METADATA--- tipo: museo, capacidad: 50, requiereReservacion: false ---`,
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos[0].tipo).toBe('museo');
      expect(eventos[0].capacidadMaxima).toBe(50);
      expect(eventos[0].requiresRegistro).toBe(false);
    });

    it('limpia HTML tags de la descripción', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento con HTML',
              description: '<p>Descripción con <strong>HTML</strong> y &nbsp; entidades &amp; especiales</p>',
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos[0].descripcion).toBe('Descripción con HTML y   entidades & especiales');
    });

    it('mapea colores de Google Calendar a tipos de evento', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      const colorTests = [
        { colorId: '9', expectedTipo: 'ceremonia' },
        { colorId: '10', expectedTipo: 'museo' },
        { colorId: '3', expectedTipo: 'educativo' },
        { colorId: '6', expectedTipo: 'especial' },
        { colorId: '8', expectedTipo: 'reunion' },
        { colorId: '1', expectedTipo: 'especial' }, // Color no mapeado = especial por defecto
      ];

      for (const test of colorTests) {
        vi.mocked(mockCalendar.events.list).mockResolvedValue({
          data: {
            items: [
              {
                id: 'event-1',
                summary: 'Evento Test',
                start: {
                  dateTime: '2025-12-01T10:00:00-04:00',
                },
                colorId: test.colorId,
              },
            ],
          },
        } as any);

        const eventos = await fetchCalendarEvents();
        expect(eventos[0].tipo).toBe(test.expectedTipo);
      }
    });

    it('prioriza metadata sobre colorId para tipo de evento', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento Test',
              description: '---METADATA--- tipo: educativo ---',
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
              colorId: '9', // Este diría ceremonia, pero metadata tiene prioridad
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();
      expect(eventos[0].tipo).toBe('educativo');
    });

    it('usa valores predeterminados para campos opcionales', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento Mínimo',
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
              // Sin description, location, end
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos[0].descripcion).toBe('Sin descripción');
      expect(eventos[0].ubicacion).toBe('Por confirmar');
      expect(eventos[0].estado).toBe('programado');
      expect(eventos[0].requiresRegistro).toBe(false);
    });

    it('respeta opciones de filtrado (timeMin, timeMax, maxResults)', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      const timeMin = new Date('2025-12-01');
      const timeMax = new Date('2025-12-31');
      const maxResults = 10;

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: { items: [] },
      } as any);

      await fetchCalendarEvents({ timeMin, timeMax, maxResults });

      expect(mockCalendar.events.list).toHaveBeenCalledWith({
        calendarId: 'test-calendar-id',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });
    });

    it('lanza error si faltan credenciales', async () => {
      delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

      await expect(fetchCalendarEvents()).rejects.toThrow(
        'Faltan credenciales de Google Calendar'
      );
    });

    it('maneja errores de la API de Google correctamente', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockRejectedValue(
        new Error('API rate limit exceeded')
      );

      await expect(fetchCalendarEvents()).rejects.toThrow(
        'Error al obtener eventos del calendario: API rate limit exceeded'
      );
    });

    it('maneja errores desconocidos', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockRejectedValue('Unknown error');

      await expect(fetchCalendarEvents()).rejects.toThrow(
        'Error desconocido al obtener eventos del calendario'
      );
    });
  });

  describe('fetchUpcomingEvents', () => {
    it('obtiene eventos futuros con límite predeterminado', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: { items: [] },
      } as any);

      await fetchUpcomingEvents();

      const callArgs = vi.mocked(mockCalendar.events.list).mock.calls[0][0];
      expect(callArgs.maxResults).toBe(20);
      expect(new Date(callArgs.timeMin!).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('respeta el parámetro maxResults personalizado', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: { items: [] },
      } as any);

      await fetchUpcomingEvents(50);

      const callArgs = vi.mocked(mockCalendar.events.list).mock.calls[0][0];
      expect(callArgs.maxResults).toBe(50);
    });
  });

  describe('fetchEventsInRange', () => {
    it('obtiene eventos en el rango de fechas especificado', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: { items: [] },
      } as any);

      const startDate = new Date('2025-12-01');
      const endDate = new Date('2025-12-31');

      await fetchEventsInRange(startDate, endDate);

      const callArgs = vi.mocked(mockCalendar.events.list).mock.calls[0][0];
      expect(callArgs.timeMin).toBe(startDate.toISOString());
      expect(callArgs.timeMax).toBe(endDate.toISOString());
      expect(callArgs.maxResults).toBe(100);
    });
  });

  describe('fetchEventsThisMonth', () => {
    it('obtiene eventos del mes actual', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: { items: [] },
      } as any);

      const now = new Date();
      await fetchEventsThisMonth();

      const callArgs = vi.mocked(mockCalendar.events.list).mock.calls[0][0];
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      expect(new Date(callArgs.timeMin!).getMonth()).toBe(startOfMonth.getMonth());
      expect(new Date(callArgs.timeMax!).getMonth()).toBe(endOfMonth.getMonth());
    });
  });

  describe('getPublicCalendarUrl', () => {
    it('usa la URL pública del entorno si está disponible', () => {
      vi.stubEnv('NEXT_PUBLIC_CALENDAR_PUBLIC_URL', 'https://custom-calendar-url.com');

      const url = getPublicCalendarUrl();

      expect(url).toBe('https://custom-calendar-url.com');
      vi.unstubAllEnvs();
    });

    it('genera URL predeterminada de Google Calendar si no hay variable de entorno', () => {
      vi.unstubAllEnvs();

      const url = getPublicCalendarUrl();

      // The module loads CALENDAR_ID from process.env at load time,
      // so this will use the value from beforeEach (test-calendar-id)
      expect(url).toContain('https://calendar.google.com/calendar/embed?src=');
      expect(url).toContain(encodeURIComponent('test-calendar-id'));
    });
  });

  describe('Metadata extraction edge cases', () => {
    it('maneja metadata con variaciones de nomenclatura', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento Test',
              description: `---METADATA---
capacidadMaxima: 200
requiere_reservacion: true
---`,
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      expect(eventos[0].capacidadMaxima).toBe(200);
      expect(eventos[0].requiresRegistro).toBe(true);
    });

    it('ignora valores de tipo inválidos en metadata', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento Test',
              description: '---METADATA--- tipo: invalido ---',
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
              colorId: '9',
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      // Debe usar el color en lugar del tipo inválido
      expect(eventos[0].tipo).toBe('ceremonia');
    });

    it('maneja capacidad con valores no numéricos', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento Test',
              description: '---METADATA--- capacidad: abc ---',
              start: {
                dateTime: '2025-12-01T10:00:00-04:00',
              },
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      // parseInt de 'abc' resulta en NaN
      expect(eventos[0].capacidadMaxima).toBeNaN();
    });
  });

  describe('Formateo de hora', () => {
    it('formatea horas correctamente para zona horaria de Puerto Rico', async () => {
      const { google } = await import('googleapis');
      const mockCalendar = google.calendar({ version: 'v3', auth: {} as any });

      vi.mocked(mockCalendar.events.list).mockResolvedValue({
        data: {
          items: [
            {
              id: 'event-1',
              summary: 'Evento Test',
              start: {
                dateTime: '2025-12-01T14:30:00-04:00',
              },
              end: {
                dateTime: '2025-12-01T16:45:00-04:00',
              },
            },
          ],
        },
      } as any);

      const eventos = await fetchCalendarEvents();

      // El formato debería ser en 12 horas con AM/PM en español
      expect(eventos[0].horaInicio).toMatch(/\d{1,2}:\d{2}/);
      expect(eventos[0].horaFin).toMatch(/\d{1,2}:\d{2}/);
    });
  });
});
