"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Calendar, BookOpen, Trophy } from "lucide-react";
import {
  getAllFotosHistoricas,
  getRevistasConFotos,
  getDecadasDisponibles,
  getDeportesConFotos,
} from "@/data/fotos-historicas";
import { PhotoGrid } from "@/components/galeria/PhotoGrid";
import { FilterBar } from "@/components/galeria/FilterBar";

export default function GaleriaHistoricaPage() {
  const [selectedRevista, setSelectedRevista] = useState<number | null>(null);
  const [selectedDecada, setSelectedDecada] = useState<number | null>(null);
  const [selectedDeporte, setSelectedDeporte] = useState<string | null>(null);

  const allFotos = useMemo(() => getAllFotosHistoricas(), []);
  const revistas = useMemo(() => getRevistasConFotos(), []);
  const decadas = useMemo(() => getDecadasDisponibles(), []);
  const deportes = useMemo(() => getDeportesConFotos(), []);

  // Filter photos based on selected filters
  const filteredFotos = useMemo(() => {
    return allFotos.filter((foto) => {
      if (selectedRevista && foto.revistaOrigen !== selectedRevista) return false;
      if (selectedDecada && foto.año) {
        const fotoDecada = Math.floor(foto.año / 10) * 10;
        if (fotoDecada !== selectedDecada) return false;
      }
      if (selectedDeporte && foto.deporteRelacionado?.toLowerCase() !== selectedDeporte.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [allFotos, selectedRevista, selectedDecada, selectedDeporte]);

  const handleReset = () => {
    setSelectedRevista(null);
    setSelectedDecada(null);
    setSelectedDeporte(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pabellon-green-800 via-pabellon-green-700 to-pabellon-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/enlaces"
            className="inline-flex items-center text-pabellon-green-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Enlaces
          </Link>

          {/* Title Section */}
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-pabellon-gold-400 p-4 rounded-lg">
              <Camera className="h-8 w-8 text-pabellon-green-900" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Galería Histórica
              </h1>
              <p className="text-xl text-pabellon-green-100 max-w-3xl leading-relaxed">
                Explora nuestra colección de fotografías históricas del deporte humacaeño.
                Momentos inolvidables, equipos legendarios y deportistas que marcaron época.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Camera className="h-6 w-6 mb-2 text-pabellon-gold-400" />
              <div className="text-2xl font-bold">{allFotos.length}</div>
              <div className="text-sm text-pabellon-green-200">Fotografías</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <BookOpen className="h-6 w-6 mb-2 text-pabellon-gold-400" />
              <div className="text-2xl font-bold">{revistas.length}</div>
              <div className="text-sm text-pabellon-green-200">Revistas</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Calendar className="h-6 w-6 mb-2 text-pabellon-gold-400" />
              <div className="text-2xl font-bold">{decadas.length}</div>
              <div className="text-sm text-pabellon-green-200">Décadas</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Trophy className="h-6 w-6 mb-2 text-pabellon-gold-400" />
              <div className="text-2xl font-bold">{deportes.length}</div>
              <div className="text-sm text-pabellon-green-200">Deportes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <FilterBar
          selectedRevista={selectedRevista}
          selectedDecada={selectedDecada}
          selectedDeporte={selectedDeporte}
          revistas={revistas}
          decadas={decadas}
          deportes={deportes}
          onRevistaChange={setSelectedRevista}
          onDecadaChange={setSelectedDecada}
          onDeporteChange={setSelectedDeporte}
          onReset={handleReset}
          totalFotos={allFotos.length}
          filteredCount={filteredFotos.length}
        />

        {/* Photo Grid */}
        <PhotoGrid fotos={filteredFotos} />

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Sobre Esta Colección
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-pabellon-green-800 mb-3">
                📸 Fotografías Históricas
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Esta galería presenta fotografías originales de las revistas conmemorativas
                del Pabellón de la Fama. Cada imagen captura momentos únicos de la historia
                deportiva de Humacao, desde la década de 1930 hasta la actualidad.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-pabellon-green-800 mb-3">
                📚 Contexto Histórico
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Las fotografías provienen de las 8 revistas publicadas entre 2000 y 2015,
                documentando las ceremonias de exaltación y preservando la memoria de equipos
                legendarios, deportistas destacados y momentos memorables del deporte humacaeño.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/revistas"
              className="inline-flex items-center gap-2 text-pabellon-green-700 hover:text-pabellon-green-800 font-semibold transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              Explorar Revistas Completas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
