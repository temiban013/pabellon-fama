import { User, Megaphone, Mic } from 'lucide-react';
import { NOMINACION_2026 } from '@/lib/data/nominacion-2026';

interface CategoriaInfo {
  nombre: string;
  icono: typeof User;
  descripcion: string;
}

// Partial<Record<>> so TypeScript forces a null check at the lookup site.
// If a new category is added to NOMINACION_2026.categorias without a matching
// entry here, that card silently does not render rather than crashing at runtime.
const categoriasInfo: Partial<Record<string, CategoriaInfo>> = {
  Atleta: {
    nombre: 'Atleta',
    icono: User,
    descripcion:
      'Hombres y mujeres cuyo desempeño deportivo destacado en Humacao o representando a Humacao merece reconocimiento permanente.',
  },
  Propulsor: {
    nombre: 'Propulsor',
    icono: Megaphone,
    descripcion:
      'Personas que han impulsado el deporte humacaeño desde roles de organización, mentoría, coaching o gestión.',
  },
  'Cronista deportivo': {
    nombre: 'Cronista deportivo',
    icono: Mic,
    descripcion:
      'Periodistas, narradores y comentaristas que han documentado y difundido el deporte humacaeño con rigor y pasión.',
  },
};

export function CategoriasGrid() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-3">
          Categorías de nominación
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Tres caminos para honrar la trayectoria deportiva humacaeña.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NOMINACION_2026.categorias.map((categoria) => {
            const info = categoriasInfo[categoria];
            if (!info) return null;
            const Icon = info.icono;

            return (
              <div
                key={categoria}
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow border-t-4 border-orange-500"
              >
                <Icon
                  className="h-12 w-12 text-orange-600 mx-auto mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  {info.nombre}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {info.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
