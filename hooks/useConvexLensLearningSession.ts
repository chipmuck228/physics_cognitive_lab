"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { advanceIfReady } from "@/lib/learning/advance";
import {
  advanceLensLoop,
  applyLensComparisonSave,
  applyLensObservedSave,
  applyLensPredictionCommit,
  applyLensReflectionSave,
  applyLensRunExperiment,
  type LensExperimentForm,
} from "@/lib/learning/lens-action";
import type { LensDomainOutcome } from "@/lib/learning/lens-action-response";
import {
  applyLensAiOffPostCheck,
  buildLensAiOffAssessment,
  buildLensAiOffAttempt,
  hasCompletedLensAiOff,
  lensTutorUsedDuringIndependent,
  nextLensAiOffDraft,
  type LensAiOffDraft,
} from "@/lib/learning/lens-ai-off";
import {
  evaluateLensDescription,
  type LensDescribeInput,
} from "@/lib/learning/lens-describe";
import { type LensObservedResult } from "@/lib/learning/lens-experiment";
import {
  evaluateLensObservation,
  lensObservationLabelsFor,
} from "@/lib/learning/lens-observe";
import {
  lensAiOffDraft,
  lensExamDraft,
  lensModelDraft,
  withLensAiOffDraft,
  withLensDescribeDraft,
  withLensExamDraft,
  withLensExperimentFormDraft,
  withLensExplainDraft,
  withLensModelDraft,
  withLensObserveDraft,
  withLensPredictDraft,
  withLensTransferDraft,
  withLensWatchedDemo,
} from "@/lib/learning/lens-scene-data";
import {
  evaluateLensExplanation,
  type LensExplainInput,
} from "@/lib/learning/lens-explain";
import {
  buildLensExamAttempt,
  hasCompletedLensExam,
  nextLensExamDraft,
  type LensExamDraft,
  type LensExamInput,
} from "@/lib/learning/lens-exam";
import {
  buildLensModelAttempt,
  type LensModelDraft,
} from "@/lib/learning/lens-model";
import {
  activeLensTransferTargetId,
  buildLensTransferAttempt,
  emptyLensTransferDraft,
  type LensTransferDraft,
} from "@/lib/learning/lens-transfer";
import {
  applyLensHelpIntent,
  applyLensHelpNext,
  availableLensHelpIntents,
  type LensHelpIntentId,
} from "@/lib/learning/lens-help-intents";
import {
  applyLensGoBack,
  applyLensReturnToProgress,
  applyLensReviewPhysics,
  canLensGoBack,
  isLensRevisiting,
} from "@/lib/learning/lens-revisit";
import { createLearningEvent } from "@/lib/learning/events";
import { canLeaveStage } from "@/lib/learning/progression";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  resetStoredSession,
  subscribeSession,
  updateSession,
} from "@/lib/learning/session-store";
import {
  runObserveDemo,
  type ConvexLensSceneState,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";
import {
  getConvexLensPhysicsState,
  wrapConvexLensPhysicsState,
} from "@/lib/runtime/physics-state";
import {
  CONVEX_LENS_SCENE_ID,
  LearningStage,
  type DescriptionEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
} from "@/types/learning";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";

export function useConvexLensLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot(CONVEX_LENS_SCENE_ID),
    getServerSessionSnapshot,
  );

  const startLesson = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.ENTRY) {
        return current;
      }
      return advanceLensLoop(current);
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    if (
      session.stage === LearningStage.TRANSFER &&
      canLeaveStage(session, LearningStage.EXAM) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.EXAM,
      )
    ) {
      updateSession((current) => advanceIfReady(current), CONVEX_LENS_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.EXAM &&
      hasCompletedLensExam(session.examAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.AI_OFF,
      )
    ) {
      updateSession((current) => advanceIfReady(current), CONVEX_LENS_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.AI_OFF &&
      hasCompletedLensAiOff(session) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.COMPLETE,
      )
    ) {
      updateSession((current) => advanceIfReady(current), CONVEX_LENS_SCENE_ID);
    }
  }, [session, session?.sessionId, session?.stage]);

  const goBack = useCallback(() => {
    updateSession((current) => applyLensGoBack(current), CONVEX_LENS_SCENE_ID);
  }, []);

  const returnToProgress = useCallback(() => {
    updateSession((current) => applyLensReturnToProgress(current), CONVEX_LENS_SCENE_ID);
  }, []);

  const selectHelpIntent = useCallback((intentId: LensHelpIntentId) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage === LearningStage.AI_OFF) {
        return current;
      }
      const draft = lensModelDraft(current);
      const context = {
        constructionStep: draft.constructionStep,
        modelDraft: draft,
      };
      if (!availableLensHelpIntents(current.stage, context).includes(intentId)) {
        return current;
      }
      return applyLensHelpIntent(current, current.stage, intentId, context);
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const revealHelpNext = useCallback(() => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage === LearningStage.AI_OFF) {
        return current;
      }
      const draft = lensModelDraft(current);
      const context = {
        constructionStep: draft.constructionStep,
        modelDraft: draft,
      };
      return applyLensHelpNext(current, current.stage, context);
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const updatePhysics = useCallback((updater: (state: ConvexLensSceneState) => ConvexLensSceneState) => {
    updateSession((current) => {
      if (current.physicsState.sceneId !== CONVEX_LENS_SCENE_ID) {
        return current;
      }
      if (isLensRevisiting(current)) {
        return applyLensReviewPhysics(current, updater);
      }
      return {
        ...current,
        physicsState: wrapConvexLensPhysicsState(
          updater(getConvexLensPhysicsState(current)),
        ),
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const markDemoWatched = useCallback(() => {
    updateSession((current) => {
      if (isLensRevisiting(current)) {
        return applyLensReviewPhysics(current, (state) =>
          runObserveDemo(state.demoStationIndex + 1),
        );
      }
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      const currentState = getConvexLensPhysicsState(current);
      return {
        ...current,
        sceneData: withLensWatchedDemo(current.sceneData, true),
        physicsState: wrapConvexLensPhysicsState(
          runObserveDemo(currentState.demoStationIndex + 1),
        ),
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const setScreenAtImagePlane = useCallback((atPlane: boolean) => {
    updateSession((current) => {
      if (current.physicsState.sceneId !== CONVEX_LENS_SCENE_ID) {
        return current;
      }
      if (isLensRevisiting(current)) {
        return applyLensReviewPhysics(current, (state) => ({
          ...state,
          screenAtImagePlane: atPlane,
        }));
      }
      return {
        ...current,
        physicsState: wrapConvexLensPhysicsState({
          ...getConvexLensPhysicsState(current),
          screenAtImagePlane: atPlane,
        }),
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const setObjectStation = useCallback((station: ObjectStation) => {
    updatePhysics((state) => ({ ...state, objectStation: station }));
  }, [updatePhysics]);

  const saveObservation = useCallback((selectedOptionIds: string[]) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      const evaluation = evaluateLensObservation(selectedOptionIds);
      const observation: ObservationEvidence = {
        text: lensObservationLabelsFor(selectedOptionIds),
        timestamp: new Date().toISOString(),
        selectedOptionIds: evaluation.selectedOptionIds,
        watchedFullCycle: current.sceneData.watchedObserveDemo === true,
        sufficient: evaluation.sufficient,
      };
      const next = {
        ...current,
        observations: [...current.observations, observation],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "observation",
            sufficient: evaluation.sufficient,
          }),
        ],
      };
      return evaluation.sufficient ? advanceLensLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveDescription = useCallback((input: LensDescribeInput) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.DESCRIBE) {
        return current;
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
        ...current,
        sceneData: withLensDescribeDraft(current.sceneData, input),
        descriptions: [...current.descriptions, description],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "description",
            sufficient: evaluation.sufficient,
          }),
        ],
      };
      return evaluation.sufficient ? advanceLensLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const commitPrediction = useCallback(
    (experimentId: LensExperimentId, outcome: string, reason: string): LensDomainOutcome =>
      captureLensAction((current) =>
        applyLensPredictionCommit(current, experimentId, outcome, reason),
      ),
    [],
  );

  const runExperiment = useCallback((experimentId: LensExperimentId): LensDomainOutcome => {
    return captureLensAction((current) => applyLensRunExperiment(current, experimentId));
  }, []);

  const saveObservedResult = useCallback(
    (experimentId: LensExperimentId, observed: LensObservedResult): LensDomainOutcome =>
      captureLensAction((current) => applyLensObservedSave(current, experimentId, observed)),
    [],
  );

  const saveComparison = useCallback(
    (experimentId: LensExperimentId, comparison: string): LensDomainOutcome =>
      captureLensAction((current) => applyLensComparisonSave(current, experimentId, comparison)),
    [],
  );

  const saveReflection = useCallback(
    (experimentId: LensExperimentId, form: LensExperimentForm): LensDomainOutcome =>
      captureLensAction((current) => applyLensReflectionSave(current, experimentId, form)),
    [],
  );

  const saveExplanation = useCallback((input: LensExplainInput) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.EXPLAIN) {
        return current;
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
        ...current,
        sceneData: withLensExplainDraft(current.sceneData, input),
        explanations: [...current.explanations, explanation],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "explanation",
            sufficient: evaluation.sufficient,
          }),
        ],
      };
      return evaluation.sufficient ? advanceLensLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveExplainDraft = useCallback((input: LensExplainInput) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      return { ...current, sceneData: withLensExplainDraft(current.sceneData, input) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveModelDraft = useCallback((draft: LensModelDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.MODEL) {
        return current;
      }
      return { ...current, sceneData: withLensModelDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveModelAttempt = useCallback((draft: LensModelDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.MODEL) {
        return current;
      }
      const attempt = buildLensModelAttempt(draft, new Date().toISOString());
      const next = {
        ...current,
        sceneData: withLensModelDraft(current.sceneData, draft),
        modelAttempts: [...current.modelAttempts, attempt],
        events: [
          ...current.events,
          createLearningEvent("model_submitted", current.stage, {
            correctStructure: attempt.correctStructure,
            completenessOnly: attempt.completenessOnly,
            failureKinds: attempt.failureKinds,
          }),
        ],
      };
      return attempt.correctStructure ? advanceLensLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveTransferDraft = useCallback((draft: LensTransferDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      return { ...current, sceneData: withLensTransferDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveTransferAttempt = useCallback((draft: LensTransferDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      const attempt = buildLensTransferAttempt(draft, new Date().toISOString());
      const nextAttempts = [...current.transferAttempts, attempt];
      const nextTarget = attempt.accepted
        ? activeLensTransferTargetId(nextAttempts)
        : draft.targetId;
      const nextDraft = attempt.accepted
        ? emptyLensTransferDraft(nextTarget)
        : draft;
      const next = {
        ...current,
        transferAttempts: nextAttempts,
        sceneData: withLensTransferDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("transfer_attempted", current.stage, {
            targetId: attempt.targetId,
            accepted: attempt.accepted,
          }),
        ],
      };
      return attempt.accepted ? advanceLensLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveExamDraft = useCallback((draft: LensExamDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.EXAM) {
        return current;
      }
      return { ...current, sceneData: withLensExamDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback((input: LensExamInput) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.EXAM) {
        return current;
      }
      const attempt = buildLensExamAttempt(input);
      const nextAttempts = [...current.examAttempts, attempt];
      const nextDraft = nextLensExamDraft(nextAttempts, lensExamDraft(current), input.patternId);
      const next = {
        ...current,
        examAttempts: nextAttempts,
        sceneData: withLensExamDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("exam_answered", current.stage, {
            patternId: attempt.patternId,
            correct: attempt.correct,
          }),
        ],
      };
      return advanceLensLoop(next);
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveAiOffDraft = useCallback((draft: LensAiOffDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return { ...current, sceneData: withLensAiOffDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback((draft: LensAiOffDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      const llmUsed = lensTutorUsedDuringIndependent(current);
      const attempt = buildLensAiOffAttempt(draft, new Date().toISOString(), [], llmUsed);
      const attempts = [
        ...(current.independentAssessment?.challengeAttempts ?? []),
        attempt,
      ];
      const assessment = buildLensAiOffAssessment(attempts, llmUsed);
      return {
        ...current,
        independentAssessment: assessment,
        sceneData: withLensAiOffDraft(current.sceneData, {
          ...draft,
          step: "post-check",
          postCheckSelections: [],
        }),
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "lens-ai-off-commit",
            challengeId: attempt.challengeId,
          }),
        ],
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveAiOffPostCheck = useCallback(
    (input: { challengeId: string; postCheckIds: string[] }) => {
      updateSession((current) => {
        if (isLensRevisiting(current) || current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        const attempts = [...(current.independentAssessment?.challengeAttempts ?? [])];
        const index = [...attempts]
          .reverse()
          .findIndex((attempt) => attempt.challengeId === input.challengeId);
        if (index < 0) {
          return current;
        }
        const actualIndex = attempts.length - 1 - index;
        const original = attempts[actualIndex];
        if (!original) {
          return current;
        }
        const llmUsed = lensTutorUsedDuringIndependent(current);
        attempts[actualIndex] = applyLensAiOffPostCheck(
          original,
          lensAiOffDraft(current),
          input.postCheckIds,
          llmUsed,
        );
        const assessment = buildLensAiOffAssessment(attempts, llmUsed);
        const next = {
          ...current,
          independentAssessment: assessment,
          sceneData: withLensAiOffDraft(
            current.sceneData,
            nextLensAiOffDraft(assessment, lensAiOffDraft(current), input.challengeId),
          ),
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "lens-ai-off-post-check",
              challengeId: input.challengeId,
              accepted: attempts[actualIndex]?.accepted,
            }),
          ],
        };
        return advanceLensLoop(next);
      }, CONVEX_LENS_SCENE_ID);
    },
    [],
  );

  const saveObserveDraft = useCallback((selectedOptionIds: string[]) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      return {
        ...current,
        sceneData: withLensObserveDraft(current.sceneData, selectedOptionIds),
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveDescribeDraft = useCallback((input: LensDescribeInput) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.DESCRIBE) {
        return current;
      }
      return { ...current, sceneData: withLensDescribeDraft(current.sceneData, input) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const savePredictDraft = useCallback(
    (experimentId: LensExperimentId, outcome: string, reason: string) => {
      updateSession((current) => {
        if (isLensRevisiting(current)) {
          return current;
        }
        if (
          current.stage !== LearningStage.PREDICT &&
          current.stage !== LearningStage.EXPERIMENT
        ) {
          return current;
        }
        return {
          ...current,
          sceneData: withLensPredictDraft(current.sceneData, {
            experimentId,
            outcome,
            reason,
          }),
        };
      }, CONVEX_LENS_SCENE_ID);
    },
    [],
  );

  const saveExperimentFormDraft = useCallback(
    (
      experimentId: LensExperimentId,
      observed: LensObservedResult,
      comparison: "" | "same" | "different" | "partial",
      reflection: string,
    ) => {
      updateSession((current) => {
        if (isLensRevisiting(current) || current.stage !== LearningStage.EXPERIMENT) {
          return current;
        }
        return {
          ...current,
          sceneData: withLensExperimentFormDraft(current.sceneData, {
            experimentId,
            observed,
            comparison,
            reflection,
          }),
        };
      }, CONVEX_LENS_SCENE_ID);
    },
    [],
  );

  const startOver = useCallback(() => {
    resetStoredSession(CONVEX_LENS_SCENE_ID);
  }, []);

  const canGoBack = Boolean(session && canLensGoBack(session));

  return {
    session,
    hydrated: Boolean(session),
    startLesson,
    goBack,
    returnToProgress,
    selectHelpIntent,
    revealHelpNext,
    markDemoWatched,
    setScreenAtImagePlane,
    setObjectStation,
    saveObserveDraft,
    saveObservation,
    saveDescription,
    saveDescribeDraft,
    savePredictDraft,
    commitPrediction,
    runExperiment,
    saveExperimentFormDraft,
    saveObservedResult,
    saveComparison,
    saveReflection,
    saveExplanation,
    saveExplainDraft,
    saveModelDraft,
    saveModelAttempt,
    saveTransferDraft,
    saveTransferAttempt,
    saveExamDraft,
    saveExamAttempt,
    saveAiOffDraft,
    saveAiOffIndependentResponse,
    saveAiOffPostCheck,
    startOver,
    canGoBack,
  };
}

function captureLensAction(
  apply: (session: LearningSession) => { session: LearningSession; outcome: LensDomainOutcome },
): LensDomainOutcome {
  let outcome: LensDomainOutcome = { kind: "blocked" };
  updateSession((current) => {
    const result = apply(current);
    outcome = result.outcome;
    return result.session;
  }, CONVEX_LENS_SCENE_ID);
  return outcome;
}
