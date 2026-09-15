import { describe, expect, it } from "vitest";

import {
  ENGINE_COPY,
  ENGINE_EXPERIMENT_A,
  ENGINE_EXPERIMENT_B,
} from "@/lib/content/four-stroke-engine";
import {
  evaluateEnginePrediction,
  firstCommittedEnginePrediction,
  hasCommittedEnginePrediction,
  latestCommittedEnginePrediction,
} from "@/lib/learning/engine-predict";
import type { PredictionEvidence } from "@/types/learning";

describe("engine PREDICT evidence", () => {
  it("requires an explicit outcome, not only text length", () => {
    expect(evaluateEnginePrediction("", "活塞还会动。").sufficient).toBe(false);
    expect(evaluateEnginePrediction("还能产生主要动力", "活塞还会动。").sufficient).toBe(
      false,
    );
    expect(evaluateEnginePrediction("main-output", "活塞还会动。").sufficient).toBe(
      true,
    );
  });

  it("requires a student-authored reason", () => {
    expect(evaluateEnginePrediction("no-main-output", "").sufficient).toBe(false);
    expect(evaluateEnginePrediction("no-main-output", "a").sufficient).toBe(false);
    expect(evaluateEnginePrediction("no-main-output", "   ").sufficient).toBe(false);
    expect(evaluateEnginePrediction("unsure", "我还看不太懂。").sufficient).toBe(true);
    expect(
      evaluateEnginePrediction("no-main-output", ENGINE_COPY.reasonUnknown).sufficient,
    ).toBe(true);
  });

  it("treats a wrong prediction as valid prediction evidence", () => {
    const evaluation = evaluateEnginePrediction(
      "main-output",
      "它还在转，所以应该还有主要动力。",
    );
    expect(evaluation.hasOutcome).toBe(true);
    expect(evaluation.hasReason).toBe(true);
    expect(evaluation.sufficient).toBe(true);
  });

  it("does not ask an LLM whether the prediction is correct", () => {
    expect(evaluateEnginePrediction("unsure", "我先猜猜看。").sufficient).toBe(true);
    expect(evaluateEnginePrediction.toString()).not.toMatch(/fetch|tutor|openai|llm/i);
  });

  it("keeps the first committed prediction when a later edit is appended", () => {
    const predictions: PredictionEvidence[] = [
      {
        prediction: "main-output",
        reasoning: "它还在动，所以还有动力。",
        timestamp: "2026-09-11T00:01:00.000Z",
        experimentId: ENGINE_EXPERIMENT_A,
        committed: true,
      },
      {
        prediction: "no-main-output",
        reasoning: "后来我觉得没有燃烧就没有动力。",
        timestamp: "2026-09-11T00:04:00.000Z",
        experimentId: ENGINE_EXPERIMENT_A,
        committed: true,
      },
    ];

    expect(hasCommittedEnginePrediction(predictions, ENGINE_EXPERIMENT_A)).toBe(true);
    expect(firstCommittedEnginePrediction(predictions, ENGINE_EXPERIMENT_A)).toMatchObject(
      {
        prediction: "main-output",
        timestamp: "2026-09-11T00:01:00.000Z",
      },
    );
    expect(latestCommittedEnginePrediction(predictions, ENGINE_EXPERIMENT_A)).toMatchObject(
      {
        prediction: "no-main-output",
      },
    );
    expect(hasCommittedEnginePrediction(predictions, ENGINE_EXPERIMENT_B)).toBe(false);
  });
});
