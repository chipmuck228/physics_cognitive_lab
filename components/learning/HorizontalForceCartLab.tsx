"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { CartAiOffTask } from "@/components/learning/CartAiOffTask";
import { CartCompleteView } from "@/components/learning/CartCompleteView";
import { CartDescribeTask } from "@/components/learning/CartDescribeTask";
import { CartExamTask } from "@/components/learning/CartExamTask";
import { CartExplainTask } from "@/components/learning/CartExplainTask";
import { CartExperimentTask } from "@/components/learning/CartExperimentTask";
import { CartModelBoard } from "@/components/learning/CartModelBoard";
import { CartObserveTask } from "@/components/learning/CartObserveTask";
import { CartPredictTask } from "@/components/learning/CartPredictTask";
import { CartTransferTask } from "@/components/learning/CartTransferTask";
import { LearningShell } from "@/components/learning/LearningShell";
import { HorizontalForceCart } from "@/components/physics/cart/HorizontalForceCart";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { useCartLearningSession } from "@/hooks/useCartLearningSession";
import { useTutor } from "@/hooks/useTutor";
import {
  CART_COPY,
  CART_EXAM_COPY,
  CART_EXPERIMENT_QUESTIONS,
  CART_EXPERIMENT_TITLES,
  CART_FOOTER,
  CART_PHASE3_STAGES,
  CART_REFLECTION_PROMPTS,
  CART_STAGE_LABELS,
  CART_STAGE_PROMPTS,
} from "@/lib/content/horizontal-force-cart";
import {
  emptyCartDescribeInput,
  hasSufficientCartDescription,
  type CartDescribeInput,
} from "@/lib/learning/cart-describe";
import {
  emptyCartExplainInput,
  hasSufficientCartExplanation,
  type CartExplainInput,
} from "@/lib/learning/cart-explain";
import {
  activeCartExperimentId,
  activeIncompleteCartEvidence,
  asCartObservedResult,
  canRunCartExperiment,
  cartClosedExperimentReflection,
  emptyCartObservedResult,
  firstClosedCartEvidence,
  hasCompleteCartObservedResult,
  type CartObservedResult,
} from "@/lib/learning/cart-experiment";
import {
  cartAiOffAttemptsFor,
  currentCartAiOffChallengeId,
  emptyCartAiOffDraft,
  isCartAiOffSessionOpen,
  latestCartAiOffAttempt,
  retryCartAiOffDraft,
  type CartAiOffDraft,
} from "@/lib/learning/cart-ai-off";
import {
  buildCartExamAttempt,
  cartExamPattern,
  currentCartExamPatternId,
  emptyCartExamDraft,
  isCartExamSessionOpen,
  nextCartExamDraft,
  retireCartExamDraft,
  summarizeCartExamAttempt,
  type CartExamDraft,
} from "@/lib/learning/cart-exam";
import {
  cartModelDraftFromAttempt,
  emptyCartModelDraft,
  hasCompletedCartModel,
  summarizeCartModelAttempt,
  type CartModelDraft,
} from "@/lib/learning/cart-model";
import { hasSufficientCartObservation } from "@/lib/learning/cart-observe";
import {
  cartPredictLabel,
  firstCommittedCartPrediction,
} from "@/lib/learning/cart-predict";
import { nextCartHint, revealedCartHints } from "@/lib/learning/cart-hint-ladder";
import {
  CART_AI_OFF_DRAFT_KEY,
  CART_EXAM_DRAFT_KEY,
  CART_MODEL_DRAFT_KEY,
  CART_TRANSFER_DRAFT_KEY,
  cartAiOffDraft,
  cartDescribeDraft,
  cartExamDraft,
  cartExplainDraft,
  cartModelDraft,
  cartTransferDraft,
} from "@/lib/learning/cart-scene-data";
import {
  CART_TRANSFER_TARGET_IDS,
  activeCartTransferTargetId,
  cartTransferDraftFromAttempt,
  cartTransferTarget,
  emptyCartTransferDraft,
  hasAcceptedCartFullModel,
  hasCompletedCartTransfer,
  summarizeCartTransferAttempt,
  type CartTransferDraft,
  type CartTransferJudgment,
} from "@/lib/learning/cart-transfer";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  CART_EXPERIMENT_A,
  CART_EXPERIMENT_B,
  CART_EXPERIMENT_C,
  createRestingCartState,
  isCartState,
  runObserveDemo,
  type CartExperimentId,
  type CartState,
} from "@/lib/physics/horizontal-force-cart";
import type { CartModelCaseId } from "@/lib/content/horizontal-force-cart";
import { LearningStage } from "@/types/learning";
import { TransferMode } from "@/types/physics-model";

export function HorizontalForceCartLab() {
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
  } = useCartLearningSession();
  const tutor = useTutor(session);

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [observeNeedMore, setObserveNeedMore] = useState(false);
  const [describe, setDescribe] = useState<CartDescribeInput>(emptyCartDescribeInput());
  const [describeNeedStructure, setDescribeNeedStructure] = useState(false);
  const [predictOutcome, setPredictOutcome] = useState("");
  const [predictReason, setPredictReason] = useState("");
  const [predictNeedMore, setPredictNeedMore] = useState(false);
  const [observed, setObserved] = useState<CartObservedResult>(emptyCartObservedResult());
  const [comparison, setComparison] = useState<"" | "same" | "different" | "partial">("");
  const [reflection, setReflection] = useState("");
  const [explain, setExplain] = useState<CartExplainInput>(emptyCartExplainInput());
  const [explainNeedMore, setExplainNeedMore] = useState(false);
  const [modelDraft, setModelDraft] = useState<CartModelDraft>(emptyCartModelDraft());
  const [modelNeedStructure, setModelNeedStructure] = useState(false);
  const [transferDraft, setTransferDraft] = useState<CartTransferDraft>(
    emptyCartTransferDraft(),
  );
  const [transferNeedMore, setTransferNeedMore] = useState(false);
  const [examDraft, setExamDraft] = useState<CartExamDraft>(emptyCartExamDraft);
  const [examNeedSteps, setExamNeedSteps] = useState(false);
  const [aiOffDraft, setAiOffDraft] = useState<CartAiOffDraft>(emptyCartAiOffDraft);
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
  const [aiOffNeedPostCheck, setAiOffNeedPostCheck] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [formKey, setFormKey] = useState("");

  const demoFrames = useMemo(() => runObserveDemo(), []);
  const demoState = demoFrames[demoIndex] ?? demoFrames[0] ?? createRestingCartState();

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
        !hasSufficientCartObservation(session.observations),
    );

    const draft = cartDescribeDraft(session) ?? emptyCartDescribeInput();
    const latestDescription = session.descriptions.at(-1);
    setDescribe({
      ...draft,
      studentDescription: latestDescription?.text ?? draft.studentDescription,
    });
    setDescribeNeedStructure(
      session.stage === LearningStage.DESCRIBE &&
        Boolean(latestDescription) &&
        !hasSufficientCartDescription(session.descriptions),
    );

    setExplain(cartExplainDraft(session));
    const latestExplanation = session.explanations.at(-1);
    setExplainNeedMore(
      session.stage === LearningStage.EXPLAIN &&
        Boolean(latestExplanation) &&
        !hasSufficientCartExplanation(session.explanations),
    );

    const latestModel = session.modelAttempts.at(-1);
    setModelDraft(
      session.sceneData[CART_MODEL_DRAFT_KEY]
        ? cartModelDraft(session)
        : latestModel
          ? cartModelDraftFromAttempt(latestModel)
          : emptyCartModelDraft(),
    );
    setModelNeedStructure(
      session.stage === LearningStage.MODEL &&
        Boolean(latestModel) &&
        !hasCompletedCartModel(session.modelAttempts),
    );

    const transfer = cartTransferDraft(session);
    const activeTarget = activeCartTransferTargetId(
      session.transferAttempts,
      transfer.targetId,
    );
    const latestTransfer = [...session.transferAttempts]
      .reverse()
      .find((attempt) => (attempt.targetId ?? attempt.scenarioId) === activeTarget);
    setTransferDraft(
      session.sceneData[CART_TRANSFER_DRAFT_KEY]
        ? { ...transfer, targetId: activeTarget }
        : latestTransfer && latestTransfer.accepted !== true
          ? cartTransferDraftFromAttempt(latestTransfer)
          : emptyCartTransferDraft(activeTarget),
    );
    setTransferNeedMore(
      session.stage === LearningStage.TRANSFER &&
        Boolean(latestTransfer) &&
        latestTransfer?.accepted !== true,
    );

    setExamDraft(
      session.sceneData[CART_EXAM_DRAFT_KEY]
        ? cartExamDraft(session)
        : emptyCartExamDraft(),
    );
    setAiOffDraft(
      session.sceneData[CART_AI_OFF_DRAFT_KEY]
        ? cartAiOffDraft(session)
        : emptyCartAiOffDraft(),
    );
  }, [session]);

  const experimentKey = session ? experimentKeyFor(session.stage, session) : "";
  if (session && experimentKey !== formKey) {
    setFormKey(experimentKey);
    const experimentId = activeExperimentId(session);
    const prediction = experimentId
      ? firstCommittedCartPrediction(session.predictions, experimentId)
      : undefined;
    const evidence = experimentId
      ? activeIncompleteCartEvidence(session, experimentId) ??
        firstClosedCartEvidence(session, experimentId)
      : undefined;
    setPredictOutcome(prediction?.prediction ?? "");
    setPredictReason(prediction?.reasoning ?? "");
    setPredictNeedMore(false);
    setObserved(asCartObservedResult(evidence?.observedResult));
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
  const observeComplete = hasSufficientCartObservation(session.observations);
  const describeComplete = hasSufficientCartDescription(session.descriptions);
  const explainComplete = hasSufficientCartExplanation(session.explanations);
  const modelComplete = hasCompletedCartModel(session.modelAttempts);
  const transferComplete = hasCompletedCartTransfer(session.transferAttempts);
  const activeExperiment = activeExperimentId(session);
  const activeEvidence = activeExperiment
    ? activeIncompleteCartEvidence(session, activeExperiment) ??
      firstClosedCartEvidence(session, activeExperiment)
    : undefined;
  const committedPrediction = activeExperiment
    ? firstCommittedCartPrediction(session.predictions, activeExperiment)
    : undefined;
  const predictionLocked = Boolean(
    committedPrediction && activeEvidence?.interventionAt,
  );
  const canRun = Boolean(
    activeExperiment && canRunCartExperiment(session, activeExperiment),
  );
  const hasRun = Boolean(activeEvidence?.interventionAt);
  const observedSaved = hasCompleteCartObservedResult(activeEvidence?.observedResult);
  const comparisonSaved = Boolean(
    activeEvidence?.comparison === "same" ||
      activeEvidence?.comparison === "different" ||
      activeEvidence?.comparison === "partial",
  );
  const evidenceSame = cartClosedExperimentReflection(session, CART_EXPERIMENT_A);
  const evidenceOpposite = cartClosedExperimentReflection(session, CART_EXPERIMENT_B);
  const evidenceZero = cartClosedExperimentReflection(session, CART_EXPERIMENT_C);
  const hints = revealedCartHints(session.events, session.stage);
  const canRevealHint = Boolean(nextCartHint(session.events, session.stage));
  const latestModel = session.modelAttempts.at(-1);
  const latestTransfer = session.transferAttempts.at(-1);
  const transferTarget = cartTransferTarget(transferDraft.targetId);
  const canRetryMedium =
    isTransfer &&
    !hasAcceptedCartFullModel(session.transferAttempts) &&
    transferDraft.targetId !== CART_TRANSFER_TARGET_IDS.ball;
  const examOpen = isCartExamSessionOpen(session.examAttempts, examDraft);
  const examPatternId =
    currentCartExamPatternId(session.examAttempts, examDraft) ??
    examDraft.currentPatternId;
  const examPattern = cartExamPattern(examPatternId);
  const examQuestionIndex = Math.max(examDraft.patternIds.indexOf(examPatternId), 0);
  const latestExamAttempt = [...session.examAttempts]
    .reverse()
    .find((attempt) => (attempt.patternId ?? attempt.questionId) === examPatternId);
  const examCanRetry = Boolean(
    latestExamAttempt &&
      latestExamAttempt.correct !== true &&
      examOpen,
  );
  const aiOffOpen = isCartAiOffSessionOpen(session.independentAssessment, aiOffDraft);
  const aiOffChallengeId =
    currentCartAiOffChallengeId(session.independentAssessment, aiOffDraft) ??
    aiOffDraft.currentChallengeId;
  const aiOffQuestionIndex = Math.max(
    aiOffDraft.challengeIds.indexOf(aiOffChallengeId),
    0,
  );
  const latestAiOffAttempt =
    latestCartAiOffAttempt(session.independentAssessment, aiOffChallengeId) ??
    cartAiOffAttemptsFor(session.independentAssessment, aiOffChallengeId).at(-1) ??
    null;
  const aiOffStep =
    aiOffDraft.step === "post-check" && latestAiOffAttempt
      ? "post-check"
      : aiOffDraft.step;

  const cartState: CartState = isObserve
    ? demoState
    : isCartState(session.physicsState.state)
      ? session.physicsState.state
      : createRestingCartState();

  const scene =
    isExam || isAiOff || isComplete ? undefined : (
    <div className="w-full max-w-xl space-y-3">
      <HorizontalForceCart state={cartState} animate={!isEntry} />
    </div>
  );

  const task = isEntry ? (
    <div className="mx-auto max-w-md text-center lg:text-left">
      <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        {CART_COPY.headline}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{CART_COPY.subheadline}</p>
    </div>
  ) : isObserve ? (
    <CartObserveTask
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
    <CartDescribeTask
      value={describe}
      onChange={setDescribe}
      onSubmit={() => saveDescription(describe)}
      needStructure={describeNeedStructure && !describeComplete}
    />
  ) : isPredict && activeExperiment ? (
    <CartPredictTask
      question={CART_EXPERIMENT_QUESTIONS[activeExperiment]}
      outcome={predictOutcome}
      reason={predictReason}
      committedLabel={
        committedPrediction ? cartPredictLabel(committedPrediction.prediction) : null
      }
      locked={predictionLocked}
      needMore={predictNeedMore}
      onOutcomeChange={setPredictOutcome}
      onReasonChange={setPredictReason}
      onCommit={() => {
        if (!activeExperiment) {
          return;
        }
        commitPrediction(activeExperiment, predictOutcome, predictReason);
        if (!predictOutcome || predictReason.trim().length < 2) {
          setPredictNeedMore(true);
        }
      }}
    />
  ) : isExperiment && activeExperiment ? (
    <div className="space-y-6">
      {!committedPrediction ? (
        <CartPredictTask
          question={CART_EXPERIMENT_QUESTIONS[activeExperiment]}
          outcome={predictOutcome}
          reason={predictReason}
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
      ) : (
        <CartPredictTask
          question={CART_EXPERIMENT_QUESTIONS[activeExperiment]}
          outcome={predictOutcome}
          reason={predictReason}
          committedLabel={cartPredictLabel(committedPrediction.prediction)}
          locked={predictionLocked}
          needMore={false}
          onOutcomeChange={setPredictOutcome}
          onReasonChange={setPredictReason}
          onCommit={() => undefined}
        />
      )}
      <CartExperimentTask
        title={CART_EXPERIMENT_TITLES[activeExperiment]}
        canRun={canRun}
        hasRun={hasRun}
        showFrictionNote={activeExperiment === CART_EXPERIMENT_C && hasRun}
        observed={observed}
        comparison={comparison}
        reflection={reflection}
        reflectionPrompt={CART_REFLECTION_PROMPTS[activeExperiment]}
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
    <CartExplainTask
      value={explain}
      needMore={explainNeedMore && !explainComplete}
      evidenceSame={evidenceSame}
      evidenceOpposite={evidenceOpposite}
      evidenceZero={evidenceZero}
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
    <CartModelBoard
      draft={modelDraft}
      feedback={
        latestModel && !latestModel.correctStructure
          ? summarizeCartModelAttempt(latestModel)
          : null
      }
      needStructure={modelNeedStructure && !modelComplete}
      evidenceSame={evidenceSame}
      evidenceOpposite={evidenceOpposite}
      evidenceZero={evidenceZero}
      hints={hints}
      canRevealHint={canRevealHint}
      onCaseChange={(caseId: CartModelCaseId, next) => {
        const updated = {
          ...modelDraft,
          cases: { ...modelDraft.cases, [caseId]: next },
        };
        setModelDraft(updated);
        saveModelDraft(updated);
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
    <CartTransferTask
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
          ? summarizeCartTransferAttempt(latestTransfer)
          : null
      }
      needMore={transferNeedMore}
      hints={hints}
      canRevealHint={canRevealHint}
      canRetryMedium={canRetryMedium}
      onJudgmentChange={(relationId, judgment: CartTransferJudgment) => {
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
        const updated = emptyCartTransferDraft(CART_TRANSFER_TARGET_IDS.ball);
        setTransferDraft(updated);
        saveTransferDraft(updated);
      }}
    />
  ) : isExam && examOpen && examPattern ? (
    <CartExamTask
      pattern={examPattern}
      questionIndex={examQuestionIndex}
      totalCount={examDraft.patternIds.length}
      step={examDraft.step}
      representation={examDraft.representation}
      modelRecognition={examDraft.modelRecognition}
      selectedAnswer={examDraft.selectedAnswer}
      reasoning={examDraft.reasoning}
      feedback={
        latestExamAttempt ? summarizeCartExamAttempt(latestExamAttempt) : null
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
          nextCartExamDraft(
            [...session.examAttempts, buildCartExamAttempt(input)],
            examDraft,
            examPatternId,
          ),
        );
      }}
      onNext={() => {
        const next = retireCartExamDraft(session.examAttempts, examDraft);
        setExamDraft(next);
        skipExamRetry(next);
      }}
      onRevealHint={revealHint}
    />
  ) : isAiOff && aiOffOpen ? (
    <CartAiOffTask
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
        const next = retryCartAiOffDraft(aiOffDraft, aiOffChallengeId);
        setAiOffDraft(next);
        saveAiOffDraft(next);
      }}
    />
  ) : isComplete ? (
    <CartCompleteView
      prediction={
        session.predictions.at(-1)?.reasoning?.trim() || "你写下了自己的猜测。"
      }
      experiment={
        session.experimentEvidence.at(-1)?.reflection?.trim() ||
        "你对照了预测和实验结果。"
      }
      model={
        latestModel?.correctStructure
          ? "你连起了当前运动、合力条件和运动状态变化。"
          : "你尝试建立了力和运动的关系。"
      }
      transfer={
        transferComplete
          ? "你用关系和条件判断了新情境，而不是只看外表。"
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
      stageLabels={CART_STAGE_LABELS}
      stagePrompts={CART_STAGE_PROMPTS}
      progressStages={[...CART_PHASE3_STAGES]}
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
      examNotice={isExam ? CART_EXAM_COPY.notice : undefined}
      actions={
        isEntry ? (
          <Button size="lg" onClick={startLesson} aria-label={CART_COPY.startCta}>
            {CART_COPY.startCta}
          </Button>
        ) : (
          <p className="text-sm text-[var(--ink-muted)]">{CART_FOOTER[session.stage]}</p>
        )
      }
      onStartOver={startOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
    />
  );
}

function activeExperimentId(
  session: NonNullable<ReturnType<typeof useCartLearningSession>["session"]>,
): CartExperimentId | null {
  if (session.stage === LearningStage.PREDICT) {
    return CART_EXPERIMENT_A;
  }
  if (session.stage === LearningStage.EXPERIMENT) {
    return activeCartExperimentId(session);
  }
  return null;
}

function experimentKeyFor(
  stage: LearningStage,
  session: NonNullable<ReturnType<typeof useCartLearningSession>["session"]>,
): string {
  if (stage === LearningStage.PREDICT) {
    return CART_EXPERIMENT_A;
  }
  if (stage === LearningStage.EXPERIMENT) {
    return activeCartExperimentId(session) ?? "experiment-done";
  }
  return stage;
}
