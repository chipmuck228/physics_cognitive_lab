import { expect, test } from "@playwright/test";

import {
  HEAT_COMPLETE_COPY,
  HEAT_FORBIDDEN_REVEAL_TERMS,
  HEAT_STAGE_PROMPTS,
} from "../../lib/content/equal-mass-heated-samples";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  completeHeatAiOff,
  completeHeatDescribe,
  completeHeatExam,
  completeHeatExperimentCycle,
  completeHeatExplain,
  completeHeatIceTransfer,
  completeHeatModel,
  completeHeatObserve,
  completeHeatPotsTransfer,
  completeHeatPredictA,
  expectNoTutorChrome,
  openHeatLab,
  startHeatLesson,
} from "./heat-helpers";

test.describe("Scene 05 complete loop", () => {
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

    await openHeatLab(page);
    for (const term of HEAT_FORBIDDEN_REVEAL_TERMS) {
      await expect(page.getByText(term, { exact: true })).toHaveCount(0);
    }
    await startHeatLesson(page);
    await completeHeatObserve(page);

    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: HEAT_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();

    await completeHeatDescribe(page);
    await completeHeatPredictA(page, "两边升得一样");

    await completeHeatExperimentCycle(page, {
      mass: "质量相同",
      energy: "吸收的能量可以看成相近",
      deltaT: "沙子升温更多",
      comparison: "不一样",
      reflection: "质量相同、能量相近时，沙子升得更多。时间不是吸收的能量。",
    });
    await completeHeatExperimentCycle(page, {
      predictOutcome: "质量更小的那份升得更多",
      reason: "同样加热，质量更小的应该升得更多。",
      mass: "左边质量更小",
      energy: "吸收的能量可以看成相近",
      deltaT: "质量更小的升温更多",
      comparison: "差不多一样",
      reflection: "同一种材料、能量相近时，质量更大升温更小。",
    });
    await completeHeatExperimentCycle(page, {
      predictOutcome: "吸收能量更多的那次升得更多",
      reason: "同样样品时，能量更多升温应该更多。",
      mass: "质量相同",
      energy: "右边吸收的能量更多",
      deltaT: "能量更多的那次升温更多",
      comparison: "差不多一样",
      reflection: "同样材料、同样质量时，吸收能量更多升温更多。",
    });

    await completeHeatExplain(page);
    await completeHeatModel(page);
    await completeHeatPotsTransfer(page);
    await completeHeatIceTransfer(page);
    await completeHeatExam(page);

    await expectNoTutorChrome(page);
    const beforeAiOff = tutorRequests.length;
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: HEAT_STAGE_PROMPTS[LearningStage.AI_OFF],
      }),
    ).toBeVisible();
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);

    await completeHeatAiOff(page);
    await expect(page.getByText(HEAT_COMPLETE_COPY.title)).toBeVisible();
    await expect(page.getByText(/完全掌握/)).toHaveCount(0);
    await expect(page.getByText(/提高成绩/)).toHaveCount(0);
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);
  });

  test("keeps the heat path usable when /api/tutor fails", async ({ page }) => {
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

    await openHeatLab(page);
    await startHeatLesson(page);
    await page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }).click();
    await expect(page.getByText("Internal Server Error")).toHaveCount(0);
    await completeHeatObserve(page);
    await expect(
      page.getByRole("heading", {
        name: HEAT_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();
  });
});
