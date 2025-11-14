import type { Exaltado } from '@/lib/types';

/**
 * Factory de datos de prueba con nombres y contexto dominicano
 */

/**
 * Datos de exaltados de prueba
 */
export const mockExaltados: Exaltado[] = [
  {
    id: 1,
    nombre: 'Felipe Alou',
    apellido: 'Rojas',
    nombreCompleto: 'Felipe Alou Rojas',
    deporte: 'Béisbol',
    categoria: 'Atleta',
    decada: '1960s',
    anioExaltacion: 1976,
    biografia: 'Primer dominicano en jugar All-Star en MLB',
    logros: ['3 veces All-Star', 'Manager del año 1994'],
    imagenUrl: '/images/exaltados/felipe-alou.jpg',
    estado: 'vivo',
    fechaNacimiento: '1935-05-08',
    lugarNacimiento: 'Haina, San Cristóbal',
  },
  {
    id: 2,
    nombre: 'Juan',
    apellido: 'Marichal',
    nombreCompleto: 'Juan Marichal Sánchez',
    deporte: 'Béisbol',
    categoria: 'Atleta',
    decada: '1960s',
    anioExaltacion: 1983,
    biografia: 'Miembro del Salón de la Fama de Cooperstown',
    logros: ['10 veces All-Star', 'Salón de la Fama MLB'],
    imagenUrl: '/images/exaltados/juan-marichal.jpg',
    estado: 'vivo',
    fechaNacimiento: '1937-10-20',
    lugarNacimiento: 'Laguna Verde, Monte Cristi',
  },
  {
    id: 3,
    nombre: 'Félix',
    apellido: 'Sánchez',
    nombreCompleto: 'Félix Sánchez',
    deporte: 'Atletismo',
    categoria: 'Atleta',
    decada: '2000s',
    anioExaltacion: 2012,
    biografia: 'Bicampeón olímpico de 400 metros con vallas',
    logros: ['Oro Olímpico 2004', 'Oro Olímpico 2012'],
    imagenUrl: '/images/exaltados/felix-sanchez.jpg',
    estado: 'vivo',
    fechaNacimiento: '1977-08-30',
    lugarNacimiento: 'Nueva York, Estados Unidos',
  },
  {
    id: 4,
    nombre: 'Pedro',
    apellido: 'Martínez',
    nombreCompleto: 'Pedro Jaime Martínez',
    deporte: 'Béisbol',
    categoria: 'Atleta',
    decada: '1990s',
    anioExaltacion: 2015,
    biografia: 'Uno de los mejores lanzadores de todos los tiempos',
    logros: ['3 veces Cy Young', 'Salón de la Fama MLB 2015'],
    imagenUrl: '/images/exaltados/pedro-martinez.jpg',
    estado: 'vivo',
    fechaNacimiento: '1971-10-25',
    lugarNacimiento: 'Manoguayabo, Santo Domingo',
  },
  {
    id: 5,
    nombre: 'Luguelín',
    apellido: 'Santos',
    nombreCompleto: 'Luguelín Santos',
    deporte: 'Atletismo',
    categoria: 'Atleta',
    decada: '2010s',
    anioExaltacion: 2016,
    biografia: 'Medallista olímpico en 400 metros',
    logros: ['Plata Olímpica 2012', 'Campeón Centroamericano'],
    imagenUrl: '/images/exaltados/luguelin-santos.jpg',
    estado: 'vivo',
    fechaNacimiento: '1993-11-12',
    lugarNacimiento: 'Santo Domingo',
  },
];

/**
 * Datos de eventos de prueba
 */
export const mockEventos = [
  {
    id: 'evento-1',
    summary: 'Torneo Nacional de Baloncesto',
    description: 'Torneo organizado por el Pabellón de la Fama del Deporte Dominicano',
    location: 'Pabellón de la Fama, Santo Domingo',
    start: {
      dateTime: '2025-12-01T10:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    end: {
      dateTime: '2025-12-01T18:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    sport: 'Baloncesto',
    organizer: {
      displayName: 'Pabellón de la Fama',
    },
  },
  {
    id: 'evento-2',
    summary: 'Ceremonia de Exaltación 2025',
    description: 'Ceremonia anual de exaltación de nuevos miembros',
    location: 'Centro de Convenciones, Santo Domingo',
    start: {
      dateTime: '2025-11-20T19:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    end: {
      dateTime: '2025-11-20T22:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    sport: 'General',
    organizer: {
      displayName: 'Pabellón de la Fama',
    },
  },
  {
    id: 'evento-3',
    summary: 'Torneo de Voleibol Juvenil',
    description: 'Torneo juvenil categoría sub-18',
    location: 'Centro Olímpico Juan Pablo Duarte',
    start: {
      dateTime: '2025-12-15T09:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    end: {
      dateTime: '2025-12-15T17:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    sport: 'Voleibol',
    organizer: {
      displayName: 'Federación Dominicana de Voleibol',
    },
  },
];

/**
 * Datos de formulario de registro válidos
 */
export const mockRegistroFormData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan.perez@example.com',
  telefono: '809-555-1234',
  deporte: 'Baloncesto',
  mensaje: 'Me gustaría recibir más información sobre el programa de exaltación.',
};

/**
 * Datos de formulario de registro inválidos (para pruebas de validación)
 */
export const mockInvalidRegistroFormData = {
  nombre: '', // Vacío - inválido
  apellido: 'P', // Muy corto - inválido
  email: 'invalid-email', // Email inválido
  telefono: '123', // Teléfono inválido
  deporte: '',
  mensaje: '',
};

/**
 * Respuesta de email exitosa (Resend)
 */
export const mockEmailResponse = {
  id: 'email-123456',
  from: 'noreply@pabellonfama.do',
  to: 'contacto@pabellonfama.do',
  created_at: '2025-11-14T10:00:00Z',
};

/**
 * Opciones de deportes para filtros
 */
export const mockDeportesOptions = [
  'Béisbol',
  'Baloncesto',
  'Voleibol',
  'Atletismo',
  'Boxeo',
  'Softbol',
  'Fútbol',
  'Natación',
];

/**
 * Opciones de décadas para filtros
 */
export const mockDecadasOptions = [
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  '2010s',
  '2020s',
];

/**
 * Opciones de categorías para filtros
 */
export const mockCategoriasOptions = [
  'Atleta',
  'Entrenador',
  'Dirigente',
  'Periodista',
  'Contribuidor',
];

/**
 * Opciones de estado para filtros
 */
export const mockEstadoOptions = ['vivo', 'fallecido'];

/**
 * Factory function para crear un exaltado personalizado
 */
export function createMockExaltado(overrides?: Partial<Exaltado>): Exaltado {
  return {
    id: Math.floor(Math.random() * 10000),
    nombre: 'Juan',
    apellido: 'Pérez',
    nombreCompleto: 'Juan Pérez',
    deporte: 'Béisbol',
    categoria: 'Atleta',
    decada: '2000s',
    anioExaltacion: 2020,
    biografia: 'Biografía de prueba',
    logros: ['Logro 1', 'Logro 2'],
    imagenUrl: '/images/placeholder.jpg',
    estado: 'vivo',
    fechaNacimiento: '1980-01-01',
    lugarNacimiento: 'Santo Domingo',
    ...overrides,
  };
}

/**
 * Factory function para crear un evento personalizado
 */
export function createMockEvento(overrides?: any) {
  return {
    id: `evento-${Math.floor(Math.random() * 10000)}`,
    summary: 'Evento de Prueba',
    description: 'Descripción del evento de prueba',
    location: 'Santo Domingo',
    start: {
      dateTime: '2025-12-01T10:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    end: {
      dateTime: '2025-12-01T12:00:00-04:00',
      timeZone: 'America/Santo_Domingo',
    },
    sport: 'General',
    ...overrides,
  };
}

/**
 * Factory function para crear datos de registro personalizados
 */
export function createMockRegistroData(overrides?: any) {
  return {
    nombre: 'Carlos',
    apellido: 'González',
    email: 'carlos.gonzalez@example.com',
    telefono: '809-555-9876',
    deporte: 'Voleibol',
    mensaje: 'Mensaje de prueba',
    ...overrides,
  };
}
