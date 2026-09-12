import { expect, test } from "@playwright/test";

import { ENGINE_COMPLETE_COPY, ENGINE_STAGE_PROMPTS } from "../../lib/content/four-stroke-engine";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  completeEngineAiOff,
  completeEngineDescribe,
  completeEngineExam,
  completeEngineExperimentA,
  completeEngineExperimentB,
  completeEngineExplain,
  completeEngineModel,
  completeEngineObserve,
  completeEnginePredictA,
  completeEngineTransfer,
  expectNoTutorChrome,
  openEngineLab,
  startEngineLesson,
} from "./engine-helpers";

test.describe("Scene 02 happy path", () => {
  test("walks ENTRY through COMPLETE and never calls tutor in AI_OFF", async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const tutorRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tutor")) {
        tutorRequests.push(request.url());
      }
    });

    await openEngineLab(page);
    await startEngineLesson(page);
    await completeEngineObserve(page);

    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();

    await completeEngineDescribe(page);
    await completeEnginePredictA(page);
    await completeEngineExperimentA(page);
    await completeEngineExperimentB(page);
    await completeEngineExplain(page);
    await completeEngineModel(page);
    await completeEngineTransfer(page);
    await completeEngineExam(page);

    await expectNoTutorChrome(page);
    const beforeAiOff = tutorRequests.length;
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.AI_OFF],
      }),
    ).toBeVisible();
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);

    await completeEngineAiOff(page);
    await expect(page.getByText(ENGINE_COMPLETE_COPY.title)).toBeVisible();
    await expect(page.getByText(/完全掌握/)).toHaveCount(0);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);
  });

  test("keeps the engine path usable when /api/tutor fails", async ({ page }) => {
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

    await openEngineLab(page);
    await startEngineLesson(page);
    await page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }).click();
    await expect(page.getByText("Internal Server Error")).toHaveCount(0);
    await completeEngineObserve(page);
    await expect(
      page.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();
  });
});
