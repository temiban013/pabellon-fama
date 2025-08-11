"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface FormData {
  email: string;
  nombre: string;
  interes: string;
}

interface RegistrationSectionProps {
  className?: string;
}

export function RegistrationSection({
  className = "",
}: RegistrationSectionProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    nombre: "",
    interes: "general",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de envío - aquí conectarías con tu backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setFormData({ email: "", nombre: "", interes: "general" });
    } catch (error) {
      console.error("Error al registrar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
              onClick={() => setIsSubmitted(false)}
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
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border-4 border-pabellon-gold-300 relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-pabellon-green-100 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pabellon-gold-100 rounded-full translate-x-20 translate-y-20 opacity-50"></div>

          <div className="relative">
            {/* Título principal - exacto del PDF */}
            <h3 className="text-2xl lg:text-3xl font-bold text-pabellon-green-800 mb-6 tracking-wide">
              COMUNÍCATE CON NOSOTROS
            </h3>

            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Mantente informado sobre nuestras actividades, eventos especiales,
              ceremonias de exaltación y nuevas incorporaciones al Pabellón de
              la Fama.
            </p>

            {/* Formulario de registro */}
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-pabellon-green-700 mb-2 text-left"
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-pabellon-green-700 mb-2 text-left"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="interes"
                  className="block text-sm font-medium text-pabellon-green-700 mb-2 text-left"
                >
                  Área de Interés
                </label>
                <select
                  id="interes"
                  name="interes"
                  value={formData.interes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pabellon-gold-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="general">Información General</option>
                  <option value="eventos">Eventos y Ceremonias</option>
                  <option value="museo">Visitas al Museo</option>
                  <option value="historia">Historia del Deporte</option>
                  <option value="voluntario">
                    Oportunidades de Voluntariado
                  </option>
                </select>
              </div>

              {/* Botón de registro - exacto del PDF */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pabellon-green-700 to-pabellon-green-800 hover:from-pabellon-green-800 hover:to-pabellon-green-900 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  "Regístrate aquí"
                )}
              </button>

              <p className="text-sm text-gray-600 mt-4">
                Respetamos tu privacidad. No compartimos tu información con
                terceros.
              </p>
            </form>

            {/* Información adicional */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="bg-pabellon-green-50 p-4 rounded-lg border border-pabellon-green-200">
                <h4 className="font-semibold text-pabellon-green-800 mb-2">
                  📧 Newsletter Mensual
                </h4>
                <p className="text-sm text-pabellon-green-700">
                  Recibe noticias sobre nuevos exaltados y eventos especiales.
                </p>
              </div>
              <div className="bg-pabellon-gold-50 p-4 rounded-lg border border-pabellon-gold-200">
                <h4 className="font-semibold text-pabellon-green-800 mb-2">
                  🎯 Eventos Exclusivos
                </h4>
                <p className="text-sm text-pabellon-green-700">
                  Invitaciones prioritarias a ceremonias y actividades
                  especiales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
