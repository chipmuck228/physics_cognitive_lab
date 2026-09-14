import { expect, test } from "@playwright/test";

import { HOME_COPY, LAB_SCENES, sceneEnterAria } from "../../lib/content/home";
import { SCENE_COPY } from "../../lib/content/microwave-bread";
import { STUDENT_CHROME } from "../../lib/content/student-language";

test.describe("lab homepage", () => {
  test("lists seven scenes and returns home from a scene", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: HOME_COPY.title })).toBeVisible();

    for (const scene of LAB_SCENES) {
      await expect(
        page.getByRole("link", { name: sceneEnterAria(scene) }),
      ).toBeVisible();
    }

    await page
      .getByRole("link", {
        name: sceneEnterAria({
          cta: SCENE_COPY.landingCta,
          title: SCENE_COPY.landingTitle,
        }),
      })
      .click();
    await expect(page.getByRole("heading", { name: SCENE_COPY.headline })).toBeVisible();
    await expect(page.getByRole("link", { name: STUDENT_CHROME.homeAria })).toBeVisible();

    await page.getByRole("link", { name: STUDENT_CHROME.homeAria }).click();
    await expect(page.getByRole("heading", { name: HOME_COPY.title })).toBeVisible();
  });
});
