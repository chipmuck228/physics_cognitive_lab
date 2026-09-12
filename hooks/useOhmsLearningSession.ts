"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { OHMS_PHASE_STAGES } from "@/lib/content/simple-resistor-circuit";
import { advanceIfReady } from "@/lib/learning/advance";
import {
  applyOhmsAiOffPostCheck,
  buildOhmsAiOffAssessment,
  buildOhmsAiOffAttempt,
  hasCompletedOhmsAiOff,
  nextOhmsAiOffDraft,
  ohmsTutorUsedDuringIndependent,
  type OhmsAiOffDraft,
} from "@/lib/learning/ohms-ai-off";
import {
  evaluateOhmsDescription,
  type OhmsDescribeInput,
} from "@/lib/learning/ohms-describe";
import {
  activeIncompleteOhmsEvidence,
  authoredBeforeIntervention,
  canRunOhmsExperiment,
  emptyOhmsObservedResult,
  hasClosedOhmsExperiment,
  isOhmsComparison,
  isOhmsExperimentClosed,
  ohmsComparisonLabel,
  runSceneOhmsExperiment,
  type OhmsObservedResult,
} from "@/lib/learning/ohms-experiment";
import {
  evaluateOhmsObservation,
  ohmsObservationLabelsFor,
} from "@/lib/learning/ohms-observe";
import {
  evaluateOhmsPrediction,
  firstCommittedOhmsPrediction,
} from "@/lib/learning/ohms-predict";
import {
  ohmsAiOffDraft,
  ohmsExamDraft,
  withOhmsAiOffDraft,
  withOhmsDescribeDraft,
  withOhmsExamDraft,
  withOhmsExplainDraft,
  withOhmsModelDraft,
  withOhmsTransferDraft,
  withOhmsWatchedDemo,
} from "@/lib/learning/ohms-scene-data";
import {
  evaluateOhmsExplanation,
  type OhmsExplainInput,
} from "@/lib/learning/ohms-explain";
import {
  buildOhmsExamAttempt,
  hasCompletedOhmsExam,
  nextOhmsExamDraft,
  type OhmsExamDraft,
  type OhmsExamInput,
} from "@/lib/learning/ohms-exam";
import {
  buildOhmsModelAttempt,
  type OhmsModelDraft,
} from "@/lib/learning/ohms-model";
import {
  activeOhmsTransferTargetId,
  buildOhmsTransferAttempt,
  emptyOhmsTransferDraft,
  type OhmsTransferInput,
} from "@/lib/learning/ohms-transfer";
import { nextOhmsHint } from "@/lib/learning/ohms-hint-ladder";
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
  OHMS_EXPERIMENT_A,
  OHMS_EXPERIMENT_B,
  ohmsPhysicsSnapshot,
  type OhmsExperimentId,
} from "@/lib/physics/simple-resistor-circuit";
import { wrapOhmsPhysicsState } from "@/lib/runtime/physics-state";
import {
  LearningStage,
  OHMS_SCENE_ID,
  type DescriptionEvidence,
  type ExperimentEvidence,
  type ExplanationEvidence,
  type LearningSession,
  type ObservationEvidence,
  type PredictionEvidence,
} from "@/types/learning";

export function useOhmsLearningSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    () => getSessionSnapshot(OHMS_SCENE_ID),
    getServerSessionSnapshot,
  );

  const startLesson = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.ENTRY) {
        return current;
      }
      return advanceWithinLoop(current);
    }, OHMS_SCENE_ID);
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
      updateSession((current) => advanceIfReady(current), OHMS_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.EXAM &&
      hasCompletedOhmsExam(session.examAttempts) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.AI_OFF,
      )
    ) {
      updateSession((current) => advanceIfReady(current), OHMS_SCENE_ID);
      return;
    }
    if (
      session.stage === LearningStage.AI_OFF &&
      hasCompletedOhmsAiOff(session) &&
      !session.events.some(
        (event) =>
          event.type === "stage_entered" && event.stage === LearningStage.COMPLETE,
      )
    ) {
      updateSession((current) => advanceIfReady(current), OHMS_SCENE_ID);
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
    }, OHMS_SCENE_ID);
  }, []);

  const markDemoWatched = useCallback(() => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      return {
        ...current,
        sceneData: withOhmsWatchedDemo(current.sceneData, true),
      };
    }, OHMS_SCENE_ID);
  }, []);

  const saveObservation = useCallback((selectedOptionIds: string[]) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.OBSERVE) {
        return current;
      }
      const evaluation = evaluateOhmsObservation(selectedOptionIds);
      const observation: ObservationEvidence = {
        text: ohmsObservationLabelsFor(selectedOptionIds),
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
    }, OHMS_SCENE_ID);
  }, []);

  const saveDescription = useCallback((input: OhmsDescribeInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.DESCRIBE) {
        return current;
      }
      const evaluation = evaluateOhmsDescription(input);
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
        sceneData: withOhmsDescribeDraft(current.sceneData, input),
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
    }, OHMS_SCENE_ID);
  }, []);

  const commitPrediction = useCallback(
    (experimentId: OhmsExperimentId, outcome: string, reason: string) => {
      updateSession((current) => {
        const allowed =
          current.stage === LearningStage.PREDICT ||
          current.stage === LearningStage.EXPERIMENT;
        if (!allowed) {
          return current;
        }
        if (
          experimentId === OHMS_EXPERIMENT_B &&
          (current.stage !== LearningStage.EXPERIMENT ||
            !hasClosedOhmsExperiment(current, OHMS_EXPERIMENT_A))
        ) {
          return current;
        }
        if (
          experimentId !== OHMS_EXPERIMENT_A &&
          current.stage !== LearningStage.EXPERIMENT
        ) {
          return current;
        }
        if (firstCommittedOhmsPrediction(current.predictions, experimentId)) {
          return current;
        }
        const evaluation = evaluateOhmsPrediction(outcome, reason);
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
        return experimentId === OHMS_EXPERIMENT_A ? advanceWithinLoop(next) : next;
      }, OHMS_SCENE_ID);
    },
    [],
  );

  const runExperiment = useCallback((experimentId: OhmsExperimentId) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPERIMENT) {
        return current;
      }
      if (!canRunOhmsExperiment(current, experimentId)) {
        return current;
      }
      if (
        activeIncompleteOhmsEvidence(current, experimentId) ||
        hasClosedOhmsExperiment(current, experimentId)
      ) {
        return current;
      }
      const prediction = firstCommittedOhmsPrediction(current.predictions, experimentId);
      if (!prediction) {
        return current;
      }
      const physics = runSceneOhmsExperiment(experimentId);
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
        intervention: { comparisonMode: physics.after.comparisonMode },
        observedResult: emptyOhmsObservedResult(),
        comparison: "",
        physicsResult: ohmsPhysicsSnapshot(physics.after),
        authoredBeforeIntervention: authoredBeforeIntervention(
          prediction.timestamp,
          interventionAt,
        ),
        sufficient: false,
      };
      return {
        ...current,
        physicsState: wrapOhmsPhysicsState(physics.after),
        experimentEvidence: [...current.experimentEvidence, evidence],
        events: [
          ...current.events,
          createLearningEvent("experiment_run", current.stage, {
            experimentId,
          }),
        ],
      };
    }, OHMS_SCENE_ID);
  }, []);

  const saveObservedResult = useCallback(
    (experimentId: OhmsExperimentId, observed: OhmsObservedResult) => {
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            observedResult: observed,
          })),
        OHMS_SCENE_ID,
      );
    },
    [],
  );

  const saveComparison = useCallback(
    (experimentId: OhmsExperimentId, comparison: "same" | "different" | "partial") => {
      if (!isOhmsComparison(comparison)) {
        return;
      }
      updateSession(
        (current) =>
          patchIncompleteEvidence(current, experimentId, (evidence) => ({
            ...evidence,
            comparison,
            predictionComparison: ohmsComparisonLabel(comparison),
          })),
        OHMS_SCENE_ID,
      );
    },
    [],
  );

  const saveReflection = useCallback(
    (experimentId: OhmsExperimentId, reflection: string) => {
      updateSession((current) => {
        const next = patchIncompleteEvidence(current, experimentId, (evidence) => {
          const updated = { ...evidence, reflection: reflection.trim() };
          return {
            ...updated,
            sufficient: isOhmsExperimentClosed({ ...updated, sufficient: false }),
          };
        });
        return advanceWithinLoop(next);
      }, OHMS_SCENE_ID);
    },
    [],
  );

  const saveExplanation = useCallback((input: OhmsExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      const evaluation = evaluateOhmsExplanation(input);
      const explanation: ExplanationEvidence = {
        text: input.studentExplanation.trim(),
        timestamp: new Date().toISOString(),
        ohmsAnswers: {
          quantitiesDistinct: input.quantitiesDistinct,
          sameR: input.sameR,
          sameU: input.sameU,
        },
        sufficient: evaluation.sufficient,
      };
      const next = {
        ...current,
        sceneData: withOhmsExplainDraft(current.sceneData, input),
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
    }, OHMS_SCENE_ID);
  }, []);

  const saveExplainDraft = useCallback((input: OhmsExplainInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXPLAIN) {
        return current;
      }
      return { ...current, sceneData: withOhmsExplainDraft(current.sceneData, input) };
    }, OHMS_SCENE_ID);
  }, []);

  const saveModelDraft = useCallback((draft: OhmsModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      return { ...current, sceneData: withOhmsModelDraft(current.sceneData, draft) };
    }, OHMS_SCENE_ID);
  }, []);

  const saveModelAttempt = useCallback((draft: OhmsModelDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.MODEL) {
        return current;
      }
      const attempt = buildOhmsModelAttempt({
        ...draft,
        timestamp: new Date().toISOString(),
      });
      const next = {
        ...current,
        sceneData: withOhmsModelDraft(current.sceneData, draft),
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
    }, OHMS_SCENE_ID);
  }, []);

  const saveTransferDraft = useCallback((draft: ReturnType<typeof emptyOhmsTransferDraft>) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      return { ...current, sceneData: withOhmsTransferDraft(current.sceneData, draft) };
    }, OHMS_SCENE_ID);
  }, []);

  const saveTransferAttempt = useCallback((input: OhmsTransferInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      const attempt = buildOhmsTransferAttempt(input);
      const nextAttempts = [...current.transferAttempts, attempt];
      const nextTarget = attempt.accepted
        ? activeOhmsTransferTargetId(nextAttempts)
        : input.targetId;
      const nextDraft = attempt.accepted
        ? emptyOhmsTransferDraft(nextTarget)
        : {
            ...emptyOhmsTransferDraft(input.targetId),
            judgments: input.judgments,
            surfaceCueSelected: input.surfaceCueSelected,
            studentExplanation: input.studentExplanation,
            conditionChecks: Object.fromEntries(
              (input.conditionChecks ?? []).map((id) => [id, id]),
            ),
          };
      const next = {
        ...current,
        transferAttempts: nextAttempts,
        sceneData: withOhmsTransferDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("transfer_attempted", current.stage, {
            targetId: attempt.targetId,
            accepted: attempt.accepted,
          }),
        ],
      };
      return attempt.accepted ? advanceWithinLoop(next) : next;
    }, OHMS_SCENE_ID);
  }, []);

  const saveExamDraft = useCallback((draft: OhmsExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return { ...current, sceneData: withOhmsExamDraft(current.sceneData, draft) };
    }, OHMS_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback((input: OhmsExamInput) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      const attempt = buildOhmsExamAttempt(input);
      const nextAttempts = [...current.examAttempts, attempt];
      const nextDraft = nextOhmsExamDraft(nextAttempts, ohmsExamDraft(current), input.patternId);
      const next = {
        ...current,
        examAttempts: nextAttempts,
        sceneData: withOhmsExamDraft(current.sceneData, nextDraft),
        events: [
          ...current.events,
          createLearningEvent("exam_answered", current.stage, {
            patternId: attempt.patternId,
            correct: attempt.correct,
          }),
        ],
      };
      return advanceWithinLoop(next);
    }, OHMS_SCENE_ID);
  }, []);

  const skipExamRetry = useCallback((draft: OhmsExamDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.EXAM) {
        return current;
      }
      return { ...current, sceneData: withOhmsExamDraft(current.sceneData, draft) };
    }, OHMS_SCENE_ID);
  }, []);

  const saveAiOffDraft = useCallback((draft: OhmsAiOffDraft) => {
    updateSession((current) => {
      if (current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return { ...current, sceneData: withOhmsAiOffDraft(current.sceneData, draft) };
    }, OHMS_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback(
    (input: {
      challengeId: string;
      selectedAnswer: string;
      studentReasoning: string;
      preCommitEvidenceIds?: string[];
      timestamp: string;
    }) => {
      updateSession((current) => {
        if (current.stage !== LearningStage.AI_OFF) {
          return current;
        }
        const llmUsed = ohmsTutorUsedDuringIndependent(current);
        const attempt = buildOhmsAiOffAttempt(input, [], llmUsed);
        const attempts = [
          ...(current.independentAssessment?.challengeAttempts ?? []),
          attempt,
        ];
        const assessment = buildOhmsAiOffAssessment(attempts, llmUsed);
        const previous = ohmsAiOffDraft(current);
        return {
          ...current,
          independentAssessment: assessment,
          sceneData: withOhmsAiOffDraft(current.sceneData, {
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
              kind: "ohms-ai-off-commit",
              challengeId: attempt.challengeId,
            }),
          ],
        };
      }, OHMS_SCENE_ID);
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
        const llmUsed = ohmsTutorUsedDuringIndependent(current);
        attempts[actualIndex] = applyOhmsAiOffPostCheck(
          original,
          input.postCheckIds,
          llmUsed,
        );
        const assessment = buildOhmsAiOffAssessment(attempts, llmUsed);
        const next = {
          ...current,
          independentAssessment: assessment,
          sceneData: withOhmsAiOffDraft(
            current.sceneData,
            nextOhmsAiOffDraft(assessment, ohmsAiOffDraft(current), input.challengeId),
          ),
          events: [
            ...current.events,
            createLearningEvent("student_response", current.stage, {
              kind: "ohms-ai-off-post-check",
              challengeId: input.challengeId,
              accepted: attempts[actualIndex]?.accepted,
            }),
          ],
        };
        return advanceWithinLoop(next);
      }, OHMS_SCENE_ID);
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
      const hint = nextOhmsHint(current.events, current.stage);
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
    }, OHMS_SCENE_ID);
  }, []);

  const startOver = useCallback(() => {
    resetStoredSession(OHMS_SCENE_ID);
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
  if (!target || !(OHMS_PHASE_STAGES as readonly LearningStage[]).includes(target)) {
    return session;
  }
  return advanceIfReady(session);
}

function patchIncompleteEvidence(
  session: LearningSession,
  experimentId: OhmsExperimentId,
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
