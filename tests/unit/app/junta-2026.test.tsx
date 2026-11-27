import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import JuntaDirectoresPage from "@/app/junta/page";
import { transformExaltadoRevista } from "@/components/directorio/DirectorioClient";
import { todosLosExaltados } from "@/data/exaltados-all";

// El setup global devuelve las props de next/image tal cual; aquí hace falta un <img>.
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe("/junta tras las respuestas del historiador (PF-088)", () => {
  it("muestra nueve miembros y, aparte, al Presidente de Honor", () => {
    render(<JuntaDirectoresPage />);
    // Las tarjetas de personas son los <h3> que empiezan por el tratamiento.
    const nombres = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent ?? "")
      .filter((texto) => /^(Sr\.|Sra\.|Prof\.) /.test(texto));

    expect(nombres).toHaveLength(10);
    expect(nombres.slice(0, 9)).toEqual([
      "Sr. Enrique (Quique) Torres Romero",
      "Sra. Miriam Lasanta",
      "Prof. Félix Báez Neris",
      "Sr. Juan Velázquez",
      "Sr. Arnaldo (Larry) Ortiz",
      "Sr. Jorge Orona",
      "Sr. Orlando J. López Rivera",
      "Sr. Héctor Ruiz",
      "Prof. Luis Reinaldo Álvarez Vázquez",
    ]);
    expect(nombres[9]).toBe("Sr. William Méndez Pagán");
  });

  it("Héctor Ruiz es Vocal, sin foto (iniciales) y sin años de servicio", () => {
    render(<JuntaDirectoresPage />);
    const tarjeta = screen
      .getByRole("heading", { level: 3, name: "Sr. Héctor Ruiz" })
      .closest("div.bg-white") as HTMLElement;

    expect(within(tarjeta).getByText("Vocal")).toBeInTheDocument();
    expect(within(tarjeta).queryByRole("img")).toBeNull();
    expect(within(tarjeta).getByText("HR")).toBeInTheDocument();
    expect(within(tarjeta).queryByText(/Presente/)).toBeNull();
    expect(
      within(tarjeta).getByText("Fotografía de la Revista de la Novena Exaltación"),
    ).toBeInTheDocument();
  });
});

describe("filtro «Fallecidos» del directorio (PF-088)", () => {
  const directorio = todosLosExaltados.map(transformExaltadoRevista);
  const fallecidos = new Set(directorio.filter((e) => e.estado === "fallecido").map((e) => e.id));

  it("incluye a los cinco que confirmó el historiador, a Papuso y a Yuyo Maldonado", () => {
    for (const id of [
      "pedro-j-davila-poupart",
      "milton-rosario-soto",
      "juan-de-dios-ortiz",
      "pedro-tolentino",
      "juan-tulier",
      "miguel-papuso-garcia-cruz",
      "julio-yuyo-maldonado",
    ]) {
      expect(fallecidos.has(id), id).toBe(true);
    }
  });

  it("incluye a los exaltados póstumos y deja fuera a los cinco de 2026", () => {
    for (const e of todosLosExaltados.filter((x) => x.categoria === "PÓSTUMO")) {
      expect(fallecidos.has(e.id), e.id).toBe(true);
    }
    for (const e of todosLosExaltados.filter((x) => x.anoExaltacion === 2026)) {
      expect(fallecidos.has(e.id), e.id).toBe(false);
    }
  });
});
