import { expect, type Page } from "@playwright/test";

import {
  LENS_COPY,
  LENS_OBSERVE_OPTIONS,
  LENS_OBSERVE_REQUIRED_IDS,
  LENS_STAGE_PROMPTS,
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

export const LENS_LAB_PATH = "/scenes/convex-lens-optical-bench";

export async function openLensLab(page: Page) {
  await page.goto(LENS_LAB_PATH);
  await expect(page.getByRole("heading", { name: LENS_COPY.landingTitle })).toBeVisible();
}

export async function startLensLesson(page: Page) {
  await page.getByRole("button", { name: LENS_COPY.startLesson }).click();
  await expect(
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.OBSERVE] }),
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
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeVisible();
}

export async function completeLensDescribe(page: Page) {
  await page.getByRole("radio", { name: /左边的物体、中间的凸透镜，还有可以移动的光屏/ }).click();
  await page.getByRole("radio", { name: /物体、F \/ 2F、像和光屏要分开认/ }).click();
  await page.getByRole("radio", { name: /我改了物体位置或光屏位置，看见的结果跟着变/ }).click();
  await page.getByLabel(LENS_COPY.describeQuestion).fill("物体、透镜、像和光屏不是同一个东西。");
  await page.getByRole("button", { name: LENS_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeVisible();
}

export async function completeLensPredictA(page: Page) {
  await page.getByRole("radio", { name: /还能接到实像，像会更大、更远/ }).click();
  await page.getByLabel(LENS_COPY.reasonLabel).fill("物体更靠近焦点，我预计像会更大。");
  await page.getByRole("button", { name: LENS_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
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
    await page.getByLabel(LENS_COPY.reasonLabel).fill(input.reason ?? "先猜一次。");
    await page.getByRole("button", { name: LENS_COPY.predictSubmit }).click();
  }
  await page.getByRole("button", { name: LENS_COPY.runExperiment }).click();
  await page.getByRole("radio", { name: new RegExp(input.screen) }).click();
  await page.getByRole("radio", { name: new RegExp(input.sizeOrCover) }).click();
  await page.getByRole("button", { name: LENS_COPY.observeSubmitExperiment }).click();
  await page.getByRole("radio", { name: new RegExp(input.comparison) }).click();
  await page.getByRole("button", { name: LENS_COPY.compareSubmit }).click();
  await page.locator("textarea").last().fill(input.reflection);
  await page.getByRole("button", { name: LENS_COPY.reflectionSubmit }).click();
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
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.MODEL] }),
  ).toBeVisible();
}

export async function completeLensModel(page: Page) {
  await expect(page.getByTestId("lens-ray-construction")).toBeVisible();
  await chooseGroupOption(page, "lens-model-station", /物体在 2F 以外/);
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
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.TRANSFER] }),
  ).toBeVisible();
}

async function fillOneRay(
  page: Page,
  prefix: string,
  labels: { kind: string; incident: string; before: string; after: string },
) {
  await page.getByRole("radio", { name: `${prefix}：这是哪一条光线？ ${labels.kind}` }).click();
  await page
    .getByRole("radio", { name: `${prefix}：这段是实际光线还是反向延长？ ${labels.incident}` })
    .click();
  await page.getByRole("radio", { name: `${prefix}：到达透镜前怎么走？ ${labels.before}` }).click();
  await page.getByRole("radio", { name: `${prefix}：过透镜后怎么走？ ${labels.after}` }).click();
}

export async function completeLensProjectorTransfer(page: Page) {
  await expect(page.getByTestId("lens-transfer-task")).toBeVisible();
  await fillImagingStructure(page, "between-f-and-2f", "lens-transfer");
  await page.getByTestId("lens-transfer-explanation").fill(
    "幻灯片在 F 和 2F 之间，光线真正会聚，所以成倒立放大的实像，幕布放到像的位置才能接到。",
  );
  await page.getByRole("button", { name: LENS_COPY.transferSubmit }).click();
}

export async function completeLensMagnifierTransfer(page: Page) {
  await expect(page.getByTestId("lens-transfer-task")).toBeVisible();
  await fillImagingStructure(page, "inside-f", "lens-transfer");
  await page.getByTestId("lens-transfer-explanation").fill(
    "邮票在焦点以内，光线发散，反向延长线相交，所以是正立放大的虚像，屏接不到。",
  );
  await page.getByRole("button", { name: LENS_COPY.transferSubmit }).click();
  await expect(
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.EXAM] }),
  ).toBeVisible();
}

async function chooseGroupOption(page: Page, groupId: string, name: RegExp) {
  await page.getByTestId(groupId).getByRole("radio", { name }).click();
}

async function fillImagingStructure(
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
      await fillImagingStructure(page, "beyond-2f", "lens-ai-off");
      await page.getByTestId("lens-ai-off-reasoning").fill(
        "窗外景物在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小实像，白卡片是接收器，要放到像的位置才能接到。",
      );
    } else {
      await fillImagingStructure(page, "inside-f", "lens-ai-off");
      await page.getByTestId("lens-ai-off-reasoning").fill(
        "邮票在焦点以内，光线散开，只有反向延长线相交，所以是虚像，白纸接不到。物体正好在焦点上时，出射光线平行，有限远处不成完整的像。",
      );
    }
    await page
      .getByRole("radio", {
        name: lensJudgmentLabelFor(challengeId, intendedLensAiOffAnswerId(challengeId)),
      })
      .click();
    await page.getByTestId("lens-ai-off-commit").click();
    await expect(page.getByTestId("lens-ai-off-post-check")).toBeVisible();
    for (const option of lensAiOffPostCheckOptions(challengeId)) {
      if (option.required && intendedLensAiOffPostCheckIds(challengeId).includes(option.id)) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByTestId("lens-ai-off-post-check").click();
  }
  await expect(
    page.getByRole("heading", { name: LENS_STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
}

export async function expectNoTutorChrome(page: Page) {
  await expect(page.getByText(STUDENT_CHROME.tutorName, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveCount(0);
}
