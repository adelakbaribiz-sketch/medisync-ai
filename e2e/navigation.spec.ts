import { test, expect } from "@playwright/test";

const routes: { path: string; heading: string }[] = [
  { path: "/", heading: "Dashboard" },
  { path: "/interactions", heading: "Interaction Analysis" },
  { path: "/patient", heading: "Patient Profile" },
  { path: "/evidence", heading: "Evidence Library" },
  { path: "/settings", heading: "Settings" },
];

for (const { path, heading } of routes) {
  test(`${path || "/"} renders its heading with no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    expect(errors, `console errors on ${path}: ${errors.join("; ")}`).toEqual([]);
  });
}

const navLinks: { path: string; label: string }[] = [
  { path: "/interactions", label: "Interactions" },
  { path: "/patient", label: "Patient Profile" },
  { path: "/evidence", label: "Evidence Library" },
  { path: "/settings", label: "Settings" },
];

test("sidebar nav reaches every route from the Dashboard", async ({ page }) => {
  await page.goto("/");
  for (const { path, label } of navLinks) {
    await page.getByRole("link", { name: label }).first().click();
    await expect(page).toHaveURL(new RegExp(path.replace("/", "\\/") + "$"));
  }
});
