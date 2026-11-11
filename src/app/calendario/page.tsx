// src/app/calendario/page.tsx
import { EXALTACION_2026 } from "@/lib/data/exaltacion-2026";
import { getFaseEvento } from "@/lib/exaltacion";
import { VisibleHasta } from "@/components/exaltacion/VisibleHasta";
import { TarjetaProximoEvento } from "@/components/exaltacion/TarjetaProximoEvento";
import CalendarioCliente from "./CalendarioCliente";

// Revalida a diario para que la tarjeta del evento desaparezca del HTML sin deploy (PF-072).
export const revalidate = 86400;

/**
 * Server Component: decide en el servidor si se incluye la tarjeta «Próximo gran evento».
 * Una vez realizada la Novena Exaltación no se envía al HTML; `VisibleHasta` cubre el
 * hueco entre revalidaciones. La lista de eventos sigue en el componente cliente.
 */
export default function CalendarioPage() {
  const destacado =
    getFaseEvento(EXALTACION_2026, new Date()) !== "realizada" ? (
      <VisibleHasta hasta={EXALTACION_2026.inicio.toISOString()}>
        <TarjetaProximoEvento />
      </VisibleHasta>
    ) : null;

  return <CalendarioCliente destacado={destacado} />;
}
