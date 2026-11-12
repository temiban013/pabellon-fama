/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import NominacionPage, { generateMetadata } from "@/app/nominacion/page";

function fijarReloj(iso: string) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(iso));
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("NominacionPage con el periodo cerrado (2026-11-09, PF-072 y PF-075)", () => {
  it("muestra el cierre del periodo y no el llamado a nominar", () => {
    fijarReloj("2026-11-09T12:00:00-04:00");
    render(<NominacionPage />);

    expect(
      screen.getAllByText(/El periodo de nominaciones cerró el 31 de agosto de 2026\./).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("¿Listo para nominar?")).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Ver detalles de la Novena Exaltación" }),
    ).toHaveLength(2);
  });

  it("no ofrece la boleta ni las instrucciones de entrega", () => {
    fijarReloj("2026-11-09T12:00:00-04:00");
    const { container } = render(<NominacionPage />);

    expect(screen.queryByText("Cómo entregar tu nominación")).not.toBeInTheDocument();
    expect(screen.queryByText("Descarga la boleta oficial")).not.toBeInTheDocument();
    expect(screen.queryByText("Cómo entregar →")).not.toBeInTheDocument();
    expect(container.querySelector("#descargar")).toBeNull();
    expect(container.querySelector("#instrucciones")).toBeNull();
    expect(container.querySelector('a[href^="#"]')).toBeNull();
  });

  it("conserva el comunicado como archivo y las categorías", () => {
    fijarReloj("2026-11-09T12:00:00-04:00");
    render(<NominacionPage />);

    expect(
      screen.getByText("Archivo: comunicado emitido para el periodo de nominaciones de 2026."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Categorías de nominación" }),
    ).toBeInTheDocument();
  });

  it("la metadata pide no indexar y describe el comunicado como archivo", () => {
    fijarReloj("2026-11-09T12:00:00-04:00");
    const metadata = generateMetadata();

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
    expect(metadata.description).toBe(
      "Nominaciones a la Novena Exaltación (2026). El periodo cerró el 31 de agosto de 2026; el comunicado oficial se conserva como archivo.",
    );
  });
});

describe("NominacionPage con el periodo activo (2026-07-01)", () => {
  it("sigue mostrando la boleta, las instrucciones y sus enlaces", () => {
    fijarReloj("2026-07-01T12:00:00-04:00");
    const { container } = render(<NominacionPage />);

    expect(screen.getByText("Cómo entregar tu nominación")).toBeInTheDocument();
    expect(screen.getByText("Descarga la boleta oficial")).toBeInTheDocument();
    expect(screen.getByText("Cómo entregar →")).toBeInTheDocument();
    expect(screen.getByText("¿Listo para nominar?")).toBeInTheDocument();
    expect(container.querySelector("#descargar")).not.toBeNull();
    expect(container.querySelector("#instrucciones")).not.toBeNull();
  });

  it("la metadata permite indexar", () => {
    fijarReloj("2026-07-01T12:00:00-04:00");
    expect(generateMetadata().robots).toMatchObject({ index: true, follow: true });
  });
});
