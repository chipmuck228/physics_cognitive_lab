import { LENS_COPY, LENS_PHASE_STAGES } from "@/lib/content/convex-lens-optical-bench";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { advanceIfReady } from "@/lib/learning/advance";
import type { LensDomainOutcome } from "@/lib/learning/lens-action-response";
import {
  applyLensAiOffPostCheck,
  buildLensAiOffAssessment,
  buildLensAiOffAttempt,
  canCommitLensAiOffResponse,
  evaluateLensAiOffAttempt,
  lensAiOffDraftFromCommittedAttempt,
  lensAiOffPostCheckRepair,
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
import {
  lensFeedbackForFailureKind,
  lensTransferFeedback,
  lensTransferRepairFeedback,
} from "@/lib/learning/lens-feedback";
import {
  activeIncompleteLensEvidence,
  activeLensExperimentId,
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
  lensModelRepairStep,
  type LensModelDraft,
} from "@/lib/learning/lens-model";
import {
  evaluateLensObservationEligibility,
  lensObservationLabelsFor,
  lensObserveMissingMessage,
  lensPerformedObserveInteraction,
} from "@/lib/learning/lens-observe";
import {
  evaluateLensPrediction,
  firstCommittedLensPrediction,
} from "@/lib/learning/lens-predict";
import { appendLensInteractionTrace } from "@/lib/learning/lens-interaction-trace";
import { applyLensReviewPhysics, isLensRevisiting } from "@/lib/learning/lens-revisit";
import {
  lensAiOffDraft,
  lensExamDraft,
  lensTrialGate,
  withLensAiOffDraft,
  withLensDescribeDraft,
  withLensExamDraft,
  withLensExplainDraft,
  withLensModelDraft,
  withLensObserveDraft,
  withLensManipulatedObserveBench,
  withLensTransferDraft,
  withLensTrialGate,
  withLensWatchedDemo,
} from "@/lib/learning/lens-scene-data";
import {
  isRequiredLensTrialAction,
  lensTrialSpec,
  lensTrialStartState,
  nextLensTrialId,
  type LensTrialLearnerAction,
} from "@/lib/learning/lens-trial-intervention";
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
  runObserveDemo,
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_ORDER,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import {
  getConvexLensPhysicsState,
  wrapConvexLensPhysicsState,
} from "@/lib/runtime/physics-state";
import {
  CONVEX_LENS_SCENE_ID,
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
  if (!target) {
    return session;
  }
  const inPhase = (LENS_PHASE_STAGES as readonly LearningStage[]).includes(target);
  if (!inPhase && target !== LearningStage.COMPLETE) {
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
  if (!hasCompleteLensObservedResult(form.observed)) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.reflectionNeedObserved },
    };
  }
  if (!isLensComparison(form.comparison)) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.reflectionNeedCompare },
    };
  }
  if (!hasOwnWords(form.reflection)) {
    return {
      session,
      outcome: { kind: "missing", message: LENS_COPY.reflectionNeedOwnWords },
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
  const closed = hasClosedLensExperiment(next, experimentId);
  const following = nextLensTrialId(experimentId);
  const gated =
    closed && following
      ? {
          ...next,
          sceneData: withLensTrialGate(next.sceneData, {
            awaitingNext: true,
            completedId: experimentId,
          }),
        }
      : next;
  const advanced = advanceLensLoop(gated);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
      message: closed
        ? `第 ${LENS_EXPERIMENT_ORDER.indexOf(experimentId) + 1} 次验证完成`
        : LENS_COPY.reflectionSaved,
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
  const prepared = prepareLensTrialStart(advanced, experimentId);
  return {
    session: prepared,
    outcome: {
      kind: "committed",
      advanced: prepared.stage !== session.stage,
      message: LENS_COPY.predictSaved,
    },
  };
}

function prepareLensTrialStart(
  session: LearningSession,
  experimentId: LensExperimentId,
): LearningSession {
  const current = getConvexLensPhysicsState(session);
  const start = lensTrialStartState(experimentId, current);
  return appendLensInteractionTrace(
    {
      ...session,
      physicsState: wrapConvexLensPhysicsState(start),
    },
    {
      action: "prepare-trial",
      stage: session.stage,
      substep: "trial-prepared",
      from: current.objectStation,
      to: start.objectStation,
      mode: "working",
    },
  );
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
  const performedInteraction = lensPerformedObserveInteraction(session);
  const evaluation = evaluateLensObservationEligibility(
    selectedOptionIds,
    performedInteraction,
  );
  const observation: ObservationEvidence = {
    text: lensObservationLabelsFor(selectedOptionIds),
    timestamp: new Date().toISOString(),
    selectedOptionIds: evaluation.selectedOptionIds,
    watchedFullCycle: performedInteraction,
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
      outcome: {
        kind: "missing",
        message: lensObserveMissingMessage(evaluation.missingKind),
      },
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
    const repairStep = lensModelRepairStep(attempt.failureKinds?.[0], draft);
    if (incomplete || attempt.failureKinds?.includes("missing-required-construction-pair")) {
      return {
        session: next,
        outcome: {
          kind: "missing",
          message: lensFeedbackForFailureKind(
            attempt.failureKinds?.[0],
            lensModelMissingLabels(draft),
          ).message,
          repairStep,
        },
      };
    }
    return {
      session: next,
      outcome: {
        kind: "rejected",
        message: lensFeedbackForFailureKind(attempt.failureKinds?.[0], []).message,
        repairStep,
      },
    };
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
      message: LENS_COPY.modelAccepted,
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
  const repair = lensTransferRepairFeedback(draft);
  if (!structured) {
    return {
      session: next,
      outcome: { kind: "missing", message: repair?.message ?? LENS_COPY.transferStructureIncomplete },
    };
  }
  if (!attempt.accepted) {
    return {
      session: next,
      outcome: {
        kind: "rejected",
        message: repair?.message ?? lensTransferFeedback(attempt.failureKinds?.[0]).message,
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
  const evalDraft = lensAiOffDraftFromCommittedAttempt(original, {
    ...lensAiOffDraft(session),
    currentChallengeId: input.challengeId,
  });
  const evaluation = evaluateLensAiOffAttempt({
    draft: evalDraft,
    postCheckIds: input.postCheckIds,
    llmUsed,
  });
  attempts[actualIndex] = applyLensAiOffPostCheck(
    original,
    evalDraft,
    input.postCheckIds,
    llmUsed,
  );
  const assessment = buildLensAiOffAssessment(attempts, llmUsed);
  const nextDraft = nextLensAiOffDraft(
    assessment,
    lensAiOffDraft(session),
    input.challengeId,
  );
  const next = {
    ...session,
    independentAssessment: assessment,
    sceneData: withLensAiOffDraft(session.sceneData, nextDraft),
    events: [
      ...session.events,
      createLearningEvent("student_response", session.stage, {
        kind: "lens-ai-off-post-check",
        challengeId: input.challengeId,
        accepted: attempts[actualIndex]?.accepted,
      }),
    ],
  };
  const accepted = attempts[actualIndex]?.accepted === true;
  if (!accepted) {
    const repair = lensAiOffPostCheckRepair(
      input.challengeId,
      input.postCheckIds,
      false,
      evaluation.official.ok,
    );
    return {
      session: next,
      outcome: {
        kind: repair?.kind === "missing" ? "missing" : "rejected",
        message: repair?.message,
      },
    };
  }
  const advanced = advanceLensLoop(next);
  return {
    session: advanced,
    outcome: {
      kind: "committed",
      advanced: advanced.stage !== session.stage,
      message:
        advanced.stage !== session.stage
          ? "这次对照已经记下。"
          : "刚才那题已经记下。现在看下一题。",
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
  if (activeIncompleteLensEvidence(session, experimentId)) {
    return { enabled: true };
  }
  if (hasClosedLensExperiment(session, experimentId)) {
    return { enabled: false, reason: "这次验证已经记下了。" };
  }
  return { enabled: false, reason: LENS_COPY.observeNeedIntervention };
}

export function applyLensAcknowledgeNextTrial(
  session: LearningSession,
): LensActionResult {
  if (isLensRevisiting(session)) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  if (session.stage !== LearningStage.EXPERIMENT) {
    return blocked(session, "现在不能开始下一轮验证。");
  }
  const gate = lensTrialGate(session);
  if (!gate.awaitingNext || !gate.completedId) {
    return blocked(session, "现在没有下一轮可以开始。");
  }
  return {
    session: appendLensInteractionTrace(
      {
        ...session,
        sceneData: withLensTrialGate(session.sceneData, { awaitingNext: false }),
      },
      {
        action: "acknowledge-next-trial",
        stage: session.stage,
        from: gate.completedId,
        to: nextLensTrialId(gate.completedId) ?? undefined,
        mode: "working",
      },
    ),
    outcome: {
      kind: "committed",
      message: `可以开始第 ${LENS_EXPERIMENT_ORDER.indexOf(gate.completedId) + 2} 次验证。`,
    },
  };
}

export function applyLensTrialIntervention(
  session: LearningSession,
  experimentId: LensExperimentId,
  action: LensTrialLearnerAction,
): LensActionResult {
  if (isLensRevisiting(session)) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  if (session.stage !== LearningStage.EXPERIMENT) {
    return blocked(session, "现在不能在光具座上做这次改变。");
  }
  if (lensTrialGate(session).awaitingNext) {
    return blocked(session, "先开始下一轮验证，再动手。");
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
    return blocked(session, "这次要求的改变已经做过了。");
  }
  if (!isRequiredLensTrialAction(experimentId, action)) {
    return blocked(session, lensTrialSpec(experimentId).wrongActionReason);
  }
  const applied = applyLensRunExperiment(session, experimentId);
  if (applied.outcome.kind !== "physics-applied") {
    return applied;
  }
  return {
    session: appendLensInteractionTrace(applied.session, {
      action: action.kind === "cover-lens" ? "cover-lens" : "move-object",
      stage: session.stage,
      substep: "trial-intervention",
      to: action.kind === "cover-lens" ? "covered" : action.station,
      mode: "working",
    }),
    outcome: {
      kind: "physics-applied",
      review: false,
      message: "已经在光具座上完成这次改变。看清楚刚才发生了什么。",
    },
  };
}

export function applyLensCoverLens(session: LearningSession): LensActionResult {
  const experimentId = activeLensExperimentId(session);
  if (!experimentId) {
    return blocked(session, "现在不能遮住透镜。");
  }
  return applyLensTrialIntervention(session, experimentId, { kind: "cover-lens" });
}

export function applyLensObjectStationChange(
  session: LearningSession,
  toStation: ObjectStation,
): LensActionResult {
  if (session.physicsState.sceneId !== CONVEX_LENS_SCENE_ID) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const current = getConvexLensPhysicsState(session);
  if (current.objectStation === toStation && !isLensRevisiting(session)) {
    return {
      session,
      outcome: { kind: "physics-applied", review: false, message: "物体已经在这个位置。" },
    };
  }
  const fromStation = current.objectStation;
  const nextState = { ...current, objectStation: toStation };
  if (isLensRevisiting(session)) {
    const reviewed = appendLensInteractionTrace(
      applyLensReviewPhysics(session, () => nextState),
      {
        action: "move-object",
        stage: session.stage,
        from: fromStation,
        to: toStation,
        mode: "review",
      },
    );
    return {
      session: reviewed,
      outcome: { kind: "physics-applied", review: true },
    };
  }
  if (session.stage === LearningStage.EXPERIMENT) {
    const experimentId = activeLensExperimentId(session);
    if (!experimentId) {
      return blocked(session, "现在不能随便改物体位置。");
    }
    return applyLensTrialIntervention(session, experimentId, {
      kind: "move-object",
      station: toStation,
    });
  }
  if (session.stage !== LearningStage.OBSERVE) {
    return blocked(session, "现在不能随便改物体位置。");
  }
  const next = appendLensInteractionTrace(
    {
      ...session,
      sceneData: withLensManipulatedObserveBench(session.sceneData, true),
      physicsState: wrapConvexLensPhysicsState(nextState),
    },
    {
      action: "move-object",
      stage: session.stage,
      from: fromStation,
      to: toStation,
      mode: "working",
    },
  );
  return {
    session: next,
    outcome: { kind: "physics-applied", review: false, message: "已经换了物体位置。" },
  };
}

export function applyLensScreenChange(
  session: LearningSession,
  atImagePlane: boolean,
): LensActionResult {
  if (session.physicsState.sceneId !== CONVEX_LENS_SCENE_ID) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const current = getConvexLensPhysicsState(session);
  const nextState = { ...current, screenAtImagePlane: atImagePlane };
  if (isLensRevisiting(session)) {
    return {
      session: appendLensInteractionTrace(
        applyLensReviewPhysics(session, () => nextState),
        {
          action: "move-screen",
          stage: session.stage,
          from: String(current.screenAtImagePlane),
          to: String(atImagePlane),
          mode: "review",
        },
      ),
      outcome: { kind: "physics-applied", review: true },
    };
  }
  if (session.stage !== LearningStage.OBSERVE) {
    return blocked(session, "现在不能随便移光屏。");
  }
  return {
    session: appendLensInteractionTrace(
      {
        ...session,
        sceneData: withLensManipulatedObserveBench(session.sceneData, true),
        physicsState: wrapConvexLensPhysicsState(nextState),
      },
      {
        action: "move-screen",
        stage: session.stage,
        from: String(current.screenAtImagePlane),
        to: String(atImagePlane),
        mode: "working",
      },
    ),
    outcome: {
      kind: "physics-applied",
      review: false,
      message: atImagePlane ? LENS_COPY.screenAtImage : LENS_COPY.screenOffImage,
    },
  };
}

export function applyLensObserveDemoCycle(session: LearningSession): LensActionResult {
  const current = getConvexLensPhysicsState(session);
  const nextState = runObserveDemo(current.demoStationIndex + 1);
  if (isLensRevisiting(session)) {
    return {
      session: appendLensInteractionTrace(
        applyLensReviewPhysics(session, () => nextState),
        {
          action: "move-object",
          stage: session.stage,
          from: current.objectStation,
          to: nextState.objectStation,
          mode: "review",
        },
      ),
      outcome: { kind: "physics-applied", review: true },
    };
  }
  if (session.stage !== LearningStage.OBSERVE) {
    return blocked(session, "现在不能换物体位置。");
  }
  return {
    session: appendLensInteractionTrace(
      {
        ...session,
        sceneData: withLensWatchedDemo(session.sceneData, true),
        physicsState: wrapConvexLensPhysicsState(nextState),
      },
      {
        action: "move-object",
        stage: session.stage,
        from: current.objectStation,
        to: nextState.objectStation,
        mode: "working",
      },
    ),
    outcome: { kind: "physics-applied", review: false, message: "已经换了物体位置。" },
  };
}

export function applyLensModelStationChoice(
  session: LearningSession,
  draft: LensModelDraft,
  station: ObjectStation,
): LensActionResult {
  if (isLensRevisiting(session) || session.stage !== LearningStage.MODEL) {
    return blocked(session, LENS_COPY.reviewCannotEdit);
  }
  const nextDraft = { ...draft, objectStation: station };
  return {
    session: appendLensInteractionTrace(
      {
        ...session,
        sceneData: withLensModelDraft(session.sceneData, nextDraft),
      },
      {
        action: "choose-object-station",
        stage: session.stage,
        substep: "construction-1",
        from: draft.objectStation || undefined,
        to: station,
        mode: "working",
      },
    ),
    outcome: { kind: "committed", message: "已经记下这个物距站点。" },
  };
}

function blocked(session: LearningSession, message?: string): LensActionResult {
  return {
    session,
    outcome: { kind: "blocked", message },
  };
}
