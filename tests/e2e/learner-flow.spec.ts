import { expect, test } from "@playwright/test";

test("learner doorloopt eerste opdracht en ziet diagnostische feedback", async ({ page }) => {
  await page.goto("/oefenen");

  await expect(page.getByRole("heading", { name: "Oefenen" })).toBeVisible();
  await page.getByRole("link", { name: "Start" }).first().click();

  await expect(page).toHaveURL(/\/oefenen\/[^/]+$/);
  await expect(page.getByRole("heading", { name: /scaffold/i })).toBeVisible();
  await expect(page.getByRole("radio", { name: "vind", exact: true })).toBeVisible();
  await page.getByRole("radio", { name: "vind", exact: true }).check();
  await page.getByRole("button", { name: /controleer antwoord/i }).click();

  await expect(page.getByRole("heading", { name: /diagnostische feedback/i })).toBeVisible();
  await expect(page.getByText(/misconceptiecode:/i)).toBeVisible();
  await expect(page.getByText(/hint:/i)).toBeVisible();
});
