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
import { SCENE_COPY } from "../../lib/content/microwave-bread";
import { STUDENT_CHROME } from "../../lib/content/student-language";

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

    await expect(page.getByText(SCENE_COPY.aiOffBanner)).toBeVisible();
    await expect(page.getByText(STUDENT_CHROME.tutorName)).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }),
    ).toHaveCount(0);
    expect(tutorRequests).toEqual([]);

    await completeIndependentAssessment(page);
    await expect(page.getByRole("heading", { name: SCENE_COPY.completeTitle })).toBeVisible();
    expect(tutorRequests).toEqual([]);
  });
});
