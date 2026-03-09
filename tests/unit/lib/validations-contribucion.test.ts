import { describe, it, expect } from 'vitest';
import {
  contribucionFormSchema,
  validateContribucion,
  estadisticaContribuidaSchema,
  datosPersonalesContribuidosSchema,
} from '@/lib/validations/contribucion';

describe('validations/contribucion.ts', () => {
  const validData = {
    exaltadoId: "test-exaltado-1",
    exaltadoNombre: "Juan Hernández",
    contribuidorNombre: "María López",
    contribuidorEmail: "maria@example.com",
    contribuidorTelefono: "787-123-4567",
    relacionConExaltado: "familiar" as const,
    relacionDetalle: "Soy su nieta",
    tipoContribucion: "estadisticas" as const,
    informacion: "Tengo estadísticas de su carrera en béisbol profesional",
    fuenteInformacion: "Archivos familiares y recortes de periódico",
    documentosSoporte: "Tengo fotos y recortes del periódico El Mundo",
  };

  describe('contribucionFormSchema', () => {
    describe('datos completos válidos', () => {
      it('acepta datos completos válidos', () => {
        const result = contribucionFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.exaltadoId).toBe(validData.exaltadoId);
          expect(result.data.contribuidorEmail).toBe(validData.contribuidorEmail);
        }
      });
    });

    describe('campos requeridos', () => {
      const requiredFields = [
        'exaltadoId',
        'exaltadoNombre',
        'contribuidorNombre',
        'contribuidorEmail',
        'relacionConExaltado',
        'tipoContribucion',
        'informacion',
        'fuenteInformacion',
      ] as const;

      requiredFields.forEach((field) => {
        it(`rechaza cuando falta ${field}`, () => {
          const data = { ...validData };
          delete (data as Record<string, unknown>)[field];
          const result = contribucionFormSchema.safeParse(data);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('honeypot validation', () => {
      it('rechaza honeypot con texto', () => {
        const data = { ...validData, honeypot: 'spam-bot-text' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('acepta honeypot vacío', () => {
        const data = { ...validData, honeypot: '' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta sin campo honeypot (opcional)', () => {
        const result = contribucionFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('email validation', () => {
      it('rechaza formato de email inválido', () => {
        const data = { ...validData, contribuidorEmail: 'email-invalido' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          const emailIssue = result.error.issues.find(
            (i) => i.path.includes('contribuidorEmail')
          );
          expect(emailIssue?.message).toBe('Formato de email inválido');
        }
      });

      it('rechaza email vacío', () => {
        const data = { ...validData, contribuidorEmail: '' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('teléfono validation', () => {
      it('rechaza formato de teléfono inválido', () => {
        const telefonosInvalidos = [
          '123',
          '12345',
          'abc-def-ghij',
          '787-12-34567',
        ];

        telefonosInvalidos.forEach((telefono) => {
          const data = { ...validData, contribuidorTelefono: telefono };
          const result = contribucionFormSchema.safeParse(data);
          expect(result.success).toBe(false);
          if (!result.success) {
            const phoneIssue = result.error.issues.find(
              (i) => i.path.includes('contribuidorTelefono')
            );
            expect(phoneIssue?.message).toContain('Formato de teléfono inválido');
          }
        });
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
          const data = { ...validData, contribuidorTelefono: telefono };
          const result = contribucionFormSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('acepta teléfono vacío (campo opcional)', () => {
        const data = { ...validData, contribuidorTelefono: '' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta omitir teléfono', () => {
        const { contribuidorTelefono: _, ...sinTelefono } = validData;
        const result = contribucionFormSchema.safeParse(sinTelefono);
        expect(result.success).toBe(true);
      });
    });

    describe('informacion validation', () => {
      it('rechaza información menor a 10 caracteres', () => {
        const data = { ...validData, informacion: 'Corto' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          const issue = result.error.issues.find(
            (i) => i.path.includes('informacion')
          );
          expect(issue?.message).toBe('La información debe tener al menos 10 caracteres');
        }
      });

      it('acepta información con exactamente 10 caracteres', () => {
        const data = { ...validData, informacion: 'a'.repeat(10) };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('rechaza información mayor a 2000 caracteres', () => {
        const data = { ...validData, informacion: 'a'.repeat(2001) };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          const issue = result.error.issues.find(
            (i) => i.path.includes('informacion')
          );
          expect(issue?.message).toBe('La información no puede exceder 2000 caracteres');
        }
      });

      it('acepta información con exactamente 2000 caracteres', () => {
        const data = { ...validData, informacion: 'a'.repeat(2000) };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('estadisticasEspecificas validation', () => {
      it('acepta array válido de estadísticas', () => {
        const data = {
          ...validData,
          estadisticasEspecificas: [
            { categoria: 'Bateo', dato: 'Promedio', valor: '.350' },
          ],
        };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('rechaza más de 20 estadísticas', () => {
        const estadisticas = Array.from({ length: 21 }, (_, i) => ({
          categoria: `Cat ${i}`,
          dato: `Dato ${i}`,
          valor: `${i}`,
        }));
        const data = { ...validData, estadisticasEspecificas: estadisticas };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('acepta exactamente 20 estadísticas', () => {
        const estadisticas = Array.from({ length: 20 }, (_, i) => ({
          categoria: `Cat ${i}`,
          dato: `Dato ${i}`,
          valor: `${i}`,
        }));
        const data = { ...validData, estadisticasEspecificas: estadisticas };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta omitir estadísticas (opcional)', () => {
        const result = contribucionFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('datosPersonales validation', () => {
      it('acepta datosPersonales con todos los campos', () => {
        const data = {
          ...validData,
          datosPersonales: {
            fechaNacimiento: '15 de marzo de 1950',
            lugarNacimiento: 'Humacao, Puerto Rico',
            estatura: '5\'11"',
            peso: '180 lbs',
            fechaFallecimiento: '2020',
            escuelas: 'Escuela Superior de Humacao',
            inicioDeporte: 'Comenzó a jugar béisbol a los 8 años',
          },
        };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta datosPersonales parciales (todos los campos opcionales)', () => {
        const data = {
          ...validData,
          datosPersonales: {
            lugarNacimiento: 'Humacao, Puerto Rico',
          },
        };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta datosPersonales vacío', () => {
        const data = {
          ...validData,
          datosPersonales: {},
        };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('acepta omitir datosPersonales (opcional)', () => {
        const result = contribucionFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('tipoContribucion enum validation', () => {
      const tiposValidos = [
        'estadisticas',
        'datos-personales',
        'trayectoria',
        'reconocimientos',
        'conexiones',
        'correccion',
        'otro',
      ] as const;

      tiposValidos.forEach((tipo) => {
        it(`acepta tipoContribucion: ${tipo}`, () => {
          const data = { ...validData, tipoContribucion: tipo };
          const result = contribucionFormSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('rechaza valor inválido de tipoContribucion', () => {
        const data = { ...validData, tipoContribucion: 'tipo-invalido' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('relacionConExaltado enum validation', () => {
      const relacionesValidas = [
        'familiar',
        'companero-equipo',
        'entrenador',
        'periodista',
        'aficionado',
        'historiador',
        'otro',
      ] as const;

      relacionesValidas.forEach((relacion) => {
        it(`acepta relacionConExaltado: ${relacion}`, () => {
          const data = { ...validData, relacionConExaltado: relacion };
          const result = contribucionFormSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('rechaza valor inválido de relacionConExaltado', () => {
        const data = { ...validData, relacionConExaltado: 'relacion-invalida' };
        const result = contribucionFormSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('validateContribucion helper', () => {
    it('valida datos correctos', () => {
      const result = validateContribucion(validData);
      expect(result.success).toBe(true);
    });

    it('rechaza datos incorrectos', () => {
      const result = validateContribucion({ exaltadoId: '' });
      expect(result.success).toBe(false);
    });

    it('maneja datos null o undefined', () => {
      expect(validateContribucion(null).success).toBe(false);
      expect(validateContribucion(undefined).success).toBe(false);
    });
  });
});
