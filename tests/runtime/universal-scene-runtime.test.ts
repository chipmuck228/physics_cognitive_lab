import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";

import {
  ENGINE_EXPERIMENT_A,
} from "@/lib/content/four-stroke-engine";
import {
  ENGINE_AI_OFF_CHALLENGE_IDS,
  applyEngineAiOffPostCheck,
  buildEngineAiOffAttempt,
  emptyEngineAiOffDraft,
  engineAiOffPostCheckUnlocked,
  intendedAiOffAnswerId,
  intendedAiOffPostCheckIds,
  nextEngineAiOffDraft,
} from "@/lib/learning/engine-ai-off";
import {
  emptyEngineExamDraft,
  engineExamAnswerOptionsVisible,
  evaluateEngineExamAttempt,
  intendedExamModel,
  intendedExamRepresentation,
} from "@/lib/learning/engine-exam";
import {
  canRunEngineExperiment,
  isEngineExperimentClosed,
} from "@/lib/learning/engine-experiment";
import {
  evaluateEnginePrediction,
  firstCommittedEnginePrediction,
  hasCommittedEnginePrediction,
} from "@/lib/learning/engine-predict";
import { canLeaveStage, hasCompletedCognitiveStep } from "@/lib/learning/progression";
import { createSession } from "@/lib/learning/session";
import { loadSession, saveSession } from "@/lib/learning/session-storage";
import { isTutorHardBlocked as isTutorBlocked } from "@/lib/learning/stage-policy";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { fourStrokeEngineAdapter } from "@/lib/runtime/adapters/four-stroke-engine";
import {
  getSceneAdapter,
  registerSceneAdapter,
  unregisterSceneAdapter,
} from "@/lib/runtime/registry";
import type { SceneAdapter } from "@/lib/runtime/types";
import { LearningStage } from "@/types/learning";
import { examPatterns } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/exam";
import {
  aiOffReadySession,
  closedEngineEvidence,
  completedEngineExamAttempts,
  engineSession,
  examReadySession,
} from "../learning/engine-fixtures";

const FIXTURE_SCENE_ID = "runtime-fixture";
const PISTON = ENGINE_AI_OFF_CHALLENGE_IDS[0];

function fixtureAdapter(): SceneAdapter {
  return {
    sceneId: FIXTURE_SCENE_ID,
    primaryModelId: "energy-internal-energy-temperature",
    getInitialPhysicsState: () => ({
      sceneId: FIXTURE_SCENE_ID,
      state: {},
    }),
    getInitialSceneData: () => ({}),
    getTutorContext: () => ({
      learningGoal: "Help the student notice what changed.",
      currentPhysicsState: { fixture: true },
      physicsSummary: "Physics state: fixture",
      promptConstraint: "Ask one useful question.",
    }),
    completion: {
      [LearningStage.ENTRY]: () => true,
      [LearningStage.OBSERVE]: (session) => session.observations.length > 0,
      [LearningStage.DESCRIBE]: () => false,
      [LearningStage.PREDICT]: () => false,
      [LearningStage.EXPERIMENT]: () => false,
      [LearningStage.EXPLAIN]: () => false,
      [LearningStage.MODEL]: () => false,
      [LearningStage.TRANSFER]: () => false,
      [LearningStage.EXAM]: () => false,
      [LearningStage.AI_OFF]: () => false,
      [LearningStage.COMPLETE]: (session) => session.completed,
    },
    accumulateEvidence: () => ({}),
    assessmentOverlay: {},
  };
}

afterEach(() => {
  unregisterSceneAdapter(FIXTURE_SCENE_ID);
});

describe("runtime SceneAdapter contracts", () => {
  it("lets adapter completion drive universal progression", () => {
    registerSceneAdapter(fixtureAdapter());
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "fixture-session",
      FIXTURE_SCENE_ID,
    );
    const observing = { ...session, stage: LearningStage.OBSERVE };

    expect(getSceneAdapter(FIXTURE_SCENE_ID).sceneId).toBe(FIXTURE_SCENE_ID);
    expect(canLeaveStage(observing, LearningStage.DESCRIBE)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...observing,
          observations: [{ text: "a change happened", timestamp: "t" }],
        },
        LearningStage.DESCRIBE,
      ),
    ).toBe(true);
    expect(hasCompletedCognitiveStep(session, LearningStage.ENTRY)).toBe(true);
  });

  it("does not need a new sceneId branch in universal progression for an adapter fixture", () => {
    const progressionSource = readFileSync("lib/learning/progression.ts", "utf8");
    expect(progressionSource).toContain("getSceneAdapter");
    expect(progressionSource).not.toMatch(/sceneId\s*===/);
    expect(progressionSource).not.toMatch(/four-stroke-engine|microwave-bread/);

    registerSceneAdapter(fixtureAdapter());
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "fixture-session",
      FIXTURE_SCENE_ID,
    );
    expect(session.sceneId).toBe(FIXTURE_SCENE_ID);
    expect(session.physicsState.sceneId).toBe(FIXTURE_SCENE_ID);
    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
  });

  it("never lets adapters or progression assign L4/L5/L6", () => {
    const files = [
      "lib/runtime/adapters/four-stroke-engine.ts",
      "lib/runtime/adapters/microwave-bread.ts",
      "lib/runtime/adapters/horizontal-force-cart.ts",
      "lib/runtime/types.ts",
      "lib/learning/progression.ts",
    ];
    for (const file of files) {
      expect(readFileSync(file, "utf8")).not.toMatch(/["']L[456]["']/);
    }
  });
});

describe("runtime prediction and experiment contracts", () => {
  it("requires a committed prediction before intervention", () => {
    const session = engineSession({ stage: LearningStage.EXPERIMENT });
    expect(canRunEngineExperiment(session, ENGINE_EXPERIMENT_A)).toBe(false);

    const predicted = {
      ...session,
      predictions: [
        {
          prediction: "no-main-output",
          reasoning: "我猜这样就不会有主要动力。",
          timestamp: "2026-09-11T00:01:00.000Z",
          experimentId: ENGINE_EXPERIMENT_A,
          committed: true as const,
        },
      ],
    };
    expect(canRunEngineExperiment(predicted, ENGINE_EXPERIMENT_A)).toBe(true);
  });

  it("lets a wrong prediction continue into experiment", () => {
    const evaluation = evaluateEnginePrediction(
      "main-output",
      "它还在动，所以应该还有主要动力。",
    );
    expect(evaluation.sufficient).toBe(true);

    const predicting = engineSession({
      stage: LearningStage.PREDICT,
      predictions: [
        {
          prediction: "main-output",
          reasoning: "它还在动，所以应该还有主要动力。",
          timestamp: "t",
          experimentId: ENGINE_EXPERIMENT_A,
          committed: true,
        },
      ],
    });
    expect(
      hasCommittedEnginePrediction(predicting.predictions, ENGINE_EXPERIMENT_A),
    ).toBe(true);
    expect(canLeaveStage(predicting, LearningStage.EXPERIMENT)).toBe(true);
  });

  it("requires five-part experiment closure", () => {
    const closed = closedEngineEvidence(ENGINE_EXPERIMENT_A);
    expect(closed.authoredBeforeIntervention).toBe(true);
    expect(closed.interventionAt).toBeTruthy();
    expect(closed.observedResult).toBeTruthy();
    expect(closed.comparison).toBeTruthy();
    expect(closed.reflection).toBeTruthy();
    expect(isEngineExperimentClosed(closed)).toBe(true);
    expect(
      isEngineExperimentClosed({
        ...closed,
        comparison: "",
        sufficient: false,
      }),
    ).toBe(false);
    expect(
      isEngineExperimentClosed({
        ...closed,
        reflection: "",
        sufficient: false,
      }),
    ).toBe(false);
  });

  it("does not treat playback alone as experiment completion", () => {
    const playbackOnly = {
      ...closedEngineEvidence(ENGINE_EXPERIMENT_A),
      interventionAt: undefined,
      physicsResult: undefined,
      sufficient: false,
    };
    expect(isEngineExperimentClosed(playbackOnly)).toBe(false);

    const watching = engineSession({
      stage: LearningStage.EXPERIMENT,
      observations: [
        {
          text: "watched",
          timestamp: "t",
          watchedFullCycle: true,
          sufficient: true,
        },
      ],
    });
    expect(
      fourStrokeEngineAdapter.completion[LearningStage.EXPERIMENT](watching),
    ).toBe(false);
  });

  it("preserves the first committed prediction after a later retry", () => {
    const predictions = [
      {
        prediction: "main-output",
        reasoning: "它还在动，所以还有动力。",
        timestamp: "2026-09-11T00:01:00.000Z",
        experimentId: ENGINE_EXPERIMENT_A,
        committed: true as const,
      },
      {
        prediction: "no-main-output",
        reasoning: "后来我觉得没有燃烧就没有动力。",
        timestamp: "2026-09-11T00:04:00.000Z",
        experimentId: ENGINE_EXPERIMENT_A,
        committed: true as const,
      },
    ];
    expect(firstCommittedEnginePrediction(predictions, ENGINE_EXPERIMENT_A)).toMatchObject(
      {
        prediction: "main-output",
        timestamp: "2026-09-11T00:01:00.000Z",
      },
    );
  });
});

describe("runtime exam and AI_OFF contracts", () => {
  it("hides Exam World final options until prerequisite work", () => {
    const draft = emptyEngineExamDraft();
    expect(draft.step).toBe("representation");
    expect(engineExamAnswerOptionsVisible(draft.step)).toBe(false);
    expect(engineExamAnswerOptionsVisible("model")).toBe(false);
    expect(engineExamAnswerOptionsVisible("answer")).toBe(true);
  });

  it("does not treat option array order as the exam correctness contract", () => {
    const pattern = examPatterns.find(
      (item) => item.id === "exam-power-stroke-energy-conversion",
    );
    expect(pattern).toBeTruthy();
    expect(intendedExamRepresentation(pattern!)).not.toBe(
      pattern!.representationOptions[0],
    );
    expect(intendedExamModel(pattern!)).toBe(
      fourStrokeEngineAdapter.assessmentOverlay.exam?.[pattern!.id]?.intendedModel,
    );
    const evaluation = evaluateEngineExamAttempt({
      patternId: pattern!.id,
      representation: pattern!.representationOptions[0] ?? "",
      modelRecognition: pattern!.modelOptions[1] ?? "",
      selectedAnswer: pattern!.correctAnswer,
      reasoning: "燃料化学能经过转化才到机械能。",
      timestamp: "t",
    });
    expect(evaluation.correct).toBe(true);
    expect(evaluation.representationMatchesIntended).toBe(false);
    expect(evaluation.modelMatchesIntended).toBe(false);
  });

  it("commits the independent AI_OFF response before post-check", () => {
    const draft = emptyEngineAiOffDraft();
    expect(draft.step).toBe("response");
    expect(engineAiOffPostCheckUnlocked(draft.step)).toBe(false);

    const attempt = buildEngineAiOffAttempt({
      challengeId: PISTON,
      selectedAnswer: intendedAiOffAnswerId(PISTON),
      studentReasoning:
        "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
      timestamp: "t1",
    });
    expect(attempt.postCheckIds).toEqual([]);
    expect(attempt.accepted).toBe(false);

    const next = nextEngineAiOffDraft(
      { explanation: "", examResponses: {}, completedWithoutAI: false, challengeAttempts: [attempt] },
      draft,
      PISTON,
    );
    expect(next.step).toBe("post-check");
    expect(engineAiOffPostCheckUnlocked(next.step)).toBe(true);
  });

  it("cannot let post-check rewrite the first AI_OFF response", () => {
    const first = buildEngineAiOffAttempt({
      challengeId: PISTON,
      selectedAnswer: intendedAiOffAnswerId(PISTON),
      studentReasoning:
        "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
      timestamp: "t1",
    });
    const checked = applyEngineAiOffPostCheck(
      first,
      intendedAiOffPostCheckIds(PISTON),
    );
    expect(checked.selectedAnswer).toBe(first.selectedAnswer);
    expect(checked.studentReasoning).toBe(first.studentReasoning);
    expect(checked.timestamp).toBe(first.timestamp);

    const retry = buildEngineAiOffAttempt({
      challengeId: PISTON,
      selectedAnswer: "combustion-turns-cutter",
      studentReasoning: "后来我觉得燃烧直接让刀具转起来了。",
      timestamp: "t2",
    });
    const attempts = [first, retry];
    expect(attempts[0]).toEqual(first);
    expect(attempts[0]?.selectedAnswer).not.toBe(retry.selectedAnswer);
  });

  it("cannot call the tutor in AI_OFF", () => {
    expect(isTutorBlocked(LearningStage.AI_OFF)).toBe(true);
    expect(isTutorBlocked(LearningStage.COMPLETE)).toBe(true);
    expect(isTutorBlocked(LearningStage.EXAM)).toBe(false);
  });

  it("keeps AI_OFF hard blocked after refresh/persistence", () => {
    const session = aiOffReadySession();
    saveSession(session);
    const restored = loadSession(session.sceneId);
    expect(restored?.stage).toBe(LearningStage.AI_OFF);
    expect(isTutorBlocked(restored!.stage)).toBe(true);
    expect(restored?.examAttempts).toHaveLength(completedEngineExamAttempts().length);
  });

  it("does not create L6 from EXAM completion", () => {
    const session = {
      ...examReadySession(),
      examAttempts: completedEngineExamAttempts(),
    };
    const evidence = fourStrokeEngineAdapter.accumulateEvidence(session);
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L6");
    expect(JSON.stringify(evidence)).not.toContain("L6");
    expect(JSON.stringify(session)).not.toContain('"L6"');
  });
});

describe("runtime session physics", () => {
  it("initializes physics through the Scene adapter", () => {
    const microwave = createSession();
    const engine = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "engine-session",
      "four-stroke-engine",
    );
    expect(microwave.physicsState.sceneId).toBe("microwave-bread");
    expect("currentTemperatureC" in microwave.physicsState.state).toBe(true);
    expect(engine.physicsState.sceneId).toBe("four-stroke-engine");
    expect("stroke" in engine.physicsState.state).toBe(true);
    expect("currentTemperatureC" in engine.physicsState.state).toBe(false);
  });
});
