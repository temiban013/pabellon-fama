/**
 * Unit tests for lib/googleCalendar.ts
 * Tests Google Calendar integration and event transformation logic
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// We'll test the pure functions by importing them directly
// Note: The actual functions are not exported, so we'll test through the main exported functions
// For now, we'll focus on testing the transformation logic by mocking the Google API

// Mock the googleapis module
vi.mock('googleapis', () => {
  const mockCalendarEvents = {
    list: vi.fn(),
  }

  return {
    google: {
      auth: {
        JWT: vi.fn().mockImplementation(() => ({})),
      },
      calendar: vi.fn(() => ({
        events: mockCalendarEvents,
      })),
    },
  }
})

// Import after mocking
import {
  fetchCalendarEvents,
  fetchUpcomingEvents,
  fetchEventsInRange,
  fetchEventsThisMonth,
  getPublicCalendarUrl,
} from '@/lib/googleCalendar'
import { google } from 'googleapis'

describe('Google Calendar Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set up required env vars
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@example.com'
    process.env.GOOGLE_PRIVATE_KEY = 'test-key\\nwith\\nnewlines'
    process.env.GOOGLE_CALENDAR_ID = 'test-calendar@group.calendar.google.com'
  })

  describe('fetchCalendarEvents', () => {
    it('should fetch and transform calendar events', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-1',
          summary: 'Ceremonia de Inducción 2025',
          description: 'Ceremonia anual de exaltación',
          location: 'Centro de Bellas Artes',
          start: {
            dateTime: '2025-06-15T19:00:00-04:00',
          },
          end: {
            dateTime: '2025-06-15T22:00:00-04:00',
          },
          colorId: '9',
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: mockGoogleEvents,
            },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents({ maxResults: 10 })

      expect(eventos).toHaveLength(1)
      expect(eventos[0]).toMatchObject({
        id: 'evt-1',
        titulo: 'Ceremonia de Inducción 2025',
        descripcion: 'Ceremonia anual de exaltación',
        ubicacion: 'Centro de Bellas Artes',
        tipo: 'ceremonia',
      })
    })

    it('should handle events with metadata in description', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-2',
          summary: 'Torneo Especial',
          description: `
            Torneo anual de béisbol
            ---METADATA---
            tipo: educativo
            capacidad: 500
            requiereReservacion: true
            destacado: true
            ---
          `,
          location: 'Estadio Municipal',
          start: {
            dateTime: '2025-07-20T09:00:00-04:00',
          },
          colorId: '6',
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: mockGoogleEvents,
            },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos).toHaveLength(1)
      expect(eventos[0]).toMatchObject({
        tipo: 'educativo', // From metadata, not colorId
        requiresRegistro: true,
        capacidadMaxima: 500,
      })
      // Description should be cleaned (metadata removed)
      expect(eventos[0].descripcion).toContain('Torneo anual')
      expect(eventos[0].descripcion).not.toContain('---METADATA---')
    })

    it('should handle all-day events', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-3',
          summary: 'Exposición Todo el Día',
          description: 'Exposición especial',
          start: {
            date: '2025-08-01',
          },
          end: {
            date: '2025-08-02',
          },
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: mockGoogleEvents,
            },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos).toHaveLength(1)
      expect(eventos[0].horaInicio).toBe('Todo el día')
    })

    it('should filter out events without required fields', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-valid',
          summary: 'Valid Event',
          start: {
            dateTime: '2025-06-15T19:00:00-04:00',
          },
        },
        {
          id: 'evt-no-summary',
          start: {
            dateTime: '2025-06-15T19:00:00-04:00',
          },
        },
        {
          id: 'evt-no-start',
          summary: 'No Start Date',
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: mockGoogleEvents,
            },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos).toHaveLength(1)
      expect(eventos[0].id).toBe('evt-valid')
    })

    it('should handle empty response', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: [],
            },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos).toHaveLength(0)
    })

    it('should set default values for missing fields', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-minimal',
          summary: 'Minimal Event',
          start: {
            dateTime: '2025-06-15T19:00:00-04:00',
          },
          // No description, location, etc.
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: {
              items: mockGoogleEvents,
            },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos[0].descripcion).toBe('Sin descripción')
      expect(eventos[0].ubicacion).toBe('Por confirmar')
      expect(eventos[0].estado).toBe('programado')
      expect(eventos[0].requiresRegistro).toBe(false)
    })

    it('should handle API errors', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockRejectedValue(new Error('API Error')),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      await expect(fetchCalendarEvents()).rejects.toThrow(
        'Error al obtener eventos del calendario'
      )
    })

    it('should respect maxResults parameter', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: [] },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      await fetchCalendarEvents({ maxResults: 10 })

      expect(mockCalendar.events.list).toHaveBeenCalledWith(
        expect.objectContaining({
          maxResults: 10,
        })
      )
    })

    it('should respect time range parameters', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: [] },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const timeMin = new Date('2025-06-01')
      const timeMax = new Date('2025-06-30')

      await fetchCalendarEvents({ timeMin, timeMax })

      expect(mockCalendar.events.list).toHaveBeenCalledWith(
        expect.objectContaining({
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
        })
      )
    })

    it('should handle metadata with comma separators', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-comma',
          summary: 'Event with Comma Metadata',
          description: '---METADATA--- tipo: museo, capacidad: 100, requiereReservacion: true ---',
          start: {
            dateTime: '2025-06-15T19:00:00-04:00',
          },
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: mockGoogleEvents },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos[0].tipo).toBe('museo')
      expect(eventos[0].capacidadMaxima).toBe(100)
      expect(eventos[0].requiresRegistro).toBe(true)
    })

    it('should handle HTML entities in description', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-html',
          summary: 'Event with HTML',
          description: '<p>Tom &amp; Jerry</p>&nbsp;&quot;Test&quot;',
          start: {
            dateTime: '2025-06-15T19:00:00-04:00',
          },
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: mockGoogleEvents },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos[0].descripcion).toContain('Tom & Jerry')
      expect(eventos[0].descripcion).toContain('"Test"')
      expect(eventos[0].descripcion).not.toContain('&amp;')
      expect(eventos[0].descripcion).not.toContain('<p>')
    })
  })

  describe('fetchUpcomingEvents', () => {
    it('should fetch events from now onwards', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: [] },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      await fetchUpcomingEvents(20)

      expect(mockCalendar.events.list).toHaveBeenCalledWith(
        expect.objectContaining({
          maxResults: 20,
        })
      )

      // Verify timeMin is approximately now
      const callArgs = mockCalendar.events.list.mock.calls[0][0]
      const timeMin = new Date(callArgs.timeMin)
      const now = new Date()
      expect(timeMin.getTime()).toBeLessThanOrEqual(now.getTime())
      expect(timeMin.getTime()).toBeGreaterThan(now.getTime() - 5000) // Within 5 seconds
    })

    it('should use default maxResults of 20', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: [] },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      await fetchUpcomingEvents()

      expect(mockCalendar.events.list).toHaveBeenCalledWith(
        expect.objectContaining({
          maxResults: 20,
        })
      )
    })
  })

  describe('fetchEventsInRange', () => {
    it('should fetch events in specified date range', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: [] },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const startDate = new Date('2025-06-01')
      const endDate = new Date('2025-06-30')

      await fetchEventsInRange(startDate, endDate)

      expect(mockCalendar.events.list).toHaveBeenCalledWith(
        expect.objectContaining({
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          maxResults: 100,
        })
      )
    })
  })

  describe('fetchEventsThisMonth', () => {
    it('should fetch events for current month', async () => {
      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: [] },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      await fetchEventsThisMonth()

      const now = new Date()
      const expectedStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const expectedEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

      const callArgs = mockCalendar.events.list.mock.calls[0][0]
      const actualStart = new Date(callArgs.timeMin)
      const actualEnd = new Date(callArgs.timeMax)

      expect(actualStart.getFullYear()).toBe(expectedStart.getFullYear())
      expect(actualStart.getMonth()).toBe(expectedStart.getMonth())
      expect(actualStart.getDate()).toBe(1)

      expect(actualEnd.getFullYear()).toBe(expectedEnd.getFullYear())
      expect(actualEnd.getMonth()).toBe(expectedEnd.getMonth())
    })
  })

  describe('getPublicCalendarUrl', () => {
    it('should return custom URL if env var is set', () => {
      process.env.NEXT_PUBLIC_CALENDAR_PUBLIC_URL = 'https://custom-calendar-url.com'

      const url = getPublicCalendarUrl()

      expect(url).toBe('https://custom-calendar-url.com')
    })

    it('should generate default URL if env var is not set', () => {
      delete process.env.NEXT_PUBLIC_CALENDAR_PUBLIC_URL

      // Note: CALENDAR_ID is set at module load time from env var
      // In test environment it's 'test-calendar@group.calendar.google.com'
      const url = getPublicCalendarUrl()

      expect(url).toContain('https://calendar.google.com/calendar/embed')
      expect(url).toContain('test-calendar')
    })
  })

  describe('Color to Tipo mapping', () => {
    it('should map color IDs to event tipos correctly', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-ceremonia',
          summary: 'Ceremonia',
          start: { dateTime: '2025-06-15T19:00:00-04:00' },
          colorId: '9', // Blueberry -> ceremonia
        },
        {
          id: 'evt-museo',
          summary: 'Museo',
          start: { dateTime: '2025-06-16T19:00:00-04:00' },
          colorId: '10', // Basil -> museo
        },
        {
          id: 'evt-educativo',
          summary: 'Educativo',
          start: { dateTime: '2025-06-17T19:00:00-04:00' },
          colorId: '3', // Grape -> educativo
        },
        {
          id: 'evt-especial',
          summary: 'Especial',
          start: { dateTime: '2025-06-18T19:00:00-04:00' },
          colorId: '6', // Tangerine -> especial
        },
        {
          id: 'evt-reunion',
          summary: 'Reunión',
          start: { dateTime: '2025-06-19T19:00:00-04:00' },
          colorId: '8', // Graphite -> reunion
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: mockGoogleEvents },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos[0].tipo).toBe('ceremonia')
      expect(eventos[1].tipo).toBe('museo')
      expect(eventos[2].tipo).toBe('educativo')
      expect(eventos[3].tipo).toBe('especial')
      expect(eventos[4].tipo).toBe('reunion')
    })

    it('should default to "especial" for unmapped colors', async () => {
      const mockGoogleEvents = [
        {
          id: 'evt-unknown',
          summary: 'Unknown Color',
          start: { dateTime: '2025-06-15T19:00:00-04:00' },
          colorId: '99', // Unknown color
        },
      ]

      const mockCalendar = {
        events: {
          list: vi.fn().mockResolvedValue({
            data: { items: mockGoogleEvents },
          }),
        },
      }

      vi.mocked(google.calendar).mockReturnValue(mockCalendar as any)

      const eventos = await fetchCalendarEvents()

      expect(eventos[0].tipo).toBe('especial')
    })
  })
})
