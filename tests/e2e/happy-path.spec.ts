import { expect, test } from "@playwright/test";

import {
  completeDescribe,
  completeExam,
  completeExperiment,
  completeExplain,
  completeIndependentAssessment,
  completeModel,
  completeObserve,
  completePredict,
  completeTransfer,
  openLab,
  startLesson,
} from "./helpers";

test.describe("happy path", () => {
  test("walks ENTRY through COMPLETE without skipping stages", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const tutorRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tutor")) {
        tutorRequests.push(request.url());
      }
    });

    await openLab(page);
    await startLesson(page);
    await completeObserve(page);
    await completeDescribe(page);
    await completePredict(page);
    await completeExperiment(page);
    await completeExplain(page);
    await completeModel(page);
    await completeTransfer(page);
    await completeExam(page);

    await expect(page.getByText("AI is now turned off.")).toBeVisible();
    await expect(page.getByText("Coach")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Ask the coach one question" }),
    ).toHaveCount(0);
    expect(tutorRequests).toEqual([]);

    await completeIndependentAssessment(page);
    await expect(page.getByRole("heading", { name: "Physics Thinking" })).toBeVisible();
    expect(tutorRequests).toEqual([]);
  });
});
