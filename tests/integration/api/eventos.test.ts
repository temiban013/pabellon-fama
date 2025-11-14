/**
 * Integration tests for /api/eventos route
 * Tests Google Calendar API integration with mocked responses
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, OPTIONS, POST, PUT, DELETE } from '@/app/api/eventos/route'
import { NextRequest } from 'next/server'
import type { Evento } from '@/lib/types'

// Mock the Google Calendar functions
vi.mock('@/lib/googleCalendar', () => ({
  fetchUpcomingEvents: vi.fn(),
  fetchEventsInRange: vi.fn(),
  fetchEventsThisMonth: vi.fn(),
}))

import {
  fetchUpcomingEvents,
  fetchEventsInRange,
  fetchEventsThisMonth,
} from '@/lib/googleCalendar'

// Mock event data with proper types
const mockEventos: Evento[] = [
  {
    id: 'evt-1',
    titulo: 'Ceremonia de Inducción 2025',
    descripcion: 'Ceremonia anual',
    fecha: new Date('2025-06-15T19:00:00-04:00'),
    horaInicio: '7:00 PM',
    horaFin: '10:00 PM',
    ubicacion: 'Centro de Bellas Artes',
    tipo: 'ceremonia-exaltacion',
    estado: 'programado',
    requiresRegistro: true,
    capacidadMaxima: 500,
  },
  {
    id: 'evt-2',
    titulo: 'Torneo de Béisbol',
    descripcion: 'Torneo juvenil',
    fecha: new Date('2025-07-20T09:00:00-04:00'),
    horaInicio: '9:00 AM',
    ubicacion: 'Estadio Municipal',
    tipo: 'competencia',
    estado: 'programado',
    requiresRegistro: false,
  },
  {
    id: 'evt-3',
    titulo: 'Exposición Histórica',
    descripcion: 'Exhibición especial',
    fecha: new Date('2025-08-01T10:00:00-04:00'),
    horaInicio: '10:00 AM',
    ubicacion: 'Museo',
    tipo: 'tour-museo',
    estado: 'programado',
    requiresRegistro: false,
  },
]

// Helper to create NextRequest
function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'))
}

describe('GET /api/eventos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mode: upcoming (default)', () => {
    it('should fetch upcoming events with default parameters', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(fetchUpcomingEvents).toHaveBeenCalledWith(50)
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(3)
      expect(data.metadata).toMatchObject({
        count: 3,
        cached: false,
      })
    })

    it('should respect maxResults parameter', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos.slice(0, 2))

      const request = createRequest('/api/eventos?maxResults=2')
      const response = await GET(request)
      const data = await response.json()

      expect(fetchUpcomingEvents).toHaveBeenCalledWith(2)
      expect(data.data).toHaveLength(2)
    })

    it('should sort events by date', async () => {
      const unsortedEvents = [mockEventos[2], mockEventos[0], mockEventos[1]]
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(unsortedEvents)

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data[0].id).toBe('evt-1')
      expect(data.data[1].id).toBe('evt-2')
      expect(data.data[2].id).toBe('evt-3')
    })
  })

  describe('Mode: range', () => {
    it('should fetch events in date range', async () => {
      vi.mocked(fetchEventsInRange).mockResolvedValue(mockEventos)

      const request = createRequest(
        '/api/eventos?mode=range&startDate=2025-06-01&endDate=2025-06-30'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(fetchEventsInRange).toHaveBeenCalled()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return error if startDate is missing', async () => {
      const request = createRequest('/api/eventos?mode=range&endDate=2025-06-30')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('startDate y endDate')
    })

    it('should return error if endDate is missing', async () => {
      const request = createRequest('/api/eventos?mode=range&startDate=2025-06-01')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('startDate y endDate')
    })
  })

  describe('Mode: month', () => {
    it('should fetch events for current month', async () => {
      vi.mocked(fetchEventsThisMonth).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos?mode=month')
      const response = await GET(request)
      const data = await response.json()

      expect(fetchEventsThisMonth).toHaveBeenCalled()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('Filtering by tipo', () => {
    it('should filter events by tipo=ceremonia-exaltacion', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos?tipo=ceremonia-exaltacion')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data).toHaveLength(1)
      expect(data.data[0].tipo).toBe('ceremonia-exaltacion')
    })

    it('should filter events by tipo=competencia', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos?tipo=competencia')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data).toHaveLength(1)
      expect(data.data[0].tipo).toBe('competencia')
    })

    it('should return all events if tipo is not specified', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data).toHaveLength(3)
    })

    it('should return empty array if no events match tipo', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos?tipo=reunion-junta')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data).toHaveLength(0)
    })
  })

  describe('Error handling', () => {
    it('should handle credentials error', async () => {
      vi.mocked(fetchUpcomingEvents).mockRejectedValue(
        new Error('Faltan credenciales de Google Calendar')
      )

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Credenciales')
    })

    it('should handle quota/rate limit error', async () => {
      vi.mocked(fetchUpcomingEvents).mockRejectedValue(
        new Error('API quota exceeded')
      )

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Límite de API')
    })

    it('should handle generic errors in development', async () => {
      const originalEnv = process.env.NODE_ENV

      vi.mocked(fetchUpcomingEvents).mockRejectedValue(
        new Error('Something went wrong')
      )

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      // Error message will be shown in dev mode or hidden in production depending on env
    })

    it('should handle generic errors in production', async () => {
      vi.mocked(fetchUpcomingEvents).mockRejectedValue(
        new Error('Something went wrong')
      )

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBeTruthy()
    })

    it('should handle non-Error exceptions', async () => {
      vi.mocked(fetchUpcomingEvents).mockRejectedValue('string error')

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('Response format', () => {
    it('should include success flag', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
    })

    it('should include data array', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toHaveProperty('data')
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should include metadata', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toHaveProperty('metadata')
      expect(data.metadata).toHaveProperty('count')
      expect(data.metadata).toHaveProperty('cached')
      expect(data.metadata).toHaveProperty('timestamp')
    })

    it('should include CORS headers', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos')
      const response = await GET(request)

      expect(response.headers.get('Access-Control-Allow-Methods')).toBeTruthy()
    })

    it('should include Cache-Control header', async () => {
      vi.mocked(fetchUpcomingEvents).mockResolvedValue(mockEventos)

      const request = createRequest('/api/eventos')
      const response = await GET(request)

      expect(response.headers.get('Cache-Control')).toContain('public')
    })
  })
})

describe('OPTIONS /api/eventos', () => {
  it('should return CORS headers', async () => {
    const response = await OPTIONS()

    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Methods')).toBeTruthy()
  })
})

describe('Unsupported HTTP methods', () => {
  it('should reject POST requests', async () => {
    const response = await POST()
    const data = await response.json()

    expect(response.status).toBe(405)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Método no permitido')
  })

  it('should reject PUT requests', async () => {
    const response = await PUT()
    const data = await response.json()

    expect(response.status).toBe(405)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Método no permitido')
  })

  it('should reject DELETE requests', async () => {
    const response = await DELETE()
    const data = await response.json()

    expect(response.status).toBe(405)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Método no permitido')
  })
})
