"use client";

import { useEffect, useState } from "react";

import type { LensDomainOutcome } from "@/lib/learning/lens-action-response";
import { lensActionResponseView } from "@/lib/learning/lens-action-response";
import {
  lensComparisonEligibility,
  lensObservedEligibility,
  lensReflectionEligibility,
} from "@/lib/learning/lens-action";

import { Button } from "@/components/common/Button";
import { ConvexLensOpticalBench } from "@/components/physics/convex-lens/ConvexLensOpticalBench";
import { LearningShell } from "@/components/learning/LearningShell";
import { LensAiOffTask } from "@/components/learning/LensAiOffTask";
import { LensCognitiveTrace } from "@/components/learning/LensCognitiveTrace";
import { LensCompleteView } from "@/components/learning/LensCompleteView";
import { LensCurrentAction } from "@/components/learning/LensCurrentAction";
import { LensDescribeTask } from "@/components/learning/LensDescribeTask";
import { LensExamTask } from "@/components/learning/LensExamTask";
import { LensExperimentTask } from "@/components/learning/LensExperimentTask";
import { LensExplainTask } from "@/components/learning/LensExplainTask";
import { LensHelpPanel } from "@/components/learning/LensHelpPanel";
import { LearnerWorkspace } from "@/components/learning/LearnerWorkspace";
import { LensObserveTask } from "@/components/learning/LensObserveTask";
import { LensPredictTask } from "@/components/learning/LensPredictTask";
import { LensRayConstruction } from "@/components/learning/LensRayConstruction";
import { LensReviewBanner } from "@/components/learning/LensReviewBanner";
import { LensTaskFrame } from "@/components/learning/LensTaskFrame";
import { LensVocabRow } from "@/components/learning/LensTermTip";
import { LensTransferTask } from "@/components/learning/LensTransferTask";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import { useConvexLensLearningSession } from "@/hooks/useConvexLensLearningSession";
import {
  LENS_COPY,
  LENS_EXAM_COPY,
  LENS_FOOTER,
  LENS_PHASE_STAGES,
  LENS_STAGE_LABELS,
  LENS_STAGE_PROMPTS,
  LENS_TASK_FRAMES,
  lensExperimentTitle,
  lensPredictQuestion,
  lensReflectionPrompt,
} from "@/lib/content/convex-lens-optical-bench";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  currentLensAiOffChallengeId,
  isLensAiOffSessionOpen,
  lensAiOffPostCheckRepair,
  retryLensAiOffDraft,
  withLensAiOffReasoning,
} from "@/lib/learning/lens-ai-off";
import { lensAiOffCanAdvanceToPostCheck } from "@/lib/learning/lens-ai-off-semantic";
import { emptyLensDescribeInput } from "@/lib/learning/lens-describe";
import {
  lensDescribeNowDo,
  lensEntryNowDo,
  lensExperimentCurrentAction,
  lensExperimentMoment,
  lensExplainNowDo,
  lensObserveNowDo,
  lensPredictNowDo,
} from "@/lib/learning/lens-now-do";
import {
  currentLensExamPatternId,
  emptyLensExamDraft,
  isLensExamSessionOpen,
  lensExamPattern,
  summarizeLensExamAttempt,
} from "@/lib/learning/lens-exam";
import {
  activeIncompleteLensEvidence,
  activeLensExperimentId,
  asLensObservedResult,
  emptyLensObservedResult,
  firstClosedLensEvidence,
  hasCompleteLensObservedResult,
  isLensComparison,
} from "@/lib/learning/lens-experiment";
import { lensTrialSpec, nextLensTrialId } from "@/lib/learning/lens-trial-intervention";
import { emptyLensExplainInput } from "@/lib/learning/lens-explain";
import {
  lensFeedbackForFailureKind,
  lensTransferRepairFeedback,
  type LensFeedback,
} from "@/lib/learning/lens-feedback";
import { lensCognitiveTraceItems } from "@/lib/learning/lens-cognitive-trace";
import { lensInteractionTraces } from "@/lib/learning/lens-interaction-trace";
import {
  availableLensHelpIntents,
  lensHelpAllowed,
  lensHelpPrompts,
  lensHelpState,
} from "@/lib/learning/lens-help-intents";
import {
  formatLensReferenceAttr,
  lensVisibleInteractionContext,
} from "@/lib/learning/lens-interaction-context";
import {
  emptyLensModelDraft,
  lensModelMissingLabels,
  lensModelRepairStep,
  visibleLensStudentRays,
} from "@/lib/learning/lens-model";
import {
  resolveLensAiOffCheck,
  resolveLensStep6Check,
  resolveLensTransferCheck,
} from "@/lib/learning/lens-step6-parse-client";
import {
  isLensRevisiting,
  lensDisplayStage,
  lensPreviewPhysics,
  lensViewingStage,
} from "@/lib/learning/lens-revisit";
import { hasSufficientLensDescription } from "@/lib/learning/lens-describe";
import { hasSufficientLensExplanation } from "@/lib/learning/lens-explain";
import {
  evaluateLensObservationEligibility,
  hasSufficientLensObservation,
  lensObserveMissingMessage,
  lensPerformedObserveInteraction,
} from "@/lib/learning/lens-observe";
import {
  firstCommittedLensPrediction,
  lensPredictLabel,
  lensPredictReasonForCommit,
  lensPredictStanceFromReason,
  type LensPredictReasonStance,
} from "@/lib/learning/lens-predict";
import {
  LENS_EXAM_DRAFT_KEY,
  LENS_MODEL_DRAFT_KEY,
  LENS_TRANSFER_DRAFT_KEY,
  lensAiOffDraft,
  lensDescribeDraft,
  lensExamDraft,
  lensExperimentFormDraft,
  lensExplainDraft,
  lensModelDraft,
  lensObserveDraft,
  lensPredictDraft,
  lensTransferDraft,
  lensTrialGate,
} from "@/lib/learning/lens-scene-data";
import {
  activeLensTransferTargetId,
  emptyLensTransferDraft,
  hasCompletedLensTransfer,
  LENS_TRANSFER_REQUIRED_IDS,
  lensTransferModelLink,
  lensTransferProgress,
  lensTransferTarget,
  withLensTransferExplanation,
} from "@/lib/learning/lens-transfer";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_ORDER,
  isObjectStation,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import { getSessionSnapshot } from "@/lib/learning/session-store";
import { CONVEX_LENS_SCENE_ID, LearningStage, type ExamAttempt } from "@/types/learning";

export function ConvexLensOpticalBenchLab() {
  const {
    session,
    hydrated,
    startLesson,
    goBack,
    returnToProgress,
    selectHelpIntent,
    revealHelpNext,
    markDemoWatched,
    setScreenAtImagePlane,
    setObjectStation,
    chooseModelStation,
    coverLens,
    acknowledgeNextTrial,
    saveObserveDraft,
    saveObservation,
    saveDescription,
    saveDescribeDraft,
    savePredictDraft,
    commitPrediction,
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
  } = useConvexLensLearningSession();

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [observeNeedMore, setObserveNeedMore] = useState(false);
  const [observeNeedMoreMessage, setObserveNeedMoreMessage] = useState("");
  const [describe, setDescribe] = useState(emptyLensDescribeInput());
  const [describeNeedStructure, setDescribeNeedStructure] = useState(false);
  const [predictOutcome, setPredictOutcome] = useState("");
  const [predictReason, setPredictReason] = useState("");
  const [predictReasonStance, setPredictReasonStance] = useState<LensPredictReasonStance>("");
  const [predictNeedMore, setPredictNeedMore] = useState(false);
  const [predictNeedMoreMessage, setPredictNeedMoreMessage] = useState("");
  const [observed, setObserved] = useState(emptyLensObservedResult());
  const [comparison, setComparison] = useState<"" | "same" | "different" | "partial">("");
  const [reflection, setReflection] = useState("");
  const [observedNeedMore, setObservedNeedMore] = useState(false);
  const [reflectionNeedMore, setReflectionNeedMore] = useState(false);
  const [explain, setExplain] = useState(emptyLensExplainInput());
  const [explainNeedMore, setExplainNeedMore] = useState(false);
  const [modelDraft, setModelDraft] = useState(emptyLensModelDraft());
  const [step6Checking, setStep6Checking] = useState(false);
  const [step6CheckMessage, setStep6CheckMessage] = useState<string | null>(null);
  const [transferDraft, setTransferDraft] = useState(emptyLensTransferDraft());
  const [transferRepair, setTransferRepair] = useState<LensFeedback | null>(null);
  const [transferChecking, setTransferChecking] = useState(false);
  const [examDraft, setExamDraft] = useState(emptyLensExamDraft());
  const [examNeedSteps, setExamNeedSteps] = useState(false);
  const [aiOffDraft, setAiOffDraft] = useState(
    session ? lensAiOffDraft(session) : undefined,
  );
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
  const [aiOffRepair, setAiOffRepair] = useState<string | null>(null);
  const [aiOffChecking, setAiOffChecking] = useState(false);
  const [actionOutcome, setActionOutcome] = useState<LensDomainOutcome | null>(null);
  const [screenInspected, setScreenInspected] = useState(false);

  const hydrateKey = session
    ? [
        session.sessionId,
        session.stage,
        lensViewingStage(session) ?? "",
        session.observations.length,
        session.descriptions.length,
        session.predictions.length,
        session.experimentEvidence.length,
        session.explanations.length,
        session.modelAttempts.length,
        session.transferAttempts.length,
        session.examAttempts.length,
        session.independentAssessment?.challengeAttempts?.length ?? 0,
        (session.independentAssessment?.challengeAttempts ?? [])
          .map(
            (attempt) =>
              `${attempt.challengeId}:${attempt.accepted ? 1 : 0}:${(attempt.postCheckIds ?? []).join(",")}`,
          )
          .join("|"),
        lensPerformedObserveInteraction(session) ? "watched" : "unwatched",
      ].join("|")
    : "";

  useEffect(() => {
    if (!session) {
      return;
    }
    const latestObservation = session.observations.at(-1);
    const selectedIds =
      lensObserveDraft(session) ?? latestObservation?.selectedOptionIds ?? [];
    setSelectedOptionIds(selectedIds);
    const observeEligibility = evaluateLensObservationEligibility(
      selectedIds,
      lensPerformedObserveInteraction(session),
    );
    const observeMissing =
      session.stage === LearningStage.OBSERVE &&
      Boolean(latestObservation) &&
      !observeEligibility.sufficient;
    setObserveNeedMore(observeMissing);
    setObserveNeedMoreMessage(
      observeMissing ? lensObserveMissingMessage(observeEligibility.missingKind) : "",
    );
    const draft = lensDescribeDraft(session);
    const latestDescription = session.descriptions.at(-1);
    setDescribe(
      draft ?? {
        ...emptyLensDescribeInput(),
        studentDescription: latestDescription?.text ?? "",
      },
    );
    setDescribeNeedStructure(
      session.stage === LearningStage.DESCRIBE &&
        Boolean(latestDescription) &&
        !hasSufficientLensDescription(session.descriptions),
    );
    setExplain(lensExplainDraft(session));
    const latestExplanation = session.explanations.at(-1);
    setExplainNeedMore(
      session.stage === LearningStage.EXPLAIN &&
        Boolean(latestExplanation) &&
        !hasSufficientLensExplanation(session.explanations),
    );
    setModelDraft(
      session.sceneData[LENS_MODEL_DRAFT_KEY]
        ? lensModelDraft(session)
        : emptyLensModelDraft(),
    );
    const transfer = lensTransferDraft(session);
    const activeTarget = activeLensTransferTargetId(session.transferAttempts);
    const nextTransferDraft = session.sceneData[LENS_TRANSFER_DRAFT_KEY]
      ? { ...transfer, targetId: activeTarget }
      : emptyLensTransferDraft(activeTarget);
    setTransferDraft(nextTransferDraft);
    const latestTransfer = session.transferAttempts.at(-1);
    setTransferRepair(
      session.stage === LearningStage.TRANSFER &&
        latestTransfer &&
        latestTransfer.accepted !== true
        ? lensTransferRepairFeedback(nextTransferDraft)
        : null,
    );
    setExamDraft(
      session.sceneData[LENS_EXAM_DRAFT_KEY]
        ? lensExamDraft(session)
        : emptyLensExamDraft(),
    );
    const nextAiOffDraft = lensAiOffDraft(session);
    setAiOffDraft(nextAiOffDraft);
    const latestIndependent = [...(session.independentAssessment?.challengeAttempts ?? [])]
      .reverse()
      .find((attempt) => attempt.challengeId === nextAiOffDraft.currentChallengeId);
    const restoreRepair =
      session.stage === LearningStage.AI_OFF &&
      latestIndependent &&
      latestIndependent.accepted !== true &&
      (latestIndependent.postCheckIds?.length ?? 0) > 0
        ? lensAiOffPostCheckRepair(
            latestIndependent.challengeId,
            nextAiOffDraft.postCheckSelections.length > 0
              ? nextAiOffDraft.postCheckSelections
              : latestIndependent.postCheckIds,
            false,
            latestIndependent.reasoningSignals.preCommitRelation,
          )
        : null;
    setAiOffRepair(restoreRepair?.message ?? null);
    // Help and review-preview writes must not rehydrate drafts.
  }, [hydrateKey]);

  const experimentKey = session
    ? experimentKeyFor(lensDisplayStage(session), session)
    : "";

  useEffect(() => {
    if (!session || !experimentKey) {
      return;
    }
    const experimentId = activeExperimentId(session, lensDisplayStage(session));
    const prediction = experimentId
      ? firstCommittedLensPrediction(session.predictions, experimentId)
      : undefined;
    const evidence = experimentId
      ? activeIncompleteLensEvidence(session, experimentId) ??
        firstClosedLensEvidence(session, experimentId)
      : undefined;
    const predictDraft = experimentId ? lensPredictDraft(session) : null;
    const storedReason =
      predictDraft && predictDraft.experimentId === experimentId
        ? predictDraft.reason
        : (prediction?.reasoning ?? "");
    const storedStance = lensPredictStanceFromReason(storedReason);
    setPredictOutcome(
      predictDraft && predictDraft.experimentId === experimentId
        ? predictDraft.outcome
        : (prediction?.prediction ?? ""),
    );
    setPredictReasonStance(storedStance);
    setPredictReason(storedStance === "has-idea" ? storedReason : "");
    setPredictNeedMore(false);
    setPredictNeedMoreMessage("");
    const formDraft = experimentId ? lensExperimentFormDraft(session) : null;
    const useForm = Boolean(formDraft && formDraft.experimentId === experimentId);
    setObserved(
      useForm ? formDraft!.observed : asLensObservedResult(evidence?.observedResult),
    );
    setComparison(
      useForm
        ? formDraft!.comparison
        : evidence?.comparison === "same" ||
            evidence?.comparison === "different" ||
            evidence?.comparison === "partial"
          ? evidence.comparison
          : "",
    );
    setReflection(useForm ? formDraft!.reflection : (evidence?.reflection ?? ""));
    setObservedNeedMore(false);
    setReflectionNeedMore(false);
  }, [experimentKey, hydrateKey]);

  useEffect(() => {
    setActionOutcome(null);
    setScreenInspected(false);
  }, [experimentKey]);

  if (!hydrated || !session || !aiOffDraft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--ink-muted)]">
        {STUDENT_CHROME.preparing}
      </div>
    );
  }

  const displayStage = lensDisplayStage(session);
  const viewingStage = lensViewingStage(session);
  const revisiting = isLensRevisiting(session);
  const isEntry = displayStage === LearningStage.ENTRY;
  const isObserve = displayStage === LearningStage.OBSERVE;
  const isDescribe = displayStage === LearningStage.DESCRIBE;
  const isPredict = displayStage === LearningStage.PREDICT;
  const isExperiment = displayStage === LearningStage.EXPERIMENT;
  const isExplain = displayStage === LearningStage.EXPLAIN;
  const isModel = displayStage === LearningStage.MODEL;
  const isTransfer = displayStage === LearningStage.TRANSFER;
  const isExam = displayStage === LearningStage.EXAM;
  const isAiOff = displayStage === LearningStage.AI_OFF;
  const isComplete = displayStage === LearningStage.COMPLETE;
  const authoritativeAiOff = session.stage === LearningStage.AI_OFF;
  const observeComplete = hasSufficientLensObservation(session.observations);
  const describeComplete = hasSufficientLensDescription(session.descriptions);
  const explainComplete = hasSufficientLensExplanation(session.explanations);
  const transferComplete = hasCompletedLensTransfer(session.transferAttempts);
  const trialGate = lensTrialGate(session);
  const awaitingNextTrial = trialGate.awaitingNext && Boolean(trialGate.completedId);
  const activeExperiment = activeExperimentId(session, displayStage);
  const displayExperiment =
    awaitingNextTrial && trialGate.completedId
      ? trialGate.completedId
      : activeExperiment;
  const activeEvidence = displayExperiment
    ? activeIncompleteLensEvidence(session, displayExperiment) ??
      firstClosedLensEvidence(session, displayExperiment)
    : undefined;
  const committedPrediction = displayExperiment
    ? firstCommittedLensPrediction(session.predictions, displayExperiment)
    : undefined;
  const predictionLocked = Boolean(committedPrediction);
  const trial = displayExperiment ? lensTrialSpec(displayExperiment) : null;
  const hasRun = Boolean(activeEvidence?.interventionAt);
  const observedSaved = hasCompleteLensObservedResult(activeEvidence?.observedResult);
  const comparisonSaved = Boolean(
    activeEvidence?.comparison && isLensComparison(activeEvidence.comparison),
  );
  const reflectionSaved = Boolean(
    activeEvidence && activeEvidence.sufficient === true,
  );
  const reflectionGate = activeExperiment
    ? lensReflectionEligibility(session, activeExperiment)
    : { enabled: false, reason: LENS_COPY.reviewCannotEdit };
  const observedGate = activeExperiment
    ? lensObservedEligibility(session, activeExperiment)
    : { enabled: false, reason: LENS_COPY.reviewCannotEdit };
  const comparisonGate = activeExperiment
    ? lensComparisonEligibility(session, activeExperiment)
    : { enabled: false, reason: LENS_COPY.reviewCannotEdit };
  const actionView = actionOutcome ? lensActionResponseView(actionOutcome) : null;
  const presentAction = (outcome: LensDomainOutcome) => {
    setActionOutcome(outcome);
  };
  const observeInteracted = revisiting || lensPerformedObserveInteraction(session);
  const experimentMoment = displayExperiment
    ? lensExperimentMoment({
        predictionLocked,
        interventionDone: hasRun,
        observedSaved,
        comparisonSaved,
        reflectionSaved,
        awaitingNext: awaitingNextTrial,
        needsInspect: trial?.capability === "move-object",
        screenInspected,
      })
    : null;
  const currentAction = isEntry
    ? { nowDo: lensEntryNowDo() }
    : isObserve
      ? { nowDo: lensObserveNowDo(observeInteracted) }
      : isDescribe
        ? { nowDo: lensDescribeNowDo() }
        : isPredict
          ? { nowDo: lensPredictNowDo() }
          : isExperiment && displayExperiment && experimentMoment
            ? lensExperimentCurrentAction(displayExperiment, experimentMoment)
            : isExplain
              ? { nowDo: lensExplainNowDo() }
            : null;
  const vocabTerms = isEntry
    ? (["screen"] as const)
    : isObserve || isDescribe || isPredict || isExperiment
      ? (["F", "screen", "image"] as const)
      : [];
  const latestModel = session.modelAttempts.at(-1);
  const transferTarget = lensTransferTarget(transferDraft.targetId);
  const transferProgress = lensTransferProgress(session.transferAttempts);
  const examOpen = isLensExamSessionOpen(session.examAttempts, examDraft);
  const examPatternId =
    currentLensExamPatternId(session.examAttempts, examDraft) ?? examDraft.currentPatternId;
  const examPattern = lensExamPattern(examPatternId);
  const examQuestionIndex = Math.max(examDraft.patternIds.indexOf(examPatternId), 0);
  const latestExamAttempt = [...session.examAttempts]
    .reverse()
    .find((attempt) => (attempt.patternId ?? attempt.questionId) === examPatternId);
  const examCanRetry = Boolean(
    latestExamAttempt && latestExamAttempt.correct !== true && examOpen,
  );
  const aiOffOpen = isLensAiOffSessionOpen(session.independentAssessment, aiOffDraft);
  const aiOffChallengeId =
    currentLensAiOffChallengeId(session.independentAssessment, aiOffDraft) ??
    aiOffDraft.currentChallengeId;
  const aiOffQuestionIndex = Math.max(
    aiOffDraft.challengeIds.indexOf(aiOffChallengeId),
    0,
  );
  const latestAiOffAttempt =
    [...(session.independentAssessment?.challengeAttempts ?? [])]
      .reverse()
      .find((attempt) => attempt.challengeId === aiOffChallengeId) ?? null;
  const aiOffStep =
    aiOffDraft.step === "post-check" && latestAiOffAttempt ? "post-check" : "response";

  const physicsState = lensPreviewPhysics(session);
  const studentRays = isModel ? visibleLensStudentRays(modelDraft) : [];
  const modelDisplayState =
    isModel && isObjectStation(modelDraft.objectStation)
      ? { ...physicsState, objectStation: modelDraft.objectStation }
      : physicsState;
  const hideScene = isExam || isAiOff || isComplete || isTransfer;
  const scene = hideScene ? undefined : (
    <div className="w-full max-w-3xl space-y-3">
      <ConvexLensOpticalBench
        state={modelDisplayState}
        frozen={isModel}
        showOfficialImage={!isModel}
        hideOfficialRays
        studentRays={studentRays}
        allowStationSelect={
          (isObserve ||
            (isModel && modelDraft.constructionStep <= 1) ||
            (isExperiment &&
              predictionLocked &&
              !hasRun &&
              !awaitingNextTrial &&
              trial?.capability === "move-object")) &&
          !hideScene &&
          !revisiting
        }
        selectedStation={isModel ? modelDraft.objectStation : physicsState.objectStation}
        onSelectStation={(station) => {
          if (isModel) {
            const outcome = chooseModelStation(modelDraft, station);
            setModelDraft({ ...modelDraft, objectStation: station });
            presentAction(outcome);
            return;
          }
          presentAction(setObjectStation(station));
        }}
        caption={isModel ? LENS_COPY.modelFrozenCaption : undefined}
      />
    </div>
  );

  const predictTask = activeExperiment ? (
    <LensPredictTask
      question={lensPredictQuestion(activeExperiment)}
      outcome={predictOutcome}
      reasonStance={predictReasonStance}
      reason={predictReason}
      committedLabel={
        committedPrediction ? lensPredictLabel(committedPrediction.prediction) : null
      }
      locked={predictionLocked && (isExperiment || isPredict)}
      needMore={predictNeedMore}
      needMoreMessage={predictNeedMoreMessage}
      onOutcomeChange={(value) => {
        setPredictOutcome(value);
        if (activeExperiment) {
          savePredictDraft(
            activeExperiment,
            value,
            lensPredictReasonForCommit(predictReasonStance, predictReason),
          );
        }
      }}
      onReasonStanceChange={(value) => {
        setPredictReasonStance(value);
        if (value !== "has-idea") {
          setPredictReason("");
        }
        if (activeExperiment) {
          savePredictDraft(
            activeExperiment,
            predictOutcome,
            lensPredictReasonForCommit(value, predictReason),
          );
        }
      }}
      onReasonChange={(value) => {
        setPredictReason(value);
        if (activeExperiment) {
          savePredictDraft(
            activeExperiment,
            predictOutcome,
            lensPredictReasonForCommit(predictReasonStance, value),
          );
        }
      }}
      onCommit={() => {
        if (!predictOutcome) {
          setPredictNeedMore(true);
          setPredictNeedMoreMessage(LENS_COPY.predictNeedBoth);
          return;
        }
        if (!predictReasonStance) {
          setPredictNeedMore(true);
          setPredictNeedMoreMessage(LENS_COPY.predictNeedStance);
          return;
        }
        const reason = lensPredictReasonForCommit(predictReasonStance, predictReason);
        const outcome = commitPrediction(activeExperiment, predictOutcome, reason);
        presentAction(outcome);
        setPredictNeedMore(outcome.kind === "missing");
        setPredictNeedMoreMessage(
          outcome.kind === "missing" ? outcome.message ?? LENS_COPY.predictNeedBoth : "",
        );
      }}
    />
  ) : null;

  const task = isEntry ? (
    <div className="mx-auto max-w-md text-center lg:text-left">
      <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        {LENS_COPY.landingTitle}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{LENS_COPY.landingBody}</p>
    </div>
  ) : isObserve ? (
    <LensObserveTask
      selectedOptionIds={selectedOptionIds}
      onToggle={(optionId) => {
        const next = selectedOptionIds.includes(optionId)
          ? selectedOptionIds.filter((item) => item !== optionId)
          : [...selectedOptionIds, optionId];
        setSelectedOptionIds(next);
        saveObserveDraft(next);
      }}
      onPlayDemo={() => {
        presentAction(markDemoWatched());
      }}
      onMoveScreen={() => {
        presentAction(setScreenAtImagePlane(!physicsState.screenAtImagePlane));
      }}
      screenAtImagePlane={physicsState.screenAtImagePlane}
      onSubmit={() => {
        const outcome = saveObservation(selectedOptionIds);
        setObserveNeedMore(outcome.kind === "missing");
        setObserveNeedMoreMessage(outcome.kind === "missing" ? outcome.message ?? "" : "");
        presentAction(outcome);
      }}
      needMore={observeNeedMore}
      needMoreMessage={observeNeedMoreMessage}
      saved={observeComplete}
      reviewOnly={revisiting}
      canRecord={observeInteracted}
    />
  ) : isDescribe ? (
    <LensDescribeTask
      value={describe}
      onChange={(next) => {
        setDescribe(next);
        saveDescribeDraft(next);
      }}
      onSubmit={() => {
        const outcome = saveDescription(describe);
        setDescribeNeedStructure(outcome.kind === "missing");
        presentAction(outcome);
      }}
      needStructure={describeNeedStructure && !describeComplete}
      reviewOnly={revisiting}
    />
  ) : isPredict && activeExperiment ? (
    predictTask
  ) : isExperiment && displayExperiment && trial ? (
    <div className="space-y-6">
      {awaitingNextTrial ? null : !predictionLocked ? predictTask : null}
      {awaitingNextTrial || predictionLocked ? (
      <LensExperimentTask
        experimentId={displayExperiment}
        trialIndex={trial.index}
        title={lensExperimentTitle(displayExperiment)}
        instruction={trial.instruction}
        whatChanges={trial.whatChanges}
        whatStays={trial.whatStays}
        capability={trial.capability}
        committedPrediction={
          committedPrediction
            ? `${lensPredictLabel(committedPrediction.prediction)}。${committedPrediction.reasoning}`
            : null
        }
        predictionLocked={predictionLocked}
        interventionDone={hasRun}
        observedSaved={observedSaved}
        comparisonSaved={comparisonSaved}
        reflectionSaved={reflectionSaved}
        awaitingNext={awaitingNextTrial}
        nextTrialIndex={
          awaitingNextTrial ? (nextLensTrialId(displayExperiment) ? trial.index + 1 : null) : null
        }
        observed={observed}
        comparison={comparison}
        reflection={reflection}
        reflectionPrompt={lensReflectionPrompt(displayExperiment)}
        onCover={() => presentAction(coverLens())}
        onLookScreen={() => {
          setScreenInspected(true);
          presentAction(setScreenAtImagePlane(!physicsState.screenAtImagePlane));
        }}
        screenAtImagePlane={physicsState.screenAtImagePlane}
        screenInspected={screenInspected}
        hidePhysicalControls
        onStartNext={() => presentAction(acknowledgeNextTrial())}
        onObservedChange={(next) => {
          setObserved(next);
          saveExperimentFormDraft(displayExperiment, next, comparison, reflection);
        }}
        onSaveObserved={() => {
          const outcome = saveObservedResult(displayExperiment, observed);
          presentAction(outcome);
          setObservedNeedMore(outcome.kind === "missing");
        }}
        onComparisonChange={(value) => {
          const next = value as "" | "same" | "different" | "partial";
          setComparison(next);
          saveExperimentFormDraft(displayExperiment, observed, next, reflection);
        }}
        onSaveComparison={() => {
          presentAction(saveComparison(displayExperiment, comparison));
        }}
        onReflectionChange={(value) => {
          setReflection(value);
          saveExperimentFormDraft(displayExperiment, observed, comparison, value);
        }}
        onSaveReflection={() => {
          const outcome = saveReflection(displayExperiment, {
            observed,
            comparison,
            reflection,
          });
          presentAction(outcome);
          setReflectionNeedMore(outcome.kind === "missing");
        }}
        observedNeedMore={observedNeedMore}
        reflectionNeedMore={reflectionNeedMore}
        canSaveObserved={observedGate.enabled}
        canSaveComparison={comparisonGate.enabled}
        canSaveReflection={reflectionGate.enabled}
        observedDisabledReason={observedGate.reason}
        comparisonDisabledReason={comparisonGate.reason}
        reflectionDisabledReason={reflectionGate.reason}
        reviewOnly={revisiting}
      />
      ) : null}
    </div>
  ) : isExplain ? (
    <LensExplainTask
      value={explain}
      needMore={explainNeedMore && !explainComplete}
      onChange={(next) => {
        setExplain(next);
        saveExplainDraft(next);
      }}
      onSubmit={() => {
        const outcome = saveExplanation(explain);
        setExplainNeedMore(outcome.kind === "missing");
        presentAction(outcome);
      }}
      reviewOnly={revisiting}
    />
  ) : isModel ? (
    <LensRayConstruction
      draft={modelDraft}
      repairStep={
        latestModel && !latestModel.correctStructure
          ? lensModelRepairStep(latestModel.failureKinds?.[0], modelDraft)
          : null
      }
      feedback={
        latestModel && !latestModel.correctStructure
          ? lensFeedbackForFailureKind(
              latestModel.failureKinds?.[0],
              latestModel.failureKinds?.includes("missing-required-construction-pair")
                ? lensModelMissingLabels(modelDraft)
                : [],
            )
          : null
      }
      onChange={(next) => {
        if (next.studentReasoning !== modelDraft.studentReasoning) {
          setStep6CheckMessage(null);
        }
        setModelDraft(next);
        if (next.objectStation && next.objectStation !== modelDraft.objectStation) {
          presentAction(chooseModelStation(next, next.objectStation as ObjectStation));
          return;
        }
        saveModelDraft(next);
      }}
      onCheckStep6={async () => {
        if (step6Checking) {
          return;
        }
        setStep6Checking(true);
        const result = await resolveLensStep6Check(modelDraft);
        setModelDraft(result.draft);
        saveModelDraft(result.draft);
        setStep6Checking(false);
        if (result.check.status === "ready") {
          setStep6CheckMessage(null);
          const advanced = { ...result.draft, constructionStep: 7 };
          setModelDraft(advanced);
          saveModelDraft(advanced);
          presentAction({ kind: "committed", message: "已经记下你这句话在说什么。" });
          return;
        }
        setStep6CheckMessage(result.check.message ?? LENS_COPY.modelStep6Unclear);
        presentAction({
          kind: result.check.status === "inconsistent" ? "rejected" : "missing",
          message: result.check.message ?? LENS_COPY.modelStep6Unclear,
        });
      }}
      step6Checking={step6Checking}
      step6CheckMessage={step6CheckMessage}
      onSubmit={() => {
        presentAction(saveModelAttempt(modelDraft));
      }}
      reviewOnly={revisiting}
    />
  ) : isTransfer && transferTarget && (!transferComplete || revisiting) ? (
    <LensTransferTask
      key={transferDraft.targetId}
      target={transferTarget}
      draft={transferDraft}
      onChange={(next) => {
        const revised =
          next.studentExplanation !== transferDraft.studentExplanation
            ? withLensTransferExplanation(next, next.studentExplanation)
            : next;
        setTransferDraft(revised);
        saveTransferDraft(revised);
        setTransferRepair(null);
      }}
      onSubmit={() => {
        void (async () => {
          if (transferChecking) {
            return;
          }
          setTransferChecking(true);
          const resolved = await resolveLensTransferCheck(transferDraft);
          setTransferChecking(false);
          if (
            resolved.check.status !== "ready" &&
            resolved.check.message === LENS_COPY.transferUnclear
          ) {
            setTransferDraft(resolved.draft);
            saveTransferDraft(resolved.draft);
            setTransferRepair({
              kind: "missing",
              message: resolved.check.message,
            });
            presentAction({
              kind: "missing",
              message: resolved.check.message,
            });
            return;
          }
          const repair = lensTransferRepairFeedback(resolved.draft);
          const outcome = saveTransferAttempt(resolved.draft);
          if (outcome.kind === "committed") {
            const nextId = outcome.advanced
              ? LENS_TRANSFER_REQUIRED_IDS[0]
              : (LENS_TRANSFER_REQUIRED_IDS.find((id) => id !== resolved.draft.targetId) ??
                resolved.draft.targetId);
            setTransferDraft(emptyLensTransferDraft(nextId));
            setTransferRepair(null);
          } else {
            setTransferDraft(resolved.draft);
            setTransferRepair(repair);
          }
          presentAction(outcome);
        })();
      }}
      repairMessage={transferRepair?.message ?? null}
      repairKind={transferRepair?.kind === "missing" ? "missing" : "incorrect"}
      reviewOnly={revisiting}
      currentIndex={transferProgress.current}
      totalCount={transferProgress.total}
      firstComplete={transferProgress.firstComplete}
      modelLink={lensTransferModelLink(modelDraft)}
      checking={transferChecking}
    />
  ) : isExam && examPattern && (examOpen || revisiting) ? (
    <LensExamTask
      pattern={examPattern}
      questionIndex={examQuestionIndex}
      totalCount={examDraft.patternIds.length}
      step={examDraft.step}
      representation={examDraft.representation}
      modelRecognition={examDraft.modelRecognition}
      selectedAnswer={examDraft.selectedAnswer}
      reasoning={examDraft.reasoning}
      feedback={latestExamAttempt ? summarizeLensExamAttempt(latestExamAttempt) : null}
      needSteps={examNeedSteps}
      canRetry={examCanRetry}
      hints={[]}
      canRevealHint={false}
      onRepresentationChange={(value) => {
        const next = { ...examDraft, representation: value };
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onModelRecognitionChange={(value) => {
        const next = { ...examDraft, modelRecognition: value };
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onSelectedAnswerChange={(value) => {
        const next = { ...examDraft, selectedAnswer: value };
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onReasoningChange={(value) => {
        const next = { ...examDraft, reasoning: value };
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onContinueToModel={() => {
        if (!examDraft.representation) {
          setExamNeedSteps(true);
          presentAction({
            kind: "missing",
            message: "先判断物体处在哪个成像区域。",
          });
          return;
        }
        setExamNeedSteps(false);
        const next = { ...examDraft, step: "model" as const };
        setExamDraft(next);
        saveExamDraft(next);
        presentAction({ kind: "committed", message: "已经进入下一步。" });
      }}
      onRevealChoices={() => {
        if (!examDraft.modelRecognition) {
          setExamNeedSteps(true);
          presentAction({
            kind: "missing",
            message: "先选用这条题目里的成像关系。",
          });
          return;
        }
        setExamNeedSteps(false);
        const next = { ...examDraft, step: "answer" as const };
        setExamDraft(next);
        saveExamDraft(next);
        presentAction({ kind: "committed", message: "已经进入下一步。" });
      }}
      onSubmit={() => {
        const outcome = saveExamAttempt({
          patternId: examPatternId,
          representation: examDraft.representation,
          modelRecognition: examDraft.modelRecognition,
          selectedAnswer: examDraft.selectedAnswer,
          reasoning: examDraft.reasoning,
          timestamp: new Date().toISOString(),
        });
        setExamNeedSteps(outcome.kind === "missing");
        presentAction(outcome);
      }}
      onNext={() => {
        const next = retireLensExamDraft(session.examAttempts, examDraft);
        setExamDraft(next);
        saveExamDraft(next);
        presentAction({ kind: "committed", message: "已经进入下一题。" });
      }}
      onRevealHint={() => {
        presentAction({ kind: "blocked", message: "这一页没有提示。" });
      }}
    />
  ) : isAiOff && aiOffOpen ? (
    <LensAiOffTask
      key={aiOffChallengeId}
      draft={{ ...aiOffDraft, currentChallengeId: aiOffChallengeId }}
      questionIndex={aiOffQuestionIndex}
      totalCount={aiOffDraft.challengeIds.length}
      step={aiOffStep}
      committed={latestAiOffAttempt}
      needResponse={aiOffNeedResponse}
      checking={aiOffChecking}
      onChange={(next) => {
        const revised =
          next.reasoning !== aiOffDraft.reasoning
            ? withLensAiOffReasoning(next, next.reasoning)
            : next;
        setAiOffDraft(revised);
        saveAiOffDraft(revised);
        setAiOffRepair(null);
        setAiOffNeedResponse(false);
      }}
      onCommit={() => {
        void (async () => {
          if (aiOffChecking) {
            return;
          }
          setAiOffChecking(true);
          const resolved = await resolveLensAiOffCheck({
            ...aiOffDraft,
            currentChallengeId: aiOffChallengeId,
          });
          setAiOffChecking(false);
          setAiOffDraft(resolved.draft);
          saveAiOffDraft(resolved.draft);
          if (
            resolved.check.status !== "ready" &&
            !lensAiOffCanAdvanceToPostCheck(resolved.draft)
          ) {
            const message = resolved.check.message;
            setAiOffNeedResponse(resolved.check.status === "missing");
            setAiOffRepair(message);
            presentAction({
              kind: resolved.check.status === "missing" ? "missing" : "rejected",
              message,
            });
            return;
          }
          const outcome = saveAiOffIndependentResponse(resolved.draft);
          setAiOffNeedResponse(outcome.kind === "missing");
          setAiOffDraft(lensAiOffDraft(getSessionSnapshot(CONVEX_LENS_SCENE_ID)));
          setAiOffRepair(outcome.kind === "missing" ? outcome.message ?? null : null);
          presentAction(outcome);
        })();
      }}
      onSubmitPostCheck={() => {
        const outcome = saveAiOffPostCheck({
          challengeId: aiOffChallengeId,
          postCheckIds: aiOffDraft.postCheckSelections,
        });
        setAiOffDraft(lensAiOffDraft(getSessionSnapshot(CONVEX_LENS_SCENE_ID)));
        setAiOffRepair(
          outcome.kind === "missing" || outcome.kind === "rejected"
            ? outcome.message ?? null
            : null,
        );
        presentAction(outcome);
      }}
      repairMessage={aiOffRepair}
      onRetry={() => {
        if (!latestAiOffAttempt) {
          return;
        }
        const next = retryLensAiOffDraft(aiOffDraft, latestAiOffAttempt);
        setAiOffDraft(next);
        saveAiOffDraft(next);
        setAiOffRepair(null);
      }}
    />
  ) : isComplete ? (
    <LensCompleteView
      prediction={session.predictions.at(-1)?.reasoning?.trim() || "你写下了自己的猜测。"}
      experiment={
        session.experimentEvidence.at(-1)?.reflection?.trim() || "你对照了预测和结果。"
      }
      model={
        latestModel?.correctStructure
          ? "你用两条对应物距站点的光线，说明了会聚方式和像的后果。"
          : "你尝试建构了凸透镜成像关系。"
      }
      transfer={
        transferComplete
          ? "你把同一条会聚结构用到了投影仪和放大镜。"
          : "你尝试把刚才的关系用到新情境。"
      }
      independent={
        session.independentAssessment?.challengeAttempts?.length
          ? "你在没有提示时独立判断了新问题。"
          : "你完成了自己做的两题。"
      }
    />
  ) : null;

  const frame = LENS_TASK_FRAMES[displayStage];
  const interaction = lensVisibleInteractionContext(displayStage, {
    constructionStep: modelDraft.constructionStep,
    revisiting,
    modelDraft,
  });
  const helpIntents = availableLensHelpIntents(displayStage, {
    constructionStep: modelDraft.constructionStep,
    revisiting,
    interaction,
    modelDraft,
  });
  const help = lensHelpState(session, displayStage);
  const activeHelpIntent =
    help.intentId && helpIntents.includes(help.intentId) ? help.intentId : "";
  const showHelp =
    lensHelpAllowed(displayStage) &&
    !revisiting &&
    !authoritativeAiOff &&
    helpIntents.length > 0;
  const framedTask = (
    <div
      className="space-y-5"
      data-testid="lens-interaction-context"
      data-substep={interaction.substep ?? ""}
      data-capabilities={interaction.capabilities
        .filter((item) => item.available)
        .map((item) => item.id)
        .join(",")}
      data-references={formatLensReferenceAttr(interaction)}
      data-student-ray-count={String(studentRays.length)}
    >
      {revisiting && viewingStage ? (
        <LensReviewBanner
          viewingStage={viewingStage}
          authoritativeStage={session.stage}
          onReturn={() => {
            returnToProgress();
            presentAction({ kind: "preview-discarded" });
          }}
        />
      ) : null}
      {frame && !isEntry && !isAiOff && !isComplete ? (
        <LensTaskFrame
          context={frame.context}
          goal={frame.goal}
          focus={frame.focus}
          action={frame.action}
        />
      ) : null}
      {actionView &&
      !(
        (isTransfer || isAiOff) &&
        (actionView.className === "missing" || actionView.className === "rejected")
      ) ? (
        <div data-testid="lens-action-response" data-response-class={actionView.className}>
          <ValidationMessage kind={actionView.tone} testId="lens-action-response-message">
            {actionView.message}
          </ValidationMessage>
        </div>
      ) : null}
      {task}
      {showHelp ? (
        <LensHelpPanel
          intents={helpIntents}
          intentId={activeHelpIntent}
          interaction={interaction}
          prompts={
            activeHelpIntent
              ? lensHelpPrompts(activeHelpIntent, help.revealed, interaction)
              : []
          }
          onSelectIntent={selectHelpIntent}
          onRevealNext={revealHelpNext}
        />
      ) : null}
      {!isEntry && !isComplete ? (
        <LensCognitiveTrace
          items={lensCognitiveTraceItems(session)}
          processItems={lensInteractionTraces(session)}
          progressStage={session.stage}
          displayStage={displayStage}
        />
      ) : null}
    </div>
  );

  const useWorkspace = isEntry || isObserve || isDescribe || isPredict || isExperiment || isExplain;
  const showPredictLead =
    (isPredict || (isExperiment && !predictionLocked && !awaitingNextTrial)) && Boolean(activeExperiment);
  const workspaceLead = showPredictLead ? (
    <div>
      {isExperiment && currentAction && "kicker" in currentAction && currentAction.kicker ? (
        <p
          className="text-xs font-medium tracking-wide text-[var(--ink-muted)]"
          data-testid="lens-trial-progress"
        >
          {currentAction.kicker}
        </p>
      ) : null}
      <p className="text-xs font-medium tracking-wide text-[var(--heat)]">先预测</p>
      <h1
        className="mt-1 font-serif text-2xl leading-snug text-[var(--ink)] sm:text-3xl"
        data-testid="lens-now-do"
      >
        {lensPredictQuestion(activeExperiment!)}
      </h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]" data-testid="lens-predict-not-exam">
        {LENS_COPY.predictNotExam}
      </p>
    </div>
  ) : isEntry ? (
    <div>
      <h1
        className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl"
        data-testid="lens-now-do"
      >
        {LENS_COPY.landingTitle}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{LENS_COPY.landingBody}</p>
    </div>
  ) : currentAction ? (
    <LensCurrentAction
      kicker={"kicker" in currentAction ? currentAction.kicker : undefined}
      nowDo={currentAction.nowDo}
    />
  ) : null;

  const workspaceWorld = (
    <div className="space-y-4">
      {scene}
      {vocabTerms.length > 0 ? <LensVocabRow terms={vocabTerms} /> : null}
      {isObserve ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => presentAction(markDemoWatched())} data-testid="lens-play-demo">
            {LENS_COPY.playDemo}
          </Button>
          <Button
            variant="secondary"
            onClick={() => presentAction(setScreenAtImagePlane(!physicsState.screenAtImagePlane))}
            data-testid="lens-move-screen"
          >
            {physicsState.screenAtImagePlane ? LENS_COPY.screenOffImage : LENS_COPY.screenAtImage}
          </Button>
        </div>
      ) : null}
      {isExperiment && !revisiting && experimentMoment === "intervene" && trial?.capability === "cover-lens" ? (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => presentAction(coverLens())} data-testid="lens-cover-lens">
            {LENS_COPY.coverLens}
          </Button>
        </div>
      ) : null}
      {isExperiment &&
      !revisiting &&
      trial?.capability === "move-object" &&
      (experimentMoment === "inspect" || experimentMoment === "record") ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setScreenInspected(true);
              presentAction(setScreenAtImagePlane(!physicsState.screenAtImagePlane));
            }}
            data-testid="lens-experiment-look-screen"
          >
            {physicsState.screenAtImagePlane ? LENS_COPY.screenOffImage : LENS_COPY.screenAtImage}
          </Button>
        </div>
      ) : null}
    </div>
  );

  const workspaceTask = isEntry ? (
    <Button size="lg" onClick={startLesson} aria-label={LENS_COPY.startLesson}>
      {LENS_COPY.startLesson}
    </Button>
  ) : isObserve ? (
    <LensObserveTask
      selectedOptionIds={selectedOptionIds}
      onToggle={(optionId) => {
        const next = selectedOptionIds.includes(optionId)
          ? selectedOptionIds.filter((item) => item !== optionId)
          : [...selectedOptionIds, optionId];
        setSelectedOptionIds(next);
        saveObserveDraft(next);
      }}
      onPlayDemo={() => presentAction(markDemoWatched())}
      onMoveScreen={() => presentAction(setScreenAtImagePlane(!physicsState.screenAtImagePlane))}
      screenAtImagePlane={physicsState.screenAtImagePlane}
      onSubmit={() => {
        const outcome = saveObservation(selectedOptionIds);
        setObserveNeedMore(outcome.kind === "missing");
        setObserveNeedMoreMessage(outcome.kind === "missing" ? outcome.message ?? "" : "");
        presentAction(outcome);
      }}
      needMore={observeNeedMore}
      needMoreMessage={observeNeedMoreMessage}
      saved={observeComplete}
      reviewOnly={revisiting}
      canRecord={observeInteracted}
      showWorldControls={false}
    />
  ) : isDescribe ? (
    task
  ) : showPredictLead ? (
    <LensPredictTask
      question={lensPredictQuestion(activeExperiment!)}
      outcome={predictOutcome}
      reasonStance={predictReasonStance}
      reason={predictReason}
      committedLabel={
        committedPrediction ? lensPredictLabel(committedPrediction.prediction) : null
      }
      locked={predictionLocked && (isExperiment || isPredict)}
      needMore={predictNeedMore}
      needMoreMessage={predictNeedMoreMessage}
      hideLead
      onOutcomeChange={(value) => {
        setPredictOutcome(value);
        if (activeExperiment) {
          savePredictDraft(
            activeExperiment,
            value,
            lensPredictReasonForCommit(predictReasonStance, predictReason),
          );
        }
      }}
      onReasonStanceChange={(value) => {
        setPredictReasonStance(value);
        if (value !== "has-idea") {
          setPredictReason("");
        }
        if (activeExperiment) {
          savePredictDraft(
            activeExperiment,
            predictOutcome,
            lensPredictReasonForCommit(value, predictReason),
          );
        }
      }}
      onReasonChange={(value) => {
        setPredictReason(value);
        if (activeExperiment) {
          savePredictDraft(
            activeExperiment,
            predictOutcome,
            lensPredictReasonForCommit(predictReasonStance, value),
          );
        }
      }}
      onCommit={() => {
        if (!predictOutcome) {
          setPredictNeedMore(true);
          setPredictNeedMoreMessage(LENS_COPY.predictNeedBoth);
          return;
        }
        if (!predictReasonStance) {
          setPredictNeedMore(true);
          setPredictNeedMoreMessage(LENS_COPY.predictNeedStance);
          return;
        }
        const reason = lensPredictReasonForCommit(predictReasonStance, predictReason);
        const outcome = commitPrediction(activeExperiment!, predictOutcome, reason);
        presentAction(outcome);
        setPredictNeedMore(outcome.kind === "missing");
        setPredictNeedMoreMessage(
          outcome.kind === "missing" ? outcome.message ?? LENS_COPY.predictNeedBoth : "",
        );
      }}
    />
  ) : (
    task
  );

  const workspaceSupport = (
    <div className="space-y-4">
      {actionView &&
      !(
        (isTransfer || isAiOff) &&
        (actionView.className === "missing" || actionView.className === "rejected")
      ) ? (
        <div data-testid="lens-action-response" data-response-class={actionView.className}>
          <ValidationMessage kind={actionView.tone} testId="lens-action-response-message">
            {actionView.message}
          </ValidationMessage>
        </div>
      ) : null}
      {showHelp ? (
        <LensHelpPanel
          intents={helpIntents}
          intentId={activeHelpIntent}
          interaction={interaction}
          prompts={
            activeHelpIntent
              ? lensHelpPrompts(activeHelpIntent, help.revealed, interaction)
              : []
          }
          onSelectIntent={selectHelpIntent}
          onRevealNext={revealHelpNext}
        />
      ) : null}
      {!isEntry ? (
        <LensCognitiveTrace
          items={lensCognitiveTraceItems(session)}
          processItems={lensInteractionTraces(session)}
          progressStage={session.stage}
          displayStage={displayStage}
        />
      ) : null}
    </div>
  );

  // Scene 07 pilot: LLM TutorPanel is intentionally not rendered until it can
  // be bound to stage + substep + help intent + visible affordances.
  // LensHelpPanel is the only learner-facing help entry. useTutor remains
  // available for Scene 01–06 and is not deleted.

  return (
    <LearningShell
      stage={session.stage}
      stageLabels={LENS_STAGE_LABELS}
      stagePrompts={
        frame && !isAiOff && !isComplete
          ? {}
          : revisiting
            ? {}
            : LENS_STAGE_PROMPTS
      }
      progressStages={[...LENS_PHASE_STAGES]}
      scene={useWorkspace ? undefined : scene}
      task={useWorkspace ? undefined : framedTask}
      workspace={
        useWorkspace ? (
          <div
            data-testid="lens-interaction-context"
            data-substep={interaction.substep ?? ""}
            data-capabilities={interaction.capabilities
              .filter((item) => item.available)
              .map((item) => item.id)
              .join(",")}
            data-references={formatLensReferenceAttr(interaction)}
            data-student-ray-count={String(studentRays.length)}
          >
            {revisiting && viewingStage ? (
              <div className="mb-4">
                <LensReviewBanner
                  viewingStage={viewingStage}
                  authoritativeStage={session.stage}
                  onReturn={() => {
                    returnToProgress();
                    presentAction({ kind: "preview-discarded" });
                  }}
                />
              </div>
            ) : null}
            <LearnerWorkspace
              emphasis={isObserve || isExperiment ? "world" : "task"}
              lead={workspaceLead}
              world={workspaceWorld}
              task={workspaceTask}
              support={workspaceSupport}
            />
          </div>
        ) : undefined
      }
      tutor={null}
      examNotice={
        displayStage === LearningStage.EXAM && !revisiting
          ? LENS_EXAM_COPY.notice
          : undefined
      }
      actions={
        isEntry ? null : (
          <p className="text-sm text-[var(--ink-muted)]">{LENS_FOOTER[session.stage]}</p>
        )
      }
      onStartOver={startOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
    />
  );
}

function activeExperimentId(
  session: NonNullable<ReturnType<typeof useConvexLensLearningSession>["session"]>,
  displayStage: LearningStage,
): LensExperimentId | null {
  if (displayStage === LearningStage.PREDICT) {
    return LENS_EXPERIMENT_A;
  }
  if (displayStage === LearningStage.EXPERIMENT) {
    return (
      activeLensExperimentId(session) ??
      [...LENS_EXPERIMENT_ORDER]
        .reverse()
        .find((id) => firstClosedLensEvidence(session, id)) ??
      LENS_EXPERIMENT_A
    );
  }
  return null;
}

function experimentKeyFor(
  stage: LearningStage,
  session: NonNullable<ReturnType<typeof useConvexLensLearningSession>["session"]>,
): string {
  if (stage === LearningStage.PREDICT) {
    return LENS_EXPERIMENT_A;
  }
  if (stage === LearningStage.EXPERIMENT) {
    return activeExperimentId(session, stage) ?? "experiment-done";
  }
  return stage;
}

function retireLensExamDraft(
  attempts: ExamAttempt[],
  previous: ReturnType<typeof emptyLensExamDraft>,
) {
  const retired = new Set(previous.retiredPatternIds);
  retired.add(previous.currentPatternId);
  const nextId = currentLensExamPatternId(attempts, {
    ...previous,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });
  if (!nextId) {
    return {
      ...previous,
      retiredPatternIds: [...retired],
      step: "answer" as const,
    };
  }
  return {
    ...emptyLensExamDraft(previous.patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}
