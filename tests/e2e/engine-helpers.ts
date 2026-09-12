import { expect, type Page } from "@playwright/test";

import {
  ENGINE_COPY,
  ENGINE_MODEL_COPY,
  ENGINE_STAGE_PROMPTS,
} from "../../lib/content/four-stroke-engine";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import {
  ENGINE_AI_OFF_CHALLENGE_IDS,
  engineAiOffPostCheckOptions,
  intendedAiOffAnswerId,
  judgmentLabelFor,
} from "../../lib/learning/engine-ai-off";
import {
  ENGINE_EXAM_INTENDED_REPRESENTATION,
  ENGINE_EXAM_PATTERN_IDS,
  engineExamPattern,
  intendedExamModel,
} from "../../lib/learning/engine-exam";
import { ENGINE_TRANSFER_RELATION_IDS, ENGINE_TRANSFER_TARGET_IDS } from "../../lib/learning/engine-transfer";
import { LearningStage } from "../../types/learning";

export const ENGINE_LAB_PATH = "/scenes/four-stroke-engine";

const CHEMICAL = ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal;
const WORK = ENGINE_TRANSFER_RELATION_IDS.internalToWork;
const MECHANICAL = ENGINE_TRANSFER_RELATION_IDS.systemToMechanical;

export async function openEngineLab(page: Page) {
  await page.goto(ENGINE_LAB_PATH);
  await expect(page.getByRole("heading", { name: ENGINE_COPY.headline })).toBeVisible();
}

export async function startEngineLesson(page: Page) {
  await page.getByRole("button", { name: ENGINE_COPY.startCta }).click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.OBSERVE] }),
  ).toBeVisible();
}

export async function completeEngineObserve(page: Page) {
  await page.getByLabel("活塞会上下运动").click();
  await page.getByLabel("有时进气门打开").click();
  await page.getByRole("button", { name: ENGINE_COPY.observeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeVisible();
}

export async function completeEngineDescribe(page: Page) {
  const snapshotA = page.getByTestId("engine-snapshot-a").locator("xpath=ancestor::section[1]");
  await snapshotA.getByRole("radio", { name: "活塞 向下" }).click();
  await snapshotA.getByRole("radio", { name: "进气门 打开" }).click();
  await snapshotA.getByRole("radio", { name: "排气门 关闭" }).click();
  await snapshotA.getByRole("radio", { name: "燃烧 没出现" }).click();

  const snapshotB = page.getByTestId("engine-snapshot-b").locator("xpath=ancestor::section[1]");
  await snapshotB.getByRole("radio", { name: "活塞 向下" }).click();
  await snapshotB.getByRole("radio", { name: "进气门 关闭" }).click();
  await snapshotB.getByRole("radio", { name: "排气门 关闭" }).click();
  await snapshotB.getByRole("radio", { name: "燃烧 出现" }).click();

  await page.getByLabel(ENGINE_COPY.describeQuestion).fill(
    "活塞向下运动，这里发生了燃烧，两个气门都关着。",
  );
  await page.getByRole("button", { name: ENGINE_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeVisible();
}

export async function completeEnginePredictA(page: Page) {
  await page.getByRole("radio", { name: "不能产生主要动力" }).click();
  await page.getByLabel(ENGINE_COPY.reasonLabel).fill(
    "没有燃烧，可能就没有刚才那种主要动力。",
  );
  await page.getByRole("button", { name: ENGINE_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
  ).toBeVisible();
}

export async function completeEngineExperimentA(page: Page) {
  await page.getByTestId("engine-run-experiment").click();
  const observed = page.getByTestId("engine-observed-result");
  await observed.getByRole("radio", { name: "有没有发生燃烧？ 没有" }).click();
  await observed.getByRole("radio", { name: "活塞或机构有没有在运动？ 还在运动" }).click();
  await observed
    .getByRole("radio", { name: "有没有正常的主要动力输出？ 没有正常的主要动力输出" })
    .click();
  await page.getByRole("button", { name: ENGINE_COPY.observeSubmitExperiment }).click();
  await page.getByTestId("engine-comparison").getByRole("radio", { name: "不一样" }).click();
  await page.getByRole("button", { name: ENGINE_COPY.compareSubmit }).click();
  await page.getByLabel(ENGINE_COPY.reflectionA).fill(
    "燃烧对发动机产生动力好像很重要。",
  );
  await page.getByRole("button", { name: ENGINE_COPY.reflectionSubmit }).click();
}

export async function completeEngineExperimentB(page: Page) {
  await expect(page.getByTestId("engine-predict-task")).toBeVisible();
  await page.getByRole("radio", { name: "不能产生主要动力" }).click();
  await page.getByLabel(ENGINE_COPY.reasonLabel).fill(
    "活塞不能动，可能就没有正常输出。",
  );
  await page.getByRole("button", { name: ENGINE_COPY.predictSubmit }).click();
  await page.getByTestId("engine-run-experiment").click();
  const observed = page.getByTestId("engine-observed-result");
  await observed.getByRole("radio", { name: "有没有发生燃烧？ 有" }).click();
  await observed.getByRole("radio", { name: "活塞有没有正常向下运动？ 没有" }).click();
  await observed.getByRole("radio", { name: "动力输出是否成功？ 没有成功" }).click();
  await page.getByRole("button", { name: ENGINE_COPY.observeSubmitExperiment }).click();
  await page.getByTestId("engine-comparison").getByRole("radio", { name: "不一样" }).click();
  await page.getByRole("button", { name: ENGINE_COPY.compareSubmit }).click();
  await page.getByLabel(ENGINE_COPY.reflectionB).fill(
    "燃烧已经发生了，但活塞不能动，所以没有正常输出。",
  );
  await page.getByRole("button", { name: ENGINE_COPY.reflectionSubmit }).click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.EXPLAIN] }),
  ).toBeVisible();
}

export async function completeEngineExplain(page: Page) {
  await page.getByRole("radio", { name: "气缸里的气体" }).click();
  await page.getByRole("radio", { name: "气体变化以后，推动活塞或机械系统" }).click();
  await page
    .getByRole("radio", { name: "气体对机械系统产生了推动，机械部分才得到运动" })
    .click();
  await page.getByLabel(ENGINE_COPY.explainOwnWords).fill(
    "燃烧以后气体先变了，再推动活塞。",
  );
  await page.getByRole("button", { name: ENGINE_COPY.explainSubmit }).click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.MODEL] }),
  ).toBeVisible();
}

export async function completeEngineModel(page: Page) {
  await page.getByTestId("engine-model-node-fuel-chemical-energy").click();
  await page.getByTestId("engine-model-slot-0").click();
  await page.getByTestId("engine-model-node-working-gas-internal-energy-or-state").click();
  await page.getByTestId("engine-model-slot-1").click();
  await page.getByTestId("engine-model-node-mechanical-system").click();
  await page.getByTestId("engine-model-slot-2").click();
  await page.getByTestId("engine-model-node-mechanical-energy").click();
  await page.getByTestId("engine-model-slot-3").click();
  await page
    .getByTestId("engine-model-relation-0")
    .getByRole("button", { name: ENGINE_MODEL_COPY.relationConversion })
    .click();
  await page
    .getByTestId("engine-model-relation-1")
    .getByRole("button", { name: ENGINE_MODEL_COPY.relationWork })
    .click();
  await page
    .getByTestId("engine-model-relation-2")
    .getByRole("button", { name: ENGINE_MODEL_COPY.relationGains })
    .click();
  await page.getByTestId("engine-model-combustion-enable").click();
  await page.getByRole("button", { name: ENGINE_MODEL_COPY.submit }).click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.TRANSFER] }),
  ).toBeVisible();
}

export async function completeEngineTransfer(page: Page) {
  await expect(page.getByTestId("engine-transfer-task")).toHaveAttribute(
    "data-target",
    ENGINE_TRANSFER_TARGET_IDS.motorcycle,
  );
  await page.getByTestId(`engine-transfer-applies-${CHEMICAL}`).click();
  await page.getByTestId(`engine-transfer-applies-${WORK}`).click();
  await page.getByTestId(`engine-transfer-applies-${MECHANICAL}`).click();
  await page.getByTestId(`engine-transfer-order-${CHEMICAL}`).click();
  await page.getByTestId(`engine-transfer-order-${WORK}`).click();
  await page.getByTestId(`engine-transfer-order-${MECHANICAL}`).click();
  await page.getByTestId("engine-transfer-explanation").fill(
    "汽油燃烧后工作气体的状态变了，再推动机械部分，车子得到机械能。",
  );
  await page.getByTestId("engine-transfer-submit").click();

  await expect(page.getByTestId("engine-transfer-task")).toHaveAttribute(
    "data-target",
    ENGINE_TRANSFER_TARGET_IDS.steam,
  );
  await page.getByTestId(`engine-transfer-not-${CHEMICAL}`).click();
  await page.getByTestId(`engine-transfer-applies-${WORK}`).click();
  await page.getByTestId(`engine-transfer-applies-${MECHANICAL}`).click();
  await page.getByTestId("engine-transfer-explanation").fill(
    "后面的关系还可以用，但前面的能量来源不一定相同。",
  );
  await page.getByTestId("engine-transfer-submit").click();
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.EXAM] }),
  ).toBeVisible();
}

export async function completeEngineExam(page: Page) {
  for (const patternId of ENGINE_EXAM_PATTERN_IDS) {
    const pattern = engineExamPattern(patternId);
    if (!pattern) {
      throw new Error(`Missing exam pattern ${patternId}`);
    }
    await expect(page.getByTestId("engine-exam-world")).toHaveAttribute(
      "data-pattern",
      patternId,
    );
    await page
      .getByRole("radio", { name: ENGINE_EXAM_INTENDED_REPRESENTATION[patternId] })
      .click();
    await page.getByTestId("engine-exam-continue-model").click();
    await page.getByRole("radio", { name: intendedExamModel(pattern) }).click();
    await page.getByTestId("engine-exam-reveal-options").click();
    await page.getByRole("radio", { name: pattern.correctAnswer }).click();
    await page.getByRole("textbox").fill(
      "燃烧后气体状态变了，再对可以运动的部分做功。",
    );
    await page.getByTestId("engine-exam-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.AI_OFF] }),
  ).toBeVisible();
}

export async function completeEngineAiOff(page: Page) {
  for (const challengeId of ENGINE_AI_OFF_CHALLENGE_IDS) {
    await expect(page.getByTestId("engine-ai-off-task")).toHaveAttribute(
      "data-challenge",
      challengeId,
    );
    await page
      .getByRole("radio", { name: judgmentLabelFor(challengeId, intendedAiOffAnswerId(challengeId)) })
      .click();
    await page.getByRole("textbox").fill(
      challengeId === ENGINE_AI_OFF_CHALLENGE_IDS[1]
        ? "燃烧可以发生，气体也会变热，但机械卡住后没法做功，所以不能按原来方式输出。"
        : "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
    );
    await page.getByTestId("engine-ai-off-commit").click();
    await expect(page.getByTestId("engine-ai-off-post-check")).toBeVisible();
    for (const option of engineAiOffPostCheckOptions(challengeId)) {
      if (option.required) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByTestId("engine-ai-off-post-check-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: ENGINE_STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
}

export async function expectNoTutorChrome(page: Page) {
  await expect(page.getByText(STUDENT_CHROME.tutorName)).toHaveCount(0);
  await expect(page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveCount(0);
}
