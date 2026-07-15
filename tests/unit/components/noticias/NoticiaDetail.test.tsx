import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../setup/test-utils";
import type { Noticia } from "@/data/noticias";
import NoticiaPage, {
  generateStaticParams,
} from "@/app/noticias/[slug]/page";

const { fixtures } = vi.hoisted(() => {
  const fixtures = [
    {
      slug: "en-memoria-julio-yuyo-luzunaris-maldonado",
      titulo: "En memoria de Julio «Yuyo» Maldonado",
      fecha: "2026-07-13",
      categoria: "en-memoria",
      resumen: "El Pabellón lamenta el fallecimiento de nuestro exaltado.",
      contenido: [
        "Primer párrafo conmemorativo.",
        "Segundo párrafo conmemorativo.",
      ],
      exaltadoSlug: "julio-yuyo-maldonado",
      actualizaciones: [
        {
          fecha: "2026-07-14",
          texto: "Información adicional publicada por la Junta.",
        },
      ],
    },
    {
      slug: "anuncio-de-prueba",
      titulo: "Anuncio de prueba",
      fecha: "2026-07-10",
      categoria: "anuncio",
      resumen: "Resumen breve del anuncio de prueba.",
      contenido: ["Contenido del anuncio."],
    },
  ] as const;
  return { fixtures };
});

vi.mock("@/data/noticias", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/data/noticias")>();
  return {
    ...actual,
    getNoticias: () => fixtures,
    getNoticiaBySlug: (slug: string) =>
      fixtures.find((noticia) => noticia.slug === slug),
  };
});

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const enMemoria = fixtures[0] as Noticia;

async function renderDetalle(slug: string) {
  const ui = await NoticiaPage({ params: Promise.resolve({ slug }) });
  return render(ui);
}

describe("NoticiaPage (detalle /noticias/[slug])", () => {
  it("generateStaticParams devuelve un param por noticia publicada", () => {
    expect(generateStaticParams()).toEqual([
      { slug: "en-memoria-julio-yuyo-luzunaris-maldonado" },
      { slug: "anuncio-de-prueba" },
    ]);
  });

  it("renderiza título como h1 y párrafos del contenido como texto", async () => {
    await renderDetalle(enMemoria.slug);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "En memoria de Julio «Yuyo» Maldonado",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Primer párrafo conmemorativo.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Segundo párrafo conmemorativo.")
    ).toBeInTheDocument();
  });

  it("muestra insignias de categoría y fecha es-PR", async () => {
    await renderDetalle(enMemoria.slug);

    expect(screen.getByText("En Memoria")).toBeInTheDocument();
    expect(screen.getByText("13 de julio de 2026")).toBeInTheDocument();
  });

  describe("variante sobria en-memoria (spec §6)", () => {
    it("la insignia usa slate neutral", async () => {
      await renderDetalle(enMemoria.slug);

      const badge = screen.getByText("En Memoria");
      expect(badge.className).toContain("bg-slate-200");
      expect(badge.className).toContain("text-slate-700");
    });

    it("NO usa acento dorado en el artículo", async () => {
      const { container } = await renderDetalle(enMemoria.slug);

      expect(
        container.querySelector('article [class*="gold"]')
      ).toBeNull();
    });
  });

  it("renderiza el bloque de actualizaciones con fecha es-PR", async () => {
    await renderDetalle(enMemoria.slug);

    expect(
      screen.getByRole("heading", { name: "Actualizaciones" })
    ).toBeInTheDocument();
    expect(screen.getByText("14 de julio de 2026:")).toBeInTheDocument();
    expect(
      screen.getByText(/Información adicional publicada por la Junta\./)
    ).toBeInTheDocument();
  });

  it("enlaza al perfil del directorio con el id vivo (D3)", async () => {
    await renderDetalle(enMemoria.slug);

    const crossLink = screen.getByRole("link", {
      name: /Ver su perfil en el Directorio de Exaltados/,
    });
    expect(crossLink).toHaveAttribute(
      "href",
      "/directorio/julio-yuyo-maldonado"
    );
  });

  it("no muestra cross-link ni actualizaciones cuando la noticia no los tiene", async () => {
    await renderDetalle("anuncio-de-prueba");

    expect(
      screen.queryByRole("link", {
        name: /Ver su perfil en el Directorio de Exaltados/,
      })
    ).toBeNull();
    expect(screen.queryByText("Actualizaciones")).toBeNull();
  });

  it("incluye enlace de regreso a /noticias", async () => {
    await renderDetalle(enMemoria.slug);

    const backLink = screen.getByRole("link", { name: /Volver a Noticias/ });
    expect(backLink).toHaveAttribute("href", "/noticias");
  });

  it("embebe JSON-LD NewsArticle con dateModified de la última actualización", async () => {
    const { container } = await renderDetalle(enMemoria.slug);

    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).not.toBeNull();

    const jsonLd = JSON.parse(script!.textContent ?? "{}");
    expect(jsonLd["@type"]).toBe("NewsArticle");
    expect(jsonLd.headline).toBe("En memoria de Julio «Yuyo» Maldonado");
    expect(jsonLd.dateModified).toBe("2026-07-14");
  });

  it("lanza notFound() en slug desconocido", async () => {
    await expect(renderDetalle("slug-inexistente")).rejects.toThrow(
      "NEXT_NOT_FOUND"
    );
  });
});
