"use client";

import { useCallback, useSyncExternalStore } from "react";

import { createLearningEvent } from "@/lib/learning/events";
import type { ExamQuestionDefinition } from "@/lib/content/exam-questions";
import { INDEPENDENT_EXAM_QUESTION } from "@/lib/content/independent-challenge";
import { evaluateExamAttempt } from "@/lib/learning/exam";
import {
  classifyExplanationLevel,
} from "@/lib/learning/explanation";
import { markIndependentAssessmentComplete } from "@/lib/learning/independent";
import { buildModelAttempt } from "@/lib/learning/model-evaluation";
import { canLeaveStage } from "@/lib/learning/progression";
import { buildCognitiveProfile } from "@/lib/learning/reflection";
import { classifyTransferAttempt } from "@/lib/learning/transfer";
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
  LearningStage,
  type DescriptionEvidence,
  type ExamAttempt,
  type ExplanationEvidence,
  type IndependentAssessment,
  type LearningSession,
  type ModelAttempt,
  type ObservationEvidence,
  type PredictionEvidence,
  type TransferAttempt,
} from "@/types/learning";
import type { MicrowaveExperimentResult } from "@/types/physics";

export function useLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
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
        events: [
          ...current.events,
          createLearningEvent("stage_entered", stage),
        ],
      };
    });
  }, []);

  const startLesson = useCallback(() => {
    goToStage(LearningStage.OBSERVE);
  }, [goToStage]);

  const saveObservation = useCallback((text: string) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }

      const observation: ObservationEvidence = {
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      const next = {
        ...current,
        observations: [...current.observations, observation],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "observation",
          }),
        ],
      };

      return tryAdvance(next);
    });
  }, []);

  const saveDescription = useCallback((text: string) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
        return current;
      }

      const trimmed = text.trim();
      const description: DescriptionEvidence = {
        text: trimmed,
        object: trimmed.toLowerCase().includes("bread") ? "bread" : undefined,
        quantity: trimmed.toLowerCase().includes("temperature")
          ? "temperature"
          : undefined,
        change:
          trimmed.toLowerCase().includes("increase") ||
          trimmed.toLowerCase().includes("increased")
            ? "increase"
            : undefined,
        timestamp: new Date().toISOString(),
      };

      const next = {
        ...current,
        descriptions: [...current.descriptions, description],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "description",
          }),
        ],
      };

      return tryAdvance(next);
    });
  }, []);

  const savePrediction = useCallback((prediction: string, reasoning: string) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.PREDICT) {
        return current;
      }

      const entry: PredictionEvidence = {
        prediction,
        reasoning: reasoning.trim(),
        timestamp: new Date().toISOString(),
      };

      const next = {
        ...current,
        predictions: [...current.predictions, entry],
        events: [
          ...current.events,
          createLearningEvent("prediction_made", current.stage, {
            prediction,
          }),
        ],
      };

      return tryAdvance(next);
    });
  }, []);

  const saveExplanation = useCallback((text: string) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }

      const entry: ExplanationEvidence = {
        text: text.trim(),
        explanationLevel: classifyExplanationLevel(text),
        timestamp: new Date().toISOString(),
      };

      const next = {
        ...current,
        explanations: [...current.explanations, entry],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "explanation",
            level: entry.explanationLevel,
          }),
        ],
      };

      return tryAdvance(next);
    });
  }, []);

  const saveModelAttempt = useCallback(
    (input: {
      middleNode: string;
      connectSourceToMiddle: boolean;
      connectMiddleToTarget: boolean;
    }) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.MODEL) {
          return current;
        }

        const attempt: ModelAttempt = buildModelAttempt({
          ...input,
          timestamp: new Date().toISOString(),
        });

        const next = {
          ...current,
          modelAttempts: [...current.modelAttempts, attempt],
          events: [
            ...current.events,
            createLearningEvent("model_submitted", current.stage, {
              middleNode: input.middleNode,
              correctStructure: attempt.correctStructure,
            }),
          ],
        };

        return tryAdvance(next);
      });
    },
    [],
  );

  const saveTransferAttempt = useCallback(
    (scenarioId: string, response: string) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.TRANSFER) {
          return current;
        }

        const attempt: TransferAttempt = {
          scenarioId,
          response: response.trim(),
          identifiedSharedModel: classifyTransferAttempt(response),
          timestamp: new Date().toISOString(),
        };

        const remainingAttempts = current.transferAttempts.filter(
          (item) => item.scenarioId !== scenarioId,
        );

        const next = {
          ...current,
          transferAttempts: [...remainingAttempts, attempt],
          events: [
            ...current.events,
            createLearningEvent("transfer_attempted", current.stage, {
              scenarioId,
              identifiedSharedModel: attempt.identifiedSharedModel,
            }),
          ],
        };

        return tryAdvance(next);
      });
    },
    [],
  );

  const saveExamAttempt = useCallback(
    (input: {
      question: ExamQuestionDefinition;
      representation: string[];
      modelFocus: string;
      selectedAnswer: string;
      reasoning: string;
    }) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.EXAM) {
          return current;
        }

        const evaluation = evaluateExamAttempt({
          question: input.question,
          representation: input.representation,
          modelFocus: input.modelFocus,
          selectedAnswer: input.selectedAnswer,
          reasoning: input.reasoning,
        });

        const attempt: ExamAttempt = {
          questionId: input.question.id,
          representation: input.representation,
          modelFocus: input.modelFocus,
          selectedAnswer: input.selectedAnswer,
          reasoning: input.reasoning.trim(),
          correct: evaluation.correct,
          reasoningQuality: evaluation.reasoningQuality,
          timestamp: new Date().toISOString(),
        };

        const remainingAttempts = current.examAttempts.filter(
          (item) => item.questionId !== input.question.id,
        );

        const next = {
          ...current,
          examAttempts: [...remainingAttempts, attempt],
          events: [
            ...current.events,
            createLearningEvent("exam_answered", current.stage, {
              questionId: input.question.id,
              correct: attempt.correct,
              reasoningQuality: attempt.reasoningQuality,
            }),
          ],
        };

        return tryAdvance(next);
      });
    },
    [],
  );

  const saveIndependentExplanation = useCallback((text: string) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }

      const assessment = markIndependentAssessmentComplete({
        explanation: text.trim(),
        examResponses: current.independentAssessment?.examResponses ?? {},
        completedWithoutAI: false,
      });

      return finishIndependentIfReady(current, assessment);
    });
  }, []);

  const saveIndependentExam = useCallback((selectedAnswer: string) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }

      const assessment = markIndependentAssessmentComplete({
        explanation: current.independentAssessment?.explanation ?? "",
        examResponses: {
          ...(current.independentAssessment?.examResponses ?? {}),
          [INDEPENDENT_EXAM_QUESTION.id]: selectedAnswer,
        },
        completedWithoutAI: false,
      });

      return finishIndependentIfReady(current, assessment);
    });
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
        events: [
          ...current.events,
          createLearningEvent("stage_entered", target),
        ],
      };
    });
  }, []);

  const runExperiment = useCallback((): MicrowaveExperimentResult | null => {
    if (!session) {
      return null;
    }
    return simulateHeating(toExperimentInput(session.physicsState));
  }, [session]);

  const commitExperiment = useCallback((result: MicrowaveExperimentResult) => {
    updateSession((current) => ({
      ...current,
      physicsState: applyHeatingResult(current.physicsState, result),
      experimentHistory: [...current.experimentHistory, result],
      events: [
        ...current.events,
        createLearningEvent("experiment_run", current.stage, {
          finalTemperatureC: result.finalTemperatureC,
          energyInputJ: result.energyInputJ,
          deltaTemperatureC: result.deltaTemperatureC,
        }),
      ],
    }));
  }, []);

  const resetBread = useCallback(() => {
    updateSession((current) => ({
      ...current,
      physicsState: resetBreadTemperature(current.physicsState),
    }));
  }, []);

  const updateControls = useCallback(
    (updates: Partial<{ powerW: number; heatingTimeSec: number }>) => {
      updateSession((current) => ({
        ...current,
        physicsState: updateMicrowavePhysicsState(current.physicsState, updates),
      }));
    },
    [],
  );

  const startOver = useCallback(() => {
    resetStoredSession();
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
    saveExplanation,
    saveModelAttempt,
    saveTransferAttempt,
    saveExamAttempt,
    saveIndependentExplanation,
    saveIndependentExam,
    runExperiment,
    commitExperiment,
    resetBread,
    updateControls,
    startOver,
    canGoBack: canGoBackSession(session),
    canAdvance: canAdvanceSession(session),
  };
}

function canGoBackSession(session: LearningSession | null): boolean {
  if (!session) {
    return false;
  }

  const target = previousStage(session.stage);
  if (!target) {
    return false;
  }

  return canLeaveStage(session, target);
}

function canAdvanceSession(session: LearningSession | null): boolean {
  if (!session) {
    return false;
  }

  const target = nextStage(session.stage);
  if (!target) {
    return false;
  }

  return canLeaveStage(session, target);
}

function finishIndependentIfReady(
  session: LearningSession,
  assessment: IndependentAssessment,
): LearningSession {
  const next: LearningSession = {
    ...session,
    independentAssessment: assessment,
    events: [
      ...session.events,
      createLearningEvent("student_response", session.stage, {
        kind: "independent",
        completedWithoutAI: assessment.completedWithoutAI,
      }),
    ],
  };

  return tryAdvance(next);
}

function tryAdvance(session: LearningSession): LearningSession {
  const target = nextStage(session.stage);
  if (!target || !canLeaveStage(session, target)) {
    return session;
  }

  const events = [
    ...session.events,
    createLearningEvent("stage_entered", target),
  ];

  if (target === LearningStage.AI_OFF) {
    events.push(createLearningEvent("ai_off_started", target));
  }

  if (target === LearningStage.COMPLETE) {
    events.push(createLearningEvent("session_completed", target));
  }

  return {
    ...session,
    stage: target,
    completed: target === LearningStage.COMPLETE || session.completed,
    cognitiveProfile:
      target === LearningStage.COMPLETE
        ? buildCognitiveProfile(session)
        : session.cognitiveProfile,
    events,
  };
}
