import { expect, test } from "@playwright/test";

import { STAGE_PROMPTS } from "../../lib/content/microwave-bread";
import { LearningStage } from "../../types/learning";
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

    await expect(page.getByText("面包摸起来更热了。")).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();
    await expect(page.getByText("面包摸起来更热了。")).toBeVisible();
  });
});
