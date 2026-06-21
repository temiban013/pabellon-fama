import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../setup/test-utils";
import { TourFallback } from "@/components/museo/TourFallback";
import { hotspots } from "@/lib/museo-tour";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe("TourFallback", () => {
  it("muestra una tarjeta por cada área de exhibición", () => {
    render(<TourFallback hotspots={hotspots} onSelectHotspot={() => {}} />);
    for (const h of hotspots) {
      expect(screen.getByText(h.label)).toBeInTheDocument();
    }
  });

  it("al pulsar una tarjeta llama onSelectHotspot con ese hotspot", () => {
    const onSelect = vi.fn();
    render(<TourFallback hotspots={hotspots} onSelectHotspot={onSelect} />);
    const first = hotspots[0];
    fireEvent.click(screen.getByLabelText(new RegExp(`Ver fotos: ${first.label}`)));
    expect(onSelect).toHaveBeenCalledWith(first);
  });

  it("muestra el póster por defecto y lo oculta con showPoster=false", () => {
    const { rerender } = render(
      <TourFallback hotspots={hotspots} onSelectHotspot={() => {}} />,
    );
    expect(
      screen.getByAltText(/Vista panorámica del interior del Museo/),
    ).toBeInTheDocument();

    rerender(
      <TourFallback hotspots={hotspots} onSelectHotspot={() => {}} showPoster={false} />,
    );
    expect(
      screen.queryByAltText(/Vista panorámica del interior del Museo/),
    ).not.toBeInTheDocument();
  });

  it("muestra el aviso opcional cuando se provee", () => {
    render(
      <TourFallback
        hotspots={hotspots}
        onSelectHotspot={() => {}}
        notice="Tu navegador no soporta la vista 360°"
      />,
    );
    expect(screen.getByText(/no soporta la vista 360°/)).toBeInTheDocument();
  });
});
