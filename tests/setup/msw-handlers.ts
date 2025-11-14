import { http, HttpResponse } from 'msw'
import { mockEventosResponse, mockRegistroSuccess } from '../mocks/api-data'

/**
 * MSW handlers for mocking API endpoints
 * Add or override handlers as needed in individual tests using server.use()
 */
export const handlers = [
  // Mock /api/eventos endpoint (Google Calendar)
  http.get('/api/eventos', ({ request }) => {
    const url = new URL(request.url)
    const mode = url.searchParams.get('mode') || 'upcoming'
    const tipo = url.searchParams.get('tipo')

    let eventos = mockEventosResponse.eventos

    // Filter by type if specified
    if (tipo && tipo !== 'todos') {
      eventos = eventos.filter(evento => evento.tipo === tipo)
    }

    return HttpResponse.json({
      eventos,
      total: eventos.length,
      nextPageToken: null,
    })
  }),

  // Mock /api/registro endpoint
  http.post('/api/registro', async ({ request }) => {
    const body = await request.json() as any

    // Simulate validation error for specific test cases
    if (body?.email === 'error@test.com') {
      return HttpResponse.json(
        {
          error: 'Error de validación',
          details: 'Email inválido'
        },
        { status: 400 }
      )
    }

    // Simulate server error
    if (body?.email === 'server-error@test.com') {
      return HttpResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    return HttpResponse.json(mockRegistroSuccess)
  }),

  // Mock /api/admin/registraciones endpoint
  http.get('/api/admin/registraciones', () => {
    return HttpResponse.json({
      registraciones: [],
      total: 0,
    })
  }),
]
