"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { HeatAiOffTask } from "@/components/learning/HeatAiOffTask";
import { HeatCompleteView } from "@/components/learning/HeatCompleteView";
import { HeatDescribeTask } from "@/components/learning/HeatDescribeTask";
import { HeatExamTask } from "@/components/learning/HeatExamTask";
import { HeatExplainTask } from "@/components/learning/HeatExplainTask";
import { HeatExperimentTask } from "@/components/learning/HeatExperimentTask";
import { HeatObserveTask } from "@/components/learning/HeatObserveTask";
import { HeatPredictTask } from "@/components/learning/HeatPredictTask";
import { HeatProductBoard } from "@/components/learning/HeatProductBoard";
import { HeatTransferTask } from "@/components/learning/HeatTransferTask";
import { LearningShell } from "@/components/learning/LearningShell";
import { EqualMassHeatedSamples } from "@/components/physics/heat/EqualMassHeatedSamples";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { useHeatSamplesLearningSession } from "@/hooks/useHeatSamplesLearningSession";
import { useTutor } from "@/hooks/useTutor";
import {
  HEAT_COPY,
  HEAT_EXAM_COPY,
  HEAT_FOOTER,
  HEAT_PHASE_STAGES,
  HEAT_STAGE_LABELS,
  HEAT_STAGE_PROMPTS,
  heatExperimentTitle,
  heatPredictOutcomes,
  heatPredictQuestion,
  heatReflectionPrompt,
} from "@/lib/content/equal-mass-heated-samples";
import {
  emptyHeatDescribeInput,
  hasSufficientHeatDescription,
  type HeatDescribeInput,
} from "@/lib/learning/heat-describe";
import {
  emptyHeatExplainInput,
  hasSufficientHeatExplanation,
  type HeatExplainInput,
} from "@/lib/learning/heat-explain";
import {
  activeHeatExperimentId,
  activeIncompleteHeatEvidence,
  asHeatObservedResult,
  canRunHeatExperiment,
  emptyHeatObservedResult,
  firstClosedHeatEvidence,
  hasCompleteHeatObservedResult,
  heatClosedExperimentReflection,
  type HeatObservedResult,
} from "@/lib/learning/heat-experiment";
import {
  canCommitHeatAiOffResponse,
  currentHeatAiOffChallengeId,
  emptyHeatAiOffDraft,
  heatAiOffAttemptsFor,
  isHeatAiOffSessionOpen,
  retryHeatAiOffDraft,
  type HeatAiOffDraft,
} from "@/lib/learning/heat-ai-off";
import {
  buildHeatExamAttempt,
  currentHeatExamPatternId,
  emptyHeatExamDraft,
  heatExamPattern,
  isHeatExamSessionOpen,
  nextHeatExamDraft,
  summarizeHeatExamAttempt,
  type HeatExamDraft,
} from "@/lib/learning/heat-exam";
import {
  emptyHeatModelDraft,
  hasCompletedHeatModel,
  heatModelDraftFromAttempt,
  summarizeHeatModelAttempt,
  type HeatModelDraft,
} from "@/lib/learning/heat-model";
import { hasSufficientHeatObservation } from "@/lib/learning/heat-observe";
import {
  firstCommittedHeatPrediction,
  heatPredictLabel,
} from "@/lib/learning/heat-predict";
import { nextHeatHint, revealedHeatHints } from "@/lib/learning/heat-hint-ladder";
import {
  HEAT_AI_OFF_DRAFT_KEY,
  HEAT_EXAM_DRAFT_KEY,
  HEAT_MODEL_DRAFT_KEY,
  HEAT_TRANSFER_DRAFT_KEY,
  heatAiOffDraft,
  heatDescribeDraft,
  heatExamDraft,
  heatExplainDraft,
  heatModelDraft,
  heatTransferDraft,
} from "@/lib/learning/heat-scene-data";
import {
  activeHeatTransferTargetId,
  conditionCheckIdsFromRecord,
  emptyHeatTransferDraft,
  hasCompletedHeatTransfer,
  heatTransferDraftFromAttempt,
  heatTransferTarget,
  summarizeHeatTransferAttempt,
  type HeatTransferDraft,
  type HeatTransferJudgment,
} from "@/lib/learning/heat-transfer";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
  createInitialHeatState,
  isHeatSamplesSceneState,
  runHeatObserveDemo,
  type HeatExperimentId,
} from "@/lib/physics/equal-mass-heated-samples";
import { LearningStage, type ExamAttempt } from "@/types/learning";
import { TransferMode } from "@/types/physics-model";

export function EqualMassHeatedSamplesLab() {
  const {
    session,
    hydrated,
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
  } = useHeatSamplesLearningSession();
  const tutor = useTutor(session);

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [observeNeedMore, setObserveNeedMore] = useState(false);
  const [describe, setDescribe] = useState<HeatDescribeInput>(emptyHeatDescribeInput());
  const [describeNeedStructure, setDescribeNeedStructure] = useState(false);
  const [predictOutcome, setPredictOutcome] = useState("");
  const [predictReason, setPredictReason] = useState("");
  const [predictNeedMore, setPredictNeedMore] = useState(false);
  const [observed, setObserved] = useState<HeatObservedResult>(emptyHeatObservedResult());
  const [comparison, setComparison] = useState<"" | "same" | "different" | "partial">("");
  const [reflection, setReflection] = useState("");
  const [explain, setExplain] = useState<HeatExplainInput>(emptyHeatExplainInput());
  const [explainNeedMore, setExplainNeedMore] = useState(false);
  const [modelDraft, setModelDraft] = useState<HeatModelDraft>(emptyHeatModelDraft());
  const [modelNeedStructure, setModelNeedStructure] = useState(false);
  const [transferDraft, setTransferDraft] = useState<HeatTransferDraft>(
    emptyHeatTransferDraft(),
  );
  const [transferNeedMore, setTransferNeedMore] = useState(false);
  const [examDraft, setExamDraft] = useState<HeatExamDraft>(emptyHeatExamDraft);
  const [examNeedSteps, setExamNeedSteps] = useState(false);
  const [aiOffDraft, setAiOffDraft] = useState<HeatAiOffDraft>(emptyHeatAiOffDraft);
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
  const [aiOffNeedPostCheck, setAiOffNeedPostCheck] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [formKey, setFormKey] = useState("");

  const demoFrames = useMemo(() => runHeatObserveDemo(), []);
  const demoState = demoFrames[demoIndex] ?? demoFrames[0] ?? createInitialHeatState();

  useEffect(() => {
    if (!demoPlaying) {
      return;
    }
    if (demoIndex >= demoFrames.length - 1) {
      setDemoPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setDemoIndex((current) => Math.min(current + 1, demoFrames.length - 1));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [demoPlaying, demoIndex, demoFrames.length]);

  useEffect(() => {
    if (!session) {
      return;
    }
    const latestObservation = session.observations.at(-1);
    setSelectedOptionIds(latestObservation?.selectedOptionIds ?? []);
    setObserveNeedMore(
      session.stage === LearningStage.OBSERVE &&
        Boolean(latestObservation) &&
        !hasSufficientHeatObservation(session.observations),
    );

    const draft = heatDescribeDraft(session) ?? emptyHeatDescribeInput();
    const latestDescription = session.descriptions.at(-1);
    setDescribe({
      ...draft,
      studentDescription: latestDescription?.text ?? draft.studentDescription,
    });
    setDescribeNeedStructure(
      session.stage === LearningStage.DESCRIBE &&
        Boolean(latestDescription) &&
        !hasSufficientHeatDescription(session.descriptions),
    );

    setExplain(heatExplainDraft(session));
    const latestExplanation = session.explanations.at(-1);
    setExplainNeedMore(
      session.stage === LearningStage.EXPLAIN &&
        Boolean(latestExplanation) &&
        !hasSufficientHeatExplanation(session.explanations),
    );

    const latestModel = session.modelAttempts.at(-1);
    setModelDraft(
      session.sceneData[HEAT_MODEL_DRAFT_KEY]
        ? heatModelDraft(session)
        : latestModel
          ? heatModelDraftFromAttempt(latestModel)
          : emptyHeatModelDraft(),
    );
    setModelNeedStructure(
      session.stage === LearningStage.MODEL &&
        Boolean(latestModel) &&
        !hasCompletedHeatModel(session.modelAttempts),
    );

    const transfer = heatTransferDraft(session);
    const activeTarget = activeHeatTransferTargetId(
      session.transferAttempts,
      transfer.targetId,
    );
    const latestTransfer = [...session.transferAttempts]
      .reverse()
      .find((attempt) => (attempt.targetId ?? attempt.scenarioId) === activeTarget);
    setTransferDraft(
      session.sceneData[HEAT_TRANSFER_DRAFT_KEY]
        ? { ...transfer, targetId: activeTarget }
        : latestTransfer && latestTransfer.accepted !== true
          ? heatTransferDraftFromAttempt(latestTransfer)
          : emptyHeatTransferDraft(activeTarget),
    );
    setTransferNeedMore(
      session.stage === LearningStage.TRANSFER &&
        Boolean(latestTransfer) &&
        latestTransfer?.accepted !== true,
    );

    setExamDraft(
      session.sceneData[HEAT_EXAM_DRAFT_KEY]
        ? heatExamDraft(session)
        : emptyHeatExamDraft(),
    );
    setAiOffDraft(
      session.sceneData[HEAT_AI_OFF_DRAFT_KEY]
        ? heatAiOffDraft(session)
        : emptyHeatAiOffDraft(),
    );
  }, [session]);

  const experimentKey = session ? experimentKeyFor(session.stage, session) : "";
  if (session && experimentKey !== formKey) {
    setFormKey(experimentKey);
    const experimentId = activeExperimentId(session);
    const prediction = experimentId
      ? firstCommittedHeatPrediction(session.predictions, experimentId)
      : undefined;
    const evidence = experimentId
      ? activeIncompleteHeatEvidence(session, experimentId) ??
        firstClosedHeatEvidence(session, experimentId)
      : undefined;
    setPredictOutcome(prediction?.prediction ?? "");
    setPredictReason(prediction?.reasoning ?? "");
    setPredictNeedMore(false);
    setObserved(asHeatObservedResult(evidence?.observedResult));
    setComparison(
      evidence?.comparison === "same" ||
        evidence?.comparison === "different" ||
        evidence?.comparison === "partial"
        ? evidence.comparison
        : "",
    );
    setReflection(evidence?.reflection ?? "");
  }

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--ink-muted)]">
        {STUDENT_CHROME.preparing}
      </div>
    );
  }

  const isEntry = session.stage === LearningStage.ENTRY;
  const isObserve = session.stage === LearningStage.OBSERVE;
  const isDescribe = session.stage === LearningStage.DESCRIBE;
  const isPredict = session.stage === LearningStage.PREDICT;
  const isExperiment = session.stage === LearningStage.EXPERIMENT;
  const isExplain = session.stage === LearningStage.EXPLAIN;
  const isModel = session.stage === LearningStage.MODEL;
  const isTransfer = session.stage === LearningStage.TRANSFER;
  const isExam = session.stage === LearningStage.EXAM;
  const isAiOff = session.stage === LearningStage.AI_OFF;
  const isComplete = session.stage === LearningStage.COMPLETE;
  const observeComplete = hasSufficientHeatObservation(session.observations);
  const describeComplete = hasSufficientHeatDescription(session.descriptions);
  const explainComplete = hasSufficientHeatExplanation(session.explanations);
  const modelComplete = hasCompletedHeatModel(session.modelAttempts);
  const transferComplete = hasCompletedHeatTransfer(session.transferAttempts);
  const activeExperiment = activeExperimentId(session);
  const activeEvidence = activeExperiment
    ? activeIncompleteHeatEvidence(session, activeExperiment) ??
      firstClosedHeatEvidence(session, activeExperiment)
    : undefined;
  const committedPrediction = activeExperiment
    ? firstCommittedHeatPrediction(session.predictions, activeExperiment)
    : undefined;
  const predictionLocked = Boolean(
    committedPrediction && activeEvidence?.interventionAt,
  );
  const canRun = Boolean(
    activeExperiment && canRunHeatExperiment(session, activeExperiment),
  );
  const hasRun = Boolean(activeEvidence?.interventionAt);
  const observedSaved = Boolean(
    activeExperiment && hasCompleteHeatObservedResult(activeEvidence?.observedResult),
  );
  const comparisonSaved = Boolean(
    activeEvidence?.comparison === "same" ||
      activeEvidence?.comparison === "different" ||
      activeEvidence?.comparison === "partial",
  );
  const evidenceA = heatClosedExperimentReflection(session, HEAT_EXPERIMENT_A);
  const evidenceB = heatClosedExperimentReflection(session, HEAT_EXPERIMENT_B);
  const evidenceC = heatClosedExperimentReflection(session, HEAT_EXPERIMENT_C);
  const hints = revealedHeatHints(session.events, session.stage);
  const canRevealHint = Boolean(nextHeatHint(session.events, session.stage));
  const latestModel = session.modelAttempts.at(-1);
  const latestTransfer = session.transferAttempts.at(-1);
  const transferTarget = heatTransferTarget(transferDraft.targetId);
  const examOpen = isHeatExamSessionOpen(session.examAttempts, examDraft);
  const examPatternId =
    currentHeatExamPatternId(session.examAttempts, examDraft) ??
    examDraft.currentPatternId;
  const examPattern = heatExamPattern(examPatternId);
  const examQuestionIndex = Math.max(examDraft.patternIds.indexOf(examPatternId), 0);
  const latestExamAttempt = [...session.examAttempts]
    .reverse()
    .find((attempt) => (attempt.patternId ?? attempt.questionId) === examPatternId);
  const examCanRetry = Boolean(
    latestExamAttempt && latestExamAttempt.correct !== true && examOpen,
  );
  const aiOffOpen = isHeatAiOffSessionOpen(session.independentAssessment, aiOffDraft);
  const aiOffChallengeId =
    currentHeatAiOffChallengeId(session.independentAssessment, aiOffDraft) ??
    aiOffDraft.currentChallengeId;
  const aiOffQuestionIndex = Math.max(
    aiOffDraft.challengeIds.indexOf(aiOffChallengeId),
    0,
  );
  const latestAiOffAttempt =
    heatAiOffAttemptsFor(session.independentAssessment, aiOffChallengeId).at(-1) ??
    null;
  const aiOffStep =
    aiOffDraft.step === "post-check" && latestAiOffAttempt
      ? "post-check"
      : aiOffDraft.step;

  const heatState = isObserve
    ? demoState
    : isHeatSamplesSceneState(session.physicsState.state)
      ? session.physicsState.state
      : createInitialHeatState();

  const scene =
    isExam || isAiOff || isComplete ? undefined : (
      <div className="w-full max-w-xl space-y-3">
        <EqualMassHeatedSamples state={heatState} />
      </div>
    );

  const predictTask = activeExperiment ? (
    <HeatPredictTask
      question={heatPredictQuestion(activeExperiment)}
      outcomes={heatPredictOutcomes(activeExperiment)}
      outcome={predictOutcome}
      reason={predictReason}
      committedLabel={
        committedPrediction ? heatPredictLabel(committedPrediction.prediction) : null
      }
      locked={predictionLocked}
      needMore={predictNeedMore}
      onOutcomeChange={setPredictOutcome}
      onReasonChange={setPredictReason}
      onCommit={() => {
        commitPrediction(activeExperiment, predictOutcome, predictReason);
        if (!predictOutcome || predictReason.trim().length < 2) {
          setPredictNeedMore(true);
        }
      }}
    />
  ) : null;

  const task = isEntry ? (
    <div className="mx-auto max-w-md text-center lg:text-left">
      <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        {HEAT_COPY.headline}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{HEAT_COPY.subheadline}</p>
    </div>
  ) : isObserve ? (
    <HeatObserveTask
      selectedOptionIds={selectedOptionIds}
      onToggle={(optionId) => {
        setSelectedOptionIds((current) =>
          current.includes(optionId)
            ? current.filter((item) => item !== optionId)
            : [...current, optionId],
        );
      }}
      onPlayDemo={() => {
        markDemoWatched();
        if (demoPlaying) {
          setDemoPlaying(false);
          return;
        }
        setDemoIndex(0);
        setDemoPlaying(true);
      }}
      onSubmit={() => {
        saveObservation(selectedOptionIds);
      }}
      needMore={observeNeedMore}
      saved={observeComplete}
      demoPlaying={demoPlaying}
    />
  ) : isDescribe ? (
    <HeatDescribeTask
      value={describe}
      onChange={setDescribe}
      onSubmit={() => saveDescription(describe)}
      needStructure={describeNeedStructure && !describeComplete}
    />
  ) : isPredict && activeExperiment ? (
    predictTask
  ) : isExperiment && activeExperiment ? (
    <div className="space-y-6">
      {predictTask}
      <HeatExperimentTask
        experimentId={activeExperiment}
        title={heatExperimentTitle(activeExperiment)}
        canRun={canRun}
        hasRun={hasRun}
        observed={observed}
        comparison={comparison}
        reflection={reflection}
        reflectionPrompt={heatReflectionPrompt(activeExperiment)}
        onRun={() => runExperiment(activeExperiment)}
        onObservedChange={setObserved}
        onSaveObserved={() => saveObservedResult(activeExperiment, observed)}
        onComparisonChange={setComparison}
        onSaveComparison={() => {
          if (comparison) {
            saveComparison(activeExperiment, comparison);
          }
        }}
        onReflectionChange={setReflection}
        onSaveReflection={() => saveReflection(activeExperiment, reflection)}
        observedSaved={observedSaved}
        comparisonSaved={comparisonSaved}
      />
    </div>
  ) : isExplain ? (
    <HeatExplainTask
      value={explain}
      needMore={explainNeedMore && !explainComplete}
      evidence={{
        experimentA: evidenceA ?? "",
        experimentB: evidenceB ?? "",
        experimentC: evidenceC ?? "",
      }}
      hints={hints}
      canRevealHint={canRevealHint}
      onChange={(next) => {
        setExplain(next);
        saveExplainDraft(next);
      }}
      onSubmit={() => saveExplanation(explain)}
      onRevealHint={revealHint}
    />
  ) : isModel ? (
    <HeatProductBoard
      draft={modelDraft}
      feedback={
        latestModel && !latestModel.correctStructure
          ? summarizeHeatModelAttempt(latestModel)
          : null
      }
      needStructure={modelNeedStructure && !modelComplete}
      evidence={{
        experimentA: evidenceA ?? "",
        experimentB: evidenceB ?? "",
        experimentC: evidenceC ?? "",
      }}
      hints={hints}
      canRevealHint={canRevealHint}
      onChange={(next) => {
        setModelDraft(next);
        saveModelDraft(next);
      }}
      onToggleCondition={(value) => {
        const conditions = modelDraft.conditions.includes(value)
          ? modelDraft.conditions.filter((item) => item !== value)
          : [...modelDraft.conditions, value];
        const updated = { ...modelDraft, conditions };
        setModelDraft(updated);
        saveModelDraft(updated);
      }}
      onSubmit={() => saveModelAttempt(modelDraft)}
      onRevealHint={revealHint}
    />
  ) : isTransfer && !transferComplete && transferTarget ? (
    <HeatTransferTask
      targetId={transferDraft.targetId}
      scenario={transferTarget.scenario}
      transferMode={
        transferTarget.transferMode === TransferMode.BOUNDARY_CONTRAST
          ? TransferMode.BOUNDARY_CONTRAST
          : TransferMode.FULL_MODEL
      }
      judgments={transferDraft.judgments}
      surfaceCueSelected={transferDraft.surfaceCueSelected}
      studentExplanation={transferDraft.studentExplanation}
      conditionChecks={transferDraft.conditionChecks}
      feedback={
        latestTransfer && latestTransfer.accepted !== true
          ? summarizeHeatTransferAttempt(latestTransfer)
          : null
      }
      needMore={transferNeedMore}
      hints={hints}
      canRevealHint={canRevealHint}
      onJudgmentChange={(relationId, judgment: HeatTransferJudgment) => {
        const updated = {
          ...transferDraft,
          judgments: { ...transferDraft.judgments, [relationId]: judgment },
        };
        setTransferDraft(updated);
        saveTransferDraft(updated);
      }}
      onSurfaceCueChange={(selected) => {
        const updated = { ...transferDraft, surfaceCueSelected: selected };
        setTransferDraft(updated);
        saveTransferDraft(updated);
      }}
      onConditionCheckChange={(probeId, value) => {
        const updated = {
          ...transferDraft,
          conditionChecks: { ...transferDraft.conditionChecks, [probeId]: value },
        };
        setTransferDraft(updated);
        saveTransferDraft(updated);
      }}
      onExplanationChange={(studentExplanation) => {
        const updated = { ...transferDraft, studentExplanation };
        setTransferDraft(updated);
        saveTransferDraft(updated);
      }}
      onSubmit={() =>
        saveTransferAttempt({
          targetId: transferDraft.targetId,
          judgments: transferDraft.judgments,
          surfaceCueSelected: transferDraft.surfaceCueSelected,
          studentExplanation: transferDraft.studentExplanation,
          conditionChecks: conditionCheckIdsFromRecord(transferDraft.conditionChecks),
          timestamp: new Date().toISOString(),
        })
      }
      onRevealHint={revealHint}
    />
  ) : isExam && examOpen && examPattern ? (
    <HeatExamTask
      pattern={examPattern}
      questionIndex={examQuestionIndex}
      totalCount={examDraft.patternIds.length}
      step={examDraft.step}
      representation={examDraft.representation}
      modelRecognition={examDraft.modelRecognition}
      selectedAnswer={examDraft.selectedAnswer}
      reasoning={examDraft.reasoning}
      feedback={
        latestExamAttempt ? summarizeHeatExamAttempt(latestExamAttempt) : null
      }
      needSteps={examNeedSteps}
      canRetry={examCanRetry}
      hints={isExam ? hints : []}
      canRevealHint={isExam && canRevealHint}
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
        const next = { ...examDraft, step: "model" as const };
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onRevealChoices={() => {
        const next = { ...examDraft, step: "answer" as const };
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onSubmit={() => {
        const input = {
          patternId: examPatternId,
          representation: examDraft.representation,
          modelRecognition: examDraft.modelRecognition,
          selectedAnswer: examDraft.selectedAnswer,
          reasoning: examDraft.reasoning,
          timestamp: new Date().toISOString(),
        };
        if (
          !examDraft.representation ||
          !examDraft.modelRecognition ||
          !examDraft.selectedAnswer ||
          !examDraft.reasoning.trim()
        ) {
          setExamNeedSteps(true);
          return;
        }
        setExamNeedSteps(false);
        saveExamAttempt(input);
        setExamDraft(
          nextHeatExamDraft(
            [...session.examAttempts, buildHeatExamAttempt(input)],
            examDraft,
            examPatternId,
          ),
        );
      }}
      onNext={() => {
        const next = retireHeatExamDraft(session.examAttempts, examDraft);
        setExamDraft(next);
        skipExamRetry(next);
      }}
      onRevealHint={revealHint}
    />
  ) : isAiOff && aiOffOpen ? (
    <HeatAiOffTask
      challengeId={aiOffChallengeId}
      questionIndex={aiOffQuestionIndex}
      totalCount={aiOffDraft.challengeIds.length}
      step={aiOffStep}
      selectedAnswer={aiOffDraft.selectedAnswer}
      reasoning={aiOffDraft.reasoning}
      postCheckSelections={aiOffDraft.postCheckSelections}
      preCommitEvidenceIds={aiOffDraft.preCommitEvidenceIds}
      committed={latestAiOffAttempt}
      needResponse={aiOffNeedResponse}
      needPostCheck={aiOffNeedPostCheck}
      onSelectedAnswerChange={(value) => {
        const next = { ...aiOffDraft, selectedAnswer: value };
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
      onReasoningChange={(value) => {
        const next = { ...aiOffDraft, reasoning: value };
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
      onPreCommitEvidenceChange={(preCommitEvidenceIds) => {
        const next = { ...aiOffDraft, preCommitEvidenceIds };
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
      onPostCheckToggle={(id) => {
        const selected = aiOffDraft.postCheckSelections.includes(id)
          ? aiOffDraft.postCheckSelections.filter((item) => item !== id)
          : [...aiOffDraft.postCheckSelections, id];
        const next = { ...aiOffDraft, postCheckSelections: selected };
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
      onCommit={() => {
        if (
          !canCommitHeatAiOffResponse({
            challengeId: aiOffChallengeId,
            selectedAnswer: aiOffDraft.selectedAnswer,
            studentReasoning: aiOffDraft.reasoning,
            preCommitEvidenceIds: aiOffDraft.preCommitEvidenceIds,
            timestamp: new Date().toISOString(),
          })
        ) {
          setAiOffNeedResponse(true);
          return;
        }
        setAiOffNeedResponse(false);
        saveAiOffIndependentResponse({
          challengeId: aiOffChallengeId,
          selectedAnswer: aiOffDraft.selectedAnswer,
          studentReasoning: aiOffDraft.reasoning,
          preCommitEvidenceIds: aiOffDraft.preCommitEvidenceIds,
          timestamp: new Date().toISOString(),
        });
        setAiOffDraft({
          ...aiOffDraft,
          currentChallengeId: aiOffChallengeId,
          step: "post-check",
          postCheckSelections: [],
        });
      }}
      onSubmitPostCheck={() => {
        if (aiOffDraft.postCheckSelections.length === 0) {
          setAiOffNeedPostCheck(true);
          return;
        }
        setAiOffNeedPostCheck(false);
        saveAiOffPostCheck({
          challengeId: aiOffChallengeId,
          postCheckIds: aiOffDraft.postCheckSelections,
        });
      }}
      onRetry={() => {
        const next = retryHeatAiOffDraft(aiOffDraft, aiOffChallengeId);
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
    />
  ) : isComplete ? (
    <HeatCompleteView
      prediction={
        session.predictions.at(-1)?.reasoning?.trim() || "你写下了自己的猜测。"
      }
      experiment={
        session.experimentEvidence.at(-1)?.reflection?.trim() ||
        "你对照了预测和实验结果。"
      }
      model={
        latestModel?.correctStructure
          ? "你用比热容、质量和温度变化写出了吸收能量的关系。"
          : "你尝试建立了能量、质量和温度变化的关系。"
      }
      transfer={
        transferComplete
          ? "你用能量、质量和温度变化判断了新情境，而不是只看外表。"
          : "你尝试把刚才的关系用到新情境。"
      }
      independent={
        session.independentAssessment?.challengeAttempts?.length
          ? "你在没有提示时独立判断了新问题。"
          : "你完成了独立挑战。"
      }
    />
  ) : null;

  const tutorStudentText = isObserve
    ? selectedOptionIds.join("，")
    : isDescribe
      ? describe.studentDescription
      : isExplain
        ? explain.studentExplanation
        : isTransfer
          ? transferDraft.studentExplanation
          : isExam
            ? examDraft.reasoning
            : predictReason;

  return (
    <LearningShell
      stage={session.stage}
      stageLabels={HEAT_STAGE_LABELS}
      stagePrompts={HEAT_STAGE_PROMPTS}
      progressStages={[...HEAT_PHASE_STAGES]}
      scene={scene}
      task={task}
      tutor={
        tutor.allowed && !isAiOff && !isComplete ? (
          <TutorPanel
            message={tutor.message}
            loading={tutor.loading}
            onAsk={() => {
              void tutor.askTutor(tutorStudentText);
            }}
          />
        ) : null
      }
      examNotice={isExam ? HEAT_EXAM_COPY.notice : undefined}
      actions={
        isEntry ? (
          <Button size="lg" onClick={startLesson} aria-label={HEAT_COPY.startCta}>
            {HEAT_COPY.startCta}
          </Button>
        ) : (
          <p className="text-sm text-[var(--ink-muted)]">{HEAT_FOOTER[session.stage]}</p>
        )
      }
      onStartOver={startOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
    />
  );
}

function activeExperimentId(
  session: NonNullable<ReturnType<typeof useHeatSamplesLearningSession>["session"]>,
): HeatExperimentId | null {
  if (session.stage === LearningStage.PREDICT) {
    return HEAT_EXPERIMENT_A;
  }
  if (session.stage === LearningStage.EXPERIMENT) {
    return activeHeatExperimentId(session);
  }
  return null;
}

function experimentKeyFor(
  stage: LearningStage,
  session: NonNullable<ReturnType<typeof useHeatSamplesLearningSession>["session"]>,
): string {
  if (stage === LearningStage.PREDICT) {
    return HEAT_EXPERIMENT_A;
  }
  if (stage === LearningStage.EXPERIMENT) {
    return activeHeatExperimentId(session) ?? "experiment-done";
  }
  return stage;
}

function retireHeatExamDraft(
  attempts: ExamAttempt[],
  previous: HeatExamDraft,
): HeatExamDraft {
  const retired = new Set(previous.retiredPatternIds);
  retired.add(previous.currentPatternId);
  const nextId = currentHeatExamPatternId(attempts, {
    patternIds: previous.patternIds,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });

  if (!nextId) {
    return {
      ...previous,
      retiredPatternIds: [...retired],
      step: "answer",
    };
  }

  return {
    ...emptyHeatExamDraft(previous.patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}
