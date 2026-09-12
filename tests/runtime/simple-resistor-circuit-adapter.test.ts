import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";

import { accumulateOhmsSceneEvidence } from "@/lib/learning/ohms-evidence";
import { createSession } from "@/lib/learning/session";
import { loadSession, saveSession } from "@/lib/learning/session-storage";
import { canLeaveStage } from "@/lib/learning/progression";
import { OHMS_EXPERIMENT_A } from "@/lib/physics/simple-resistor-circuit";
import { simpleResistorCircuitAdapter } from "@/lib/runtime/adapters/simple-resistor-circuit";
import { LearningStage, OHMS_SCENE_ID } from "@/types/learning";

describe("simple-resistor-circuit adapter", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("registers through the adapter without a universal sceneId branch", () => {
    const progressionSource = readFileSync("lib/learning/progression.ts", "utf8");
    const tutorSource = readFileSync("lib/learning/tutor-request.ts", "utf8");
    const tutorHook = readFileSync("hooks/useTutor.ts", "utf8");
    const evidenceSource = readFileSync("lib/learning/ohms-evidence.ts", "utf8");
    expect(progressionSource).not.toMatch(/simple-resistor-circuit/);
    expect(progressionSource).not.toMatch(/ohms-law/);
    expect(tutorSource).not.toMatch(/simple-resistor-circuit/);
    expect(tutorSource).not.toMatch(/ohms-law/);
    expect(tutorHook).not.toMatch(/simple-resistor-circuit/);
    expect(tutorHook).not.toMatch(/ohms-law/);
    expect(evidenceSource).not.toMatch(/"L4"|"L5"|"L6"/);
    expect(simpleResistorCircuitAdapter.sceneId).toBe(OHMS_SCENE_ID);
    expect(simpleResistorCircuitAdapter.primaryModelId).toBe("ohms-law");

    const session = createSession(() => "t", () => "id", OHMS_SCENE_ID);
    expect(session.physicsState.sceneId).toBe(OHMS_SCENE_ID);
    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(
      simpleResistorCircuitAdapter.runExperiment?.(OHMS_EXPERIMENT_A).experimentId,
    ).toBe(OHMS_EXPERIMENT_A);
  });

  it("persists ohms physicsState, sceneData, and failed attempts", () => {
    const session = createSession(() => "t", () => "persist-ohms", OHMS_SCENE_ID);
    session.sceneData.watchedObserveDemo = true;
    session.modelAttempts = [
      {
        nodes: ["relation:i-equals-u-over-r"],
        connections: [],
        correctStructure: false,
        timestamp: "t1",
        failureKinds: ["authored-formula-only"],
        studentReasoning: "电流等于电压除以电阻",
        completenessOnly: true,
      },
    ];
    session.examAttempts = [
      {
        questionId: "exam-calculate-i-from-u-and-r",
        patternId: "exam-calculate-i-from-u-and-r",
        selectedAnswer: "16 A",
        reasoning: "把数字加起来。",
        correct: false,
        timestamp: "t2",
      },
    ];
    saveSession(session);
    const restored = loadSession(OHMS_SCENE_ID);
    expect(restored?.sceneId).toBe(OHMS_SCENE_ID);
    expect(restored?.sceneData.watchedObserveDemo).toBe(true);
    expect(restored?.modelAttempts[0]?.correctStructure).toBe(false);
    expect(restored?.examAttempts[0]?.selectedAnswer).toBe("16 A");
    expect(restored?.examAttempts[0]?.reasoning).not.toBe(
      restored?.examAttempts[0]?.selectedAnswer,
    );
    expect(accumulateOhmsSceneEvidence(restored!).constructedValidCausalModel).toBeUndefined();
  });
});
