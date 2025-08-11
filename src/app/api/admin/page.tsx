"use client";

import { useState, useEffect } from "react";
import { type RegistroUsuario } from "@/lib/types";

interface RegistrationStats {
  total: number;
  porInteres: Record<string, number>;
  ultimaSemana: number;
  ultimoMes: number;
}

interface AdminData {
  registraciones: RegistroUsuario[];
  estadisticas: RegistrationStats;
  ultimaActualizacion: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async () => {
    if (!adminKey.trim()) {
      setError("Ingresa la clave de administrador");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/registraciones?key=${encodeURIComponent(adminKey)}`
      );
      const result = await response.json();

      if (response.ok && result.success) {
        setIsAuthenticated(true);
        setData(result.data);
      } else {
        setError(result.error || "Clave incorrecta");
      }
    } catch (err) {
      setError("Error conectando con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/registraciones?key=${encodeURIComponent(adminKey)}`
      );
      const result = await response.json();

      if (response.ok && result.success) {
        setData(result.data);
      } else {
        setError("Error actualizando datos");
      }
    } catch (err) {
      setError("Error conectando con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-PR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInteresLabel = (interes: string) => {
    const labels: Record<string, string> = {
      general: "Interés General",
      visitante: "Visitante del Museo",
      investigador: "Investigador/Estudiante",
      voluntario: "Voluntario",
    };
    return labels[interes] || interes;
  };

  const getInteresColor = (interes: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-100 text-blue-800",
      visitante: "bg-green-100 text-green-800",
      investigador: "bg-purple-100 text-purple-800",
      voluntario: "bg-orange-100 text-orange-800",
    };
    return colors[interes] || "bg-gray-100 text-gray-800";
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="w-20 h-20 bg-gradient-to-br from-pabellon-gold-400 to-pabellon-gold-600 rounded-full p-3 shadow-lg border-2 border-pabellon-brown-700 mx-auto mb-6">
              <div className="w-full h-full bg-pabellon-green-800 rounded-full flex items-center justify-center text-pabellon-gold-400 font-bold text-sm">
                ADMIN
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Panel Administrativo
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Pabellón de la Fama del Deporte Humacaeño
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="admin-key" className="sr-only">
                Clave de administrador
              </label>
              <input
                id="admin-key"
                name="admin-key"
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && authenticate()}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-pabellon-gold-500 focus:border-pabellon-gold-500 focus:z-10 sm:text-sm"
                placeholder="Clave de administrador"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={authenticate}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pabellon-green-700 hover:bg-pabellon-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pabellon-green-500 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Acceder"}
            </button>

            <div className="text-xs text-gray-500 text-center mt-4">
              <p>
                Clave por defecto:{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  pabellon-admin-2025
                </code>
              </p>
              <p className="mt-1">Para Kike y Felix del Pabellón</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Registraciones
              </h1>
              <p className="text-gray-600">
                Panel administrativo del Pabellón de la Fama
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshData}
                disabled={loading}
                className="bg-pabellon-green-600 hover:bg-pabellon-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Cargando..." : "🔄 Actualizar"}
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {data && (
          <div className="px-4 sm:px-0">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl">👥</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Registraciones
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {data.estadisticas.total}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl">📅</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Esta Semana
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {data.estadisticas.ultimaSemana}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl">📊</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Este Mes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {data.estadisticas.ultimoMes}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl">🔄</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Última Actualización
                        </dt>
                        <dd className="text-xs font-medium text-gray-900">
                          {formatDate(data.ultimaActualizacion)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución por interés */}
            <div className="bg-white shadow rounded-lg mb-8 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📈 Distribución por Tipo de Interés
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.estadisticas.porInteres).map(
                  ([interes, count]) => (
                    <div key={interes} className="text-center">
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getInteresColor(
                          interes
                        )}`}
                      >
                        {getInteresLabel(interes)}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-2">
                        {count}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Lista de registraciones */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  📝 Registraciones Recientes
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Lista completa de personas registradas (más recientes primero)
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {data.registraciones.map((registro) => (
                  <li key={registro.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {registro.nombre}
                          </p>
                          <p className="text-sm text-gray-500">
                            {registro.email}
                          </p>
                          {registro.telefono && (
                            <p className="text-sm text-gray-500">
                              📞 {registro.telefono}
                            </p>
                          )}
                          {registro.mensaje && (
                            <p className="text-sm text-gray-600 italic mt-1">
                              💬 "{registro.mensaje}"
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0 text-right">
                          <div
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInteresColor(
                              registro.interes
                            )}`}
                          >
                            {getInteresLabel(registro.interes)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(registro.fechaRegistro!.toString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {data.registraciones.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No hay registraciones aún</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
