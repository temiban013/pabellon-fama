import { describe, it, expect } from "vitest";
import { seoConfigs } from "@/lib/seo";

describe("seoConfigs.nominacion (PF-072)", () => {
  it("describe el periodo como cerrado y la boleta como archivo", () => {
    expect(seoConfigs.nominacion.description).toBe(
      "Nominaciones a la Novena Exaltación (2026). El periodo cerró el 31 de agosto de 2026; el comunicado y la boleta se conservan como archivo.",
    );
  });
});
