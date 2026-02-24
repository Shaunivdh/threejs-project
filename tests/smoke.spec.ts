import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("loads app and shows top menu", async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/", { waitUntil: "domcontentloaded" });


    await expect(page.locator("canvas")).toHaveCount(1);


    const hud = page.getByLabel("Social links");
    await expect(hud).toBeVisible({ timeout: 60_000 });

    await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(page.getByRole("link", { name: "GitHub" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Email" })).toBeVisible();
  });

  test("can open and close contact modal", async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByLabel("Social links")).toBeVisible({ timeout: 60_000 });

    await page.getByRole("button", { name: "Email" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await expect(page.getByText("Send me a message")).toBeVisible();

await dialog.getByRole("button", { name: "Close" }).click();

    await expect(dialog).toBeHidden();
  });

  test("welcome toast appears (and can be closed)", async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Take flight. Explore at your own pace.  🌱")).toBeVisible({
      timeout: 60_000,
    });

    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByText("Take flight. Explore at your own pace.  🌱")).toBeHidden({
      timeout: 10_000,
    });
  });
});
