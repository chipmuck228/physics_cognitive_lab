import { expect, test } from "@playwright/test";

import {
  LENS_AI_OFF_COPY,
  LENS_COPY,
  LENS_OBSERVE_OPTIONS,
  LENS_OBSERVE_REQUIRED_IDS,
  LENS_STAGE_PROMPTS,
  lensModelRepairLabel,
} from "../../lib/content/convex-lens-optical-bench";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  LENS_AI_OFF_CHALLENGE_IDS,
  intendedLensAiOffAnswerId,
  intendedLensAiOffPostCheckIds,
  lensAiOffPostCheckOptions,
  lensJudgmentLabelFor,
} from "../../lib/learning/lens-ai-off";
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
  completeLensPredictNoviceWrongUnknown,
  completeLensProjectorTransfer,
  expectNoTutorChrome,
  fillAiOffCondition,
  fillOneRay,
  fillTransferCondition,
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
    await expect(page.getByTestId("lens-now-do")).toContainText("点物体位置，或移动一次光屏");
    await expect(page.getByTestId("lens-observe-wait-record")).toBeVisible();
    await expect(page.getByTestId("station-hit-between-f-and-2f")).toBeVisible();
    await expect(page.getByRole("button", { name: LENS_COPY.observeSubmit })).toHaveCount(0);
    await page.getByTestId("lens-play-demo").click();
    await expect(page.getByTestId("lens-observe-wait-record")).toBeVisible();
    await page.getByTestId("lens-move-screen").click();
    await expect(page.getByTestId("lens-now-do")).toContainText("勾出你确实看见的变化");
    const required = new Set<string>(LENS_OBSERVE_REQUIRED_IDS);
    for (const option of LENS_OBSERVE_OPTIONS) {
      if (required.has(option.id)) {
        await page.getByLabel(option.label).click();
      }
    }
    await page.getByRole("button", { name: LENS_COPY.observeSubmit }).click();
    await expect(
      page.getByRole("heading", { name: lensStageHeading(LearningStage.DESCRIBE) }),
    ).toBeVisible();
    await expect(page.getByText("你刚在光具座上动过物体或光屏")).toBeVisible();
  });

  test("a novice can ground vocabulary, guess wrongly, and finish four experiment rounds", async ({
    page,
  }) => {
    test.setTimeout(240_000);

    await openLensLab(page);
    await expect(page.getByTestId("lens-vocab-screen")).toBeVisible();
    await expect(page.getByTestId("lens-vocab-screen")).toContainText("白色板");
    await expect(page.getByTestId("lens-now-do")).toContainText("开始观察");
    await startLensLesson(page);

    await expect(page.getByTestId("lens-vocab-F")).toBeVisible();
    await expect(page.getByTestId("lens-vocab-F")).toContainText("认得这个位置");
    await expect(page.getByTestId("lens-vocab-screen")).toBeVisible();
    await expect(page.getByTestId("lens-vocab-image")).toBeVisible();
    await expect(page.getByTestId("lens-vocab-F")).not.toContainText("实像");
    await expect(page.getByTestId("lens-vocab-image")).not.toContainText("虚像");
    await completeLensObserve(page);

    await expect(page.getByTestId("lens-now-do")).toContainText("分开说");
    await page.getByRole("radio", { name: /左边的物体、中间的凸透镜，还有可以移动的光屏/ }).click();
    await page.getByRole("radio", { name: /物体、F \/ 2F、像和光屏要分开认/ }).click();
    await page.getByRole("radio", { name: /我改了物体位置或光屏位置，看见的结果跟着变/ }).click();
    await page.getByLabel(LENS_COPY.describeQuestion).fill("物体和屏不是一个");
    await page.getByRole("button", { name: LENS_COPY.describeSubmit }).click();

    await completeLensPredictNoviceWrongUnknown(page);
    await expect(page.getByTestId("lens-now-do")).toContainText("把物体移到 F 和 2F 之间");
    await expect(page.getByTestId("lens-next-action")).toBeVisible();
    await performVisibleTrialIntervention(page);
    await expect(page.getByTestId("lens-now-do")).toContainText("记下你看见的");
    await expect(page.getByTestId("lens-experiment-completion")).toBeVisible();
    await page.getByTestId("lens-experiment-look-screen").click();
    await expect(page.getByTestId("lens-action-response-message")).toContainText("光屏");
    await page.getByRole("radio", { name: /光屏接到清晰像/ }).click();
    await page.getByRole("radio", { name: /看见的像更大/ }).click();
    await page.getByRole("button", { name: LENS_COPY.observeSubmitExperiment }).click();
    await expect(page.getByTestId("lens-now-do")).toContainText("对照一下");
    await page.getByRole("radio", { name: /不一样/ }).click();
    await page.getByRole("button", { name: LENS_COPY.compareSubmit }).click();
    await expect(page.getByTestId("lens-now-do")).toContainText("自己的话");
    await page.locator("textarea").last().fill("我刚才猜错了，光屏上还是出现了清楚的图样。");
    await page.getByRole("button", { name: LENS_COPY.reflectionSubmit }).click();
    await expect(page.getByTestId("lens-now-do")).toContainText("开始下一次");
    await page.getByTestId("lens-start-next-trial").click();

    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 2 / 4 次");
    await expect(page.getByTestId("lens-now-do")).toContainText("现在不用答对");
    await completeLensExperimentCycle(page, {
      predictOutcome: "光屏接不到清晰像",
      reason: "我还不确定，先试试看。",
      screen: "怎么移光屏都接不到",
      sizeOrCover: "有限远处没有完整清晰的像",
      comparison: "基本一样",
      reflection: "有限远处不相交，不要把它说成又一种普通成像。",
    });
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 3 / 4 次");
    await completeLensExperimentCycle(page, {
      predictOutcome: "光屏接不到清晰像",
      reason: "物体在焦点以内，我预计光屏接不到。",
      screen: "怎么移光屏都接不到",
      sizeOrCover: "看见的像更大",
      comparison: "基本一样",
      reflection: "焦点以内只有反向延长线相交，光屏接不到虚像。",
    });
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 4 / 4 次");
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
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 1 / 4 次");
    await expect(page.getByTestId("lens-now-do")).toContainText("把物体移到 F 和 2F 之间");
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
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 2 / 4 次");
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
    await expect(page.getByTestId("lens-trial-progress")).toContainText("第 1 / 4 次");
  });

  test("MODEL blocks an inconsistent ray and offers a repair path after final reject", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    await reachLensModel(page);
    await page.getByRole("radio", { name: /物体在 2F 以外/ }).click();
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第一条光线", {
      kind: "平行主光轴",
      after: "过透镜后：方向不变",
    });
    await expect(page.getByTestId("lens-model-next")).toBeDisabled();
    await expect(page.getByTestId("lens-model-next-reason")).toContainText("走法");
    await expect(page.getByTestId("lens-model-next-reason")).not.toContainText("经过另一侧焦点");

    await fillOneRay(page, "第一条光线", {
      kind: "平行主光轴",
      after: "过透镜后：经过另一侧焦点",
    });
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第二条光线", {
      kind: "过光心",
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
      kind: "平行主光轴",
      after: "过透镜后：经过另一侧焦点",
    });
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第二条光线", {
      kind: "过光心",
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
      kind: "平行主光轴",
      after: "过透镜后：经过另一侧焦点",
    });
    await page.getByTestId("lens-model-next").click();
    await fillOneRay(page, "第二条光线", {
      kind: "过光心",
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

  test("TRANSFER uses one condition, a natural paraphrase, and stays repairable when rejected", async ({
    page,
  }) => {
    test.setTimeout(300_000);
    await page.route("**/api/lens-step6-parse", async (route) => {
      const posted = route.request().postDataJSON() as { text?: string };
      const text = posted?.text ?? "";
      const virtual = /虚像|反向|散开|往回/.test(text);
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          parse: virtual
            ? {
                meetingClaim: "backward-extension",
                imageNatureClaim: "virtual",
                screenClaim: "not-receivable",
                hasMeetingClaim: true,
                hasConsequenceClaim: true,
                hasCausalBind: true,
                ambiguity: "none",
              }
            : {
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
    await completeLensModel(page);
    await expect(page.getByTestId("lens-transfer-task")).toBeVisible();
    await expect(page.getByTestId("lens-transfer-progress")).toHaveText("第 1 / 2 个新情境");
    await expect(page.getByText(LENS_COPY.transferOwnWords)).toBeVisible();
    await expect(page.getByText(LENS_COPY.transferConditionQuestion)).toBeVisible();
    await expect(page.getByTestId("lens-transfer-model-link")).toBeVisible();
    await expect(page.getByTestId("lens-transfer-meeting")).toHaveCount(0);
    await expect(page.getByTestId("lens-transfer-nature")).toHaveCount(0);

    await fillTransferCondition(page, "between-f-and-2f");
    const recap = page.getByTestId("lens-transfer-recap");
    await expect(recap).toContainText(LENS_COPY.transferJudgmentTitle);
    await expect(recap).toContainText("物体在 F 和 2F 之间");

    const explanation = page.getByTestId("lens-transfer-explanation");
    await explanation.fill("都有凸透镜，所以一样。");
    await page.getByTestId("lens-transfer-surface-cue").check();
    await expect(explanation).toHaveValue("都有凸透镜，所以一样。");
    await page.getByRole("button", { name: LENS_COPY.transferSubmit }).click();
    await expect(page.getByTestId("lens-transfer-repair")).toHaveText(LENS_COPY.transferSloganOnly);
    await expect(page.getByTestId("lens-transfer-progress")).toHaveText("第 1 / 2 个新情境");
    await expect(page.getByTestId("lens-action-response")).toHaveCount(0);

    await explanation.fill("光穿过透镜以后在另一边碰到了一起，所以成了实像。");
    await expect(page.getByTestId("lens-transfer-repair")).toHaveCount(0);
    await page.getByRole("button", { name: LENS_COPY.transferSubmit }).click();
    await expect(page.getByTestId("lens-transfer-repair")).toHaveCount(0);
    await expect(page.getByTestId("lens-transfer-progress")).toHaveText("第 2 / 2 个新情境");
    await expect(page.getByText(LENS_COPY.transferFirstSaved)).toBeVisible();
    await expect(page.getByTestId("lens-transfer-task")).toHaveAttribute(
      "data-target",
      "far-magnifying-glass-virtual",
    );

    await fillTransferCondition(page, "inside-f");
    await page.getByTestId("lens-transfer-explanation").fill(
      "这里物体在焦点里面，出来的光是散开的，往回延长才碰到，所以看到的是虚像。",
    );
    await page.getByRole("button", { name: LENS_COPY.transferSubmit }).click();
    await expect(
      page.getByRole("heading", { name: lensStageHeading(LearningStage.EXAM) }),
    ).toBeVisible();
  });

  test("AI_OFF precommit repair returns to the restored judgment", async ({ page }) => {
    test.setTimeout(300_000);
    const challengeId = LENS_AI_OFF_CHALLENGE_IDS[0]!;
    await reachLensModel(page);
    await completeLensModel(page);
    await completeLensProjectorTransfer(page);
    await completeLensMagnifierTransfer(page);
    await completeLensExam(page);
    await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute("data-challenge", challengeId);
    await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "response");

    await fillAiOffCondition(page, "beyond-2f");
    await page.getByTestId("lens-ai-off-reasoning").fill(
      "这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。",
    );
    await page.getByRole("radio", { name: /只能透过透镜看到虚像/ }).click();
    await page.route("**/api/lens-step6-parse", async (route) => {
      const posted = route.request().postDataJSON() as { text?: string };
      const text = posted?.text ?? "";
      const virtual = /虚像|反向|散开|往回/.test(text);
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          parse: virtual
            ? {
                meetingClaim: "backward-extension",
                imageNatureClaim: "virtual",
                screenClaim: "not-receivable",
                hasMeetingClaim: true,
                hasConsequenceClaim: true,
                hasCausalBind: true,
                ambiguity: "none",
              }
            : {
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
    await page.getByTestId("lens-ai-off-commit").click();
    await expect(page.getByTestId("lens-ai-off-post-check")).toBeVisible();

    for (const option of lensAiOffPostCheckOptions(challengeId)) {
      if (option.required && intendedLensAiOffPostCheckIds(challengeId).includes(option.id)) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit }).click();
    await expect(page.getByTestId("lens-ai-off-repair")).toContainText(/判断和理由/);
    await expect(page.getByRole("button", { name: LENS_AI_OFF_COPY.editJudgment })).toBeVisible();
    await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute("data-challenge", challengeId);

    await page.getByRole("button", { name: LENS_AI_OFF_COPY.editJudgment }).click();
    await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "response");
    await expect(page.getByTestId("lens-ai-off-commit")).toBeVisible();
    await expect(page.getByTestId("lens-ai-off-station").locator("input:checked")).toHaveAttribute(
      "value",
      "beyond-2f",
    );
    await expect(page.getByRole("radio", { name: /只能透过透镜看到虚像/ })).toBeChecked();
    await expect(page.getByTestId("lens-ai-off-reasoning")).toHaveValue(/碰到了一起/);
    await expect(page.getByTestId("lens-ai-off-meeting")).toHaveCount(0);

    await page
      .getByRole("radio", {
        name: lensJudgmentLabelFor(challengeId, intendedLensAiOffAnswerId(challengeId)),
      })
      .click();
    await expect(page.getByTestId("lens-ai-off-station").locator("input:checked")).toHaveAttribute(
      "value",
      "beyond-2f",
    );
    await page.getByTestId("lens-ai-off-commit").click();
    await expect(page.getByTestId("lens-ai-off-post-check")).toBeVisible();
    for (const option of lensAiOffPostCheckOptions(challengeId)) {
      if (option.required && intendedLensAiOffPostCheckIds(challengeId).includes(option.id)) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit }).click();
    await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_CHALLENGE_IDS[1]!,
    );
    await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "response");

    const secondId = LENS_AI_OFF_CHALLENGE_IDS[1]!;
    await fillAiOffCondition(page, "inside-f");
    await page
      .getByRole("radio", {
        name: lensJudgmentLabelFor(secondId, intendedLensAiOffAnswerId(secondId)),
      })
      .click();
    await page.getByTestId("lens-ai-off-reasoning").fill(
      "出来以后还是散开的，往回画才碰到，所以只能看到虚像，白纸接不到。物体正好在焦点上时，有限远处不成完整的像。",
    );
    await page.getByTestId("lens-ai-off-commit").click();
    await expect(page.getByTestId("lens-ai-off-post-check")).toBeVisible();
    for (const option of lensAiOffPostCheckOptions(secondId)) {
      if (option.required && intendedLensAiOffPostCheckIds(secondId).includes(option.id)) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit }).click();
    await expect(page.getByTestId("lens-complete")).toBeVisible();
    await expectNoTutorChrome(page);
  });
});
