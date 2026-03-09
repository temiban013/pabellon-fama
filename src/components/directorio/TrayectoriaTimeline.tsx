import type { TrayectoriaExaltado, EventoCarrera } from "@/lib/types/contribucion";

interface TrayectoriaTimelineProps {
  trayectoria?: TrayectoriaExaltado;
}

const DOT_COLORS: Record<EventoCarrera["tipo"], string> = {
  inicio: "bg-pabellon-green-500",
  logro: "bg-pabellon-gold-500",
  equipo: "bg-blue-500",
  titulo: "bg-amber-500",
  retiro: "bg-gray-400",
  otro: "bg-gray-400",
};

export function TrayectoriaTimeline({ trayectoria }: TrayectoriaTimelineProps) {
  if (!trayectoria) return null;

  const hasContent =
    trayectoria.eventosCarrera.length > 0 ||
    trayectoria.inicioCarrera ||
    trayectoria.retiro ||
    trayectoria.posRetiro ||
    trayectoria.legado;

  if (!hasContent) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-4 flex items-center gap-2">
        <span className="text-xl">📅</span>
        Trayectoria Deportiva
      </h3>

      {trayectoria.inicioCarrera && (
        <p className="text-sm sm:text-base text-gray-700 mb-4 italic border-l-2 border-pabellon-green-300 pl-3">
          {trayectoria.inicioCarrera}
        </p>
      )}

      {trayectoria.eventosCarrera.length > 0 && (
        <div className="relative ml-2 sm:ml-4">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-pabellon-green-200" />

          <div className="space-y-4">
            {trayectoria.eventosCarrera.map((evento, index) => (
              <div key={index} className="relative pl-10">
                {/* Color-coded dot */}
                <div
                  className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${DOT_COLORS[evento.tipo]}`}
                />

                {/* Content */}
                <div className="bg-gray-50 rounded-md p-3">
                  <span className="text-xs sm:text-sm font-bold text-pabellon-green-700">
                    {evento.ano}
                  </span>
                  <p className="text-sm sm:text-base text-gray-800 mt-1">
                    {evento.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trayectoria.retiro && (
        <div className="mt-4 bg-gray-50 rounded-md p-3 border-l-2 border-gray-300">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Retiro</p>
          <p className="text-sm sm:text-base text-gray-800">{trayectoria.retiro}</p>
        </div>
      )}

      {trayectoria.posRetiro && (
        <div className="mt-3 bg-blue-50 rounded-md p-3 border-l-2 border-blue-300">
          <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Después del Retiro</p>
          <p className="text-sm sm:text-base text-gray-800">{trayectoria.posRetiro}</p>
        </div>
      )}

      {trayectoria.legado && (
        <div className="mt-3 bg-pabellon-gold-50 rounded-md p-3 border-l-2 border-pabellon-gold-300">
          <p className="text-xs sm:text-sm font-medium text-pabellon-gold-700 mb-1">Legado</p>
          <p className="text-sm sm:text-base text-gray-800">{trayectoria.legado}</p>
        </div>
      )}
    </div>
  );
}
