import { expect, test } from "@playwright/test";

import { OHMS_COMPLETE_COPY, OHMS_STAGE_PROMPTS } from "../../lib/content/simple-resistor-circuit";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  completeOhmsAiOff,
  completeOhmsDescribe,
  completeOhmsExam,
  completeOhmsExperimentCycle,
  completeOhmsExplain,
  completeOhmsFilamentTransfer,
  completeOhmsModel,
  completeOhmsObserve,
  completeOhmsPredictA,
  completeOhmsWireTransfer,
  expectNoTutorChrome,
  openOhmsLab,
  startOhmsLesson,
} from "./ohms-helpers";

test.describe("Scene 06 complete loop", () => {
  test("walks ENTRY through COMPLETE without faking session state", async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const tutorRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tutor")) {
        tutorRequests.push(request.url());
      }
    });

    await openOhmsLab(page);
    await startOhmsLesson(page);
    await completeOhmsObserve(page);

    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: OHMS_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();

    await completeOhmsDescribe(page);
    await completeOhmsPredictA(page);

    await completeOhmsExperimentCycle(page, {
      held: "电阻可以看成没变",
      current: "电流更大",
      comparison: "和我猜的差不多",
      reflection: "电阻没变时，电压更大，电流更大。",
    });
    await completeOhmsExperimentCycle(page, {
      predictOutcome: "电流会变小",
      reason: "电压没变，电阻更大，电流应该更小。",
      held: "电压可以看成没变",
      current: "电流更小",
      comparison: "和我猜的差不多",
      reflection: "电压没变时，电阻更大，电流更小。",
    });

    await completeOhmsExplain(page);
    await completeOhmsModel(page);
    await completeOhmsWireTransfer(page);
    await completeOhmsFilamentTransfer(page);
    await completeOhmsExam(page);

    await expectNoTutorChrome(page);
    const beforeAiOff = tutorRequests.length;
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: OHMS_STAGE_PROMPTS[LearningStage.AI_OFF],
      }),
    ).toBeVisible();
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);

    await completeOhmsAiOff(page);
    await expect(page.getByText(OHMS_COMPLETE_COPY.title)).toBeVisible();
    await expect(page.getByText(/完全掌握/)).toHaveCount(0);
    await expect(page.getByText(/提高成绩/)).toHaveCount(0);
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);
  });

  test("keeps the ohms path usable when /api/tutor fails", async ({ page }) => {
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

    await openOhmsLab(page);
    await startOhmsLesson(page);
    await page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }).click();
    await expect(page.getByText("Internal Server Error")).toHaveCount(0);
    await completeOhmsObserve(page);
    await expect(
      page.getByRole("heading", {
        name: OHMS_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();
  });
});
