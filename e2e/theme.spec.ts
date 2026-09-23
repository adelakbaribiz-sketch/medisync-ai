import { test, expect } from "@playwright/test";

test("theme toggle cycles light -> dark and persists across a hard reload", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: /Theme:/ });

  // Whatever the resolved starting state is, cycling once away from "system"
  // and once again should land on a known, explicit mode.
  await toggle.click();
  await toggle.click();
  const label = await toggle.getAttribute("aria-label");
  expect(label).toMatch(/Theme: (Light|Dark)\./);

  const wasDark = (await html.getAttribute("class"))?.includes("dark") ?? false;

  await page.reload();
  const stillDark = (await html.getAttribute("class"))?.includes("dark") ?? false;
  expect(stillDark).toBe(wasDark);
});

test("dark mode applies the dark surface tokens (no light-mode flash artifacts)", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Theme:/ });

  // Cycle until explicitly Dark (cycle order is light -> dark -> system).
  for (let i = 0; i < 3; i++) {
    const label = await toggle.getAttribute("aria-label");
    if (label?.includes("Dark")) break;
    await toggle.click();
  }
  await expect(page.locator("html")).toHaveClass(/dark/);

  const bg = await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor
  );
  // Dark canvas (#0a1615) is a near-black teal — assert it is genuinely dark,
  // not a naive check for one exact value that would break on palette tuning.
  const rgbMatch = bg.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
  const luminance = (rgbMatch[0] + rgbMatch[1] + rgbMatch[2]) / 3;
  expect(luminance).toBeLessThan(40);
});
