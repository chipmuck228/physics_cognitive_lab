import { expect, test } from "@playwright/test";

import {
  LENS_COPY,
  LENS_OBSERVE_OPTIONS,
  LENS_OBSERVE_REQUIRED_IDS,
  LENS_STAGE_PROMPTS,
  lensModelRepairLabel,
} from "../../lib/content/convex-lens-optical-bench";
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
  fillOneRay,
  lensStageHeading,
  openLensLab,
  performVisibleTrialIntervention,
  reachLensModel,
  startLensLesson,
} from "./lens-helpers";

test.describe("Scene 07 learner-visible flow", () => {
  test("OBSERVE checkboxes alone cannot skip the bench interaction", async ({ page }) => {
    await openLensLab(page);
    await startLensLesson(page);
    await expect(page.getByTestId("lens-observe-task")).toBeVisible();
    await expect(page.getByTestId("station-hit-between-f-and-2f")).toBeVisible();
    const required = new Set<string>(LENS_OBSERVE_REQUIRED_IDS);
    for (const option of LENS_OBSERVE_OPTIONS) {
      if (required.has(option.id)) {
        await page.getByLabel(option.label).click();
      }
    }
    await page.getByRole("button", { name: LENS_COPY.observeSubmit }).click();
    await expect(
      page.getByRole("heading", { name: lensStageHeading(LearningStage.OBSERVE) }),
    ).toBeVisible();
    await expect(page.getByTestId("lens-observe-need-more")).toContainText(
      LENS_COPY.observeNeedInteraction,
    );
    await expect(page.getByTestId("lens-observe-need-more")).not.toContainText("勾下来");
    await page.getByTestId("lens-play-demo").click();
    await page.getByRole("button", { name: LENS_COPY.observeSubmit }).click();
    await expect(
      page.getByRole("heading", { name: lensStageHeading(LearningStage.DESCRIBE) }),
    ).toBeVisible();
  });

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
      sizeOrCover: "有限远处没有完整清晰的像",
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

  test("MODEL blocks an inconsistent ray and offers a repair path after final reject", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    await reachLensModel(page);
    await page.getByRole("radio", { name: /物体在 2F 以外/ }).click();
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第一条光线", {
      kind: "平行主光轴的光线",
      incident: "这是实际光线（实线）",
      before: "到达透镜前：平行主光轴",
      after: "过透镜后：方向不变",
    });
    await expect(page.getByTestId("lens-model-next")).toBeDisabled();
    await expect(page.getByTestId("lens-model-next-reason")).toContainText("走法");
    await expect(page.getByTestId("lens-model-next-reason")).not.toContainText("经过另一侧焦点");

    await fillOneRay(page, "第一条光线", {
      kind: "平行主光轴的光线",
      incident: "这是实际光线（实线）",
      before: "到达透镜前：平行主光轴",
      after: "过透镜后：经过另一侧焦点",
    });
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第二条光线", {
      kind: "过光心的光线",
      incident: "这是实际光线（实线）",
      before: "到达透镜前：朝向光心",
      after: "过透镜后：方向不变",
    });
    await page.getByTestId("lens-model-next").click();
    await page.getByRole("radio", { name: /出射光线真正会聚/ }).click();
    await page.getByTestId("lens-model-next").click();
    await page.getByTestId("lens-model-side").getByRole("radio", { name: /像在透镜另一侧/ }).click();
    await page.getByTestId("lens-model-nature").getByRole("radio", { name: / 实像$/ }).click();
    await page.getByTestId("lens-model-orientation").getByRole("radio", { name: /？ 倒立$/ }).click();
    await page.getByTestId("lens-model-size").getByRole("radio", { name: /？ 比物体大$/ }).click();
    await page.getByTestId("lens-model-receive").getByRole("radio", { name: /光屏放到像的位置可以接到/ }).click();
    await page.getByTestId("lens-model-next").click();
    await page.getByTestId("lens-model-reasoning").fill(
      "物体在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小的实像，光屏放到交点才能接到。",
    );
    await page.getByTestId("lens-model-next").click();
    await expect(page.getByTestId("lens-model-review-ray-a")).toBeVisible();
    await page.getByTestId("lens-model-submit").click();
    await expect(page.getByTestId("lens-model-repair-panel")).toContainText(
      LENS_COPY.modelCannotSubmit,
    );
    await expect(page.getByTestId("lens-model-repair")).toContainText(
      lensModelRepairLabel(5),
    );
    await page.getByTestId("lens-model-repair").click();
    await expect(page.getByTestId("lens-ray-construction")).toHaveAttribute("data-step", "5");
  });

  test("MODEL Step 6 natural wording can be checked without a live LLM", async ({ page }) => {
    test.setTimeout(300_000);
    await page.route("**/api/lens-step6-parse", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          parse: {
            meetingClaim: "actual-convergence",
            imageNatureClaim: "real",
            screenClaim: "receivable",
            hasMeetingClaim: true,
            hasConsequenceClaim: true,
            hasCausalBind: true,
            ambiguity: "none",
          },
        }),
      });
    });
    await reachLensModel(page);
    await page.getByRole("radio", { name: /物体在 2F 以外/ }).click();
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第一条光线", {
      kind: "平行主光轴的光线",
      incident: "这是实际光线（实线）",
      before: "到达透镜前：平行主光轴",
      after: "过透镜后：经过另一侧焦点",
    });
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第二条光线", {
      kind: "过光心的光线",
      incident: "这是实际光线（实线）",
      before: "到达透镜前：朝向光心",
      after: "过透镜后：方向不变",
    });
    await page.getByTestId("lens-model-next").click();
    await page.getByRole("radio", { name: /出射光线真正会聚/ }).click();
    await page.getByTestId("lens-model-next").click();
    await page.getByTestId("lens-model-side").getByRole("radio", { name: /像在透镜另一侧/ }).click();
    await page.getByTestId("lens-model-nature").getByRole("radio", { name: / 实像$/ }).click();
    await page.getByTestId("lens-model-orientation").getByRole("radio", { name: /？ 倒立$/ }).click();
    await page.getByTestId("lens-model-size").getByRole("radio", { name: /比物体小/ }).click();
    await page.getByTestId("lens-model-receive").getByRole("radio", { name: /光屏放到像的位置可以接到/ }).click();
    await page.getByTestId("lens-model-next").click();
    await page.getByTestId("lens-model-reasoning").fill("光线碰到一起，成实像。");
    await page.getByTestId("lens-model-next").click();
    await expect(page.getByTestId("lens-model-review")).toBeVisible();
    await expect(page.getByTestId("lens-ray-construction")).toHaveAttribute("data-step", "7");
  });

  test("MODEL Step 6 parser failure is recoverable and not a false PASS", async ({ page }) => {
    test.setTimeout(300_000);
    await page.route("**/api/lens-step6-parse", async (route) => {
      await route.fulfill({ status: 500, contentType: "application/json", body: "{}" });
    });
    await reachLensModel(page);
    await page.getByRole("radio", { name: /物体在 2F 以外/ }).click();
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第一条光线", {
      kind: "平行主光轴的光线",
      incident: "这是实际光线（实线）",
      before: "到达透镜前：平行主光轴",
      after: "过透镜后：经过另一侧焦点",
    });
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第二条光线", {
      kind: "过光心的光线",
      incident: "这是实际光线（实线）",
      before: "到达透镜前：朝向光心",
      after: "过透镜后：方向不变",
    });
    await page.getByTestId("lens-model-next").click();
    await page.getByRole("radio", { name: /出射光线真正会聚/ }).click();
    await page.getByTestId("lens-model-next").click();
    await page.getByTestId("lens-model-side").getByRole("radio", { name: /像在透镜另一侧/ }).click();
    await page.getByTestId("lens-model-nature").getByRole("radio", { name: / 实像$/ }).click();
    await page.getByTestId("lens-model-orientation").getByRole("radio", { name: /？ 倒立$/ }).click();
    await page.getByTestId("lens-model-size").getByRole("radio", { name: /比物体小/ }).click();
    await page.getByTestId("lens-model-receive").getByRole("radio", { name: /光屏放到像的位置可以接到/ }).click();
    await page.getByTestId("lens-model-next").click();
    await page.getByTestId("lens-model-reasoning").fill("光线碰到一起，成实像。");
    await page.getByTestId("lens-model-next").click();
    await expect(page.getByTestId("lens-model-next-reason")).toContainText(
      LENS_COPY.modelStep6Unclear,
    );
    await expect(page.getByTestId("lens-ray-construction")).toHaveAttribute("data-step", "6");
    await expect(page.getByTestId("lens-model-review")).toHaveCount(0);
  });
});
