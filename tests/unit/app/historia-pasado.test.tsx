/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import HistoriaPage from "@/app/historia/page";
import { getTotalesExaltados } from "@/lib/exaltados-totales";

describe("HistoriaPage en pasado (PF-072)", () => {
  afterEach(cleanup);

  it("la ceremonia de 2026 figura como celebrada, con lema", () => {
    render(<HistoriaPage />);
    expect(
      screen.getByText(
        "Celebrada el domingo 8 de noviembre de 2026 en el Centro de Bellas Artes Águedo Mojica Marrero.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Lema: «Honrando nuestros atletas y propulsores»"),
    ).toBeInTheDocument();
  });

  it("la ceremonia de 2015 conserva sus cifras de época y el logro usa los totales calculados", () => {
    render(<HistoriaPage />);
    expect(
      screen.getByText(
        "Se exaltan 6 deportistas, completando 78 deportistas exaltados entre 2000 y 2015.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("78 deportistas exaltados de 2000 a 2015")).toBeInTheDocument();
    expect(
      screen.getByText("3 equipos completos honrados en las primeras 8 ceremonias"),
    ).toBeInTheDocument();
    const t = getTotalesExaltados();
    expect(
      screen.getByText(
        `En las ${t.ceremonias} ceremonias de ${t.primerAnio} a ${t.ultimoAnio}`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(`${t.personas} Deportistas Exaltados`)).toBeInTheDocument();
  });

  it("la Novena trae los cinco nombres de la clase 2026 y el total nuevo en sus detalles (PF-074)", () => {
    render(<HistoriaPage />);
    for (const nombre of [
      "Víctor M. «Vitín» Hernández López (Béisbol, Softbol)",
      "Obed Santana Acosta (Lucha Olímpica)",
      "José Escalera (Atletismo, Béisbol)",
      "José M. «Pancho» Rodríguez Castillo (Boxeo)",
      "Francisco Betancourt Ibern (propulsor: béisbol, softbol, fútbol)",
    ]) {
      expect(screen.getByText(nombre)).toBeInTheDocument();
    }
    expect(screen.getByText("83 deportistas exaltados de 2000 a 2026")).toBeInTheDocument();
  });
});
