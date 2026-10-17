/**
 * Funciones puras de la Novena Exaltación (PF-065).
 * Todas evalúan el día calendario en America/Puerto_Rico (AST, UTC−4 fijo,
 * sin horario de verano), sin depender de la zona horaria del proceso.
 */

import type { ExaltacionEvento } from "@/lib/data/exaltacion-2026";
import type { PeriodoNominacion } from "@/lib/data/nominacion-2026";
import type { EventoSerializado } from "@/lib/types";
import { PABELLON_CONSTANTS } from "@/lib/utils";

export type FaseEvento = "proxima" | "hoy" | "realizada";
export type FaseNominacion = "pre-apertura" | "activo" | "cerrado";

/** Puerto Rico es UTC−4 todo el año. */
const AST_OFFSET_MS = -4 * 60 * 60 * 1000;

/** Día calendario "YYYY-MM-DD" de un instante, en AST. */
function diaAST(fecha: Date): string {
  return new Date(fecha.getTime() + AST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * Día calendario AST de `EventoSerializado.fecha`: puede ser "YYYY-MM-DD"
 * (todo el día; ya es el día local) o un ISO completo (evento con hora).
 */
function diaASTDeFechaSerializada(fecha: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  return diaAST(new Date(fecha));
}

export function getFaseEvento(
  evento: Pick<ExaltacionEvento, "inicio">,
  ahora: Date,
): FaseEvento {
  const diaEvento = diaAST(evento.inicio);
  const diaAhora = diaAST(ahora);
  if (diaAhora < diaEvento) return "proxima";
  if (diaAhora === diaEvento) return "hoy";
  return "realizada";
}

/**
 * Quita de la lista (Google Calendar) las ceremonias del mismo día AST que el
 * evento destacado. Conserva otros tipos ese día y ceremonias de otros días.
 */
export function excluirDuplicadoDestacado(
  eventos: readonly EventoSerializado[],
  evento: Pick<ExaltacionEvento, "inicio">,
): EventoSerializado[] {
  const diaEvento = diaAST(evento.inicio);
  return eventos.filter(
    (e) =>
      !(e.tipo === "ceremonia" && diaASTDeFechaSerializada(e.fecha) === diaEvento),
  );
}

export function getFaseNominacion(
  periodo: PeriodoNominacion,
  ahora: Date,
): FaseNominacion {
  if (ahora < periodo.apertura) return "pre-apertura";
  if (ahora < periodo.cierre) return "activo";
  return "cerrado";
}

/** Años cumplidos desde la incorporación (1998-12-22), evaluados en AST. */
export function aniosDesdeIncorporacion(ahora: Date): number {
  const [anioInc, mesInc, diaInc] = PABELLON_CONSTANTS.FECHA_INCORPORACION.split("-").map(Number);
  const [anio, mes, dia] = diaAST(ahora).split("-").map(Number);
  let anios = anio - anioInc;
  if (mes < mesInc || (mes === mesInc && dia < diaInc)) anios -= 1;
  return anios;
}
