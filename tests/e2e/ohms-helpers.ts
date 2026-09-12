import { expect, type Page } from "@playwright/test";

import {
  OHMS_COPY,
  OHMS_STAGE_PROMPTS,
  OHMS_TRANSFER_RELATIONS,
} from "../../lib/content/simple-resistor-circuit";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  OHMS_AI_OFF_CHALLENGE_IDS,
  intendedOhmsAiOffAnswerId,
  ohmsAiOffPostCheckOptions,
  ohmsJudgmentLabelFor,
} from "../../lib/learning/ohms-ai-off";
import {
  OHMS_EXAM_PATTERN_IDS,
  intendedOhmsExamModel,
  intendedOhmsExamRepresentation,
  officialExamCalculationAnswer,
  ohmsExamPattern,
} from "../../lib/learning/ohms-exam";

export const OHMS_LAB_PATH = "/scenes/simple-resistor-circuit";

export async function openOhmsLab(page: Page) {
  await page.goto(OHMS_LAB_PATH);
  await expect(page.getByRole("heading", { name: OHMS_COPY.landingTitle })).toBeVisible();
}

export async function startOhmsLesson(page: Page) {
  await page.getByRole("button", { name: OHMS_COPY.startLesson }).click();
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.OBSERVE] }),
  ).toBeVisible();
}

export async function completeOhmsObserve(page: Page) {
  await page.getByTestId("ohms-play-demo").click();
  await page.getByLabel("电流、电压、电阻是三个不同的量").click();
  await page.getByLabel("电压或电阻不同时，电流读数可以不同").click();
  await page.getByLabel("断开时电流是 0，但这不等于电源也没有电压").click();
  await page.getByRole("button", { name: OHMS_COPY.observeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeVisible();
}

export async function completeOhmsDescribe(page: Page) {
  await page.getByRole("radio", { name: /一条只含一个电阻的电路/ }).click();
  await page.getByRole("radio", { name: /电流、电压和电阻/ }).click();
  await page.getByRole("radio", { name: /电压或电阻不同时，电流可以不同/ }).click();
  await page.getByLabel(OHMS_COPY.describeQuestion).fill("两边电流、电压、电阻不是同一个数。");
  await page.getByRole("button", { name: OHMS_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeVisible();
}

export async function completeOhmsPredictA(page: Page) {
  await page.getByRole("radio", { name: /电流会变大/ }).click();
  await page.getByLabel(OHMS_COPY.reasonLabel).fill("电阻没变，电压更大，电流应该更大。");
  await page.getByRole("button", { name: OHMS_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
  ).toBeVisible();
}

export async function completeOhmsExperimentCycle(
  page: Page,
  input: {
    held: string;
    current: string;
    comparison: string;
    reflection: string;
    predictOutcome?: string;
    reason?: string;
  },
) {
  if (input.predictOutcome) {
    await expect(page.getByTestId("ohms-predict-task")).toBeVisible();
    await page.getByRole("radio", { name: new RegExp(input.predictOutcome) }).click();
    await page.getByLabel(OHMS_COPY.reasonLabel).fill(input.reason ?? "再猜一次。");
    await page.getByRole("button", { name: OHMS_COPY.predictSubmit }).click();
  }
  await page.getByTestId("ohms-run-experiment").click();
  await page
    .getByRole("radio", { name: `${OHMS_COPY.heldQuantityQuestion} ${input.held}` })
    .click();
  await page
    .getByRole("radio", { name: `${OHMS_COPY.currentChangeQuestion} ${input.current}` })
    .click();
  await page.getByRole("button", { name: OHMS_COPY.observeSubmitExperiment }).click();
  await page
    .getByRole("radio", { name: `${OHMS_COPY.compareQuestion} ${input.comparison}` })
    .click();
  await page.getByRole("button", { name: OHMS_COPY.compareSubmit }).click();
  await page.getByLabel(/这次动手让你看清了/).fill(input.reflection);
  await page.getByRole("button", { name: OHMS_COPY.reflectionSubmit }).click();
}

export async function completeOhmsExplain(page: Page) {
  await expect(page.getByTestId("ohms-explain-task")).toBeVisible();
  await page.getByRole("radio", { name: /不是一回事，是三个不同的量/ }).click();
  await page.getByRole("radio", { name: /电阻可以看成不变时.*电流更大/ }).click();
  await page.getByLabel(OHMS_COPY.explainOwnWords).fill(
    "电阻没变时，电压更大，电流更大。",
  );
  await page.getByRole("button", { name: OHMS_COPY.explainSubmit }).click();
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.MODEL] }),
  ).toBeVisible();
}

export async function completeOhmsModel(page: Page) {
  await expect(page.getByTestId("ohms-relation-board")).toBeVisible();
  await page.getByRole("radio", { name: /通过这段电阻的量是什么？ 电流 I/ }).click();
  await page.getByRole("radio", { name: /这段电阻两端的量是什么？ 电压 U/ }).click();
  await page.getByRole("radio", { name: /这段导体本身的属性是什么？ 电阻 R/ }).click();
  await page.getByRole("radio", { name: /I = U \/ R（同一个关系）/ }).click();
  await page.getByRole("radio", { name: /电阻不变时，电压更大，电流怎样？ 电流更大/ }).click();
  await page.getByRole("radio", { name: /电压不变时，电阻更大，电流怎样？ 电流更小/ }).click();
  await page.getByRole("radio", { name: /这只是同一个关系/ }).click();
  await page.getByRole("radio", { name: /电路闭合，并且电阻可以看成不变/ }).click();
  await page.getByTestId("ohms-model-reasoning").fill(
    "电阻没变的时候，电压更大，电流就更大。换电阻时电压不变，电阻更大电流更小。",
  );
  await page.getByRole("button", { name: OHMS_COPY.modelSubmit }).click();
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.TRANSFER] }),
  ).toBeVisible();
}

export async function completeOhmsWireTransfer(page: Page) {
  await expect(page.getByTestId("ohms-transfer-task")).toBeVisible();
  for (const relation of OHMS_TRANSFER_RELATIONS) {
    const judgment =
      relation.id === "same-relation"
        ? OHMS_COPY.transferApplies
        : OHMS_COPY.transferNotNecessarily;
    await page.getByRole("radio", { name: `${relation.label} ${judgment}` }).click();
  }
  await page.getByLabel(OHMS_COPY.transferOwnWords).fill(
    "电阻没变的时候，电压更大，电流就更大。换更细的电热丝时电压不变，电阻更大电流更小。",
  );
  await page.getByRole("button", { name: OHMS_COPY.transferSubmit }).click();
}

export async function completeOhmsFilamentTransfer(page: Page) {
  await expect(page.getByTestId("ohms-transfer-task")).toBeVisible();
  await page.getByRole("radio", { name: "电阻可能会变", exact: true }).click();
  await page
    .getByRole("radio", { name: "不能，因为电阻不一定还能看成不变", exact: true })
    .click();
  for (const relation of OHMS_TRANSFER_RELATIONS) {
    await page
      .getByRole("radio", {
        name: `${relation.label} ${OHMS_COPY.transferNotNecessarily}`,
      })
      .click();
  }
  await page.getByLabel(OHMS_COPY.transferOwnWords).fill(
    "灯丝发热时电阻可能会变，所以不能再用固定电阻说电流一定跟着电压成正比。",
  );
  await page.getByRole("button", { name: OHMS_COPY.transferSubmit }).click();
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.EXAM] }),
  ).toBeVisible();
}

export async function completeOhmsExam(page: Page) {
  for (const patternId of OHMS_EXAM_PATTERN_IDS) {
    const pattern = ohmsExamPattern(patternId);
    if (!pattern) {
      throw new Error(`Missing exam pattern ${patternId}`);
    }
    await expect(page.getByTestId("ohms-exam-world")).toHaveAttribute(
      "data-pattern",
      patternId,
    );
    await page
      .getByRole("radio", { name: intendedOhmsExamRepresentation(pattern) })
      .click();
    await page.getByTestId("ohms-exam-continue-model").click();
    await page.getByRole("radio", { name: intendedOhmsExamModel(pattern) }).click();
    await page.getByTestId("ohms-exam-reveal-options").click();
    const answer =
      patternId === "exam-calculate-i-from-u-and-r"
        ? officialExamCalculationAnswer()
        : pattern.correctAnswer;
    await page.getByRole("radio", { name: answer }).click();
    await page.getByRole("textbox").fill(
      "电阻没变或电压没变时，用同一个关系看电流。公式变形不是在制造电阻。",
    );
    await page.getByTestId("ohms-exam-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.AI_OFF] }),
  ).toBeVisible();
}

export async function completeOhmsAiOff(page: Page) {
  for (const challengeId of OHMS_AI_OFF_CHALLENGE_IDS) {
    await expect(page.getByTestId("ohms-ai-off-task")).toHaveAttribute(
      "data-challenge",
      challengeId,
    );
    await page
      .getByRole("radio", {
        name: ohmsJudgmentLabelFor(challengeId, intendedOhmsAiOffAnswerId(challengeId)),
      })
      .click();
    const preCommit = page.getByTestId("ohms-ai-off-pre-commit");
    if (challengeId === OHMS_AI_OFF_CHALLENGE_IDS[0]) {
      await preCommit.getByLabel("换更高电压时，电阻可以看成不变").click();
      await preCommit.getByLabel("换更大电阻时，电压可以看成不变").click();
      await page.getByRole("textbox").fill(
        "换更高电压的电池时电阻可以看成不变，电流更大；换更大电阻时电压可以看成不变，电流更小。",
      );
    } else {
      await preCommit.getByLabel("电阻是这段导体的属性").click();
      await preCommit.getByLabel("R = U / I 只是同一个关系").click();
      await page.getByRole("textbox").fill(
        "R = U / I 只是同一个关系。电压变了并没有制造新的电阻，电阻仍可看成不变，电流会变大。",
      );
    }
    await page.getByTestId("ohms-ai-off-commit").click();
    await expect(page.getByTestId("ohms-ai-off-post-check")).toBeVisible();
    for (const option of ohmsAiOffPostCheckOptions(challengeId)) {
      if (option.required) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByTestId("ohms-ai-off-post-check-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: OHMS_STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
}

export async function expectNoTutorChrome(page: Page) {
  await expect(page.getByText(STUDENT_CHROME.tutorName, { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveCount(
    0,
  );
}
