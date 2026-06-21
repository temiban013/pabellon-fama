import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../setup/test-utils";
import { TourLightbox } from "@/components/museo/TourLightbox";
import type { TourPhoto } from "@/lib/museo-tour";

// Mock next/image → <img> simple para jsdom
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const photos: TourPhoto[] = [
  { src: "/a.jpg", thumb: "/a-t.jpg", alt: "Foto A", caption: "Pie A" },
  { src: "/b.jpg", thumb: "/b-t.jpg", alt: "Foto B" },
  { src: "/c.jpg", thumb: "/c-t.jpg", alt: "Foto C" },
];

describe("TourLightbox", () => {
  it("muestra la primera foto y el contador", () => {
    render(<TourLightbox photos={photos} title="Área" onClose={() => {}} />);
    expect(screen.getByAltText("Foto A")).toBeInTheDocument();
    expect(screen.getByText("Foto 1 de 3")).toBeInTheDocument();
  });

  it("muestra el pie de foto cuando existe", () => {
    render(<TourLightbox photos={photos} onClose={() => {}} />);
    expect(screen.getByText("Pie A")).toBeInTheDocument();
  });

  it("navega a la siguiente foto", () => {
    render(<TourLightbox photos={photos} onClose={() => {}} />);
    fireEvent.click(screen.getByLabelText("Foto siguiente"));
    expect(screen.getByText("Foto 2 de 3")).toBeInTheDocument();
    expect(screen.getByAltText("Foto B")).toBeInTheDocument();
  });

  it("navega hacia atrás con envoltura (wrap-around)", () => {
    render(<TourLightbox photos={photos} onClose={() => {}} />);
    fireEvent.click(screen.getByLabelText("Foto anterior"));
    expect(screen.getByText("Foto 3 de 3")).toBeInTheDocument();
    expect(screen.getByAltText("Foto C")).toBeInTheDocument();
  });

  it("respeta initialIndex", () => {
    render(<TourLightbox photos={photos} initialIndex={1} onClose={() => {}} />);
    expect(screen.getByText("Foto 2 de 3")).toBeInTheDocument();
  });

  it("llama onClose al pulsar el botón de cerrar", () => {
    const onClose = vi.fn();
    render(<TourLightbox photos={photos} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Cerrar galería"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("llama onClose al presionar Escape", () => {
    const onClose = vi.fn();
    render(<TourLightbox photos={photos} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navega con las flechas del teclado", () => {
    render(<TourLightbox photos={photos} onClose={() => {}} />);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(screen.getByText("Foto 2 de 3")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByText("Foto 1 de 3")).toBeInTheDocument();
  });

  it("oculta las flechas cuando solo hay una foto", () => {
    render(<TourLightbox photos={[photos[0]]} onClose={() => {}} />);
    expect(screen.queryByLabelText("Foto siguiente")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Foto anterior")).not.toBeInTheDocument();
  });

  it("es un diálogo modal accesible", () => {
    render(<TourLightbox photos={photos} title="Sala de Boxeo" onClose={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", expect.stringContaining("Sala de Boxeo"));
  });
});
