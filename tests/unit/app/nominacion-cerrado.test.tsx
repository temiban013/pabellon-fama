/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import NominacionPage from "@/app/nominacion/page";

describe("NominacionPage con el periodo cerrado (2026-10-17)", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("muestra el cierre del periodo y no el llamado a nominar", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-17T12:00:00-04:00"));

    render(<NominacionPage />);

    expect(
      screen.getAllByText(/El periodo de nominaciones cerró el 31 de agosto de 2026\./).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("¿Listo para nominar?")).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Ver detalles de la Novena Exaltación" }),
    ).toHaveLength(2);
  });
});
