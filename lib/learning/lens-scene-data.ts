import type { LensDescribeInput } from "@/lib/learning/lens-describe";
import {
  asLensObservedResult,
  type LensObservedResult,
} from "@/lib/learning/lens-experiment";
import {
  LENS_AI_OFF_DRAFT_KIND,
  emptyLensAiOffDraft,
  type LensAiOffDraft,
} from "@/lib/learning/lens-ai-off";
import {
  LENS_EXAM_DRAFT_KIND,
  emptyLensExamDraft,
  type LensExamDraft,
} from "@/lib/learning/lens-exam";
import {
  emptyLensModelDraft,
  type LensModelDraft,
} from "@/lib/learning/lens-model";
import {
  LENS_TRANSFER_DRAFT_KIND,
  emptyLensTransferDraft,
  type LensTransferDraft,
} from "@/lib/learning/lens-transfer";
import { emptyLensExplainInput, type LensExplainInput } from "@/lib/learning/lens-explain";
import type { LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";
import type { LearningSession } from "@/types/learning";

export const LENS_WATCHED_DEMO_KEY = "watchedObserveDemo";
export const LENS_MANIPULATED_BENCH_KEY = "learnerManipulatedObserveBench";
export const LENS_OBSERVE_DRAFT_KEY = "observeDraft";
export const LENS_PREDICT_DRAFT_KEY = "predictDraft";
export const LENS_EXPERIMENT_FORM_KEY = "experimentFormDraft";
export const LENS_DESCRIBE_DRAFT_KEY = "describeDraft";
export const LENS_EXPLAIN_DRAFT_KEY = "explainDraft";
export const LENS_MODEL_DRAFT_KEY = "modelDraft";
export const LENS_TRANSFER_DRAFT_KEY = "transferDraft";
export const LENS_EXAM_DRAFT_KEY = "examDraft";
export const LENS_AI_OFF_DRAFT_KEY = "aiOffDraft";
export const LENS_TRIAL_GATE_KEY = "trialGate";

export interface LensTrialGate {
  awaitingNext: boolean;
  completedId?: LensExperimentId;
}

export function emptyLensSceneData(): Record<string, unknown> {
  return {
    [LENS_WATCHED_DEMO_KEY]: false,
    [LENS_MANIPULATED_BENCH_KEY]: false,
  };
}

/** True after the learner plays the OBSERVE demo. Distinct from bench manipulation. */
export function lensWatchedObserveDemo(session: LearningSession): boolean {
  return session.sceneData[LENS_WATCHED_DEMO_KEY] === true;
}

/** True after the learner moved the object or screen during OBSERVE. Trace ≠ Evidence. */
export function lensLearnerManipulatedObserveBench(session: LearningSession): boolean {
  return session.sceneData[LENS_MANIPULATED_BENCH_KEY] === true;
}

export function lensObserveDraft(session: LearningSession): string[] | null {
  const draft = session.sceneData[LENS_OBSERVE_DRAFT_KEY];
  if (!Array.isArray(draft)) {
    return null;
  }
  return draft.filter((item): item is string => typeof item === "string");
}

export function withLensObserveDraft(
  sceneData: Record<string, unknown>,
  selectedOptionIds: string[],
): Record<string, unknown> {
  return { ...sceneData, [LENS_OBSERVE_DRAFT_KEY]: selectedOptionIds };
}

export function lensPredictDraft(
  session: LearningSession,
): { experimentId: string; outcome: string; reason: string } | null {
  const draft = session.sceneData[LENS_PREDICT_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  const record = draft as Record<string, unknown>;
  if (typeof record.experimentId !== "string") {
    return null;
  }
  return {
    experimentId: record.experimentId,
    outcome: typeof record.outcome === "string" ? record.outcome : "",
    reason: typeof record.reason === "string" ? record.reason : "",
  };
}

export function withLensPredictDraft(
  sceneData: Record<string, unknown>,
  draft: { experimentId: string; outcome: string; reason: string },
): Record<string, unknown> {
  return { ...sceneData, [LENS_PREDICT_DRAFT_KEY]: draft };
}

export function lensExperimentFormDraft(session: LearningSession): {
  experimentId: string;
  observed: LensObservedResult;
  comparison: "" | "same" | "different" | "partial";
  reflection: string;
} | null {
  const draft = session.sceneData[LENS_EXPERIMENT_FORM_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  const record = draft as Record<string, unknown>;
  if (typeof record.experimentId !== "string") {
    return null;
  }
  const comparison =
    record.comparison === "same" ||
    record.comparison === "different" ||
    record.comparison === "partial"
      ? record.comparison
      : "";
  return {
    experimentId: record.experimentId,
    observed: asLensObservedResult(
      record.observed && typeof record.observed === "object"
        ? record.observed
        : undefined,
    ),
    comparison,
    reflection: typeof record.reflection === "string" ? record.reflection : "",
  };
}

export function lensTrialGate(session: LearningSession): LensTrialGate {
  const gate = session.sceneData[LENS_TRIAL_GATE_KEY];
  if (!gate || typeof gate !== "object") {
    return { awaitingNext: false };
  }
  const record = gate as Record<string, unknown>;
  return {
    awaitingNext: record.awaitingNext === true,
    completedId:
      typeof record.completedId === "string"
        ? (record.completedId as LensExperimentId)
        : undefined,
  };
}

export function withLensTrialGate(
  sceneData: Record<string, unknown>,
  gate: LensTrialGate,
): Record<string, unknown> {
  return { ...sceneData, [LENS_TRIAL_GATE_KEY]: gate };
}

export function withLensExperimentFormDraft(
  sceneData: Record<string, unknown>,
  draft: {
    experimentId: string;
    observed: LensObservedResult;
    comparison: "" | "same" | "different" | "partial";
    reflection: string;
  },
): Record<string, unknown> {
  return { ...sceneData, [LENS_EXPERIMENT_FORM_KEY]: draft };
}

export function withLensWatchedDemo(
  sceneData: Record<string, unknown>,
  watched: boolean,
): Record<string, unknown> {
  return { ...sceneData, [LENS_WATCHED_DEMO_KEY]: watched };
}

export function withLensManipulatedObserveBench(
  sceneData: Record<string, unknown>,
  manipulated: boolean,
): Record<string, unknown> {
  return { ...sceneData, [LENS_MANIPULATED_BENCH_KEY]: manipulated };
}

export function lensDescribeDraft(session: LearningSession): LensDescribeInput | null {
  const draft = session.sceneData[LENS_DESCRIBE_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  return draft as LensDescribeInput;
}

export function withLensDescribeDraft(
  sceneData: Record<string, unknown>,
  draft: LensDescribeInput,
): Record<string, unknown> {
  return { ...sceneData, [LENS_DESCRIBE_DRAFT_KEY]: draft };
}

export function lensExplainDraft(session: LearningSession): LensExplainInput {
  const draft = session.sceneData[LENS_EXPLAIN_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensExplainInput();
  }
  return { ...emptyLensExplainInput(), ...(draft as Partial<LensExplainInput>) };
}

export function withLensExplainDraft(
  sceneData: Record<string, unknown>,
  draft: LensExplainInput,
): Record<string, unknown> {
  return { ...sceneData, [LENS_EXPLAIN_DRAFT_KEY]: draft };
}

export function lensModelDraft(session: LearningSession): LensModelDraft {
  const draft = session.sceneData[LENS_MODEL_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensModelDraft();
  }
  const merged = { ...emptyLensModelDraft(), ...(draft as Partial<LensModelDraft>) };
  const step = merged.constructionStep;
  return {
    ...merged,
    constructionStep:
      typeof step === "number" && step >= 1 && step <= 7 ? step : 1,
  };
}

export function withLensModelDraft(
  sceneData: Record<string, unknown>,
  draft: LensModelDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_MODEL_DRAFT_KEY]: draft };
}

export function lensTransferDraft(session: LearningSession): LensTransferDraft {
  const draft = session.sceneData[LENS_TRANSFER_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensTransferDraft();
  }
  const record = draft as Partial<LensTransferDraft>;
  const empty = emptyLensTransferDraft(record.targetId);
  return {
    kind: LENS_TRANSFER_DRAFT_KIND,
    targetId: record.targetId ?? empty.targetId,
    objectStation: record.objectStation ?? "",
    meetingMode: record.meetingMode ?? "",
    side: record.side ?? "",
    nature: record.nature ?? "",
    orientation: record.orientation ?? "",
    size: record.size ?? "",
    screenReceivable: record.screenReceivable ?? "",
    studentExplanation: record.studentExplanation ?? "",
    surfaceCueSelected: record.surfaceCueSelected === true,
    authoredInterpretation: record.authoredInterpretation ?? null,
  };
}

export function withLensTransferDraft(
  sceneData: Record<string, unknown>,
  draft: LensTransferDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_TRANSFER_DRAFT_KEY]: draft };
}

export function lensExamDraft(session: LearningSession): LensExamDraft {
  const draft = session.sceneData[LENS_EXAM_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensExamDraft();
  }
  const record = draft as Partial<LensExamDraft>;
  const empty = emptyLensExamDraft(
    Array.isArray(record.patternIds) ? record.patternIds : undefined,
  );
  return {
    kind: LENS_EXAM_DRAFT_KIND,
    patternIds: empty.patternIds,
    currentPatternId: record.currentPatternId ?? empty.currentPatternId,
    step:
      record.step === "model" || record.step === "answer" || record.step === "representation"
        ? record.step
        : "representation",
    representation: record.representation ?? "",
    modelRecognition: record.modelRecognition ?? "",
    selectedAnswer: record.selectedAnswer ?? "",
    reasoning: record.reasoning ?? "",
    retiredPatternIds: Array.isArray(record.retiredPatternIds)
      ? record.retiredPatternIds
      : [],
  };
}

export function withLensExamDraft(
  sceneData: Record<string, unknown>,
  draft: LensExamDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_EXAM_DRAFT_KEY]: draft };
}

export function lensAiOffDraft(session: LearningSession): LensAiOffDraft {
  const draft = session.sceneData[LENS_AI_OFF_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensAiOffDraft();
  }
  const record = draft as Partial<LensAiOffDraft>;
  const empty = emptyLensAiOffDraft(
    Array.isArray(record.challengeIds) ? record.challengeIds : undefined,
  );
  return {
    kind: LENS_AI_OFF_DRAFT_KIND,
    challengeIds: empty.challengeIds,
    currentChallengeId: record.currentChallengeId ?? empty.currentChallengeId,
    step: record.step === "post-check" ? "post-check" : "response",
    objectStation: record.objectStation ?? "",
    meetingMode: record.meetingMode ?? "",
    side: record.side ?? "",
    nature: record.nature ?? "",
    orientation: record.orientation ?? "",
    size: record.size ?? "",
    screenReceivable: record.screenReceivable ?? "",
    selectedAnswer: record.selectedAnswer ?? "",
    reasoning: record.reasoning ?? "",
    authoredInterpretation: record.authoredInterpretation ?? null,
    postCheckSelections: Array.isArray(record.postCheckSelections)
      ? record.postCheckSelections
      : [],
    retiredChallengeIds: Array.isArray(record.retiredChallengeIds)
      ? record.retiredChallengeIds
      : [],
  };
}

export function withLensAiOffDraft(
  sceneData: Record<string, unknown>,
  draft: LensAiOffDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_AI_OFF_DRAFT_KEY]: draft };
}
