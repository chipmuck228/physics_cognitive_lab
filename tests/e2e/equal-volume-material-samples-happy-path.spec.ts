import { expect, test } from "@playwright/test";

import {
  SAMPLES_COMPLETE_COPY,
  SAMPLES_FORBIDDEN_REVEAL_TERMS,
  SAMPLES_STAGE_PROMPTS,
} from "../../lib/content/equal-volume-material-samples";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  completeSamplesAiOff,
  completeSamplesCupsTransfer,
  completeSamplesDescribe,
  completeSamplesExam,
  completeSamplesExperimentCycle,
  completeSamplesExplain,
  completeSamplesHollowTransfer,
  completeSamplesModel,
  completeSamplesObserve,
  completeSamplesPredictA,
  expectNoTutorChrome,
  openSamplesLab,
  startSamplesLesson,
} from "./samples-helpers";

test.describe("Scene 04 complete loop", () => {
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

    await openSamplesLab(page);
    for (const term of SAMPLES_FORBIDDEN_REVEAL_TERMS) {
      await expect(page.getByText(term, { exact: true })).toHaveCount(0);
    }
    await startSamplesLesson(page);
    await completeSamplesObserve(page);

    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: SAMPLES_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();

    await completeSamplesDescribe(page);
    await completeSamplesPredictA(page, "体积相同，所以密度一定相同");

    await completeSamplesExperimentCycle(page, {
      kind: "same-volume",
      mass: "铁块更重",
      volume: "体积几乎相同",
      density: "铁块密度更大",
      comparison: "不一样",
      reflection: "同样大的时候，更沉的那一块密度更大。",
    });
    await completeSamplesExperimentCycle(page, {
      kind: "same-mass",
      predictOutcome: "占空间更大的那一块密度更小",
      reason: "质量相同，占的空间更大就更疏。",
      mass: "两块质量几乎相同",
      volume: "塑料块体积更大",
      density: "金属小块密度更大",
      comparison: "差不多一样",
      reflection: "同样重的时候，更大的那一块密度更小。",
    });
    await completeSamplesExperimentCycle(page, {
      kind: "cut",
      predictOutcome: "切成一半，密度也变成一半",
      reason: "我以为切小了密度就会变小。",
      mass: "大约变成一半",
      volume: "大约变成一半",
      density: "几乎不变",
      comparison: "不一样",
      reflection: "均匀切开以后，质量和体积一起变，密度不必变。",
    });

    await completeSamplesExplain(page);
    await completeSamplesModel(page);
    await completeSamplesCupsTransfer(page);
    await completeSamplesHollowTransfer(page);
    await completeSamplesExam(page);

    await expectNoTutorChrome(page);
    const beforeAiOff = tutorRequests.length;
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: SAMPLES_STAGE_PROMPTS[LearningStage.AI_OFF],
      }),
    ).toBeVisible();
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);

    await completeSamplesAiOff(page);
    await expect(page.getByText(SAMPLES_COMPLETE_COPY.title)).toBeVisible();
    await expect(page.getByText(/完全掌握/)).toHaveCount(0);
    await expect(page.getByText(/提高成绩/)).toHaveCount(0);
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);
  });

  test("keeps the samples path usable when /api/tutor fails", async ({ page }) => {
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

    await openSamplesLab(page);
    await startSamplesLesson(page);
    await page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }).click();
    await expect(page.getByText("Internal Server Error")).toHaveCount(0);
    await completeSamplesObserve(page);
    await expect(
      page.getByRole("heading", {
        name: SAMPLES_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();
  });
});
