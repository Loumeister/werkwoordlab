import { expect, test } from "@playwright/test";

test("learner kan unit kiezen en feedback zien", async ({ page }) => {
  await page.goto("/oefenen");

  await expect(page.getByRole("heading", { name: "Oefenen" })).toBeVisible();
  await page.getByRole("link", { name: "Start" }).first().click();

  await expect(page.getByText(/opdracht 1 van/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /controleer antwoord/i })).toBeVisible();
});
