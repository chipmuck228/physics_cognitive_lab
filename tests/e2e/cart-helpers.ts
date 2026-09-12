import { expect, type Page } from "@playwright/test";

import { CART_COPY, CART_STAGE_PROMPTS } from "../../lib/content/horizontal-force-cart";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  CART_AI_OFF_CHALLENGE_IDS,
  cartAiOffPostCheckOptions,
  cartJudgmentLabelFor,
  intendedCartAiOffAnswerId,
} from "../../lib/learning/cart-ai-off";
import {
  CART_EXAM_INTENDED_REPRESENTATION,
  CART_EXAM_PATTERN_IDS,
  cartExamPattern,
  intendedCartExamModel,
} from "../../lib/learning/cart-exam";

export const CART_LAB_PATH = "/scenes/horizontal-force-cart";

export async function openCartLab(page: Page) {
  await page.goto(CART_LAB_PATH);
  await expect(page.getByRole("heading", { name: CART_COPY.headline })).toBeVisible();
}

export async function startCartLesson(page: Page) {
  await page.getByRole("button", { name: CART_COPY.startCta }).click();
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.OBSERVE] }),
  ).toBeVisible();
}

export async function completeCartObserve(page: Page) {
  await page.getByLabel("小车一开始是停着的").click();
  await page.getByLabel("后来它开始运动").click();
  await page.getByRole("button", { name: CART_COPY.observeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeVisible();
}

export async function completeCartDescribe(page: Page) {
  await page.getByRole("radio", { name: "小车", exact: true }).click();
  await page.getByRole("radio", { name: "静止", exact: true }).click();
  await page.getByRole("radio", { name: "向右", exact: true }).click();
  await page.getByRole("radio", { name: "开始运动", exact: true }).click();
  await page.getByLabel(CART_COPY.describeQuestion).fill(
    "小车先停着，后来向右动起来了。",
  );
  await page.getByRole("button", { name: CART_COPY.describeSubmit }).click();
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeVisible();
}

export async function completeCartPredictA(page: Page, outcome = "会越来越快") {
  await page.getByRole("radio", { name: outcome, exact: true }).click();
  await page.getByLabel(CART_COPY.reasonLabel).fill("顺着推，我觉得会更快。");
  await page.getByRole("button", { name: CART_COPY.predictSubmit }).click();
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
  ).toBeVisible();
}

export async function completeCartExperimentCycle(
  page: Page,
  input: {
    speed: string;
    direction: string;
    motion: string;
    comparison: string;
    reflection: string;
    predictOutcome?: string;
    reason?: string;
  },
) {
  if (input.predictOutcome) {
    await expect(page.getByTestId("cart-predict-task")).toBeVisible();
    await page.getByRole("radio", { name: input.predictOutcome, exact: true }).click();
    await page.getByLabel(CART_COPY.reasonLabel).fill(input.reason ?? "再猜一次。");
    await page.getByRole("button", { name: CART_COPY.predictSubmit }).click();
  }
  await page.getByTestId("cart-run-experiment").click();
  const observed = page.getByTestId("cart-observed-result");
  await observed.getByRole("radio", { name: `快慢怎样变了？ ${input.speed}` }).click();
  await observed
    .getByRole("radio", { name: `运动方向有没有变？ ${input.direction}` })
    .click();
  await observed
    .getByRole("radio", { name: `运动状态怎样变了？ ${input.motion}` })
    .click();
  await page.getByRole("button", { name: CART_COPY.observeSubmitExperiment }).click();
  await page.getByTestId("cart-comparison").getByRole("radio", { name: input.comparison, exact: true }).click();
  await page.getByRole("button", { name: CART_COPY.compareSubmit }).click();
  await page.getByLabel(/这次动手让你看清了什么|力顶着运动方向时|合力变为零时/).fill(
    input.reflection,
  );
  await page.getByRole("button", { name: CART_COPY.reflectionSubmit }).click();
}

export async function completeCartExplain(page: Page) {
  await expect(page.getByTestId("cart-explain-task")).toBeVisible();
  await page
    .getByRole("radio", { name: "不是同一件事。有力不等于物体一定在运动。", exact: true })
    .click();
  await page.getByRole("radio", { name: "会加快。", exact: true }).click();
  await page.getByRole("radio", { name: "会减慢。", exact: true }).click();
  await page
    .getByRole("radio", {
      name: "运动状态保持不变。原来在动的，还可以继续动。",
      exact: true,
    })
    .click();
  await page.getByLabel(CART_COPY.explainOwnWords).fill(
    "顺着推会更快，顶着推会更慢，合力为零时原来在动的还可以继续动。",
  );
  await page.getByRole("button", { name: CART_COPY.explainSubmit }).click();
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.MODEL] }),
  ).toBeVisible();
}

export async function completeCartModel(page: Page) {
  await expect(page.getByTestId("cart-model-board")).toBeVisible();
  await fillCartModelCase(page, "顺着推", {
    motion: "正在向右运动",
    force: "合力和运动同一边",
    change: "加快",
  });
  await fillCartModelCase(page, "顶着推", {
    motion: "正在向右运动",
    force: "合力顶着运动方向",
    change: "减慢",
  });
  await fillCartModelCase(page, "合力为零", {
    motion: "正在向右运动",
    force: "水平合力为零",
    change: "保持原来的运动",
  });
  await page.getByLabel("先只看一条水平直线上的运动").click();
  await page.getByLabel("这一模型里轨道摩擦先不算").click();
  await page.getByLabel("合力为零时，运动状态保持不变").click();
  await page.getByRole("button", { name: CART_COPY.modelSubmit }).click();
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.TRANSFER] }),
  ).toBeVisible();
}

async function fillCartModelCase(
  page: Page,
  prefix: string,
  input: { motion: string; force: string; change: string },
) {
  await page
    .getByRole("radio", { name: `${prefix} 现在怎么运动 ${input.motion}`, exact: true })
    .click();
  await page
    .getByRole("radio", { name: `${prefix} 合力怎样 ${input.force}`, exact: true })
    .click();
  await page
    .getByRole("radio", { name: `${prefix} 运动状态怎样变 ${input.change}`, exact: true })
    .click();
}

export async function completeCartBicycleTransfer(page: Page) {
  await expect(page.getByTestId("cart-transfer-task")).toBeVisible();
  await page.getByRole("radio", { name: "合力可以改变运动状态 还能用", exact: true }).click();
  await page
    .getByRole("radio", { name: "合力和运动同一边时会加快 还能用", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "合力顶着运动时会减慢 不能直接搬过来", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "合力为零时运动状态保持不变 不能直接搬过来", exact: true })
    .click();
  await page.getByLabel(CART_COPY.transferOwnWords).fill(
    "人和车同一边蹬，水平合力与运动方向相同，所以会加快。",
  );
  await page.getByRole("button", { name: CART_COPY.transferSubmit }).click();
}

export async function completeCartHoverTransfer(page: Page) {
  await expect(page.getByTestId("cart-transfer-task")).toBeVisible();
  await page
    .getByRole("radio", { name: "合力可以改变运动状态 不能直接搬过来", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "合力和运动同一边时会加快 不能直接搬过来", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "合力顶着运动时会减慢 不能直接搬过来", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "合力为零时运动状态保持不变 还能用", exact: true })
    .click();
  await page.getByLabel(CART_COPY.transferOwnWords).fill(
    "水平合力接近零，原来在滑动的滑块可以保持原来的运动，不必立刻停下。",
  );
  await page.getByRole("button", { name: CART_COPY.transferSubmit }).click();
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.EXAM] }),
  ).toBeVisible();
}

export async function completeCartExam(page: Page) {
  for (const patternId of CART_EXAM_PATTERN_IDS) {
    const pattern = cartExamPattern(patternId);
    if (!pattern) {
      throw new Error(`Missing exam pattern ${patternId}`);
    }
    await expect(page.getByTestId("cart-exam-world")).toHaveAttribute(
      "data-pattern",
      patternId,
    );
    await page
      .getByRole("radio", { name: CART_EXAM_INTENDED_REPRESENTATION[patternId] })
      .click();
    await page.getByTestId("cart-exam-continue-model").click();
    await page.getByRole("radio", { name: intendedCartExamModel(pattern) }).click();
    await page.getByTestId("cart-exam-reveal-options").click();
    await page.getByRole("radio", { name: pattern.correctAnswer }).click();
    await page.getByRole("textbox").fill(
      "力和运动不是同一件事。合力为零时运动状态可以保持不变。",
    );
    await page.getByTestId("cart-exam-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.AI_OFF] }),
  ).toBeVisible();
}

export async function completeCartAiOff(page: Page) {
  for (const challengeId of CART_AI_OFF_CHALLENGE_IDS) {
    await expect(page.getByTestId("cart-ai-off-task")).toHaveAttribute(
      "data-challenge",
      challengeId,
    );
    await page
      .getByRole("radio", {
        name: cartJudgmentLabelFor(
          challengeId,
          intendedCartAiOffAnswerId(challengeId),
        ),
      })
      .click();
    await page.getByRole("textbox").fill(
      challengeId === CART_AI_OFF_CHALLENGE_IDS[1]
        ? "两边的力大小几乎相等、方向相反，这是受力平衡，不是没有力。合力为零时，原来在滑动的木箱可以保持原来的运动。"
        : "滑板原来已经在向右运动。这时水平合力可以看成零，运动状态保持不变，不必立刻停下。",
    );
    await page.getByTestId("cart-ai-off-commit").click();
    await expect(page.getByTestId("cart-ai-off-post-check")).toBeVisible();
    for (const option of cartAiOffPostCheckOptions(challengeId)) {
      if (option.required) {
        await page.getByRole("checkbox", { name: option.label }).click();
      }
    }
    await page.getByTestId("cart-ai-off-post-check-submit").click();
  }
  await expect(
    page.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.COMPLETE] }),
  ).toBeVisible();
}

export async function expectNoTutorChrome(page: Page) {
  await expect(page.getByText(STUDENT_CHROME.tutorName)).toHaveCount(0);
  await expect(page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveCount(0);
}
