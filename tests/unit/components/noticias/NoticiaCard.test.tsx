import { describe, it, expect } from "vitest";
import { render, screen } from "../../../setup/test-utils";
import {
  NoticiaCard,
  CATEGORIAS_NOTICIA,
  formatearFechaNoticia,
} from "@/components/noticias/NoticiaCard";
import type { Noticia } from "@/data/noticias";

const baseNoticia: Noticia = {
  slug: "anuncio-de-prueba",
  titulo: "Anuncio de prueba",
  fecha: "2026-07-14",
  categoria: "anuncio",
  resumen: "Resumen breve del anuncio de prueba.",
  contenido: ["Primer párrafo del anuncio."],
};

const noticiaEnMemoria: Noticia = {
  slug: "en-memoria-julio-yuyo-luzunaris-maldonado",
  titulo: "En memoria de Julio «Yuyo» Maldonado",
  fecha: "2026-07-13",
  categoria: "en-memoria",
  resumen: "El Pabellón lamenta el fallecimiento de nuestro exaltado.",
  contenido: ["Párrafo conmemorativo."],
  exaltadoSlug: "julio-yuyo-maldonado",
};

describe("formatearFechaNoticia", () => {
  it("formatea fecha ISO como es-PR sin desfase de zona horaria", () => {
    expect(formatearFechaNoticia("2026-07-13")).toBe("13 de julio de 2026");
  });
});

describe("NoticiaCard", () => {
  it("renderiza título, resumen y fecha formateada", () => {
    render(<NoticiaCard noticia={baseNoticia} />);

    expect(screen.getByText("Anuncio de prueba")).toBeInTheDocument();
    expect(
      screen.getByText("Resumen breve del anuncio de prueba.")
    ).toBeInTheDocument();
    expect(screen.getByText("14 de julio de 2026")).toBeInTheDocument();
  });

  it("enlaza al detalle /noticias/[slug] con <Link>", () => {
    render(<NoticiaCard noticia={baseNoticia} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/noticias/anuncio-de-prueba");
  });

  it("incluye <time> con atributo dateTime ISO", () => {
    render(<NoticiaCard noticia={baseNoticia} />);

    const time = screen.getByText("14 de julio de 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2026-07-14");
  });

  it("muestra la insignia de categoría con estilo dorado para anuncios", () => {
    render(<NoticiaCard noticia={baseNoticia} />);

    const badge = screen.getByText("Anuncio");
    expect(badge.className).toContain("bg-pabellon-gold-100");
    expect(badge.className).toContain("text-pabellon-gold-800");
  });

  describe("variante sobria en-memoria (spec §6)", () => {
    it("renderiza insignia slate neutral 'En Memoria'", () => {
      render(<NoticiaCard noticia={noticiaEnMemoria} />);

      const badge = screen.getByText("En Memoria");
      expect(badge.className).toContain("bg-slate-200");
      expect(badge.className).toContain("text-slate-700");
    });

    it("NO usa acento dorado en ningún elemento de la tarjeta", () => {
      const { container } = render(<NoticiaCard noticia={noticiaEnMemoria} />);

      expect(container.querySelector('[class*="gold"]')).toBeNull();
    });

    it("usa titular slate en lugar de verde institucional", () => {
      render(<NoticiaCard noticia={noticiaEnMemoria} />);

      const titulo = screen.getByText("En memoria de Julio «Yuyo» Maldonado");
      expect(titulo.className).toContain("text-slate-800");
      expect(titulo.className).not.toContain("pabellon-green");
    });
  });

  it("CATEGORIAS_NOTICIA cubre las cuatro categorías del spec", () => {
    expect(Object.keys(CATEGORIAS_NOTICIA).sort()).toEqual([
      "anuncio",
      "en-memoria",
      "evento",
      "exaltacion",
    ]);
  });
});
