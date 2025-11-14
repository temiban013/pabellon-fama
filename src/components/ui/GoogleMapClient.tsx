"use client";

import dynamic from "next/dynamic";

// Lazy load GoogleMap component for better performance
// Must be in a Client Component to use ssr: false
const GoogleMap = dynamic(() => import("@/components/ui/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

export function GoogleMapClient() {
  return (
    <GoogleMap address="Centro Cultural Dra. Antonia Sáez, Humacao, Puerto Rico 00791" />
  );
}
