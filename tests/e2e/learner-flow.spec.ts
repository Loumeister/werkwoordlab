import { expect, test } from '@playwright/test';

test("learner doorloopt eerste opdracht en ziet diagnostische feedback", async ({ page }) => {
  await page.goto("/oefenen");

  await expect(page.getByRole('heading', { name: 'Oefenen' })).toBeVisible();

  const unitCard = page.getByRole('article').filter({ hasText: /persoonsvorm tegenwoordige tijd/i }).first();
  const unitLink = unitCard.getByRole('link', { name: 'Start' });

  await expect(unitLink).toBeVisible();
  await unitLink.click();

  await expect(page).toHaveURL(/\/oefenen\/unit-01-pv-tt/);

  // Stage A: function classification (shown because no function mastery yet)
  await expect(page.getByText(/grammaticale functie/i)).toBeVisible();
  await page.getByRole("radio", { name: "persoonsvorm" }).check();
  await page.getByRole("button", { name: /^controleer$/i }).click();

  // Correct function → "Klopt!" feedback shown, advance button appears
  await expect(page.getByText(/klopt/i)).toBeVisible();
  await page.getByRole("button", { name: /ga naar de spelling/i }).click();

  // Stage B: spelling input visible, "Toon hint" button visible (scaffold hidden by default)
  await expect(page.getByText(/jouw antwoord/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /toon hint/i })).toBeVisible();

  // First item (u1-i1) is a homophone item: vind/vindt
  await page.getByRole("radio", { name: "vind" }).check();
  await page.getByRole("button", { name: /controleer antwoord/i }).click();

  // Diagnostic feedback shown
  await expect(page.getByRole("heading", { name: /diagnostische feedback/i })).toBeVisible();
  await expect(page.getByText(/misconceptiecode:/i)).toBeVisible();
  await expect(page.getByText(/hint:/i)).toBeVisible();
});

test("learner kan classify-item beantwoorden in unit-05 (werkwoordelijk vs bijvoeglijk)", async ({ page }) => {
  await page.goto("/oefenen/unit-05-bijvoeglijk-vd");

  // Item 1 is a classify item — MasteryExercise goes straight to answer step
  await expect(page.getByText(/jouw antwoord/i)).toBeVisible();

  // classifyOptions knoppen verschijnen
  await expect(page.getByRole("radio", { name: "werkwoordelijk" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "bijvoeglijk" })).toBeVisible();

  // Standaard functieopties zijn niet aanwezig (regressiebewaker)
  await expect(page.getByRole("radio", { name: "persoonsvorm" })).not.toBeVisible();
  await expect(page.getByRole("radio", { name: "infinitief" })).not.toBeVisible();

  // Selecteer correct antwoord (item 1 target = "bijvoeglijk")
  await page.getByRole("radio", { name: "bijvoeglijk" }).check();
  await page.getByRole("button", { name: /controleer antwoord/i }).click();

  // Feedbacksectie verschijnt
  await expect(page.getByRole("heading", { name: /diagnostische feedback/i })).toBeVisible();
  await expect(page.getByText(/misconceptiecode:/i)).toBeVisible();
});
