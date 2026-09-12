"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { LENS_PHASE_STAGES } from "@/lib/content/convex-lens-optical-bench";
import { advanceIfReady } from "@/lib/learning/advance";
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
import {
  activeIncompleteLensEvidence,
  authoredBeforeIntervention,
  canRunLensExperiment,
  emptyLensObservedResult,
  hasClosedLensExperiment,
  isLensComparison,
  isLensExperimentClosed,
  lensComparisonLabel,
  runSceneLensExperiment,
  type LensObservedResult,
} from "@/lib/learning/lens-experiment";
import {
  evaluateLensObservation,
  lensObservationLabelsFor,
} from "@/lib/learning/lens-observe";
import {
  evaluateLensPrediction,
  firstCommittedLensPrediction,
} from "@/lib/learning/lens-predict";
import {
  lensAiOffDraft,
  lensExamDraft,
  withLensAiOffDraft,
  withLensDescribeDraft,
  withLensExamDraft,
  withLensExplainDraft,
  withLensModelDraft,
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
import { nextLensHint } from "@/lib/learning/lens-hint-ladder";
import { createLearningEvent } from "@/lib/learning/events";
import { canLeaveStage } from "@/lib/learning/progression";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  resetStoredSession,
  subscribeSession,
  updateSession,
} from "@/lib/learning/session-store";
import { previousStage, nextStage } from "@/lib/learning/state-machine";
import {
  convexLensPhysicsSnapshot,
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_ORDER,
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
  type ExperimentEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
  type PredictionEvidence,
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
      return advanceWithinLoop(current);
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
    updateSession((current) => {
      const target = previousStage(current.stage);
      if (!target || !canLeaveStage(current, target)) {
        return current;
      }
      return {
        ...current,
        stage: target,
        events: [...current.events, createLearningEvent("stage_entered", target)],
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const updatePhysics = useCallback((updater: (state: ConvexLensSceneState) => ConvexLensSceneState) => {
    updateSession((current) => {
      if (current.physicsState.sceneId !== CONVEX_LENS_SCENE_ID) {
        return current;
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
    updatePhysics((state) => ({ ...state, screenAtImagePlane: atPlane }));
  }, [updatePhysics]);

  const setObjectStation = useCallback((station: ObjectStation) => {
    updatePhysics((state) => ({ ...state, objectStation: station }));
  }, [updatePhysics]);

  const saveObservation = useCallback((selectedOptionIds: string[]) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
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
      return evaluation.sufficient ? advanceWithinLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveDescription = useCallback((input: LensDescribeInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
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
      return evaluation.sufficient ? advanceWithinLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const commitPrediction = useCallback(
    (experimentId: LensExperimentId, outcome: string, reason: string) => {
      updateSession((current) => {
        const allowed =
          current.stage === LearningStage.PREDICT ||
          current.stage === LearningStage.EXPERIMENT;
        if (!allowed) {
          return current;
        }
        const order = LENS_EXPERIMENT_ORDER as readonly string[];
        const index = order.indexOf(experimentId);
        if (index > 0) {
          const previous = order[index - 1] as LensExperimentId;
          if (
            current.stage !== LearningStage.EXPERIMENT ||
            !hasClosedLensExperiment(current, previous)
          ) {
            return current;
          }
        }
        if (
          experimentId !== LENS_EXPERIMENT_A &&
          current.stage !== LearningStage.EXPERIMENT
        ) {
          return current;
        }
        if (firstCommittedLensPrediction(current.predictions, experimentId)) {
          return current;
        }
        const evaluation = evaluateLensPrediction(outcome, reason);
        if (!evaluation.sufficient) {
          return current;
        }
        const prediction: PredictionEvidence = {
          prediction: outcome,
          reasoning: reason.trim(),
          timestamp: new Date().toISOString(),
          experimentId,
          committed: true,
        };
        const next = {
          ...current,
          predictions: [...current.predictions, prediction],
          events: [
            ...current.events,
            createLearningEvent("prediction_made", current.stage, {
              experimentId,
              outcome,
            }),
          ],
        };
        return experimentId === LENS_EXPERIMENT_A ? advanceWithinLoop(next) : next;
      }, CONVEX_LENS_SCENE_ID);
    },
    [],
  );

  const runExperiment = useCallback((experimentId: LensExperimentId) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPERIMENT) {
        return current;
      }
      if (!canRunLensExperiment(current, experimentId)) {
        return current;
      }
      if (
        activeIncompleteLensEvidence(current, experimentId) ||
        hasClosedLensExperiment(current, experimentId)
      ) {
        return current;
      }
      const prediction = firstCommittedLensPrediction(current.predictions, experimentId);
      if (!prediction) {
        return current;
      }
      const currentState = getConvexLensPhysicsState(current);
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
        observedResult: emptyLensObservedResult(),
        comparison: "",
        physicsResult: convexLensPhysicsSnapshot(physics.after),
        authoredBeforeIntervention: authoredBeforeIntervention(
          prediction.timestamp,
          interventionAt,
        ),
        sufficient: false,
      };
      return {
        ...current,
        physicsState: wrapConvexLensPhysicsState(physics.after),
        experimentEvidence: [...current.experimentEvidence, evidence],
        events: [
          ...current.events,
          createLearningEvent("experiment_run", current.stage, {
            experimentId,
          }),
        ],
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveObservedResult = useCallback(
    (experimentId: LensExperimentId, observed: LensObservedResult) => {
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            observedResult: observed,
          })),
        CONVEX_LENS_SCENE_ID,
      );
    },
    [],
  );

  const saveComparison = useCallback(
    (experimentId: LensExperimentId, comparison: "same" | "different" | "partial") => {
      if (!isLensComparison(comparison)) {
        return;
      }
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            comparison,
            predictionComparison: lensComparisonLabel(comparison),
          })),
        CONVEX_LENS_SCENE_ID,
      );
    },
    [],
  );

  const saveReflection = useCallback(
    (experimentId: LensExperimentId, reflection: string) => {
      updateSession((current) => {
        const next = patchIncompleteEvidence(current, experimentId, (evidence) => {
          const updated = { ...evidence, reflection: reflection.trim() };
          return {
            ...updated,
            sufficient: isLensExperimentClosed({ ...updated, sufficient: false }),
          };
        });
        return advanceWithinLoop(next);
      }, CONVEX_LENS_SCENE_ID);
    },
    [],
  );

  const saveExplanation = useCallback((input: LensExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
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
      return evaluation.sufficient ? advanceWithinLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveExplainDraft = useCallback((input: LensExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      return { ...current, sceneData: withLensExplainDraft(current.sceneData, input) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveModelDraft = useCallback((draft: LensModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      return { ...current, sceneData: withLensModelDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveModelAttempt = useCallback((draft: LensModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
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
      return attempt.correctStructure ? advanceWithinLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveTransferDraft = useCallback((draft: LensTransferDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      return { ...current, sceneData: withLensTransferDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveTransferAttempt = useCallback((draft: LensTransferDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
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
      return attempt.accepted ? advanceWithinLoop(next) : next;
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveExamDraft = useCallback((draft: LensExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return { ...current, sceneData: withLensExamDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback((input: LensExamInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
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
      return advanceWithinLoop(next);
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveAiOffDraft = useCallback((draft: LensAiOffDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return { ...current, sceneData: withLensAiOffDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback((draft: LensAiOffDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
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
        if (current.stage !== LearningStage.AI_OFF) {
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
        return advanceWithinLoop(next);
      }, CONVEX_LENS_SCENE_ID);
    },
    [],
  );

  const revealHint = useCallback(() => {
    updateSession((current) => {
      if (
        current.stage !== LearningStage.EXPLAIN &&
        current.stage !== LearningStage.MODEL &&
        current.stage !== LearningStage.TRANSFER &&
        current.stage !== LearningStage.EXAM
      ) {
        return current;
      }
      const hint = nextLensHint(current.events, current.stage);
      if (!hint) {
        return current;
      }
      return {
        ...current,
        events: [
          ...current.events,
          createLearningEvent("ai_interaction", current.stage, {
            source: "hint-ladder",
            hintId: hint.id,
          }),
        ],
      };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const startOver = useCallback(() => {
    resetStoredSession(CONVEX_LENS_SCENE_ID);
  }, []);

  const canGoBack = Boolean(
    session && previousStage(session.stage) && session.stage !== LearningStage.ENTRY,
  );

  return {
    session,
    hydrated: Boolean(session),
    startLesson,
    goBack,
    markDemoWatched,
    setScreenAtImagePlane,
    setObjectStation,
    saveObservation,
    saveDescription,
    commitPrediction,
    runExperiment,
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
    revealHint,
    startOver,
    canGoBack,
  };
}

function advanceWithinLoop(session: LearningSession): LearningSession {
  const target = nextStage(session.stage);
  if (!target || !(LENS_PHASE_STAGES as readonly LearningStage[]).includes(target)) {
    return session;
  }
  return advanceIfReady(session);
}

function patchIncompleteEvidence(
  session: LearningSession,
  experimentId: LensExperimentId,
  updater: (evidence: ExperimentEvidence) => ExperimentEvidence,
): LearningSession {
  const index = [...session.experimentEvidence]
    .map((item, itemIndex) => ({ item, itemIndex }))
    .reverse()
    .find(
      ({ item }) => item.experimentId === experimentId && item.sufficient !== true,
    )?.itemIndex;
  if (index == null) {
    return session;
  }
  return {
    ...session,
    experimentEvidence: session.experimentEvidence.map((item, itemIndex) =>
      itemIndex === index ? updater(item) : item,
    ),
  };
}
