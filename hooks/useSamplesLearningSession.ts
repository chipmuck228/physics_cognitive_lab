"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { SAMPLES_PHASE_STAGES } from "@/lib/content/equal-volume-material-samples";
import { advanceIfReady } from "@/lib/learning/advance";
import {
  applySamplesAiOffPostCheck,
  buildSamplesAiOffAssessment,
  buildSamplesAiOffAttempt,
  hasCompletedSamplesAiOff,
  nextSamplesAiOffDraft,
  samplesTutorUsedDuringIndependent,
  type SamplesAiOffDraft,
  type SamplesAiOffIndependentInput,
  type SamplesAiOffPostCheckInput,
} from "@/lib/learning/samples-ai-off";
import {
  evaluateSamplesDescription,
  type SamplesDescribeInput,
} from "@/lib/learning/samples-describe";
import {
  activeIncompleteSamplesEvidence,
  authoredBeforeIntervention,
  canRunSamplesExperiment,
  emptySamplesObservedResult,
  hasClosedSamplesExperiment,
  isSamplesComparison,
  isSamplesExperimentClosed,
  runSceneSamplesExperiment,
  samplesComparisonLabel,
} from "@/lib/learning/samples-experiment";
import {
  evaluateSamplesObservation,
  samplesObservationLabelsFor,
} from "@/lib/learning/samples-observe";
import {
  evaluateSamplesPrediction,
  firstCommittedSamplesPrediction,
} from "@/lib/learning/samples-predict";
import {
  samplesAiOffDraft,
  samplesExamDraft,
  withSamplesAiOffDraft,
  withSamplesDescribeDraft,
  withSamplesExamDraft,
  withSamplesExplainDraft,
  withSamplesModelDraft,
  withSamplesTransferDraft,
  withSamplesWatchedDemo,
} from "@/lib/learning/samples-scene-data";
import {
  evaluateSamplesExplanation,
  type SamplesExplainInput,
} from "@/lib/learning/samples-explain";
import {
  buildSamplesExamAttempt,
  hasCompletedSamplesExam,
  nextSamplesExamDraft,
  type SamplesExamDraft,
  type SamplesExamInput,
} from "@/lib/learning/samples-exam";
import {
  buildSamplesModelAttempt,
  type SamplesModelDraft,
} from "@/lib/learning/samples-model";
import {
  activeSamplesTransferTargetId,
  buildSamplesTransferAttempt,
  emptySamplesTransferDraft,
  type SamplesTransferInput,
} from "@/lib/learning/samples-transfer";
import { nextSamplesHint } from "@/lib/learning/samples-hint-ladder";
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
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  samplesPhysicsSnapshot,
  type SamplesExperimentId,
} from "@/lib/physics/equal-volume-material-samples";
import { wrapSamplesPhysicsState } from "@/lib/runtime/physics-state";
import {
  LearningStage,
  SAMPLES_SCENE_ID,
  type DescriptionEvidence,
  type ExperimentEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
  type PredictionEvidence,
} from "@/types/learning";

type SamplesObservedResultInput = {
  massComparison: string;
  volumeComparison: string;
  densityComparison: string;
  massChange: string;
  volumeChange: string;
  densityChange: string;
  togetherChange: string;
};

export function useSamplesLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot(SAMPLES_SCENE_ID),
    getServerSessionSnapshot,
  );

  const startLesson = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.ENTRY) {
        return current;
      }
      return advanceWithinLoop(current);
    }, SAMPLES_SCENE_ID);
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
      updateSession((current) => advanceIfReady(current), SAMPLES_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.EXAM &&
      hasCompletedSamplesExam(session.examAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.AI_OFF,
      )
    ) {
      updateSession((current) => advanceIfReady(current), SAMPLES_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.AI_OFF &&
      hasCompletedSamplesAiOff(session) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.COMPLETE,
      )
    ) {
      updateSession((current) => advanceIfReady(current), SAMPLES_SCENE_ID);
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
    }, SAMPLES_SCENE_ID);
  }, []);

  const markDemoWatched = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      return {
        ...current,
        sceneData: withSamplesWatchedDemo(current.sceneData, true),
      };
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveObservation = useCallback((selectedOptionIds: string[]) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      const evaluation = evaluateSamplesObservation(selectedOptionIds);
      const observation: ObservationEvidence = {
        text: samplesObservationLabelsFor(selectedOptionIds),
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
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveDescription = useCallback((input: SamplesDescribeInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
        return current;
      }
      const evaluation = evaluateSamplesDescription(input);
      const description: DescriptionEvidence = {
        text: input.studentDescription.trim(),
        object: input.object,
        quantity: input.sizeRelation,
        change: input.massRelation,
        sufficient: evaluation.sufficient,
        timestamp: new Date().toISOString(),
      };
      const next = {
        ...current,
        sceneData: withSamplesDescribeDraft(current.sceneData, input),
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
    }, SAMPLES_SCENE_ID);
  }, []);

  const commitPrediction = useCallback(
    (experimentId: SamplesExperimentId, outcome: string, reason: string) => {
      updateSession((current) => {
        const allowedStage =
          current.stage === LearningStage.PREDICT ||
          current.stage === LearningStage.EXPERIMENT;
        if (!allowedStage) {
          return current;
        }
        if (
          experimentId === SAMPLES_EXPERIMENT_B &&
          (current.stage !== LearningStage.EXPERIMENT ||
            !hasClosedSamplesExperiment(current, SAMPLES_EXPERIMENT_A))
        ) {
          return current;
        }
        if (
          experimentId !== SAMPLES_EXPERIMENT_A &&
          current.stage !== LearningStage.EXPERIMENT
        ) {
          return current;
        }
        if (firstCommittedSamplesPrediction(current.predictions, experimentId)) {
          return current;
        }

        const evaluation = evaluateSamplesPrediction(outcome, reason);
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

        return experimentId === SAMPLES_EXPERIMENT_A
          ? advanceWithinLoop(next)
          : next;
      }, SAMPLES_SCENE_ID);
    },
    [],
  );

  const runExperiment = useCallback((experimentId: SamplesExperimentId) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPERIMENT) {
        return current;
      }
      if (!canRunSamplesExperiment(current, experimentId)) {
        return current;
      }
      const incomplete = activeIncompleteSamplesEvidence(current, experimentId);
      if (incomplete || hasClosedSamplesExperiment(current, experimentId)) {
        return current;
      }
      const prediction = firstCommittedSamplesPrediction(
        current.predictions,
        experimentId,
      );
      if (!prediction) {
        return current;
      }

      const physics = runSceneSamplesExperiment(experimentId);
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
        observedResult: emptySamplesObservedResult(),
        comparison: "",
        physicsResult: samplesPhysicsSnapshot(physics.after),
        authoredBeforeIntervention: authoredBeforeIntervention(
          prediction.timestamp,
          interventionAt,
        ),
        sufficient: false,
      };

      return {
        ...current,
        physicsState: wrapSamplesPhysicsState(physics.after),
        experimentEvidence: [...current.experimentEvidence, evidence],
        events: [
          ...current.events,
          createLearningEvent("experiment_run", current.stage, {
            experimentId,
            comparisonMode: physics.after.comparisonMode,
            cutFactor: physics.after.cutFactor,
          }),
        ],
      };
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveObservedResult = useCallback(
    (experimentId: SamplesExperimentId, observed: SamplesObservedResultInput) => {
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            observedResult: observed,
          })),
        SAMPLES_SCENE_ID,
      );
    },
    [],
  );

  const saveComparison = useCallback(
    (
      experimentId: SamplesExperimentId,
      comparison: "same" | "different" | "partial",
    ) => {
      if (!isSamplesComparison(comparison)) {
        return;
      }
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            comparison,
            predictionComparison: samplesComparisonLabel(comparison),
          })),
        SAMPLES_SCENE_ID,
      );
    },
    [],
  );

  const saveReflection = useCallback(
    (experimentId: SamplesExperimentId, reflection: string) => {
      updateSession((current) => {
        const next = patchIncompleteEvidence(current, experimentId, (evidence) => {
          const updated = {
            ...evidence,
            reflection: reflection.trim(),
          };
          return {
            ...updated,
            sufficient: isSamplesExperimentClosed({
              ...updated,
              sufficient: false,
            }),
          };
        });
        return advanceWithinLoop(next);
      }, SAMPLES_SCENE_ID);
    },
    [],
  );

  const saveExplanation = useCallback((input: SamplesExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      const evaluation = evaluateSamplesExplanation(input);
      const explanation: ExplanationEvidence = {
        text: input.studentExplanation.trim(),
        timestamp: new Date().toISOString(),
        distinguishesDensityFromMassOrSize:
          evaluation.distinguishesDensityFromMassOrSize,
        usesMassVolumeRatio: evaluation.usesMassVolumeRatio,
        checksUniformCutCondition: evaluation.checksUniformCutCondition,
        densityAnswers: {
          densityVsMass: input.densityVsMass,
          sameVolume: input.sameVolume,
          sameMass: input.sameMass,
          uniformCut: input.uniformCut,
        },
        sufficient: evaluation.sufficient,
      };
      const next = {
        ...current,
        sceneData: withSamplesExplainDraft(current.sceneData, input),
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
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveExplainDraft = useCallback((input: SamplesExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      return {
        ...current,
        sceneData: withSamplesExplainDraft(current.sceneData, input),
      };
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveModelDraft = useCallback((draft: SamplesModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      return {
        ...current,
        sceneData: withSamplesModelDraft(current.sceneData, draft),
      };
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveModelAttempt = useCallback((draft: SamplesModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      const attempt = buildSamplesModelAttempt({
        numerator: draft.numerator,
        denominator: draft.denominator,
        result: draft.result,
        sameVolumeConclusion: draft.sameVolumeConclusion,
        sameMassConclusion: draft.sameMassConclusion,
        cutConclusion: draft.cutConclusion,
        cutMassChange: draft.cutMassChange,
        cutVolumeChange: draft.cutVolumeChange,
        cutRatioChange: draft.cutRatioChange,
        cutWhy: draft.cutWhy,
        sufficiency: draft.sufficiency,
        conditions: draft.conditions,
        timestamp: new Date().toISOString(),
      });
      const next = {
        ...current,
        sceneData: withSamplesModelDraft(current.sceneData, draft),
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
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveTransferDraft = useCallback(
    (draft: ReturnType<typeof emptySamplesTransferDraft>) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.TRANSFER) {
          return current;
        }
        return {
          ...current,
          sceneData: withSamplesTransferDraft(current.sceneData, draft),
        };
      }, SAMPLES_SCENE_ID);
    },
    [],
  );

  const saveTransferAttempt = useCallback((input: SamplesTransferInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      const attempt = buildSamplesTransferAttempt(input);
      const nextAttempts = [...current.transferAttempts, attempt];
      const nextTarget = attempt.accepted
        ? activeSamplesTransferTargetId(nextAttempts)
        : input.targetId;
      const nextDraft = attempt.accepted
        ? emptySamplesTransferDraft(nextTarget)
        : {
            ...emptySamplesTransferDraft(input.targetId),
            judgments: input.judgments,
            surfaceCueSelected: input.surfaceCueSelected,
            studentExplanation: input.studentExplanation,
          };
      const next = {
        ...current,
        transferAttempts: nextAttempts,
        sceneData: withSamplesTransferDraft(current.sceneData, nextDraft),
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
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveExamDraft = useCallback((draft: SamplesExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return {
        ...current,
        sceneData: withSamplesExamDraft(current.sceneData, draft),
      };
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback((input: SamplesExamInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      const attempt = buildSamplesExamAttempt(input);
      const nextAttempts = [...current.examAttempts, attempt];
      const nextDraft = nextSamplesExamDraft(
        nextAttempts,
        samplesExamDraft(current),
        input.patternId,
      );
      const next = {
        ...current,
        examAttempts: nextAttempts,
        sceneData: withSamplesExamDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("exam_answered", current.stage, {
            patternId: attempt.patternId,
            correct: attempt.correct,
          }),
        ],
      };
      return advanceWithinLoop(next);
    }, SAMPLES_SCENE_ID);
  }, []);

  const skipExamRetry = useCallback((draft: SamplesExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return {
        ...current,
        sceneData: withSamplesExamDraft(current.sceneData, draft),
      };
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveAiOffDraft = useCallback((draft: SamplesAiOffDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return {
        ...current,
        sceneData: withSamplesAiOffDraft(current.sceneData, draft),
      };
    }, SAMPLES_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback(
    (input: SamplesAiOffIndependentInput) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        const llmUsed = samplesTutorUsedDuringIndependent(current);
        const attempt = buildSamplesAiOffAttempt(input, [], llmUsed);
        const attempts = [
          ...(current.independentAssessment?.challengeAttempts ?? []),
          attempt,
        ];
        const assessment = buildSamplesAiOffAssessment(attempts, llmUsed);
        const previous = samplesAiOffDraft(current);
        return {
          ...current,
          independentAssessment: assessment,
          sceneData: withSamplesAiOffDraft(current.sceneData, {
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
              kind: "samples-ai-off-commit",
              challengeId: attempt.challengeId,
            }),
          ],
        };
      }, SAMPLES_SCENE_ID);
    },
    [],
  );

  const saveAiOffPostCheck = useCallback((input: SamplesAiOffPostCheckInput) => {
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
      const llmUsed = samplesTutorUsedDuringIndependent(current);
      attempts[actualIndex] = applySamplesAiOffPostCheck(
        original,
        input.postCheckIds,
        llmUsed,
      );
      const assessment = buildSamplesAiOffAssessment(attempts, llmUsed);
      const previous = samplesAiOffDraft(current);
      const nextDraft = nextSamplesAiOffDraft(
        assessment,
        previous,
        input.challengeId,
      );
      const next = {
        ...current,
        independentAssessment: assessment,
        sceneData: withSamplesAiOffDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "samples-ai-off-post-check",
            challengeId: input.challengeId,
            accepted: attempts[actualIndex]?.accepted,
          }),
        ],
      };
      return advanceWithinLoop(next);
    }, SAMPLES_SCENE_ID);
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
      const hint = nextSamplesHint(current.events, current.stage);
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
    }, SAMPLES_SCENE_ID);
  }, []);

  const startOver = useCallback(() => {
    resetStoredSession(SAMPLES_SCENE_ID);
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
  if (!target || !(SAMPLES_PHASE_STAGES as readonly LearningStage[]).includes(target)) {
    return session;
  }
  return advanceIfReady(session);
}

function patchIncompleteEvidence(
  session: LearningSession,
  experimentId: SamplesExperimentId,
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
