import { expect, test } from "@playwright/test";

import { LENS_COPY, LENS_STAGE_PROMPTS } from "../../lib/content/convex-lens-optical-bench";
import { STUDENT_CHROME } from "../../lib/content/student-language";
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
  lensStageHeading,
  openLensLab,
  performVisibleTrialIntervention,
  startLensLesson,
} from "./lens-helpers";

test.describe("Scene 07 learner-visible flow", () => {
  test("a first-time learner can finish PREDICT through COMPLETE from visible UI only", async ({
    page,
  }) => {
    test.setTimeout(300_000);

    await openLensLab(page);
    await startLensLesson(page);
    await completeLensObserve(page);
    await completeLensDescribe(page);

    await expect(
      page.getByRole("heading", { name: lensStageHeading(LearningStage.PREDICT) }),
    ).toBeVisible();
    await expect(page.getByTestId("lens-predict-task")).toBeVisible();
    await completeLensPredictA(page);

    await expect(
      page.getByRole("heading", { name: lensStageHeading(LearningStage.EXPERIMENT) }),
    ).toBeVisible();
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 1 / 4 次验证");
    await expect(page.getByTestId("lens-intervention-prompt")).toContainText("预测已经锁定");
    await expect(page.getByTestId("lens-intervention-prompt")).toContainText("F 和 2F 之间");
    await expect(page.getByRole("button", { name: LENS_COPY.runExperiment })).toHaveCount(0);

    await page.getByTestId("station-hit-at-f").click();
    await expect(page.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "blocked",
    );
    await expect(page.getByTestId("lens-action-response-message")).toContainText("F 和 2F 之间");

    await performVisibleTrialIntervention(page);
    await expect(page.getByText(LENS_COPY.observeAfterIntervention)).toBeVisible();
    await expect(page.getByTestId("lens-save-observed")).toBeVisible();

    await page.getByRole("radio", { name: /光屏接到清晰像/ }).click();
    await page.getByRole("radio", { name: /看见的像更大/ }).click();
    await page.getByRole("button", { name: LENS_COPY.observeSubmitExperiment }).click();
    await expect(page.getByTestId("lens-compare-surface")).toBeVisible();
    await expect(page.getByTestId("lens-compare-prediction")).toBeVisible();
    await expect(page.getByTestId("lens-compare-observation")).toBeVisible();
    await page.getByRole("radio", { name: /基本一样/ }).click();
    await page.getByRole("button", { name: LENS_COPY.compareSubmit }).click();
    await page.locator("textarea").last().fill(
      "物体更靠近焦点时，像变大变远，不是光屏在制造像。",
    );
    await page.getByRole("button", { name: LENS_COPY.reflectionSubmit }).click();
    await expect(page.getByTestId("lens-trial-complete")).toContainText("第 1 次验证完成");
    await expect(page.getByTestId("lens-start-next-trial")).toBeVisible();
    await page.getByTestId("lens-start-next-trial").click();
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 2 / 4 次验证");
    await expect(page.getByTestId("lens-predict-task")).toBeVisible();
    await expect(page.getByTestId("lens-task-context")).toContainText(LENS_COPY.trialPredictFirst);
    await expect(page.getByTestId("station-hit-at-f")).toHaveCount(0);

    await completeLensExperimentCycle(page, {
      predictOutcome: "光屏接不到清晰像",
      reason: "物体正好在焦点上，我预计有限远处接不到清晰像。",
      screen: "怎么移光屏都接不到",
      sizeOrCover: "有限远处没有完整的像",
      comparison: "基本一样",
      reflection: "有限远处不相交，不要把它说成又一种普通成像。",
    });
    await completeLensExperimentCycle(page, {
      predictOutcome: "光屏接不到清晰像",
      reason: "物体在焦点以内，我预计光屏接不到。",
      screen: "怎么移光屏都接不到",
      sizeOrCover: "看见的像更大",
      comparison: "基本一样",
      reflection: "焦点以内只有反向延长线相交，光屏接不到虚像。",
    });
    await completeLensExperimentCycle(page, {
      predictOutcome: "还能接到实像，像会更大、更远",
      reason: "我预计整幅像还在，只是可能更暗。",
      screen: "光屏接到清晰像",
      sizeOrCover: "整幅像还在，通常更暗",
      comparison: "基本一样",
      reflection: "透镜不是把像按上下拼起来的，整幅像还在。",
    });

    await expect(
      page.getByRole("heading", { name: lensStageHeading(LearningStage.EXPLAIN) }),
    ).toBeVisible();
    await completeLensExplain(page);

    await expect(page.getByTestId("lens-ray-construction")).toBeVisible();
    await expect(page.getByTestId("lens-model-next")).toBeDisabled();
    await expect(page.getByTestId("lens-model-next-reason")).toContainText("物体相对 F / 2F");
    await completeLensModel(page);
    await completeLensProjectorTransfer(page);
    await completeLensMagnifierTransfer(page);
    await completeLensExam(page);

    await expect(page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.AI_OFF] })).toBeVisible();
    await expectNoTutorChrome(page);
    await expect(page.getByTestId("lens-help-panel")).toHaveCount(0);

    await completeLensAiOff(page);
    await expect(page.getByTestId("lens-complete")).toBeVisible();
  });

  test("Back / revisit does not mutate authoritative experiment progress", async ({ page }) => {
    test.setTimeout(180_000);
    await openLensLab(page);
    await startLensLesson(page);
    await completeLensObserve(page);
    await completeLensDescribe(page);
    await completeLensPredictA(page);
    await performVisibleTrialIntervention(page);
    await page.getByRole("radio", { name: /光屏接到清晰像/ }).click();
    await page.getByRole("radio", { name: /看见的像更大/ }).click();
    await page.getByRole("button", { name: LENS_COPY.observeSubmitExperiment }).click();

    await page.getByRole("button", { name: STUDENT_CHROME.backAria }).click();
    await expect(page.getByTestId("lens-review-banner")).toBeVisible();
    await page.getByTestId("lens-return-progress").click();
    await expect(page.getByTestId("lens-experiment-task")).toBeVisible();
    await expect(page.getByTestId("lens-compare-surface")).toBeVisible();
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 1 / 4 次验证");
  });
});
