"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { CART_PHASE3_STAGES } from "@/lib/content/horizontal-force-cart";
import { advanceIfReady } from "@/lib/learning/advance";
import {
  cartTutorUsedDuringIndependent,
  applyCartAiOffPostCheck,
  buildCartAiOffAssessment,
  buildCartAiOffAttempt,
  hasCompletedCartAiOff,
  nextCartAiOffDraft,
  type CartAiOffDraft,
  type CartAiOffIndependentInput,
  type CartAiOffPostCheckInput,
} from "@/lib/learning/cart-ai-off";
import {
  evaluateCartDescription,
  type CartDescribeInput,
} from "@/lib/learning/cart-describe";
import {
  activeIncompleteCartEvidence,
  authoredBeforeIntervention,
  canRunCartExperiment,
  emptyCartObservedResult,
  hasClosedCartExperiment,
  isCartComparison,
  isCartExperimentClosed,
  cartComparisonLabel,
  runSceneCartExperiment,
} from "@/lib/learning/cart-experiment";
import {
  cartObservationLabelsFor,
  evaluateCartObservation,
} from "@/lib/learning/cart-observe";
import {
  evaluateCartPrediction,
  firstCommittedCartPrediction,
} from "@/lib/learning/cart-predict";
import {
  cartAiOffDraft,
  cartExamDraft,
  withCartAiOffDraft,
  withCartDescribeDraft,
  withCartExamDraft,
  withCartExplainDraft,
  withCartModelDraft,
  withCartTransferDraft,
  withCartWatchedDemo,
} from "@/lib/learning/cart-scene-data";
import {
  evaluateCartExplanation,
  type CartExplainInput,
} from "@/lib/learning/cart-explain";
import {
  buildCartExamAttempt,
  hasCompletedCartExam,
  nextCartExamDraft,
  type CartExamDraft,
  type CartExamInput,
} from "@/lib/learning/cart-exam";
import {
  buildCartModelAttempt,
  type CartModelDraft,
} from "@/lib/learning/cart-model";
import {
  activeCartTransferTargetId,
  buildCartTransferAttempt,
  emptyCartTransferDraft,
  type CartTransferInput,
} from "@/lib/learning/cart-transfer";
import { nextCartHint } from "@/lib/learning/cart-hint-ladder";
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
  CART_EXPERIMENT_A,
  CART_EXPERIMENT_B,
  cartPhysicsSnapshot,
  type CartExperimentId,
} from "@/lib/physics/horizontal-force-cart";
import { wrapCartPhysicsState } from "@/lib/runtime/physics-state";
import {
  CART_SCENE_ID,
  LearningStage,
  type DescriptionEvidence,
  type ExperimentEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
  type PredictionEvidence,
} from "@/types/learning";

type CartObservedResultInput = {
  speedChange: string;
  directionChanged: string;
  motionStateChange: string;
};

export function useCartLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot(CART_SCENE_ID),
    getServerSessionSnapshot,
  );

  const startLesson = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.ENTRY) {
        return current;
      }
      return advanceWithinPhase3(current);
    }, CART_SCENE_ID);
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
      updateSession((current) => advanceIfReady(current), CART_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.EXAM &&
      hasCompletedCartExam(session.examAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.AI_OFF,
      )
    ) {
      updateSession((current) => advanceIfReady(current), CART_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.AI_OFF &&
      hasCompletedCartAiOff(session) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.COMPLETE,
      )
    ) {
      updateSession((current) => advanceIfReady(current), CART_SCENE_ID);
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
        events: [
          ...current.events,
          createLearningEvent("stage_entered", target),
        ],
      };
    }, CART_SCENE_ID);
  }, []);

  const markDemoWatched = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      return {
        ...current,
        sceneData: withCartWatchedDemo(current.sceneData, true),
      };
    }, CART_SCENE_ID);
  }, []);

  const saveObservation = useCallback((selectedOptionIds: string[]) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      const evaluation = evaluateCartObservation(selectedOptionIds);
      const observation: ObservationEvidence = {
        text: cartObservationLabelsFor(selectedOptionIds),
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
      return evaluation.sufficient ? advanceWithinPhase3(next) : next;
    }, CART_SCENE_ID);
  }, []);

  const saveDescription = useCallback((input: CartDescribeInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
        return current;
      }
      const evaluation = evaluateCartDescription(input);
      const description: DescriptionEvidence = {
        text: input.studentDescription.trim(),
        object: input.object,
        quantity: input.forceDirection,
        change: input.observedChange,
        sufficient: evaluation.sufficient,
        timestamp: new Date().toISOString(),
      };
      const next = {
        ...current,
        sceneData: withCartDescribeDraft(current.sceneData, input),
        descriptions: [...current.descriptions, description],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "description",
            sufficient: evaluation.sufficient,
          }),
        ],
      };
      return evaluation.sufficient ? advanceWithinPhase3(next) : next;
    }, CART_SCENE_ID);
  }, []);

  const commitPrediction = useCallback(
    (experimentId: CartExperimentId, outcome: string, reason: string) => {
      updateSession((current) => {
        const allowedStage =
          current.stage === LearningStage.PREDICT ||
          current.stage === LearningStage.EXPERIMENT;
        if (!allowedStage) {
          return current;
        }
        if (
          experimentId === CART_EXPERIMENT_B &&
          (current.stage !== LearningStage.EXPERIMENT ||
            !hasClosedCartExperiment(current, CART_EXPERIMENT_A))
        ) {
          return current;
        }
        if (
          experimentId !== CART_EXPERIMENT_A &&
          current.stage !== LearningStage.EXPERIMENT
        ) {
          return current;
        }
        if (firstCommittedCartPrediction(current.predictions, experimentId)) {
          return current;
        }

        const evaluation = evaluateCartPrediction(outcome, reason);
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

        return experimentId === CART_EXPERIMENT_A
          ? advanceWithinPhase3(next)
          : next;
      }, CART_SCENE_ID);
    },
    [],
  );

  const runExperiment = useCallback((experimentId: CartExperimentId) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPERIMENT) {
        return current;
      }
      if (!canRunCartExperiment(current, experimentId)) {
        return current;
      }
      const incomplete = activeIncompleteCartEvidence(current, experimentId);
      if (incomplete || hasClosedCartExperiment(current, experimentId)) {
        return current;
      }
      const prediction = firstCommittedCartPrediction(
        current.predictions,
        experimentId,
      );
      if (!prediction) {
        return current;
      }

      const physics = runSceneCartExperiment(experimentId);
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
        intervention: physics.intervention,
        observedResult: emptyCartObservedResult(),
        comparison: "",
        physicsResult: cartPhysicsSnapshot(physics.after),
        authoredBeforeIntervention: authoredBeforeIntervention(
          prediction.timestamp,
          interventionAt,
        ),
        sufficient: false,
      };

      return {
        ...current,
        physicsState: wrapCartPhysicsState(physics.after),
        experimentEvidence: [...current.experimentEvidence, evidence],
        events: [
          ...current.events,
          createLearningEvent("experiment_run", current.stage, {
            experimentId,
            lastChange: physics.after.lastChange,
            speedTick: physics.after.speedTick,
            motionDirection: physics.after.motionDirection,
            netForce: physics.after.netForce,
          }),
        ],
      };
    }, CART_SCENE_ID);
  }, []);

  const saveObservedResult = useCallback(
    (experimentId: CartExperimentId, observed: CartObservedResultInput) => {
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            observedResult: observed,
          })),
        CART_SCENE_ID,
      );
    },
    [],
  );

  const saveComparison = useCallback(
    (
      experimentId: CartExperimentId,
      comparison: "same" | "different" | "partial",
    ) => {
      if (!isCartComparison(comparison)) {
        return;
      }
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            comparison,
            predictionComparison: cartComparisonLabel(comparison),
          })),
        CART_SCENE_ID,
      );
    },
    [],
  );

  const saveReflection = useCallback(
    (experimentId: CartExperimentId, reflection: string) => {
      updateSession((current) => {
        const next = patchIncompleteEvidence(current, experimentId, (evidence) => {
          const updated = {
            ...evidence,
            reflection: reflection.trim(),
          };
          return {
            ...updated,
            sufficient: isCartExperimentClosed({
              ...updated,
              sufficient: false,
            }),
          };
        });
        return advanceWithinPhase3(next);
      }, CART_SCENE_ID);
    },
    [],
  );

  const saveExplanation = useCallback((input: CartExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      const evaluation = evaluateCartExplanation(input);
      const explanation: ExplanationEvidence = {
        text: input.studentExplanation.trim(),
        timestamp: new Date().toISOString(),
        distinguishesForceFromMotion: evaluation.distinguishesForceFromMotion,
        connectsNonzeroForceToChange: evaluation.connectsNonzeroForceToChange,
        treatsZeroNetForceAsUnchanged: evaluation.treatsZeroNetForceAsUnchanged,
        doesNotRequireForwardForceToKeepMoving:
          evaluation.doesNotRequireForwardForceToKeepMoving,
        forceMotionAnswers: {
          forceVsMotion: input.forceVsMotion,
          sameDirection: input.sameDirection,
          oppositeDirection: input.oppositeDirection,
          zeroNetForce: input.zeroNetForce,
        },
        sufficient: evaluation.sufficient,
      };
      const next = {
        ...current,
        sceneData: withCartExplainDraft(current.sceneData, input),
        explanations: [...current.explanations, explanation],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "explanation",
            sufficient: evaluation.sufficient,
          }),
        ],
      };
      return evaluation.sufficient ? advanceWithinPhase3(next) : next;
    }, CART_SCENE_ID);
  }, []);

  const saveExplainDraft = useCallback((input: CartExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      return {
        ...current,
        sceneData: withCartExplainDraft(current.sceneData, input),
      };
    }, CART_SCENE_ID);
  }, []);

  const saveModelDraft = useCallback((draft: CartModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      return {
        ...current,
        sceneData: withCartModelDraft(current.sceneData, draft),
      };
    }, CART_SCENE_ID);
  }, []);

  const saveModelAttempt = useCallback((draft: CartModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      const attempt = buildCartModelAttempt({
        cases: draft.cases,
        conditions: draft.conditions,
        timestamp: new Date().toISOString(),
      });
      const next = {
        ...current,
        sceneData: withCartModelDraft(current.sceneData, draft),
        modelAttempts: [...current.modelAttempts, attempt],
        events: [
          ...current.events,
          createLearningEvent("model_submitted", current.stage, {
            correctStructure: attempt.correctStructure,
            failureKinds: attempt.failureKinds,
          }),
        ],
      };
      return attempt.correctStructure ? advanceWithinPhase3(next) : next;
    }, CART_SCENE_ID);
  }, []);

  const saveTransferDraft = useCallback((draft: ReturnType<typeof emptyCartTransferDraft>) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      return {
        ...current,
        sceneData: withCartTransferDraft(current.sceneData, draft),
      };
    }, CART_SCENE_ID);
  }, []);

  const saveTransferAttempt = useCallback((input: CartTransferInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      const attempt = buildCartTransferAttempt(input);
      const nextAttempts = [...current.transferAttempts, attempt];
      const nextTarget = attempt.accepted
        ? activeCartTransferTargetId(nextAttempts)
        : input.targetId;
      const nextDraft = attempt.accepted
        ? emptyCartTransferDraft(nextTarget)
        : {
            ...emptyCartTransferDraft(input.targetId),
            judgments: input.judgments,
            surfaceCueSelected: input.surfaceCueSelected,
            studentExplanation: input.studentExplanation,
          };
      const next = {
        ...current,
        transferAttempts: nextAttempts,
        sceneData: withCartTransferDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("transfer_attempted", current.stage, {
            targetId: attempt.targetId,
            accepted: attempt.accepted,
            failureKinds: attempt.failureKinds,
            transferMode: attempt.transferMode,
          }),
        ],
      };
      return attempt.accepted ? advanceWithinPhase3(next) : next;
    }, CART_SCENE_ID);
  }, []);

  const saveExamDraft = useCallback((draft: CartExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return {
        ...current,
        sceneData: withCartExamDraft(current.sceneData, draft),
      };
    }, CART_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback((input: CartExamInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      const attempt = buildCartExamAttempt(input);
      const nextAttempts = [...current.examAttempts, attempt];
      const nextDraft = nextCartExamDraft(
        nextAttempts,
        cartExamDraft(current),
        input.patternId,
      );
      const next = {
        ...current,
        examAttempts: nextAttempts,
        sceneData: withCartExamDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("exam_answered", current.stage, {
            patternId: attempt.patternId,
            correct: attempt.correct,
          }),
        ],
      };
      return advanceWithinPhase3(next);
    }, CART_SCENE_ID);
  }, []);

  const skipExamRetry = useCallback((draft: CartExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return {
        ...current,
        sceneData: withCartExamDraft(current.sceneData, draft),
      };
    }, CART_SCENE_ID);
  }, []);

  const saveAiOffDraft = useCallback((draft: CartAiOffDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return {
        ...current,
        sceneData: withCartAiOffDraft(current.sceneData, draft),
      };
    }, CART_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback(
    (input: CartAiOffIndependentInput) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        const llmUsed = cartTutorUsedDuringIndependent(current);
        const attempt = buildCartAiOffAttempt(input, [], llmUsed);
        const attempts = [
          ...(current.independentAssessment?.challengeAttempts ?? []),
          attempt,
        ];
        const assessment = buildCartAiOffAssessment(attempts, llmUsed);
        const previous = cartAiOffDraft(current);
        return {
          ...current,
          independentAssessment: assessment,
          sceneData: withCartAiOffDraft(current.sceneData, {
            ...previous,
            currentChallengeId: input.challengeId,
            step: "post-check",
            selectedAnswer: input.selectedAnswer,
            reasoning: input.studentReasoning,
            postCheckSelections: [],
          }),
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "cart-ai-off-commit",
              challengeId: attempt.challengeId,
            }),
          ],
        };
      }, CART_SCENE_ID);
    },
    [],
  );

  const saveAiOffPostCheck = useCallback((input: CartAiOffPostCheckInput) => {
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
      const llmUsed = cartTutorUsedDuringIndependent(current);
      attempts[actualIndex] = applyCartAiOffPostCheck(
        original,
        input.postCheckIds,
        llmUsed,
      );
      const assessment = buildCartAiOffAssessment(attempts, llmUsed);
      const previous = cartAiOffDraft(current);
      const nextDraft = nextCartAiOffDraft(assessment, previous, input.challengeId);
      const next = {
        ...current,
        independentAssessment: assessment,
        sceneData: withCartAiOffDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "cart-ai-off-post-check",
            challengeId: input.challengeId,
            accepted: attempts[actualIndex]?.accepted,
          }),
        ],
      };
      return advanceWithinPhase3(next);
    }, CART_SCENE_ID);
  }, []);

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
      const hint = nextCartHint(current.events, current.stage);
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
    }, CART_SCENE_ID);
  }, []);

  const startOver = useCallback(() => {
    resetStoredSession(CART_SCENE_ID);
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
    skipExamRetry,
    saveAiOffDraft,
    saveAiOffIndependentResponse,
    saveAiOffPostCheck,
    revealHint,
    startOver,
    canGoBack,
  };
}

function advanceWithinPhase3(session: LearningSession): LearningSession {
  const target = nextStage(session.stage);
  if (!target || !(CART_PHASE3_STAGES as readonly LearningStage[]).includes(target)) {
    return session;
  }
  return advanceIfReady(session);
}

function patchIncompleteEvidence(
  session: LearningSession,
  experimentId: CartExperimentId,
  updater: (evidence: ExperimentEvidence) => ExperimentEvidence,
): LearningSession {
  const index = [...session.experimentEvidence]
    .map((item, itemIndex) => ({ item, itemIndex }))
    .reverse()
    .find(
      ({ item }) =>
        item.experimentId === experimentId && item.sufficient !== true,
    )?.itemIndex;
  if (index == null) {
    return session;
  }
  const nextEvidence = session.experimentEvidence.map((item, itemIndex) =>
    itemIndex === index ? updater(item) : item,
  );
  return { ...session, experimentEvidence: nextEvidence };
}
