import type { Exaltado } from '@/lib/types'

/**
 * Mock data factory for PFDH tests
 * All data uses Spanish names and formatting
 */

// Use Partial since we don't need all fields for tests
export const mockExaltados: Partial<Exaltado>[] = [
  {
    id: '1',
    nombre: 'Roberto',
    apellidos: 'Clemente',
    nombreCompleto: 'Roberto Clemente',
    deporte: ['Béisbol'],
    categoria: 'jugador',
    anoExaltacion: 1973,
    foto: '/images/exaltados/roberto-clemente.jpg',
    biografia: 'Legendario jugador de béisbol puertorriqueño, primer latino en el Salón de la Fama del Béisbol.',
    logros: [
      'MVP de la Serie Mundial 1971',
      '12 Guantes de Oro',
      '3,000 hits en su carrera',
    ],
    reconocimientos: [
      'Premio Roberto Clemente de la MLB',
      'Número 21 retirado por los Piratas de Pittsburgh',
    ],
    estado: 'fallecido',
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellidos: 'Arroyo',
    nombreCompleto: 'Carlos Arroyo',
    deporte: ['Baloncesto'],
    categoria: 'jugador',
    anoExaltacion: 2015,
    foto: '/images/exaltados/carlos-arroyo.jpg',
    biografia: 'Destacado base puertorriqueño que jugó en la NBA y llevó a Puerto Rico a victorias olímpicas.',
    logros: [
      'Subcampeón NBA con Detroit Pistons',
      'MVP del Torneo Centrobasket 2008',
    ],
    reconocimientos: [
      'Miembro del equipo olímpico de Puerto Rico',
    ],
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Mónica',
    apellidos: 'Puig',
    nombreCompleto: 'Mónica Puig',
    deporte: ['Tenis'],
    categoria: 'atleta',
    anoExaltacion: 2020,
    foto: '/images/exaltados/monica-puig.jpg',
    biografia: 'Primera medallista de oro olímpica para Puerto Rico en Río 2016.',
    logros: [
      'Medalla de oro olímpica Río 2016',
      'Campeona WTA Estrasburgo 2014',
    ],
    reconocimientos: [
      'Orden al Mérito Deportivo de Puerto Rico',
    ],
    estado: 'activo',
  },
  {
    id: '4',
    nombre: 'Juan',
    apellidos: 'Vicéns',
    nombreCompleto: 'Juan "Pachín" Vicéns',
    apodo: 'Pachín',
    deporte: ['Baloncesto'],
    categoria: 'jugador',
    anoExaltacion: 1980,
    foto: '/images/exaltados/pachin-vicens.jpg',
    biografia: 'Pionero del baloncesto puertorriqueño y figura icónica del deporte en la isla.',
    logros: [
      'Campeón nacional BSN múltiples veces',
      'Anotador histórico del BSN',
    ],
    estado: 'fallecido',
  },
  {
    id: '5',
    nombre: 'Félix',
    apellidos: 'Trinidad',
    nombreCompleto: 'Félix "Tito" Trinidad',
    apodo: 'Tito',
    deporte: ['Boxeo'],
    categoria: 'boxeador',
    anoExaltacion: 2014,
    foto: '/images/exaltados/tito-trinidad.jpg',
    biografia: 'Campeón mundial de boxeo en tres divisiones y orgullo puertorriqueño.',
    logros: [
      'Campeón mundial welter',
      'Campeón mundial superligero',
      'Campeón mundial mediano',
    ],
    reconocimientos: [
      'Salón de la Fama del Boxeo Internacional',
    ],
    estado: 'activo',
  },
]

export const mockEventos = [
  {
    id: 'evt-1',
    titulo: 'Ceremonia de Inducción 2025',
    descripcion: 'Ceremonia anual de exaltación de nuevos miembros al Pabellón de la Fama.',
    fecha: '2025-06-15T19:00:00-04:00',
    fechaFin: '2025-06-15T22:00:00-04:00',
    ubicacion: 'Centro de Bellas Artes de Humacao',
    tipo: 'ceremonia-exaltacion',
    imagen: '/images/eventos/ceremonia-2025.jpg',
  },
  {
    id: 'evt-2',
    titulo: 'Torneo de Béisbol Juvenil Roberto Clemente',
    descripcion: 'Torneo anual de béisbol para jóvenes de 12-15 años.',
    fecha: '2025-07-20T09:00:00-04:00',
    fechaFin: '2025-07-22T18:00:00-04:00',
    ubicacion: 'Estadio Yldefonso Sola Morales',
    tipo: 'competencia',
  },
  {
    id: 'evt-3',
    titulo: 'Exposición: 50 Años de Historia Deportiva',
    descripcion: 'Exhibición especial conmemorando medio siglo de excelencia deportiva en Humacao.',
    fecha: '2025-08-01T10:00:00-04:00',
    fechaFin: '2025-08-31T17:00:00-04:00',
    ubicacion: 'Museo del Pabellón de la Fama',
    tipo: 'tour-museo',
  },
  {
    id: 'evt-4',
    titulo: 'Clínica de Baloncesto con Carlos Arroyo',
    descripcion: 'Clínica deportiva gratuita para jóvenes aspirantes a basquetbolistas.',
    fecha: '2025-09-10T14:00:00-04:00',
    fechaFin: '2025-09-10T17:00:00-04:00',
    ubicacion: 'Coliseo Heriberto "Guty" Marín',
    tipo: 'actividad-educativa',
  },
]

export const mockRegistroData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan.perez@example.com',
  telefono: '787-555-1234',
  deporte: 'Béisbol',
  mensaje: 'Me gustaría obtener más información sobre el proceso de nominación.',
}

export const mockSearchQuery = 'Roberto'
export const mockFilterDeporte = 'Béisbol'
export const mockFilterAño = 2015

/**
 * Factory function to create a mock Exaltado
 */
export function createMockExaltado(overrides?: Partial<Exaltado>): Partial<Exaltado> {
  return {
    id: '999',
    nombre: 'Test',
    apellidos: 'Atleta',
    nombreCompleto: 'Test Atleta',
    deporte: ['Atletismo'],
    categoria: 'atleta',
    anoExaltacion: 2023,
    foto: '/images/test.jpg',
    biografia: 'Biografía de prueba',
    estado: 'activo',
    ...overrides,
  }
}

/**
 * Factory function to create a mock event
 */
export function createMockEvento(overrides?: any) {
  return {
    id: 'test-evt',
    titulo: 'Evento de Prueba',
    descripcion: 'Descripción del evento de prueba',
    fecha: '2025-12-31T19:00:00-04:00',
    ubicacion: 'Ubicación de Prueba',
    tipo: 'evento-especial',
    ...overrides,
  }
}
