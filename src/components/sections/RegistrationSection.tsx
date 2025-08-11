"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import RegistroForm from "@/components/forms/RegistroForm";

interface RegistrationSectionProps {
  className?: string;
}

export function RegistrationSection({
  className = "",
}: RegistrationSectionProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowSuccessMessage(true);
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  if (showSuccessMessage) {
    return (
      <section
        className={`py-16 bg-gradient-to-br from-pabellon-gold-100 to-pabellon-gold-200 ${className}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border-4 border-pabellon-gold-300">
            <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h3 className="text-2xl lg:text-3xl font-bold text-pabellon-green-800 mb-4">
              ¡Registro Exitoso!
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Gracias por tu interés en el Pabellón de la Fama del Deporte
              Humacaeño. Te mantendremos informado sobre nuestras actividades y
              eventos.
            </p>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-pabellon-gold-600 hover:text-pabellon-gold-700 font-medium underline transition-colors"
            >
              Registrar otra persona
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-16 bg-gradient-to-br from-pabellon-gold-100 to-pabellon-gold-200 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Elementos decorativos */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-pabellon-green-100 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pabellon-gold-100 rounded-full translate-x-20 translate-y-20 opacity-50"></div>

          <RegistroForm
            onSuccess={handleRegistrationSuccess}
            className="relative z-10"
          />
        </div>
      </div>
    </section>
  );
}
