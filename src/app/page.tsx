import Link from "next/link";
import RegistroForm from "@/components/forms/RegistroForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header temporal simplificado */}
      <header className="bg-white shadow-lg border-b-4 border-pabellon-gold-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 rounded-full p-2 shadow-lg border-2 border-pabellon-brown-700">
                <div className="w-full h-full bg-pabellon-green-800 rounded-full flex items-center justify-center text-pabellon-gold-400 font-bold text-xs leading-none text-center">
                  <div>
                    <div className="text-[8px]">PABELLÓN</div>
                    <div className="text-[6px]">FAMA</div>
                    <div className="text-[8px] mt-1">1996</div>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-pabellon-green-800">
                  Pabellón de la Fama
                </h1>
                <p className="text-sm lg:text-base text-pabellon-gold-600 font-medium">
                  Deporte Humacaeño
                </p>
              </div>
            </div>

            {/* Navegación simplificada */}
            <nav className="hidden lg:flex space-x-6">
              <Link href="/" className="nav-link">
                Inicio
              </Link>
              <Link href="#" className="nav-link">
                Junta de Directores
              </Link>
              <Link href="#" className="nav-link">
                Directorio de Exaltados
              </Link>
              <Link href="#" className="nav-link">
                Historia
              </Link>
              <Link href="#" className="nav-link">
                Enlaces
              </Link>
              <Link href="/museo" className="nav-link">
                Museo MRG
              </Link>
              <Link href="#" className="nav-link">
                Horario
              </Link>
              <Link href="#" className="nav-link">
                Calendario
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-pabellon-gold-50 via-white to-pabellon-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Título principal con marco decorativo */}
              <div className="relative inline-block mb-8">
                {/* Esquinas decorativas */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-pabellon-gold-400 rounded-tl-2xl"></div>
                <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-pabellon-gold-400 rounded-tr-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-pabellon-gold-400 rounded-bl-2xl"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-pabellon-gold-400 rounded-br-2xl"></div>

                {/* Caja principal del título */}
                <div className="bg-white px-8 py-8 lg:px-16 lg:py-12 border-2 border-dashed border-pabellon-gold-300 rounded-lg shadow-2xl">
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-pabellon-green-800 mb-4 leading-tight">
                    Pabellón de la Fama
                  </h1>
                  <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold text-pabellon-green-800 mb-6">
                    del Deporte Humacaeño
                  </h2>
                  <div className="mt-6 text-base lg:text-lg text-pabellon-gold-600 font-medium">
                    Honrando la excelencia deportiva desde 1996
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 max-w-4xl mx-auto">
                Honrando la excelencia deportiva de Humacao, Puerto Rico.
                Preservamos la historia y celebramos los logros de nuestros
                atletas más destacados a través de nuestro programa de
                exaltaciones y el Museo Manuel Rivera Guevara.
              </p>
            </div>
          </div>
        </section>

        {/* Enlaces rápidos */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="card-pabellon p-6 text-center">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-semibold text-pabellon-green-800">
                  Biblioteca
                </h3>
                <p className="text-sm text-pabellon-green-600 mt-1">
                  Recursos y documentos
                </p>
              </div>
              <div className="card-pabellon p-6 text-center">
                <div className="text-3xl mb-3">🎥</div>
                <h3 className="font-semibold text-pabellon-green-800">
                  YouTube
                </h3>
                <p className="text-sm text-pabellon-green-600 mt-1">
                  Videos y documentales
                </p>
              </div>
              <div className="card-pabellon p-6 text-center">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="font-semibold text-pabellon-green-800">Blog</h3>
                <p className="text-sm text-pabellon-green-600 mt-1">
                  Noticias y artículos
                </p>
              </div>
              <div className="card-pabellon p-6 text-center">
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="font-semibold text-pabellon-green-800">Museo</h3>
                <p className="text-sm text-pabellon-green-600 mt-1">
                  Manuel Rivera Guevara
                </p>
              </div>
              <div className="card-pabellon p-6 text-center">
                <div className="text-3xl mb-3">🕒</div>
                <h3 className="font-semibold text-pabellon-green-800">
                  Horario
                </h3>
                <p className="text-sm text-pabellon-green-600 mt-1">
                  Horas de visita
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Registro */}
        <section className="py-16 bg-gradient-to-br from-amber-100 to-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RegistroForm />
          </div>
        </section>
      </main>

      {/* Footer simple */}
      <footer className="bg-pabellon-green-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-pabellon-green-200">
            © 2025 Pabellón de la Fama del Deporte Humacaeño. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
