import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Pabellón de la Fama",
      links: [
        { name: "Directorio de Exaltados", href: "/directorio" },
        { name: "Historia", href: "/historia" },
        { name: "Junta de Directores", href: "/junta" },
        { name: "Calendario", href: "/calendario" },
      ],
    },
    {
      title: "Museo",
      links: [
        { name: "Museo Manuel Rivera Guevara", href: "/museo" },
        { name: "Exhibiciones", href: "/museo#exhibiciones" },
        { name: "Tour Virtual", href: "/museo#tour" },
        { name: "Horarios de Visita", href: "/horario" },
      ],
    },
    {
      title: "Enlaces",
      links: [
        { name: "Biblioteca", href: "/enlaces#biblioteca" },
        { name: "Blog", href: "/enlaces#blog" },
        { name: "YouTube", href: "/enlaces#youtube" },
        { name: "Horario y Contacto", href: "/horario" },
      ],
    },
  ];

  return (
    <footer className={`bg-pabellon-green-900 text-white py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/pabellon-logo.png"
                  alt="Pabellón de la Fama del Deporte Humacaeño - Logo Oficial"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-pabellon-gold-400">
                  Pabellón de la Fama
                </h3>
                <p className="text-sm text-pabellon-green-200">
                  Deporte Humacaeño
                </p>
              </div>
            </div>
            <p className="text-pabellon-green-200 text-sm leading-relaxed">
              Honrando la excelencia deportiva de Humacao, Puerto Rico desde
              1996.
            </p>
          </div>

          {/* Enlaces organizados */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4 text-pabellon-gold-400">
                {section.title}
              </h4>
              <nav className="space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-pabellon-green-100 hover:text-pabellon-gold-300 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Información de contacto */}
        <div className="mt-8 pt-8 border-t border-pabellon-green-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-pabellon-gold-400">
                Contacto
              </h4>
              <div className="space-y-2 text-pabellon-green-200 text-sm">
                <p>📍 Centro Cultural Antonia Sáez, Humacao, Puerto Rico</p>
                <p>📞 (787) 410-1237</p>
                <p>✉️ informa@pfdh.org</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-pabellon-gold-400">
                Síguenos
              </h4>
              <div className="flex space-x-4">
                <Link
                  href="/enlaces#youtube"
                  className="text-pabellon-green-200 hover:text-pabellon-gold-300 transition-colors"
                  aria-label="YouTube"
                >
                  🎥 YouTube
                </Link>
                <Link
                  href="/enlaces#blog"
                  className="text-pabellon-green-200 hover:text-pabellon-gold-300 transition-colors"
                  aria-label="Blog"
                >
                  📝 Blog
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-pabellon-green-700 text-center">
          <p className="text-pabellon-green-200 text-sm">
            © {currentYear} Pabellón de la Fama del Deporte Humacaeño. Todos los
            derechos reservados.
          </p>
          <p className="text-pabellon-green-300 text-xs mt-2">
            Museo Manuel Rivera Guevara
          </p>
        </div>
      </div>
    </footer>
  );
}
