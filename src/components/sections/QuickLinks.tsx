import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  NewspaperIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

interface QuickLinkItem {
  name: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  external: boolean;
  bgGradient: string;
  borderColor: string;
  iconColor: string;
  hoverIconColor: string;
  textColor: string;
  hoverTextColor: string;
}

const quickLinks: QuickLinkItem[] = [
  {
    name: "Calendario",
    href: "/calendario",
    description: "Eventos y actividades del Pabellón",
    icon: CalendarIcon,
    external: false,
    bgGradient: "from-pabellon-green-50 to-pabellon-green-100",
    borderColor: "border-pabellon-green-200",
    iconColor: "text-pabellon-green-700",
    hoverIconColor: "group-hover:text-pabellon-gold-600",
    textColor: "text-pabellon-green-800",
    hoverTextColor: "group-hover:text-pabellon-green-900",
  },
  {
    name: "Blog",
    href: "https://pabellonfdh.blogspot.com/",
    description: "Noticias y artículos deportivos",
    icon: NewspaperIcon,
    external: true,
    bgGradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    iconColor: "text-blue-700",
    hoverIconColor: "group-hover:text-pabellon-gold-600",
    textColor: "text-blue-800",
    hoverTextColor: "group-hover:text-blue-900",
  },
  {
    name: "Horario",
    href: "/horario",
    description: "Horas de visita y contacto",
    icon: ClockIcon,
    external: false,
    bgGradient: "from-pabellon-gold-50 to-pabellon-gold-100",
    borderColor: "border-pabellon-gold-200",
    iconColor: "text-pabellon-gold-700",
    hoverIconColor: "group-hover:text-pabellon-green-600",
    textColor: "text-pabellon-gold-800",
    hoverTextColor: "group-hover:text-pabellon-gold-900",
  },
];

interface QuickLinksProps {
  className?: string;
}

export function QuickLinks({ className = "" }: QuickLinksProps) {
  return (
    <section className={`py-12 lg:py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="text-center mb-10">
          <h3 className="text-2xl lg:text-3xl font-bold text-pabellon-green-800 mb-4">
            Acceso Rápido
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestros recursos y mantente conectado con el mundo
            deportivo humacaeño
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-green-600 rounded-full"></div>
          </div>
        </div>

        {/* Grid de enlaces rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const LinkComponent = link.external ? "a" : Link;
            const linkProps = link.external
              ? {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : { href: link.href };

            return (
              <LinkComponent
                key={link.name}
                {...linkProps}
                className={`group relative p-6 bg-gradient-to-br ${link.bgGradient} rounded-xl hover:shadow-lg transition-all duration-300 ${link.borderColor} border hover:scale-105 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Contenido del enlace */}
                <div className="flex flex-col items-center text-center h-full">
                  {/* Icono */}
                  <div className="relative mb-4">
                    <link.icon
                      className={`w-10 h-10 ${link.iconColor} ${link.hoverIconColor} transition-colors duration-200`}
                    />
                    {link.external && (
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </div>

                  {/* Título */}
                  <h4
                    className={`font-semibold text-lg ${link.textColor} ${link.hoverTextColor} transition-colors duration-200 mb-2`}
                  >
                    {link.name}
                  </h4>

                  {/* Descripción */}
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                    {link.description}
                  </p>

                  {/* Indicador de enlace externo */}
                  {link.external && (
                    <div className="mt-3 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Abrir en nueva ventana
                    </div>
                  )}
                </div>

                {/* Efecto de hover decorativo */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </LinkComponent>
            );
          })}
        </div>

        {/* CTA adicional */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-pabellon-green-50 to-pabellon-gold-50 rounded-2xl p-8 border border-pabellon-gold-200">
            <h4 className="text-xl font-semibold text-pabellon-green-800 mb-3">
              ¿Necesitas más información?
            </h4>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explora nuestros exaltados, conoce nuestra historia y accede a
              recursos digitales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/directorio"
                className="inline-flex items-center justify-center px-6 py-3 bg-pabellon-green-700 text-white font-medium rounded-lg hover:bg-pabellon-green-800 transition-colors duration-200"
              >
                Ver Exaltados
              </Link>
              <Link
                href="/historia"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-pabellon-green-700 text-pabellon-green-700 font-medium rounded-lg hover:bg-pabellon-green-700 hover:text-white transition-all duration-200"
              >
                Ver Historia
              </Link>
              <Link
                href="/enlaces"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-pabellon-green-700 text-pabellon-green-700 font-medium rounded-lg hover:bg-pabellon-green-700 hover:text-white transition-all duration-200"
              >
                Ver Enlaces
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
