import { expect, test } from "@playwright/test";

import {
  completeObserve,
  openLab,
  startLesson,
} from "./helpers";

test.describe("persistence", () => {
  test("restores stage and evidence after a reload", async ({ page }) => {
    await openLab(page);
    await startLesson(page);
    await completeObserve(page);

    await expect(page.getByText("The bread got hotter.")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: "Describe the change in physics language.",
      }),
    ).toBeVisible();
    await expect(page.getByText("The bread got hotter.")).toBeVisible();
  });
});
