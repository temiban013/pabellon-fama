import Link from "next/link";

interface MuseumShowcaseProps {
  className?: string;
}

export function MuseumShowcase({ className = "" }: MuseumShowcaseProps) {
  return (
    <section
      className={`py-16 lg:py-20 bg-gradient-to-b from-pabellon-green-50 to-pabellon-green-100 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h3 className="text-3xl lg:text-4xl font-bold text-pabellon-green-800 mb-4">
            Visita Nuestro Museo
          </h3>
          <p className="text-xl text-pabellon-green-700 max-w-2xl mx-auto">
            Descubre la rica historia deportiva de Humacao en el Museo Manuel
            Rivera Guevara
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-pabellon-gold-400 to-pabellon-green-600 rounded-full"></div>
          </div>
        </div>

        {/* Imagen del museo */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative group">
            {/* Contenedor de la imagen con sombra y bordes */}
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-pabellon-gold-200">
              {/* Imagen placeholder que será reemplazada por la imagen real del museo */}
              <div className="aspect-video bg-gradient-to-r from-pabellon-green-800 to-pabellon-green-900 rounded-lg overflow-hidden relative">
                {/* Simulación de la fachada del museo basada en el PDF */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    {/* Letrero del museo */}
                    <div className="bg-black bg-opacity-20 backdrop-blur-sm px-8 py-4 rounded-lg border border-white border-opacity-30">
                      <h4 className="text-2xl lg:text-3xl font-bold mb-2">
                        MUSEO PABELLÓN DE LA FAMA
                      </h4>
                      <h5 className="text-lg lg:text-xl font-semibold">
                        DEPORTE HUMACAEÑO
                      </h5>
                      <div className="text-base lg:text-lg mt-2 text-pabellon-gold-300">
                        MANUEL RIVERA GUEVARA
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulación de puertas del museo */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/3 bg-gradient-to-t from-pabellon-brown-800 to-transparent opacity-60"></div>

                {/* Elementos decorativos */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-pabellon-gold-400 rounded-full animate-pulse"></div>
                <div className="absolute top-6 right-6 w-3 h-3 bg-pabellon-gold-300 rounded-full animate-pulse delay-100"></div>
              </div>
            </div>

            {/* Overlay con información adicional */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Link
                href="/museo"
                className="bg-white text-pabellon-green-800 px-8 py-3 rounded-lg font-semibold shadow-xl hover:bg-pabellon-gold-50 transition-all duration-200 transform scale-95 group-hover:scale-100"
              >
                Explorar Museo Virtual
              </Link>
            </div>
          </div>

          {/* Información del museo */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-pabellon-gold-200">
              <div className="text-3xl font-bold text-pabellon-gold-600 mb-2">
                150+
              </div>
              <p className="text-pabellon-green-700 font-medium">
                Atletas Exaltados
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-pabellon-gold-200">
              <div className="text-3xl font-bold text-pabellon-gold-600 mb-2">
                29
              </div>
              <p className="text-pabellon-green-700 font-medium">
                Años de Historia
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-pabellon-gold-200">
              <div className="text-3xl font-bold text-pabellon-gold-600 mb-2">
                20+
              </div>
              <p className="text-pabellon-green-700 font-medium">
                Disciplinas Deportivas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
