import { describe, it, expect } from 'vitest';
import {
  registroSchema,
  registroApiSchema,
  emailResponseSchema,
  validateRegistro,
  validateRegistroApi,
  type RegistroFormInput,
  type RegistroApiInput,
} from '@/lib/validations';

describe('validations.ts', () => {
  describe('registroSchema', () => {
    describe('email validation', () => {
      it('acepta un email válido', () => {
        const data = {
          email: 'usuario@example.com',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('rechaza email vacío', () => {
        const data = {
          email: '',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('El email es requerido');
        }
      });

      it('rechaza formato de email inválido', () => {
        const data = {
          email: 'email-invalido',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Formato de email inválido');
        }
      });

      it('rechaza email demasiado largo', () => {
        const data = {
          email: 'a'.repeat(250) + '@example.com', // Más de 255 caracteres
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Email demasiado largo');
        }
      });

      it('acepta emails con caracteres especiales válidos', () => {
        const validEmails = [
          'usuario.nombre@example.com',
          'usuario+tag@example.com',
          'usuario_nombre@example.co.do',
          '123@example.com',
        ];

        validEmails.forEach((email) => {
          const data = { email, interes: 'general' as const };
          const result = registroSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('nombre validation', () => {
      it('acepta un nombre válido', () => {
        const data = {
          email: 'test@example.com',
          nombre: 'Juan Pérez',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta nombre vacío (campo opcional)', () => {
        const data = {
          email: 'test@example.com',
          nombre: '',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta omitir el campo nombre', () => {
        const data = {
          email: 'test@example.com',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('rechaza nombre con menos de 2 caracteres', () => {
        const data = {
          email: 'test@example.com',
          nombre: 'J',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe(
            'El nombre debe tener al menos 2 caracteres'
          );
        }
      });

      it('rechaza nombre demasiado largo', () => {
        const data = {
          email: 'test@example.com',
          nombre: 'a'.repeat(101),
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Nombre demasiado largo');
        }
      });

      it('acepta nombres con acentos y ñ', () => {
        const nombresValidos = [
          'María José',
          'José Ángel',
          'Ramón Núñez',
          'Óscar Pérez',
          'Iñaki',
        ];

        nombresValidos.forEach((nombre) => {
          const data = {
            email: 'test@example.com',
            nombre,
            interes: 'general' as const,
          };
          const result = registroSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('rechaza nombres con números', () => {
        const data = {
          email: 'test@example.com',
          nombre: 'Juan123',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Solo letras y espacios permitidos');
        }
      });

      it('rechaza nombres con caracteres especiales', () => {
        const data = {
          email: 'test@example.com',
          nombre: 'Juan@Pérez',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('telefono validation', () => {
      it('acepta teléfono vacío (campo opcional)', () => {
        const data = {
          email: 'test@example.com',
          telefono: '',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta omitir el campo teléfono', () => {
        const data = {
          email: 'test@example.com',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta formatos de teléfono válidos', () => {
        const telefonosValidos = [
          '787-123-4567',
          '7871234567',
          '(787)123-4567',
          '(787)1234567',
          '+1-787-123-4567',
          '1-787-123-4567',
        ];

        telefonosValidos.forEach((telefono) => {
          const data = {
            email: 'test@example.com',
            telefono,
            interes: 'general' as const,
          };
          const result = registroSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('rechaza formatos de teléfono inválidos', () => {
        const telefonosInvalidos = [
          '123',
          '12345',
          'abc-def-ghij',
          '787-12-34567',
          '787 123 4567', // Espacios no permitidos sin paréntesis
        ];

        telefonosInvalidos.forEach((telefono) => {
          const data = {
            email: 'test@example.com',
            telefono,
            interes: 'general' as const,
          };
          const result = registroSchema.safeParse(data);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.errors[0].message).toContain('Formato de teléfono inválido');
          }
        });
      });
    });

    describe('interes validation', () => {
      it('acepta valores válidos de interés', () => {
        const interesesValidos: Array<'visitante' | 'voluntario' | 'investigador' | 'general'> = [
          'visitante',
          'voluntario',
          'investigador',
          'general',
        ];

        interesesValidos.forEach((interes) => {
          const data = {
            email: 'test@example.com',
            interes,
          };
          const result = registroSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('rechaza valores inválidos de interés', () => {
        const data = {
          email: 'test@example.com',
          interes: 'invalido',
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe(
            'Selecciona un tipo de interés válido'
          );
        }
      });

      it('requiere el campo interes', () => {
        const data = {
          email: 'test@example.com',
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('mensaje validation', () => {
      it('acepta mensaje vacío (campo opcional)', () => {
        const data = {
          email: 'test@example.com',
          mensaje: '',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta omitir el campo mensaje', () => {
        const data = {
          email: 'test@example.com',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta mensaje válido', () => {
        const data = {
          email: 'test@example.com',
          mensaje: 'Este es un mensaje de prueba',
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('rechaza mensaje demasiado largo', () => {
        const data = {
          email: 'test@example.com',
          mensaje: 'a'.repeat(501),
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe(
            'El mensaje no puede exceder 500 caracteres'
          );
        }
      });

      it('acepta mensaje con 500 caracteres exactos', () => {
        const data = {
          email: 'test@example.com',
          mensaje: 'a'.repeat(500),
          interes: 'general' as const,
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('datos completos válidos', () => {
      it('valida datos completos correctamente', () => {
        const data: RegistroFormInput = {
          email: 'juan.perez@example.com',
          nombre: 'Juan Pérez',
          telefono: '809-555-1234',
          interes: 'visitante',
          mensaje: 'Me gustaría visitar el Pabellón de la Fama',
        };
        const result = registroSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(data);
        }
      });
    });
  });

  describe('registroApiSchema', () => {
    it('requiere el campo nombre (más estricto que registroSchema)', () => {
      const data = {
        email: 'test@example.com',
        interes: 'general' as const,
      };
      const result = registroApiSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'El nombre es requerido para el registro'
        );
      }
    });

    it('rechaza nombre vacío', () => {
      const data = {
        email: 'test@example.com',
        nombre: '',
        interes: 'general' as const,
      };
      const result = registroApiSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('acepta datos válidos con nombre', () => {
      const data: RegistroApiInput = {
        email: 'test@example.com',
        nombre: 'Juan Pérez',
        interes: 'general',
      };
      const result = registroApiSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('hereda todas las validaciones de registroSchema', () => {
      const data = {
        email: 'email-invalido',
        nombre: 'Juan',
        interes: 'general' as const,
      };
      const result = registroApiSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Formato de email inválido');
      }
    });
  });

  describe('emailResponseSchema', () => {
    it('valida respuesta de email exitosa', () => {
      const response = {
        success: true,
        message: 'Email enviado correctamente',
        data: {
          id: 'email-123',
          email: 'test@example.com',
          fechaRegistro: '2025-11-14T10:00:00Z',
        },
      };
      const result = emailResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('valida respuesta de email sin data (opcional)', () => {
      const response = {
        success: false,
        message: 'Error al enviar email',
      };
      const result = emailResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('rechaza respuesta sin campo success', () => {
      const response = {
        message: 'Email enviado',
      };
      const result = emailResponseSchema.safeParse(response);
      expect(result.success).toBe(false);
    });

    it('rechaza respuesta sin campo message', () => {
      const response = {
        success: true,
      };
      const result = emailResponseSchema.safeParse(response);
      expect(result.success).toBe(false);
    });

    it('rechaza data con formato de email inválido', () => {
      const response = {
        success: true,
        message: 'Email enviado',
        data: {
          id: 'email-123',
          email: 'email-invalido',
          fechaRegistro: '2025-11-14T10:00:00Z',
        },
      };
      const result = emailResponseSchema.safeParse(response);
      expect(result.success).toBe(false);
    });

    it('rechaza data con formato de fecha inválido', () => {
      const response = {
        success: true,
        message: 'Email enviado',
        data: {
          id: 'email-123',
          email: 'test@example.com',
          fechaRegistro: 'fecha-invalida',
        },
      };
      const result = emailResponseSchema.safeParse(response);
      expect(result.success).toBe(false);
    });
  });

  describe('validateRegistro helper', () => {
    it('valida datos correctos', () => {
      const data = {
        email: 'test@example.com',
        interes: 'general',
      };
      const result = validateRegistro(data);
      expect(result.success).toBe(true);
    });

    it('rechaza datos incorrectos', () => {
      const data = {
        email: 'invalido',
        interes: 'general',
      };
      const result = validateRegistro(data);
      expect(result.success).toBe(false);
    });

    it('maneja datos null o undefined', () => {
      expect(validateRegistro(null).success).toBe(false);
      expect(validateRegistro(undefined).success).toBe(false);
    });
  });

  describe('validateRegistroApi helper', () => {
    it('valida datos correctos con nombre', () => {
      const data = {
        email: 'test@example.com',
        nombre: 'Juan Pérez',
        interes: 'general',
      };
      const result = validateRegistroApi(data);
      expect(result.success).toBe(true);
    });

    it('rechaza datos sin nombre', () => {
      const data = {
        email: 'test@example.com',
        interes: 'general',
      };
      const result = validateRegistroApi(data);
      expect(result.success).toBe(false);
    });

    it('maneja datos null o undefined', () => {
      expect(validateRegistroApi(null).success).toBe(false);
      expect(validateRegistroApi(undefined).success).toBe(false);
    });
  });
});
