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

  // Wait for React hydration before interacting with the form
  await page.locator('form[data-hydrated]').waitFor();

  await page.getByRole("radio", { name: "vind", exact: true }).check();
  await page.getByRole("button", { name: /controleer antwoord/i }).click();

  await expect(page.getByRole("heading", { name: /diagnostische feedback/i })).toBeVisible();
  await expect(page.getByText(/misconceptiecode:/i)).toBeVisible();
  await expect(page.getByText(/hint:/i)).toBeVisible();
});

test("learner kan classify-item beantwoorden in unit-05 (werkwoordelijk vs bijvoeglijk)", async ({ page }) => {
  await page.goto("/oefenen/unit-05-bijvoeglijk-vd");

  await expect(page.getByText(/opdracht 1 van/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /scaffold/i })).toBeVisible();

  // Wait for React hydration before interacting with the form
  await page.locator('form[data-hydrated]').waitFor();

  // Item 1 is een classify-item — verify classifyOptions-knoppen verschijnen
  await expect(page.getByRole("radio", { name: "werkwoordelijk" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "bijvoeglijk" })).toBeVisible();

  // Verify dat standaard-functieopties NIET verschijnen (regressiebewaker)
  await expect(page.getByRole("radio", { name: "persoonsvorm" })).not.toBeVisible();
  await expect(page.getByRole("radio", { name: "infinitief" })).not.toBeVisible();

  // Selecteer correct antwoord (item 1 target = "bijvoeglijk")
  await page.getByRole("radio", { name: "bijvoeglijk" }).check();
  await page.getByRole("button", { name: /controleer antwoord/i }).click();

  // Verify feedbacksectie verschijnt
  await expect(page.getByRole("heading", { name: /diagnostische feedback/i })).toBeVisible();
  await expect(page.getByText(/misconceptiecode:/i)).toBeVisible();
});
