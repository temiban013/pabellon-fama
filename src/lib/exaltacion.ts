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

const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] as const;
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const;
const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
] as const;

/** Componentes calendario/hora de un instante en AST, en español y minúsculas. */
export interface PartesFechaAST {
  diaSemana: string;
  dia: number;
  mes: string;
  mesCorto: string;
  anio: number;
  /** Hora 12 h sin cero a la izquierda (1–12). */
  hora12: number;
  /** Minutos con dos dígitos. */
  minutos: string;
  periodo: "a.m." | "p.m.";
}

/**
 * Descompone un instante en AST con desplazamiento fijo (UTC−4) y nombres
 * propios en español: la salida no depende de la versión de ICU ni de la zona
 * horaria del proceso.
 */
export function partesFechaAST(fecha: Date): PartesFechaAST {
  const local = new Date(fecha.getTime() + AST_OFFSET_MS);
  const hora24 = local.getUTCHours();
  return {
    diaSemana: DIAS_SEMANA[local.getUTCDay()],
    dia: local.getUTCDate(),
    mes: MESES[local.getUTCMonth()],
    mesCorto: MESES_CORTOS[local.getUTCMonth()],
    anio: local.getUTCFullYear(),
    hora12: hora24 % 12 === 0 ? 12 : hora24 % 12,
    minutos: String(local.getUTCMinutes()).padStart(2, "0"),
    periodo: hora24 < 12 ? "a.m." : "p.m.",
  };
}

/** Primera letra en mayúscula. */
export function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** «1:00 p.m.» */
export function formatearHoraAST(fecha: Date): string {
  const { hora12, minutos, periodo } = partesFechaAST(fecha);
  return `${hora12}:${minutos} ${periodo}`;
}

/** «domingo, 8 de noviembre de 2026» (minúsculas; capitalizar si va al inicio). */
export function formatearFechaLargaAST(fecha: Date): string {
  const { diaSemana, dia, mes, anio } = partesFechaAST(fecha);
  return `${diaSemana}, ${dia} de ${mes} de ${anio}`;
}

/** «8 nov» */
export function formatearFechaCortaAST(fecha: Date): string {
  const { dia, mesCorto } = partesFechaAST(fecha);
  return `${dia} ${mesCorto}`;
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
