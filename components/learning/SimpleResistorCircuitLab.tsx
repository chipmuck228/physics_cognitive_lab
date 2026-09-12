"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { LearningShell } from "@/components/learning/LearningShell";
import { OhmsAiOffTask } from "@/components/learning/OhmsAiOffTask";
import { OhmsCompleteView } from "@/components/learning/OhmsCompleteView";
import { OhmsDescribeTask } from "@/components/learning/OhmsDescribeTask";
import { OhmsExamTask } from "@/components/learning/OhmsExamTask";
import { OhmsExperimentTask } from "@/components/learning/OhmsExperimentTask";
import { OhmsExplainTask } from "@/components/learning/OhmsExplainTask";
import { OhmsObserveTask } from "@/components/learning/OhmsObserveTask";
import { OhmsPredictTask } from "@/components/learning/OhmsPredictTask";
import { OhmsRelationBoard } from "@/components/learning/OhmsRelationBoard";
import { OhmsTransferTask } from "@/components/learning/OhmsTransferTask";
import { SimpleResistorCircuit } from "@/components/physics/ohms/SimpleResistorCircuit";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { useOhmsLearningSession } from "@/hooks/useOhmsLearningSession";
import { useTutor } from "@/hooks/useTutor";
import {
  OHMS_COPY,
  OHMS_EXAM_COPY,
  OHMS_FOOTER,
  OHMS_PHASE_STAGES,
  OHMS_STAGE_LABELS,
  OHMS_STAGE_PROMPTS,
  ohmsExperimentTitle,
  ohmsPredictQuestion,
  ohmsReflectionPrompt,
} from "@/lib/content/simple-resistor-circuit";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  canCommitOhmsAiOffResponse,
  currentOhmsAiOffChallengeId,
  isOhmsAiOffSessionOpen,
  retryOhmsAiOffDraft,
} from "@/lib/learning/ohms-ai-off";
import { emptyOhmsDescribeInput } from "@/lib/learning/ohms-describe";
import {
  buildOhmsExamAttempt,
  canCommitOhmsExamAttempt,
  currentOhmsExamPatternId,
  emptyOhmsExamDraft,
  isOhmsExamSessionOpen,
  nextOhmsExamDraft,
  ohmsExamPattern,
  summarizeOhmsExamAttempt,
  type OhmsExamDraft,
} from "@/lib/learning/ohms-exam";
import {
  activeIncompleteOhmsEvidence,
  activeOhmsExperimentId,
  asOhmsObservedResult,
  emptyOhmsObservedResult,
  firstClosedOhmsEvidence,
  hasCompleteOhmsObservedResult,
  ohmsClosedExperimentReflection,
} from "@/lib/learning/ohms-experiment";
import { emptyOhmsExplainInput } from "@/lib/learning/ohms-explain";
import { revealedOhmsHints, nextOhmsHint } from "@/lib/learning/ohms-hint-ladder";
import {
  emptyOhmsModelDraft,
  hasCompletedOhmsModel,
  ohmsModelMissingLabels,
  ohmsModelStudentFeedback,
} from "@/lib/learning/ohms-model";
import {
  hasSufficientOhmsDescription,
} from "@/lib/learning/ohms-describe";
import { hasSufficientOhmsExplanation } from "@/lib/learning/ohms-explain";
import { hasSufficientOhmsObservation } from "@/lib/learning/ohms-observe";
import {
  firstCommittedOhmsPrediction,
  ohmsPredictLabel,
} from "@/lib/learning/ohms-predict";
import {
  OHMS_AI_OFF_DRAFT_KEY,
  OHMS_EXAM_DRAFT_KEY,
  OHMS_MODEL_DRAFT_KEY,
  OHMS_TRANSFER_DRAFT_KEY,
  ohmsAiOffDraft,
  ohmsDescribeDraft,
  ohmsExamDraft,
  ohmsExplainDraft,
  ohmsModelDraft,
  ohmsTransferDraft,
} from "@/lib/learning/ohms-scene-data";
import {
  activeOhmsTransferTargetId,
  emptyOhmsTransferDraft,
  hasCompletedOhmsTransfer,
  ohmsTransferTarget,
  summarizeOhmsTransferAttempt,
  type OhmsTransferJudgment,
} from "@/lib/learning/ohms-transfer";
import { canRunOhmsExperiment } from "@/lib/learning/ohms-experiment";
import {
  createInitialOhmsState,
  isOhmsSceneState,
  OHMS_EXPERIMENT_A,
  prepareOhmsExperimentState,
  runOhmsObserveDemo,
  type OhmsExperimentId,
  type OhmsSceneState,
} from "@/lib/physics/simple-resistor-circuit";
import { LearningStage, type ExamAttempt } from "@/types/learning";
import { TransferMode } from "@/types/physics-model";

export function SimpleResistorCircuitLab() {
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
  } = useOhmsLearningSession();
  const tutor = useTutor(session);

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [observeNeedMore, setObserveNeedMore] = useState(false);
  const [describe, setDescribe] = useState(emptyOhmsDescribeInput());
  const [describeNeedStructure, setDescribeNeedStructure] = useState(false);
  const [predictOutcome, setPredictOutcome] = useState("");
  const [predictReason, setPredictReason] = useState("");
  const [predictNeedMore, setPredictNeedMore] = useState(false);
  const [observed, setObserved] = useState(emptyOhmsObservedResult());
  const [comparison, setComparison] = useState<"" | "same" | "different" | "partial">("");
  const [reflection, setReflection] = useState("");
  const [observedNeedMore, setObservedNeedMore] = useState(false);
  const [comparisonNeedMore, setComparisonNeedMore] = useState(false);
  const [reflectionNeedMore, setReflectionNeedMore] = useState(false);
  const [explain, setExplain] = useState(emptyOhmsExplainInput());
  const [explainNeedMore, setExplainNeedMore] = useState(false);
  const [modelDraft, setModelDraft] = useState(emptyOhmsModelDraft());
  const [modelNeedStructure, setModelNeedStructure] = useState(false);
  const [transferDraft, setTransferDraft] = useState(emptyOhmsTransferDraft());
  const [transferNeedMore, setTransferNeedMore] = useState(false);
  const [examDraft, setExamDraft] = useState(emptyOhmsExamDraft());
  const [examNeedSteps, setExamNeedSteps] = useState(false);
  const [aiOffDraft, setAiOffDraft] = useState(
    session ? ohmsAiOffDraft(session) : undefined,
  );
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
  const [aiOffNeedPostCheck, setAiOffNeedPostCheck] = useState(false);
  const [demoClosed, setDemoClosed] = useState(true);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [formKey, setFormKey] = useState("");

  useEffect(() => {
    if (!session) {
      return;
    }
    const latestObservation = session.observations.at(-1);
    setSelectedOptionIds(latestObservation?.selectedOptionIds ?? []);
    setObserveNeedMore(
      session.stage === LearningStage.OBSERVE &&
        Boolean(latestObservation) &&
        !hasSufficientOhmsObservation(session.observations),
    );

    const draft = ohmsDescribeDraft(session) ?? emptyOhmsDescribeInput();
    const latestDescription = session.descriptions.at(-1);
    setDescribe({
      ...draft,
      studentDescription: latestDescription?.text ?? draft.studentDescription,
    });
    setDescribeNeedStructure(
      session.stage === LearningStage.DESCRIBE &&
        Boolean(latestDescription) &&
        !hasSufficientOhmsDescription(session.descriptions),
    );

    setExplain(ohmsExplainDraft(session));
    const latestExplanation = session.explanations.at(-1);
    setExplainNeedMore(
      session.stage === LearningStage.EXPLAIN &&
        Boolean(latestExplanation) &&
        !hasSufficientOhmsExplanation(session.explanations),
    );

    const latestModel = session.modelAttempts.at(-1);
    setModelDraft(
      session.sceneData[OHMS_MODEL_DRAFT_KEY]
        ? ohmsModelDraft(session)
        : emptyOhmsModelDraft(),
    );
    setModelNeedStructure(
      session.stage === LearningStage.MODEL &&
        Boolean(latestModel) &&
        !hasCompletedOhmsModel(session.modelAttempts),
    );

    const transfer = ohmsTransferDraft(session);
    const activeTarget = activeOhmsTransferTargetId(session.transferAttempts);
    const latestTransfer = [...session.transferAttempts]
      .reverse()
      .find((attempt) => (attempt.targetId ?? attempt.scenarioId) === activeTarget);
    setTransferDraft(
      session.sceneData[OHMS_TRANSFER_DRAFT_KEY]
        ? { ...transfer, targetId: activeTarget }
        : latestTransfer && latestTransfer.accepted !== true
          ? { ...emptyOhmsTransferDraft(activeTarget), studentExplanation: latestTransfer.response }
          : emptyOhmsTransferDraft(activeTarget),
    );
    setTransferNeedMore(
      session.stage === LearningStage.TRANSFER &&
        Boolean(latestTransfer) &&
        latestTransfer?.accepted !== true,
    );

    setExamDraft(
      session.sceneData[OHMS_EXAM_DRAFT_KEY]
        ? ohmsExamDraft(session)
        : emptyOhmsExamDraft(),
    );
    setAiOffDraft(
      session.sceneData[OHMS_AI_OFF_DRAFT_KEY]
        ? ohmsAiOffDraft(session)
        : ohmsAiOffDraft(session),
    );
  }, [session]);

  const experimentKey = session ? experimentKeyFor(session.stage, session) : "";
  if (session && experimentKey !== formKey) {
    setFormKey(experimentKey);
    const experimentId = activeExperimentId(session);
    const prediction = experimentId
      ? firstCommittedOhmsPrediction(session.predictions, experimentId)
      : undefined;
    const evidence = experimentId
      ? activeIncompleteOhmsEvidence(session, experimentId) ??
        firstClosedOhmsEvidence(session, experimentId)
      : undefined;
    setPredictOutcome(prediction?.prediction ?? "");
    setPredictReason(prediction?.reasoning ?? "");
    setPredictNeedMore(false);
    setObserved(asOhmsObservedResult(evidence?.observedResult));
    setComparison(
      evidence?.comparison === "same" ||
        evidence?.comparison === "different" ||
        evidence?.comparison === "partial"
        ? evidence.comparison
        : "",
    );
    setReflection(evidence?.reflection ?? "");
    setObservedNeedMore(false);
    setComparisonNeedMore(false);
    setReflectionNeedMore(false);
  }

  if (!hydrated || !session || !aiOffDraft) {
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
  const observeComplete = hasSufficientOhmsObservation(session.observations);
  const describeComplete = hasSufficientOhmsDescription(session.descriptions);
  const explainComplete = hasSufficientOhmsExplanation(session.explanations);
  const modelComplete = hasCompletedOhmsModel(session.modelAttempts);
  const transferComplete = hasCompletedOhmsTransfer(session.transferAttempts);
  const activeExperiment = activeExperimentId(session);
  const activeEvidence = activeExperiment
    ? activeIncompleteOhmsEvidence(session, activeExperiment) ??
      firstClosedOhmsEvidence(session, activeExperiment)
    : undefined;
  const committedPrediction = activeExperiment
    ? firstCommittedOhmsPrediction(session.predictions, activeExperiment)
    : undefined;
  const predictionLocked = Boolean(committedPrediction && activeEvidence?.interventionAt);
  const canRun = Boolean(
    activeExperiment && canRunOhmsExperiment(session, activeExperiment),
  );
  const hasRun = Boolean(activeEvidence?.interventionAt);
  const observedSaved = Boolean(
    activeExperiment && hasCompleteOhmsObservedResult(activeEvidence?.observedResult),
  );
  const comparisonSaved = Boolean(
    activeEvidence?.comparison === "same" ||
      activeEvidence?.comparison === "different" ||
      activeEvidence?.comparison === "partial",
  );
  const evidenceA = ohmsClosedExperimentReflection(session, OHMS_EXPERIMENT_A) ?? "";
  const evidenceB =
    ohmsClosedExperimentReflection(session, "same-voltage-different-resistance") ?? "";
  const hints = revealedOhmsHints(session.events, session.stage);
  const canRevealHint = Boolean(nextOhmsHint(session.events, session.stage));
  const latestModel = session.modelAttempts.at(-1);
  const latestTransfer = session.transferAttempts.at(-1);
  const transferTarget = ohmsTransferTarget(transferDraft.targetId);
  const examOpen = isOhmsExamSessionOpen(session.examAttempts, examDraft);
  const examPatternId =
    currentOhmsExamPatternId(session.examAttempts, examDraft) ??
    examDraft.currentPatternId;
  const examPattern = ohmsExamPattern(examPatternId);
  const examQuestionIndex = Math.max(examDraft.patternIds.indexOf(examPatternId), 0);
  const latestExamAttempt = [...session.examAttempts]
    .reverse()
    .find((attempt) => (attempt.patternId ?? attempt.questionId) === examPatternId);
  const examCanRetry = Boolean(
    latestExamAttempt && latestExamAttempt.correct !== true && examOpen,
  );
  const aiOffOpen = isOhmsAiOffSessionOpen(session.independentAssessment, aiOffDraft);
  const aiOffChallengeId =
    currentOhmsAiOffChallengeId(session.independentAssessment, aiOffDraft) ??
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
    aiOffDraft.step === "post-check" && latestAiOffAttempt
      ? "post-check"
      : aiOffDraft.step;

  const circuitState = displayOhmsState({
    sessionState: isOhmsSceneState(session.physicsState.state)
      ? session.physicsState.state
      : createInitialOhmsState(),
    stage: session.stage,
    activeExperiment,
    hasRun,
    demoClosed,
    demoPlaying,
  });
  const sceneFrozen = isModel;
  const hideScene = isExam || isAiOff || isComplete || isTransfer;

  const scene = hideScene ? undefined : (
    <div className="w-full max-w-xl space-y-3">
      <SimpleResistorCircuit state={circuitState} frozen={sceneFrozen} />
    </div>
  );

  const predictTask = activeExperiment ? (
    <OhmsPredictTask
      question={ohmsPredictQuestion(activeExperiment)}
      outcome={predictOutcome}
      reason={predictReason}
      committedLabel={
        committedPrediction ? ohmsPredictLabel(committedPrediction.prediction) : null
      }
      locked={predictionLocked}
      needMore={predictNeedMore}
      onOutcomeChange={setPredictOutcome}
      onReasonChange={setPredictReason}
      onCommit={() => {
        if (!predictOutcome || predictReason.trim().length < 2) {
          setPredictNeedMore(true);
          return;
        }
        setPredictNeedMore(false);
        commitPrediction(activeExperiment, predictOutcome, predictReason);
      }}
    />
  ) : null;

  const task = isEntry ? (
    <div className="mx-auto max-w-md text-center lg:text-left">
      <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        {OHMS_COPY.landingTitle}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{OHMS_COPY.landingBody}</p>
    </div>
  ) : isObserve ? (
    <OhmsObserveTask
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
        setDemoPlaying((current) => !current);
        setDemoClosed(true);
      }}
      onToggleCircuit={() => {
        markDemoWatched();
        setDemoPlaying(true);
        setDemoClosed((current) => !current);
      }}
      circuitClosed={demoClosed}
      onSubmit={() => {
        saveObservation(selectedOptionIds);
        if (selectedOptionIds.length < 3) {
          setObserveNeedMore(true);
        }
      }}
      needMore={observeNeedMore}
      saved={observeComplete}
      demoPlaying={demoPlaying}
    />
  ) : isDescribe ? (
    <OhmsDescribeTask
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
      <OhmsExperimentTask
        experimentId={activeExperiment}
        title={ohmsExperimentTitle(activeExperiment)}
        canRun={canRun}
        hasRun={hasRun}
        observed={observed}
        comparison={comparison}
        reflection={reflection}
        reflectionPrompt={ohmsReflectionPrompt(activeExperiment)}
        onRun={() => runExperiment(activeExperiment)}
        onObservedChange={setObserved}
        onSaveObserved={() => {
          if (!observed.heldQuantity || !observed.currentChange) {
            setObservedNeedMore(true);
            return;
          }
          setObservedNeedMore(false);
          saveObservedResult(activeExperiment, observed);
        }}
        onComparisonChange={setComparison}
        onSaveComparison={() => {
          if (!comparison) {
            setComparisonNeedMore(true);
            return;
          }
          setComparisonNeedMore(false);
          saveComparison(activeExperiment, comparison);
        }}
        onReflectionChange={setReflection}
        onSaveReflection={() => {
          if (reflection.trim().length < 2) {
            setReflectionNeedMore(true);
            return;
          }
          setReflectionNeedMore(false);
          saveReflection(activeExperiment, reflection);
        }}
        observedSaved={observedSaved}
        comparisonSaved={comparisonSaved}
        observedNeedMore={observedNeedMore}
        comparisonNeedMore={comparisonNeedMore}
        reflectionNeedMore={reflectionNeedMore}
      />
    </div>
  ) : isExplain ? (
    <OhmsExplainTask
      value={explain}
      needMore={explainNeedMore && !explainComplete}
      evidence={{ experimentA: evidenceA, experimentB: evidenceB }}
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
    <OhmsRelationBoard
      draft={modelDraft}
      gateFeedback={
        latestModel && !latestModel.correctStructure
          ? ohmsModelStudentFeedback(modelDraft, latestModel)
          : null
      }
      needStructure={modelNeedStructure && !modelComplete}
      hints={hints}
      canRevealHint={canRevealHint}
      onChange={(next) => {
        setModelDraft(next);
        saveModelDraft(next);
      }}
      onSubmit={() => {
        if (ohmsModelMissingLabels(modelDraft).length > 0) {
          setModelNeedStructure(true);
        }
        saveModelAttempt(modelDraft);
      }}
      onRevealHint={revealHint}
    />
  ) : isTransfer && !transferComplete && transferTarget ? (
    <OhmsTransferTask
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
          ? summarizeOhmsTransferAttempt(latestTransfer)
          : null
      }
      needMore={transferNeedMore}
      hints={hints}
      canRevealHint={canRevealHint}
      onJudgmentChange={(relationId, judgment: OhmsTransferJudgment) => {
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
          conditionChecks: Object.values(transferDraft.conditionChecks),
          timestamp: new Date().toISOString(),
        })
      }
      onRevealHint={revealHint}
    />
  ) : isExam && examOpen && examPattern ? (
    <OhmsExamTask
      pattern={examPattern}
      questionIndex={examQuestionIndex}
      totalCount={examDraft.patternIds.length}
      step={examDraft.step}
      representation={examDraft.representation}
      modelRecognition={examDraft.modelRecognition}
      selectedAnswer={examDraft.selectedAnswer}
      reasoning={examDraft.reasoning}
      feedback={
        latestExamAttempt ? summarizeOhmsExamAttempt(latestExamAttempt) : null
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
        if (!examDraft.representation) {
          setExamNeedSteps(true);
          return;
        }
        setExamNeedSteps(false);
        const next = { ...examDraft, step: "model" as const };
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onRevealChoices={() => {
        if (!examDraft.modelRecognition) {
          setExamNeedSteps(true);
          return;
        }
        setExamNeedSteps(false);
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
        if (!canCommitOhmsExamAttempt(input)) {
          setExamNeedSteps(true);
          return;
        }
        setExamNeedSteps(false);
        saveExamAttempt(input);
        setExamDraft(
          nextOhmsExamDraft(
            [...session.examAttempts, buildOhmsExamAttempt(input)],
            examDraft,
            examPatternId,
          ),
        );
      }}
      onNext={() => {
        const next = retireOhmsExamDraft(session.examAttempts, examDraft);
        setExamDraft(next);
        skipExamRetry(next);
      }}
      onRevealHint={revealHint}
    />
  ) : isAiOff && aiOffOpen ? (
    <OhmsAiOffTask
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
          !canCommitOhmsAiOffResponse({
            challengeId: aiOffChallengeId,
            selectedAnswer: aiOffDraft.selectedAnswer,
            studentReasoning: aiOffDraft.reasoning,
            preCommitEvidenceIds: aiOffDraft.preCommitEvidenceIds,
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
        const next = retryOhmsAiOffDraft(aiOffDraft, aiOffChallengeId);
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
    />
  ) : isComplete ? (
    <OhmsCompleteView
      prediction={
        session.predictions.at(-1)?.reasoning?.trim() || "你写下了自己的猜测。"
      }
      experiment={
        session.experimentEvidence.at(-1)?.reflection?.trim() ||
        "你对照了预测和读数。"
      }
      model={
        latestModel?.correctStructure
          ? "你用同一个关系说明了两种比较，也写清了哪个量不变时电流怎样变。"
          : "你尝试写出了电流、电压和电阻的关系。"
      }
      transfer={
        transferComplete
          ? "你判断了新情境里哪些还能用，哪些不能直接搬。"
          : "你尝试把刚才的关系用到新情境。"
      }
      independent={
        session.independentAssessment?.challengeAttempts?.length
          ? "你在没有提示时独立判断了新问题。"
          : "你完成了自己做的两题。"
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
      stageLabels={OHMS_STAGE_LABELS}
      stagePrompts={OHMS_STAGE_PROMPTS}
      progressStages={[...OHMS_PHASE_STAGES]}
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
      examNotice={isExam ? OHMS_EXAM_COPY.notice : undefined}
      actions={
        isEntry ? (
          <Button size="lg" onClick={startLesson} aria-label={OHMS_COPY.startLesson}>
            {OHMS_COPY.startLesson}
          </Button>
        ) : (
          <p className="text-sm text-[var(--ink-muted)]">{OHMS_FOOTER[session.stage]}</p>
        )
      }
      onStartOver={startOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
    />
  );
}

function activeExperimentId(
  session: NonNullable<ReturnType<typeof useOhmsLearningSession>["session"]>,
): OhmsExperimentId | null {
  if (session.stage === LearningStage.PREDICT) {
    return OHMS_EXPERIMENT_A;
  }
  if (session.stage === LearningStage.EXPERIMENT) {
    return activeOhmsExperimentId(session);
  }
  return null;
}

function experimentKeyFor(
  stage: LearningStage,
  session: NonNullable<ReturnType<typeof useOhmsLearningSession>["session"]>,
): string {
  if (stage === LearningStage.PREDICT) {
    return OHMS_EXPERIMENT_A;
  }
  if (stage === LearningStage.EXPERIMENT) {
    return activeOhmsExperimentId(session) ?? "experiment-done";
  }
  return stage;
}

function displayOhmsState(input: {
  sessionState: OhmsSceneState;
  stage: LearningStage;
  activeExperiment: OhmsExperimentId | null;
  hasRun: boolean;
  demoClosed: boolean;
  demoPlaying: boolean;
}): OhmsSceneState {
  if (input.stage === LearningStage.OBSERVE) {
    return input.demoPlaying
      ? runOhmsObserveDemo(input.demoClosed)
      : createInitialOhmsState();
  }
  if (input.stage === LearningStage.DESCRIBE) {
    return runOhmsObserveDemo(true);
  }
  if (input.stage === LearningStage.MODEL) {
    return { ...createInitialOhmsState(), readingsRevealed: true };
  }
  if (
    (input.stage === LearningStage.PREDICT || input.stage === LearningStage.EXPERIMENT) &&
    input.activeExperiment
  ) {
    if (input.hasRun) {
      return input.sessionState.comparisonMode === input.activeExperiment
        ? input.sessionState
        : {
            ...prepareOhmsExperimentState(input.activeExperiment),
            readingsRevealed: true,
          };
    }
    return prepareOhmsExperimentState(input.activeExperiment);
  }
  return createInitialOhmsState();
}

function retireOhmsExamDraft(
  attempts: ExamAttempt[],
  previous: OhmsExamDraft,
): OhmsExamDraft {
  const retired = new Set(previous.retiredPatternIds);
  retired.add(previous.currentPatternId);
  const nextId = currentOhmsExamPatternId(attempts, {
    ...previous,
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
    ...emptyOhmsExamDraft(previous.patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}
