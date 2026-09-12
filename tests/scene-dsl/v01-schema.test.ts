import { describe, expect, it } from "vitest";

import { examPatterns } from "@/content/physics-models/density-mass-volume/exam";
import { independentChallenges } from "@/content/physics-models/density-mass-volume/independent-challenges";
import { transferTargets } from "@/content/physics-models/density-mass-volume/transfer";
import {
  SAMPLES_AI_OFF_CHALLENGE_IDS,
  SAMPLES_COPY,
  SAMPLES_EXAM_PATTERN_IDS,
  SAMPLES_TRANSFER_TARGET_IDS,
  samplesSceneDsl,
} from "@/lib/content/equal-volume-material-samples";
import { parseSceneDslV01 } from "@/lib/scene-dsl/v01";
import { LearningStage } from "@/types/learning";

const catalogs = {
  transferTargetIds: transferTargets.map((target) => target.id),
  examPatternIds: examPatterns.map((pattern) => pattern.id),
  independentChallenges: independentChallenges.map((challenge) => ({
    id: challenge.id,
    llmAllowed: challenge.llmAllowed,
  })),
};

function validInput() {
  return structuredClone(samplesSceneDsl);
}

describe("Scene DSL v0.1 schema", () => {
  it("accepts the Scene 04 production config", () => {
    expect(samplesSceneDsl.identity.sceneId).toBe("equal-volume-material-samples");
    expect(samplesSceneDsl.identity.primaryModelId).toBe("density-mass-volume");
    expect(samplesSceneDsl.plugins.physics).toBe("deterministic-equal-volume-samples");
    expect(samplesSceneDsl.plugins.modelRepresentation).toBe("ratio-quantitative");
    expect(samplesSceneDsl.aiOff.tutorEnabled).toBe(false);
    expect(samplesSceneDsl.hintLadder.source).toBe("physics-model");
  });

  it("rejects an unknown stage key", () => {
    const input = validInput() as Record<string, unknown>;
    const prompts = { ...samplesSceneDsl.stagePrompts, NOT_A_STAGE: "x" };
    expect(() =>
      parseSceneDslV01({ ...input, stagePrompts: prompts }, catalogs),
    ).toThrow();
  });

  it("rejects a missing required prompt group", () => {
    const prompts = { ...samplesSceneDsl.stagePrompts };
    delete prompts[LearningStage.MODEL];
    expect(() =>
      parseSceneDslV01({ ...validInput(), stagePrompts: prompts }, catalogs),
    ).toThrow(/missing required prompt/);
  });

  it("rejects an invalid plugin name", () => {
    expect(() =>
      parseSceneDslV01(
        {
          ...validInput(),
          plugins: { ...samplesSceneDsl.plugins, physics: "universal-renderer" },
        },
        catalogs,
      ),
    ).toThrow();
  });

  it("rejects an invalid transfer target reference", () => {
    expect(() =>
      parseSceneDslV01(
        {
          ...validInput(),
          transfer: {
            ...samplesSceneDsl.transfer,
            boundaryTargetId: "not-a-target",
          },
        },
        catalogs,
      ),
    ).toThrow(/Unknown transfer target/);
  });

  it("rejects an unknown exam pattern reference", () => {
    expect(() =>
      parseSceneDslV01(
        {
          ...validInput(),
          exam: { ...samplesSceneDsl.exam, patternIds: ["exam-not-real"] },
        },
        catalogs,
      ),
    ).toThrow(/Unknown exam pattern/);
  });

  it("rejects AI_OFF config that enables Tutor", () => {
    expect(() =>
      parseSceneDslV01(
        {
          ...validInput(),
          aiOff: { ...samplesSceneDsl.aiOff, tutorEnabled: true },
        },
        catalogs,
      ),
    ).toThrow();
  });

  it("rejects a malformed exam sequence", () => {
    expect(() =>
      parseSceneDslV01(
        {
          ...validInput(),
          exam: { patternIds: [], maxAttemptsPerItem: 2 },
        },
        catalogs,
      ),
    ).toThrow();
  });

  it("keeps Scene 04 production ID bindings", () => {
    expect(samplesSceneDsl.exam.patternIds).toEqual([...SAMPLES_EXAM_PATTERN_IDS]);
    expect(samplesSceneDsl.aiOff.challengeIds).toEqual([
      ...SAMPLES_AI_OFF_CHALLENGE_IDS,
    ]);
    expect(samplesSceneDsl.transfer.requiredFullModelIds).toEqual([
      SAMPLES_TRANSFER_TARGET_IDS.cups,
      SAMPLES_TRANSFER_TARGET_IDS.stone,
    ]);
    expect(samplesSceneDsl.transfer.boundaryTargetId).toBe(
      SAMPLES_TRANSFER_TARGET_IDS.hollow,
    );
    expect(samplesSceneDsl.copy.massUnit).toBe(SAMPLES_COPY.massUnit);
    expect(samplesSceneDsl.copy.volumeUnit).toBe(SAMPLES_COPY.volumeUnit);
    expect(samplesSceneDsl.copy.densityUnit).toBe(SAMPLES_COPY.densityUnit);
  });
});
