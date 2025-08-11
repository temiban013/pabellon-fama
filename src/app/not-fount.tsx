import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pabellon-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 rounded-full p-4 shadow-lg border-2 border-pabellon-brown-700 mx-auto mb-8">
          <div className="w-full h-full bg-pabellon-green-800 rounded-full flex items-center justify-center text-pabellon-gold-400 font-bold text-2xl">
            404
          </div>
        </div>

        <h1 className="text-3xl font-bold text-pabellon-green-800 mb-4">
          Página No Encontrada
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe en el Pabellón de la Fama
          del Deporte Humacaeño.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-pabellon-green-700 to-pabellon-green-800 hover:from-pabellon-green-800 hover:to-pabellon-green-900 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Volver al Inicio
          </Link>

          <div className="flex justify-center space-x-4 text-sm">
            <Link
              href="/directorio"
              className="text-pabellon-gold-600 hover:text-pabellon-gold-700 transition-colors"
            >
              Ver Exaltados
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/museo"
              className="text-pabellon-gold-600 hover:text-pabellon-gold-700 transition-colors"
            >
              Visitar Museo
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/horario"
              className="text-pabellon-gold-600 hover:text-pabellon-gold-700 transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
