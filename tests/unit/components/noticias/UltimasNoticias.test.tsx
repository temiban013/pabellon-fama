import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../setup/test-utils";
import { UltimasNoticias } from "@/components/inicio/UltimasNoticias";
import type { Noticia } from "@/data/noticias";

const { mockGetUltimasNoticias } = vi.hoisted(() => ({
  mockGetUltimasNoticias: vi.fn(),
}));

vi.mock("@/data/noticias", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/data/noticias")>();
  return {
    ...actual,
    getUltimasNoticias: mockGetUltimasNoticias,
  };
});

function crearNoticias(cantidad: number): Noticia[] {
  return Array.from({ length: cantidad }, (_, i) => ({
    slug: `noticia-${i + 1}`,
    titulo: `Noticia ${i + 1}`,
    fecha: `2026-07-${String(10 + i).padStart(2, "0")}`,
    categoria: "anuncio" as const,
    resumen: `Resumen de la noticia ${i + 1}.`,
    contenido: [`Contenido de la noticia ${i + 1}.`],
  }));
}

describe("UltimasNoticias", () => {
  it("no renderiza nada cuando no hay noticias (patrón VisitasDistinguidas)", () => {
    mockGetUltimasNoticias.mockReturnValue([]);

    const { container } = render(<UltimasNoticias />);

    expect(container).toBeEmptyDOMElement();
  });

  it("pide exactamente las 3 más recientes", () => {
    mockGetUltimasNoticias.mockReturnValue(crearNoticias(3));

    render(<UltimasNoticias />);

    expect(mockGetUltimasNoticias).toHaveBeenCalledWith(3);
  });

  it("renderiza encabezado y una tarjeta por noticia", () => {
    mockGetUltimasNoticias.mockReturnValue(crearNoticias(3));

    render(<UltimasNoticias />);

    expect(
      screen.getByRole("heading", { name: "Últimas Noticias" })
    ).toBeInTheDocument();
    expect(screen.getByText("Noticia 1")).toBeInTheDocument();
    expect(screen.getByText("Noticia 2")).toBeInTheDocument();
    expect(screen.getByText("Noticia 3")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("incluye enlace 'Ver todas las noticias' hacia /noticias", () => {
    mockGetUltimasNoticias.mockReturnValue(crearNoticias(1));

    render(<UltimasNoticias />);

    const enlace = screen.getByRole("link", {
      name: /Ver todas las noticias/,
    });
    expect(enlace).toHaveAttribute("href", "/noticias");
  });

  it("renderiza con una sola noticia sin errores", () => {
    mockGetUltimasNoticias.mockReturnValue(crearNoticias(1));

    render(<UltimasNoticias />);

    expect(screen.getAllByRole("article")).toHaveLength(1);
  });
});
