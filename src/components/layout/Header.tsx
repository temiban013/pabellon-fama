"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

const navigation: NavigationItem[] = [
  { name: "Inicio", href: "/" },
  { name: "Junta de Directores", href: "#" },
  { name: "Directorio de Exaltados", href: "/directorio" },
  { name: "Historia", href: "#" },
  { name: "Enlaces", href: "#" },
  { name: "Museo", href: "/museo" },
  { name: "Horario", href: "#" },
  { name: "Calendario", href: "#" },
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
              {/* Logo del escudo basado en la imagen */}
              <div className="w-full h-full bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 rounded-full p-2 shadow-lg border-2 border-pabellon-brown-700 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-pabellon-green-800 rounded-full flex items-center justify-center relative overflow-hidden">
                  {/* Escudo simplificado del logo */}
                  <div className="text-pabellon-gold-400 font-bold text-xs leading-none text-center">
                    <div className="text-[8px]">PABELLÓN</div>
                    <div className="text-[6px]">FAMA</div>
                    <div className="text-[8px] mt-1">1996</div>
                  </div>
                </div>
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
