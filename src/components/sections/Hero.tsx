import Link from "next/link";

interface HeroProps {
  className?: string;
}

export function Hero({ className = "" }: HeroProps) {
  return (
    <section
      className={`relative py-16 lg:py-24 bg-gradient-to-br from-pabellon-gold-50 via-white to-pabellon-green-50 ${className}`}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-pabellon-gold-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pabellon-green-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Título principal con marco decorativo exacto del PDF */}
          <div className="relative inline-block mb-8">
            {/* Esquinas decorativas del marco */}
            <div className="absolute -top-6 -left-6 w-12 h-12">
              <div className="w-full h-full border-t-4 border-l-4 border-pabellon-gold-400 rounded-tl-2xl"></div>
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-pabellon-gold-300 rounded-tl-lg"></div>
            </div>
            <div className="absolute -top-6 -right-6 w-12 h-12">
              <div className="w-full h-full border-t-4 border-r-4 border-pabellon-gold-400 rounded-tr-2xl"></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-pabellon-gold-300 rounded-tr-lg"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12">
              <div className="w-full h-full border-b-4 border-l-4 border-pabellon-gold-400 rounded-bl-2xl"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-pabellon-gold-300 rounded-bl-lg"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12">
              <div className="w-full h-full border-b-4 border-r-4 border-pabellon-gold-400 rounded-br-2xl"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-pabellon-gold-300 rounded-br-lg"></div>
            </div>

            {/* Caja principal del título */}
            <div className="bg-white px-8 py-8 lg:px-16 lg:py-12 border-2 border-dashed border-pabellon-gold-300 rounded-lg shadow-2xl relative">
              {/* Título principal exacto del PDF */}
              <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-pabellon-green-800 mb-4 leading-tight">
                El Pabellón de la Fama
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold text-pabellon-green-800 mb-6">
                del Deporte Humacaeño
              </h2>

              <div className="mt-6 text-base lg:text-lg text-pabellon-gold-600 font-medium">
                Honrando la excelencia deportiva desde 1996
              </div>

              {/* Decoración adicional */}
              <div className="mt-4 flex justify-center">
                <div className="w-24 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="max-w-4xl mx-auto">
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
              Honrando la excelencia deportiva de Humacao, Puerto Rico. Un lugar
              sagrado donde se preserva la historia y se celebran los logros de
              nuestros atletas más destacados.
            </p>

            {/* CTAs principales */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/directorio"
                className="btn-pabellon inline-flex items-center justify-center min-w-[200px]"
              >
                Ver Exaltados
              </Link>
              <Link
                href="/museo"
                className="bg-white border-2 border-pabellon-green-700 text-pabellon-green-700 hover:bg-pabellon-green-700 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center min-w-[200px]"
              >
                Visitar Museo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
