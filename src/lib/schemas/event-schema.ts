import type { Event, WithContext } from 'schema-dts';

interface CeremonyEventInput {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address: string;
  };
  inductees?: string[];
}

export function generateCeremonySchema(event: CeremonyEventInput): WithContext<Event> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: event.location ? {
      '@type': 'Place',
      name: event.location.name,
      address: event.location.address
    } : undefined,
    organizer: {
      '@type': 'Organization',
      name: 'Pabellón de la Fama del Deporte Humacaeño',
      url: 'https://pabellon.org'
    },
    performer: event.inductees?.map(name => ({
      '@type': 'Person',
      name
    }))
  };
}
