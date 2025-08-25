"use client";

interface GoogleMapProps {
  address: string;
  className?: string;
}

export default function GoogleMap({ 
  address, 
  className = ""
}: GoogleMapProps) {
  const encodedAddress = encodeURIComponent(address);

  const handleDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(directionsUrl, '_blank');
  };

  const handleViewOnMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-pabellon-gold-50 border-2 border-pabellon-gold-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <div className="text-4xl mb-2">🏛️</div>
          <h3 className="text-lg font-semibold text-pabellon-green-700 mb-2">
            Museo Manuel Rivera Guevara
          </h3>
          <p className="text-sm text-pabellon-green-600 mb-4">
            <strong>Ubicación:</strong><br />
            {address}
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleViewOnMaps}
            className="btn-pabellon w-full"
          >
            🗺️ Ver en Google Maps
          </button>
          
          <button
            onClick={handleDirections}
            className="btn-secondary w-full"
          >
            🧭 Cómo llegar
          </button>
          
          <div className="text-xs text-pabellon-green-500">
            Centro Cultural Dra. Antonia Sáez<br />
            Humacao, Puerto Rico
          </div>
        </div>
      </div>
    </div>
  );
}