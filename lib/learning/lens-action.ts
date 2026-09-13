import { LENS_COPY, LENS_PHASE_STAGES } from "@/lib/content/convex-lens-optical-bench";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { advanceIfReady } from "@/lib/learning/advance";
import type { LensDomainOutcome } from "@/lib/learning/lens-action-response";
import {
  applyLensAiOffPostCheck,
  buildLensAiOffAssessment,
  buildLensAiOffAttempt,
  canCommitLensAiOffResponse,
  lensTutorUsedDuringIndependent,
  nextLensAiOffDraft,
  type LensAiOffDraft,
} from "@/lib/learning/lens-ai-off";
import {
  evaluateLensDescription,
  type LensDescribeInput,
} from "@/lib/learning/lens-describe";
import {
  buildLensExamAttempt,
  canCommitLensExamAttempt,
  nextLensExamDraft,
  summarizeLensExamAttempt,
  type LensExamInput,
} from "@/lib/learning/lens-exam";
import {
  evaluateLensExplanation,
  type LensExplainInput,
} from "@/lib/learning/lens-explain";
import { lensFeedbackForFailureKind, lensTransferFeedback } from "@/lib/learning/lens-feedback";
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
  buildLensModelAttempt,
  draftToConvexLensAttempt,
  lensModelMissingLabels,
  type LensModelDraft,
} from "@/lib/learning/lens-model";
import {
  evaluateLensObservation,
  lensObservationLabelsFor,
} from "@/lib/learning/lens-observe";
import {
  evaluateLensPrediction,
  firstCommittedLensPrediction,
} from "@/lib/learning/lens-predict";
import { isLensRevisiting } from "@/lib/learning/lens-revisit";
import {
  lensAiOffDraft,
  lensExamDraft,
  withLensAiOffDraft,
  withLensDescribeDraft,
  withLensExamDraft,
  withLensExplainDraft,
  withLensModelDraft,
  withLensObserveDraft,
  withLensTransferDraft,
} from "@/lib/learning/lens-scene-data";
import {
  activeLensTransferTargetId,
  buildLensTransferAttempt,
  draftToLensTransferAttempt,
  emptyLensTransferDraft,
  type LensTransferDraft,
} from "@/lib/learning/lens-transfer";
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
  type DescriptionEvidence,
  type ExperimentEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
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

export function applyLensObservationSave(
  session: LearningSession,
  selectedOptionIds: string[],
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.OBSERVE) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const evaluation = evaluateLensObservation(selectedOptionIds);
  const observation: ObservationEvidence = {
    text: lensObservationLabelsFor(selectedOptionIds),
    timestamp: new Date().toISOString(),
    selectedOptionIds: evaluation.selectedOptionIds,
    watchedFullCycle: session.sceneData.watchedObserveDemo === true,
    sufficient: evaluation.sufficient,
  };
  const next = {
    ...session,
    sceneData: withLensObserveDraft(session.sceneData, selectedOptionIds),
    observations: [...session.observations, observation],
    events: [
      ...session.events,
      createLearningEvent("student_response", session.stage, {
        kind: "observation",
        sufficient: evaluation.sufficient,
      }),
    ],
  };
  if (!evaluation.sufficient) {
    return {
      session: next,
      outcome: { kind: "missing", message: LENS_COPY.observeNeedMore },
    };
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
      message: "已经记下你看见的。",
    },
  };
}

export function applyLensDescriptionSave(
  session: LearningSession,
  input: LensDescribeInput,
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.DESCRIBE) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const evaluation = evaluateLensDescription(input);
  const description: DescriptionEvidence = {
    text: input.studentDescription.trim(),
    object: input.object,
    quantity: input.quantities,
    change: input.change,
    sufficient: evaluation.sufficient,
    timestamp: new Date().toISOString(),
  };
  const next = {
    ...session,
    sceneData: withLensDescribeDraft(session.sceneData, input),
    descriptions: [...session.descriptions, description],
    events: [
      ...session.events,
      createLearningEvent("student_response", session.stage, {
        kind: "description",
        sufficient: evaluation.sufficient,
      }),
    ],
  };
  if (!evaluation.sufficient) {
    return {
      session: next,
      outcome: { kind: "missing", message: LENS_COPY.describeNeedStructure },
    };
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
    },
  };
}

export function applyLensExplanationSave(
  session: LearningSession,
  input: LensExplainInput,
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.EXPLAIN) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const evaluation = evaluateLensExplanation(input);
  const explanation: ExplanationEvidence = {
    text: input.studentExplanation.trim(),
    timestamp: new Date().toISOString(),
    lensAnswers: {
      meetingFragment: input.meetingFragment,
      screenFragment: input.screenFragment,
    },
    sufficient: evaluation.sufficient,
  };
  const next = {
    ...session,
    sceneData: withLensExplainDraft(session.sceneData, input),
    explanations: [...session.explanations, explanation],
    events: [
      ...session.events,
      createLearningEvent("student_response", session.stage, {
        kind: "explanation",
        sufficient: evaluation.sufficient,
      }),
    ],
  };
  if (!evaluation.sufficient) {
    return {
      session: next,
      outcome: { kind: "missing", message: LENS_COPY.explainNeedMore },
    };
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
    },
  };
}

export function applyLensModelSubmit(
  session: LearningSession,
  draft: LensModelDraft,
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.MODEL) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const attempt = buildLensModelAttempt(draft, new Date().toISOString());
  const next = {
    ...session,
    sceneData: withLensModelDraft(session.sceneData, draft),
    modelAttempts: [...session.modelAttempts, attempt],
    events: [
      ...session.events,
      createLearningEvent("model_submitted", session.stage, {
        correctStructure: attempt.correctStructure,
        completenessOnly: attempt.completenessOnly,
        failureKinds: attempt.failureKinds,
      }),
    ],
  };
  if (!attempt.correctStructure) {
    const incomplete = !draftToConvexLensAttempt(draft);
    if (incomplete || attempt.failureKinds?.includes("missing-required-construction-pair")) {
      return {
        session: next,
        outcome: {
          kind: "missing",
          message: lensFeedbackForFailureKind(
            attempt.failureKinds?.[0],
            lensModelMissingLabels(draft),
          ).message,
        },
      };
    }
    return {
      session: next,
      outcome: {
        kind: "rejected",
        message: lensFeedbackForFailureKind(attempt.failureKinds?.[0], []).message,
      },
    };
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
    },
  };
}

export function applyLensTransferSubmit(
  session: LearningSession,
  draft: LensTransferDraft,
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.TRANSFER) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const structured = draftToLensTransferAttempt(draft);
  const attempt = buildLensTransferAttempt(draft, new Date().toISOString());
  const nextAttempts = [...session.transferAttempts, attempt];
  const nextTarget = attempt.accepted
    ? activeLensTransferTargetId(nextAttempts)
    : draft.targetId;
  const nextDraft = attempt.accepted ? emptyLensTransferDraft(nextTarget) : draft;
  const next = {
    ...session,
    transferAttempts: nextAttempts,
    sceneData: withLensTransferDraft(session.sceneData, nextDraft),
    events: [
      ...session.events,
      createLearningEvent("transfer_attempted", session.stage, {
        targetId: attempt.targetId,
        accepted: attempt.accepted,
      }),
    ],
  };
  if (!structured) {
    return {
      session: next,
      outcome: { kind: "missing", message: LENS_COPY.transferNeedMore },
    };
  }
  if (!attempt.accepted) {
    return {
      session: next,
      outcome: {
        kind: "rejected",
        message: lensTransferFeedback(attempt.failureKinds?.[0]).message,
      },
    };
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
    },
  };
}

export function applyLensExamSubmit(
  session: LearningSession,
  input: LensExamInput,
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.EXAM) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  if (!canCommitLensExamAttempt(input)) {
    return {
      session,
      outcome: {
        kind: "missing",
        message: "先判断物体处在哪个成像区域，再选用关系，最后作答。",
      },
    };
  }
  const attempt = buildLensExamAttempt(input);
  const nextAttempts = [...session.examAttempts, attempt];
  const nextDraft = nextLensExamDraft(nextAttempts, lensExamDraft(session), input.patternId);
  const next = {
    ...session,
    examAttempts: nextAttempts,
    sceneData: withLensExamDraft(session.sceneData, nextDraft),
    events: [
      ...session.events,
      createLearningEvent("exam_answered", session.stage, {
        patternId: attempt.patternId,
        correct: attempt.correct,
      }),
    ],
  };
  const advanced = advanceLensLoop(next);
  if (!attempt.correct) {
    return {
      session: advanced,
      outcome: {
        kind: "rejected",
        message: summarizeLensExamAttempt(attempt),
      },
    };
  }
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
    },
  };
}

export function applyLensAiOffCommit(
  session: LearningSession,
  draft: LensAiOffDraft,
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.AI_OFF) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  if (!canCommitLensAiOffResponse(draft)) {
    return {
      session,
      outcome: { kind: "missing", message: "先选出判断，再写下理由。" },
    };
  }
  const llmUsed = lensTutorUsedDuringIndependent(session);
  const attempt = buildLensAiOffAttempt(draft, new Date().toISOString(), [], llmUsed);
  const attempts = [
    ...(session.independentAssessment?.challengeAttempts ?? []),
    attempt,
  ];
  const assessment = buildLensAiOffAssessment(attempts, llmUsed);
  return {
    session: {
      ...session,
      independentAssessment: assessment,
      sceneData: withLensAiOffDraft(session.sceneData, {
        ...draft,
        step: "post-check",
        postCheckSelections: [],
      }),
      events: [
        ...session.events,
        createLearningEvent("student_response", session.stage, {
          kind: "lens-ai-off-commit",
          challengeId: attempt.challengeId,
        }),
      ],
    },
    outcome: { kind: "committed" },
  };
}

export function applyLensAiOffPostCheckSave(
  session: LearningSession,
  input: { challengeId: string; postCheckIds: string[] },
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.AI_OFF) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const attempts = [...(session.independentAssessment?.challengeAttempts ?? [])];
  const index = [...attempts]
    .reverse()
    .findIndex((attempt) => attempt.challengeId === input.challengeId);
  if (index < 0) {
    return blocked(session, "先提交判断，再做对照。");
  }
  const actualIndex = attempts.length - 1 - index;
  const original = attempts[actualIndex];
  if (!original) {
    return blocked(session, "先提交判断，再做对照。");
  }
  const llmUsed = lensTutorUsedDuringIndependent(session);
  attempts[actualIndex] = applyLensAiOffPostCheck(
    original,
    lensAiOffDraft(session),
    input.postCheckIds,
    llmUsed,
  );
  const assessment = buildLensAiOffAssessment(attempts, llmUsed);
  const next = {
    ...session,
    independentAssessment: assessment,
    sceneData: withLensAiOffDraft(
      session.sceneData,
      nextLensAiOffDraft(assessment, lensAiOffDraft(session), input.challengeId),
    ),
    events: [
      ...session.events,
      createLearningEvent("student_response", session.stage, {
        kind: "lens-ai-off-post-check",
        challengeId: input.challengeId,
        accepted: attempts[actualIndex]?.accepted,
      }),
    ],
  };
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
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
