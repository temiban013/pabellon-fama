// src/app/horario/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Phone,
  MapPin,
  Calendar,
  Users,
  Car,
  Bus,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Horario y Contacto | PFDH",
  description:
    "Horarios, ubicación y información de contacto del Museo y Pabellón de la Fama del Deporte Humacaeño",
  keywords:
    "horario, contacto, ubicación, museo, PFDH, humacao, visitas, centro cultural",
  openGraph: {
    title: "Horario y Contacto - Pabellón de la Fama del Deporte Humacaeño",
    description: "Planifica tu visita al Museo Manuel Rivera Guevara",
    url: "/horario",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
  },
};

const diasSemana = [
  { dia: "Lunes", horario: "8:00 AM - 4:00 PM", activo: true },
  { dia: "Martes", horario: "8:00 AM - 4:00 PM", activo: true },
  { dia: "Miércoles", horario: "8:00 AM - 4:00 PM", activo: true },
  { dia: "Jueves", horario: "8:00 AM - 4:00 PM", activo: true },
  { dia: "Viernes", horario: "8:00 AM - 4:00 PM", activo: true },
  { dia: "Sábado", horario: "Cerrado", activo: false },
  { dia: "Domingo", horario: "Cerrado", activo: false },
];

const informacionVisita = [
  {
    titulo: "Visitas Individuales",
    descripcion: "Entrada libre durante horario regular",
    icono: Users,
    detalles: [
      "No requiere reservación",
      "Recorrido autoguiado",
      "Duración promedio: 45-60 minutos",
    ],
  },
  {
    titulo: "Visitas Grupales",
    descripcion: "Grupos de 10 o más personas",
    icono: Users,
    detalles: [
      "Requiere reservación previa",
      "Descuentos especiales",
      "Tour guiado disponible",
    ],
  },
  {
    titulo: "Visitas Escolares",
    descripcion: "Programas educativos especiales",
    icono: Users,
    detalles: [
      "Material educativo incluido",
      "Actividades interactivas",
      "Coordinación con maestros",
    ],
  },
];

const ContactoCard = ({
  titulo,
  contenido,
  icono: IconComponent,
  color = "blue",
  accion,
}: {
  titulo: string;
  contenido: string | string[];
  icono: React.ComponentType<{ className?: string }>;
  color?: "blue" | "orange" | "green";
  accion?: { texto: string; href: string };
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${colorClasses[color]} mr-4`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
          {Array.isArray(contenido) ? (
            <ul className="space-y-1">
              {contenido.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 mb-3">{contenido}</p>
          )}

          {accion && (
            <a
              href={accion.href}
              className={`inline-flex items-center text-sm font-medium ${
                color === "blue"
                  ? "text-blue-600 hover:text-blue-800"
                  : color === "orange"
                  ? "text-orange-600 hover:text-orange-800"
                  : "text-green-600 hover:text-green-800"
              } transition-colors`}
            >
              {accion.texto}
              <ArrowLeft className="ml-1 h-4 w-4 transform rotate-180" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function HorarioContactoPage() {
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
            <Clock className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Horario y Contacto</h1>
          </div>

          <p className="text-xl text-blue-100 max-w-3xl">
            Planifica tu visita al Museo Manuel Rivera Guevara y conoce toda la
            información necesaria para contactar al Pabellón de la Fama del
            Deporte Humacaeño.
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Horarios de Operación */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Horarios de Operación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Museo Manuel Rivera Guevara
              </h3>

              <div className="space-y-3">
                {diasSemana.map((dia, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      dia.activo
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <span className="font-medium text-gray-900">{dia.dia}</span>
                    <div className="flex items-center">
                      {dia.activo ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span
                        className={`font-medium ${
                          dia.activo ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {dia.horario}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Nota Importante
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Para grupos de 10 o más personas, se recomienda hacer
                      reservación previa llamando al 787-410-1237 o escribiendo a informa@pfdh.org.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tipos de Visita
              </h3>

              <div className="space-y-4">
                {informacionVisita.map((info, index) => {
                  const IconComponent = info.icono;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                          <IconComponent className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {info.titulo}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {info.descripcion}
                          </p>
                        </div>
                      </div>

                      <ul className="text-sm text-gray-600 space-y-1 ml-11">
                        {info.detalles.map((detalle, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                            {detalle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <ContactoCard
            titulo="Reservaciones y Consultas"
            contenido={[
              "📞 787-410-1237",
              "✉️ informa@pfdh.org"
            ]}
            icono={Phone}
            color="blue"
            accion={{
              texto: "Llamar ahora",
              href: "tel:787-410-1237",
            }}
          />

          <ContactoCard
            titulo="Ubicación del Museo"
            contenido={[
              "Centro Cultural Dra. Antonia Sáez",
              "Humacao, Puerto Rico",
            ]}
            icono={MapPin}
            color="orange"
          />

          <ContactoCard
            titulo="Horario de Atención"
            contenido={["Lunes a Viernes", "8:00 AM - 4:00 PM"]}
            icono={Calendar}
            color="green"
          />
        </div>

        {/* Mapa y Direcciones */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ubicación y Direcciones
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cómo llegar
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      En automóvil
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      El Centro Cultural Dra. Antonia Sáez se encuentra en el
                      centro de Humacao. Disponible estacionamiento en las
                      cercanías.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <Bus className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Transporte público
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Accesible mediante las rutas de transporte público de
                      Humacao. Consulte las rutas actuales para planificar su
                      viaje.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Información adicional
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • Instalaciones accesibles para personas con discapacidad
                  </li>
                  <li>• Tours guiados disponibles con reservación</li>
                  <li>• Entrada gratuita para todos los visitantes</li>
                  <li>• Fotografía permitida en áreas designadas</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Mapa de ubicación
              </h3>

              {/* Placeholder para mapa - en una implementación real se usaría Google Maps embed */}
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    Centro Cultural Dra. Antonia Sáez
                  </p>
                  <p className="text-gray-500 text-sm">Humacao, Puerto Rico</p>
                  <p className="text-gray-500 text-xs mt-2">
                    (Mapa interactivo disponible próximamente)
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <a
                  href="https://maps.google.com/?q=Centro+Cultural+Antonia+Saez+Humacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver en Google Maps
                  <MapPin className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Llamada a la acción */}
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para visitar el museo?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Te esperamos para que conozcas la rica historia deportiva de Humacao
            y honres a nuestros atletas destacados. ¡Tu visita ayuda a preservar
            nuestro legado deportivo!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:787-410-1237"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="mr-2 h-4 w-4" />
              Hacer Reservación
            </a>

            <Link
              href="/directorio"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Users className="mr-2 h-4 w-4" />
              Ver Exaltados
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
