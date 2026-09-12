import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";

import { CART_EXPERIMENT_A } from "@/lib/physics/horizontal-force-cart";
import { createSession } from "@/lib/learning/session";
import { loadSession, saveSession } from "@/lib/learning/session-storage";
import { canLeaveStage } from "@/lib/learning/progression";
import { horizontalForceCartAdapter } from "@/lib/runtime/adapters/horizontal-force-cart";
import { CART_SCENE_ID, LearningStage } from "@/types/learning";

describe("horizontal force cart adapter", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("registers through the adapter without a universal sceneId branch", () => {
    const progressionSource = readFileSync("lib/learning/progression.ts", "utf8");
    const tutorSource = readFileSync("lib/learning/tutor-request.ts", "utf8");
    expect(progressionSource).not.toMatch(/horizontal-force-cart/);
    expect(tutorSource).not.toMatch(/horizontal-force-cart/);
    expect(horizontalForceCartAdapter.sceneId).toBe(CART_SCENE_ID);
    expect(horizontalForceCartAdapter.primaryModelId).toBe(
      "force-changes-motion-state",
    );

    const session = createSession(() => "t", () => "id", CART_SCENE_ID);
    expect(session.physicsState.sceneId).toBe(CART_SCENE_ID);
    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(
      horizontalForceCartAdapter.runExperiment?.(CART_EXPERIMENT_A).experimentId,
    ).toBe(CART_EXPERIMENT_A);
  });

  it("persists cart physicsState and sceneData", () => {
    const session = createSession(() => "t", () => "persist-cart", CART_SCENE_ID);
    session.sceneData.watchedObserveDemo = true;
    session.physicsState = {
      sceneId: CART_SCENE_ID,
      state: {
        positionTick: 5,
        speedTick: 2,
        motionDirection: "right",
        netForce: "zero",
        lastChange: "unchanged",
        frictionOmitted: true,
      },
    };
    saveSession(session);
    const restored = loadSession(CART_SCENE_ID);
    expect(restored?.sceneId).toBe(CART_SCENE_ID);
    expect(restored?.sceneData.watchedObserveDemo).toBe(true);
    expect(restored?.physicsState).toEqual(session.physicsState);
  });

  it("persists failed MODEL and TRANSFER attempts", () => {
    const session = createSession(() => "t", () => "persist-cart-model", CART_SCENE_ID);
    session.stage = LearningStage.MODEL;
    session.modelAttempts = [
      {
        nodes: ["same:motion:still"],
        connections: [],
        correctStructure: false,
        timestamp: "t1",
        failureKinds: ["missing-same-direction-speed-up"],
      },
    ];
    session.transferAttempts = [
      {
        scenarioId: "near-bicycle-speeding-up",
        targetId: "near-bicycle-speeding-up",
        response: "都有轮子。",
        timestamp: "t2",
        accepted: false,
        failureKinds: ["surface-similarity-only"],
      },
    ];
    session.sceneData.modelDraft = { kind: "cart-model-draft", cases: {}, conditions: [] };
    saveSession(session);
    const restored = loadSession(CART_SCENE_ID);
    expect(restored?.modelAttempts[0]?.correctStructure).toBe(false);
    expect(restored?.transferAttempts[0]?.accepted).toBe(false);
    expect(restored?.sceneData.modelDraft).toBeTruthy();
  });

  it("persists EXAM attempts with answer and reasoning stored separately", () => {
    const session = createSession(() => "t", () => "persist-cart-exam", CART_SCENE_ID);
    session.stage = LearningStage.EXAM;
    session.examAttempts = [
      {
        questionId: "exam-force-does-not-mean-motion",
        patternId: "exam-force-does-not-mean-motion",
        selectedAnswer: "wrong",
        reasoning: "有力就一定运动。",
        correct: false,
        timestamp: "t1",
      },
    ];
    saveSession(session);
    const restored = loadSession(CART_SCENE_ID);
    expect(restored?.examAttempts[0]?.selectedAnswer).toBe("wrong");
    expect(restored?.examAttempts[0]?.reasoning).toBe("有力就一定运动。");
    expect(restored?.examAttempts[0]?.selectedAnswer).not.toBe(
      restored?.examAttempts[0]?.reasoning,
    );
  });
});
