// src/app/calendario/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date string to prevent hydration issues
  hora: string;
  ubicacion: string;
  tipo: "ceremonia" | "museo" | "educativo" | "especial" | "reunion";
  destacado?: boolean;
  capacidad?: number;
  requiereReservacion?: boolean;
}

const eventosEjemplo: Evento[] = [
  {
    id: "1",
    titulo: "Inauguración Museo Manuel Rivera Guevara",
    descripcion:
      "Ceremonia oficial de inauguración del museo físico en el Centro Cultural Dra. Antonia Sáez.",
    fecha: "2025-06-29", // 29 de junio de 2025
    hora: "10:00 AM",
    ubicacion: "Centro Cultural Dra. Antonia Sáez",
    tipo: "especial",
    destacado: true,
    capacidad: 200,
    requiereReservacion: true,
  },
  {
    id: "2",
    titulo: "Visita Guiada Especial",
    descripcion:
      "Tour especial por las nuevas exhibiciones del museo con material exclusivo.",
    fecha: "2025-07-15", // 15 de julio de 2025
    hora: "2:00 PM",
    ubicacion: "Museo PFDH",
    tipo: "museo",
    capacidad: 25,
    requiereReservacion: true,
  },
  {
    id: "3",
    titulo: "Reunión Mensual Junta Directiva",
    descripcion: "Reunión ordinaria de la Junta de Directores del PFDH.",
    fecha: "2025-08-10", // 10 de agosto de 2025
    hora: "6:00 PM",
    ubicacion: "Centro Cultural",
    tipo: "reunion",
  },
  {
    id: "4",
    titulo: "Taller Educativo: Historia del Deporte",
    descripcion:
      "Taller interactivo sobre la historia deportiva de Humacao para estudiantes.",
    fecha: "2025-08-22", // 22 de agosto de 2025
    hora: "9:00 AM",
    ubicacion: "Museo PFDH",
    tipo: "educativo",
    capacidad: 30,
    requiereReservacion: true,
  },
  {
    id: "5",
    titulo: "IX Ceremonia de Exaltación",
    descripcion:
      "Novena ceremonia de exaltación al Pabellón de la Fama del Deporte Humacaeño.",
    fecha: "2025-11-15", // 15 de noviembre de 2025
    hora: "7:00 PM",
    ubicacion: "Teatro UPR Humacao",
    tipo: "ceremonia",
    destacado: true,
    capacidad: 500,
    requiereReservacion: true,
  },
];

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

const EventoCard = ({ evento }: { evento: Evento }) => {
  const IconoEvento = getIconoEvento(evento.tipo);
  const fechaEvento = new Date(evento.fecha);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${getColorEvento(
        evento.tipo
      )} p-6 hover:shadow-md transition-all duration-300 ${
        evento.destacado ? "ring-2 ring-orange-200" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="p-2 rounded-lg bg-white shadow-sm mr-3">
            <IconoEvento className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {evento.titulo}
              {evento.destacado && (
                <Star className="inline h-4 w-4 ml-2 text-orange-500 fill-current" />
              )}
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
                - {evento.hora}
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
          {evento.capacidad && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Capacidad: {evento.capacidad}
            </div>
          )}
          {evento.requiereReservacion && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              Requiere reservación
            </span>
          )}
        </div>

        {evento.requiereReservacion && (
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

  const eventosFiltrados =
    filtroTipo === "todos"
      ? eventosEjemplo
      : eventosEjemplo.filter((evento) => evento.tipo === filtroTipo);

  const eventosOrdenados = eventosFiltrados.sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
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

        {/* Evento Destacado */}
        {eventosOrdenados.find((e) => e.id === "5") && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🌟 Próximo Evento Destacado
            </h2>
            <EventoCard evento={eventosOrdenados.find((e) => e.id === "5")!} />
          </div>
        )}

        {/* Lista de Eventos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Todos los Eventos
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
                  ? "No hay eventos programados actualmente."
                  : `No hay eventos de tipo "${
                      tiposEvento.find((t) => t.valor === filtroTipo)?.label
                    }" programados.`}
              </p>
            </div>
          )}
        </div>

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
