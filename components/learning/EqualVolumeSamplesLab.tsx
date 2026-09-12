"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { SamplesAiOffTask } from "@/components/learning/SamplesAiOffTask";
import { SamplesCompleteView } from "@/components/learning/SamplesCompleteView";
import { SamplesDescribeTask } from "@/components/learning/SamplesDescribeTask";
import { SamplesExamTask } from "@/components/learning/SamplesExamTask";
import { SamplesExplainTask } from "@/components/learning/SamplesExplainTask";
import { SamplesExperimentTask } from "@/components/learning/SamplesExperimentTask";
import { SamplesObserveTask } from "@/components/learning/SamplesObserveTask";
import { SamplesPredictTask } from "@/components/learning/SamplesPredictTask";
import { SamplesRatioBoard } from "@/components/learning/SamplesRatioBoard";
import { SamplesTransferTask } from "@/components/learning/SamplesTransferTask";
import { LearningShell } from "@/components/learning/LearningShell";
import { EqualVolumeSamples } from "@/components/physics/samples/EqualVolumeSamples";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { useSamplesLearningSession } from "@/hooks/useSamplesLearningSession";
import { useTutor } from "@/hooks/useTutor";
import {
  SAMPLES_COPY,
  SAMPLES_EXAM_COPY,
  SAMPLES_EXPERIMENT_QUESTIONS,
  SAMPLES_EXPERIMENT_TITLES,
  SAMPLES_FOOTER,
  SAMPLES_PHASE_STAGES,
  SAMPLES_PREDICT_OPTIONS_BY_EXPERIMENT,
  SAMPLES_REFLECTION_PROMPTS,
  SAMPLES_STAGE_LABELS,
  SAMPLES_STAGE_PROMPTS,
} from "@/lib/content/equal-volume-material-samples";
import {
  emptySamplesDescribeInput,
  hasSufficientSamplesDescription,
  type SamplesDescribeInput,
} from "@/lib/learning/samples-describe";
import {
  emptySamplesExplainInput,
  hasSufficientSamplesExplanation,
  type SamplesExplainInput,
} from "@/lib/learning/samples-explain";
import {
  activeIncompleteSamplesEvidence,
  activeSamplesExperimentId,
  asSamplesObservedResult,
  canRunSamplesExperiment,
  emptySamplesObservedResult,
  firstClosedSamplesEvidence,
  hasCompleteSamplesObservedResult,
  samplesClosedExperimentReflection,
  type SamplesObservedResult,
} from "@/lib/learning/samples-experiment";
import {
  currentSamplesAiOffChallengeId,
  emptySamplesAiOffDraft,
  isSamplesAiOffSessionOpen,
  latestSamplesAiOffAttempt,
  retrySamplesAiOffDraft,
  samplesAiOffAttemptsFor,
  type SamplesAiOffDraft,
} from "@/lib/learning/samples-ai-off";
import {
  buildSamplesExamAttempt,
  currentSamplesExamPatternId,
  emptySamplesExamDraft,
  isSamplesExamSessionOpen,
  nextSamplesExamDraft,
  retireSamplesExamDraft,
  samplesExamPattern,
  summarizeSamplesExamAttempt,
  type SamplesExamDraft,
} from "@/lib/learning/samples-exam";
import {
  emptySamplesModelDraft,
  hasCompletedSamplesModel,
  samplesModelDraftFromAttempt,
  summarizeSamplesModelAttempt,
  type SamplesModelDraft,
} from "@/lib/learning/samples-model";
import { hasSufficientSamplesObservation } from "@/lib/learning/samples-observe";
import {
  firstCommittedSamplesPrediction,
  samplesPredictLabel,
} from "@/lib/learning/samples-predict";
import { nextSamplesHint, revealedSamplesHints } from "@/lib/learning/samples-hint-ladder";
import {
  SAMPLES_AI_OFF_DRAFT_KEY,
  SAMPLES_EXAM_DRAFT_KEY,
  SAMPLES_MODEL_DRAFT_KEY,
  SAMPLES_TRANSFER_DRAFT_KEY,
  samplesAiOffDraft,
  samplesDescribeDraft,
  samplesExamDraft,
  samplesExplainDraft,
  samplesModelDraft,
  samplesTransferDraft,
} from "@/lib/learning/samples-scene-data";
import {
  SAMPLES_TRANSFER_TARGET_IDS,
  activeSamplesTransferTargetId,
  emptySamplesTransferDraft,
  hasAcceptedSamplesFullModel,
  hasCompletedSamplesTransfer,
  samplesTransferDraftFromAttempt,
  samplesTransferTarget,
  summarizeSamplesTransferAttempt,
  type SamplesTransferDraft,
  type SamplesTransferJudgment,
} from "@/lib/learning/samples-transfer";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
  createInitialDensityState,
  isDensitySceneState,
  runObserveDemo,
  type SamplesExperimentId,
} from "@/lib/physics/equal-volume-material-samples";
import { LearningStage } from "@/types/learning";
import { TransferMode } from "@/types/physics-model";

export function EqualVolumeSamplesLab() {
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
  } = useSamplesLearningSession();
  const tutor = useTutor(session);

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [observeNeedMore, setObserveNeedMore] = useState(false);
  const [describe, setDescribe] = useState<SamplesDescribeInput>(
    emptySamplesDescribeInput(),
  );
  const [describeNeedStructure, setDescribeNeedStructure] = useState(false);
  const [predictOutcome, setPredictOutcome] = useState("");
  const [predictReason, setPredictReason] = useState("");
  const [predictNeedMore, setPredictNeedMore] = useState(false);
  const [observed, setObserved] = useState<SamplesObservedResult>(
    emptySamplesObservedResult(),
  );
  const [comparison, setComparison] = useState<"" | "same" | "different" | "partial">("");
  const [reflection, setReflection] = useState("");
  const [explain, setExplain] = useState<SamplesExplainInput>(emptySamplesExplainInput());
  const [explainNeedMore, setExplainNeedMore] = useState(false);
  const [modelDraft, setModelDraft] = useState<SamplesModelDraft>(emptySamplesModelDraft());
  const [modelNeedStructure, setModelNeedStructure] = useState(false);
  const [transferDraft, setTransferDraft] = useState<SamplesTransferDraft>(
    emptySamplesTransferDraft(),
  );
  const [transferNeedMore, setTransferNeedMore] = useState(false);
  const [examDraft, setExamDraft] = useState<SamplesExamDraft>(emptySamplesExamDraft);
  const [examNeedSteps, setExamNeedSteps] = useState(false);
  const [aiOffDraft, setAiOffDraft] = useState<SamplesAiOffDraft>(emptySamplesAiOffDraft);
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
  const [aiOffNeedPostCheck, setAiOffNeedPostCheck] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [formKey, setFormKey] = useState("");

  const demoFrames = useMemo(() => runObserveDemo(), []);
  const demoState = demoFrames[demoIndex] ?? demoFrames[0] ?? createInitialDensityState();

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
        !hasSufficientSamplesObservation(session.observations),
    );

    const draft = samplesDescribeDraft(session) ?? emptySamplesDescribeInput();
    const latestDescription = session.descriptions.at(-1);
    setDescribe({
      ...draft,
      studentDescription: latestDescription?.text ?? draft.studentDescription,
    });
    setDescribeNeedStructure(
      session.stage === LearningStage.DESCRIBE &&
        Boolean(latestDescription) &&
        !hasSufficientSamplesDescription(session.descriptions),
    );

    setExplain(samplesExplainDraft(session));
    const latestExplanation = session.explanations.at(-1);
    setExplainNeedMore(
      session.stage === LearningStage.EXPLAIN &&
        Boolean(latestExplanation) &&
        !hasSufficientSamplesExplanation(session.explanations),
    );

    const latestModel = session.modelAttempts.at(-1);
    setModelDraft(
      session.sceneData[SAMPLES_MODEL_DRAFT_KEY]
        ? samplesModelDraft(session)
        : latestModel
          ? samplesModelDraftFromAttempt(latestModel)
          : emptySamplesModelDraft(),
    );
    setModelNeedStructure(
      session.stage === LearningStage.MODEL &&
        Boolean(latestModel) &&
        !hasCompletedSamplesModel(session.modelAttempts),
    );

    const transfer = samplesTransferDraft(session);
    const activeTarget = activeSamplesTransferTargetId(
      session.transferAttempts,
      transfer.targetId,
    );
    const latestTransfer = [...session.transferAttempts]
      .reverse()
      .find((attempt) => (attempt.targetId ?? attempt.scenarioId) === activeTarget);
    setTransferDraft(
      session.sceneData[SAMPLES_TRANSFER_DRAFT_KEY]
        ? { ...transfer, targetId: activeTarget }
        : latestTransfer && latestTransfer.accepted !== true
          ? samplesTransferDraftFromAttempt(latestTransfer)
          : emptySamplesTransferDraft(activeTarget),
    );
    setTransferNeedMore(
      session.stage === LearningStage.TRANSFER &&
        Boolean(latestTransfer) &&
        latestTransfer?.accepted !== true,
    );

    setExamDraft(
      session.sceneData[SAMPLES_EXAM_DRAFT_KEY]
        ? samplesExamDraft(session)
        : emptySamplesExamDraft(),
    );
    setAiOffDraft(
      session.sceneData[SAMPLES_AI_OFF_DRAFT_KEY]
        ? samplesAiOffDraft(session)
        : emptySamplesAiOffDraft(),
    );
  }, [session]);

  const experimentKey = session ? experimentKeyFor(session.stage, session) : "";
  if (session && experimentKey !== formKey) {
    setFormKey(experimentKey);
    const experimentId = activeExperimentId(session);
    const prediction = experimentId
      ? firstCommittedSamplesPrediction(session.predictions, experimentId)
      : undefined;
    const evidence = experimentId
      ? activeIncompleteSamplesEvidence(session, experimentId) ??
        firstClosedSamplesEvidence(session, experimentId)
      : undefined;
    setPredictOutcome(prediction?.prediction ?? "");
    setPredictReason(prediction?.reasoning ?? "");
    setPredictNeedMore(false);
    setObserved(asSamplesObservedResult(evidence?.observedResult));
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
  const observeComplete = hasSufficientSamplesObservation(session.observations);
  const describeComplete = hasSufficientSamplesDescription(session.descriptions);
  const explainComplete = hasSufficientSamplesExplanation(session.explanations);
  const modelComplete = hasCompletedSamplesModel(session.modelAttempts);
  const transferComplete = hasCompletedSamplesTransfer(session.transferAttempts);
  const activeExperiment = activeExperimentId(session);
  const activeEvidence = activeExperiment
    ? activeIncompleteSamplesEvidence(session, activeExperiment) ??
      firstClosedSamplesEvidence(session, activeExperiment)
    : undefined;
  const committedPrediction = activeExperiment
    ? firstCommittedSamplesPrediction(session.predictions, activeExperiment)
    : undefined;
  const predictionLocked = Boolean(
    committedPrediction && activeEvidence?.interventionAt,
  );
  const canRun = Boolean(
    activeExperiment && canRunSamplesExperiment(session, activeExperiment),
  );
  const hasRun = Boolean(activeEvidence?.interventionAt);
  const observedSaved = Boolean(
    activeExperiment &&
      hasCompleteSamplesObservedResult(activeExperiment, activeEvidence?.observedResult),
  );
  const comparisonSaved = Boolean(
    activeEvidence?.comparison === "same" ||
      activeEvidence?.comparison === "different" ||
      activeEvidence?.comparison === "partial",
  );
  const evidenceSameVolume = samplesClosedExperimentReflection(
    session,
    SAMPLES_EXPERIMENT_A,
  );
  const evidenceSameMass = samplesClosedExperimentReflection(
    session,
    SAMPLES_EXPERIMENT_B,
  );
  const evidenceCut = samplesClosedExperimentReflection(session, SAMPLES_EXPERIMENT_C);
  const hints = revealedSamplesHints(session.events, session.stage);
  const canRevealHint = Boolean(nextSamplesHint(session.events, session.stage));
  const latestModel = session.modelAttempts.at(-1);
  const latestTransfer = session.transferAttempts.at(-1);
  const transferTarget = samplesTransferTarget(transferDraft.targetId);
  const canRetryMedium =
    isTransfer &&
    !hasAcceptedSamplesFullModel(session.transferAttempts) &&
    transferDraft.targetId !== SAMPLES_TRANSFER_TARGET_IDS.stone;
  const examOpen = isSamplesExamSessionOpen(session.examAttempts, examDraft);
  const examPatternId =
    currentSamplesExamPatternId(session.examAttempts, examDraft) ??
    examDraft.currentPatternId;
  const examPattern = samplesExamPattern(examPatternId);
  const examQuestionIndex = Math.max(examDraft.patternIds.indexOf(examPatternId), 0);
  const latestExamAttempt = [...session.examAttempts]
    .reverse()
    .find((attempt) => (attempt.patternId ?? attempt.questionId) === examPatternId);
  const examCanRetry = Boolean(
    latestExamAttempt && latestExamAttempt.correct !== true && examOpen,
  );
  const aiOffOpen = isSamplesAiOffSessionOpen(session.independentAssessment, aiOffDraft);
  const aiOffChallengeId =
    currentSamplesAiOffChallengeId(session.independentAssessment, aiOffDraft) ??
    aiOffDraft.currentChallengeId;
  const aiOffQuestionIndex = Math.max(
    aiOffDraft.challengeIds.indexOf(aiOffChallengeId),
    0,
  );
  const latestAiOffAttempt =
    latestSamplesAiOffAttempt(session.independentAssessment, aiOffChallengeId) ??
    samplesAiOffAttemptsFor(session.independentAssessment, aiOffChallengeId).at(-1) ??
    null;
  const aiOffStep =
    aiOffDraft.step === "post-check" && latestAiOffAttempt
      ? "post-check"
      : aiOffDraft.step;

  const samplesState = isObserve
    ? demoState
    : isDensitySceneState(session.physicsState.state)
      ? session.physicsState.state
      : createInitialDensityState();

  const scene =
    isExam || isAiOff || isComplete ? undefined : (
      <div className="w-full max-w-xl space-y-3">
        <EqualVolumeSamples state={samplesState} />
      </div>
    );

  const predictTask = activeExperiment ? (
    <SamplesPredictTask
      question={SAMPLES_EXPERIMENT_QUESTIONS[activeExperiment]}
      outcomes={SAMPLES_PREDICT_OPTIONS_BY_EXPERIMENT[activeExperiment]}
      outcome={predictOutcome}
      reason={predictReason}
      committedLabel={
        committedPrediction
          ? samplesPredictLabel(committedPrediction.prediction)
          : null
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
        {SAMPLES_COPY.headline}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{SAMPLES_COPY.subheadline}</p>
    </div>
  ) : isObserve ? (
    <SamplesObserveTask
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
    <SamplesDescribeTask
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
      <SamplesExperimentTask
        experimentId={activeExperiment}
        title={SAMPLES_EXPERIMENT_TITLES[activeExperiment]}
        canRun={canRun}
        hasRun={hasRun}
        observed={observed}
        comparison={comparison}
        reflection={reflection}
        reflectionPrompt={SAMPLES_REFLECTION_PROMPTS[activeExperiment]}
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
    <SamplesExplainTask
      value={explain}
      needMore={explainNeedMore && !explainComplete}
      evidence={{
        sameVolume: evidenceSameVolume ?? "",
        sameMass: evidenceSameMass ?? "",
        cut: evidenceCut ?? "",
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
    <SamplesRatioBoard
      draft={modelDraft}
      feedback={
        latestModel && !latestModel.correctStructure
          ? summarizeSamplesModelAttempt(latestModel)
          : null
      }
      needStructure={modelNeedStructure && !modelComplete}
      evidence={{
        sameVolume: evidenceSameVolume ?? "",
        sameMass: evidenceSameMass ?? "",
        cut: evidenceCut ?? "",
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
    <SamplesTransferTask
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
      feedback={
        latestTransfer && latestTransfer.accepted !== true
          ? summarizeSamplesTransferAttempt(latestTransfer)
          : null
      }
      needMore={transferNeedMore}
      hints={hints}
      canRevealHint={canRevealHint}
      canRetryMedium={canRetryMedium}
      onJudgmentChange={(relationId, judgment: SamplesTransferJudgment) => {
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
          timestamp: new Date().toISOString(),
        })
      }
      onRevealHint={revealHint}
      onRetryMedium={() => {
        const updated = emptySamplesTransferDraft(SAMPLES_TRANSFER_TARGET_IDS.stone);
        setTransferDraft(updated);
        saveTransferDraft(updated);
      }}
    />
  ) : isExam && examOpen && examPattern ? (
    <SamplesExamTask
      pattern={examPattern}
      questionIndex={examQuestionIndex}
      totalCount={examDraft.patternIds.length}
      step={examDraft.step}
      representation={examDraft.representation}
      modelRecognition={examDraft.modelRecognition}
      selectedAnswer={examDraft.selectedAnswer}
      reasoning={examDraft.reasoning}
      feedback={
        latestExamAttempt ? summarizeSamplesExamAttempt(latestExamAttempt) : null
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
          nextSamplesExamDraft(
            [...session.examAttempts, buildSamplesExamAttempt(input)],
            examDraft,
            examPatternId,
          ),
        );
      }}
      onNext={() => {
        const next = retireSamplesExamDraft(session.examAttempts, examDraft);
        setExamDraft(next);
        skipExamRetry(next);
      }}
      onRevealHint={revealHint}
    />
  ) : isAiOff && aiOffOpen ? (
    <SamplesAiOffTask
      challengeId={aiOffChallengeId}
      questionIndex={aiOffQuestionIndex}
      totalCount={aiOffDraft.challengeIds.length}
      step={aiOffStep}
      selectedAnswer={aiOffDraft.selectedAnswer}
      reasoning={aiOffDraft.reasoning}
      postCheckSelections={aiOffDraft.postCheckSelections}
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
      onPostCheckToggle={(id) => {
        const selected = aiOffDraft.postCheckSelections.includes(id)
          ? aiOffDraft.postCheckSelections.filter((item) => item !== id)
          : [...aiOffDraft.postCheckSelections, id];
        const next = { ...aiOffDraft, postCheckSelections: selected };
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
      onCommit={() => {
        if (!aiOffDraft.selectedAnswer || !aiOffDraft.reasoning.trim()) {
          setAiOffNeedResponse(true);
          return;
        }
        setAiOffNeedResponse(false);
        saveAiOffIndependentResponse({
          challengeId: aiOffChallengeId,
          selectedAnswer: aiOffDraft.selectedAnswer,
          studentReasoning: aiOffDraft.reasoning,
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
        const next = retrySamplesAiOffDraft(aiOffDraft, aiOffChallengeId);
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
    />
  ) : isComplete ? (
    <SamplesCompleteView
      prediction={
        session.predictions.at(-1)?.reasoning?.trim() || "你写下了自己的猜测。"
      }
      experiment={
        session.experimentEvidence.at(-1)?.reflection?.trim() ||
        "你对照了预测和实验结果。"
      }
      model={
        latestModel?.correctStructure
          ? "你用质量和体积的比写出了密度。"
          : "你尝试建立了密度和质量、体积的关系。"
      }
      transfer={
        transferComplete
          ? "你用质量和体积的关系判断了新情境，而不是只看外表。"
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
      stageLabels={SAMPLES_STAGE_LABELS}
      stagePrompts={SAMPLES_STAGE_PROMPTS}
      progressStages={[...SAMPLES_PHASE_STAGES]}
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
      examNotice={isExam ? SAMPLES_EXAM_COPY.notice : undefined}
      actions={
        isEntry ? (
          <Button size="lg" onClick={startLesson} aria-label={SAMPLES_COPY.startCta}>
            {SAMPLES_COPY.startCta}
          </Button>
        ) : (
          <p className="text-sm text-[var(--ink-muted)]">{SAMPLES_FOOTER[session.stage]}</p>
        )
      }
      onStartOver={startOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
    />
  );
}

function activeExperimentId(
  session: NonNullable<ReturnType<typeof useSamplesLearningSession>["session"]>,
): SamplesExperimentId | null {
  if (session.stage === LearningStage.PREDICT) {
    return SAMPLES_EXPERIMENT_A;
  }
  if (session.stage === LearningStage.EXPERIMENT) {
    return activeSamplesExperimentId(session);
  }
  return null;
}

function experimentKeyFor(
  stage: LearningStage,
  session: NonNullable<ReturnType<typeof useSamplesLearningSession>["session"]>,
): string {
  if (stage === LearningStage.PREDICT) {
    return SAMPLES_EXPERIMENT_A;
  }
  if (stage === LearningStage.EXPERIMENT) {
    return activeSamplesExperimentId(session) ?? "experiment-done";
  }
  return stage;
}
