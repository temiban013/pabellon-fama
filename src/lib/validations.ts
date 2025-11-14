// lib/validations.ts
import { z } from "zod";

// Schema para validación del formulario de registro
export const registroSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido")
    .max(255, "Email demasiado largo"),

  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios permitidos")
    .optional()
    .or(z.literal("")),

  telefono: z
    .string()
    .regex(
      /^(\+?1-?)?(\([0-9]{3}\)|[0-9]{3})-?[0-9]{3}-?[0-9]{4}$/,
      "Formato de teléfono inválido (ej: 787-123-4567)"
    )
    .optional()
    .or(z.literal("")),

  interes: z.enum(["visitante", "voluntario", "investigador", "general"], {
    message: "Selecciona un tipo de interés válido",
  }),

  mensaje: z
    .string()
    .max(500, "El mensaje no puede exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

// Schema para el API (más estricto)
export const registroApiSchema = z.object({
  email: registroSchema.shape.email,
  nombre: z.preprocess(
    (val) => val ?? "",
    z.string().min(1, "El nombre es requerido para el registro").min(2, "El nombre debe tener al menos 2 caracteres")
  ),
  telefono: registroSchema.shape.telefono,
  interes: registroSchema.shape.interes,
  mensaje: registroSchema.shape.mensaje,
});

// Tipo inferido del schema
export type RegistroFormInput = z.infer<typeof registroSchema>;
export type RegistroApiInput = z.infer<typeof registroApiSchema>;

// Función helper para validar datos
export const validateRegistro = (data: unknown) => {
  return registroSchema.safeParse(data);
};

// Función helper para validar API input
export const validateRegistroApi = (data: unknown) => {
  return registroApiSchema.safeParse(data);
};

// Schema para respuesta de email
export const emailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      id: z.string(),
      email: z.string().email(),
      fechaRegistro: z.string().datetime(),
    })
    .optional(),
});
