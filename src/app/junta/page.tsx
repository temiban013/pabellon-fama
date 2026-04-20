// src/app/junta/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Users, Calendar, Award } from "lucide-react";
import { generateMetadata, seoConfigs, generateBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  ...seoConfigs.junta,
  url: "https://pabellondelafama.com/junta",
});

interface MiembroJunta {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string;
  anosServicio?: string;
  foto?: string;
  fotoPosition?: string;
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
    anosServicio: "2016 - Presente",
    foto: "/images/junta/enrique-torres.jpg",
    fotoPosition: "center 8%",
    contribuciones: [
      "Modernización de las operaciones del PFDH",
      "Expansión de programas educativos",
      "Fortalecimiento de alianzas comunitarias",
    ],
  },
  {
    id: "miriam-lasanta",
    nombre: "Miriam Lasanta",
    cargo: "Secretaria",
    descripcion:
      "Responsable de mantener los registros oficiales y la documentación del pabellón.",
    anosServicio: "2004 - Presente",
    foto: "/images/junta/miriam-lasanta.jpg",
    fotoPosition: "center 55%",
    contribuciones: [
      "Coordinación de eventos especiales",
      "Desarrollo de programas educativos",
      "Enlace con organizaciones deportivas",
    ],
  },
  {
    id: "felix-baez",
    nombre: "Félix Báez Neris",
    cargo: "Vicepresidente",
    descripcion:
      "Historiador y cronista del deporte humacaeño, custodio de la memoria deportiva.",
    anosServicio: "1999 - Presente",
    foto: "/images/junta/felix-baez.jpg",
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
    foto: "/images/junta/juan-velazquez.jpg",
    fotoPosition: "center 8%",
    contribuciones: [
      "Miembro fundador de la primera junta directiva",
      "Gestión financiera transparente",
      "Desarrollo de políticas fiscales",
    ],
  },
  {
    id: "arnaldo-ortiz",
    nombre: "Arnaldo (Larry) Ortiz",
    cargo: "Vocal",
    descripcion:
      "Miembro activo con enfoque en programas comunitarios y desarrollo organizacional.",
    anosServicio: "2018 - Presente",
    foto: "/images/junta/arnaldo-ortiz.jpg",
    fotoPosition: "center 50%",
    contribuciones: [
      "Digitalización de archivos históricos",
      "Organización de ceremonias de exaltación",
      "Gestión de comunicaciones oficiales",
    ],
  },
  {
    id: "jorge-orona",
    nombre: "Jorge Orona",
    cargo: "Vocal",
    descripcion:
      "Miembro comprometido con la preservación y promoción del legado deportivo.",
    anosServicio: "2020 - Presente",
    foto: "/images/junta/jorge-orona.jpg",
    contribuciones: [
      "Apoyo en investigaciones históricas",
      "Coordinación de actividades especiales",
      "Promoción del pabellón en medios",
    ],
  },
  {
    id: "orlando-lopez",
    nombre: "Orlando J. López Rivera",
    cargo: "Vocal",
    descripcion:
      "Miembro joven con enfoque analítico en la investigación y documentación estadística del deporte humacaeño.",
    anosServicio: "2026 - Presente",
    foto: "/images/junta/orlando-lopez.jpg",
    fotoPosition: "center 50%",
    contribuciones: [
      "Análisis estadístico del rendimiento deportivo",
      "Investigación y documentación de récords históricos",
      "Apoyo en la modernización de procesos organizacionales",
    ],
  },
  {
    id: "luis-alvarez",
    nombre: "Luis Reinaldo Álvarez",
    cargo: "Curador del Museo",
    descripcion:
      "Historiador y educador, curador del Museo Manuel Rivera Guevara.",
    anosServicio: "1999 - Presente",
    foto: "/images/junta/luis-alvarez.jpg",
    fotoPosition: "center 40%",
    contribuciones: [
      "Miembro fundador y educador distinguido",
      "Curación del museo y exhibiciones",
      "Autor de múltiples publicaciones deportivas",
    ],
  },
];

const MiembroCard = ({ miembro }: { miembro: MiembroJunta }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    {/* Photo or placeholder */}
    <div className="relative h-72 w-full bg-gradient-to-br from-blue-800 to-blue-600">
      {miembro.foto ? (
        <Image
          src={miembro.foto}
          alt={`Foto de ${miembro.nombre}`}
          fill
          className="object-cover"
          style={{ objectPosition: miembro.fotoPosition ?? "center top" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-4xl font-bold text-white/60">
            {miembro.nombre
              .split(" ")
              .filter((n) => !n.startsWith("("))
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
      )}
    </div>

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

const juntaBreadcrumbs = generateBreadcrumbs([
  { name: "Inicio", url: "https://pabellondelafama.com" },
  { name: "Junta de Directores", url: "https://pabellondelafama.com/junta" },
]);

export default function JuntaDirectoresPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(juntaBreadcrumbs) }}
      />
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
                <div className="space-y-1">
                  <a
                    href="tel:787-410-1237"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg block"
                  >
                    787-410-1237
                  </a>
                  <a
                    href="tel:939-529-5732"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg block"
                  >
                    939-529-5732
                  </a>
                </div>
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
                  P.O. Box 9078, Humacao, PR 00792
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
    </>
  );
}
