import { expect, test } from "@playwright/test";

import {
  CART_COMPLETE_COPY,
  CART_STAGE_PROMPTS,
} from "../../lib/content/horizontal-force-cart";
import { STUDENT_CHROME } from "../../lib/content/student-language";
import { LearningStage } from "../../types/learning";
import {
  completeCartAiOff,
  completeCartBicycleTransfer,
  completeCartDescribe,
  completeCartExam,
  completeCartExperimentCycle,
  completeCartExplain,
  completeCartHoverTransfer,
  completeCartModel,
  completeCartObserve,
  completeCartPredictA,
  expectNoTutorChrome,
  openCartLab,
  startCartLesson,
} from "./cart-helpers";

test.describe("Scene 03 complete loop", () => {
  test("walks ENTRY through COMPLETE without faking session state", async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const tutorRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tutor")) {
        tutorRequests.push(request.url());
      }
    });

    await openCartLab(page);
    await expect(page.getByText("力能改变物体运动状态")).toHaveCount(0);
    await startCartLesson(page);
    await completeCartObserve(page);

    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: CART_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();

    await completeCartDescribe(page);
    await completeCartPredictA(page, "会越来越慢");

    await completeCartExperimentCycle(page, {
      speed: "更快",
      direction: "方向没有变",
      motion: "加快",
      comparison: "不一样",
      reflection: "顺着推以后，小车更快了。",
    });
    await completeCartExperimentCycle(page, {
      predictOutcome: "会越来越快",
      reason: "我以为力必须和运动同一边。",
      speed: "更慢",
      direction: "方向没有变",
      motion: "减慢",
      comparison: "不一样",
      reflection: "力也可以顶着运动，小车会变慢。",
    });
    await completeCartExperimentCycle(page, {
      predictOutcome: "会立刻掉转方向",
      reason: "没有向前的力就会停。",
      speed: "快慢几乎不变",
      direction: "方向没有变",
      motion: "保持原来的运动",
      comparison: "不一样",
      reflection: "合力为零时，它还可以继续运动。",
    });

    await completeCartExplain(page);
    await completeCartModel(page);
    await completeCartBicycleTransfer(page);
    await completeCartHoverTransfer(page);
    await completeCartExam(page);

    await expectNoTutorChrome(page);
    const beforeAiOff = tutorRequests.length;
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: CART_STAGE_PROMPTS[LearningStage.AI_OFF],
      }),
    ).toBeVisible();
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);

    await completeCartAiOff(page);
    await expect(page.getByText(CART_COMPLETE_COPY.title)).toBeVisible();
    await expect(page.getByText(/完全掌握/)).toHaveCount(0);
    await expectNoTutorChrome(page);
    expect(tutorRequests.slice(beforeAiOff)).toEqual([]);
  });

  test("keeps the cart path usable when /api/tutor fails", async ({ page }) => {
    await page.route("**/api/tutor", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Internal Server Error",
          stack: "Error: simulated tutor failure",
        }),
      });
    });

    await openCartLab(page);
    await startCartLesson(page);
    await page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }).click();
    await expect(page.getByText("Internal Server Error")).toHaveCount(0);
    await completeCartObserve(page);
    await expect(
      page.getByRole("heading", {
        name: CART_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeVisible();
  });
});
