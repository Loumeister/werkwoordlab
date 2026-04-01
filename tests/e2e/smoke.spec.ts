import { expect, test } from '@playwright/test';

const VALID_UNIT_ROUTE = '/oefenen/unit-01-pv-tt';
const INVALID_UNIT_ROUTE = '/oefenen/nonexistent-unit';
const WRITING_ROUTE = '/schrijven';
const GROWTH_ROUTE = '/groei';
const TEACHER_INSIGHTS_ROUTE = '/inzichten';
const CONTENT_LIBRARY_ROUTE = '/content';

const notFoundPatterns = [
  /404/i,
  /not\s*found/i,
  /niet\s*gevonden/i,
  /pagina\s*niet\s*gevonden/i,
];

test('learner can open /oefenen', async ({ page }) => {
  const response = await page.goto('/oefenen');

  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/oefenen/);
});

test('learner can open a real unit route and sees core exercise elements', async ({ page }) => {
  const response = await page.goto(VALID_UNIT_ROUTE);

  expect(response?.ok()).toBeTruthy();

  await expect(page.getByText(/opdracht 1 van/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scaffold' })).toBeVisible();
  await expect(page.getByRole('textbox').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /controleer antwoord/i })).toBeVisible();
});

test('invalid unit route returns not-found behavior and does not silently load a default unit', async ({ page }) => {
  const response = await page.goto(INVALID_UNIT_ROUTE);

  const has404Status = response?.status() === 404;
  const hasNotFoundUi = await Promise.any(
    notFoundPatterns.map((pattern) =>
      page
        .getByText(pattern)
        .first()
        .isVisible()
        .catch(() => false),
    ),
  ).catch(() => false);

  expect(has404Status || hasNotFoundUi).toBeTruthy();
  await expect(page).toHaveURL(/\/oefenen\/nonexistent-unit/);
  await expect(page).not.toHaveURL(/\/oefenen\/unit-01-pv-tt/);
});

test('writing route renders without crashing', async ({ page }) => {
  const response = await page.goto(WRITING_ROUTE);

  expect(response).toBeTruthy();
  expect(response!.status()).toBeLessThan(500);
});

test('growth route renders without crashing', async ({ page }) => {
  const response = await page.goto(GROWTH_ROUTE);

  expect(response).toBeTruthy();
  expect(response!.status()).toBeLessThan(500);
});

test('teacher insights route renders without crashing', async ({ page }) => {
  const response = await page.goto(TEACHER_INSIGHTS_ROUTE);

  expect(response).toBeTruthy();
  expect(response!.status()).toBeLessThan(500);
});

test('content/library route renders without crashing', async ({ page }) => {
  const response = await page.goto(CONTENT_LIBRARY_ROUTE);

  expect(response).toBeTruthy();
  expect(response!.status()).toBeLessThan(500);
});
