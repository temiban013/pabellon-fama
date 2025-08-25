'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Trophy, Calendar, MapPin, User, Medal, Star } from 'lucide-react';

interface ExaltadoDetailProps {
  exaltado: {
    id: string;
    nombre: string;
    nombreCompleto: string;
    name: string;
    deporte: string[];
    sport: string;
    categoria: string;
    anoExaltacion: number;
    yearInducted: number;
    exaltacion?: string;
    biografia: string;
    biography: string;
    foto?: string;
    photo?: string;
    fechaNacimiento?: string | null;
    fechaFallecimiento?: string | null;
    lugarNacimiento?: string | null;
    apodo?: string | null;
    logros?: string[];
    achievements?: string[];
    reconocimientos?: string[];
    estado: 'activo' | 'fallecido';
    slug: string;
  };
}

export function ExaltadoDetail({ exaltado }: ExaltadoDetailProps) {
  const [imageError, setImageError] = useState(false);
  
  const imageSrc = exaltado.foto || exaltado.photo || '/images/default-athlete.jpg';
  const displayName = exaltado.nombreCompleto || exaltado.name;
  const displayBio = exaltado.biografia || exaltado.biography;
  const displaySport = exaltado.deporte?.join(', ') || exaltado.sport;
  const displayYear = exaltado.anoExaltacion || exaltado.yearInducted;
  const displayAchievements = exaltado.logros || exaltado.achievements || [];
  const displayRecognitions = exaltado.reconocimientos || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/directorio" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver al Directorio
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Imagen */}
            <div className="md:w-1/3 bg-gray-100">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={imageError ? '/images/default-athlete.jpg' : imageSrc}
                  alt={displayName}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>

            {/* Información */}
            <div className="md:w-2/3 p-6 md:p-8">
              {/* Encabezado */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {displayName}
                </h1>
                {exaltado.apodo && (
                  <p className="text-lg text-gray-600 italic">&ldquo;{exaltado.apodo}&rdquo;</p>
                )}
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Trophy className="w-4 h-4 mr-1" />
                    {displaySport}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Calendar className="w-4 h-4 mr-1" />
                    Exaltado {displayYear}
                  </span>
                  {exaltado.exaltacion && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <Star className="w-4 h-4 mr-1" />
                      {exaltado.exaltacion}
                    </span>
                  )}
                </div>
              </div>

              {/* Información personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {exaltado.fechaNacimiento && (
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                      <p className="font-medium">{exaltado.fechaNacimiento}</p>
                    </div>
                  </div>
                )}
                {exaltado.lugarNacimiento && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Lugar de Nacimiento</p>
                      <p className="font-medium">{exaltado.lugarNacimiento}</p>
                    </div>
                  </div>
                )}
                {exaltado.fechaFallecimiento && (
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Fallecimiento</p>
                      <p className="font-medium">{exaltado.fechaFallecimiento}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Categoría</p>
                    <p className="font-medium capitalize">{exaltado.categoria.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Biografía */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Biografía</h2>
                <p className="text-gray-700 leading-relaxed">{displayBio}</p>
              </div>

              {/* Logros */}
              {displayAchievements.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <Medal className="w-5 h-5 mr-2 text-yellow-500" />
                    Logros Destacados
                  </h2>
                  <ul className="space-y-2">
                    {displayAchievements.map((logro, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{logro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reconocimientos */}
              {displayRecognitions.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Reconocimientos
                  </h2>
                  <ul className="space-y-2">
                    {displayRecognitions.map((reconocimiento, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">{reconocimiento}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}