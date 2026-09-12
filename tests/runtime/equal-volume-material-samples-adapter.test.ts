import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";

import { SAMPLES_EXPERIMENT_A } from "@/lib/physics/equal-volume-material-samples";
import { createSession } from "@/lib/learning/session";
import { loadSession, saveSession } from "@/lib/learning/session-storage";
import { canLeaveStage } from "@/lib/learning/progression";
import { equalVolumeMaterialSamplesAdapter } from "@/lib/runtime/adapters/equal-volume-material-samples";
import { LearningStage, SAMPLES_SCENE_ID } from "@/types/learning";

describe("equal-volume material samples adapter", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("registers through the adapter without a universal sceneId branch", () => {
    const progressionSource = readFileSync("lib/learning/progression.ts", "utf8");
    const tutorSource = readFileSync("lib/learning/tutor-request.ts", "utf8");
    expect(progressionSource).not.toMatch(/equal-volume-material-samples/);
    expect(tutorSource).not.toMatch(/equal-volume-material-samples/);
    expect(equalVolumeMaterialSamplesAdapter.sceneId).toBe(SAMPLES_SCENE_ID);
    expect(equalVolumeMaterialSamplesAdapter.primaryModelId).toBe(
      "density-mass-volume",
    );

    const session = createSession(() => "t", () => "id", SAMPLES_SCENE_ID);
    expect(session.physicsState.sceneId).toBe(SAMPLES_SCENE_ID);
    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(
      equalVolumeMaterialSamplesAdapter.runExperiment?.(SAMPLES_EXPERIMENT_A)
        .experimentId,
    ).toBe(SAMPLES_EXPERIMENT_A);
  });

  it("persists samples physicsState and sceneData", () => {
    const session = createSession(() => "t", () => "persist-samples", SAMPLES_SCENE_ID);
    session.sceneData.watchedObserveDemo = true;
    session.physicsState = {
      sceneId: SAMPLES_SCENE_ID,
      state: {
        samples: [
          {
            id: "iron-cube",
            materialLabel: "铁",
            massG: 79,
            volumeCm3: 10,
            hollow: false,
          },
          {
            id: "wood-cube",
            materialLabel: "木",
            massG: 6,
            volumeCm3: 10,
            hollow: false,
          },
          {
            id: "compact-metal",
            materialLabel: "金属小块",
            massG: 20,
            volumeCm3: 2.5,
            hollow: false,
          },
          {
            id: "large-plastic",
            materialLabel: "塑料块",
            massG: 20,
            volumeCm3: 20,
            hollow: false,
          },
        ],
        comparisonMode: "same-volume",
        cutFactor: 1,
        highlightedIds: ["iron-cube", "wood-cube"],
        massesRevealed: true,
      },
    };
    saveSession(session);
    const restored = loadSession(SAMPLES_SCENE_ID);
    expect(restored?.sceneId).toBe(SAMPLES_SCENE_ID);
    expect(restored?.sceneData.watchedObserveDemo).toBe(true);
    expect(restored?.physicsState).toEqual(session.physicsState);
  });

  it("persists failed MODEL and TRANSFER attempts", () => {
    const session = createSession(
      () => "t",
      () => "persist-samples-model",
      SAMPLES_SCENE_ID,
    );
    session.stage = LearningStage.MODEL;
    session.modelAttempts = [
      {
        nodes: ["ratio:numerator:size"],
        connections: [],
        correctStructure: false,
        timestamp: "t1",
        failureKinds: ["missing-mass-volume-ratio"],
      },
    ];
    session.transferAttempts = [
      {
        scenarioId: "near-equal-cups-of-liquids",
        targetId: "near-equal-cups-of-liquids",
        response: "都是固体块。",
        timestamp: "t2",
        accepted: false,
        failureKinds: ["surface-similarity-only"],
      },
    ];
    session.sceneData.modelDraft = {
      kind: "samples-model-draft",
      numerator: "",
      denominator: "",
      result: "",
      sameVolumeConclusion: "",
      sameMassConclusion: "",
      cutConclusion: "",
      cutMassChange: "",
      cutVolumeChange: "",
      cutRatioChange: "",
      cutWhy: "",
      sufficiency: "",
      conditions: [],
    };
    saveSession(session);
    const restored = loadSession(SAMPLES_SCENE_ID);
    expect(restored?.modelAttempts[0]?.correctStructure).toBe(false);
    expect(restored?.transferAttempts[0]?.accepted).toBe(false);
    expect(restored?.sceneData.modelDraft).toBeTruthy();
  });

  it("persists EXAM attempts with answer and reasoning stored separately", () => {
    const session = createSession(
      () => "t",
      () => "persist-samples-exam",
      SAMPLES_SCENE_ID,
    );
    session.stage = LearningStage.EXAM;
    session.examAttempts = [
      {
        questionId: "exam-density-is-not-mass-or-size",
        patternId: "exam-density-is-not-mass-or-size",
        selectedAnswer: "wrong",
        reasoning: "更重的密度一定更大。",
        correct: false,
        timestamp: "t1",
      },
    ];
    saveSession(session);
    const restored = loadSession(SAMPLES_SCENE_ID);
    expect(restored?.examAttempts[0]?.selectedAnswer).toBe("wrong");
    expect(restored?.examAttempts[0]?.reasoning).toBe("更重的密度一定更大。");
    expect(restored?.examAttempts[0]?.selectedAnswer).not.toBe(
      restored?.examAttempts[0]?.reasoning,
    );
  });
});
