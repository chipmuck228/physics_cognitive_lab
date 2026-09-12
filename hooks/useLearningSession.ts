"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { MICROWAVE_EXPERIMENT_ID } from "@/lib/content/microwave-bread";
import { advanceIfReady } from "@/lib/learning/advance";
import { createLearningEvent } from "@/lib/learning/events";
import {
  applyMicrowaveAiOffPostCheck,
  buildMicrowaveAiOffAssessment,
  buildMicrowaveAiOffAttempt,
  currentMicrowaveAiOffChallengeId,
  hasCompletedMicrowaveAiOff,
  nextMicrowaveAiOffDraft,
  retryMicrowaveAiOffDraft,
  type MicrowaveAiOffDraft,
  type MicrowaveAiOffIndependentInput,
} from "@/lib/learning/microwave-ai-off";
import {
  evaluateMicrowaveDescription,
  type MicrowaveDescribeInput,
} from "@/lib/learning/microwave-describe";
import {
  authoredBeforeIntervention,
  canRunMicrowaveExperiment,
  isMicrowaveComparison,
  isMicrowaveExperimentClosed,
  type MicrowaveComparison,
} from "@/lib/learning/microwave-experiment";
import { evaluateMicrowaveObservation } from "@/lib/learning/microwave-observe";
import {
  evaluateMicrowavePrediction,
  firstCommittedMicrowavePrediction,
} from "@/lib/learning/microwave-predict";
import {
  evaluateMicrowaveExplanation,
  type MicrowaveExplainInput,
} from "@/lib/learning/microwave-explain";
import {
  buildMicrowaveExamAttempt,
  hasCompletedMicrowaveExam,
  nextMicrowaveExamDraft,
  type MicrowaveExamDraft,
  type MicrowaveExamInput,
} from "@/lib/learning/microwave-exam";
import {
  buildMicrowaveModelAttempt,
  type MicrowaveModelDraft,
} from "@/lib/learning/microwave-model";
import {
  activeMicrowaveTransferTargetId,
  buildMicrowaveTransferAttempt,
  conditionCheckIdsFromRecord,
  emptyMicrowaveTransferDraft,
  type MicrowaveTransferInput,
} from "@/lib/learning/microwave-transfer";
import {
  getMicrowaveExperimentHistory,
  microwaveAiOffDraft,
  microwaveExamDraft,
  microwaveExplainDraft,
  microwaveModelDraft,
  microwaveTransferDraft,
  withMicrowaveAiOffDraft,
  withMicrowaveDescribeDraft,
  withMicrowaveExamDraft,
  withMicrowaveExperimentHistory,
  withMicrowaveExplainDraft,
  withMicrowaveModelDraft,
  withMicrowaveTransferDraft,
} from "@/lib/learning/microwave-scene-data";
import { canLeaveStage } from "@/lib/learning/progression";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  resetStoredSession,
  subscribeSession,
  updateSession,
} from "@/lib/learning/session-store";
import { nextStage, previousStage } from "@/lib/learning/state-machine";
import {
  applyHeatingResult,
  resetBreadTemperature,
  simulateHeating,
  toExperimentInput,
  updateMicrowavePhysicsState,
} from "@/lib/physics/microwave";
import {
  getMicrowavePhysicsState,
  wrapMicrowavePhysicsState,
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
import type { MicrowaveExperimentResult } from "@/types/physics";

export function useLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot("microwave-bread"),
    getServerSessionSnapshot,
  );

  const goToStage = useCallback((stage: LearningStage) => {
    updateSession((current) => {
      if (!canLeaveStage(current, stage)) {
        return current;
      }
      return {
        ...current,
        stage,
        events: [...current.events, createLearningEvent("stage_entered", stage)],
      };
    });
  }, []);

  const startLesson = useCallback(() => {
    goToStage(LearningStage.OBSERVE);
  }, [goToStage]);

  useEffect(() => {
    if (!session) {
      return;
    }
    if (
      session.stage === LearningStage.EXAM &&
      hasCompletedMicrowaveExam(session.examAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.AI_OFF,
      )
    ) {
      updateSession((current) => advanceIfReady(current));
      return;
    }
    if (
      session.stage === LearningStage.AI_OFF &&
      hasCompletedMicrowaveAiOff(session) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.COMPLETE,
      )
    ) {
      updateSession((current) => {
        const next = advanceIfReady(current);
        if (next.stage !== LearningStage.COMPLETE) {
          return next;
        }
        return {
          ...next,
          completed: true,
          events: [
            ...next.events,
            createLearningEvent("session_completed", LearningStage.COMPLETE),
          ],
        };
      });
    }
  }, [session]);

  const saveObservation = useCallback(
    (input: { selectedOptionIds: string[]; studentObservation: string }) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.OBSERVE) {
          return current;
        }
        const evaluation = evaluateMicrowaveObservation(input);
        const observation: ObservationEvidence = {
          text: input.studentObservation.trim(),
          selectedOptionIds: input.selectedOptionIds,
          sufficient: evaluation.sufficient,
          timestamp: new Date().toISOString(),
        };
        return advanceIfReady({
          ...current,
          observations: [...current.observations, observation],
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "observation",
            }),
          ],
        });
      });
    },
    [],
  );

  const saveDescription = useCallback((input: MicrowaveDescribeInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
        return current;
      }
      const evaluation = evaluateMicrowaveDescription(input);
      const description: DescriptionEvidence = {
        text: input.studentDescription.trim(),
        object: input.object,
        quantity: input.quantity,
        change: input.change,
        sufficient: evaluation.sufficient,
        timestamp: new Date().toISOString(),
      };
      return advanceIfReady({
        ...current,
        descriptions: [...current.descriptions, description],
        sceneData: withMicrowaveDescribeDraft(current.sceneData, input),
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "description",
          }),
        ],
      });
    });
  }, []);

  const savePrediction = useCallback((prediction: string, reasoning: string) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.PREDICT) {
        return current;
      }
      if (firstCommittedMicrowavePrediction(current.predictions)) {
        return current;
      }
      const evaluation = evaluateMicrowavePrediction(prediction, reasoning);
      if (!evaluation.sufficient) {
        return current;
      }
      const entry: PredictionEvidence = {
        prediction,
        reasoning: reasoning.trim(),
        timestamp: new Date().toISOString(),
        experimentId: MICROWAVE_EXPERIMENT_ID,
        committed: true,
      };
      return advanceIfReady({
        ...current,
        predictions: [...current.predictions, entry],
        events: [
          ...current.events,
          createLearningEvent("prediction_made", current.stage, { prediction }),
        ],
      });
    });
  }, []);

  const saveExperimentEvidence = useCallback(
    (comparison: MicrowaveComparison, reflection: string) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.EXPERIMENT) {
          return current;
        }
        const open = [...current.experimentEvidence]
          .reverse()
          .find(
            (item) =>
              item.experimentId === MICROWAVE_EXPERIMENT_ID &&
              item.sufficient !== true,
          );
        if (!open || !isMicrowaveComparison(comparison)) {
          return current;
        }
        const closed: ExperimentEvidence = {
          ...open,
          comparison,
          predictionComparison: comparison,
          reflection: reflection.trim(),
          sufficient: false,
        };
        closed.sufficient = isMicrowaveExperimentClosed({
          ...closed,
          sufficient: undefined,
        });
        const nextEvidence = current.experimentEvidence.map((item) =>
          item === open ? closed : item,
        );
        return advanceIfReady({
          ...current,
          experimentEvidence: nextEvidence,
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "experiment_evidence",
            }),
          ],
        });
      });
    },
    [],
  );

  const saveExplanation = useCallback((input: MicrowaveExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      const evaluation = evaluateMicrowaveExplanation(input);
      const entry: ExplanationEvidence = {
        text: input.studentExplanation.trim(),
        timestamp: new Date().toISOString(),
        sufficient: evaluation.sufficient,
        identifiesPartialEnergyRelation: evaluation.sufficient,
        microwaveAnswers: {
          energyTransfer: input.energyTransfer,
          link: input.link,
        },
      };
      return advanceIfReady({
        ...current,
        explanations: [...current.explanations, entry],
        sceneData: withMicrowaveExplainDraft(current.sceneData, input),
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "explanation",
          }),
        ],
      });
    });
  }, []);

  const saveModelAttempt = useCallback((draft: MicrowaveModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      const attempt = buildMicrowaveModelAttempt({
        ...draft,
        timestamp: new Date().toISOString(),
      });
      return advanceIfReady({
        ...current,
        modelAttempts: [...current.modelAttempts, attempt],
        sceneData: withMicrowaveModelDraft(current.sceneData, draft),
        events: [
          ...current.events,
          createLearningEvent("model_submitted", current.stage, {
            correctStructure: attempt.correctStructure,
          }),
        ],
      });
    });
  }, []);

  const saveTransferAttempt = useCallback((input: MicrowaveTransferInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      const attempt = buildMicrowaveTransferAttempt(input);
      const remaining = current.transferAttempts.filter(
        (item) => (item.targetId ?? item.scenarioId) !== input.targetId,
      );
      const nextAttempts = [...remaining, attempt];
      const nextTarget = activeMicrowaveTransferTargetId(nextAttempts);
      return advanceIfReady({
        ...current,
        transferAttempts: nextAttempts,
        sceneData: withMicrowaveTransferDraft(
          current.sceneData,
          attempt.accepted
            ? emptyMicrowaveTransferDraft(nextTarget)
            : {
                ...emptyMicrowaveTransferDraft(input.targetId),
                targetId: input.targetId,
                judgments: input.judgments,
                surfaceCueSelected: input.surfaceCueSelected,
                studentExplanation: input.studentExplanation,
                conditionChecks: Object.fromEntries(
                  (input.conditionChecks ?? []).map((id) => [id, id]),
                ),
              },
        ),
        events: [
          ...current.events,
          createLearningEvent("transfer_attempted", current.stage, {
            targetId: input.targetId,
            accepted: attempt.accepted,
          }),
        ],
      });
    });
  }, []);

  const saveExamAttempt = useCallback((input: MicrowaveExamInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      const attempt = buildMicrowaveExamAttempt(input);
      const remaining = current.examAttempts.filter(
        (item) => (item.patternId ?? item.questionId) !== input.patternId,
      );
      const nextAttempts = [...remaining, attempt];
      const draft = nextMicrowaveExamDraft(
        nextAttempts,
        microwaveExamDraft(current),
        input.patternId,
      );
      return advanceIfReady({
        ...current,
        examAttempts: nextAttempts,
        sceneData: withMicrowaveExamDraft(current.sceneData, draft),
        events: [
          ...current.events,
          createLearningEvent("exam_answered", current.stage, {
            patternId: input.patternId,
            correct: attempt.correct,
          }),
        ],
      });
    });
  }, []);

  const saveExplainDraft = useCallback((draft: MicrowaveExplainInput) => {
    updateSession((current) => ({
      ...current,
      sceneData: withMicrowaveExplainDraft(current.sceneData, draft),
    }));
  }, []);

  const saveModelDraft = useCallback((draft: MicrowaveModelDraft) => {
    updateSession((current) => ({
      ...current,
      sceneData: withMicrowaveModelDraft(current.sceneData, draft),
    }));
  }, []);

  const saveTransferDraft = useCallback((draft: ReturnType<typeof emptyMicrowaveTransferDraft>) => {
    updateSession((current) => ({
      ...current,
      sceneData: withMicrowaveTransferDraft(current.sceneData, draft),
    }));
  }, []);

  const saveExamDraft = useCallback((draft: MicrowaveExamDraft) => {
    updateSession((current) => ({
      ...current,
      sceneData: withMicrowaveExamDraft(current.sceneData, draft),
    }));
  }, []);

  const saveAiOffDraft = useCallback((draft: MicrowaveAiOffDraft) => {
    updateSession((current) => ({
      ...current,
      sceneData: withMicrowaveAiOffDraft(current.sceneData, draft),
    }));
  }, []);

  const saveAiOffIndependentResponse = useCallback(
    (input: MicrowaveAiOffIndependentInput) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        const attempt = buildMicrowaveAiOffAttempt(input, [], false);
        const previous = current.independentAssessment?.challengeAttempts ?? [];
        const remaining = previous.filter(
          (item) => item.challengeId !== input.challengeId,
        );
        const assessment = buildMicrowaveAiOffAssessment(
          [...remaining, attempt],
          false,
        );
        const draft = nextMicrowaveAiOffDraft(
          assessment,
          microwaveAiOffDraft(current),
          input.challengeId,
        );
        return {
          ...current,
          independentAssessment: {
            ...assessment,
            completedWithoutAI: false,
          },
          sceneData: withMicrowaveAiOffDraft(current.sceneData, {
            ...draft,
            step: "post-check",
            currentChallengeId: input.challengeId,
          }),
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "independent-commit",
            }),
          ],
        };
      });
    },
    [],
  );

  const saveAiOffPostCheck = useCallback(
    (challengeId: string, postCheckIds: readonly string[]) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        const previous = current.independentAssessment?.challengeAttempts ?? [];
        const committed = [...previous]
          .reverse()
          .find((item) => item.challengeId === challengeId);
        if (!committed) {
          return current;
        }
        const updated = applyMicrowaveAiOffPostCheck(committed, postCheckIds, false);
        const remaining = previous.filter((item) => item !== committed);
        const assessment = buildMicrowaveAiOffAssessment([...remaining, updated], false);
        const draft = nextMicrowaveAiOffDraft(
          assessment,
          microwaveAiOffDraft(current),
          challengeId,
        );
        return advanceIfReady({
          ...current,
          independentAssessment: assessment,
          sceneData: withMicrowaveAiOffDraft(current.sceneData, draft),
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "independent-post-check",
            }),
          ],
        });
      });
    },
    [],
  );

  const retryAiOff = useCallback((challengeId: string) => {
    updateSession((current) => ({
      ...current,
      sceneData: withMicrowaveAiOffDraft(
        current.sceneData,
        retryMicrowaveAiOffDraft(microwaveAiOffDraft(current), challengeId),
      ),
    }));
  }, []);

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
    });
  }, []);

  const runExperiment = useCallback((): MicrowaveExperimentResult | null => {
    if (!session || !canRunMicrowaveExperiment(session)) {
      return null;
    }
    return simulateHeating(toExperimentInput(getMicrowavePhysicsState(session)));
  }, [session]);

  const commitExperiment = useCallback((result: MicrowaveExperimentResult) => {
    updateSession((current) => {
      const physics = getMicrowavePhysicsState(current);
      const history = [
        ...getMicrowaveExperimentHistory(current),
        result,
      ];
      const next: LearningSession = {
        ...current,
        physicsState: wrapMicrowavePhysicsState(applyHeatingResult(physics, result)),
        sceneData: withMicrowaveExperimentHistory(current, history),
        events: [
          ...current.events,
          createLearningEvent("experiment_run", current.stage, {
            finalTemperatureC: result.finalTemperatureC,
            energyInputJ: result.energyInputJ,
            deltaTemperatureC: result.deltaTemperatureC,
            powerW: physics.powerW,
            heatingTimeSec: physics.heatingTimeSec,
            initialTemperatureC: physics.currentTemperatureC,
          }),
        ],
      };
      if (current.stage !== LearningStage.EXPERIMENT) {
        return next;
      }
      const prediction = firstCommittedMicrowavePrediction(current.predictions);
      if (!prediction) {
        return next;
      }
      const interventionAt = new Date().toISOString();
      const evidence: ExperimentEvidence = {
        experimentId: MICROWAVE_EXPERIMENT_ID,
        prediction: prediction.prediction,
        predictionReason: prediction.reasoning,
        committedAt: prediction.timestamp,
        interventionAt,
        authoredBeforeIntervention: authoredBeforeIntervention(
          prediction.timestamp,
          interventionAt,
        ),
        actualResult: {
          finalTemperatureC: result.finalTemperatureC,
          energyInputJ: result.energyInputJ,
          deltaTemperatureC: result.deltaTemperatureC,
        },
        physicsResult: result,
        parameters: {
          powerW: physics.powerW,
          heatingTimeSec: physics.heatingTimeSec,
          initialTemperatureC: physics.currentTemperatureC,
        },
        predictionComparison: "",
        reflection: "",
        comparison: "",
        sufficient: false,
        timestamp: interventionAt,
      };
      return {
        ...next,
        experimentEvidence: [...current.experimentEvidence, evidence],
      };
    });
  }, []);

  const resetBread = useCallback(() => {
    updateSession((current) => ({
      ...current,
      physicsState: wrapMicrowavePhysicsState(
        resetBreadTemperature(getMicrowavePhysicsState(current)),
      ),
    }));
  }, []);

  const updateControls = useCallback(
    (updates: Partial<{ powerW: number; heatingTimeSec: number }>) => {
      updateSession((current) => ({
        ...current,
        physicsState: wrapMicrowavePhysicsState(
          updateMicrowavePhysicsState(getMicrowavePhysicsState(current), updates),
        ),
      }));
    },
    [],
  );

  const startOver = useCallback(() => {
    resetStoredSession("microwave-bread");
  }, []);

  return {
    session,
    hydrated: session !== null,
    startLesson,
    goBack,
    goToStage,
    saveObservation,
    saveDescription,
    savePrediction,
    saveExperimentEvidence,
    saveExplanation,
    saveModelAttempt,
    saveTransferAttempt,
    saveExamAttempt,
    saveExplainDraft,
    saveModelDraft,
    saveTransferDraft,
    saveExamDraft,
    saveAiOffDraft,
    saveAiOffIndependentResponse,
    saveAiOffPostCheck,
    retryAiOff,
    runExperiment,
    commitExperiment,
    resetBread,
    updateControls,
    startOver,
    explainDraft: session ? microwaveExplainDraft(session) : undefined,
    modelDraft: session ? microwaveModelDraft(session) : undefined,
    transferDraft: session ? microwaveTransferDraft(session) : undefined,
    examDraft: session ? microwaveExamDraft(session) : undefined,
    aiOffDraft: session ? microwaveAiOffDraft(session) : undefined,
    activeTransferTargetId: session
      ? activeMicrowaveTransferTargetId(
          session.transferAttempts,
          microwaveTransferDraft(session).targetId,
        )
      : undefined,
    currentAiOffChallengeId: session
      ? currentMicrowaveAiOffChallengeId(
          session.independentAssessment,
          microwaveAiOffDraft(session),
        )
      : null,
    canGoBack: canGoBackSession(session),
    canAdvance: canAdvanceSession(session),
  };
}

function canGoBackSession(session: LearningSession | null): boolean {
  if (!session) {
    return false;
  }
  const target = previousStage(session.stage);
  return Boolean(target && canLeaveStage(session, target));
}

function canAdvanceSession(session: LearningSession | null): boolean {
  if (!session) {
    return false;
  }
  const target = nextStage(session.stage);
  return Boolean(target && canLeaveStage(session, target));
}
