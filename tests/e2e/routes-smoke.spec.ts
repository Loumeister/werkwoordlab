import { expect, test } from "@playwright/test";

test("route smoke: /oefenen", async ({ page }) => {
  await page.goto("/oefenen");
  await expect(page.getByRole("heading", { level: 1, name: /oefenen/i })).toBeVisible();
});

test("route smoke: /oefenen/unit-01-pv-tt", async ({ page }) => {
  await page.goto("/oefenen/unit-01-pv-tt");
  await expect(page.getByRole("heading", { name: /scaffold/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /controleer antwoord/i })).toBeVisible();
  await expect(page.getByRole("radio", { name: "vind", exact: true })).toBeVisible();
});

const appRouteChecks: Array<{ path: string; heading: RegExp }> = [
  { path: "/schrijven", heading: /schrijven/i },
  { path: "/groei", heading: /groei/i },
  { path: "/inzichten", heading: /inzichten/i },
  { path: "/content", heading: /content/i }
];

for (const { path, heading } of appRouteChecks) {
  test(`route smoke: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  });
}

test("route smoke: invalid unit route toont not-found", async ({ page }) => {
  const response = await page.goto("/oefenen/unit-bestaat-niet");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /404/i })).toBeVisible();
  await expect(page.getByText(/this page could not be found/i)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: /persoonsvorm tegenwoordige tijd/i })).toHaveCount(0);
});
