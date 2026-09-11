import { expect, test } from "@playwright/test";

import {
  completeObserve,
  openLab,
  startLesson,
} from "./helpers";

test.describe("AI failure", () => {
  test("keeps the learning path usable when /api/tutor fails", async ({
    page,
  }) => {
    await page.route("**/api/tutor", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Internal Server Error",
          stack: "Error: simulated tutor failure",
        }),
      });
    });

    await openLab(page);
    await startLesson(page);
    await completeObserve(page);

    await page.getByRole("button", { name: "Ask the coach one question" }).click();
    await expect(
      page.getByText("先别急着找答案。请告诉我，你刚才观察到了什么变化？"),
    ).toBeVisible();
    await expect(page.getByText("Internal Server Error")).toHaveCount(0);
    await expect(page.getByText("simulated tutor failure")).toHaveCount(0);

    await page
      .getByLabel("How would you describe the change in the bread?")
      .fill("The temperature of the bread increased.");
    await page.getByRole("button", { name: "Save description" }).click();

    await expect(
      page.getByRole("heading", {
        name: "Make a prediction before the next experiment.",
      }),
    ).toBeVisible();
  });
});
