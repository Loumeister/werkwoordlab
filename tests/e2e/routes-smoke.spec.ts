import { expect, test } from "@playwright/test";

const routeChecks: Array<{ path: string; heading: RegExp }> = [
  { path: "/oefenen", heading: /^oefenen$/i },
  { path: "/oefenen/unit-01-pv-tt", heading: /persoonsvorm tegenwoordige tijd/i },
  { path: "/schrijven", heading: /schrijven & nakijken/i },
  { path: "/groei", heading: /mijn groei/i },
  { path: "/inzichten", heading: /inzichten/i },
  { path: "/content", heading: /contentbibliotheek/i }
];

for (const { path, heading } of routeChecks) {
  test(`route smoke: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  });
}

test("route smoke: invalid unit route toont not-found", async ({ page }) => {
  const response = await page.goto("/oefenen/unit-bestaat-niet");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /404/i })).toBeVisible();
});
