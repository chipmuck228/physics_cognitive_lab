import {
  ENGINE_EXPERIMENT_A,
  ENGINE_EXPERIMENT_B,
} from "@/lib/content/four-stroke-engine";
import {
  microwavePlaceholder,
  physicsSnapshotFrom,
  runSceneExperiment,
} from "@/lib/learning/engine-experiment";
import { completeEngineModelInput, buildEngineModelAttempt } from "@/lib/learning/engine-model";
import {
  buildEngineTransferAttempt,
  completeEngineFullModelInput,
  completeEnginePartialTransferInput,
} from "@/lib/learning/engine-transfer";
import {
  buildEngineExamAttempt,
  completeEngineExamInput,
  ENGINE_EXAM_PATTERN_IDS,
} from "@/lib/learning/engine-exam";
import { createLearningEvent } from "@/lib/learning/events";
import { createSession } from "@/lib/learning/session";
import { LearningStage, type ExperimentEvidence, type LearningSession } from "@/types/learning";

export function engineSession(
  extras: Partial<LearningSession> = {},
): LearningSession {
  return {
    ...createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "engine-session",
      "four-stroke-engine",
    ),
    ...extras,
  };
}

export function closedEngineEvidence(
  experimentId: typeof ENGINE_EXPERIMENT_A | typeof ENGINE_EXPERIMENT_B,
): ExperimentEvidence {
  const isA = experimentId === ENGINE_EXPERIMENT_A;
  return {
    ...microwavePlaceholder(),
    prediction: "no-main-output",
    predictionReason: "我猜这样就不会有主要动力。",
    predictionComparison: "不一样",
    reflection: isA
      ? "没有正常燃烧，也就没有主要动力输出。"
      : "燃烧发生了，但活塞被卡住，输出仍被阻断。",
    timestamp: "2026-09-11T00:02:00.000Z",
    experimentId,
    committedAt: "2026-09-11T00:01:00.000Z",
    interventionAt: "2026-09-11T00:02:00.000Z",
    intervention: isA
      ? { combustionEnabled: false, pistonCanMove: true }
      : { combustionEnabled: true, pistonCanMove: false },
    observedResult: {
      combustionOccurred: isA ? "no" : "yes",
      mechanismMoving: isA ? "yes" : "no",
      mainOutputOccurred: "no",
    },
    comparison: "different",
    physicsResult: physicsSnapshotFrom(runSceneExperiment(experimentId)),
    authoredBeforeIntervention: true,
    sufficient: true,
  };
}

export function enginePredictions() {
  return [
    {
      prediction: "no-main-output",
      reasoning: "没有燃烧可能就没有主要动力。",
      timestamp: "2026-09-11T00:01:00.000Z",
      experimentId: ENGINE_EXPERIMENT_A,
      committed: true as const,
    },
    {
      prediction: "no-main-output",
      reasoning: "活塞不能动应该就没有输出。",
      timestamp: "2026-09-11T00:05:00.000Z",
      experimentId: ENGINE_EXPERIMENT_B,
      committed: true as const,
    },
  ];
}

export function sufficientEngineObservation() {
  return {
    text: "活塞会上下运动；有时进气门打开",
    timestamp: "t",
    selectedOptionIds: ["piston-up-down", "intake-opens"],
    watchedFullCycle: true,
    sufficient: true,
  };
}

export function sufficientEngineDescription() {
  return {
    text: "活塞向下运动，这里出现了燃烧。",
    timestamp: "t",
    sufficient: true,
    pistonMotionCorrect: true,
    intakeValveStateCorrect: true,
    combustionStateCorrect: true,
    distinguishesPowerEvent: true,
  };
}

export function sufficientEngineExplanation() {
  return {
    text: "燃烧以后气体先变了，再推动活塞，机械部分才动起来。",
    timestamp: "t",
    referencesCombustionOrEnergyRelease: true,
    identifiesWorkingGasChange: true,
    identifiesMechanicalInteraction: true,
    identifiesWorkLikeCausalLink: true,
    distinguishesCombustionFromDirectMechanicalOutput: true,
    engineAnswers: {
      firstChange: "working-gas",
      gasEffect: "gas-pushes",
      mechanicalGain: "work-like",
    },
    sufficient: true,
  };
}

export function explainReadySession(): LearningSession {
  return engineSession({
    stage: LearningStage.EXPLAIN,
    observations: [sufficientEngineObservation()],
    descriptions: [sufficientEngineDescription()],
    predictions: enginePredictions(),
    experimentEvidence: [
      closedEngineEvidence(ENGINE_EXPERIMENT_A),
      closedEngineEvidence(ENGINE_EXPERIMENT_B),
    ],
  });
}

export function modelReadySession(): LearningSession {
  return {
    ...explainReadySession(),
    stage: LearningStage.MODEL,
    explanations: [sufficientEngineExplanation()],
  };
}

export function validEngineModelAttempt() {
  return buildEngineModelAttempt(completeEngineModelInput("t"));
}

export function transferReadySession(): LearningSession {
  return {
    ...modelReadySession(),
    stage: LearningStage.TRANSFER,
    modelAttempts: [validEngineModelAttempt()],
  };
}

export function examReadySession(): LearningSession {
  return {
    ...transferReadySession(),
    stage: LearningStage.EXAM,
    transferAttempts: [
      buildEngineTransferAttempt(completeEngineFullModelInput("t1")),
      buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
    ],
    events: [
      createLearningEvent(
        "stage_entered",
        LearningStage.EXAM,
        undefined,
        () => "2026-09-11T00:10:00.000Z",
      ),
    ],
  };
}

export function completedEngineExamAttempts() {
  return ENGINE_EXAM_PATTERN_IDS.map((id, index) =>
    buildEngineExamAttempt(completeEngineExamInput(id, `t-exam-${index}`)),
  );
}

export function aiOffReadySession(): LearningSession {
  return {
    ...examReadySession(),
    stage: LearningStage.AI_OFF,
    examAttempts: completedEngineExamAttempts(),
    events: [
      createLearningEvent(
        "stage_entered",
        LearningStage.EXAM,
        undefined,
        () => "2026-09-11T00:10:00.000Z",
      ),
      createLearningEvent(
        "stage_entered",
        LearningStage.AI_OFF,
        undefined,
        () => "2026-09-11T00:20:00.000Z",
      ),
      createLearningEvent(
        "ai_off_started",
        LearningStage.AI_OFF,
        undefined,
        () => "2026-09-11T00:20:01.000Z",
      ),
    ],
  };
}
