// src/components/navigation/MainNav.tsx - ACTUALIZACIÓN
import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Users,
  Clock,
  BookOpen,
  Globe,
  Calendar,
  Trophy,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navigationItems: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Trophy,
    description: "Página principal del PFDH",
  },
  {
    label: "Directorio de Exaltados",
    href: "/directorio",
    icon: Users,
    description: "78 deportistas honrados",
  },
  {
    label: "Junta de Directores",
    href: "/junta",
    icon: Users,
    description: "Liderazgo del pabellón",
  },
  {
    label: "Historia",
    href: "/historia",
    icon: BookOpen,
    description: "Cronología desde 1983",
  },
  {
    label: "Museo",
    href: "/museo",
    icon: Trophy,
    description: "Tour virtual Manuel Rivera Guevara",
  },
  {
    label: "Enlaces",
    href: "/enlaces",
    icon: Globe,
    description: "Recursos y contenido digital",
  },
  {
    label: "Horario",
    href: "/horario",
    icon: Clock,
    description: "Visitas y contacto",
  },
  {
    label: "Calendario",
    href: "/calendario",
    icon: Calendar,
    description: "Eventos y actividades",
  },
];

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Trophy className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">PFDH</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown para más opciones */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                Más
              </button>

              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {navigationItems.slice(4).map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {IconComponent && <IconComponent className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />}
                        <div>
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {IconComponent && <IconComponent className="h-5 w-5 mr-3 text-gray-400" />}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
