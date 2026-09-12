import { describe, expect, it } from "vitest";

import { evaluateEngineExplanation, hasSufficientEngineExplanation } from "@/lib/learning/engine-explain";
import { accumulateEngineSceneEvidence } from "@/lib/learning/engine-evidence";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { explainReadySession, sufficientEngineExplanation } from "./engine-fixtures";

describe("engine EXPLAIN evaluation", () => {
  it("does not pass a direct combustion-to-crank account", () => {
    const evaluation = evaluateEngineExplanation({
      firstChange: "direct-crank",
      gasEffect: "fire-turns",
      mechanicalGain: "fire-is-power",
      studentExplanation: "燃烧让曲轴转。",
    });

    expect(evaluation.identifiesWorkingGasChange).toBe(false);
    expect(evaluation.treatsCombustionAsDirectOutput).toBe(true);
    expect(evaluation.sufficient).toBe(false);
  });

  it("counts working-gas change and mechanical interaction toward explain evidence", () => {
    const evaluation = evaluateEngineExplanation({
      firstChange: "working-gas",
      gasEffect: "gas-pushes",
      mechanicalGain: "work-like",
      studentExplanation: "气体变了以后才推动机械部分。",
    });

    expect(evaluation.identifiesWorkingGasChange).toBe(true);
    expect(evaluation.identifiesMechanicalInteraction).toBe(true);
    expect(evaluation.identifiesWorkLikeCausalLink).toBe(true);
    expect(evaluation.sufficient).toBe(true);
  });

  it("does not require chemical-energy vocabulary yet", () => {
    const evaluation = evaluateEngineExplanation({
      firstChange: "working-gas",
      gasEffect: "gas-pushes",
      mechanicalGain: "work-like",
      studentExplanation: "燃烧以后气体变了，再推动活塞。",
    });

    expect(evaluation.sufficient).toBe(true);
  });

  it("rejects four-stroke names as the causal explanation", () => {
    const evaluation = evaluateEngineExplanation({
      firstChange: "working-gas",
      gasEffect: "gas-pushes",
      mechanicalGain: "stroke-names",
      studentExplanation: "因为吸气压缩做功排气排好了。",
    });

    expect(evaluation.sufficient).toBe(false);
  });

  it("does not treat EXPLAIN evidence as L4", () => {
    const session = {
      ...explainReadySession(),
      explanations: [sufficientEngineExplanation()],
    };

    expect(hasSufficientEngineExplanation(session.explanations)).toBe(true);
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.identifiedRelations).toBe(true);
    expect(accumulated.constructedValidCausalModel).toBe(false);
    expect(deriveModelEvidenceLevel(accumulated)).not.toBe("L4");
  });
});
