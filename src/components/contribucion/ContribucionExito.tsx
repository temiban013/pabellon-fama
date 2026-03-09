// components/contribucion/ContribucionExito.tsx
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface ContribucionExitoProps {
  onReset: () => void;
}

export default function ContribucionExito({ onReset }: ContribucionExitoProps) {
  return (
    <div className="text-center py-12 px-6">
      <CheckCircleIcon className="w-16 h-16 text-pabellon-green-600 mx-auto mb-4" />

      <h3 className="text-2xl font-bold text-pabellon-green-800 mb-3">
        &#161;Contribuci&#243;n Enviada!
      </h3>

      <p className="text-gray-700 mb-2 text-lg">
        Gracias por ayudar a enriquecer la historia de nuestros exaltados.
      </p>

      <p className="text-gray-500 mb-8">
        La Junta de Directores revisar&#225; tu contribuci&#243;n y la
        integrar&#225; al perfil del exaltado si es verificada.
      </p>

      <button
        onClick={onReset}
        className="bg-gradient-to-r from-pabellon-gold-500 to-pabellon-gold-600 hover:from-pabellon-gold-600 hover:to-pabellon-gold-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Enviar otra contribuci&#243;n
      </button>
    </div>
  );
}
