import type {
  EstadisticasDeportivasEnriquecidas,
  EstadisticasBeisbol,
  EstadisticasBaloncesto,
  EstadisticasBoxeo,
  EstadisticasAtletismo,
  EstadisticasGenerales,
} from "@/lib/types/contribucion";

interface EnrichedStatsSectionProps {
  estadisticasDeportivas?: EstadisticasDeportivasEnriquecidas;
}

const SPORT_EMOJI: Record<string, string> = {
  beisbol: "⚾",
  baloncesto: "🏀",
  boxeo: "🥊",
  atletismo: "🏃",
  otro: "🏆",
};

const SPORT_LABEL: Record<string, string> = {
  beisbol: "Béisbol",
  baloncesto: "Baloncesto",
  boxeo: "Boxeo",
  atletismo: "Atletismo",
  otro: "Deporte",
};

function StatCard({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="bg-white rounded-md p-3">
      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-sm sm:text-base font-semibold text-gray-800">{String(value)}</p>
    </div>
  );
}

function BeisbolStats({ datos }: { datos: EstadisticasBeisbol }) {
  return (
    <div className="space-y-4">
      {datos.posiciones.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Posiciones</p>
          <div className="flex flex-wrap gap-1">
            {datos.posiciones.map((pos, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {pos}
              </span>
            ))}
          </div>
        </div>
      )}

      {datos.equipos.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Equipos</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 pr-3 font-medium text-gray-600">Equipo</th>
                  <th className="text-left py-1 pr-3 font-medium text-gray-600">Años</th>
                  <th className="text-left py-1 font-medium text-gray-600">Posición</th>
                </tr>
              </thead>
              <tbody>
                {datos.equipos.map((equipo, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-1 pr-3 text-gray-800">{equipo.nombre}</td>
                    <td className="py-1 pr-3 text-gray-600">{equipo.anos}</td>
                    <td className="py-1 text-gray-600">{equipo.posicion ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {datos.bateo && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Estadísticas de Bateo</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <StatCard label="Promedio" value={datos.bateo.promedio} />
            <StatCard label="Jonrones" value={datos.bateo.jonrones} />
            <StatCard label="Carreras Impulsadas" value={datos.bateo.carrerasImpulsadas} />
            <StatCard label="Hits" value={datos.bateo.hits} />
            <StatCard label="Anotadas" value={datos.bateo.anotadas} />
          </div>
        </div>
      )}

      {datos.pitcheo && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Estadísticas de Pitcheo</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <StatCard label="Efectividad (ERA)" value={datos.pitcheo.efectividad} />
            <StatCard label="Ganadas-Perdidas" value={datos.pitcheo.ganadasPerdidas} />
            <StatCard label="Ponches" value={datos.pitcheo.ponches} />
            <StatCard label="Juegos Completos" value={datos.pitcheo.juegosCompletos} />
          </div>
        </div>
      )}

      <StatCard label="Años Activos" value={datos.anosActivos} />

      {datos.logrosDestacados && datos.logrosDestacados.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Logros Destacados</p>
          <ul className="space-y-1">
            {datos.logrosDestacados.map((logro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 bg-pabellon-gold-500 rounded-full mt-2 flex-shrink-0" />
                {logro}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BaloncestoStats({ datos }: { datos: EstadisticasBaloncesto }) {
  return (
    <div className="space-y-4">
      {datos.posiciones.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Posiciones</p>
          <div className="flex flex-wrap gap-1">
            {datos.posiciones.map((pos, i) => (
              <span key={i} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                {pos}
              </span>
            ))}
          </div>
        </div>
      )}

      {datos.equipos.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Equipos</p>
          <div className="flex flex-wrap gap-1">
            {datos.equipos.map((equipo, i) => (
              <span key={i} className="bg-orange-50 text-orange-800 px-2 py-1 rounded text-xs border border-orange-200">
                {equipo.nombre} ({equipo.anos})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard label="Promedio Puntos" value={datos.promedioPuntos} />
        <StatCard label="Promedio Rebotes" value={datos.promedioRebotes} />
        <StatCard label="Promedio Asistencias" value={datos.promedioAsistencias} />
      </div>

      {datos.torneosGanados && datos.torneosGanados.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Torneos Ganados</p>
          <ul className="space-y-1">
            {datos.torneosGanados.map((torneo, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 bg-pabellon-gold-500 rounded-full mt-2 flex-shrink-0" />
                {torneo}
              </li>
            ))}
          </ul>
        </div>
      )}

      <StatCard label="Años Activos" value={datos.anosActivos} />
    </div>
  );
}

function BoxeoStats({ datos }: { datos: EstadisticasBoxeo }) {
  return (
    <div className="space-y-4">
      {datos.categoriasPeso.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Categorías de Peso</p>
          <div className="flex flex-wrap gap-1">
            {datos.categoriasPeso.map((cat, i) => (
              <span key={i} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard label="Récord" value={datos.record} />
        <StatCard label="Nocauts" value={datos.nocauts} />
        <StatCard label="Años Activos" value={datos.anosActivos} />
      </div>

      {datos.titulosGanados && datos.titulosGanados.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Títulos Ganados</p>
          <ul className="space-y-1">
            {datos.titulosGanados.map((titulo, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 bg-pabellon-gold-500 rounded-full mt-2 flex-shrink-0" />
                {titulo}
              </li>
            ))}
          </ul>
        </div>
      )}

      {datos.peleasDestacadas && datos.peleasDestacadas.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Peleas Destacadas</p>
          <ul className="space-y-1">
            {datos.peleasDestacadas.map((pelea, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                {pelea}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AtletismoStats({ datos }: { datos: EstadisticasAtletismo }) {
  return (
    <div className="space-y-4">
      {datos.especialidades.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Especialidades</p>
          <div className="flex flex-wrap gap-1">
            {datos.especialidades.map((esp, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {esp}
              </span>
            ))}
          </div>
        </div>
      )}

      {datos.recordsPersonales && Object.keys(datos.recordsPersonales).length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Récords Personales</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(datos.recordsPersonales).map(([evento, tiempo]) => (
              <StatCard key={evento} label={evento} value={tiempo} />
            ))}
          </div>
        </div>
      )}

      {datos.medallasOlimpicas && datos.medallasOlimpicas.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Medallas Olímpicas</p>
          <ul className="space-y-1">
            {datos.medallasOlimpicas.map((medalla, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="text-yellow-500">🏅</span>
                {medalla}
              </li>
            ))}
          </ul>
        </div>
      )}

      {datos.medallasCAC && datos.medallasCAC.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Medallas Centroamericanos y del Caribe</p>
          <ul className="space-y-1">
            {datos.medallasCAC.map((medalla, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="text-yellow-500">🏅</span>
                {medalla}
              </li>
            ))}
          </ul>
        </div>
      )}

      {datos.medallasPanamericanas && datos.medallasPanamericanas.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Medallas Panamericanas</p>
          <ul className="space-y-1">
            {datos.medallasPanamericanas.map((medalla, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="text-yellow-500">🏅</span>
                {medalla}
              </li>
            ))}
          </ul>
        </div>
      )}

      <StatCard label="Años Activos" value={datos.anosActivos} />
    </div>
  );
}

function GeneralStats({ datos }: { datos: EstadisticasGenerales }) {
  return (
    <div className="space-y-4">
      <StatCard label="Especialidad" value={datos.especialidad} />

      {datos.logrosDestacados.length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Logros Destacados</p>
          <ul className="space-y-1">
            {datos.logrosDestacados.map((logro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 bg-pabellon-gold-500 rounded-full mt-2 flex-shrink-0" />
                {logro}
              </li>
            ))}
          </ul>
        </div>
      )}

      {datos.recordsPersonales && Object.keys(datos.recordsPersonales).length > 0 && (
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Récords</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(datos.recordsPersonales).map(([key, val]) => (
              <StatCard key={key} label={key} value={val} />
            ))}
          </div>
        </div>
      )}

      <StatCard label="Años Activos" value={datos.anosActivos} />
    </div>
  );
}

export function EnrichedStatsSection({ estadisticasDeportivas }: EnrichedStatsSectionProps) {
  if (!estadisticasDeportivas) return null;

  const { tipo, datos } = estadisticasDeportivas;
  const emoji = SPORT_EMOJI[tipo] ?? SPORT_EMOJI.otro;
  const label = SPORT_LABEL[tipo] ?? SPORT_LABEL.otro;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg sm:text-xl font-semibold text-pabellon-green-800 mb-3 flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        Estadísticas de {label}
      </h3>

      {tipo === "beisbol" && <BeisbolStats datos={datos as EstadisticasBeisbol} />}
      {tipo === "baloncesto" && <BaloncestoStats datos={datos as EstadisticasBaloncesto} />}
      {tipo === "boxeo" && <BoxeoStats datos={datos as EstadisticasBoxeo} />}
      {tipo === "atletismo" && <AtletismoStats datos={datos as EstadisticasAtletismo} />}
      {tipo === "otro" && <GeneralStats datos={datos as EstadisticasGenerales} />}
    </div>
  );
}
