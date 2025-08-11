"use client";

import { useState } from "react";
import RegistroForm from "@/components/forms/RegistroForm";
import { useToastHelpers } from "@/components/ui/Toast";

// Esta página solo debe existir en desarrollo
export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { success, error, info, warning } = useToastHelpers();

  const addTestResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const testToasts = () => {
    success("Test Success", "Este es un mensaje de éxito");
    setTimeout(() => error("Test Error", "Este es un mensaje de error"), 1000);
    setTimeout(() => info("Test Info", "Este es un mensaje informativo"), 2000);
    setTimeout(
      () => warning("Test Warning", "Este es un mensaje de advertencia"),
      3000
    );
  };

  const testApiDirectly = async () => {
    const testData = {
      email: "test@ejemplo.com",
      nombre: "Juan Pérez Test",
      telefono: "787-123-4567",
      interes: "visitante",
      mensaje: "Test desde página de testing",
    };

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (response.ok) {
        addTestResult(`✅ API Test Exitoso: ${data.message}`);
        success("API Test", "Registro API exitoso");
      } else {
        addTestResult(`❌ API Test Falló: ${data.error}`);
        error("API Test", data.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      addTestResult(`❌ API Test Error: ${errorMsg}`);
      error("API Test", errorMsg);
    }
  };

  const testValidationError = async () => {
    const invalidData = {
      email: "email-invalido",
      nombre: "",
      interes: "visitante",
    };

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidData),
      });

      const data = await response.json();
      addTestResult(
        `🔄 Validación Test: ${response.status} - ${data.error || data.message}`
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      addTestResult(`❌ Validación Test Error: ${errorMsg}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">
          Página no disponible en producción
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Página de Testing - Registro
          </h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>⚠️ Solo para desarrollo:</strong> Esta página solo debe
              usarse durante el desarrollo y no estará disponible en producción.
            </p>
          </div>

          {/* Botones de Test */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={testToasts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Toasts
            </button>

            <button
              onClick={testApiDirectly}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test API Directo
            </button>

            <button
              onClick={testValidationError}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Validación Error
            </button>

            <button
              onClick={clearResults}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpiar Resultados
            </button>
          </div>

          {/* Resultados de Tests */}
          {testResults.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold mb-3">
                📊 Resultados de Tests:
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono bg-white p-2 rounded border"
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulario de Test */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📝 Test Formulario Básico
            </h2>
            <RegistroForm
              onSuccess={() => addTestResult("✅ Formulario: Registro exitoso")}
              className="bg-white"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📝 Test Formulario Expandido
            </h2>
            <RegistroForm
              isExpanded={true}
              onSuccess={() =>
                addTestResult("✅ Formulario Expandido: Registro exitoso")
              }
              className="bg-white"
            />
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ⚙️ Información del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Entorno:</strong> {process.env.NODE_ENV}
            </div>
            <div>
              <strong>Next.js:</strong> 15.x
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date().toLocaleString()}
            </div>
            <div>
              <strong>User Agent:</strong>{" "}
              {typeof window !== "undefined"
                ? window.navigator.userAgent.slice(0, 50) + "..."
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
