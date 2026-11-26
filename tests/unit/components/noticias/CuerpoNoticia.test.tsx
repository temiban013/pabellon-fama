import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CuerpoNoticia } from "@/components/noticias/CuerpoNoticia";
import { cuerpoCronicaNovena2026 } from "@/data/cronicas/novena-exaltacion-2026";

// El setup global devuelve las props de next/image tal cual; aquí hace falta un <img>.
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe("CuerpoNoticia (PF-087)", () => {
  it("pinta el texto de la crónica con sus encabezados, la cita y el cierre", () => {
    render(<CuerpoNoticia bloques={cuerpoCronicaNovena2026} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Exaltados – Novena Ceremonia" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^El pasado domingo, 8 de noviembre de 2026/)).toBeInTheDocument();
    expect(screen.getByText("¡Que viva el PFDH!")).toBeInTheDocument();

    const cita = document.querySelector("blockquote");
    expect(cita).toHaveTextContent(
      "Uno de los instantes más solemnes y emotivos de la tarde fue, sin duda, el momento de la juramentación.",
    );
  });

  it("cada exaltado es una tarjeta que enlaza a su perfil, con foto y alt de nombre completo", () => {
    render(<CuerpoNoticia bloques={cuerpoCronicaNovena2026} />);

    const tarjeta = screen.getByRole("link", { name: /José M\. “Pancho” Rodríguez Castillo/ });
    expect(tarjeta).toHaveAttribute("href", "/directorio/jose-m-pancho-rodriguez-castillo");
    expect(within(tarjeta).getByText("Boxeo")).toBeInTheDocument();
    expect(within(tarjeta).getByRole("img")).toHaveAttribute(
      "alt",
      'Foto de José M. "Pancho" Rodríguez Castillo',
    );

    const perfiles = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((href) => href?.startsWith("/directorio/"));
    expect(perfiles).toHaveLength(5);
  });

  it("la lista de la Junta trae sus nueve renglones y el enlace a /junta", () => {
    render(<CuerpoNoticia bloques={cuerpoCronicaNovena2026} />);

    expect(screen.getByText("Sr. Héctor Ruiz, Vocal")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Conoce a la Junta de Directores/ })).toHaveAttribute(
      "href",
      "/junta",
    );
  });

  it("las fotos del cuerpo llevan pie y crédito", () => {
    render(<CuerpoNoticia bloques={cuerpoCronicaNovena2026} />);

    const pies = [...document.querySelectorAll("figcaption")].map((f) => f.textContent);
    expect(pies).toHaveLength(2);
    for (const pie of pies) {
      expect(pie).toMatch(/· Foto: Mario R\. Ayala$/);
    }
  });

  it("no usa dangerouslySetInnerHTML", () => {
    const fuente = readFileSync(
      join(process.cwd(), "src/components/noticias/CuerpoNoticia.tsx"),
      "utf8",
    );
    expect(fuente).not.toMatch(/dangerouslySetInnerHTML=/);
  });
});
