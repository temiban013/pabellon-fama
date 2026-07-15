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
  FileText,
  Paperclip,
} from "lucide-react";
import { type EventoSerializado } from "@/lib/types";
import { parseDateLocal } from "@/lib/date-utils";

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

// Renders the matching icon for an event type as JSX.
// Returning JSX here (instead of a component reference) avoids the
// react-hooks/static-components lint rule that flags dynamic component
// references created during render.
const renderIconoEvento = (tipo: string, className: string) => {
  switch (tipo) {
    case "ceremonia":
      return <Trophy className={className} />;
    case "museo":
      return <CalendarIcon className={className} />;
    case "educativo":
      return <BookOpen className={className} />;
    case "especial":
      return <Star className={className} />;
    case "reunion":
      return <Users className={className} />;
    default:
      return <CalendarIcon className={className} />;
  }
};

const EventoCard = ({ evento }: { evento: EventoSerializado }) => {
  const fechaEvento = parseDateLocal(evento.fecha);
  const [imagenError, setImagenError] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${getColorEvento(
        evento.tipo
      )} p-6 hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="p-2 rounded-lg bg-white shadow-sm mr-3">
            {renderIconoEvento(evento.tipo, "h-5 w-5 text-gray-600")}
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

      {evento.imagen && !imagenError && (
        <div className="mb-4">
          <a href={evento.imagen} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={evento.imagen.includes('googleusercontent.com')
                ? `/api/image-proxy?url=${encodeURIComponent(evento.imagen)}`
                : evento.imagen
              }
              alt={`Flyer: ${evento.titulo}`}
              loading="lazy"
              className="w-full max-h-96 object-contain rounded-lg"
              onError={() => setImagenError(true)}
            />
          </a>
        </div>
      )}

      {evento.imagen && imagenError && (
        <div className="mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-sm text-yellow-800">
            <p className="font-medium">No se pudo cargar el flyer</p>
            <p className="mt-1">
              Verifique que el archivo en Google Drive este compartido como
              &ldquo;Cualquier persona con el enlace&rdquo;
            </p>
          </div>
        </div>
      )}

      <p className="text-gray-700 mb-4 leading-relaxed">{evento.descripcion}</p>

      {evento.adjuntos && evento.adjuntos.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <Paperclip className="h-4 w-4 mr-1" />
            Archivos adjuntos
          </h4>
          <ul className="space-y-2">
            {evento.adjuntos.map((adjunto, idx) => (
              <li key={`${adjunto.fileId || adjunto.fileUrl}-${idx}`}>
                <a
                  href={adjunto.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm text-gray-800 transition-colors w-full"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{adjunto.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

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
  const [eventos, setEventos] = useState<EventoSerializado[]>([]);
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
          // API returns JSON — fecha is already a string after JSON serialization
          setEventos(data.data as EventoSerializado[]);
        } else {
          setEventos([]);
        }
      } catch (err) {
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

  const eventosOrdenados = [...eventosFiltrados].sort(
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
                <div className="space-y-1">
                  <a
                    href="tel:787-410-1237"
                    className="block text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    787-410-1237
                  </a>
                  <a
                    href="tel:939-529-5732"
                    className="block text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    939-529-5732
                  </a>
                </div>
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
                <p className="text-gray-600 text-sm mb-2">
                  Centro Cultural Antonia Sáez
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  P.O. Box 9078, Humacao, PR 00792
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
