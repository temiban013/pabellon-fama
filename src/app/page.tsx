import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-2 shadow-lg">
                {/* Placeholder para el logo - reemplazar con imagen real */}
                <div className="w-full h-full bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  PFDF
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">
                  Pabellón de la Fama
                </h1>
                <p className="text-sm text-amber-600 font-medium">
                  Deporte Humacaeño
                </p>
              </div>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex space-x-6">
              <Link
                href="/"
                className="text-green-800 hover:text-amber-600 font-medium transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/junta"
                className="text-green-700 hover:text-amber-600 font-medium transition-colors"
              >
                Junta de Directores
              </Link>
              <Link
                href="/directorio"
                className="text-green-700 hover:text-amber-600 font-medium transition-colors"
              >
                Directorio de Exaltados
              </Link>
              <Link
                href="/historia"
                className="text-green-700 hover:text-amber-600 font-medium transition-colors"
              >
                Historia
              </Link>
              <Link
                href="/museo"
                className="text-green-700 hover:text-amber-600 font-medium transition-colors"
              >
                Museo
              </Link>
              <Link
                href="/horario"
                className="text-green-700 hover:text-amber-600 font-medium transition-colors"
              >
                Horario
              </Link>
              <Link
                href="/calendario"
                className="text-green-700 hover:text-amber-600 font-medium transition-colors"
              >
                Calendario
              </Link>
            </nav>

            {/* Menu móvil button */}
            <button className="lg:hidden p-2 rounded-md text-green-800 hover:bg-amber-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Título principal con decoración */}
            <div className="relative inline-block">
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-lg"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-lg"></div>

              <div className="bg-white px-12 py-8 border-2 border-dashed border-amber-300 rounded-lg shadow-xl">
                <h2 className="text-3xl lg:text-5xl font-bold text-green-800 mb-4">
                  Museo del Pabellón de la Fama
                </h2>
                <h3 className="text-2xl lg:text-4xl font-bold text-green-800">
                  del Deporte Humacaeño
                </h3>
                <div className="mt-4 text-lg text-amber-600 font-medium">
                  Manuel Rivera Guevara
                </div>
              </div>
            </div>

            {/* Descripción */}
            <p className="mt-8 text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Honrando la excelencia deportiva de Humacao, Puerto Rico. Un lugar
              donde se preserva la historia y se celebran los logros de nuestros
              atletas más destacados.
            </p>
          </div>
        </div>
      </section>

      {/* Enlaces rápidos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/biblioteca"
              className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-all duration-300 border border-green-200"
            >
              <div className="flex flex-col items-center text-center">
                <BookOpenIcon className="w-8 h-8 text-green-700 group-hover:text-amber-600 transition-colors mb-3" />
                <h3 className="font-semibold text-green-800 group-hover:text-green-900">
                  Biblioteca
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  Recursos y documentos
                </p>
              </div>
            </Link>

            <Link
              href="/youtube"
              className="group p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg hover:shadow-lg transition-all duration-300 border border-red-200"
            >
              <div className="flex flex-col items-center text-center">
                <VideoCameraIcon className="w-8 h-8 text-red-700 group-hover:text-amber-600 transition-colors mb-3" />
                <h3 className="font-semibold text-red-800 group-hover:text-red-900">
                  YouTube
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  Videos y documentales
                </p>
              </div>
            </Link>

            <Link
              href="/blog"
              className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-all duration-300 border border-blue-200"
            >
              <div className="flex flex-col items-center text-center">
                <BookOpenIcon className="w-8 h-8 text-blue-700 group-hover:text-amber-600 transition-colors mb-3" />
                <h3 className="font-semibold text-blue-800 group-hover:text-blue-900">
                  Blog
                </h3>
                <p className="text-sm text-blue-600 mt-1">
                  Noticias y artículos
                </p>
              </div>
            </Link>

            <Link
              href="/horario"
              className="group p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg hover:shadow-lg transition-all duration-300 border border-amber-200"
            >
              <div className="flex flex-col items-center text-center">
                <ClockIcon className="w-8 h-8 text-amber-700 group-hover:text-green-600 transition-colors mb-3" />
                <h3 className="font-semibold text-amber-800 group-hover:text-amber-900">
                  Horario
                </h3>
                <p className="text-sm text-amber-600 mt-1">Horas de visita</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Imagen del Museo */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-green-800 mb-4">
              Visita Nuestro Museo
            </h3>
            <p className="text-lg text-green-700">
              Descubre la rica historia deportiva de Humacao
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Placeholder para la imagen del museo */}
            <div className="aspect-video bg-gradient-to-r from-green-200 to-green-300 rounded-lg shadow-xl flex items-center justify-center">
              <div className="text-center text-green-800">
                <div className="text-6xl mb-4">🏛️</div>
                <p className="text-xl font-semibold">
                  Museo Manuel Rivera Guevara
                </p>
                <p className="text-lg mt-2">
                  Imagen del museo será agregada aquí
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Registro */}
      <section className="py-16 bg-gradient-to-br from-amber-100 to-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border-4 border-amber-300">
            <h3 className="text-2xl lg:text-3xl font-bold text-green-800 mb-6">
              COMUNÍCATE CON NOSOTROS
            </h3>

            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Mantente informado sobre nuestras actividades, eventos especiales
              y nuevas incorporaciones al Pabellón de la Fama del Deporte
              Humacaeño.
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
                <button className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Regístrate aquí
                </button>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Respetamos tu privacidad. No compartimos tu información.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">
                Contacto
              </h4>
              <p className="text-green-100">Humacao, Puerto Rico</p>
              <p className="text-green-100">info@pabellon.org</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">
                Enlaces
              </h4>
              <div className="space-y-2">
                <Link
                  href="/directorio"
                  className="block text-green-100 hover:text-amber-300 transition-colors"
                >
                  Directorio de Exaltados
                </Link>
                <Link
                  href="/historia"
                  className="block text-green-100 hover:text-amber-300 transition-colors"
                >
                  Historia
                </Link>
                <Link
                  href="/museo"
                  className="block text-green-100 hover:text-amber-300 transition-colors"
                >
                  Museo
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">
                Síguenos
              </h4>
              <div className="space-y-2">
                <Link
                  href="/youtube"
                  className="block text-green-100 hover:text-amber-300 transition-colors"
                >
                  YouTube
                </Link>
                <Link
                  href="/blog"
                  className="block text-green-100 hover:text-amber-300 transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-green-700 text-center">
            <p className="text-green-200">
              © 2025 Pabellón de la Fama del Deporte Humacaeño. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
