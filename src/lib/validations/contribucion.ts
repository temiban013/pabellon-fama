import { z } from "zod";

export const estadisticaContribuidaSchema = z.object({
  categoria: z.string().min(1).max(100),
  dato: z.string().min(1).max(200),
  valor: z.string().min(1).max(100),
  temporadaOAno: z.string().max(50).optional(),
  equipo: z.string().max(150).optional(),
});

export const datosPersonalesContribuidosSchema = z.object({
  fechaNacimiento: z.string().max(100).optional(),
  lugarNacimiento: z.string().max(200).optional(),
  estatura: z.string().max(20).optional(),
  peso: z.string().max(20).optional(),
  fechaFallecimiento: z.string().max(100).optional(),
  escuelas: z.string().max(500).optional(),
  inicioDeporte: z.string().max(1000).optional(),
});

export const contribucionFormSchema = z.object({
  // Exaltado reference
  exaltadoId: z.string().min(1, "Debe seleccionar un exaltado"),
  exaltadoNombre: z.string().min(1).max(200),

  // Contributor info
  contribuidorNombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre demasiado largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/, "Solo letras y espacios permitidos"),
  contribuidorEmail: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido")
    .max(255),
  contribuidorTelefono: z
    .string()
    .regex(
      /^(\+?1-?)?(\([0-9]{3}\)|[0-9]{3})-?[0-9]{3}-?[0-9]{4}$/,
      "Formato de teléfono inválido (ej: 787-123-4567)"
    )
    .optional()
    .or(z.literal("")),
  relacionConExaltado: z.enum([
    "familiar",
    "companero-equipo",
    "entrenador",
    "periodista",
    "aficionado",
    "historiador",
    "otro",
  ]),
  relacionDetalle: z.string().max(300).optional(),

  // Contribution content
  tipoContribucion: z.enum([
    "estadisticas",
    "datos-personales",
    "trayectoria",
    "reconocimientos",
    "conexiones",
    "correccion",
    "otro",
  ]),
  informacion: z
    .string()
    .min(10, "La información debe tener al menos 10 caracteres")
    .max(2000, "La información no puede exceder 2000 caracteres"),

  // Structured optional fields
  estadisticasEspecificas: z.array(estadisticaContribuidaSchema).max(20).optional(),
  datosPersonales: datosPersonalesContribuidosSchema.optional(),

  // Source and verification
  fuenteInformacion: z
    .string()
    .min(5, "Indique la fuente de la información")
    .max(500),
  documentosSoporte: z.string().max(500).optional(),

  // Anti-spam honeypot — must be empty
  honeypot: z.literal("").optional(),
});

export type ContribucionFormInput = z.infer<typeof contribucionFormSchema>;

export const validateContribucion = (data: unknown) => {
  return contribucionFormSchema.safeParse(data);
};
