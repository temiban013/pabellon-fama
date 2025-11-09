/**
 * Mock API response data for MSW handlers
 */

export const mockEventosResponse = {
  eventos: [
    {
      id: 'evt-1',
      titulo: 'Ceremonia de Inducción 2025',
      descripcion: 'Ceremonia anual de exaltación de nuevos miembros al Pabellón de la Fama.',
      fecha: '2025-06-15T19:00:00-04:00',
      fechaFin: '2025-06-15T22:00:00-04:00',
      ubicacion: 'Centro de Bellas Artes de Humacao',
      tipo: 'ceremonia',
      imagen: '/images/eventos/ceremonia-2025.jpg',
    },
    {
      id: 'evt-2',
      titulo: 'Torneo de Béisbol Juvenil',
      descripcion: 'Torneo anual de béisbol para jóvenes.',
      fecha: '2025-07-20T09:00:00-04:00',
      fechaFin: '2025-07-22T18:00:00-04:00',
      ubicacion: 'Estadio Municipal',
      tipo: 'torneo',
    },
    {
      id: 'evt-3',
      titulo: 'Exposición Histórica',
      descripcion: 'Exhibición especial de la historia deportiva.',
      fecha: '2025-08-01T10:00:00-04:00',
      fechaFin: '2025-08-31T17:00:00-04:00',
      ubicacion: 'Museo del Pabellón',
      tipo: 'exposicion',
    },
  ],
  total: 3,
  nextPageToken: null,
}

export const mockRegistroSuccess = {
  success: true,
  message: 'Registro recibido exitosamente',
  registroId: 'reg-12345',
}

export const mockRegistroError = {
  error: 'Error al procesar el registro',
  details: 'Todos los campos son requeridos',
}
