// src/app/calendario/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Filter,
  Star,
  Trophy,
  BookOpen,
  Loader2,
} from "lucide-react";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date string to prevent hydration issues
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  tipo: "ceremonia" | "museo" | "educativo" | "especial" | "reunion";
  requiresRegistro?: boolean;
  capacidadMaxima?: number;
}

// API Response type from /api/eventos
interface EventoAPI {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  tipo: "ceremonia" | "museo" | "educativo" | "especial" | "reunion";
  requiresRegistro?: boolean;
  capacidadMaxima?: number;
}

const tiposEvento = [
  { valor: "todos", label: "Todos los eventos", color: "gray" },
  { valor: "ceremonia", label: "Ceremonias", color: "blue" },
  { valor: "museo", label: "Museo", color: "green" },
  { valor: "educativo", label: "Educativo", color: "purple" },
  { valor: "especial", label: "Especial", color: "orange" },
  { valor: "reunion", label: "Reuniones", color: "gray" },
];

const getColorEvento = (tipo: string) => {
  const colores = {
    ceremonia: "border-blue-500 bg-blue-50",
    museo: "border-green-500 bg-green-50",
    educativo: "border-purple-500 bg-purple-50",
    especial: "border-orange-500 bg-orange-50",
    reunion: "border-gray-500 bg-gray-50",
  };
  return colores[tipo as keyof typeof colores] || colores.reunion;
};

const getIconoEvento = (tipo: string) => {
  switch (tipo) {
    case "ceremonia":
      return Trophy;
    case "museo":
      return CalendarIcon;
    case "educativo":
      return BookOpen;
    case "especial":
      return Star;
    case "reunion":
      return Users;
    default:
      return CalendarIcon;
  }
};

// Parse date string in local timezone to prevent timezone shift issues
const parseDateLocal = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

const EventoCard = ({ evento }: { evento: Evento }) => {
  const IconoEvento = getIconoEvento(evento.tipo);
  const fechaEvento = parseDateLocal(evento.fecha);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${getColorEvento(
        evento.tipo
      )} p-6 hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="p-2 rounded-lg bg-white shadow-sm mr-3">
            <IconoEvento className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {evento.titulo}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {fechaEvento.toLocaleDateString("es-PR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                - {evento.horaInicio}
                {evento.horaFin && ` - ${evento.horaFin}`}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {evento.ubicacion}
              </div>
            </div>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            evento.tipo === "ceremonia"
              ? "bg-blue-100 text-blue-800"
              : evento.tipo === "museo"
              ? "bg-green-100 text-green-800"
              : evento.tipo === "educativo"
              ? "bg-purple-100 text-purple-800"
              : evento.tipo === "especial"
              ? "bg-orange-100 text-orange-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {evento.tipo}
        </span>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{evento.descripcion}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {evento.capacidadMaxima && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Capacidad: {evento.capacidadMaxima}
            </div>
          )}
          {evento.requiresRegistro && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              Requiere reservación
            </span>
          )}
        </div>

        {evento.requiresRegistro && (
          <a
            href="tel:787-410-1237"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reservar
          </a>
        )}
      </div>
    </div>
  );
};

export default function CalendarioPage() {
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from Google Calendar API
  useEffect(() => {
    async function fetchEventos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/eventos?mode=upcoming&maxResults=50');

        if (!response.ok) {
          throw new Error('Error al cargar eventos');
        }

        const data = await response.json();

        if (data.success && data.data) {
          // Transform API response to component format
          const eventosTransformados: Evento[] = (data.data as EventoAPI[]).map((evento) => ({
            id: evento.id,
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            fecha: new Date(evento.fecha).toISOString().split('T')[0], // Convert to YYYY-MM-DD
            horaInicio: evento.horaInicio,
            horaFin: evento.horaFin,
            ubicacion: evento.ubicacion,
            tipo: evento.tipo,
            requiresRegistro: evento.requiresRegistro,
            capacidadMaxima: evento.capacidadMaxima,
          }));

          setEventos(eventosTransformados);
        } else {
          setEventos([]);
        }
      } catch (err) {
        console.error('Error fetching eventos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setEventos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEventos();
  }, []);

  const eventosFiltrados =
    filtroTipo === "todos"
      ? eventos
      : eventos.filter((evento) => evento.tipo === filtroTipo);

  const eventosOrdenados = eventosFiltrados.sort(
    (a, b) => parseDateLocal(a.fecha).getTime() - parseDateLocal(b.fecha).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Link>

          <div className="flex items-center mb-4">
            <CalendarIcon className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Calendario de Actividades</h1>
          </div>

          <p className="text-xl text-blue-100 max-w-3xl">
            Mantente al día con todas las actividades, eventos y ceremonias del
            Pabellón de la Fama del Deporte Humacaeño.
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {tiposEvento.map((tipo) => (
                  <option key={tipo.valor} value={tipo.valor}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {eventosFiltrados.length} evento(s) encontrado(s)
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando eventos...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error al cargar eventos
            </h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Eventos Content */}
        {!loading && !error && (
          <>
            {/* Lista de Eventos */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {filtroTipo === "todos" ? "Todos los Eventos" : tiposEvento.find(t => t.valor === filtroTipo)?.label}
              </h2>

              {eventosOrdenados.length > 0 ? (
                <div className="space-y-6">
                  {eventosOrdenados.map((evento) => (
                    <EventoCard key={evento.id} evento={evento} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay eventos programados
                  </h3>
                  <p className="text-gray-600">
                    {filtroTipo === "todos"
                      ? "No hay eventos programados actualmente en el calendario de pabellonfdh@gmail.com."
                      : `No hay eventos de tipo "${
                          tiposEvento.find((t) => t.valor === filtroTipo)?.label
                        }" programados.`}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Los eventos se cargan desde Google Calendar en tiempo real.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Información de contacto */}
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿Interesado en nuestros eventos?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <CalendarIcon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reservaciones
                </h3>
                <p className="text-gray-600 mb-4">
                  Para eventos que requieren reservación
                </p>
                <a
                  href="tel:787-410-1237"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  787-410-1237
                </a>
                <p className="text-gray-600 mt-2 text-sm">
                  informa@pfdh.org
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Eventos Especiales
                </h3>
                <p className="text-gray-600 mb-2">
                  Solicita eventos privados o educativos
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Centro Cultural Antonia Sáez
                </p>
                <p className="text-gray-800 font-semibold">
                  Lunes a Viernes, 8:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
