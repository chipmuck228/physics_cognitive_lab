import { expect, type Page } from "@playwright/test";

import {
  SAMPLES_COPY,
  SAMPLES_STAGE_PROMPTS,
} from "../../lib/content/equal-volume-material-samples";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  SAMPLES_AI_OFF_CHALLENGE_IDS,
  intendedSamplesAiOffAnswerId,
  samplesAiOffPostCheckOptions,
  samplesJudgmentLabelFor,
} from "../../lib/learning/samples-ai-off";
import {
  SAMPLES_EXAM_INTENDED_REPRESENTATION,
  SAMPLES_EXAM_PATTERN_IDS,
  intendedSamplesExamModel,
  samplesExamPattern,
} from "../../lib/learning/samples-exam";

export const SAMPLES_LAB_PATH = "/scenes/equal-volume-material-samples";

export async function openSamplesLab(page: Page) {
  await page.goto(SAMPLES_LAB_PATH);
  await expect(page.getByRole("heading", { name: SAMPLES_COPY.headline })).toBeVisible();
}

export async function startSamplesLesson(page: Page) {
  await page.getByRole("button", { name: SAMPLES_COPY.startCta }).click();
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.OBSERVE] }),
  ).toBeVisible();
}

export async function completeSamplesObserve(page: Page) {
  await page.getByLabel("两块看起来差不多一样大").click();
  await page.getByLabel("有一块明显更沉").click();
  await page.getByRole("button", { name: SAMPLES_COPY.observeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeVisible();
}

export async function completeSamplesDescribe(page: Page) {
  await page.getByRole("radio", { name: "两块样品", exact: true }).click();
  await page.getByRole("radio", { name: "看起来大小差不多", exact: true }).click();
  await page.getByRole("radio", { name: "一块明显更沉", exact: true }).click();
  await page.getByLabel(SAMPLES_COPY.describeQuestion).fill(
    "两块看起来差不多大，但一块明显更沉。",
  );
  await page.getByRole("button", { name: SAMPLES_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeVisible();
}

export async function completeSamplesPredictA(
  page: Page,
  outcome = "更沉的那一块密度更大",
) {
  await page.getByRole("radio", { name: outcome, exact: true }).click();
  await page.getByLabel(SAMPLES_COPY.reasonLabel).fill("同样大的时候，更沉的应该更密。");
  await page.getByRole("button", { name: SAMPLES_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
  ).toBeVisible();
}

export async function completeSamplesExperimentCycle(
  page: Page,
  input: {
    kind: "same-volume" | "same-mass" | "cut";
    comparison: string;
    reflection: string;
    predictOutcome?: string;
    reason?: string;
    mass?: string;
    volume?: string;
    density?: string;
  },
) {
  if (input.predictOutcome) {
    await expect(page.getByTestId("samples-predict-task")).toBeVisible();
    await page.getByRole("radio", { name: input.predictOutcome, exact: true }).click();
    await page.getByLabel(SAMPLES_COPY.reasonLabel).fill(input.reason ?? "再猜一次。");
    await page.getByRole("button", { name: SAMPLES_COPY.predictSubmit }).click();
  }
  await page.getByTestId("samples-run-experiment").click();
  const observed = page.getByTestId("samples-observed-result");
  if (input.kind === "cut") {
    await observed
      .getByRole("radio", { name: `切开后，这一半的质量怎样？ ${input.mass}` })
      .click();
    await observed
      .getByRole("radio", { name: `切开后，这一半的体积怎样？ ${input.volume}` })
      .click();
    await observed
      .getByRole("radio", { name: `切开后，这一半的密度怎样？ ${input.density}` })
      .click();
    await observed
      .getByRole("radio", {
        name: `${SAMPLES_COPY.experimentTogetherLabel} 两个量都变小了，而且差不多按同样比例`,
      })
      .click();
  } else {
    await observed
      .getByRole("radio", { name: `质量怎样比？ ${input.mass}` })
      .click();
    await observed
      .getByRole("radio", { name: `体积怎样比？ ${input.volume}` })
      .click();
    await observed
      .getByRole("radio", { name: `密度怎样比？ ${input.density}` })
      .click();
  }
  await page.getByRole("button", { name: SAMPLES_COPY.observeSubmitExperiment }).click();
  await page
    .getByTestId("samples-comparison")
    .getByRole("radio", {
      name: `${SAMPLES_COPY.compareQuestion} ${input.comparison}`,
    })
    .click();
  await page.getByRole("button", { name: SAMPLES_COPY.compareSubmit }).click();
  await page
    .getByLabel(/这次动手让你看清了什么|质量相同、体积不同时|均匀切开以后/)
    .fill(input.reflection);
  await page.getByRole("button", { name: SAMPLES_COPY.reflectionSubmit }).click();
}

export async function completeSamplesExplain(page: Page) {
  await expect(page.getByTestId("samples-explain-task")).toBeVisible();
  await page
    .getByRole("radio", {
      name: "不是同一件事。密度不是“更重”，也不是“更大”。",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", { name: "体积相同，更沉的密度更大。", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "质量相同，占空间更大的密度更小。", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "质量和体积按同样比例变，密度几乎不变。",
      exact: true,
    })
    .click();
  await page.getByLabel(SAMPLES_COPY.explainOwnWords).fill(
    "密度不是更重也不是更大。体积相同时更沉的更密，质量相同时更大的更疏，均匀切开后密度不必变。",
  );
  await page.getByRole("button", { name: SAMPLES_COPY.explainSubmit }).click();
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.MODEL] }),
  ).toBeVisible();
}

export async function completeSamplesModel(page: Page) {
  await expect(page.getByTestId("samples-ratio-board")).toBeVisible();
  await page.getByRole("radio", { name: "上面这个量 质量 m", exact: true }).click();
  await page.getByRole("radio", { name: "下面这个量 体积 V", exact: true }).click();
  await page.getByRole("radio", { name: "得到的量 密度 ρ", exact: true }).click();
  await page
    .getByRole("radio", { name: "同样体积 质量更大，密度更大", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "同样质量 体积更大，密度更小", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "均匀切开 质量和体积同比例变，密度不变", exact: true })
    .click();
  await page.getByRole("radio", { name: "切开后，质量怎样 变小了", exact: true }).click();
  await page.getByRole("radio", { name: "切开后，体积怎样 变小了", exact: true }).click();
  await page
    .getByRole("radio", { name: "切开后，m ÷ V 怎样 比值几乎不变", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "比值为什么可以保持不变？ 质量和体积按同样比例变，所以比值不变",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "如果只知道质量变大了，能不能断定密度一定变大？ 不能。只知道质量变大还不够，还要看体积",
      exact: true,
    })
    .click();
  await page.getByLabel("体积必须大于零，不能只用“看起来很大”代替").click();
  await page.getByLabel("内部均匀时，切开后密度可以保持不变").click();
  await page.getByRole("button", { name: SAMPLES_COPY.modelSubmit }).click();
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.TRANSFER] }),
  ).toBeVisible();
}

export async function completeSamplesCupsTransfer(page: Page) {
  await expect(page.getByTestId("samples-transfer-task")).toBeVisible();
  await page
    .getByRole("radio", { name: "密度是单位体积的质量 还能用", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "体积相同时，质量更大则密度更大 还能用",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "质量相同时，体积更大则密度更小 不能直接搬过来",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", { name: "均匀切开后密度不变 不能直接搬过来", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "单靠密度不能直接说明浮沉 不能直接搬过来",
      exact: true,
    })
    .click();
  await page.getByLabel(SAMPLES_COPY.transferOwnWords).fill(
    "杯子体积相同，水和油质量不同，密度是单位体积的质量。",
  );
  await page.getByRole("button", { name: SAMPLES_COPY.transferSubmit }).click();
}

export async function completeSamplesHollowTransfer(page: Page) {
  await expect(page.getByTestId("samples-transfer-task")).toBeVisible();
  await page
    .getByRole("radio", { name: "密度是单位体积的质量 还能用", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "体积相同时，质量更大则密度更大 不能直接搬过来",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "质量相同时，体积更大则密度更小 不能直接搬过来",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", { name: "均匀切开后密度不变 不能直接搬过来", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "单靠密度不能直接说明浮沉 还能用",
      exact: true,
    })
    .click();
  await page.getByLabel(SAMPLES_COPY.transferOwnWords).fill(
    "外形大小不是密度。空心时外形体积不一定等于材料体积，还是要用质量和体积的比。",
  );
  await page.getByRole("button", { name: SAMPLES_COPY.transferSubmit }).click();
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.EXAM] }),
  ).toBeVisible();
}

export async function completeSamplesExam(page: Page) {
  for (const patternId of SAMPLES_EXAM_PATTERN_IDS) {
    const pattern = samplesExamPattern(patternId);
    if (!pattern) {
      throw new Error(`Missing exam pattern ${patternId}`);
    }
    await expect(page.getByTestId("samples-exam-world")).toHaveAttribute(
      "data-pattern",
      patternId,
    );
    await page
      .getByRole("radio", { name: SAMPLES_EXAM_INTENDED_REPRESENTATION[patternId] })
      .click();
    await page.getByTestId("samples-exam-continue-model").click();
    await page.getByRole("radio", { name: intendedSamplesExamModel(pattern) }).click();
    await page.getByTestId("samples-exam-reveal-options").click();
    await page.getByRole("radio", { name: pattern.correctAnswer }).click();
    await page.getByRole("textbox").fill(
      "密度是单位体积的质量。比较密度必须同时看质量和体积，均匀切开后密度不必变。",
    );
    await page.getByTestId("samples-exam-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.AI_OFF] }),
  ).toBeVisible();
}

export async function completeSamplesAiOff(page: Page) {
  for (const challengeId of SAMPLES_AI_OFF_CHALLENGE_IDS) {
    await expect(page.getByTestId("samples-ai-off-task")).toHaveAttribute(
      "data-challenge",
      challengeId,
    );
    await page
      .getByRole("radio", {
        name: samplesJudgmentLabelFor(
          challengeId,
          intendedSamplesAiOffAnswerId(challengeId),
        ),
      })
      .click();
    await page.getByRole("textbox").fill(
      challengeId === SAMPLES_AI_OFF_CHALLENGE_IDS[1]
        ? "切开后质量和体积都按相同比例变小，m/V 的比值不变，所以密度不变。"
        : "两个包装外形体积几乎相同，更沉的那个单位体积的质量更大，所以密度更大。",
    );
    await page.getByTestId("samples-ai-off-commit").click();
    await expect(page.getByTestId("samples-ai-off-post-check")).toBeVisible();
    for (const option of samplesAiOffPostCheckOptions(challengeId)) {
      if (option.required) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByTestId("samples-ai-off-post-check-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: SAMPLES_STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
}

export async function expectNoTutorChrome(page: Page) {
  await expect(page.getByText(STUDENT_CHROME.tutorName)).toHaveCount(0);
  await expect(page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveCount(
    0,
  );
}
