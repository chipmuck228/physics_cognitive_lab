import { LENS_COPY, LENS_PHASE_STAGES } from "@/lib/content/convex-lens-optical-bench";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { advanceIfReady } from "@/lib/learning/advance";
import type { LensDomainOutcome } from "@/lib/learning/lens-action-response";
import {
  activeIncompleteLensEvidence,
  authoredBeforeIntervention,
  canRunLensExperiment,
  hasClosedLensExperiment,
  hasCompleteLensObservedResult,
  isLensComparison,
  isLensExperimentClosed,
  lensComparisonLabel,
  patchIncompleteLensEvidence,
  runSceneLensExperiment,
  type LensObservedResult,
} from "@/lib/learning/lens-experiment";
import {
  evaluateLensPrediction,
  firstCommittedLensPrediction,
} from "@/lib/learning/lens-predict";
import { isLensRevisiting } from "@/lib/learning/lens-revisit";
import { createLearningEvent } from "@/lib/learning/events";
import { nextStage } from "@/lib/learning/state-machine";
import {
  convexLensPhysicsSnapshot,
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_ORDER,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";
import {
  getConvexLensPhysicsState,
  wrapConvexLensPhysicsState,
} from "@/lib/runtime/physics-state";
import {
  LearningStage,
  type ExperimentEvidence,
  type LearningSession,
  type PredictionEvidence,
} from "@/types/learning";

export interface LensExperimentForm {
  observed: LensObservedResult;
  comparison: "" | "same" | "different" | "partial";
  reflection: string;
}

export interface LensActionResult {
  session: LearningSession;
  outcome: LensDomainOutcome;
}

export interface LensActionEligibility {
  enabled: boolean;
  reason?: string;
}

export function advanceLensLoop(session: LearningSession): LearningSession {
  const target = nextStage(session.stage);
  if (!target || !(LENS_PHASE_STAGES as readonly LearningStage[]).includes(target)) {
    return session;
  }
  return advanceIfReady(session);
}

export function lensReflectionEligibility(
  session: LearningSession,
  experimentId: LensExperimentId,
): LensActionEligibility {
  if (isLensRevisiting(session)) {
    return { enabled: false, reason: LENS_COPY.reviewCannotEdit };
  }
  if (session.stage !== LearningStage.EXPERIMENT) {
    return { enabled: false, reason: LENS_COPY.reviewCannotEdit };
  }
  if (!activeIncompleteLensEvidence(session, experimentId)) {
    return { enabled: false, reason: LENS_COPY.reflectionAlready };
  }
  return { enabled: true };
}

export function applyLensReflectionSave(
  session: LearningSession,
  experimentId: LensExperimentId,
  form: LensExperimentForm,
): LensActionResult {
  const eligibility = lensReflectionEligibility(session, experimentId);
  if (!eligibility.enabled) {
    return blocked(session, eligibility.reason);
  }
  if (!hasOwnWords(form.reflection)) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.reflectionNeedOwnWords },
    };
  }
  if (!hasCompleteLensObservedResult(form.observed) || !isLensComparison(form.comparison)) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.reflectionNeedRecord },
    };
  }
  const next = patchIncompleteLensEvidence(session, experimentId, (evidence) => {
    const updated: ExperimentEvidence = {
      ...evidence,
      observedResult: form.observed,
      comparison: form.comparison,
      predictionComparison: lensComparisonLabel(form.comparison),
      reflection: form.reflection.trim(),
      sufficient: false,
    };
    return {
      ...updated,
      sufficient: isLensExperimentClosed(updated),
    };
  });
  if (next === session) {
    return blocked(session, LENS_COPY.reflectionAlready);
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
      message: LENS_COPY.reflectionSaved,
    },
  };
}

export function lensObservedEligibility(
  session: LearningSession,
  experimentId: LensExperimentId,
): LensActionEligibility {
  return lensOpenTrialEligibility(session, experimentId);
}

export function applyLensObservedSave(
  session: LearningSession,
  experimentId: LensExperimentId,
  observed: LensObservedResult,
): LensActionResult {
  const eligibility = lensObservedEligibility(session, experimentId);
  if (!eligibility.enabled) {
    return blocked(session, eligibility.reason);
  }
  if (!hasCompleteLensObservedResult(observed)) {
    return {
      session,
      outcome: { kind: "missing", message: "先记下光屏和像分别怎样了。" },
    };
  }
  const next = patchIncompleteLensEvidence(session, experimentId, (evidence) => ({
    ...evidence,
    observedResult: observed,
  }));
  if (next === session) {
    return blocked(session, LENS_COPY.reflectionAlready);
  }
  return {
    session: next,
    outcome: { kind: "committed", message: LENS_COPY.observedSaved },
  };
}

export function lensComparisonEligibility(
  session: LearningSession,
  experimentId: LensExperimentId,
): LensActionEligibility {
  return lensOpenTrialEligibility(session, experimentId);
}

export function applyLensComparisonSave(
  session: LearningSession,
  experimentId: LensExperimentId,
  comparison: string,
): LensActionResult {
  const eligibility = lensComparisonEligibility(session, experimentId);
  if (!eligibility.enabled) {
    return blocked(session, eligibility.reason);
  }
  if (!isLensComparison(comparison)) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.comparisonNeedSelect },
    };
  }
  const next = patchIncompleteLensEvidence(session, experimentId, (evidence) => ({
    ...evidence,
    comparison,
    predictionComparison: lensComparisonLabel(comparison),
  }));
  if (next === session) {
    return blocked(session, LENS_COPY.reflectionAlready);
  }
  return {
    session: next,
    outcome: { kind: "committed", message: LENS_COPY.comparisonSaved },
  };
}

export function applyLensPredictionCommit(
  session: LearningSession,
  experimentId: LensExperimentId,
  outcome: string,
  reason: string,
): LensActionResult {
  if (isLensRevisiting(session)) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const allowed =
    session.stage === LearningStage.PREDICT || session.stage === LearningStage.EXPERIMENT;
  if (!allowed) {
    return blocked(session, "现在不能锁定预测。");
  }
  const order = LENS_EXPERIMENT_ORDER as readonly string[];
  const index = order.indexOf(experimentId);
  if (index > 0) {
    const previous = order[index - 1] as LensExperimentId;
    if (
      session.stage !== LearningStage.EXPERIMENT ||
      !hasClosedLensExperiment(session, previous)
    ) {
      return blocked(session, "先走完上一轮验证，再锁定这一次预测。");
    }
  }
  if (experimentId !== LENS_EXPERIMENT_A && session.stage !== LearningStage.EXPERIMENT) {
    return blocked(session, "现在不能锁定这次预测。");
  }
  if (firstCommittedLensPrediction(session.predictions, experimentId)) {
    return blocked(session, LENS_COPY.predictSaved);
  }
  const evaluation = evaluateLensPrediction(outcome, reason);
  if (!evaluation.sufficient) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.predictNeedOwnWords },
    };
  }
  const prediction: PredictionEvidence = {
    prediction: outcome,
    reasoning: reason.trim(),
    timestamp: new Date().toISOString(),
    experimentId,
    committed: true,
  };
  const next: LearningSession = {
    ...session,
    predictions: [...session.predictions, prediction],
    events: [
      ...session.events,
      createLearningEvent("prediction_made", session.stage, {
        experimentId,
        outcome,
      }),
    ],
  };
  const advanced = experimentId === LENS_EXPERIMENT_A ? advanceLensLoop(next) : next;
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
      message: LENS_COPY.predictSaved,
    },
  };
}

export function applyLensRunExperiment(
  session: LearningSession,
  experimentId: LensExperimentId,
): LensActionResult {
  if (isLensRevisiting(session)) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  if (session.stage !== LearningStage.EXPERIMENT) {
    return blocked(session, "现在不能开始验证。");
  }
  if (!canRunLensExperiment(session, experimentId)) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.runNeedPrediction },
    };
  }
  if (
    activeIncompleteLensEvidence(session, experimentId) ||
    hasClosedLensExperiment(session, experimentId)
  ) {
    return blocked(session, "这次验证已经做过了。");
  }
  const prediction = firstCommittedLensPrediction(session.predictions, experimentId);
  if (!prediction) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.runNeedPrediction },
    };
  }
  const currentState = getConvexLensPhysicsState(session);
  const physics = runSceneLensExperiment(experimentId, currentState);
  const interventionAt = new Date().toISOString();
  const evidence: ExperimentEvidence = {
    prediction: prediction.prediction,
    predictionReason: prediction.reasoning,
    predictionComparison: "",
    reflection: "",
    timestamp: interventionAt,
    experimentId,
    committedAt: prediction.timestamp,
    interventionAt,
    intervention: { objectStation: physics.after.objectStation },
    observedResult: { screen: "", sizeOrCover: "" },
    comparison: "",
    physicsResult: convexLensPhysicsSnapshot(physics.after),
    authoredBeforeIntervention: authoredBeforeIntervention(
      prediction.timestamp,
      interventionAt,
    ),
    sufficient: false,
  };
  return {
    session: {
      ...session,
      physicsState: wrapConvexLensPhysicsState(physics.after),
      experimentEvidence: [...session.experimentEvidence, evidence],
      events: [
        ...session.events,
        createLearningEvent("experiment_run", session.stage, {
          experimentId,
        }),
      ],
    },
    outcome: {
      kind: "physics-applied",
      review: false,
      message: "已经开始这一次验证。",
    },
  };
}

function lensOpenTrialEligibility(
  session: LearningSession,
  experimentId: LensExperimentId,
): LensActionEligibility {
  if (isLensRevisiting(session)) {
    return { enabled: false, reason: LENS_COPY.reviewCannotEdit };
  }
  if (session.stage !== LearningStage.EXPERIMENT) {
    return { enabled: false, reason: LENS_COPY.reviewCannotEdit };
  }
  if (!activeIncompleteLensEvidence(session, experimentId)) {
    return { enabled: false, reason: "这次验证已经记下了。" };
  }
  return { enabled: true };
}

function blocked(session: LearningSession, message?: string): LensActionResult {
  return {
    session,
    outcome: { kind: "blocked", message },
  };
}
