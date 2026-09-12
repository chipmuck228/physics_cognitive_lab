import { expect, test } from "@playwright/test";

import { LENS_COMPLETE_COPY, LENS_STAGE_PROMPTS } from "../../lib/content/convex-lens-optical-bench";
import { LearningStage } from "../../types/learning";
import {
  completeLensAiOff,
  completeLensDescribe,
  completeLensExam,
  completeLensExperimentCycle,
  completeLensExplain,
  completeLensMagnifierTransfer,
  completeLensModel,
  completeLensObserve,
  completeLensPredictA,
  completeLensProjectorTransfer,
  expectNoTutorChrome,
  openLensLab,
  startLensLesson,
} from "./lens-helpers";

test.describe("Scene 07 complete loop", () => {
  test("walks ENTRY through COMPLETE without faking session state", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const tutorRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tutor")) {
        tutorRequests.push(request.url());
      }
    });

    await openLensLab(page);
    await startLensLesson(page);
    await completeLensObserve(page);

    await page.reload();
    await expect(
      page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.DESCRIBE] }),
    ).toBeVisible();

    await completeLensDescribe(page);
    await completeLensPredictA(page);

    await completeLensExperimentCycle(page, {
      screen: "光屏接到清晰像",
      sizeOrCover: "看见的像更大",
      comparison: "和我猜的差不多",
      reflection: "物体更靠近焦点时，像变大变远，不是光屏在制造像。",
    });
    await completeLensExperimentCycle(page, {
      predictOutcome: "光屏接不到清晰像",
      reason: "物体正好在焦点上，我预计有限远处接不到清晰像。",
      screen: "怎么移光屏都接不到",
      sizeOrCover: "有限远处没有完整的像",
      comparison: "和我猜的差不多",
      reflection: "有限远处不相交，不要把它说成又一种普通成像。",
    });
    await completeLensExperimentCycle(page, {
      predictOutcome: "光屏接不到清晰像",
      reason: "物体在焦点以内，我预计光屏接不到。",
      screen: "怎么移光屏都接不到",
      sizeOrCover: "看见的像更大",
      comparison: "和我猜的差不多",
      reflection: "焦点以内只有反向延长线相交，光屏接不到虚像。",
    });
    await completeLensExperimentCycle(page, {
      predictOutcome: "还能接到实像，像会更大、更远",
      reason: "我预计整幅像还在，只是可能更暗。",
      screen: "光屏接到清晰像",
      sizeOrCover: "整幅像还在，通常更暗",
      comparison: "和我猜的差不多",
      reflection: "透镜不是把像按上下拼起来的，整幅像还在。",
    });

    await completeLensExplain(page);
    await completeLensModel(page);
    await completeLensProjectorTransfer(page);
    await completeLensMagnifierTransfer(page);
    await completeLensExam(page);

    await expectNoTutorChrome(page);
    const beforeAiOff = tutorRequests.length;
    await page.reload();
    await expect(
      page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.AI_OFF] }),
    ).toBeVisible();
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);

    await completeLensAiOff(page);
    await expect(page.getByTestId("lens-complete")).toBeVisible();
    await expect(page.getByText(LENS_COMPLETE_COPY.title)).toBeVisible();
    await expect(page.getByText(/完全掌握/)).toHaveCount(0);
    await expect(page.getByText(/提高成绩/)).toHaveCount(0);
  });

  test("tutor API failure does not block the core path", async ({ page }) => {
    test.setTimeout(120_000);
    await page.route("**/api/tutor", (route) => route.fulfill({ status: 500, body: "{}" }));
    await openLensLab(page);
    await startLensLesson(page);
    await completeLensObserve(page);
    await completeLensDescribe(page);
    await expect(
      page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.PREDICT] }),
    ).toBeVisible();
  });
});
