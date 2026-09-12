import { describe, expect, it } from "vitest";

import { completeSamplesModelInput, emptySamplesModelDraft, samplesModelStudentFeedback } from "@/lib/learning/samples-model";
import { buildSamplesModelAttempt } from "@/lib/learning/samples-model";
import { studentUiFeedback } from "@/lib/learning/student-ui-feedback";

describe("student UI feedback contract", () => {
  it("distinguishes missing input from incorrect input", () => {
    expect(studentUiFeedback(["切开后，质量怎样"], "错误反馈").kind).toBe("missing");
    expect(studentUiFeedback([], "错误反馈")).toEqual({
      kind: "incorrect",
      message: "错误反馈",
    });
  });

  it("Scene 04 empty MODEL draft is missing, not a misconception sentence", () => {
    const draft = emptySamplesModelDraft();
    const attempt = buildSamplesModelAttempt({
      ...draft,
      timestamp: "2026-09-12T00:00:00.000Z",
    });
    const feedback = samplesModelStudentFeedback(draft, attempt);
    expect(feedback.kind).toBe("missing");
    expect(feedback.message).toContain("切开后，质量怎样");
    expect(feedback.message).toContain("还有没选完的问题");
  });

  it("Scene 04 complete-but-wrong MODEL uses incorrect feedback", () => {
    const filled = {
      kind: "samples-model-draft" as const,
      ...completeSamplesModelInput("2026-09-12T00:00:00.000Z"),
      cutWhy: "same-material-alone",
    };
    const attempt = buildSamplesModelAttempt(filled);
    expect(attempt.correctStructure).toBe(false);
    const feedback = samplesModelStudentFeedback(filled, attempt);
    expect(feedback.kind).toBe("incorrect");
    expect(feedback.message).toContain("同一种物质");
  });
});
