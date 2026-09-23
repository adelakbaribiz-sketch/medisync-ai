import { test, expect } from "@playwright/test";

test("adding two interacting drugs surfaces a contraindicated interaction end-to-end", async ({
  page,
}) => {
  await page.goto("/");

  const search = page.getByRole("textbox", { name: "Search for a drug to add" });

  await search.fill("simva");
  await page.getByRole("button", { name: /Simvastatin/ }).click();
  await expect(page.getByText("Simvastatin added to the medication list.")).toBeVisible();

  await search.fill("clarithro");
  await page.getByRole("button", { name: /Clarithromycin/ }).click();
  await expect(page.getByText("Clarithromycin added to the medication list.")).toBeVisible();

  // Dashboard KPI + highest-priority card
  await expect(page.getByText("Contraindicated").locator("..").getByText("1")).toBeVisible();
  await expect(page.getByText("Simvastatin + Clarithromycin")).toBeVisible();

  // Full detail on the Interactions page
  await page.getByRole("link", { name: "Interactions" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Interaction Analysis" })).toBeVisible();
  await expect(page.getByText("Simvastatin + Clarithromycin")).toBeVisible();

  // Cited evidence on the Evidence Library page
  await page.getByRole("link", { name: "Evidence Library" }).click();
  await expect(page.getByText("Simvastatin + Clarithromycin")).toBeVisible();
  await expect(page.getByText("Established").first()).toBeVisible();

  // Settings reset clears it back out (round-trips through localStorage)
  await page.getByRole("link", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Clear all local demo data" }).click();
  await expect(page.getByText("Demo session data cleared.")).toBeVisible();

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByText("No medications added yet")).toBeVisible();
});
