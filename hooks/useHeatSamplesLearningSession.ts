"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { HEAT_PHASE_STAGES } from "@/lib/content/equal-mass-heated-samples";
import { advanceIfReady } from "@/lib/learning/advance";
import {
  applyHeatAiOffPostCheck,
  buildHeatAiOffAssessment,
  buildHeatAiOffAttempt,
  hasCompletedHeatAiOff,
  nextHeatAiOffDraft,
  heatTutorUsedDuringIndependent,
  type HeatAiOffDraft,
  type HeatAiOffIndependentInput,
} from "@/lib/learning/heat-ai-off";
import {
  evaluateHeatDescription,
  type HeatDescribeInput,
} from "@/lib/learning/heat-describe";
import {
  activeIncompleteHeatEvidence,
  authoredBeforeIntervention,
  canRunHeatExperiment,
  emptyHeatObservedResult,
  hasClosedHeatExperiment,
  isHeatComparison,
  isHeatExperimentClosed,
  runSceneHeatExperiment,
  heatComparisonLabel,
  type HeatObservedResult,
} from "@/lib/learning/heat-experiment";
import {
  evaluateHeatObservation,
  heatObservationLabelsFor,
} from "@/lib/learning/heat-observe";
import {
  evaluateHeatPrediction,
  firstCommittedHeatPrediction,
} from "@/lib/learning/heat-predict";
import {
  heatAiOffDraft,
  heatExamDraft,
  withHeatAiOffDraft,
  withHeatDescribeDraft,
  withHeatExamDraft,
  withHeatExplainDraft,
  withHeatModelDraft,
  withHeatTransferDraft,
  withHeatWatchedDemo,
} from "@/lib/learning/heat-scene-data";
import {
  evaluateHeatExplanation,
  type HeatExplainInput,
} from "@/lib/learning/heat-explain";
import {
  buildHeatExamAttempt,
  hasCompletedHeatExam,
  nextHeatExamDraft,
  type HeatExamDraft,
  type HeatExamInput,
} from "@/lib/learning/heat-exam";
import {
  buildHeatModelAttempt,
  type HeatModelDraft,
} from "@/lib/learning/heat-model";
import {
  activeHeatTransferTargetId,
  buildHeatTransferAttempt,
  conditionChecksRecordFromIds,
  emptyHeatTransferDraft,
  type HeatTransferInput,
} from "@/lib/learning/heat-transfer";
import { nextHeatHint } from "@/lib/learning/heat-hint-ladder";
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
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
  heatPhysicsSnapshot,
  type HeatExperimentId,
} from "@/lib/physics/equal-mass-heated-samples";
import { wrapHeatSamplesPhysicsState } from "@/lib/runtime/physics-state";
import {
  LearningStage,
  HEAT_SAMPLES_SCENE_ID,
  type DescriptionEvidence,
  type ExperimentEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
  type PredictionEvidence,
} from "@/types/learning";

export function useHeatSamplesLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot(HEAT_SAMPLES_SCENE_ID),
    getServerSessionSnapshot,
  );

  const startLesson = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.ENTRY) {
        return current;
      }
      return advanceWithinLoop(current);
    }, HEAT_SAMPLES_SCENE_ID);
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
      updateSession((current) => advanceIfReady(current), HEAT_SAMPLES_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.EXAM &&
      hasCompletedHeatExam(session.examAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.AI_OFF,
      )
    ) {
      updateSession((current) => advanceIfReady(current), HEAT_SAMPLES_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.AI_OFF &&
      hasCompletedHeatAiOff(session) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.COMPLETE,
      )
    ) {
      updateSession((current) => advanceIfReady(current), HEAT_SAMPLES_SCENE_ID);
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
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const markDemoWatched = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      return {
        ...current,
        sceneData: withHeatWatchedDemo(current.sceneData, true),
      };
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveObservation = useCallback((selectedOptionIds: string[]) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      const evaluation = evaluateHeatObservation(selectedOptionIds);
      const observation: ObservationEvidence = {
        text: heatObservationLabelsFor(selectedOptionIds),
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
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveDescription = useCallback((input: HeatDescribeInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
        return current;
      }
      const evaluation = evaluateHeatDescription(input);
      const description: DescriptionEvidence = {
        text: input.studentDescription.trim(),
        object: input.object,
        quantity: input.massRelation,
        change: input.temperatureRelation,
        sufficient: evaluation.sufficient,
        timestamp: new Date().toISOString(),
      };
      const next = {
        ...current,
        sceneData: withHeatDescribeDraft(current.sceneData, input),
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
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const commitPrediction = useCallback(
    (experimentId: HeatExperimentId, outcome: string, reason: string) => {
      updateSession((current) => {
        const allowedStage =
          current.stage === LearningStage.PREDICT ||
          current.stage === LearningStage.EXPERIMENT;
        if (!allowedStage) {
          return current;
        }
        if (
          experimentId === HEAT_EXPERIMENT_B &&
          (current.stage !== LearningStage.EXPERIMENT ||
            !hasClosedHeatExperiment(current, HEAT_EXPERIMENT_A))
        ) {
          return current;
        }
        if (
          experimentId === HEAT_EXPERIMENT_C &&
          (current.stage !== LearningStage.EXPERIMENT ||
            !hasClosedHeatExperiment(current, HEAT_EXPERIMENT_B))
        ) {
          return current;
        }
        if (
          experimentId !== HEAT_EXPERIMENT_A &&
          current.stage !== LearningStage.EXPERIMENT
        ) {
          return current;
        }
        if (firstCommittedHeatPrediction(current.predictions, experimentId)) {
          return current;
        }

        const evaluation = evaluateHeatPrediction(outcome, reason);
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

        return experimentId === HEAT_EXPERIMENT_A
          ? advanceWithinLoop(next)
          : next;
      }, HEAT_SAMPLES_SCENE_ID);
    },
    [],
  );

  const runExperiment = useCallback((experimentId: HeatExperimentId) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPERIMENT) {
        return current;
      }
      if (!canRunHeatExperiment(current, experimentId)) {
        return current;
      }
      const incomplete = activeIncompleteHeatEvidence(current, experimentId);
      if (incomplete || hasClosedHeatExperiment(current, experimentId)) {
        return current;
      }
      const prediction = firstCommittedHeatPrediction(
        current.predictions,
        experimentId,
      );
      if (!prediction) {
        return current;
      }

      const physics = runSceneHeatExperiment(experimentId);
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
        observedResult: emptyHeatObservedResult(),
        comparison: "",
        physicsResult: heatPhysicsSnapshot(physics.after),
        authoredBeforeIntervention: authoredBeforeIntervention(
          prediction.timestamp,
          interventionAt,
        ),
        sufficient: false,
      };

      return {
        ...current,
        physicsState: wrapHeatSamplesPhysicsState(physics.after),
        experimentEvidence: [...current.experimentEvidence, evidence],
        events: [
          ...current.events,
          createLearningEvent("experiment_run", current.stage, {
            experimentId,
            comparisonMode: physics.after.comparisonMode,
            heatingEnergy: physics.after.heatingEnergy,
          }),
        ],
      };
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveObservedResult = useCallback(
    (experimentId: HeatExperimentId, observed: HeatObservedResult) => {
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            observedResult: observed,
          })),
        HEAT_SAMPLES_SCENE_ID,
      );
    },
    [],
  );

  const saveComparison = useCallback(
    (
      experimentId: HeatExperimentId,
      comparison: "same" | "different" | "partial",
    ) => {
      if (!isHeatComparison(comparison)) {
        return;
      }
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            comparison,
            predictionComparison: heatComparisonLabel(comparison),
          })),
        HEAT_SAMPLES_SCENE_ID,
      );
    },
    [],
  );

  const saveReflection = useCallback(
    (experimentId: HeatExperimentId, reflection: string) => {
      updateSession((current) => {
        const next = patchIncompleteEvidence(current, experimentId, (evidence) => {
          const updated = {
            ...evidence,
            reflection: reflection.trim(),
          };
          return {
            ...updated,
            sufficient: isHeatExperimentClosed({
              ...updated,
              sufficient: false,
            }),
          };
        });
        return advanceWithinLoop(next);
      }, HEAT_SAMPLES_SCENE_ID);
    },
    [],
  );

  const saveExplanation = useCallback((input: HeatExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      const evaluation = evaluateHeatExplanation(input);
      const explanation: ExplanationEvidence = {
        text: input.studentExplanation.trim(),
        timestamp: new Date().toISOString(),
        distinguishesHeatFromTemperature: evaluation.distinguishesHeatFromTemperature,
        usesHeatMassTempRelation: evaluation.usesHeatMassTempRelation,
        checksNoPhaseChangeOrTimeNotQ: evaluation.checksNoPhaseChangeOrTimeNotQ,
        heatAnswers: {
          heatVsTemperature: input.heatVsTemperature,
          sameMassSameQ: input.sameMassSameQ,
          sameCSameQ: input.sameCSameQ,
          timeAndPhase: input.timeAndPhase,
        },
        sufficient: evaluation.sufficient,
      };
      const next = {
        ...current,
        sceneData: withHeatExplainDraft(current.sceneData, input),
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
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveExplainDraft = useCallback((input: HeatExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      return {
        ...current,
        sceneData: withHeatExplainDraft(current.sceneData, input),
      };
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveModelDraft = useCallback((draft: HeatModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      return {
        ...current,
        sceneData: withHeatModelDraft(current.sceneData, draft),
      };
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveModelAttempt = useCallback((draft: HeatModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      const attempt = buildHeatModelAttempt({
        factorC: draft.factorC,
        factorM: draft.factorM,
        factorDeltaT: draft.factorDeltaT,
        productQ: draft.productQ,
        sameMassSameDeltaT: draft.sameMassSameDeltaT,
        sameMassSameQ: draft.sameMassSameQ,
        sameCSameQ: draft.sameCSameQ,
        sufficiency: draft.sufficiency,
        conditions: draft.conditions,
        timestamp: new Date().toISOString(),
      });
      const next = {
        ...current,
        sceneData: withHeatModelDraft(current.sceneData, draft),
        modelAttempts: [...current.modelAttempts, attempt],
        events: [
          ...current.events,
          createLearningEvent("model_submitted", current.stage, {
            correctStructure: attempt.correctStructure,
            failureKinds: attempt.failureKinds,
          }),
        ],
      };
      return attempt.correctStructure ? advanceWithinLoop(next) : next;
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveTransferDraft = useCallback(
    (draft: ReturnType<typeof emptyHeatTransferDraft>) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.TRANSFER) {
          return current;
        }
        return {
          ...current,
          sceneData: withHeatTransferDraft(current.sceneData, draft),
        };
      }, HEAT_SAMPLES_SCENE_ID);
    },
    [],
  );

  const saveTransferAttempt = useCallback((input: HeatTransferInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      const attempt = buildHeatTransferAttempt(input);
      const nextAttempts = [...current.transferAttempts, attempt];
      const nextTarget = attempt.accepted
        ? activeHeatTransferTargetId(nextAttempts)
        : input.targetId;
      const nextDraft = attempt.accepted
        ? emptyHeatTransferDraft(nextTarget)
        : {
            ...emptyHeatTransferDraft(input.targetId),
            judgments: input.judgments,
            surfaceCueSelected: input.surfaceCueSelected,
            studentExplanation: input.studentExplanation,
            conditionChecks: conditionChecksRecordFromIds(input.conditionChecks ?? []),
          };
      const next = {
        ...current,
        transferAttempts: nextAttempts,
        sceneData: withHeatTransferDraft(current.sceneData, nextDraft),
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
      return attempt.accepted ? advanceWithinLoop(next) : next;
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveExamDraft = useCallback((draft: HeatExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return {
        ...current,
        sceneData: withHeatExamDraft(current.sceneData, draft),
      };
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback((input: HeatExamInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      const attempt = buildHeatExamAttempt(input);
      const nextAttempts = [...current.examAttempts, attempt];
      const nextDraft = nextHeatExamDraft(
        nextAttempts,
        heatExamDraft(current),
        input.patternId,
      );
      const next = {
        ...current,
        examAttempts: nextAttempts,
        sceneData: withHeatExamDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("exam_answered", current.stage, {
            patternId: attempt.patternId,
            correct: attempt.correct,
          }),
        ],
      };
      return advanceWithinLoop(next);
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const skipExamRetry = useCallback((draft: HeatExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return {
        ...current,
        sceneData: withHeatExamDraft(current.sceneData, draft),
      };
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveAiOffDraft = useCallback((draft: HeatAiOffDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return {
        ...current,
        sceneData: withHeatAiOffDraft(current.sceneData, draft),
      };
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback(
    (input: HeatAiOffIndependentInput) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        const llmUsed = heatTutorUsedDuringIndependent(current);
        const attempt = buildHeatAiOffAttempt(input, [], llmUsed);
        const attempts = [
          ...(current.independentAssessment?.challengeAttempts ?? []),
          attempt,
        ];
        const assessment = buildHeatAiOffAssessment(attempts, llmUsed);
        const previous = heatAiOffDraft(current);
        return {
          ...current,
          independentAssessment: assessment,
          sceneData: withHeatAiOffDraft(current.sceneData, {
            ...previous,
            currentChallengeId: input.challengeId,
            step: "post-check",
            selectedAnswer: input.selectedAnswer,
            reasoning: input.studentReasoning,
            preCommitEvidenceIds: [...(input.preCommitEvidenceIds ?? [])],
            postCheckSelections: [],
          }),
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "heat-ai-off-commit",
              challengeId: attempt.challengeId,
            }),
          ],
        };
      }, HEAT_SAMPLES_SCENE_ID);
    },
    [],
  );

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
        const llmUsed = heatTutorUsedDuringIndependent(current);
        attempts[actualIndex] = applyHeatAiOffPostCheck(
          original,
          input.postCheckIds,
          llmUsed,
        );
        const assessment = buildHeatAiOffAssessment(attempts, llmUsed);
        const previous = heatAiOffDraft(current);
        const nextDraft = nextHeatAiOffDraft(
          assessment,
          previous,
          input.challengeId,
        );
        const next = {
          ...current,
          independentAssessment: assessment,
          sceneData: withHeatAiOffDraft(current.sceneData, nextDraft),
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "heat-ai-off-post-check",
              challengeId: input.challengeId,
              accepted: attempts[actualIndex]?.accepted,
            }),
          ],
        };
        return advanceWithinLoop(next);
      }, HEAT_SAMPLES_SCENE_ID);
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
      const hint = nextHeatHint(current.events, current.stage);
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
    }, HEAT_SAMPLES_SCENE_ID);
  }, []);

  const startOver = useCallback(() => {
    resetStoredSession(HEAT_SAMPLES_SCENE_ID);
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

function advanceWithinLoop(session: LearningSession): LearningSession {
  const target = nextStage(session.stage);
  if (!target || !(HEAT_PHASE_STAGES as readonly LearningStage[]).includes(target)) {
    return session;
  }
  return advanceIfReady(session);
}

function patchIncompleteEvidence(
  session: LearningSession,
  experimentId: HeatExperimentId,
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
