"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { ConvexLensOpticalBench } from "@/components/physics/convex-lens/ConvexLensOpticalBench";
import { LearningShell } from "@/components/learning/LearningShell";
import { LensAiOffTask } from "@/components/learning/LensAiOffTask";
import { LensCompleteView } from "@/components/learning/LensCompleteView";
import { LensDescribeTask } from "@/components/learning/LensDescribeTask";
import { LensExamTask } from "@/components/learning/LensExamTask";
import { LensExperimentTask } from "@/components/learning/LensExperimentTask";
import { LensExplainTask } from "@/components/learning/LensExplainTask";
import { LensHelpPanel } from "@/components/learning/LensHelpPanel";
import { LensObserveTask } from "@/components/learning/LensObserveTask";
import { LensPredictTask } from "@/components/learning/LensPredictTask";
import { LensRayConstruction } from "@/components/learning/LensRayConstruction";
import { LensReviewBanner } from "@/components/learning/LensReviewBanner";
import { LensTaskFrame } from "@/components/learning/LensTaskFrame";
import { LensTransferTask } from "@/components/learning/LensTransferTask";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { useConvexLensLearningSession } from "@/hooks/useConvexLensLearningSession";
import { useTutor } from "@/hooks/useTutor";
import {
  LENS_COPY,
  LENS_EXAM_COPY,
  LENS_FOOTER,
  LENS_PHASE_STAGES,
  LENS_STAGE_LABELS,
  LENS_STAGE_PROMPTS,
  LENS_TASK_FRAMES,
  lensChangedVariable,
  lensExperimentTitle,
  lensPredictQuestion,
  lensReflectionPrompt,
} from "@/lib/content/convex-lens-optical-bench";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  canCommitLensAiOffResponse,
  currentLensAiOffChallengeId,
  isLensAiOffSessionOpen,
  retryLensAiOffDraft,
} from "@/lib/learning/lens-ai-off";
import { emptyLensDescribeInput } from "@/lib/learning/lens-describe";
import {
  buildLensExamAttempt,
  canCommitLensExamAttempt,
  currentLensExamPatternId,
  emptyLensExamDraft,
  isLensExamSessionOpen,
  lensExamPattern,
  nextLensExamDraft,
  summarizeLensExamAttempt,
} from "@/lib/learning/lens-exam";
import {
  activeIncompleteLensEvidence,
  activeLensExperimentId,
  asLensObservedResult,
  emptyLensObservedResult,
  firstClosedLensEvidence,
  hasCompleteLensObservedResult,
} from "@/lib/learning/lens-experiment";
import { emptyLensExplainInput } from "@/lib/learning/lens-explain";
import { lensFeedbackForFailureKind, lensTransferFeedback } from "@/lib/learning/lens-feedback";
import {
  lensHelpAllowed,
  lensHelpPrompts,
  lensHelpState,
} from "@/lib/learning/lens-help-intents";
import {
  draftToConvexLensAttempt,
  emptyLensModelDraft,
  hasCompletedLensModel,
  lensModelMissingLabels,
} from "@/lib/learning/lens-model";
import {
  isLensRevisiting,
  lensDisplayStage,
  lensViewingStage,
} from "@/lib/learning/lens-revisit";
import { hasSufficientLensDescription } from "@/lib/learning/lens-describe";
import { hasSufficientLensExplanation } from "@/lib/learning/lens-explain";
import {
  evaluateLensObservation,
  hasSufficientLensObservation,
} from "@/lib/learning/lens-observe";
import {
  firstCommittedLensPrediction,
  lensPredictLabel,
} from "@/lib/learning/lens-predict";
import {
  LENS_EXAM_DRAFT_KEY,
  LENS_MODEL_DRAFT_KEY,
  LENS_TRANSFER_DRAFT_KEY,
  lensAiOffDraft,
  lensDescribeDraft,
  lensExamDraft,
  lensExplainDraft,
  lensModelDraft,
  lensTransferDraft,
} from "@/lib/learning/lens-scene-data";
import {
  activeLensTransferTargetId,
  emptyLensTransferDraft,
  hasCompletedLensTransfer,
  lensTransferTarget,
} from "@/lib/learning/lens-transfer";
import { canRunLensExperiment } from "@/lib/learning/lens-experiment";
import {
  createInitialConvexLensState,
  isConvexLensSceneState,
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_ORDER,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";
import { LearningStage, type ExamAttempt } from "@/types/learning";

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
    saveAiOffDraft,
    saveAiOffIndependentResponse,
    saveAiOffPostCheck,
    startOver,
    canGoBack,
  } = useConvexLensLearningSession();
  const tutor = useTutor(session);

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [observeNeedMore, setObserveNeedMore] = useState(false);
  const [describe, setDescribe] = useState(emptyLensDescribeInput());
  const [describeNeedStructure, setDescribeNeedStructure] = useState(false);
  const [predictOutcome, setPredictOutcome] = useState("");
  const [predictReason, setPredictReason] = useState("");
  const [predictNeedMore, setPredictNeedMore] = useState(false);
  const [observed, setObserved] = useState(emptyLensObservedResult());
  const [comparison, setComparison] = useState<"" | "same" | "different" | "partial">("");
  const [reflection, setReflection] = useState("");
  const [observedNeedMore, setObservedNeedMore] = useState(false);
  const [explain, setExplain] = useState(emptyLensExplainInput());
  const [explainNeedMore, setExplainNeedMore] = useState(false);
  const [modelDraft, setModelDraft] = useState(emptyLensModelDraft());
  const [modelNeedStructure, setModelNeedStructure] = useState(false);
  const [transferDraft, setTransferDraft] = useState(emptyLensTransferDraft());
  const [transferNeedMore, setTransferNeedMore] = useState(false);
  const [examDraft, setExamDraft] = useState(emptyLensExamDraft());
  const [examNeedSteps, setExamNeedSteps] = useState(false);
  const [aiOffDraft, setAiOffDraft] = useState(
    session ? lensAiOffDraft(session) : undefined,
  );
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
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
        !hasSufficientLensObservation(session.observations),
    );
    const draft = lensDescribeDraft(session) ?? emptyLensDescribeInput();
    const latestDescription = session.descriptions.at(-1);
    setDescribe({
      ...draft,
      studentDescription: latestDescription?.text ?? draft.studentDescription,
    });
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
    const latestModel = session.modelAttempts.at(-1);
    setModelDraft(
      session.sceneData[LENS_MODEL_DRAFT_KEY]
        ? lensModelDraft(session)
        : emptyLensModelDraft(),
    );
    setModelNeedStructure(
      session.stage === LearningStage.MODEL &&
        Boolean(latestModel) &&
        !hasCompletedLensModel(session.modelAttempts),
    );
    const transfer = lensTransferDraft(session);
    const activeTarget = activeLensTransferTargetId(session.transferAttempts);
    setTransferDraft(
      session.sceneData[LENS_TRANSFER_DRAFT_KEY]
        ? { ...transfer, targetId: activeTarget }
        : emptyLensTransferDraft(activeTarget),
    );
    const latestTransfer = session.transferAttempts.at(-1);
    setTransferNeedMore(
      session.stage === LearningStage.TRANSFER &&
        Boolean(latestTransfer) &&
        latestTransfer?.accepted !== true,
    );
    setExamDraft(
      session.sceneData[LENS_EXAM_DRAFT_KEY]
        ? lensExamDraft(session)
        : emptyLensExamDraft(),
    );
    setAiOffDraft(lensAiOffDraft(session));
  }, [session]);

  const experimentKey = session
    ? experimentKeyFor(lensDisplayStage(session), session)
    : "";
  if (session && experimentKey !== formKey) {
    setFormKey(experimentKey);
    const experimentId = activeExperimentId(session, lensDisplayStage(session));
    const prediction = experimentId
      ? firstCommittedLensPrediction(session.predictions, experimentId)
      : undefined;
    const evidence = experimentId
      ? activeIncompleteLensEvidence(session, experimentId) ??
        firstClosedLensEvidence(session, experimentId)
      : undefined;
    setPredictOutcome(prediction?.prediction ?? "");
    setPredictReason(prediction?.reasoning ?? "");
    setPredictNeedMore(false);
    setObserved(asLensObservedResult(evidence?.observedResult));
    setComparison(
      evidence?.comparison === "same" ||
        evidence?.comparison === "different" ||
        evidence?.comparison === "partial"
        ? evidence.comparison
        : "",
    );
    setReflection(evidence?.reflection ?? "");
    setObservedNeedMore(false);
  }

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
  const authoritativeComplete = session.stage === LearningStage.COMPLETE;
  const observeComplete = hasSufficientLensObservation(session.observations);
  const describeComplete = hasSufficientLensDescription(session.descriptions);
  const explainComplete = hasSufficientLensExplanation(session.explanations);
  const transferComplete = hasCompletedLensTransfer(session.transferAttempts);
  const activeExperiment = activeExperimentId(session, displayStage);
  const activeEvidence = activeExperiment
    ? activeIncompleteLensEvidence(session, activeExperiment) ??
      firstClosedLensEvidence(session, activeExperiment)
    : undefined;
  const committedPrediction = activeExperiment
    ? firstCommittedLensPrediction(session.predictions, activeExperiment)
    : undefined;
  const predictionLocked = Boolean(committedPrediction);
  const canRun = Boolean(
    activeExperiment && canRunLensExperiment(session, activeExperiment),
  );
  const hasRun = Boolean(activeEvidence?.interventionAt);
  const latestModel = session.modelAttempts.at(-1);
  const latestTransfer = session.transferAttempts.at(-1);
  const transferTarget = lensTransferTarget(transferDraft.targetId);
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
    aiOffDraft.step === "post-check" && latestAiOffAttempt
      ? "post-check"
      : aiOffDraft.step;

  const physicsState = isConvexLensSceneState(session.physicsState.state)
    ? session.physicsState.state
    : createInitialConvexLensState();
  const constructed = draftToConvexLensAttempt(modelDraft);
  const hideScene = isExam || isAiOff || isComplete || isTransfer;
  const scene = hideScene ? undefined : (
    <div className="w-full max-w-3xl space-y-3">
      <ConvexLensOpticalBench
        state={physicsState}
        frozen={isModel}
        showOfficialImage={!isModel}
        hideOfficialRays
        studentRays={isModel ? constructed?.rays : undefined}
      />
    </div>
  );

  const predictTask = activeExperiment ? (
    <LensPredictTask
      question={lensPredictQuestion(activeExperiment)}
      outcome={predictOutcome}
      reason={predictReason}
      committedLabel={
        committedPrediction ? lensPredictLabel(committedPrediction.prediction) : null
      }
      locked={predictionLocked && (isExperiment || isPredict)}
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
        {LENS_COPY.landingTitle}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{LENS_COPY.landingBody}</p>
    </div>
  ) : isObserve ? (
    <LensObserveTask
      selectedOptionIds={selectedOptionIds}
      onToggle={(optionId) => {
        setSelectedOptionIds((current) =>
          current.includes(optionId)
            ? current.filter((item) => item !== optionId)
            : [...current, optionId],
        );
      }}
      onPlayDemo={markDemoWatched}
      onMoveScreen={() => setScreenAtImagePlane(!physicsState.screenAtImagePlane)}
      screenAtImagePlane={physicsState.screenAtImagePlane}
      onSubmit={() => {
        saveObservation(selectedOptionIds);
        if (!evaluateLensObservation(selectedOptionIds).sufficient) {
          setObserveNeedMore(true);
        }
      }}
      needMore={observeNeedMore}
      saved={observeComplete}
      reviewOnly={revisiting}
    />
  ) : isDescribe ? (
    <LensDescribeTask
      value={describe}
      onChange={setDescribe}
      onSubmit={() => saveDescription(describe)}
      needStructure={describeNeedStructure && !describeComplete}
      reviewOnly={revisiting}
    />
  ) : isPredict && activeExperiment ? (
    predictTask
  ) : isExperiment && activeExperiment ? (
    <div className="space-y-6">
      {!predictionLocked ? predictTask : null}
      <LensExperimentTask
        experimentId={activeExperiment}
        title={lensExperimentTitle(activeExperiment)}
        changedVariable={lensChangedVariable(activeExperiment)}
        committedPrediction={
          committedPrediction
            ? `${lensPredictLabel(committedPrediction.prediction)}。${committedPrediction.reasoning}`
            : null
        }
        canRun={canRun}
        hasRun={hasRun}
        observed={observed}
        comparison={comparison}
        reflection={reflection}
        reflectionPrompt={lensReflectionPrompt(activeExperiment)}
        onRun={() => runExperiment(activeExperiment)}
        onObservedChange={setObserved}
        onSaveObserved={() => {
          if (!hasCompleteLensObservedResult(observed)) {
            setObservedNeedMore(true);
            return;
          }
          setObservedNeedMore(false);
          saveObservedResult(activeExperiment, observed);
        }}
        onComparisonChange={(value) =>
          setComparison(value as "" | "same" | "different" | "partial")
        }
        onSaveComparison={() => {
          if (comparison === "same" || comparison === "different" || comparison === "partial") {
            saveComparison(activeExperiment, comparison);
          }
        }}
        onReflectionChange={setReflection}
        onSaveReflection={() => {
          if (reflection.trim().length < 2) {
            return;
          }
          saveReflection(activeExperiment, reflection);
        }}
        observedNeedMore={observedNeedMore}
        reviewOnly={revisiting}
      />
    </div>
  ) : isExplain ? (
    <LensExplainTask
      value={explain}
      needMore={explainNeedMore && !explainComplete}
      onChange={(next) => {
        setExplain(next);
        saveExplainDraft(next);
      }}
      onSubmit={() => saveExplanation(explain)}
      reviewOnly={revisiting}
    />
  ) : isModel ? (
    <LensRayConstruction
      draft={modelDraft}
      feedback={
        latestModel && !latestModel.correctStructure
          ? lensFeedbackForFailureKind(
              latestModel.failureKinds?.[0],
              lensModelMissingLabels(modelDraft),
            )
          : modelNeedStructure
            ? lensFeedbackForFailureKind(
                latestModel?.failureKinds?.[0],
                lensModelMissingLabels(modelDraft),
              )
            : null
      }
      onChange={(next) => {
        setModelDraft(next);
        saveModelDraft(next);
      }}
      onSubmit={() => {
        if (lensModelMissingLabels(modelDraft).length > 0) {
          setModelNeedStructure(true);
        }
        saveModelAttempt(modelDraft);
      }}
      reviewOnly={revisiting}
    />
  ) : isTransfer && transferTarget && (!transferComplete || revisiting) ? (
    <LensTransferTask
      target={transferTarget}
      draft={transferDraft}
      onChange={(next) => {
        setTransferDraft(next);
        saveTransferDraft(next);
      }}
      onSubmit={() => saveTransferAttempt(transferDraft)}
      needMore={transferNeedMore}
      lastFailure={
        latestTransfer && latestTransfer.accepted !== true
          ? lensTransferFeedback(latestTransfer.failureKinds?.[0]).message
          : null
      }
      reviewOnly={revisiting}
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
        if (!canCommitLensExamAttempt(input)) {
          setExamNeedSteps(true);
          return;
        }
        setExamNeedSteps(false);
        saveExamAttempt(input);
        setExamDraft(
          nextLensExamDraft(
            [...session.examAttempts, buildLensExamAttempt(input)],
            examDraft,
            examPatternId,
          ),
        );
      }}
      onNext={() => {
        const next = retireLensExamDraft(session.examAttempts, examDraft);
        setExamDraft(next);
        saveExamDraft(next);
      }}
      onRevealHint={() => undefined}
    />
  ) : isAiOff && aiOffOpen ? (
    <LensAiOffTask
      draft={{ ...aiOffDraft, currentChallengeId: aiOffChallengeId }}
      questionIndex={aiOffQuestionIndex}
      totalCount={aiOffDraft.challengeIds.length}
      step={aiOffStep}
      committed={latestAiOffAttempt}
      needResponse={aiOffNeedResponse}
      onChange={(next) => {
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
      onCommit={() => {
        if (!canCommitLensAiOffResponse({ ...aiOffDraft, currentChallengeId: aiOffChallengeId })) {
          setAiOffNeedResponse(true);
          return;
        }
        setAiOffNeedResponse(false);
        saveAiOffIndependentResponse({
          ...aiOffDraft,
          currentChallengeId: aiOffChallengeId,
        });
        setAiOffDraft({
          ...aiOffDraft,
          currentChallengeId: aiOffChallengeId,
          step: "post-check",
          postCheckSelections: [],
        });
      }}
      onSubmitPostCheck={() => {
        saveAiOffPostCheck({
          challengeId: aiOffChallengeId,
          postCheckIds: aiOffDraft.postCheckSelections,
        });
      }}
      onRetry={() => {
        const next = retryLensAiOffDraft(aiOffDraft, aiOffChallengeId);
        setAiOffDraft(next);
        saveAiOffDraft(next);
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
  const help = lensHelpState(session, displayStage);
  const showHelp =
    lensHelpAllowed(displayStage) && !revisiting && !authoritativeAiOff;
  const framedTask = (
    <div className="space-y-5">
      {revisiting && viewingStage ? (
        <LensReviewBanner
          viewingStage={viewingStage}
          authoritativeStage={session.stage}
          onReturn={returnToProgress}
        />
      ) : null}
      {frame && !isEntry && !isAiOff && !isComplete ? (
        <LensTaskFrame
          context={frame.context}
          focus={frame.focus}
          action={frame.action}
        />
      ) : null}
      {task}
      {showHelp ? (
        <LensHelpPanel
          intentId={help.intentId}
          prompts={help.intentId ? lensHelpPrompts(help.intentId, help.revealed) : []}
          onSelectIntent={selectHelpIntent}
          onRevealNext={revealHelpNext}
        />
      ) : null}
    </div>
  );

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
      stageLabels={LENS_STAGE_LABELS}
      stagePrompts={revisiting ? {} : LENS_STAGE_PROMPTS}
      progressStages={[...LENS_PHASE_STAGES]}
      scene={scene}
      task={framedTask}
      tutor={
        tutor.allowed &&
        !authoritativeAiOff &&
        !authoritativeComplete &&
        !revisiting ? (
          <TutorPanel
            message={tutor.message}
            loading={tutor.loading}
            onAsk={() => {
              void tutor.askTutor(tutorStudentText);
            }}
          />
        ) : null
      }
      examNotice={
        displayStage === LearningStage.EXAM && !revisiting
          ? LENS_EXAM_COPY.notice
          : undefined
      }
      actions={
        isEntry ? (
          <Button size="lg" onClick={startLesson} aria-label={LENS_COPY.startLesson}>
            {LENS_COPY.startLesson}
          </Button>
        ) : (
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
