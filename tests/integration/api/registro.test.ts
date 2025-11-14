import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET, OPTIONS, PUT, DELETE } from '@/app/api/registro/route';
import { NextRequest } from 'next/server';

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({
          data: { id: 'mock-email-id' },
          error: null,
        }),
      },
    })),
  };
});

describe('/api/registro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up required environment variables
    process.env.RESEND_API_KEY = 'test-api-key';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper function to create a NextRequest with proper headers
  function createRequest(
    method: string,
    body?: any,
    headers: Record<string, string> = {}
  ): NextRequest {
    const url = 'http://localhost:3000/api/registro';
    const init: RequestInit = {
      method,
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
        ...headers,
      },
    };

    if (body) {
      init.body = JSON.stringify(body);
    }

    return new NextRequest(url, init);
  }

  describe('POST /api/registro', () => {
    const validData = {
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      telefono: '787-123-4567',
      interes: 'general' as const,
      mensaje: 'Me gustaría recibir más información',
    };

    it('acepta un registro válido y devuelve 201', async () => {
      const request = createRequest('POST', validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Registro completado exitosamente');
      expect(data.data.email).toBe(validData.email);
    });

    it('valida que el nombre sea requerido', async () => {
      const invalidData = {
        ...validData,
        nombre: '',
      };

      const request = createRequest('POST', invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Datos inválidos');
    });

    it('valida formato de email', async () => {
      const invalidData = {
        ...validData,
        email: 'email-invalido',
      };

      const request = createRequest('POST', invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Datos inválidos');
    });

    it('valida que el interés sea un valor válido', async () => {
      const invalidData = {
        ...validData,
        interes: 'tipo-invalido',
      };

      const request = createRequest('POST', invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.success).toBe(false);
    });

    it('acepta teléfono opcional válido', async () => {
      const dataConTelefono = {
        ...validData,
        telefono: '787-123-4567',
      };

      const request = createRequest('POST', dataConTelefono);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });

    it('acepta registro sin teléfono (campo opcional)', async () => {
      const dataSinTelefono = {
        nombre: 'María González',
        email: 'maria@example.com',
        interes: 'visitante' as const,
      };

      const request = createRequest('POST', dataSinTelefono);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });

    it('acepta registro sin mensaje (campo opcional)', async () => {
      const dataSinMensaje = {
        nombre: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        interes: 'investigador' as const,
      };

      const request = createRequest('POST', dataSinMensaje);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });

    it('rechaza Content-Type inválido', async () => {
      const request = createRequest('POST', validData, {
        'content-type': 'text/plain',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(415);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Content-Type debe ser application/json');
    });

    it('rechaza JSON inválido', async () => {
      const url = 'http://localhost:3000/api/registro';
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
        },
        body: 'invalid-json{',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('JSON inválido');
    });

    it('maneja error al enviar email correctamente', async () => {
      // Mock Resend to fail
      const { Resend } = await import('resend');
      const mockResend = new Resend('test');
      vi.mocked(mockResend.emails.send).mockResolvedValue({
        data: null,
        error: { message: 'Failed to send email', name: 'EmailError' } as any,
      });

      const request = createRequest('POST', validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Error al enviar la notificación');
    });

    it('incluye headers CORS correctos', async () => {
      const request = createRequest('POST', validData);
      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('escapa HTML en los datos del email para prevenir XSS', async () => {
      const dataConHTML = {
        nombre: '<script>alert("xss")</script>Juan',
        email: 'test@example.com',
        interes: 'general' as const,
        mensaje: '<img src=x onerror=alert(1)>',
      };

      const request = createRequest('POST', dataConHTML);
      const response = await POST(request);

      // Debería procesar exitosamente después de escapar el HTML
      expect(response.status).toBe(201);
    });

    describe('Rate Limiting', () => {
      it('permite hasta 5 requests desde la misma IP', async () => {
        const requests = [];

        // Enviar 5 requests
        for (let i = 0; i < 5; i++) {
          const request = createRequest('POST', validData);
          requests.push(POST(request));
        }

        const responses = await Promise.all(requests);

        // Todas deberían ser exitosas
        responses.forEach((response) => {
          expect(response.status).toBe(201);
        });
      });

      it('rechaza el 6to request con status 429', async () => {
        // Enviar 5 requests primero
        for (let i = 0; i < 5; i++) {
          const request = createRequest('POST', validData);
          await POST(request);
        }

        // El 6to request debería ser rechazado
        const request = createRequest('POST', validData);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(429);
        expect(data.success).toBe(false);
        expect(data.error).toContain('excedido el límite de registros');
      });

      it('incluye headers de rate limit en respuesta 429', async () => {
        // Enviar 5 requests primero
        for (let i = 0; i < 5; i++) {
          const request = createRequest('POST', validData);
          await POST(request);
        }

        // El 6to request
        const request = createRequest('POST', validData);
        const response = await POST(request);

        expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
        expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
        expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
        expect(response.headers.get('Retry-After')).toBeTruthy();
      });

      it('permite requests desde IPs diferentes', async () => {
        const ips = ['192.168.1.1', '192.168.1.2', '192.168.1.3'];

        for (const ip of ips) {
          const request = createRequest('POST', validData, {
            'x-forwarded-for': ip,
          });
          const response = await POST(request);

          expect(response.status).toBe(201);
        }
      });

      it('identifica IP desde x-real-ip header', async () => {
        const request = createRequest('POST', validData, {
          'x-real-ip': '10.0.0.1',
        });
        const response = await POST(request);

        expect(response.status).toBe(201);
      });

      it('identifica IP desde cf-connecting-ip header (Cloudflare)', async () => {
        const request = createRequest('POST', validData, {
          'cf-connecting-ip': '172.16.0.1',
        });
        const response = await POST(request);

        expect(response.status).toBe(201);
      });

      it('maneja múltiples IPs en x-forwarded-for (toma la primera)', async () => {
        const request = createRequest('POST', validData, {
          'x-forwarded-for': '203.0.113.1, 203.0.113.2, 203.0.113.3',
        });
        const response = await POST(request);

        expect(response.status).toBe(201);
      });
    });

    describe('Tipos de interés', () => {
      const tiposInteres = ['general', 'visitante', 'investigador', 'voluntario'] as const;

      tiposInteres.forEach((interes) => {
        it(`acepta tipo de interés: ${interes}`, async () => {
          const data = {
            ...validData,
            interes,
          };

          const request = createRequest('POST', data);
          const response = await POST(request);
          const responseData = await response.json();

          expect(response.status).toBe(201);
          expect(responseData.success).toBe(true);
        });
      });
    });
  });

  describe('OPTIONS /api/registro (CORS preflight)', () => {
    it('devuelve 200 con headers CORS', async () => {
      const response = await OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
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

  describe('Manejo de errores', () => {
    it('maneja errores internos correctamente en desarrollo', async () => {
      process.env.NODE_ENV = 'development';

      // Forzar un error al mockear la función de envío de email para lanzar
      const { Resend } = await import('resend');
      const mockResend = new Resend('test');
      vi.mocked(mockResend.emails.send).mockRejectedValue(
        new Error('Unexpected error')
      );

      const request = createRequest('POST', {
        nombre: 'Test',
        email: 'test@example.com',
        interes: 'general',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Error al enviar la notificación');
    });

    it('oculta detalles de errores en producción', async () => {
      process.env.NODE_ENV = 'production';

      const { Resend } = await import('resend');
      const mockResend = new Resend('test');
      vi.mocked(mockResend.emails.send).mockRejectedValue(
        new Error('Internal database error')
      );

      const request = createRequest('POST', {
        nombre: 'Test',
        email: 'test@example.com',
        interes: 'general',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).not.toContain('Internal database error');
      expect(data.error).toContain('Error al enviar la notificación');
    });
  });

  describe('Validación de campos', () => {
    it('valida longitud mínima del nombre', async () => {
      const request = createRequest('POST', {
        nombre: 'J',
        email: 'test@example.com',
        interes: 'general',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.error).toContain('Datos inválidos');
    });

    it('valida longitud máxima del mensaje', async () => {
      const request = createRequest('POST', {
        nombre: 'Juan Pérez',
        email: 'test@example.com',
        interes: 'general',
        mensaje: 'a'.repeat(501), // Más de 500 caracteres
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.error).toContain('Datos inválidos');
    });

    it('acepta mensaje con exactamente 500 caracteres', async () => {
      const request = createRequest('POST', {
        nombre: 'Juan Pérez',
        email: 'test@example.com',
        interes: 'general',
        mensaje: 'a'.repeat(500),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
    });
  });
});
