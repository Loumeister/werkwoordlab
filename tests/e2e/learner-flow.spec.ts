import { expect, test } from '@playwright/test';

test("learner doorloopt eerste opdracht en ziet diagnostische feedback", async ({ page }) => {
  await page.goto("/oefenen");

  await expect(page.getByRole('heading', { name: 'Oefenen' })).toBeVisible();

  const unitCard = page.getByRole('article').filter({ hasText: /persoonsvorm tegenwoordige tijd/i }).first();
  const unitLink = unitCard.getByRole('link', { name: 'Start' });

  await expect(unitLink).toBeVisible();
  await unitLink.click();

  await expect(page).toHaveURL(/\/oefenen\/unit-01-pv-tt/);
  await expect(page.getByText(/opdracht 1 van/i)).toBeVisible();
await expect(page.getByRole("heading", { name: /scaffold/i })).toBeVisible();

await page.getByRole("radio", { name: "vind" }).check();
await page.getByRole("button", { name: /controleer antwoord/i }).click();

await expect(page.getByRole("heading", { name: /diagnostische feedback/i })).toBeVisible();
await expect(page.getByText(/misconceptiecode:/i)).toBeVisible();
await expect(page.getByText(/hint:/i)).toBeVisible();
});
