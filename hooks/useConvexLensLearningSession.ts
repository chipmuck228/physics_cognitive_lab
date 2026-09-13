"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { advanceIfReady } from "@/lib/learning/advance";
import {
  advanceLensLoop,
  applyLensAiOffCommit,
  applyLensAiOffPostCheckSave,
  applyLensComparisonSave,
  applyLensDescriptionSave,
  applyLensExamSubmit,
  applyLensExplanationSave,
  applyLensModelStationChoice,
  applyLensModelSubmit,
  applyLensObjectStationChange,
  applyLensObservationSave,
  applyLensObserveDemoCycle,
  applyLensObservedSave,
  applyLensAcknowledgeNextTrial,
  applyLensCoverLens,
  applyLensPredictionCommit,
  applyLensReflectionSave,
  applyLensScreenChange,
  applyLensTransferSubmit,
  type LensExperimentForm,
} from "@/lib/learning/lens-action";
import type { LensDomainOutcome } from "@/lib/learning/lens-action-response";
import {
  hasCompletedLensAiOff,
  type LensAiOffDraft,
} from "@/lib/learning/lens-ai-off";
import { type LensDescribeInput } from "@/lib/learning/lens-describe";
import { type LensObservedResult } from "@/lib/learning/lens-experiment";
import {
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
} from "@/lib/learning/lens-scene-data";
import { type LensExplainInput } from "@/lib/learning/lens-explain";
import {
  hasCompletedLensExam,
  type LensExamDraft,
  type LensExamInput,
} from "@/lib/learning/lens-exam";
import { type LensModelDraft } from "@/lib/learning/lens-model";
import { type LensTransferDraft } from "@/lib/learning/lens-transfer";
import {
  applyLensHelpIntent,
  applyLensHelpNext,
  availableLensHelpIntents,
  type LensHelpIntentId,
} from "@/lib/learning/lens-help-intents";
import {
  applyLensGoBack,
  applyLensReturnToProgress,
  canLensGoBack,
  isLensRevisiting,
} from "@/lib/learning/lens-revisit";
import { canLeaveStage } from "@/lib/learning/progression";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  resetStoredSession,
  subscribeSession,
  updateSession,
} from "@/lib/learning/session-store";
import { type LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";
import {
  CONVEX_LENS_SCENE_ID,
  LearningStage,
  type LearningSession,
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

  const markDemoWatched = useCallback(
    (): LensDomainOutcome => captureLensAction((current) => applyLensObserveDemoCycle(current)),
    [],
  );

  const setScreenAtImagePlane = useCallback(
    (atPlane: boolean): LensDomainOutcome =>
      captureLensAction((current) => applyLensScreenChange(current, atPlane)),
    [],
  );

  const setObjectStation = useCallback(
    (station: ObjectStation): LensDomainOutcome =>
      captureLensAction((current) => applyLensObjectStationChange(current, station)),
    [],
  );

  const chooseModelStation = useCallback(
    (draft: LensModelDraft, station: ObjectStation): LensDomainOutcome =>
      captureLensAction((current) => applyLensModelStationChoice(current, draft, station)),
    [],
  );

  const saveObservation = useCallback(
    (selectedOptionIds: string[]): LensDomainOutcome =>
      captureLensAction((current) => applyLensObservationSave(current, selectedOptionIds)),
    [],
  );

  const saveDescription = useCallback(
    (input: LensDescribeInput): LensDomainOutcome =>
      captureLensAction((current) => applyLensDescriptionSave(current, input)),
    [],
  );

  const commitPrediction = useCallback(
    (experimentId: LensExperimentId, outcome: string, reason: string): LensDomainOutcome =>
      captureLensAction((current) =>
        applyLensPredictionCommit(current, experimentId, outcome, reason),
      ),
    [],
  );

  const coverLens = useCallback((): LensDomainOutcome => {
    return captureLensAction((current) => applyLensCoverLens(current));
  }, []);

  const acknowledgeNextTrial = useCallback((): LensDomainOutcome => {
    return captureLensAction((current) => applyLensAcknowledgeNextTrial(current));
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

  const saveExplanation = useCallback(
    (input: LensExplainInput): LensDomainOutcome =>
      captureLensAction((current) => applyLensExplanationSave(current, input)),
    [],
  );

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

  const saveModelAttempt = useCallback(
    (draft: LensModelDraft): LensDomainOutcome =>
      captureLensAction((current) => applyLensModelSubmit(current, draft)),
    [],
  );

  const saveTransferDraft = useCallback((draft: LensTransferDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.TRANSFER) {
        return current;
      }
      return { ...current, sceneData: withLensTransferDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveTransferAttempt = useCallback(
    (draft: LensTransferDraft): LensDomainOutcome =>
      captureLensAction((current) => applyLensTransferSubmit(current, draft)),
    [],
  );

  const saveExamDraft = useCallback((draft: LensExamDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.EXAM) {
        return current;
      }
      return { ...current, sceneData: withLensExamDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveExamAttempt = useCallback(
    (input: LensExamInput): LensDomainOutcome =>
      captureLensAction((current) => applyLensExamSubmit(current, input)),
    [],
  );

  const saveAiOffDraft = useCallback((draft: LensAiOffDraft) => {
    updateSession((current) => {
      if (isLensRevisiting(current) || current.stage !== LearningStage.AI_OFF) {
        return current;
      }
      return { ...current, sceneData: withLensAiOffDraft(current.sceneData, draft) };
    }, CONVEX_LENS_SCENE_ID);
  }, []);

  const saveAiOffIndependentResponse = useCallback(
    (draft: LensAiOffDraft): LensDomainOutcome =>
      captureLensAction((current) => applyLensAiOffCommit(current, draft)),
    [],
  );

  const saveAiOffPostCheck = useCallback(
    (input: { challengeId: string; postCheckIds: string[] }): LensDomainOutcome =>
      captureLensAction((current) => applyLensAiOffPostCheckSave(current, input)),
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
    chooseModelStation,
    saveObserveDraft,
    saveObservation,
    saveDescription,
    saveDescribeDraft,
    savePredictDraft,
    commitPrediction,
    coverLens,
    acknowledgeNextTrial,
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
