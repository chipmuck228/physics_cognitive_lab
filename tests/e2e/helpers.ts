import { expect, type Page } from "@playwright/test";

import {
  MICROWAVE_CHANGE_OPTIONS,
  MICROWAVE_EXPLAIN_ENERGY_OPTIONS,
  MICROWAVE_EXPLAIN_LINK_OPTIONS,
  MICROWAVE_MODEL_CONDITION_OPTIONS,
  MICROWAVE_MODEL_DISTINCTION_OPTIONS,
  MICROWAVE_MODEL_ENERGY_OPTIONS,
  MICROWAVE_MODEL_INTERNAL_OPTIONS,
  MICROWAVE_MODEL_SYSTEM_OPTIONS,
  MICROWAVE_MODEL_TEMPERATURE_OPTIONS,
  MICROWAVE_OBJECT_OPTIONS,
  MICROWAVE_OBSERVE_OPTIONS,
  MICROWAVE_QUANTITY_OPTIONS,
  MICROWAVE_TASK_COPY,
  MICROWAVE_TRANSFER_RELATIONS,
  SCENE_COPY,
  STAGE_PROMPTS,
} from "../../lib/content/microwave-bread";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { examPatterns } from "../../content/physics-models/energy-internal-energy-temperature/exam";
import { energyInternalEnergyTemperatureAssessmentOverlay } from "../../content/physics-models/energy-internal-energy-temperature/assessment-overlay";
import {
  PRODUCTION_EXAM_PATTERN_IDS,
  PRODUCTION_TRANSFER_REQUIRED_IDS,
} from "../../content/physics-models/energy-internal-energy-temperature/implementation-contract";
import { independentChallenges } from "../../content/physics-models/energy-internal-energy-temperature/independent-challenges";
import { LearningStage } from "../../types/learning";

export const LAB_PATH = "/scenes/microwave-bread";

export async function openLab(page: Page) {
  await page.goto(LAB_PATH);
  await expect(page.getByRole("heading", { name: SCENE_COPY.headline })).toBeVisible();
}

export async function startLesson(page: Page) {
  await page.getByRole("button", { name: STUDENT_CHROME.startAria, exact: true }).click();
  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.OBSERVE] }),
  ).toBeVisible();
}

export async function completeObserve(page: Page) {
  await page.getByRole("button", { name: SCENE_COPY.heatingCta }).click();
  await expect(page.getByText(SCENE_COPY.observeQuestion)).toBeVisible();
  await page.getByRole("radio", { name: MICROWAVE_OBSERVE_OPTIONS[0].label }).click();
  await page.getByLabel(SCENE_COPY.observePrompt).fill("面包摸起来更热了。");
  await page.getByRole("button", { name: SCENE_COPY.observeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeVisible();
}

export async function completeDescribe(page: Page) {
  await page.getByRole("radio", { name: MICROWAVE_OBJECT_OPTIONS[0].label }).click();
  await page.getByRole("radio", { name: MICROWAVE_QUANTITY_OPTIONS[0].label }).click();
  await page.getByRole("radio", { name: MICROWAVE_CHANGE_OPTIONS[0].label }).click();
  await page.getByLabel(SCENE_COPY.describeQuestion).fill("面包的温度升高了。");
  await page.getByRole("button", { name: SCENE_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeVisible();
}

export async function completePredict(page: Page) {
  await page.getByRole("radio", { name: "温度会升高。" }).click();
  await page.getByLabel(SCENE_COPY.whyGuess).fill("加热更久，进入面包的能量会更多。");
  await page.getByRole("button", { name: SCENE_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
  ).toBeVisible();
}

export async function completeExperiment(page: Page) {
  await page.getByRole("button", { name: SCENE_COPY.heatAgainCta }).click();
  await expect(page.getByText(SCENE_COPY.experimentReflectionQuestion)).toBeVisible();
  await page.getByRole("radio", { name: "和我猜的一样。" }).click();
  await page
    .getByLabel(SCENE_COPY.experimentReflectionQuestion)
    .fill("再做一次后，能量更多，面包更热。");
  await page.getByRole("button", { name: SCENE_COPY.experimentSubmit }).click();
  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.EXPLAIN] }),
  ).toBeVisible();
}

export async function completeExplain(page: Page) {
  await page.getByRole("radio", { name: MICROWAVE_EXPLAIN_ENERGY_OPTIONS[0].label }).click();
  await page.getByRole("radio", { name: MICROWAVE_EXPLAIN_LINK_OPTIONS[1].label }).click();
  await page
    .getByLabel(SCENE_COPY.explainQuestion)
    .fill("能量进入面包后，面包的内能发生了变化，温度升高。");
  await page.getByRole("button", { name: SCENE_COPY.explainSubmit }).click();
  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.MODEL] }),
  ).toBeVisible();
}

export async function completeModel(page: Page) {
  await page.getByRole("radio", { name: MICROWAVE_MODEL_SYSTEM_OPTIONS[0].label }).click();
  await page.getByRole("radio", { name: MICROWAVE_MODEL_ENERGY_OPTIONS[0].label }).click();
  await page.getByRole("radio", { name: MICROWAVE_MODEL_INTERNAL_OPTIONS[0].label }).click();
  await page.getByRole("radio", { name: MICROWAVE_MODEL_TEMPERATURE_OPTIONS[0].label }).click();
  await page.getByRole("radio", { name: MICROWAVE_MODEL_DISTINCTION_OPTIONS[0].label }).click();
  await page.getByRole("checkbox", { name: MICROWAVE_MODEL_CONDITION_OPTIONS[0].label }).check();
  await page.getByLabel(MICROWAVE_TASK_COPY.modelAuthoredLabel).fill("温度不是内能。");
  await page.getByRole("button", { name: SCENE_COPY.modelSubmit }).click();
  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.TRANSFER] }),
  ).toBeVisible();
}

async function judgeTransferRelation(
  page: Page,
  relationIndex: number,
  judgment: "applies" | "not-necessarily",
) {
  const relation = MICROWAVE_TRANSFER_RELATIONS[relationIndex];
  const suffix = judgment === "applies" ? "在这里还能用" : "不能原样搬过来";
  await page.getByRole("radio", { name: `${relation.label}：${suffix}` }).click();
}

export async function completeTransfer(page: Page) {
  await page.getByRole("radio", { name: "壶里的水" }).click();
  await page.getByRole("radio", { name: "可以。这是普通加热，没有物态变化。" }).click();
  await judgeTransferRelation(page, 0, "applies");
  await judgeTransferRelation(page, 1, "applies");
  await judgeTransferRelation(page, 2, "not-necessarily");
  await judgeTransferRelation(page, 3, "applies");
  await page
    .getByLabel(SCENE_COPY.yourTake)
    .fill("能量进入壶里的水，水的内能增加，没有物态变化，所以温度升高。");
  await page.getByRole("button", { name: SCENE_COPY.saveSituation }).click();

  await expect(page.getByTestId("microwave-transfer-task")).toHaveAttribute(
    "data-target",
    PRODUCTION_TRANSFER_REQUIRED_IDS[1],
  );
  await page.getByRole("radio", { name: "可以有能量进入。" }).click();
  await page.getByRole("radio", { name: "内能或状态仍可以改变。" }).click();
  await page.getByRole("radio", { name: "不能原样搬过来，因为条件不一样。" }).click();
  await judgeTransferRelation(page, 0, "applies");
  await judgeTransferRelation(page, 1, "not-necessarily");
  await judgeTransferRelation(page, 2, "applies");
  await judgeTransferRelation(page, 3, "applies");
  await page
    .getByLabel(SCENE_COPY.yourTake)
    .fill("能量还可以进入冰块，内能或状态可以变，但温度不一定升高。");
  await page.getByRole("button", { name: SCENE_COPY.saveSituation }).click();

  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.EXAM] }),
  ).toBeVisible();
}

export async function answerExamQuestion(
  page: Page,
  input: {
    representation: string;
    model: string;
    answer: string;
    reasoning: string;
    reasoningPrompt: string;
  },
) {
  await expect(page.getByText(SCENE_COPY.examChoose)).toHaveCount(0);
  await page.getByRole("radio", { name: input.representation }).click();
  await page.getByRole("button", { name: SCENE_COPY.examContinueToModel }).click();
  await page.getByRole("radio", { name: input.model }).click();
  await expect(page.getByText(SCENE_COPY.examChoose)).toHaveCount(0);
  await page.getByRole("button", { name: SCENE_COPY.examRevealChoices }).click();
  await page.getByRole("radio", { name: input.answer }).click();
  await page.getByLabel(input.reasoningPrompt).fill(input.reasoning);
  await page.getByRole("button", { name: SCENE_COPY.examSave }).click();
}

export async function completeExam(page: Page) {
  await expect(page.getByLabel(SCENE_COPY.microwaveAria)).toHaveCount(0);

  for (const id of PRODUCTION_EXAM_PATTERN_IDS) {
    const pattern = examPatterns.find((item) => item.id === id);
    const overlay = energyInternalEnergyTemperatureAssessmentOverlay.exam?.[id];
    if (!pattern || !overlay) {
      throw new Error(`Missing exam pattern ${id}`);
    }
    await answerExamQuestion(page, {
      representation: overlay.intendedRepresentation,
      model: overlay.intendedModel,
      answer: pattern.correctAnswer,
      reasoning: `${pattern.requiredReasoning.join("，")}。`,
      reasoningPrompt: pattern.reasoningPrompt,
    });
  }

  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.AI_OFF] }),
  ).toBeVisible();
}

export async function completeIndependentAssessment(page: Page) {
  for (const challenge of independentChallenges) {
    await expect(page.getByText(challenge.question)).toBeVisible();
    const overlay =
      energyInternalEnergyTemperatureAssessmentOverlay.independent?.[challenge.id];
    const correct = overlay?.judgments.find((item) => item.correct);
    if (!correct || !overlay) {
      throw new Error(`Missing overlay for ${challenge.id}`);
    }
    await page.getByRole("radio", { name: correct.label, exact: true }).click();
    const preCommit = page.getByTestId("microwave-ai-off-pre-commit");
    if (challenge.id === "ai-off-unfamiliar-metal-spoon") {
      await preCommit.getByRole("radio", { name: "有能量进入勺子。" }).click();
      await preCommit.getByRole("radio", { name: "勺子的内能发生了变化。" }).click();
      await preCommit
        .getByRole("radio", { name: "温度升高是可以观察的结果，不是内能的另一个名字。" })
        .click();
      await preCommit.getByRole("radio", { name: "热不是装在勺子里的东西。" }).click();
      await page
        .getByLabel(SCENE_COPY.yourIndependentWhy)
        .fill("能量进入勺子，勺子的内能改变，温度升高。温度不是内能，热不是装在勺子里的东西。");
    } else {
      await preCommit.getByRole("radio", { name: "仍然可以有能量进入。" }).click();
      await preCommit.getByRole("radio", { name: "能量进入，温度不一定升高。" }).click();
      await preCommit
        .getByRole("radio", { name: "不能。温度几乎不变，不能直接写成内能一定不变。" })
        .click();
      await page
        .getByLabel(SCENE_COPY.yourIndependentWhy)
        .fill("能量还可以进入冰块，内能或状态可以变，但温度不一定升高。");
    }
    await page.getByRole("button", { name: SCENE_COPY.independentExplainSubmit }).click();
    for (const option of overlay.postCheck) {
      if (option.required && !option.distractor) {
        await page.getByRole("checkbox", { name: option.label }).check();
      }
    }
    await page.getByRole("button", { name: SCENE_COPY.independentExamSubmit }).click();
  }

  await expect(
    page.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
}
