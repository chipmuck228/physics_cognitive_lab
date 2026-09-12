import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";

import { HEAT_EXPERIMENT_A } from "@/lib/physics/equal-mass-heated-samples";
import { createSession } from "@/lib/learning/session";
import { loadSession, saveSession } from "@/lib/learning/session-storage";
import { canLeaveStage } from "@/lib/learning/progression";
import { equalMassHeatedSamplesAdapter } from "@/lib/runtime/adapters/equal-mass-heated-samples";
import { HEAT_SAMPLES_SCENE_ID, LearningStage } from "@/types/learning";

describe("equal-mass heated samples adapter", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("registers through the adapter without a universal sceneId branch", () => {
    const progressionSource = readFileSync("lib/learning/progression.ts", "utf8");
    const tutorSource = readFileSync("lib/learning/tutor-request.ts", "utf8");
    const tutorHook = readFileSync("hooks/useTutor.ts", "utf8");
    expect(progressionSource).not.toMatch(/equal-mass-heated-samples/);
    expect(tutorSource).not.toMatch(/equal-mass-heated-samples/);
    expect(tutorHook).not.toMatch(/equal-mass-heated-samples/);
    expect(equalMassHeatedSamplesAdapter.sceneId).toBe(HEAT_SAMPLES_SCENE_ID);
    expect(equalMassHeatedSamplesAdapter.primaryModelId).toBe(
      "specific-heat-capacity",
    );

    const session = createSession(() => "t", () => "id", HEAT_SAMPLES_SCENE_ID);
    expect(session.physicsState.sceneId).toBe(HEAT_SAMPLES_SCENE_ID);
    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(
      equalMassHeatedSamplesAdapter.runExperiment?.(HEAT_EXPERIMENT_A).experimentId,
    ).toBe(HEAT_EXPERIMENT_A);
  });

  it("persists heat physicsState, sceneData, and failed attempts", () => {
    const session = createSession(() => "t", () => "persist-heat", HEAT_SAMPLES_SCENE_ID);
    session.sceneData.watchedObserveDemo = true;
    session.modelAttempts = [
      {
        nodes: ["product:c:clock-time"],
        connections: [],
        correctStructure: false,
        timestamp: "t1",
        failureKinds: ["missing-core-relation"],
      },
    ];
    session.examAttempts = [
      {
        questionId: "exam-heat-is-not-temperature",
        patternId: "exam-heat-is-not-temperature",
        selectedAnswer: "wrong",
        reasoning: "更烫能量就更多。",
        correct: false,
        timestamp: "t2",
      },
    ];
    saveSession(session);
    const restored = loadSession(HEAT_SAMPLES_SCENE_ID);
    expect(restored?.sceneId).toBe(HEAT_SAMPLES_SCENE_ID);
    expect(restored?.sceneData.watchedObserveDemo).toBe(true);
    expect(restored?.modelAttempts[0]?.correctStructure).toBe(false);
    expect(restored?.examAttempts[0]?.selectedAnswer).toBe("wrong");
    expect(restored?.examAttempts[0]?.reasoning).not.toBe(
      restored?.examAttempts[0]?.selectedAnswer,
    );
  });
});
