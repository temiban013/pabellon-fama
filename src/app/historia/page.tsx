// src/app/historia/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Trophy,
  Users,
  BookOpen,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Historia del Pabellón | PFDH",
  description:
    "Descubre la rica historia del Pabellón de la Fama del Deporte Humacaeño desde 1983",
  keywords:
    "historia, PFDH, pabellón fama, humacao, deporte, fundación, cronología",
  openGraph: {
    title: "Historia - Pabellón de la Fama del Deporte Humacaeño",
    description:
      "Un recorrido por la historia del PFDH desde sus orígenes hasta hoy",
    url: "/historia",
    siteName: "Pabellón de la Fama del Deporte Humacaeño",
  },
};

interface EventoHistorico {
  año: number;
  titulo: string;
  descripcion: string;
  detalles?: string[];
  icono:
    | "idea"
    | "fundacion"
    | "ceremonia"
    | "museo"
    | "actividad"
    | "reconocimiento";
  destacado?: boolean;
}

const eventosHistoricos: EventoHistorico[] = [
  {
    año: 1983,
    titulo: "Primera Iniciativa",
    descripcion:
      "Pedro Tolentino plantea por primera vez la creación de un Salón de la Fama para honrar a los atletas humacaeños.",
    detalles: [
      "Visión inicial del deportista Pedro Tolentino",
      "Reconocimiento de la necesidad de honrar el deporte local",
      "Primera semilla de lo que sería el PFDH",
    ],
    icono: "idea",
    destacado: true,
  },
  {
    año: 1989,
    titulo: "Iniciativa Legislativa",
    descripcion:
      "El legislador Antonio Rosa Guzmán retoma la iniciativa para crear el pabellón.",
    icono: "actividad",
  },
  {
    año: 1990,
    titulo: "Asignación Presupuestaria",
    descripcion:
      "Joel Rosario logra la asignación de $49,000 por la Asamblea Legislativa para la construcción de la sede.",
    detalles: [
      "Reconocimiento especial a Joel Rosario",
      "Colaborador incondicional desde el día uno",
      "Primer apoyo económico oficial",
    ],
    icono: "reconocimiento",
  },
  {
    año: 1998,
    titulo: "Incorporación Oficial",
    descripcion:
      "El 22 de diciembre se incorpora oficialmente el PFDH en el Departamento de Estado de Puerto Rico.",
    detalles: [
      "Liderado por Lcdo. Francisco Betancourt Ibern",
      "César Rodríguez Mercado y Amador (Papo) Cardona",
      "Reconocimiento legal como organización",
    ],
    icono: "fundacion",
    destacado: true,
  },
  {
    año: 1999,
    titulo: "Primera Junta Directiva",
    descripcion:
      "Se constituye la primera Junta de Directores en marzo, marcando el inicio operativo del PFDH.",
    detalles: [
      "Presidente: Lcdo. Francisco Betancourt Ibern",
      "Vicepresidente: César Rodríguez Mercado",
      "Secretario: Prof. Pedro J. Dávila Poupart",
      "Tesorero: Juan Velázquez",
      "Directivos: Pedro Tolentino, Gloria Andino, Víctor Hernández",
      "Dr. Miguel A. Poupart, Luis Reinaldo Álvarez, Luis F. Carrasquillo",
      "Héctor Pabón Vellón y Félix Báez Neris",
    ],
    icono: "fundacion",
    destacado: true,
  },
  {
    año: 2000,
    titulo: "Primera Ceremonia de Exaltación",
    descripcion:
      "El 20 de agosto se realiza la histórica primera ceremonia en el teatro de la UPR Humacao.",
    detalles: [
      "23 atletas y propulsores exaltados",
      "Celebrada en el teatro de la Universidad de Puerto Rico",
      "Momento culminante de años de trabajo",
    ],
    icono: "ceremonia",
    destacado: true,
  },
  {
    año: 2002,
    titulo: "Segunda Ceremonia",
    descripcion:
      "El 3 de noviembre se exaltan 8 atletas, incluyendo el primer equipo: Campeón Béisbol Doble A 1951.",
    detalles: [
      "8 atletas individuales exaltados",
      "Primer equipo exaltado: Grises Orientales 1951",
      "Establecimiento de tradición ceremonial",
    ],
    icono: "ceremonia",
  },
  {
    año: 2004,
    titulo: "Expansión de la Junta",
    descripcion:
      "Se suman nuevos miembros: Miriam Lasanta y David Curbelo, fortaleciendo el liderazgo.",
    icono: "actividad",
  },
  {
    año: 2006,
    titulo: "Cuarta Ceremonia",
    descripcion:
      "Exaltación que incluye el equipo Sub-Campeón Béisbol Doble A 1960.",
    icono: "ceremonia",
  },
  {
    año: 2008,
    titulo: "Quinta Ceremonia",
    descripcion:
      "Se exalta el Equipo Juvenil de Fútbol Humacaeño 1967, diversificando los deportes honrados.",
    icono: "ceremonia",
  },
  {
    año: 2010,
    titulo: "Presidencia de Quique Torres",
    descripcion:
      "Inicia el liderazgo de Enrique Torres, incorporando nuevos miembros como Héctor Ruiz y Benjamín Berrios.",
    icono: "actividad",
  },
  {
    año: 2015,
    titulo: "Octava Ceremonia",
    descripcion:
      "Última ceremonia realizada, completando un total de 78 deportistas exaltados.",
    detalles: [
      "78 deportistas exaltados en total",
      "3 equipos completos honrados",
      "Culminación de 8 ceremonias exitosas",
    ],
    icono: "ceremonia",
  },
  {
    año: 2024,
    titulo: "Museo Manuel Rivera Guevara",
    descripcion:
      "Inauguración del museo físico en el Centro Cultural Dra. Antonia Sáez, culminando décadas de trabajo.",
    detalles: [
      "Ubicado en Centro Cultural Dra. Antonia Sáez",
      "Exhibición permanente de memorabilia deportiva",
      "Curador: Luis Reinaldo Álvarez",
    ],
    icono: "museo",
    destacado: true,
  },
];

const logrosDestacados = [
  {
    titulo: "78 Deportistas Exaltados",
    descripcion: "Atletas y propulsores honrados en 8 ceremonias",
    icono: Trophy,
  },
  {
    titulo: "26 Años de Historia",
    descripcion: "Desde la incorporación hasta hoy",
    icono: Calendar,
  },
  {
    titulo: "3 Equipos Exaltados",
    descripcion: "Grises Orientales 1951 y 1960, Fútbol Juvenil 1967",
    icono: Users,
  },
  {
    titulo: "Múltiples Publicaciones",
    descripcion: "Libros y exposiciones sobre historia deportiva",
    icono: BookOpen,
  },
];

const getIconoComponente = (tipo: string) => {
  switch (tipo) {
    case "idea":
      return "💡";
    case "fundacion":
      return "🏛️";
    case "ceremonia":
      return "🏆";
    case "museo":
      return "🏛️";
    case "actividad":
      return "📋";
    case "reconocimiento":
      return "🎖️";
    default:
      return "📅";
  }
};

const EventoCard = ({
  evento,
  index,
}: {
  evento: EventoHistorico;
  index: number;
}) => (
  <div
    className={`flex ${
      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
    } items-center mb-12`}
  >
    {/* Línea de tiempo */}
    <div className="flex flex-col items-center mx-8">
      <div
        className={`w-4 h-4 rounded-full ${
          evento.destacado ? "bg-orange-500" : "bg-blue-500"
        } border-4 border-white shadow-lg z-10`}
      ></div>
      <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
    </div>

    {/* Contenido */}
    <div
      className={`flex-1 max-w-md ${
        index % 2 === 0 ? "text-left" : "text-right"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 ${
          evento.destacado
            ? "border-l-4 border-orange-500"
            : "border-l-4 border-blue-500"
        } hover:shadow-xl transition-all duration-300`}
      >
        <div
          className={`flex items-center mb-3 ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <span className="text-2xl mr-3">
            {getIconoComponente(evento.icono)}
          </span>
          <div className={`${index % 2 === 0 ? "text-left" : "text-right"}`}>
            <h3 className="text-xl font-bold text-gray-900">{evento.titulo}</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                evento.destacado
                  ? "bg-orange-100 text-orange-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {evento.año}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">
          {evento.descripcion}
        </p>

        {evento.detalles && (
          <ul
            className={`space-y-2 ${
              index % 2 === 0 ? "text-left" : "text-right"
            }`}
          >
            {evento.detalles.map((detalle, idx) => (
              <li
                key={idx}
                className={`text-sm text-gray-600 flex items-start ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <span
                  className={`w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0 ${
                    index % 2 === 0 ? "mr-2" : "ml-2"
                  }`}
                ></span>
                {detalle}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

export default function HistoriaPage() {
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
            <h1 className="text-4xl font-bold">Historia del Pabellón</h1>
          </div>

          <p className="text-xl text-blue-100 max-w-3xl">
            Un recorrido por más de cuatro décadas de historia, desde la visión
            inicial hasta la consolidación del Pabellón de la Fama del Deporte
            Humacaeño.
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introducción */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Una Tradición Deportiva de Excelencia
          </h2>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6 text-center">
              Humacao es una ciudad con gran tradición deportiva, cuna de
              grandes atletas y propulsores de deportes, que nos han
              representado con dignidad y gallardía en competencias nacionales e
              internacionales. Esas ejecutorias motivaron a un grupo de
              deportistas humacaeños a plantear la creación de un Salón de la
              Fama que hiciera justicia a las gestas de esos atletas y
              propulsores.
            </p>
          </div>
        </div>

        {/* Logros Destacados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {logrosDestacados.map((logro, index) => {
            const IconComponent = logro.icono;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
              >
                <IconComponent className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {logro.titulo}
                </h3>
                <p className="text-gray-600">{logro.descripcion}</p>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Cronología Histórica
          </h2>

          <div className="relative">
            {eventosHistoricos.map((evento, index) => (
              <EventoCard key={evento.año} evento={evento} index={index} />
            ))}
          </div>
        </div>

        {/* Actividades Destacadas */}
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Actividades y Contribuciones Destacadas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                📚 Publicaciones y Literatura
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • &ldquo;El fútbol nos cayó del cielo&rdquo; - Prof. Luis Reinaldo Álvarez
                </li>
                <li>
                  • &ldquo;Desde el Diamante del Béisbol&rdquo; - Carlos Velázquez Boirié
                </li>
                <li>• &ldquo;Béisbol de Corazón&rdquo; - Jaime Córdoba</li>
                <li>
                  • &ldquo;El Fútbol Puertorriqueño: crónica de alegrías, sueños y
                  desencantos&rdquo;
                </li>
                <li>
                  • &ldquo;Puerto Rico, cuna de campeones: 56 años de pura adrenalina&rdquo;
                  - Melvin Fonseca
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-4">
                🎯 Eventos y Reconocimientos
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • Programa radial &ldquo;El Pabellón de la Fama del Deporte Informa&rdquo;
                </li>
                <li>• Múltiples exposiciones fotográficas históricas</li>
                <li>• Homenaje al historiador Salvador Abreu Vega</li>
                <li>• Reconocimientos especiales a equipos históricos</li>
                <li>• Celebración del legado de Néstor Morales</li>
                <li>
                  • Padrinazgo de pabellones en Maunabo, Yabucoa y San Lorenzo
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
