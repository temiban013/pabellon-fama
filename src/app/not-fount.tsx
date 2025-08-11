// app/not-found.tsx
import Link from "next/link";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | Pabellón de la Fama del Deporte Humacaeño",
  description:
    "La página que buscas no existe. Regresa al Pabellón de la Fama del Deporte Humacaeño.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pabellon-gold-50 via-white to-pabellon-green-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo del Pabellón */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 rounded-full p-3 shadow-lg border-4 border-pabellon-brown-700 mx-auto">
            <div className="w-full h-full bg-pabellon-green-800 rounded-full flex items-center justify-center text-pabellon-gold-400 font-bold text-sm leading-none text-center">
              <div>
                <div className="text-[10px]">PABELLÓN</div>
                <div className="text-[8px]">FAMA</div>
                <div className="text-[10px] mt-1">404</div>
              </div>
            </div>
          </div>
        </div>

        {/* Título y mensaje */}
        <h1 className="text-6xl font-bold text-pabellon-green-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-pabellon-green-700 mb-4">
          Página no encontrada
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe o ha sido movida. Te
          invitamos a explorar nuestro Pabellón de la Fama y descubrir la rica
          historia deportiva de Humacao.
        </p>

        {/* Enlaces útiles */}
        <div className="space-y-4 mb-8">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-pabellon-green-700 to-pabellon-green-800 hover:from-pabellon-green-800 hover:to-pabellon-green-900 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Volver al Inicio
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/museo"
              className="bg-white border-2 border-pabellon-green-700 text-pabellon-green-700 hover:bg-pabellon-green-700 hover:text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 text-sm"
            >
              Visitar Museo
            </Link>
            <Link
              href="/directorio"
              className="bg-white border-2 border-pabellon-gold-600 text-pabellon-gold-600 hover:bg-pabellon-gold-600 hover:text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 text-sm"
            >
              Ver Exaltados
            </Link>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-sm text-gray-500">
          <p>Si crees que esto es un error, por favor contáctanos:</p>
          <a
            href="mailto:info@pabellon.org"
            className="text-pabellon-gold-600 hover:text-pabellon-gold-700 font-medium"
          >
            info@pabellon.org
          </a>
        </div>
      </div>
    </div>
  );
}
