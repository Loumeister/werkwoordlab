import { expect, test } from '@playwright/test';

test('learner completes one full interaction from unit selection to diagnostic feedback', async ({ page }) => {
  await page.goto('/oefenen');

  const unitLink = page
    .getByRole('link', { name: /persoonsvorm tegenwoordige tijd|unit-01-pv-tt/i })
    .first();

  await expect(unitLink).toBeVisible();
  await unitLink.click();

  await expect(page).toHaveURL(/\/oefenen\/unit-01-pv-tt/);

  const answerInput = page.getByRole('textbox').first();
  await expect(answerInput).toBeVisible();
  await answerInput.fill('vind');

  const submitButton = page
    .getByRole('button', { name: /controleer|nakijken|verzend|verstuur|submit|check/i })
    .first();

  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const diagnosticFeedback = page
    .locator('[role="status"], [role="alert"]')
    .filter({ hasText: /misconcept|hint|feedback|goed|juist|correct|fout/i })
    .first();

  await expect(diagnosticFeedback).toBeVisible();
});
