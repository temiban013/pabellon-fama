import { test, expect } from "@playwright/test";

/**
 * E2E del Recorrido Virtual 360° del Museo.
 * Se prueban los caminos deterministas (independientes de WebGL): el póster con el botón
 * "Iniciar recorrido", el índice de áreas de exhibición y la galería en el lightbox.
 */
test.describe("Recorrido Virtual del Museo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/museo");
  });

  test("muestra el recorrido 360° y el índice de áreas", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Tour Virtual del Museo" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Iniciar recorrido/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Áreas de Exhibición" })).toBeVisible();
    // Hay al menos una tarjeta de área (botón "Ver fotos: …")
    await expect(page.getByRole("button", { name: /Ver fotos:/ }).first()).toBeVisible();
  });

  test("al pulsar un área se abre la galería y se puede cerrar", async ({ page }) => {
    await page.getByRole("button", { name: /Ver fotos:/ }).first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Foto 1 de/)).toBeVisible();
    await expect(dialog.locator("img").first()).toBeVisible();

    await dialog.getByRole("button", { name: "Cerrar galería" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("la galería completa abre las 62 fotos", async ({ page }) => {
    await page.getByRole("button", { name: /Ver galería completa/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Foto 1 de 62")).toBeVisible();

    // Navegar a la siguiente foto
    await dialog.getByRole("button", { name: "Foto siguiente" }).click();
    await expect(dialog.getByText("Foto 2 de 62")).toBeVisible();

    // Cerrar con Escape
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
