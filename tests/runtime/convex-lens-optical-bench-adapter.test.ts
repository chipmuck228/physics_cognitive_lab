import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";

import { accumulateConvexLensSceneEvidence } from "@/lib/learning/lens-evidence";
import { createSession } from "@/lib/learning/session";
import { loadSession, saveSession } from "@/lib/learning/session-storage";
import { canLeaveStage } from "@/lib/learning/progression";
import { LENS_EXPERIMENT_A } from "@/lib/physics/convex-lens-optical-bench";
import { convexLensOpticalBenchAdapter } from "@/lib/runtime/adapters/convex-lens-optical-bench";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

describe("convex-lens-optical-bench adapter", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("registers through the adapter without a universal sceneId branch", () => {
    const progressionSource = readFileSync("lib/learning/progression.ts", "utf8");
    const tutorSource = readFileSync("lib/learning/tutor-request.ts", "utf8");
    const tutorHook = readFileSync("hooks/useTutor.ts", "utf8");
    const evidenceSource = readFileSync("lib/learning/lens-evidence.ts", "utf8");
    expect(progressionSource).not.toMatch(/convex-lens-optical-bench/);
    expect(progressionSource).not.toMatch(/convex-lens-imaging/);
    expect(tutorSource).not.toMatch(/convex-lens-optical-bench/);
    expect(tutorHook).not.toMatch(/convex-lens-optical-bench/);
    expect(evidenceSource).not.toMatch(/"L4"|"L5"|"L6"/);
    expect(convexLensOpticalBenchAdapter.sceneId).toBe(CONVEX_LENS_SCENE_ID);
    expect(convexLensOpticalBenchAdapter.primaryModelId).toBe("convex-lens-imaging");

    const session = createSession(() => "t", () => "id", CONVEX_LENS_SCENE_ID);
    expect(session.physicsState.sceneId).toBe(CONVEX_LENS_SCENE_ID);
    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(
      convexLensOpticalBenchAdapter.runExperiment?.(LENS_EXPERIMENT_A).experimentId,
    ).toBe(LENS_EXPERIMENT_A);
  });

  it("covers every UPLP stage on the adapter", () => {
    for (const stage of Object.values(LearningStage)) {
      expect(typeof convexLensOpticalBenchAdapter.completion[stage]).toBe("function");
    }
  });

  it("persists physicsState, sceneData, and failed attempts", () => {
    const session = createSession(() => "t", () => "persist-lens", CONVEX_LENS_SCENE_ID);
    session.sceneData.watchedObserveDemo = true;
    session.sceneData.learnerManipulatedObserveBench = true;
    session.modelAttempts = [
      {
        nodes: ["station:beyond-2f"],
        connections: [],
        correctStructure: false,
        timestamp: "t1",
        failureKinds: ["table-row-only"],
        studentReasoning: "u>2f，所以倒立缩小实像",
      },
    ];
    session.examAttempts = [
      {
        questionId: "exam-object-beyond-2f-properties",
        patternId: "exam-object-beyond-2f-properties",
        selectedAnswer: "像就在透镜上，不必再放光屏。",
        reasoning: "我看见光屏了。",
        correct: false,
        timestamp: "t2",
      },
    ];
    saveSession(session);
    const restored = loadSession(CONVEX_LENS_SCENE_ID);
    expect(restored?.sceneId).toBe(CONVEX_LENS_SCENE_ID);
    expect(restored?.sceneData.watchedObserveDemo).toBe(true);
    expect(restored?.sceneData.learnerManipulatedObserveBench).toBe(true);
    expect(restored?.modelAttempts[0]?.correctStructure).toBe(false);
    expect(restored?.examAttempts[0]?.selectedAnswer).not.toBe(
      restored?.examAttempts[0]?.reasoning,
    );
    expect(accumulateConvexLensSceneEvidence(restored!).constructedValidCausalModel).toBeUndefined();
  });
});
