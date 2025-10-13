import Link from "next/link";
import Image from "next/image";

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

        {/* Imagen real del museo */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative group">
            {/* Contenedor de la imagen con sombra y bordes */}
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-pabellon-gold-200">
              {/* Imagen real del museo */}
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src="/images/museo/fachada-museo.jpg"
                  alt="Fachada del Museo Pabellón de la Fama del Deporte Humacaeño Manuel Rivera Guevara"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />

                {/* Badge del museo en la esquina */}
                <div className="absolute top-4 left-4 bg-pabellon-green-800 bg-opacity-90 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                  <span className="block">Museo Manuel</span>
                  <span className="block">Rivera Guevara</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del museo */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-pabellon-gold-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-pabellon-gold-600 mb-2">
                81
              </div>
              <p className="text-pabellon-green-700 font-medium">
                Atletas Exaltados
              </p>
              <p className="text-sm text-pabellon-green-600 mt-1">Desde 1996</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-pabellon-gold-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-pabellon-gold-600 mb-2">
                29
              </div>
              <p className="text-pabellon-green-700 font-medium">
                Años de Historia
              </p>
              <p className="text-sm text-pabellon-green-600 mt-1">
                1996 - 2025
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-pabellon-gold-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-pabellon-gold-600 mb-2">
                17
              </div>
              <p className="text-pabellon-green-700 font-medium">
                Disciplinas Deportivas
              </p>
              <p className="text-sm text-pabellon-green-600 mt-1">
                Representadas
              </p>
            </div>
          </div>

          {/* Call to action adicional */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-pabellon-green-50 to-pabellon-gold-50 rounded-2xl p-6 border border-pabellon-gold-200">
              <h4 className="text-lg font-semibold text-pabellon-green-800 mb-3">
                🎯 Visita Nuestro Museo
              </h4>
              <p className="text-pabellon-green-700 mb-4 max-w-2xl mx-auto">
                Conoce la rica tradición deportiva humacaeña en nuestro museo físico
              </p>
              <div className="flex justify-center">
                <Link
                  href="/horario"
                  className="inline-flex items-center justify-center px-6 py-3 bg-pabellon-green-700 text-white font-medium rounded-lg hover:bg-pabellon-green-800 transition-colors duration-200"
                >
                  <span className="mr-2">🕒</span>
                  Ver Horarios de Visita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
