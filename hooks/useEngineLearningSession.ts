"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import {
  ENGINE_EXPERIMENT_A,
  ENGINE_EXPERIMENT_B,
  ENGINE_SCENE_ID,
  type EngineSceneExperimentId,
} from "@/lib/content/four-stroke-engine";
import { advanceIfReady } from "@/lib/learning/advance";
import {
  evaluateEngineDescription,
  type EngineDescribeInput,
} from "@/lib/learning/engine-describe";
import {
  authoredBeforeIntervention,
  canRunEngineExperiment,
  emptyObservedResult,
  engineComparisonLabel,
  hasClosedEngineExperiment,
  hasCompletedEngineExperiments,
  isEngineComparison,
  isEngineExperimentClosed,
  microwavePlaceholder,
  physicsSnapshotFrom,
  runSceneExperiment,
  activeIncompleteEngineEvidence,
} from "@/lib/learning/engine-experiment";
import {
  evaluateEngineObservation,
  observationLabelsFor,
} from "@/lib/learning/engine-observe";
import {
  evaluateEnginePrediction,
  firstCommittedEnginePrediction,
} from "@/lib/learning/engine-predict";
import {
  ENGINE_EXPLAIN_DRAFT_KIND,
  evaluateEngineExplanation,
  type EngineExplainInput,
} from "@/lib/learning/engine-explain";
import {
  buildEngineModelAttempt,
  connectionsFromEngineSlots,
  ENGINE_MODEL_DRAFT_KIND,
  hasCompletedEngineModel,
  type EngineModelDraft,
  type EngineRelationKind,
} from "@/lib/learning/engine-model";
import {
  activeEngineTransferTargetId,
  buildEngineTransferAttempt,
  ENGINE_TRANSFER_DRAFT_KIND,
  emptyEngineTransferDraft,
  hasCompletedEngineTransfer,
  type EngineTransferDraft,
  type EngineTransferInput,
} from "@/lib/learning/engine-transfer";
import {
  applyEngineAiOffPostCheck,
  buildEngineAiOffAttempt,
  buildEngineAiOffAssessment,
  canCommitEngineAiOffResponse,
  emptyEngineAiOffDraft,
  engineTutorUsedDuringIndependent,
  hasCompletedEngineAiOff,
  latestEngineAiOffDraft,
  nextEngineAiOffDraft,
  type EngineAiOffDraft,
  type EngineAiOffIndependentInput,
  type EngineAiOffPostCheckInput,
} from "@/lib/learning/engine-ai-off";
import {
  buildEngineExamAttempt,
  canCommitEngineExamAttempt,
  emptyEngineExamDraft,
  hasCompletedEngineExam,
  latestEngineExamDraft,
  nextEngineExamDraft,
  retireEngineExamDraft,
  type EngineExamDraft,
  type EngineExamInput,
} from "@/lib/learning/engine-exam";
import { createLearningEvent } from "@/lib/learning/events";
import { nextEngineHint } from "@/lib/learning/hint-ladder";
import { canLeaveStage } from "@/lib/learning/progression";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  resetStoredSession,
  subscribeSession,
  updateSession,
} from "@/lib/learning/session-store";
import { previousStage } from "@/lib/learning/state-machine";
import type { EngineExperimentResult } from "@/lib/physics/engine";
import {
  LearningStage,
  type DescriptionEvidence,
  type EngineObservedResult,
  type ExperimentEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
  type PredictionEvidence,
} from "@/types/learning";

export function useEngineLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot(ENGINE_SCENE_ID),
    getServerSessionSnapshot,
  );

  useEffect(() => {
    if (!session) {
      return;
    }
    if (
      session.stage === LearningStage.EXPERIMENT &&
      hasCompletedEngineExperiments(session)
    ) {
      updateSession((current) => advanceIfReady(current), ENGINE_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.MODEL &&
      hasCompletedEngineModel(session.modelAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.TRANSFER,
      )
    ) {
      updateSession((current) => advanceIfReady(current), ENGINE_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.TRANSFER &&
      hasCompletedEngineTransfer(session.transferAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.EXAM,
      )
    ) {
      updateSession((current) => advanceIfReady(current), ENGINE_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.EXAM &&
      hasCompletedEngineExam(session.examAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.AI_OFF,
      )
    ) {
      updateSession((current) => advanceIfReady(current), ENGINE_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.AI_OFF &&
      hasCompletedEngineAiOff(session) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.COMPLETE,
      )
    ) {
      updateSession((current) => advanceIfReady(current), ENGINE_SCENE_ID);
    }
  }, [session, session?.sessionId, session?.stage]);

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
    }, ENGINE_SCENE_ID);
  }, []);

  const startLesson = useCallback(() => {
    goToStage(LearningStage.OBSERVE);
  }, [goToStage]);

  const saveObservation = useCallback(
    (selectedOptionIds: readonly string[], watchedFullCycle: boolean) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.OBSERVE) {
          return current;
        }

        const evaluation = evaluateEngineObservation(selectedOptionIds);
        const observation: ObservationEvidence = {
          text: observationLabelsFor(selectedOptionIds) || "（未勾选可见变化）",
          timestamp: new Date().toISOString(),
          selectedOptionIds: evaluation.selectedOptionIds,
          watchedFullCycle,
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
              watchedFullCycle,
            }),
          ],
        };

        return advanceIfReady(next);
      }, ENGINE_SCENE_ID);
    },
    [],
  );

  const saveDescription = useCallback((input: EngineDescribeInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
        return current;
      }

      const evaluation = evaluateEngineDescription(input);
      const description: DescriptionEvidence = {
        text: input.studentDescription.trim(),
        sufficient: evaluation.sufficient,
        timestamp: new Date().toISOString(),
        engineStroke: "power",
        pistonMotionCorrect: evaluation.pistonMotionCorrect,
        intakeValveStateCorrect: evaluation.intakeValveStateCorrect,
        exhaustValveStateCorrect: evaluation.exhaustValveStateCorrect,
        combustionStateCorrect: evaluation.combustionStateCorrect,
        distinguishesPowerEvent: evaluation.distinguishesPowerEvent,
        engineAnswers: input.snapshots,
      };

      const next = {
        ...current,
        descriptions: [...current.descriptions, description],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "description",
            sufficient: evaluation.sufficient,
          }),
        ],
      };

      return advanceIfReady(next);
    }, ENGINE_SCENE_ID);
  }, []);

  const commitPrediction = useCallback(
    (experimentId: EngineSceneExperimentId, outcome: string, reason: string) => {
      updateSession((current) => {
        const allowedStage =
          current.stage === LearningStage.PREDICT ||
          current.stage === LearningStage.EXPERIMENT;
        if (!allowedStage) {
          return current;
        }
        if (
          experimentId === ENGINE_EXPERIMENT_B &&
          (current.stage !== LearningStage.EXPERIMENT ||
            !hasClosedEngineExperiment(current, ENGINE_EXPERIMENT_A))
        ) {
          return current;
        }
        if (
          experimentId === ENGINE_EXPERIMENT_A &&
          current.stage !== LearningStage.PREDICT &&
          current.stage !== LearningStage.EXPERIMENT
        ) {
          return current;
        }

        const evaluation = evaluateEnginePrediction(outcome, reason);
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

        return advanceIfReady(next);
      }, ENGINE_SCENE_ID);
    },
    [],
  );

  const runExperiment = useCallback(
    (experimentId: EngineSceneExperimentId): EngineExperimentResult | null => {
      let result: EngineExperimentResult | null = null;

      updateSession((current) => {
        if (current.stage !== LearningStage.EXPERIMENT) {
          return current;
        }
        if (!canRunEngineExperiment(current, experimentId)) {
          return current;
        }

        const physicsResult = runSceneExperiment(experimentId);
        result = physicsResult;
        const incomplete = activeIncompleteEngineEvidence(current, experimentId);
        const alreadyClosed = hasClosedEngineExperiment(current, experimentId);
        if (incomplete || alreadyClosed) {
          return current;
        }

        const prediction = firstCommittedEnginePrediction(
          current.predictions,
          experimentId,
        );
        if (!prediction) {
          result = null;
          return current;
        }

        const interventionAt = new Date().toISOString();
        const evidence: ExperimentEvidence = {
          ...microwavePlaceholder(),
          prediction: prediction.prediction,
          predictionReason: prediction.reasoning,
          predictionComparison: "",
          reflection: "",
          timestamp: interventionAt,
          experimentId,
          committedAt: prediction.timestamp,
          interventionAt,
          intervention: physicsResult.intervention,
          observedResult: emptyObservedResult(),
          comparison: "",
          physicsResult: physicsSnapshotFrom(physicsResult),
          authoredBeforeIntervention: authoredBeforeIntervention(
            prediction.timestamp,
            interventionAt,
          ),
          sufficient: false,
        };

        return {
          ...current,
          experimentEvidence: [...current.experimentEvidence, evidence],
          events: [
            ...current.events,
            createLearningEvent("experiment_run", current.stage, {
              experimentId,
              combustionOccurred: physicsResult.combustionOccurred,
              mainOutputOccurred: physicsResult.normalMechanicalOutputOccurred,
              workTransfer: physicsResult.powerStroke.workTransfer,
              mechanicalOutput: physicsResult.powerStroke.mechanicalOutput,
              crankshaftMoving: physicsResult.powerStroke.crankshaftMoving,
            }),
          ],
        };
      }, ENGINE_SCENE_ID);

      return result;
    },
    [],
  );

  const saveObservedResult = useCallback(
    (experimentId: EngineSceneExperimentId, observed: EngineObservedResult) => {
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            observedResult: observed,
          })),
        ENGINE_SCENE_ID,
      );
    },
    [],
  );

  const saveComparison = useCallback(
    (
      experimentId: EngineSceneExperimentId,
      comparison: "same" | "different" | "partial",
    ) => {
      if (!isEngineComparison(comparison)) {
        return;
      }
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            comparison,
            predictionComparison: engineComparisonLabel(comparison),
          })),
        ENGINE_SCENE_ID,
      );
    },
    [],
  );

  const saveReflection = useCallback(
    (experimentId: EngineSceneExperimentId, reflection: string) => {
      updateSession((current) => {
        const next = patchIncompleteEvidence(current, experimentId, (evidence) => {
          const updated = {
            ...evidence,
            reflection: reflection.trim(),
          };
          return {
            ...updated,
            sufficient: isEngineExperimentClosed({
              ...updated,
              sufficient: false,
            }),
          };
        });
        return advanceIfReady(next);
      }, ENGINE_SCENE_ID);
    },
    [],
  );

  const saveExplainDraft = useCallback((input: EngineExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      return upsertDraftEvent(current, {
        kind: ENGINE_EXPLAIN_DRAFT_KIND,
        firstChange: input.firstChange,
        gasEffect: input.gasEffect,
        mechanicalGain: input.mechanicalGain,
        studentExplanation: input.studentExplanation,
      });
    }, ENGINE_SCENE_ID);
  }, []);

  const saveExplanation = useCallback((input: EngineExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }

      const evaluation = evaluateEngineExplanation(input);
      const explanation: ExplanationEvidence = {
        text: input.studentExplanation.trim(),
        timestamp: new Date().toISOString(),
        referencesCombustionOrEnergyRelease:
          evaluation.referencesCombustionOrEnergyRelease,
        identifiesWorkingGasChange: evaluation.identifiesWorkingGasChange,
        identifiesMechanicalInteraction: evaluation.identifiesMechanicalInteraction,
        identifiesWorkLikeCausalLink: evaluation.identifiesWorkLikeCausalLink,
        distinguishesCombustionFromDirectMechanicalOutput:
          evaluation.distinguishesCombustionFromDirectMechanicalOutput,
        engineAnswers: {
          firstChange: input.firstChange,
          gasEffect: input.gasEffect,
          mechanicalGain: input.mechanicalGain,
        },
        sufficient: evaluation.sufficient,
      };

      const next = {
        ...current,
        explanations: [...current.explanations, explanation],
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "explanation",
            sufficient: evaluation.sufficient,
          }),
        ],
      };

      return advanceIfReady(next);
    }, ENGINE_SCENE_ID);
  }, []);

  const saveModelDraft = useCallback((draft: EngineModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      return upsertDraftEvent(current, draft);
    }, ENGINE_SCENE_ID);
  }, []);

  const saveModelAttempt = useCallback(
    (input: {
      slots: string[];
      relationKinds: Array<EngineRelationKind | "">;
      combustionEnablesConversion: boolean;
    }) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.MODEL) {
          return current;
        }

        const attempt = buildEngineModelAttempt({
          slots: input.slots,
          connections: connectionsFromEngineSlots(input.slots, input.relationKinds),
          combustionEnablesConversion: input.combustionEnablesConversion,
          timestamp: new Date().toISOString(),
        });

        const next = {
          ...current,
          modelAttempts: [...current.modelAttempts, attempt],
          events: [
            ...current.events,
            createLearningEvent("model_submitted", current.stage, {
              correctStructure: attempt.correctStructure,
              failureKinds: attempt.failureKinds,
            }),
          ],
        };

        return advanceIfReady(
          upsertDraftEvent(next, {
            kind: ENGINE_MODEL_DRAFT_KIND,
            slots: input.slots,
            relationKinds: input.relationKinds,
            combustionEnablesConversion: input.combustionEnablesConversion,
          }),
        );
      }, ENGINE_SCENE_ID);
    },
    [],
  );

  const saveTransferDraft = useCallback((draft: EngineTransferDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      return upsertDraftEvent(current, draft);
    }, ENGINE_SCENE_ID);
  }, []);

  const saveTransferAttempt = useCallback((input: EngineTransferInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }

      const attempt = buildEngineTransferAttempt(input);
      const next = {
        ...current,
        transferAttempts: [...current.transferAttempts, attempt],
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

      const nextTarget = attempt.accepted
        ? activeEngineTransferTargetId(next.transferAttempts)
        : input.targetId;

      return advanceIfReady(
        upsertDraftEvent(next, {
          ...emptyEngineTransferDraft(nextTarget),
          kind: ENGINE_TRANSFER_DRAFT_KIND,
          targetId: nextTarget,
          judgments:
            attempt.accepted && nextTarget !== input.targetId
              ? emptyEngineTransferDraft(nextTarget).judgments
              : input.judgments,
          relationOrder: attempt.accepted ? [] : input.relationOrder,
          surfaceCueSelected: attempt.accepted ? false : input.surfaceCueSelected,
          studentExplanation: attempt.accepted ? "" : input.studentExplanation,
        }),
      );
    }, ENGINE_SCENE_ID);
  }, []);

  const saveExamDraft = useCallback((draft: EngineExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return upsertDraftEvent(current, draft);
    }, ENGINE_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback((input: EngineExamInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      if (!canCommitEngineExamAttempt(input)) {
        return current;
      }

      const attempt = buildEngineExamAttempt(input);
      const next = {
        ...current,
        examAttempts: [...current.examAttempts, attempt],
        events: [
          ...current.events,
          createLearningEvent("exam_answered", current.stage, {
            patternId: attempt.patternId,
            correct: attempt.correct,
            reasoningQuality: attempt.reasoningQuality,
          }),
        ],
      };
      const previousDraft =
        latestEngineExamDraft(next.events) ?? emptyEngineExamDraft();
      const draft = nextEngineExamDraft(next.examAttempts, previousDraft, input.patternId);

      return advanceIfReady(upsertDraftEvent(next, draft));
    }, ENGINE_SCENE_ID);
  }, []);

  const skipExamRetry = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      const previousDraft =
        latestEngineExamDraft(current.events) ?? emptyEngineExamDraft();
      return upsertDraftEvent(
        current,
        retireEngineExamDraft(current.examAttempts, previousDraft),
      );
    }, ENGINE_SCENE_ID);
  }, []);

  const saveAiOffDraft = useCallback((draft: EngineAiOffDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return upsertDraftEvent(current, draft);
    }, ENGINE_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback(
    (input: EngineAiOffIndependentInput) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        if (!canCommitEngineAiOffResponse(input)) {
          return current;
        }

        const llmUsed = engineTutorUsedDuringIndependent(current);
        const attempt = buildEngineAiOffAttempt(input, [], llmUsed);
        const attempts = [
          ...(current.independentAssessment?.challengeAttempts ?? []),
          attempt,
        ];
        const assessment = buildEngineAiOffAssessment(attempts, llmUsed);
        const previousDraft =
          latestEngineAiOffDraft(current.events) ?? emptyEngineAiOffDraft();
        const next = {
          ...current,
          independentAssessment: assessment,
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "engine-ai-off-commit",
              challengeId: attempt.challengeId,
            }),
          ],
        };
        return upsertDraftEvent(next, {
          ...previousDraft,
          currentChallengeId: input.challengeId,
          step: "post-check" as const,
          selectedAnswer: input.selectedAnswer,
          reasoning: input.studentReasoning,
          postCheckSelections: [],
        });
      }, ENGINE_SCENE_ID);
    },
    [],
  );

  const saveAiOffPostCheck = useCallback((input: EngineAiOffPostCheckInput) => {
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
      const llmUsed = engineTutorUsedDuringIndependent(current);
      attempts[actualIndex] = applyEngineAiOffPostCheck(
        original,
        input.postCheckIds,
        llmUsed,
      );
      const assessment = buildEngineAiOffAssessment(attempts, llmUsed);
      const previousDraft =
        latestEngineAiOffDraft(current.events) ?? emptyEngineAiOffDraft();
      const next = {
        ...current,
        independentAssessment: assessment,
        events: [
          ...current.events,
          createLearningEvent("student_response", current.stage, {
            kind: "engine-ai-off-post-check",
            challengeId: input.challengeId,
            accepted: attempts[actualIndex]?.accepted,
          }),
        ],
      };
      return advanceIfReady(
        upsertDraftEvent(
          next,
          nextEngineAiOffDraft(assessment, previousDraft, input.challengeId),
        ),
      );
    }, ENGINE_SCENE_ID);
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
      if (!nextEngineHint(current.events, current.stage)) {
        return current;
      }
      return {
        ...current,
        events: [
          ...current.events,
          createLearningEvent("ai_interaction", current.stage, {
            source: "hint-ladder",
          }),
        ],
      };
    }, ENGINE_SCENE_ID);
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
    }, ENGINE_SCENE_ID);
  }, []);

  const startOver = useCallback(() => {
    resetStoredSession(ENGINE_SCENE_ID);
  }, []);

  return {
    session,
    hydrated: session !== null,
    startLesson,
    goBack,
    saveObservation,
    saveDescription,
    commitPrediction,
    runExperiment,
    saveObservedResult,
    saveComparison,
    saveReflection,
    saveExplainDraft,
    saveExplanation,
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
    canGoBack: canGoBackSession(session),
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

function patchIncompleteEvidence(
  session: LearningSession,
  experimentId: EngineSceneExperimentId,
  patch: (evidence: ExperimentEvidence) => ExperimentEvidence,
): LearningSession {
  const incomplete = activeIncompleteEngineEvidence(session, experimentId);
  if (!incomplete) {
    return session;
  }

  const index = session.experimentEvidence.lastIndexOf(incomplete);
  if (index < 0) {
    return session;
  }

  const current = session.experimentEvidence[index];
  const updated = patch(current);
  const nextEvidence = [...session.experimentEvidence];
  nextEvidence[index] = {
    ...updated,
    prediction: current.prediction,
    predictionReason: current.predictionReason,
    committedAt: current.committedAt,
    interventionAt: current.interventionAt,
    physicsResult: current.physicsResult,
    authoredBeforeIntervention: current.authoredBeforeIntervention,
  };

  return {
    ...session,
    experimentEvidence: nextEvidence,
    events: [
      ...session.events,
      createLearningEvent("student_response", session.stage, {
        kind: "engine-experiment",
        experimentId,
      }),
    ],
  };
}

function upsertDraftEvent<T extends { kind: string }>(
  session: LearningSession,
  metadata: T,
): LearningSession {
  const events = session.events.filter((event) => event.metadata?.kind !== metadata.kind);
  return {
    ...session,
    events: [
      ...events,
      createLearningEvent(
        "student_response",
        session.stage,
        metadata as Record<string, unknown>,
      ),
    ],
  };
}
