// src/app/junta/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Users, Calendar, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Junta de Directores | PFDH",
  description:
    "Conozca a la Junta de Directores del Pabellón de la Fama del Deporte Humacaeño",
  keywords:
    "junta directores, PFDH, pabellón fama, humacao, puerto rico, liderazgo",
  openGraph: {
    title: "Junta de Directores - Pabellón de la Fama del Deporte Humacaeño",
    description: "La dedicada Junta de Directores que lidera el PFDH",
    url: "/junta",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
  },
};

interface MiembroJunta {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string;
  anosServicio?: string;
  email?: string;
  contribuciones?: string[];
}

const miembrosJunta: MiembroJunta[] = [
  {
    id: "enrique-torres",
    nombre: "Enrique (Quique) Torres",
    cargo: "Presidente",
    descripcion:
      "Líder visionario con amplia experiencia en la gestión deportiva y comunitaria de Humacao.",
    anosServicio: "2020 - Presente",
    contribuciones: [
      "Modernización de las operaciones del PFDH",
      "Expansión de programas educativos",
      "Fortalecimiento de alianzas comunitarias",
    ],
  },
  {
    id: "arnaldo-ortiz",
    nombre: "Arnaldo (Larry) Ortiz",
    cargo: "Secretario",
    descripcion:
      "Responsable de mantener los registros oficiales y la documentación del pabellón.",
    anosServicio: "2018 - Presente",
    contribuciones: [
      "Digitalización de archivos históricos",
      "Organización de ceremonias de exaltación",
      "Gestión de comunicaciones oficiales",
    ],
  },
  {
    id: "felix-baez",
    nombre: "Félix Báez Neris",
    cargo: "Secretario Auxiliar",
    descripcion:
      "Historiador y cronista del deporte humacaeño, custodio de la memoria deportiva.",
    anosServicio: "1999 - Presente",
    contribuciones: [
      "Fundador y miembro original de la primera junta",
      "Autor de múltiples investigaciones deportivas",
      "Administrador del blog histórico del PFDH",
    ],
  },
  {
    id: "juan-velazquez",
    nombre: "Juan Velázquez",
    cargo: "Tesorero",
    descripcion:
      "Administrador financiero responsable de la gestión económica del pabellón.",
    anosServicio: "1999 - Presente",
    contribuciones: [
      "Miembro fundador de la primera junta directiva",
      "Gestión financiera transparente",
      "Desarrollo de políticas fiscales",
    ],
  },
  {
    id: "miriam-lasanta",
    nombre: "Miriam Lasanta",
    cargo: "Vocal",
    descripcion:
      "Miembro activo con enfoque en programas comunitarios y desarrollo organizacional.",
    anosServicio: "2004 - Presente",
    contribuciones: [
      "Coordinación de eventos especiales",
      "Desarrollo de programas educativos",
      "Enlace con organizaciones deportivas",
    ],
  },
  {
    id: "benjamin-berrios",
    nombre: "Benjamin Berrios",
    cargo: "Vocal",
    descripcion:
      "Contribuidor activo en las iniciativas de promoción y desarrollo del pabellón.",
    anosServicio: "2020 - Presente",
    contribuciones: [
      "Promoción de actividades deportivas",
      "Apoyo en ceremonias y eventos",
      "Desarrollo de nuevas iniciativas",
    ],
  },
  {
    id: "jorge-orona",
    nombre: "Jorge Orona",
    cargo: "Vocal",
    descripcion:
      "Miembro comprometido con la preservación y promoción del legado deportivo.",
    anosServicio: "2020 - Presente",
    contribuciones: [
      "Apoyo en investigaciones históricas",
      "Coordinación de actividades especiales",
      "Promoción del pabellón en medios",
    ],
  },
  {
    id: "luis-alvarez",
    nombre: "Luis Reinaldo Álvarez",
    cargo: "Curador del Museo",
    descripcion:
      "Historiador y educador, curador del Museo Manuel Rivera Guevara.",
    anosServicio: "1999 - Presente",
    contribuciones: [
      "Miembro fundador y educador distinguido",
      "Curación del museo y exhibiciones",
      "Autor de múltiples publicaciones deportivas",
    ],
  },
];

const MiembroCard = ({ miembro }: { miembro: MiembroJunta }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="p-6">
      {/* Header con nombre y cargo */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-900 mb-1">
          {miembro.nombre}
        </h3>
        <p className="text-orange-600 font-semibold text-lg">{miembro.cargo}</p>
        {miembro.anosServicio && (
          <div className="flex items-center text-gray-600 text-sm mt-2">
            <Calendar className="h-4 w-4 mr-1" />
            {miembro.anosServicio}
          </div>
        )}
      </div>

      {/* Descripción */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {miembro.descripcion}
      </p>

      {/* Contribuciones */}
      {miembro.contribuciones && miembro.contribuciones.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Contribuciones Principales
          </h4>
          <ul className="space-y-1">
            {miembro.contribuciones.map((contribucion, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-start"
              >
                <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {contribucion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

export default function JuntaDirectoresPage() {
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
            <Users className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Junta de Directores</h1>
          </div>

          <p className="text-xl text-blue-100 max-w-3xl">
            Conozca a los dedicados líderes que guían el Pabellón de la Fama del
            Deporte Humacaeño, preservando y honrando la rica tradición
            deportiva de nuestra ciudad.
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introducción */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Liderazgo Comprometido con la Excelencia
          </h2>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              La Junta de Directores del Pabellón de la Fama del Deporte
              Humacaeño está compuesta por profesionales distinguidos y
              apasionados por el deporte, comprometidos con preservar y promover
              el legado deportivo de Humacao.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Desde su fundación en 1999, esta dedicada junta ha trabajado
              incansablemente para honrar a nuestros atletas destacados,
              mantener la historia viva y desarrollar programas que inspiren a
              las futuras generaciones deportivas.
            </p>
          </div>
        </div>

        {/* Grid de Miembros */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {miembrosJunta.map((miembro) => (
            <MiembroCard key={miembro.id} miembro={miembro} />
          ))}
        </div>

        {/* Información de Contacto */}
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Contacto con la Junta Directiva
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Coordinación de Visitas
                </h3>
                <p className="text-gray-600 mb-2">
                  Para coordinar reuniones o visitas oficiales
                </p>
                <a
                  href="tel:787-410-1237"
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg block"
                >
                  787-410-1237
                </a>
                <a
                  href="mailto:informa@pfdh.org"
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 block"
                >
                  informa@pfdh.org
                </a>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Mail className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comunicación Oficial
                </h3>
                <p className="text-gray-600 mb-2">
                  Centro Cultural Antonia Sáez
                </p>
                <p className="text-gray-600 mb-2">
                  Horario de oficina: Lunes a Viernes
                </p>
                <p className="text-gray-800 font-semibold">8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 max-w-2xl mx-auto">
              La Junta de Directores está siempre dispuesta a recibir
              sugerencias, propuestas y colaboraciones que contribuyan al
              crecimiento y desarrollo del Pabellón de la Fama del Deporte
              Humacaeño.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
