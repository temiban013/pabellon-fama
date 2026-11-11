/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import HistoriaPage from "@/app/historia/page";

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

  it("la ceremonia de 2015 y el logro de 78 deportistas usan el texto aprobado", () => {
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
    expect(screen.getByText("En las ocho ceremonias de 2000 a 2015")).toBeInTheDocument();
    expect(screen.getByText("78 Deportistas Exaltados")).toBeInTheDocument();
  });
});
