import { expect, test } from "@playwright/test";

import { SCENE_COPY, STAGE_PROMPTS } from "../../lib/content/microwave-bread";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
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

    await page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }).click();
    await expect(
      page.getByText("先别急着找答案。请告诉我，你刚才观察到了什么变化？"),
    ).toBeVisible();
    await expect(page.getByText("Internal Server Error")).toHaveCount(0);
    await expect(page.getByText("simulated tutor failure")).toHaveCount(0);

    await page.getByRole("radio", { name: "面包" }).click();
    await page.getByRole("radio", { name: "温度" }).click();
    await page.getByRole("radio", { name: "升高了" }).click();
    await page.getByLabel(SCENE_COPY.describeQuestion).fill("面包的温度升高了。");
    await page.getByRole("button", { name: SCENE_COPY.describeSubmit }).click();

    await expect(
      page.getByRole("heading", {
        name: STAGE_PROMPTS[LearningStage.PREDICT],
      }),
    ).toBeVisible();
  });
});
