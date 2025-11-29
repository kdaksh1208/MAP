import { test, expect } from "@playwright/test";

test.describe("AOI Map", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("map container is visible and base tiles load", async ({ page }) => {
    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible();
    // wait for at least one tile image (OSM base or WMS) to render
    await page.waitForSelector(".leaflet-tile", { timeout: 6000 });
    const tiles = await page.$$(".leaflet-tile");
    expect(tiles.length).toBeGreaterThan(0);
  });

  test("draw polygon and persistence in localStorage", async ({ page }) => {
    // Click draw polygon button (Leaflet Draw UI button)
    const drawPolygonBtn = page.locator(".leaflet-draw-draw-polygon");
    await drawPolygonBtn.click();
    // draw a small triangle by clicks relative to page
    await page.mouse.click(400, 300);
    await page.mouse.click(450, 300);
    await page.mouse.click(425, 350);
    // finish drawing with double click (this finalizes)
    await page.mouse.dblclick(425, 350);
    // assert localStorage has aois stored
    const stored = await page.evaluate(() => localStorage.getItem("aois"));
    expect(stored).not.toBeNull();
    const obj = JSON.parse(stored || "{}");
    expect(obj.type).toBe("FeatureCollection");
  });
});
