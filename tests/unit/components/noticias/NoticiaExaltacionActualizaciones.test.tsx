import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../setup/test-utils";
import NoticiaPage from "@/app/noticias/[slug]/page";
import { EXALTACION_2026 } from "@/lib/data/exaltacion-2026";

// El mock global de next/image devuelve las props en vez de un elemento.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// PF-072: detalle real (sin fixtures) de la noticia de la Novena Exaltación.
describe("Noticia de la Novena Exaltación en pasado (PF-072)", () => {
  async function renderNoticia() {
    const ui = await NoticiaPage({
      params: Promise.resolve({ slug: EXALTACION_2026.noticiaSlug }),
    });
    return render(ui);
  }

  it("renderiza el contenido en pasado con la fecha y la sede aprobadas", async () => {
    await renderNoticia();

    expect(
      screen.getByText(
        "El Pabellón de la Fama del Deporte Humacaeño celebró su Novena Exaltación el domingo 8 de noviembre de 2026 en el Centro de Bellas Artes Águedo Mojica Marrero de Humacao.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("La ceremonia llevó por lema «Honrando nuestros atletas y propulsores»."),
    ).toBeInTheDocument();
  });

  it("muestra la sección «Actualizaciones» con la nota del 11 de noviembre de 2026", async () => {
    const { container } = await renderNoticia();

    expect(
      screen.getByRole("heading", { level: 2, name: "Actualizaciones" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /La ceremonia se celebró el domingo 8 de noviembre de 2026; se actualizó el texto para reflejarlo\./,
      ),
    ).toBeInTheDocument();
    const hora = container.querySelector('time[datetime="2026-11-11"]');
    expect(hora).not.toBeNull();
    expect(hora?.textContent).toBe("11 de noviembre de 2026:");
  });
});
