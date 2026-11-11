import { Hero } from "@/components/sections/Hero";
import { UltimasNoticias } from "@/components/inicio/UltimasNoticias";
import { QuickLinks } from "@/components/sections/QuickLinks";
import { MuseumShowcase } from "@/components/sections/MuseumShowcase";
import { RegistrationSection } from "@/components/sections/RegistrationSection";
import { VisibleHasta } from "@/components/exaltacion/VisibleHasta";
import { ProximaExaltacion } from "@/components/exaltacion/ProximaExaltacion";
import { ExaltacionJsonLd } from "@/components/exaltacion/ExaltacionJsonLd";
import { EXALTACION_2026 } from "@/lib/data/exaltacion-2026";
import { aniosDesdeIncorporacion, getFaseEvento } from "@/lib/exaltacion";

// Revalida a diario para que los años de historia cambien el 22 de diciembre sin deploy.
export const revalidate = 86400;

/** Año calendario actual en America/Puerto_Rico. */
function anioActualPR(ahora: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Puerto_Rico", year: "numeric" }).format(ahora),
  );
}

export default function HomePage() {
  const ahora = new Date();
  return (
    // data-pagina: globals.css oculta el aviso global de la Exaltación en Inicio (PF-065).
    // Solo importa mientras AvisoExaltacion se renderiza (fase ≠ realizada): quitar junto con él.
    <div data-pagina="inicio">
      <Hero />
      {/* JSON-LD fuera de VisibleHasta, pero solo mientras el evento no ha sido realizado (PF-072). */}
      {getFaseEvento(EXALTACION_2026, ahora) !== "realizada" && <ExaltacionJsonLd />}
      <VisibleHasta hasta={EXALTACION_2026.inicio.toISOString()}>
        <ProximaExaltacion />
      </VisibleHasta>
      <UltimasNoticias />
      <QuickLinks />
      <MuseumShowcase
        aniosHistoria={aniosDesdeIncorporacion(ahora)}
        anioActual={anioActualPR(ahora)}
      />
      <RegistrationSection />
    </div>
  );
}
