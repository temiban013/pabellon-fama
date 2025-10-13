"use client";

import { useState } from "react";
import { FotoHistorica } from "@/lib/types/revista";
import { PhotoCard } from "./PhotoCard";
import { Lightbox } from "./Lightbox";
import { Camera } from "lucide-react";

interface PhotoGridProps {
  fotos: FotoHistorica[];
  compact?: boolean;
}

export function PhotoGrid({ fotos, compact = false }: PhotoGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePhotoClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < fotos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (fotos.length === 0) {
    return (
      <div className="text-center py-16">
        <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-500 mb-2">
          No se encontraron fotografías
        </p>
        <p className="text-sm text-gray-400">
          Prueba ajustando los filtros para ver más resultados
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={compact
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      }>
        {fotos.map((foto, index) => (
          <PhotoCard
            key={foto.id}
            foto={foto}
            onClick={() => handlePhotoClick(index)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          foto={fotos[selectedIndex]}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedIndex < fotos.length - 1}
          hasPrev={selectedIndex > 0}
        />
      )}
    </>
  );
}
