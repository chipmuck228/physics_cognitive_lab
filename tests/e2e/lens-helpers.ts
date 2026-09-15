import { expect, type Page } from "@playwright/test";

import {
  LENS_COPY,
  LENS_OBSERVE_OPTIONS,
  LENS_OBSERVE_REQUIRED_IDS,
  LENS_STAGE_PROMPTS,
  LENS_TASK_FRAMES,
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
  LENS_EXAM_PATTERN_IDS,
  intendedLensExamModel,
  intendedLensExamRepresentation,
  lensExamPattern,
} from "../../lib/learning/lens-exam";
import { officialImageConsequence } from "../../content/physics-models/convex-lens-imaging/construction";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
} from "../../lib/physics/convex-lens-optical-bench";

export const LENS_LAB_PATH = "/scenes/convex-lens-optical-bench";

export function lensStageHeading(stage: LearningStage): string {
  return LENS_TASK_FRAMES[stage]?.goal ?? LENS_STAGE_PROMPTS[stage];
}

export async function openLensLab(page: Page) {
  await page.goto(LENS_LAB_PATH);
  await expect(page.getByRole("heading", { name: LENS_COPY.landingTitle })).toBeVisible();
}

export async function startLensLesson(page: Page) {
  await page.getByRole("button", { name: LENS_COPY.startLesson }).click();
  await expect(
    page.getByRole("heading", { name: lensStageHeading(LearningStage.OBSERVE) }),
  ).toBeVisible();
}

export async function completeLensObserve(page: Page) {
  await page.getByTestId("lens-play-demo").click();
  await page.getByTestId("lens-move-screen").click();
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
}

export async function completeLensDescribe(page: Page) {
  await page.getByRole("radio", { name: /左边的物体、中间的凸透镜，还有可以移动的光屏/ }).click();
  await page.getByRole("radio", { name: /物体、F \/ 2F、像和光屏要分开认/ }).click();
  await page.getByRole("radio", { name: /我改了物体位置或光屏位置，看见的结果跟着变/ }).click();
  await page.getByLabel(LENS_COPY.describeQuestion).fill("物体、透镜、像和光屏不是同一个东西。");
  await page.getByRole("button", { name: LENS_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: lensStageHeading(LearningStage.PREDICT) }),
  ).toBeVisible();
}

export async function completeLensPredictA(page: Page) {
  await page.getByRole("radio", { name: /还能接到实像，像会更大、更远/ }).click();
  await page.getByRole("radio", { name: LENS_COPY.reasonHasIdea }).click();
  await page.getByLabel(LENS_COPY.reasonLabel).fill("物体更靠近焦点，我预计像会更大。");
  await page.getByRole("button", { name: LENS_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: lensStageHeading(LearningStage.EXPERIMENT) }),
  ).toBeVisible();
}

export async function completeLensPredictNoviceWrongUnknown(page: Page) {
  await expect(page.getByTestId("lens-predict-not-exam")).toBeVisible();
  await expect(page.getByTestId("lens-now-do")).toContainText("现在不用答对");
  await page.getByRole("radio", { name: /光屏接不到清晰像/ }).click();
  await page.getByRole("radio", { name: LENS_COPY.reasonUnknown }).click();
  await expect(page.getByTestId("lens-predict-reason")).toHaveCount(0);
  await page.getByRole("button", { name: LENS_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: lensStageHeading(LearningStage.EXPERIMENT) }),
  ).toBeVisible();
}

export async function completeLensExperimentCycle(
  page: Page,
  input: {
    screen: string;
    sizeOrCover: string;
    comparison: string;
    reflection: string;
    predictOutcome?: string;
    reason?: string;
  },
) {
  if (input.predictOutcome) {
    await expect(page.getByTestId("lens-predict-task")).toBeVisible();
    await page.getByRole("radio", { name: new RegExp(input.predictOutcome) }).click();
    await page.getByRole("radio", { name: LENS_COPY.reasonHasIdea }).click();
    await page.getByLabel(LENS_COPY.reasonLabel).fill(input.reason ?? "先猜一次。");
    await page.getByRole("button", { name: LENS_COPY.predictSubmit }).click();
  }
  await expect(page.getByTestId("lens-experiment-task")).toBeVisible();
  await performVisibleTrialIntervention(page);
  await page.getByRole("radio", { name: new RegExp(input.screen) }).click();
  await page.getByRole("radio", { name: new RegExp(input.sizeOrCover) }).click();
  await page.getByRole("button", { name: LENS_COPY.observeSubmitExperiment }).click();
  await expect(page.getByTestId("lens-compare-surface")).toBeVisible();
  await page.getByRole("radio", { name: new RegExp(input.comparison) }).click();
  await page.getByRole("button", { name: LENS_COPY.compareSubmit }).click();
  await page.locator("textarea").last().fill(input.reflection);
  await page.getByRole("button", { name: LENS_COPY.reflectionSubmit }).click();
  const nextTrial = page.getByTestId("lens-start-next-trial");
  if (await nextTrial.isVisible().catch(() => false)) {
    await nextTrial.click();
  }
}

export async function performVisibleTrialIntervention(page: Page) {
  const cover = page.getByTestId("lens-cover-lens");
  if (await cover.isVisible().catch(() => false)) {
    await expect(page.getByTestId("lens-partial-cover")).toHaveCount(0);
    await cover.click();
    await expect(page.getByTestId("lens-partial-cover")).toBeVisible();
    await expect(page.getByTestId("convex-lens-optical-bench")).toHaveAttribute(
      "data-lens-partially-covered",
      "true",
    );
    await expect(page.getByTestId("convex-lens-optical-bench")).toHaveAttribute(
      "data-cover-complete",
      "true",
    );
    await expect(page.getByTestId("convex-lens-optical-bench")).toHaveAttribute(
      "data-cover-brightness",
      "reduced",
    );
    await expect(page.getByTestId("optical-image")).toBeVisible();
    await expect(page.getByTestId("convex-lens")).toBeAttached();
    return;
  }
  const experiment = await page.getByTestId("lens-experiment-task").getAttribute("data-experiment");
  const station =
    experiment === LENS_EXPERIMENT_A
      ? "between-f-and-2f"
      : experiment === LENS_EXPERIMENT_B
        ? "at-f"
        : experiment === LENS_EXPERIMENT_C
          ? "inside-f"
          : null;
  if (!station) {
    throw new Error(`No visible learner intervention for ${experiment}`);
  }
  await page.getByTestId(`station-hit-${station}`).click();
}

export async function completeLensExplain(page: Page) {
  await expect(page.getByTestId("lens-explain-task")).toBeVisible();
  await page.getByRole("radio", { name: /有的位置上，光线会真正交在一起/ }).click();
  await page.getByRole("radio", { name: /虚像可以看见，但光屏接不到/ }).click();
  await page.getByLabel(LENS_COPY.explainOwnWords).fill(
    "有的位置光线真正会聚，光屏才能接到；焦点以内只有反向延长线相交。",
  );
  await page.getByRole("button", { name: LENS_COPY.explainSubmit }).click();
  await expect(
    page.getByRole("heading", { name: lensStageHeading(LearningStage.MODEL) }),
  ).toBeVisible();
}

export async function reachLensModel(page: Page) {
  await openLensLab(page);
  await startLensLesson(page);
  await completeLensObserve(page);
  await completeLensDescribe(page);
  await completeLensPredictA(page);
  await completeLensExperimentCycle(page, {
    screen: "光屏接到清晰像",
    sizeOrCover: "看见的像更大",
    comparison: "基本一样",
    reflection: "物体更靠近焦点时，像变大变远，不是光屏在制造像。",
  });
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
  await completeLensExplain(page);
  await expect(page.getByTestId("lens-ray-construction")).toBeVisible();
}

export async function completeLensModel(page: Page) {
  await expect(page.getByTestId("lens-ray-construction")).toBeVisible();
  await chooseGroupOption(page, "lens-model-station", /物体在 2F 以外/);
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
  await chooseGroupOption(page, "lens-model-meeting", /出射光线真正会聚/);
  await page.getByTestId("lens-model-next").click();
  await chooseGroupOption(page, "lens-model-side", /像在透镜另一侧/);
  await chooseGroupOption(page, "lens-model-nature", / 实像$/);
  await chooseGroupOption(page, "lens-model-orientation", /？ 倒立$/);
  await chooseGroupOption(page, "lens-model-size", /比物体小/);
  await chooseGroupOption(page, "lens-model-receive", /光屏放到像的位置可以接到/);
  await page.getByTestId("lens-model-next").click();
  await page.getByTestId("lens-model-reasoning").fill(
    "物体在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小的实像，光屏放到交点才能接到。",
  );
  await page.getByTestId("lens-model-next").click();
  await page.getByRole("button", { name: LENS_COPY.modelSubmit }).click();
  await expect(
    page.getByRole("heading", { name: lensStageHeading(LearningStage.TRANSFER) }),
  ).toBeVisible();
}

export async function fillOneRay(
  page: Page,
  prefix: string,
  labels: { kind: string; after: string },
) {
  await page.getByRole("radio", { name: `${prefix}：先选一条要用的特殊光线。 ${labels.kind}` }).click();
  await page
    .getByRole("radio", { name: `${prefix}：经过透镜后，它应该怎样走？ ${labels.after}` })
    .click();
}

export async function fillTransferCondition(
  page: Page,
  station: "beyond-2f" | "between-f-and-2f" | "inside-f",
) {
  const stationLabel =
    station === "beyond-2f"
      ? /物体在 2F 以外/
      : station === "between-f-and-2f"
        ? /物体在 F 和 2F 之间/
        : /物体在焦点以内/;
  await chooseGroupOption(page, "lens-transfer-station", stationLabel);
}

export async function fillAiOffCondition(
  page: Page,
  station: "beyond-2f" | "between-f-and-2f" | "inside-f",
) {
  const stationLabel =
    station === "beyond-2f"
      ? /物体在 2F 以外/
      : station === "between-f-and-2f"
        ? /物体在 F 和 2F 之间/
        : /物体在焦点以内/;
  await chooseGroupOption(page, "lens-ai-off-station", stationLabel);
}

export async function completeLensProjectorTransfer(page: Page) {
  await expect(page.getByTestId("lens-transfer-task")).toBeVisible();
  await expect(page.getByTestId("lens-transfer-progress")).toHaveText("第 1 / 2 个新情境");
  await fillTransferCondition(page, "between-f-and-2f");
  await page.getByTestId("lens-transfer-explanation").fill(
    "幻灯片在 F 和 2F 之间，光线真正会聚，所以成倒立放大的实像，幕布放到像的位置才能接到。",
  );
  await page.getByRole("button", { name: LENS_COPY.transferSubmit }).click();
  await expect(page.getByTestId("lens-transfer-task")).toHaveAttribute(
    "data-target",
    "far-magnifying-glass-virtual",
  );
}

export async function completeLensMagnifierTransfer(page: Page) {
  await expect(page.getByTestId("lens-transfer-task")).toBeVisible();
  await expect(page.getByTestId("lens-transfer-progress")).toHaveText("第 2 / 2 个新情境");
  await expect(page.getByTestId("lens-transfer-task")).toHaveAttribute(
    "data-target",
    "far-magnifying-glass-virtual",
  );
  await fillTransferCondition(page, "inside-f");
  await page.getByTestId("lens-transfer-explanation").fill(
    "邮票在焦点以内，光线发散，反向延长线相交，所以是正立放大的虚像，屏接不到。",
  );
  await page.getByRole("button", { name: LENS_COPY.transferSubmit }).click();
  await expect(
    page.getByRole("heading", { name: lensStageHeading(LearningStage.EXAM) }),
  ).toBeVisible();
}

async function chooseGroupOption(page: Page, groupId: string, name: RegExp) {
  await page.getByTestId(groupId).getByRole("radio", { name }).click();
}

export async function fillImagingStructure(
  page: Page,
  station: "beyond-2f" | "between-f-and-2f" | "inside-f",
  prefix: "lens-transfer" | "lens-ai-off",
) {
  const image = officialImageConsequence(station);
  const stationLabel =
    station === "beyond-2f"
      ? /物体在 2F 以外/
      : station === "between-f-and-2f"
        ? /物体在 F 和 2F 之间/
        : /物体在焦点以内/;
  const meeting =
    station === "inside-f"
      ? /出射光线散开，只有反向延长线相交/
      : /出射光线真正会聚/;
  await chooseGroupOption(page, `${prefix}-station`, stationLabel);
  await chooseGroupOption(page, `${prefix}-meeting`, meeting);
  await chooseGroupOption(
    page,
    `${prefix}-side`,
    image.side === "same-side" ? /像和物体在同一侧/ : /像在透镜另一侧/,
  );
  await chooseGroupOption(
    page,
    `${prefix}-nature`,
    image.nature === "virtual" ? / 虚像$/ : / 实像$/,
  );
  await chooseGroupOption(
    page,
    `${prefix}-orientation`,
    image.orientation === "upright" ? /？ 正立$/ : /？ 倒立$/,
  );
  await chooseGroupOption(
    page,
    `${prefix}-size`,
    image.size === "enlarged" ? /比物体大/ : /比物体小/,
  );
  await chooseGroupOption(
    page,
    `${prefix}-receive`,
    image.screenReceivable ? /可以接到/ : /光屏接不到/,
  );
}

export async function completeLensExam(page: Page) {
  for (const patternId of LENS_EXAM_PATTERN_IDS) {
    const pattern = lensExamPattern(patternId);
    if (!pattern) {
      throw new Error(`Missing exam pattern ${patternId}`);
    }
    await expect(page.getByTestId("lens-exam-world")).toHaveAttribute("data-pattern", patternId);
    if (pattern.format === "diagram") {
      const figure = page.getByTestId("lens-exam-diagram");
      await expect(figure).toBeVisible();
      await expect(page.getByTestId("lens-exam-stem")).toContainText("如图");
      await expect(figure).toHaveAttribute("data-shows-image", "false");
      await expect(figure).toHaveAttribute("data-shows-rays", "false");
      await expect(figure).toHaveAttribute("data-screen-region", "between-f-and-2f");
      await expect(figure).toContainText("物体");
      await expect(figure).toContainText("光屏");
    } else {
      await expect(page.getByTestId("lens-exam-diagram")).toHaveCount(0);
    }
    await page.getByRole("radio", { name: intendedLensExamRepresentation(pattern) }).click();
    await page.getByTestId("lens-exam-continue-model").click();
    await page.getByRole("radio", { name: intendedLensExamModel(pattern) }).click();
    await page.getByTestId("lens-exam-reveal-options").click();
    await page.getByRole("radio", { name: pattern.correctAnswer }).click();
    await page.getByRole("textbox").fill(
      "先判断物体相对 F 和 2F 在哪里，再说光线会不会真正会聚。",
    );
    await page.getByTestId("lens-exam-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.AI_OFF] }),
  ).toBeVisible();
}

export async function completeLensAiOff(page: Page) {
  for (const challengeId of LENS_AI_OFF_CHALLENGE_IDS) {
    await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      challengeId,
    );
    if (challengeId === LENS_AI_OFF_CHALLENGE_IDS[0]) {
      await fillAiOffCondition(page, "beyond-2f");
      await page.getByTestId("lens-ai-off-reasoning").fill(
        "窗外景物在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小实像，白卡片是接收器，要放到像的位置才能接到。",
      );
    } else {
      await fillAiOffCondition(page, "inside-f");
      await page.getByTestId("lens-ai-off-reasoning").fill(
        "邮票在焦点以内，光线散开，只有反向延长线相交，所以是虚像，白纸接不到。物体正好在焦点上时，折射后的光线彼此平行，有限远处不相交，所以光屏怎么移动都接不到清晰像。",
      );
    }
    await page
      .getByRole("radio", {
        name: lensJudgmentLabelFor(challengeId, intendedLensAiOffAnswerId(challengeId)),
      })
      .click();
    await page.getByTestId("lens-ai-off-commit").click();
    await expect(page.getByTestId("lens-ai-off-post-check")).toBeVisible();
    if (challengeId === LENS_AI_OFF_CHALLENGE_IDS[0]) {
      const distractor = lensAiOffPostCheckOptions(challengeId).find((option) => option.id === "surface-slogan");
      await page.getByRole("checkbox", { name: distractor!.label }).click();
      await page.getByRole("button", { name: "记下这次对照" }).click();
      await expect(page.getByTestId("lens-ai-off-repair")).toBeVisible();
      await expect(page.getByTestId("lens-ai-off-repair")).toContainText(/表面上/);
      await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute(
        "data-challenge",
        challengeId,
      );
      await page.getByRole("checkbox", { name: distractor!.label }).click();
    }
    for (const option of lensAiOffPostCheckOptions(challengeId)) {
      if (option.required && intendedLensAiOffPostCheckIds(challengeId).includes(option.id)) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByRole("button", { name: "记下这次对照" }).click();
    if (challengeId === LENS_AI_OFF_CHALLENGE_IDS[0]) {
      await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute(
        "data-challenge",
        LENS_AI_OFF_CHALLENGE_IDS[1],
      );
      await expect(page.getByTestId("lens-ai-off-task")).toHaveAttribute(
        "data-step",
        "response",
      );
      await expect(page.getByTestId("lens-ai-off-post-check")).toHaveCount(0);
    }
  }
  await expect(
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
  await expectNoTutorChrome(page);
}

export async function expectNoTutorChrome(page: Page) {
  await expect(page.getByText(STUDENT_CHROME.tutorName, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveCount(0);
}
