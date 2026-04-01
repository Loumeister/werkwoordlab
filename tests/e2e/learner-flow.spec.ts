import { expect, test } from '@playwright/test';

test('learner completes one full interaction from unit selection to diagnostic feedback', async ({ page }) => {
  await page.goto('/oefenen');

  await expect(page.getByRole('heading', { name: 'Oefenen' })).toBeVisible();

  const unitCard = page.getByRole('article').filter({ hasText: /persoonsvorm tegenwoordige tijd/i }).first();
  const unitLink = unitCard.getByRole('link', { name: 'Start' });

  await expect(unitLink).toBeVisible();
  await unitLink.click();

  await expect(page).toHaveURL(/\/oefenen\/unit-01-pv-tt/);
  await expect(page.getByText(/opdracht 1 van/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scaffold' })).toBeVisible();

  const answerInput = page.getByRole('textbox').first();
  await expect(answerInput).toBeVisible();
  await answerInput.fill('vind');

  const submitButton = page
    .getByRole('button', { name: /controleer|nakijken|verzend|verstuur|submit|check/i })
    .first();

  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page.getByRole('heading', { name: 'Diagnostische feedback' })).toBeVisible();
  await expect(page.getByText(/misconceptiecode/i)).toBeVisible();
  await expect(page.getByText(/hint/i)).toBeVisible();
});
