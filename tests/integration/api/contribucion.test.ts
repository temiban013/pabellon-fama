import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Use vi.hoisted to ensure mockEmailsSend is available before vi.mock runs
const { mockEmailsSend } = vi.hoisted(() => {
  return {
    mockEmailsSend: vi.fn().mockResolvedValue({
      data: { id: 'mock-email-id' },
      error: null,
      headers: null,
    }),
  };
});

// Mock Resend - all instances will use the same mockEmailsSend function
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockEmailsSend,
      },
    })),
  };
});

// Mock exaltados-all to provide controlled test data
vi.mock('@/data/exaltados-all', () => ({
  getExaltadoById: vi.fn((id: string) => {
    if (id === 'test-exaltado-1') {
      return {
        id: 'test-exaltado-1',
        nombre: 'Juan',
        apellidos: 'Hernández',
        categoria: 'ATLETA',
        deportes: ['Béisbol'],
        anoExaltacion: 2002,
        revistaNumero: 3,
        paginaInicio: 10,
        paginaFin: 12,
        contenido: {
          biografia: 'Test bio',
          logros: ['Test logro'],
        },
      };
    }
    return undefined;
  }),
  todosLosExaltados: [],
}));

// Mock email templates
vi.mock('@/lib/email/contribucion-template', () => ({
  buildAdminNotificationEmail: vi.fn().mockReturnValue('<html>Admin email</html>'),
  buildContributorConfirmationEmail: vi.fn().mockReturnValue('<html>Confirmation</html>'),
}));

// Import route handlers AFTER mocks are set up
import { POST, GET, PUT, DELETE } from '@/app/api/contribucion/route';

describe('/api/contribucion', () => {
  let testIpCounter = 0;

  beforeEach(() => {
    vi.clearAllMocks();
    testIpCounter++;

    // Set up required environment variables
    vi.stubEnv('RESEND_API_KEY', 'test-api-key');
    vi.stubEnv('NODE_ENV', 'test');

    // Reset mock to default successful response
    mockEmailsSend.mockResolvedValue({
      data: { id: 'mock-email-id' },
      error: null,
      headers: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  // Helper function to create a NextRequest with proper headers
  // Uses unique IP for each test to avoid rate limiting issues
  function createRequest(
    method: string,
    body?: any,
    headers: Record<string, string> = {}
  ): NextRequest {
    const url = 'http://localhost:3000/api/contribucion';
    const defaultIp = `10.0.0.${testIpCounter}`;
    const init: RequestInit = {
      method,
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': defaultIp,
        ...headers,
      },
    };

    if (body) {
      init.body = JSON.stringify(body);
    }

    return new NextRequest(url, init);
  }

  const validData = {
    exaltadoId: "test-exaltado-1",
    exaltadoNombre: "Juan Hernández",
    contribuidorNombre: "María López",
    contribuidorEmail: "maria@example.com",
    relacionConExaltado: "familiar",
    tipoContribucion: "estadisticas",
    informacion: "Tengo estadísticas detalladas de su carrera en béisbol",
    fuenteInformacion: "Archivos familiares y recortes de periódico",
  };

  describe('POST /api/contribucion', () => {
    it('acepta una contribución válida y devuelve 201', async () => {
      const request = createRequest('POST', validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Contribución enviada exitosamente');
      expect(data.data.id).toBeDefined();
      expect(data.data.exaltadoNombre).toBe(validData.exaltadoNombre);
    });

    it('rechaza con 422 cuando faltan campos requeridos', async () => {
      const invalidData = {
        exaltadoId: 'test-exaltado-1',
        // Missing most required fields
      };

      const request = createRequest('POST', invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Datos inválidos');
    });

    it('rechaza con 422 cuando honeypot está lleno (sin mencionar honeypot)', async () => {
      const dataConHoneypot = {
        ...validData,
        honeypot: 'spam-bot-filled-this',
      };

      const request = createRequest('POST', dataConHoneypot);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Datos inválidos');
      // Should NOT mention honeypot in error message
      expect(data.error).not.toContain('honeypot');
    });

    it('rechaza con 404 cuando exaltadoId no existe', async () => {
      const dataExaltadoInvalido = {
        ...validData,
        exaltadoId: 'no-existe-xyz',
      };

      const request = createRequest('POST', dataExaltadoInvalido);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Exaltado no encontrado');
    });

    it('rechaza Content-Type inválido con 415', async () => {
      const request = createRequest('POST', validData, {
        'content-type': 'text/plain',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(415);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Content-Type debe ser application/json');
    });

    it('rechaza JSON inválido con 400', async () => {
      const url = 'http://localhost:3000/api/contribucion';
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': `10.1.0.${testIpCounter}`,
        },
        body: 'invalid-json{',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('JSON inválido');
    });

    it('devuelve 500 cuando el envío de email falla', async () => {
      mockEmailsSend.mockResolvedValueOnce({
        data: null,
        error: { message: 'Failed to send email', name: 'EmailError' } as any,
        headers: null,
      });

      const request = createRequest('POST', validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Error al enviar la notificación');
    });

    it('incluye headers de seguridad correctos', async () => {
      const request = createRequest('POST', validData);
      const response = await POST(request);

      expect(response.headers.get('Cache-Control')).toContain('no-store');
    });

    describe('Rate Limiting', () => {
      it('rechaza el 4to request con status 429 (límite es 3)', async () => {
        const fixedIp = `10.99.0.${testIpCounter}`;

        // Send 3 requests first (all should succeed)
        for (let i = 0; i < 3; i++) {
          const request = createRequest('POST', validData, {
            'x-forwarded-for': fixedIp,
          });
          const response = await POST(request);
          expect(response.status).toBe(201);
        }

        // The 4th request should be rate limited
        const request = createRequest('POST', validData, {
          'x-forwarded-for': fixedIp,
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(429);
        expect(data.success).toBe(false);
        expect(data.error).toContain('excedido el límite');
      });

      it('incluye headers de rate limit en respuesta 429', async () => {
        const fixedIp = `10.98.0.${testIpCounter}`;

        // Send 3 requests first
        for (let i = 0; i < 3; i++) {
          const request = createRequest('POST', validData, {
            'x-forwarded-for': fixedIp,
          });
          await POST(request);
        }

        // The 4th request
        const request = createRequest('POST', validData, {
          'x-forwarded-for': fixedIp,
        });
        const response = await POST(request);

        expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
        expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
        expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
        expect(response.headers.get('Retry-After')).toBeTruthy();
      });
    });

    describe('E2E test mode', () => {
      it('omite rate limiting cuando RESEND_API_KEY comienza con re_test_', async () => {
        vi.stubEnv('RESEND_API_KEY', 're_test_xxx');

        const fixedIp = `10.97.0.${testIpCounter}`;

        // Send more than 3 requests — all should succeed (no rate limiting)
        for (let i = 0; i < 5; i++) {
          const request = createRequest('POST', validData, {
            'x-forwarded-for': fixedIp,
          });
          const response = await POST(request);
          expect(response.status).toBe(201);
        }
      });
    });
  });

  describe('Métodos HTTP no permitidos', () => {
    it('rechaza GET con 405', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Método no permitido');
    });

    it('rechaza PUT con 405', async () => {
      const response = await PUT();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.success).toBe(false);
    });

    it('rechaza DELETE con 405', async () => {
      const response = await DELETE();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.success).toBe(false);
    });
  });
});
