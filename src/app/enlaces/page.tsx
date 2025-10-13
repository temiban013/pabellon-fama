// src/app/enlaces/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Youtube,
  Globe,
  FileText,
  Camera,
  Radio,
  Users,
  Award,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Enlaces y Recursos | PFDH",
  description:
    "Accede a la biblioteca, blog, YouTube y otros recursos del Pabellón de la Fama del Deporte Humacaeño",
  keywords:
    "enlaces, recursos, biblioteca, blog, youtube, PFDH, humacao, deportes",
  openGraph: {
    title: "Enlaces y Recursos - Pabellón de la Fama del Deporte Humacaeño",
    description: "Encuentra todos los recursos digitales y contenido del PFDH",
    url: "/enlaces",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
  },
};

interface RecursoEnlace {
  id: string;
  titulo: string;
  descripcion: string;
  url: string;
  tipo:
    | "blog"
    | "biblioteca"
    | "video"
    | "documento"
    | "radio"
    | "social"
    | "educativo";
  icono: React.ComponentType<{ className?: string }>;
  activo: boolean;
  destacado?: boolean;
  fechaActualizacion?: string;
  contenidoEspecial?: string;
}

const recursosEnlaces: RecursoEnlace[] = [
  {
    id: "blog-felix",
    titulo: "Blog Oficial del PFDH",
    descripcion:
      "El blog histórico administrado por Félix Báez Neris con biografías detalladas de los 78 exaltados, historia deportiva y documentación completa.",
    url: "https://pabellonfdh.blogspot.com",
    tipo: "blog",
    icono: FileText,
    activo: true,
    destacado: true,
    fechaActualizacion: "2024-12-15",
    contenidoEspecial:
      "78 biografías de exaltados, historia completa de 8 exaltaciones",
  },
  {
    id: "biblioteca-digital",
    titulo: "Biblioteca Digital Deportiva",
    descripcion:
      "Colección de documentos históricos, fotografías, recortes de prensa y material de archivo sobre el deporte humacaeño.",
    url: "#biblioteca-digital",
    tipo: "biblioteca",
    icono: BookOpen,
    activo: false,
    contenidoEspecial: "Próximamente disponible - En desarrollo",
  },
  {
    id: "youtube-oficial",
    titulo: "Canal YouTube PFDH",
    descripcion:
      "Videos de ceremonias de exaltación, entrevistas con atletas, documentales deportivos y cobertura de eventos especiales.",
    url: "#youtube-pfdh",
    tipo: "video",
    icono: Youtube,
    activo: false,
    contenidoEspecial: "Videos de las 8 ceremonias y documentales",
  },
  {
    id: "radio-walo",
    titulo: "Programa Radial - Radio WALO",
    descripcion:
      'Archivo del programa "El Pabellón de la Fama del Deporte Informa" transmitido por Radio WALO.',
    url: "#radio-walo",
    tipo: "radio",
    icono: Radio,
    activo: false,
    contenidoEspecial: "Programa histórico con entrevistas exclusivas",
  },
  {
    id: "exposiciones-fotograficas",
    titulo: "Exposiciones Fotográficas",
    descripcion:
      "Galería virtual con 19 páginas de fotografías históricas sobre la historia deportiva de Humacao desde la década de 1930 hasta 2015.",
    url: "/enlaces/galeria-historica",
    tipo: "educativo",
    icono: Camera,
    activo: true,
    destacado: true,
    contenidoEspecial: "19 fotografías históricas de 6 revistas diferentes",
  },
  {
    id: "publicaciones",
    titulo: "Publicaciones Oficiales",
    descripcion:
      "Revistas conmemorativas de las 8 ceremonias de exaltación con biografías completas, fotografías históricas y documentación de cada evento.",
    url: "/revistas",
    tipo: "documento",
    icono: BookOpen,
    activo: true,
    destacado: true,
    contenidoEspecial: "8 revistas oficiales con 81 biografías de exaltados",
  },
  {
    id: "pabellones-hermanos",
    titulo: "Pabellones Hermanos",
    descripcion:
      "Enlaces a los pabellones de la fama de Maunabo, Yabucoa y San Lorenzo, apadrinados por el PFDH.",
    url: "#pabellones-hermanos",
    tipo: "social",
    icono: Users,
    activo: false,
    contenidoEspecial: "Red de pabellones del este de Puerto Rico",
  },
  {
    id: "archivo-ceremonias",
    titulo: "Archivo de Ceremonias",
    descripcion:
      "Documentación completa de las 8 ceremonias de exaltación realizadas desde el año 2000.",
    url: "#ceremonias",
    tipo: "documento",
    icono: Award,
    activo: false,
    contenidoEspecial: "Revistas conmemorativas y serigrafías",
  },
];

const getStatusBadge = (activo: boolean) => {
  if (activo) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
        Activo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Clock className="w-3 h-3 mr-1" />
      En desarrollo
    </span>
  );
};

const RecursoCard = ({ recurso }: { recurso: RecursoEnlace }) => {
  const IconComponent = recurso.icono;

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        recurso.destacado
          ? "border-2 border-orange-500"
          : "border border-gray-200"
      }`}
    >
      <div className="p-6">
        {/* Header con icono y status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                recurso.destacado ? "bg-orange-100" : "bg-blue-100"
              }`}
            >
              <IconComponent
                className={`h-6 w-6 ${
                  recurso.destacado ? "text-orange-600" : "text-blue-600"
                }`}
              />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900">
                {recurso.titulo}
              </h3>
              {recurso.destacado && (
                <span className="text-sm font-medium text-orange-600">
                  ⭐ Destacado
                </span>
              )}
            </div>
          </div>
          {getStatusBadge(recurso.activo)}
        </div>

        {/* Descripción */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {recurso.descripcion}
        </p>

        {/* Contenido especial */}
        {recurso.contenidoEspecial && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 font-medium">
              📋 {recurso.contenidoEspecial}
            </p>
          </div>
        )}

        {/* Fecha de actualización */}
        {recurso.fechaActualizacion && (
          <div className="text-xs text-gray-500 mb-4">
            Actualizado:{" "}
            {new Date(recurso.fechaActualizacion).toLocaleDateString("es-PR")}
          </div>
        )}

        {/* Botón de acción */}
        <div className="pt-4 border-t border-gray-100">
          {recurso.activo ? (
            recurso.url.startsWith("#") ? (
              <a
                href={recurso.url}
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Contenido
                <Award className="ml-2 h-4 w-4" />
              </a>
            ) : recurso.url.startsWith("/") ? (
              <Link
                href={recurso.url}
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Contenido
                <Award className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <a
                href={recurso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Visitar Recurso
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed"
            >
              Próximamente Disponible
              <Clock className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function EnlacesPage() {
  const recursosActivos = recursosEnlaces.filter((r) => r.activo);
  const recursosEnDesarrollo = recursosEnlaces.filter((r) => !r.activo);

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
            <Globe className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Enlaces y Recursos</h1>
          </div>

          <p className="text-xl text-blue-100 max-w-3xl">
            Explora nuestra colección de recursos digitales, documentación
            histórica y contenido multimedia sobre el deporte humacaeño.
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recursos Activos */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <h2 className="text-3xl font-bold text-gray-900">
              Recursos Disponibles
            </h2>
          </div>

          {recursosActivos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recursosActivos.map((recurso) => (
                <RecursoCard key={recurso.id} recurso={recurso} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Los recursos digitales estarán disponible próximamente.
              </p>
            </div>
          )}
        </div>

        {/* Recursos en Desarrollo */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
            <h2 className="text-3xl font-bold text-gray-900">En Desarrollo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recursosEnDesarrollo.map((recurso) => (
              <RecursoCard key={recurso.id} recurso={recurso} />
            ))}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Desarrollo Digital en Progreso
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                🚀 Próximas Implementaciones
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Biblioteca digital con documentos históricos</li>
                <li>• Canal YouTube oficial con videos ceremonilaes</li>
                <li>• Archivo completo del programa radial</li>
                <li>• Galería de exposiciones fotográficas</li>
                <li>• Portal de publicaciones digitales</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-4">
                📞 Información y Sugerencias
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Teléfono:</strong> 787-410-1237
                </p>
                <p>
                  <strong>Email:</strong> informa@pfdh.org
                </p>
                <p>
                  <strong>Ubicación:</strong> Centro Cultural Antonia Sáez
                </p>
                <p>
                  <strong>Horario:</strong> Lunes a Viernes, 8:00 AM - 4:00 PM
                </p>
                <p className="text-sm">
                  ¿Tienes contenido histórico que te gustaría compartir?
                  Contáctanos para contribuir a nuestro archivo digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
