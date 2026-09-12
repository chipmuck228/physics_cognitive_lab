import { expect, type Page } from "@playwright/test";

import {
  HEAT_COPY,
  HEAT_STAGE_PROMPTS,
} from "../../lib/content/equal-mass-heated-samples";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  HEAT_AI_OFF_CHALLENGE_IDS,
  heatAiOffPostCheckOptions,
  heatJudgmentLabelFor,
  intendedHeatAiOffAnswerId,
} from "../../lib/learning/heat-ai-off";
import {
  HEAT_EXAM_PATTERN_IDS,
  heatExamPattern,
  intendedHeatExamModel,
  intendedHeatExamRepresentation,
} from "../../lib/learning/heat-exam";

export const HEAT_LAB_PATH = "/scenes/equal-mass-heated-samples";

export async function openHeatLab(page: Page) {
  await page.goto(HEAT_LAB_PATH);
  await expect(page.getByRole("heading", { name: HEAT_COPY.headline })).toBeVisible();
}

export async function startHeatLesson(page: Page) {
  await page.getByRole("button", { name: HEAT_COPY.startCta }).click();
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.OBSERVE] }),
  ).toBeVisible();
}

export async function completeHeatObserve(page: Page) {
  await page.getByLabel("两份样品差不多一样多").click();
  await page.getByLabel("加热后，有一份升得更快、更烫").click();
  await page.getByRole("button", { name: HEAT_COPY.observeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeVisible();
}

export async function completeHeatDescribe(page: Page) {
  await page.getByRole("radio", { name: "两份加热样品", exact: true }).click();
  await page.getByRole("radio", { name: "两份差不多一样多", exact: true }).click();
  await page.getByRole("radio", { name: "加热后升温明显不同", exact: true }).click();
  await page.getByLabel(HEAT_COPY.describeQuestion).fill(
    "两份差不多一样多，但沙子升得更快。",
  );
  await page.getByRole("button", { name: HEAT_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeVisible();
}

export async function completeHeatPredictA(
  page: Page,
  outcome = "沙子升得更快、更烫",
) {
  await page.getByRole("radio", { name: outcome, exact: true }).click();
  await page.getByLabel(HEAT_COPY.reasonLabel).fill("质量相同，材料不同，升温可能不同。");
  await page.getByRole("button", { name: HEAT_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
  ).toBeVisible();
}

export async function completeHeatExperimentCycle(
  page: Page,
  input: {
    comparison: string;
    reflection: string;
    predictOutcome?: string;
    reason?: string;
    mass: string;
    energy: string;
    deltaT: string;
  },
) {
  if (input.predictOutcome) {
    await expect(page.getByTestId("heat-predict-task")).toBeVisible();
    await page.getByRole("radio", { name: input.predictOutcome, exact: true }).click();
    await page.getByLabel(HEAT_COPY.reasonLabel).fill(input.reason ?? "再猜一次。");
    await page.getByRole("button", { name: HEAT_COPY.predictSubmit }).click();
  }
  await page.getByTestId("heat-run-experiment").click();
  const observed = page.getByTestId("heat-observed-result");
  await observed
    .getByRole("radio", { name: `${HEAT_COPY.massCompareLabel} ${input.mass}` })
    .click();
  await observed
    .getByRole("radio", { name: `${HEAT_COPY.energyCompareLabel} ${input.energy}` })
    .click();
  await observed
    .getByRole("radio", { name: `${HEAT_COPY.deltaTCompareLabel} ${input.deltaT}` })
    .click();
  await page.getByRole("button", { name: HEAT_COPY.observeSubmitExperiment }).click();
  await page
    .getByTestId("heat-comparison")
    .getByRole("radio", {
      name: `${HEAT_COPY.compareQuestion} ${input.comparison}`,
    })
    .click();
  await page.getByRole("button", { name: HEAT_COPY.compareSubmit }).click();
  await page
    .getByLabel(/这次动手让你看清了什么|同一种材料、能量相近|同样材料、同样质量/)
    .fill(input.reflection);
  await page.getByRole("button", { name: HEAT_COPY.reflectionSubmit }).click();
}

export async function completeHeatExplain(page: Page) {
  await expect(page.getByTestId("heat-explain-task")).toBeVisible();
  await page
    .getByRole("radio", {
      name: "不是同一件事。还要看质量、比热容和升了几度。",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", { name: "比热容更大，升温更小。", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "质量更大，升温更小。", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "加热时间不是能量本身；没有物态变化时才能用这个式子写完升温。",
      exact: true,
    })
    .click();
  await page.getByLabel(HEAT_COPY.explainOwnWords).fill(
    "更烫不等于吸热更多。质量相同、能量相近时比热容大的升得慢；同样能量时质量大的升得慢。时间不是能量。",
  );
  await page.getByRole("button", { name: HEAT_COPY.explainSubmit }).click();
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.MODEL] }),
  ).toBeVisible();
}

export async function completeHeatModel(page: Page) {
  await expect(page.getByTestId("heat-product-board")).toBeVisible();
  await page.getByRole("radio", { name: "比热容 比热容 c", exact: true }).click();
  await page.getByRole("radio", { name: "质量 质量 m", exact: true }).click();
  await page
    .getByRole("radio", { name: "温度变化 温度变化 ΔT", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "得到的能量 吸收或放出的能量 Q", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "同样质量、同样升温 c 更大，需要的能量 Q 更大",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", { name: "同样质量、同样能量 c 更大，ΔT 更小", exact: true })
    .click();
  await page
    .getByRole("radio", {
      name: "同样材料、同样能量 质量更大，ΔT 更小",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "如果只知道温度升了，能不能断定吸收的能量或比热容？ 只知道升温还不够，还要看质量和 Q。",
      exact: true,
    })
    .click();
  await page.getByLabel("这段过程没有物态变化").click();
  await page.getByLabel("加热时间不是 Q 本身").click();
  await page.getByRole("button", { name: HEAT_COPY.modelSubmit }).click();
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.TRANSFER] }),
  ).toBeVisible();
}

export async function completeHeatPotsTransfer(page: Page) {
  await expect(page.getByTestId("heat-transfer-task")).toBeVisible();
  await page
    .getByRole("radio", {
      name: "Q = c m ΔT 仍然可以用来看能量、质量和温度变化 还能用",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "质量和能量相近时，比热容更大则升温更小 还能用",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "材料和能量相同时，质量更大则升温更小 不能直接搬过来",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "只知道更烫，还不能断定吸收的能量 还能用",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "熔化或沸腾时，不能只用这个式子写完全部能量去向 不能直接搬过来",
      exact: true,
    })
    .click();
  await page.getByLabel(HEAT_COPY.transferOwnWords).fill(
    "质量和加热可以看成相同，油的比热容不同，所以升温不同。更烫不等于吸热更多。",
  );
  await page.getByRole("button", { name: HEAT_COPY.transferSubmit }).click();
}

export async function completeHeatIceTransfer(page: Page) {
  await expect(page.getByTestId("heat-transfer-task")).toBeVisible();
  await page
    .getByRole("radio", {
      name: "Q = c m ΔT 仍然可以用来看能量、质量和温度变化 还能用",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "质量和能量相近时，比热容更大则升温更小 不能直接搬过来",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "材料和能量相同时，质量更大则升温更小 不能直接搬过来",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "只知道更烫，还不能断定吸收的能量 还能用",
      exact: true,
    })
    .click();
  await page
    .getByRole("radio", {
      name: "熔化或沸腾时，不能只用这个式子写完全部能量去向 还能用",
      exact: true,
    })
    .click();
  await page.getByRole("radio", { name: "冰水还在熔化，物态在变。", exact: true }).click();
  await page
    .getByRole("radio", { name: "能量仍可能进入，但温度不必继续升。", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "不能只用升温公式写完这段过程。", exact: true })
    .click();
  await page.getByLabel(HEAT_COPY.transferOwnWords).fill(
    "还可能有能量进入，但冰在熔化，没有 ΔT 时不能用这个式子写完这段过程。",
  );
  await page.getByRole("button", { name: HEAT_COPY.transferSubmit }).click();
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.EXAM] }),
  ).toBeVisible();
}

export async function completeHeatExam(page: Page) {
  for (const patternId of HEAT_EXAM_PATTERN_IDS) {
    const pattern = heatExamPattern(patternId);
    if (!pattern) {
      throw new Error(`Missing exam pattern ${patternId}`);
    }
    await expect(page.getByTestId("heat-exam-world")).toHaveAttribute(
      "data-pattern",
      patternId,
    );
    await page
      .getByRole("radio", { name: intendedHeatExamRepresentation(pattern) })
      .click();
    await page.getByTestId("heat-exam-continue-model").click();
    await page.getByRole("radio", { name: intendedHeatExamModel(pattern) }).click();
    await page.getByTestId("heat-exam-reveal-options").click();
    await page.getByRole("radio", { name: pattern.correctAnswer }).click();
    await page.getByRole("textbox").fill(
      "温度不是能量。比较时要同时看质量、比热容和温度变化，加热时间不是 Q。",
    );
    await page.getByTestId("heat-exam-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.AI_OFF] }),
  ).toBeVisible();
}

export async function completeHeatAiOff(page: Page) {
  for (const challengeId of HEAT_AI_OFF_CHALLENGE_IDS) {
    await expect(page.getByTestId("heat-ai-off-task")).toHaveAttribute(
      "data-challenge",
      challengeId,
    );
    await page
      .getByRole("radio", {
        name: heatJudgmentLabelFor(challengeId, intendedHeatAiOffAnswerId(challengeId)),
      })
      .click();
    if (challengeId === HEAT_AI_OFF_CHALLENGE_IDS[1]) {
      const probes = page.getByTestId("heat-ai-off-pre-commit-probes");
      await probes.getByRole("radio", { name: "冰水还在熔化，物态在变。", exact: true }).click();
      await probes
        .getByRole("radio", { name: "能量仍可能进入，但温度不必继续升。", exact: true })
        .click();
      await probes
        .getByRole("radio", { name: "不能只用升温公式写完这段过程。", exact: true })
        .click();
    }
    await page.getByRole("textbox").fill(
      challengeId === HEAT_AI_OFF_CHALLENGE_IDS[1]
        ? "加热器仍可能把能量送进冰袋。冰在熔化，温度几乎不变，不能只用升温公式写完。"
        : "两个饭盒质量几乎相同，加热时间只说明能量可以看成相近。材料比热容不同，所以温度变化不同。",
    );
    await page.getByTestId("heat-ai-off-commit").click();
    await expect(page.getByTestId("heat-ai-off-post-check")).toBeVisible();
    for (const option of heatAiOffPostCheckOptions(challengeId)) {
      if (option.required) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByTestId("heat-ai-off-post-check-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: HEAT_STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
}

export async function expectNoTutorChrome(page: Page) {
  await expect(page.getByText(STUDENT_CHROME.tutorName, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveCount(
    0,
  );
}
