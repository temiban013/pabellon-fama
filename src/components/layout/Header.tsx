"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

const navigation: NavigationItem[] = [
  { name: "Inicio", href: "/" },
  { name: "Junta de Directores", href: "/junta" },
  { name: "Directorio de Exaltados", href: "/directorio" },
  { name: "Museo", href: "/museo" },
  { name: "Historia", href: "/historia" },
  { name: "Enlaces", href: "/enlaces" },
  { name: "Horario", href: "/horario" },
  { name: "Calendario", href: "/calendario" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-lg border-b-4 border-pabellon-gold-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo y título */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative w-16 h-16">
              {/* Logo oficial del pabellón */}
              <div className="w-full h-full group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/pabellon-logo.png"
                  alt="Pabellón de la Fama del Deporte Humacaeño - Logo Oficial"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-pabellon-green-800 group-hover:text-pabellon-green-700 transition-colors">
                Pabellón de la Fama
              </h1>
              <p className="text-sm lg:text-base text-pabellon-gold-600 font-medium">
                Deporte Humacaeño
              </p>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-pabellon-gold-50"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Menu móvil button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-pabellon-green-800 hover:bg-pabellon-gold-100 transition-colors"
            aria-label="Abrir menú de navegación"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menu móvil */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-pabellon-green-700 hover:text-pabellon-gold-600 hover:bg-pabellon-gold-50 rounded-md transition-colors"
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
