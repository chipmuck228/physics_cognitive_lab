"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EngineAiOffTask } from "@/components/learning/EngineAiOffTask";
import { EngineCompleteView } from "@/components/learning/EngineCompleteView";
import { EngineDescribeTask } from "@/components/learning/EngineDescribeTask";
import { EngineExamTask } from "@/components/learning/EngineExamTask";
import { EngineEvidenceDrawer } from "@/components/learning/EngineEvidenceDrawer";
import { EngineExperimentTask } from "@/components/learning/EngineExperimentTask";
import { EngineExplainTask } from "@/components/learning/EngineExplainTask";
import { EngineModelBuilder } from "@/components/learning/EngineModelBuilder";
import { EngineObserveTask } from "@/components/learning/EngineObserveTask";
import { EnginePredictTask } from "@/components/learning/EnginePredictTask";
import { EngineVocabRow } from "@/components/learning/EngineTermTip";
import { EngineTransferPhenomenon } from "@/components/learning/EngineTransferPhenomenon";
import { EngineTransferTask } from "@/components/learning/EngineTransferTask";
import { LearnerWorkspace } from "@/components/learning/LearnerWorkspace";
import { LearningShell } from "@/components/learning/LearningShell";
import { EnginePlaybackControls } from "@/components/physics/engine/EnginePlaybackControls";
import { FourStrokeEngine } from "@/components/physics/engine/FourStrokeEngine";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { useEngineLearningSession } from "@/hooks/useEngineLearningSession";
import { useEngineScenePlayback } from "@/hooks/useEngineScenePlayback";
import { useTutor } from "@/hooks/useTutor";
import {
  ENGINE_COPY,
  ENGINE_DESCRIBE_SNAPSHOTS,
  ENGINE_EXPERIMENT_A,
  ENGINE_EXPERIMENT_B,
  ENGINE_EXAM_COPY,
  ENGINE_FOOTER,
  ENGINE_MODEL_COPY,
  ENGINE_PHASE8_STAGES,
  ENGINE_STAGE_LABELS,
  ENGINE_STAGE_PROMPTS,
  ENGINE_TRANSFER_COPY,
  type EngineSceneExperimentId,
} from "@/lib/content/four-stroke-engine";
import {
  currentEngineAiOffChallengeId,
  canCommitEngineAiOffResponse,
  emptyEngineAiOffDraft,
  ENGINE_AI_OFF_CHALLENGE_IDS,
  ENGINE_AI_OFF_DRAFT_KIND,
  isEngineAiOffSessionOpen,
  latestEngineAiOffAttempt,
  latestEngineAiOffDraft,
  retryEngineAiOffDraft,
  type EngineAiOffDraft,
} from "@/lib/learning/engine-ai-off";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  evaluateEngineDescription,
  hasSufficientEngineDescription,
  type EngineSnapshotAnswer,
} from "@/lib/learning/engine-describe";
import {
  activeEngineExperimentId,
  activeIncompleteEngineEvidence,
  canRunEngineExperiment,
  asEngineObservedResult,
  emptyObservedResult,
  firstClosedEngineEvidence,
  hasClosedEngineExperiment,
  hasCompletedEngineExperiments,
  hasCompleteObservedResult,
  isEngineSceneExperimentId,
  runSceneExperiment,
} from "@/lib/learning/engine-experiment";
import {
  evaluateEngineExplanation,
  latestEngineExplainDraft,
} from "@/lib/learning/engine-explain";
import {
  emptyEngineModelSlots,
  emptyEngineRelationKinds,
  engineModelDraftFromAttempt,
  ENGINE_MODEL_DRAFT_KIND,
  hasCompletedEngineModel,
  latestEngineModelDraft,
  summarizeEngineModelAttempt,
  type EngineRelationKind,
} from "@/lib/learning/engine-model";
import { hasSufficientEngineObservation } from "@/lib/learning/engine-observe";
import {
  activeEngineTransferTargetId,
  emptyEngineTransferDraft,
  emptyEngineTransferJudgments,
  engineTransferDraftFromAttempt,
  engineTransferTarget,
  ENGINE_TRANSFER_DRAFT_KIND,
  ENGINE_TRANSFER_TARGET_IDS,
  hasCompletedEngineTransfer,
  latestAttemptForTarget,
  latestEngineTransferDraft,
  summarizeEngineTransferAttempt,
  type EngineTransferJudgment,
  type EngineTransferRelationId,
} from "@/lib/learning/engine-transfer";
import {
  buildEngineExamAttempt,
  canRetryEngineExamItem,
  currentEngineExamPatternId,
  emptyEngineExamDraft,
  engineExamPattern,
  ENGINE_EXAM_DRAFT_KIND,
  ENGINE_EXAM_PATTERN_IDS,
  isEngineExamSessionOpen,
  latestEngineExamDraft,
  nextEngineExamDraft,
  retireEngineExamDraft,
  summarizeEngineExamAttempt,
  type EngineExamDraft,
} from "@/lib/learning/engine-exam";
import {
  enginePredictReasonForCommit,
  enginePredictStanceFromReason,
  evaluateEnginePrediction,
  firstCommittedEnginePrediction,
  type EnginePredictReasonStance,
} from "@/lib/learning/engine-predict";
import {
  nextEngineHint,
  revealedEngineHints,
} from "@/lib/learning/hint-ladder";
import type { EngineState } from "@/lib/physics/engine";
import { LearningStage, type EngineObservedResult } from "@/types/learning";

export function FourStrokeEngineLab() {
  const {
    session,
    hydrated,
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
    canGoBack,
  } = useEngineLearningSession();
  const tutor = useTutor(session);
  const [scriptedCycle, setScriptedCycle] = useState<EngineState[] | null>(null);
  const playback = useEngineScenePlayback(scriptedCycle);

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [observeNeedMore, setObserveNeedMore] = useState(false);
  const [snapshots, setSnapshots] = useState<EngineSnapshotAnswer[]>(
    emptySnapshotAnswers,
  );
  const [describeText, setDescribeText] = useState("");
  const [describeNeedStructure, setDescribeNeedStructure] = useState(false);
  const [predictOutcome, setPredictOutcome] = useState("");
  const [predictReason, setPredictReason] = useState("");
  const [predictReasonStance, setPredictReasonStance] = useState<EnginePredictReasonStance>("");
  const [predictNeedMore, setPredictNeedMore] = useState(false);
  const [observed, setObserved] = useState<EngineObservedResult>(emptyObservedResult);
  const [comparison, setComparison] = useState<"" | "same" | "different" | "partial">(
    "",
  );
  const [reflection, setReflection] = useState("");
  const [firstChange, setFirstChange] = useState("");
  const [gasEffect, setGasEffect] = useState("");
  const [mechanicalGain, setMechanicalGain] = useState("");
  const [explainText, setExplainText] = useState("");
  const [explainNeedMore, setExplainNeedMore] = useState(false);
  const [modelSlots, setModelSlots] = useState<string[]>(emptyEngineModelSlots);
  const [relationKinds, setRelationKinds] = useState<Array<EngineRelationKind | "">>(
    emptyEngineRelationKinds,
  );
  const [combustionEnablesConversion, setCombustionEnablesConversion] = useState(false);
  const [selectedModelNode, setSelectedModelNode] = useState<string | null>(null);
  const [modelNeedStructure, setModelNeedStructure] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState<string>(
    ENGINE_TRANSFER_TARGET_IDS.motorcycle,
  );
  const [transferJudgments, setTransferJudgments] = useState(
    emptyEngineTransferJudgments,
  );
  const [transferOrder, setTransferOrder] = useState<string[]>([]);
  const [transferSurfaceCue, setTransferSurfaceCue] = useState(false);
  const [transferText, setTransferText] = useState("");
  const [transferNeedMore, setTransferNeedMore] = useState(false);
  const [examDraft, setExamDraft] = useState<EngineExamDraft>(emptyEngineExamDraft);
  const [examNeedSteps, setExamNeedSteps] = useState(false);
  const [aiOffDraft, setAiOffDraft] = useState<EngineAiOffDraft>(emptyEngineAiOffDraft);
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
  const [aiOffNeedPostCheck, setAiOffNeedPostCheck] = useState(false);
  const [formKey, setFormKey] = useState("");
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const experimentKey = experimentKeyFor(session);
  if (session && experimentKey !== formKey) {
    setFormKey(experimentKey);
    applyExperimentForm(session, experimentKey, {
      setPredictOutcome,
      setPredictReason,
      setPredictReasonStance,
      setPredictNeedMore,
      setObserved,
      setComparison,
      setReflection,
      setScriptedCycle,
    });
  }

  useEffect(() => {
    const current = sessionRef.current;
    if (!current) {
      return;
    }

    const latestObservation = current.observations.at(-1);
    setSelectedOptionIds(latestObservation?.selectedOptionIds ?? []);
    setObserveNeedMore(
      current.stage === LearningStage.OBSERVE &&
        Boolean(latestObservation) &&
        !hasSufficientEngineObservation(current.observations),
    );

    const latestDescription = current.descriptions.at(-1);
    setSnapshots(latestDescription?.engineAnswers ?? emptySnapshotAnswers());
    setDescribeText(latestDescription?.text ?? "");
    setDescribeNeedStructure(
      current.stage === LearningStage.DESCRIBE &&
        Boolean(latestDescription) &&
        !hasSufficientEngineDescription(current.descriptions),
    );

    const explainDraft = latestEngineExplainDraft(current.events);
    const latestExplanation = current.explanations.at(-1);
    setFirstChange(
      explainDraft?.firstChange ?? latestExplanation?.engineAnswers?.firstChange ?? "",
    );
    setGasEffect(
      explainDraft?.gasEffect ?? latestExplanation?.engineAnswers?.gasEffect ?? "",
    );
    setMechanicalGain(
      explainDraft?.mechanicalGain ??
        latestExplanation?.engineAnswers?.mechanicalGain ??
        "",
    );
    setExplainText(
      explainDraft?.studentExplanation ?? latestExplanation?.text ?? "",
    );
    setExplainNeedMore(
      current.stage === LearningStage.EXPLAIN &&
        Boolean(latestExplanation) &&
        latestExplanation?.sufficient !== true,
    );

    const lastAttempt = current.modelAttempts.at(-1);
    const modelDraft =
      latestEngineModelDraft(current.events) ??
      (lastAttempt ? engineModelDraftFromAttempt(lastAttempt) : null);
    setModelSlots(modelDraft?.slots ?? emptyEngineModelSlots());
    setRelationKinds(modelDraft?.relationKinds ?? emptyEngineRelationKinds());
    setCombustionEnablesConversion(modelDraft?.combustionEnablesConversion ?? false);
    setSelectedModelNode(null);
    setModelNeedStructure(
      current.stage === LearningStage.MODEL &&
        Boolean(current.modelAttempts.at(-1)) &&
        !hasCompletedEngineModel(current.modelAttempts),
    );

    const transferDraft = latestEngineTransferDraft(current.events);
    const activeTarget = activeEngineTransferTargetId(
      current.transferAttempts,
      transferDraft?.targetId,
    );
    const lastTransfer = latestAttemptForTarget(current.transferAttempts, activeTarget);
    const restoredTransfer =
      transferDraft && transferDraft.targetId === activeTarget
        ? transferDraft
        : lastTransfer
          ? engineTransferDraftFromAttempt(lastTransfer)
          : emptyEngineTransferDraft(activeTarget);
    setTransferTargetId(activeTarget);
    setTransferJudgments(restoredTransfer.judgments);
    setTransferOrder(restoredTransfer.relationOrder);
    setTransferSurfaceCue(restoredTransfer.surfaceCueSelected);
    setTransferText(restoredTransfer.studentExplanation);
    setTransferNeedMore(
      current.stage === LearningStage.TRANSFER &&
        Boolean(lastTransfer) &&
        lastTransfer?.accepted !== true &&
        !hasCompletedEngineTransfer(current.transferAttempts),
    );

    const restoredExam =
      latestEngineExamDraft(current.events) ?? emptyEngineExamDraft();
    setExamDraft(restoredExam);
    setExamNeedSteps(false);

    const restoredAiOff =
      latestEngineAiOffDraft(current.events) ?? emptyEngineAiOffDraft();
    setAiOffDraft(restoredAiOff);
    setAiOffNeedResponse(false);
    setAiOffNeedPostCheck(false);
  }, [
    session?.sessionId,
    session?.stage,
    session?.transferAttempts.length,
    session?.examAttempts.length,
    session?.independentAssessment?.challengeAttempts?.length,
  ]);

  useEffect(() => {
    if (!session || session.stage !== LearningStage.EXAM) {
      return;
    }
    if (latestEngineExamDraft(session.events)) {
      return;
    }
    saveExamDraft(emptyEngineExamDraft(ENGINE_EXAM_PATTERN_IDS));
  }, [saveExamDraft, session]);

  useEffect(() => {
    if (!session || session.stage !== LearningStage.AI_OFF) {
      return;
    }
    if (latestEngineAiOffDraft(session.events)) {
      return;
    }
    saveAiOffDraft(emptyEngineAiOffDraft(ENGINE_AI_OFF_CHALLENGE_IDS));
  }, [saveAiOffDraft, session]);

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
  const observeComplete = hasSufficientEngineObservation(session.observations);
  const describeComplete = hasSufficientEngineDescription(session.descriptions);
  const experimentsComplete = hasCompletedEngineExperiments(session);
  const modelComplete = hasCompletedEngineModel(session.modelAttempts);
  const transferComplete = hasCompletedEngineTransfer(session.transferAttempts);
  const examOpen = isEngineExamSessionOpen(session.examAttempts, examDraft);
  const examPatternId =
    currentEngineExamPatternId(session.examAttempts, examDraft) ??
    examDraft.currentPatternId;
  const examPattern = engineExamPattern(examPatternId);
  const examQuestionIndex = Math.max(
    0,
    examDraft.patternIds.indexOf(examPatternId),
  );
  const latestExamAttempt = session.examAttempts
    .filter(
      (attempt) => (attempt.patternId ?? attempt.questionId) === examPatternId,
    )
    .at(-1);
  const examCanRetry = canRetryEngineExamItem(session.examAttempts, examPatternId);
  const aiOffOpen = isEngineAiOffSessionOpen(
    session.independentAssessment,
    aiOffDraft,
  );
  const aiOffChallengeId =
    currentEngineAiOffChallengeId(session.independentAssessment, aiOffDraft) ??
    aiOffDraft.currentChallengeId;
  const aiOffQuestionIndex = Math.max(
    0,
    aiOffDraft.challengeIds.indexOf(aiOffChallengeId),
  );
  const latestAiOffAttempt = latestEngineAiOffAttempt(
    session.independentAssessment,
    aiOffChallengeId,
  );
  const aiOffStep =
    aiOffDraft.step === "post-check" && latestAiOffAttempt
      ? "post-check"
      : "response";
  const transferTarget = engineTransferTarget(transferTargetId);
  const latestTransferAttempt = latestAttemptForTarget(
    session.transferAttempts,
    transferTargetId,
  );
  const activeExperiment = isPredict
    ? ENGINE_EXPERIMENT_A
    : activeEngineExperimentId(session);
  const activeEvidence = activeExperiment
    ? activeIncompleteEngineEvidence(session, activeExperiment) ??
      firstClosedEngineEvidence(session, activeExperiment)
    : undefined;
  const committedPrediction = activeExperiment
    ? firstCommittedEnginePrediction(session.predictions, activeExperiment)
    : undefined;
  const awaitingExperimentBPrediction =
    isExperiment &&
    hasClosedEngineExperiment(session, ENGINE_EXPERIMENT_A) &&
    !firstCommittedEnginePrediction(session.predictions, ENGINE_EXPERIMENT_B);
  const evidenceA = firstClosedEngineEvidence(session, ENGINE_EXPERIMENT_A);
  const evidenceB = firstClosedEngineEvidence(session, ENGINE_EXPERIMENT_B);
  const studentEvidenceA = evidenceA?.reflection || observedLabel(evidenceA);
  const studentEvidenceB = evidenceB?.reflection || observedLabel(evidenceB);
  const revealedHints = revealedEngineHints(session.events, session.stage);
  const canRevealHint = Boolean(nextEngineHint(session.events, session.stage));
  const latestModelAttempt = session.modelAttempts.at(-1) ?? null;

  function persistExplainDraft(next: {
    firstChange?: string;
    gasEffect?: string;
    mechanicalGain?: string;
    studentExplanation?: string;
  }) {
    saveExplainDraft({
      firstChange: next.firstChange ?? firstChange,
      gasEffect: next.gasEffect ?? gasEffect,
      mechanicalGain: next.mechanicalGain ?? mechanicalGain,
      studentExplanation: next.studentExplanation ?? explainText,
    });
  }

  function persistModelDraft(next: {
    slots?: string[];
    relationKinds?: Array<EngineRelationKind | "">;
    combustionEnablesConversion?: boolean;
  }) {
    saveModelDraft({
      kind: ENGINE_MODEL_DRAFT_KIND,
      slots: next.slots ?? modelSlots,
      relationKinds: next.relationKinds ?? relationKinds,
      combustionEnablesConversion:
        next.combustionEnablesConversion ?? combustionEnablesConversion,
    });
  }

  function persistTransferDraft(next: {
    targetId?: string;
    judgments?: Record<string, EngineTransferJudgment>;
    relationOrder?: string[];
    surfaceCueSelected?: boolean;
    studentExplanation?: string;
  }) {
    saveTransferDraft({
      kind: ENGINE_TRANSFER_DRAFT_KIND,
      targetId: next.targetId ?? transferTargetId,
      judgments: next.judgments ?? transferJudgments,
      relationOrder: next.relationOrder ?? transferOrder,
      surfaceCueSelected: next.surfaceCueSelected ?? transferSurfaceCue,
      studentExplanation: next.studentExplanation ?? transferText,
    });
  }

  function persistAiOffDraft(next: Partial<EngineAiOffDraft>) {
    const draft: EngineAiOffDraft = {
      kind: ENGINE_AI_OFF_DRAFT_KIND,
      challengeIds: next.challengeIds ?? aiOffDraft.challengeIds,
      currentChallengeId: next.currentChallengeId ?? aiOffDraft.currentChallengeId,
      step: next.step ?? aiOffDraft.step,
      selectedAnswer: next.selectedAnswer ?? aiOffDraft.selectedAnswer,
      reasoning: next.reasoning ?? aiOffDraft.reasoning,
      postCheckSelections: next.postCheckSelections ?? aiOffDraft.postCheckSelections,
      retiredChallengeIds: next.retiredChallengeIds ?? aiOffDraft.retiredChallengeIds,
    };
    setAiOffDraft(draft);
    saveAiOffDraft(draft);
  }

  function persistExamDraft(next: Partial<EngineExamDraft>) {
    const draft: EngineExamDraft = {
      kind: ENGINE_EXAM_DRAFT_KIND,
      patternIds: next.patternIds ?? examDraft.patternIds,
      currentPatternId: next.currentPatternId ?? examDraft.currentPatternId,
      step: next.step ?? examDraft.step,
      representation: next.representation ?? examDraft.representation,
      modelRecognition: next.modelRecognition ?? examDraft.modelRecognition,
      selectedAnswer: next.selectedAnswer ?? examDraft.selectedAnswer,
      reasoning: next.reasoning ?? examDraft.reasoning,
      retiredPatternIds: next.retiredPatternIds ?? examDraft.retiredPatternIds,
    };
    setExamNeedSteps(false);
    setExamDraft(draft);
    saveExamDraft(draft);
  }

  function handleToggleObservation(optionId: string) {
    setObserveNeedMore(false);
    setSelectedOptionIds((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    );
  }

  function handleSaveObservation() {
    const willPass = hasSufficientEngineObservation([
      {
        text: "",
        timestamp: "",
        selectedOptionIds,
      },
    ]);
    saveObservation(selectedOptionIds, playback.watchedFullCycle);
    setObserveNeedMore(!willPass);
  }

  function handleSnapshotChange(
    stroke: EngineSnapshotAnswer["stroke"],
    field: "piston" | "intake" | "exhaust" | "combustion",
    value: string,
  ) {
    setDescribeNeedStructure(false);
    setSnapshots((current) =>
      current.map((item) =>
        item.stroke === stroke ? { ...item, [field]: value } : item,
      ),
    );
  }

  function handleSaveDescription() {
    const evaluation = evaluateEngineDescription({
      snapshots,
      studentDescription: describeText,
    });
    saveDescription({
      snapshots,
      studentDescription: describeText,
    });
    setDescribeNeedStructure(!evaluation.sufficient);
  }

  function handleCommitPrediction(experimentId: EngineSceneExperimentId) {
    if (!predictOutcome) {
      setPredictNeedMore(true);
      return;
    }
    if (!predictReasonStance) {
      setPredictNeedMore(true);
      return;
    }
    const reason = enginePredictReasonForCommit(predictReasonStance, predictReason);
    const evaluation = evaluateEnginePrediction(predictOutcome, reason);
    setPredictNeedMore(!evaluation.sufficient);
    if (!evaluation.sufficient) {
      return;
    }
    commitPrediction(experimentId, predictOutcome, reason);
  }

  function handleRun(experimentId: EngineSceneExperimentId) {
    const result = runExperiment(experimentId);
    if (result) {
      setScriptedCycle(result.states);
    }
  }

  function handleRewatch(experimentId: EngineSceneExperimentId) {
    setScriptedCycle(runSceneExperiment(experimentId).states);
  }

  function handleStartOver() {
    setScriptedCycle(null);
    startOver();
  }

  function handleSaveExplanation() {
    const evaluation = evaluateEngineExplanation({
      firstChange,
      gasEffect,
      mechanicalGain,
      studentExplanation: explainText,
    });
    setExplainNeedMore(!evaluation.sufficient);
    saveExplanation({
      firstChange,
      gasEffect,
      mechanicalGain,
      studentExplanation: explainText,
    });
  }

  function handlePlaceModelNode(index: number) {
    setModelNeedStructure(false);
    const nextSlots = [...modelSlots];
    if (selectedModelNode) {
      const previous = nextSlots[index];
      nextSlots[index] = selectedModelNode;
      setModelSlots(nextSlots);
      setSelectedModelNode(previous || null);
      persistModelDraft({ slots: nextSlots });
      return;
    }
    if (nextSlots[index]) {
      setSelectedModelNode(nextSlots[index]);
      nextSlots[index] = "";
      setModelSlots(nextSlots);
      persistModelDraft({ slots: nextSlots });
    }
  }

  const scene = isExam || isAiOff || isComplete ? undefined : isTransfer ? (
    <EngineTransferPhenomenon targetId={transferTargetId} />
  ) : (
    <div className="w-full max-w-md">
      <div className="rounded-[2rem] bg-[var(--scene)] p-4 sm:p-6">
        <FourStrokeEngine
          state={playback.state}
          motionProgress={playback.motionProgress}
          showStrokeLabel={false}
        />
      </div>
      {!isEntry ? (
        <EnginePlaybackControls
          playing={playback.playing}
          onPlay={playback.play}
          onPause={playback.pause}
          onNext={playback.next}
          onReplay={playback.replay}
        />
      ) : null}
    </div>
  );

  const task = isEntry ? (
    <div className="mx-auto max-w-md text-center lg:text-left">
      <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        {ENGINE_COPY.headline}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{ENGINE_COPY.subheadline}</p>
    </div>
  ) : isObserve ? (
    <EngineObserveTask
      selectedOptionIds={selectedOptionIds}
      onToggle={handleToggleObservation}
      onSubmit={handleSaveObservation}
      needMore={observeNeedMore}
      saved={observeComplete}
    />
  ) : isDescribe ? (
    <EngineDescribeTask
      snapshots={snapshots}
      studentDescription={describeText}
      onSnapshotChange={handleSnapshotChange}
      onDescriptionChange={setDescribeText}
      onSubmit={handleSaveDescription}
      needStructure={describeNeedStructure && !describeComplete}
    />
  ) : isPredict ? (
    <EnginePredictTask
      key={ENGINE_EXPERIMENT_A}
      question={ENGINE_COPY.predictAQuestion}
      outcome={predictOutcome}
      reasonStance={predictReasonStance}
      reason={predictReason}
      needMore={predictNeedMore}
      hideLead
      onOutcomeChange={(value) => {
        setPredictNeedMore(false);
        setPredictOutcome(value);
      }}
      onReasonStanceChange={(value) => {
        setPredictNeedMore(false);
        setPredictReasonStance(value);
        if (value !== "has-idea") {
          setPredictReason("");
        }
      }}
      onReasonChange={(value) => {
        setPredictNeedMore(false);
        setPredictReason(value);
      }}
      onCommit={() => handleCommitPrediction(ENGINE_EXPERIMENT_A)}
    />
  ) : awaitingExperimentBPrediction ? (
    <EnginePredictTask
      key={ENGINE_EXPERIMENT_B}
      question={ENGINE_COPY.predictBQuestion}
      outcome={predictOutcome}
      reasonStance={predictReasonStance}
      reason={predictReason}
      needMore={predictNeedMore}
      hideLead
      onOutcomeChange={(value) => {
        setPredictNeedMore(false);
        setPredictOutcome(value);
      }}
      onReasonStanceChange={(value) => {
        setPredictNeedMore(false);
        setPredictReasonStance(value);
        if (value !== "has-idea") {
          setPredictReason("");
        }
      }}
      onReasonChange={(value) => {
        setPredictNeedMore(false);
        setPredictReason(value);
      }}
      onCommit={() => handleCommitPrediction(ENGINE_EXPERIMENT_B)}
    />
  ) : isExperiment && activeExperiment ? (
    <EngineExperimentTask
      experimentId={activeExperiment}
      evidence={activeEvidence}
      committedPrediction={
        committedPrediction
          ? {
              prediction: committedPrediction.prediction,
              reasoning: committedPrediction.reasoning,
            }
          : undefined
      }
      observed={observed}
      comparison={comparison}
      reflection={reflection}
      canRun={canRunEngineExperiment(session, activeExperiment)}
      onRun={() => handleRun(activeExperiment)}
      onRewatch={() => handleRewatch(activeExperiment)}
      onObservedChange={(field, value) => {
        setObserved((current) => ({ ...current, [field]: value }));
      }}
      onSaveObserved={() => {
        if (!hasCompleteObservedResult(observed)) {
          return;
        }
        saveObservedResult(activeExperiment, observed);
      }}
      onComparisonChange={setComparison}
      onSaveComparison={() => {
        if (!comparison) {
          return;
        }
        saveComparison(activeExperiment, comparison);
      }}
      onReflectionChange={setReflection}
      onSaveReflection={() => saveReflection(activeExperiment, reflection)}
    />
  ) : isExperiment && experimentsComplete ? (
    <div data-testid="engine-experiments-closed">
      <EngineEvidenceDrawer evidenceA={studentEvidenceA} evidenceB={studentEvidenceB} />
    </div>
  ) : isExplain ? (
    <EngineExplainTask
      firstChange={firstChange}
      gasEffect={gasEffect}
      mechanicalGain={mechanicalGain}
      studentExplanation={explainText}
      needMore={explainNeedMore}
      evidenceA={studentEvidenceA}
      evidenceB={studentEvidenceB}
      hints={revealedHints}
      canRevealHint={canRevealHint}
      onFirstChange={(value) => {
        setExplainNeedMore(false);
        setFirstChange(value);
        persistExplainDraft({ firstChange: value });
      }}
      onGasEffect={(value) => {
        setExplainNeedMore(false);
        setGasEffect(value);
        persistExplainDraft({ gasEffect: value });
      }}
      onMechanicalGain={(value) => {
        setExplainNeedMore(false);
        setMechanicalGain(value);
        persistExplainDraft({ mechanicalGain: value });
      }}
      onExplanationChange={(value) => {
        setExplainNeedMore(false);
        setExplainText(value);
        persistExplainDraft({ studentExplanation: value });
      }}
      onSubmit={handleSaveExplanation}
      onRevealHint={revealHint}
      hideLead
    />
  ) : isModel && !modelComplete ? (
    <EngineModelBuilder
      slots={modelSlots}
      relationKinds={relationKinds}
      combustionEnablesConversion={combustionEnablesConversion}
      selectedId={selectedModelNode}
      feedback={
        latestModelAttempt ? summarizeEngineModelAttempt(latestModelAttempt) : null
      }
      needStructure={modelNeedStructure}
      evidenceA={studentEvidenceA}
      evidenceB={studentEvidenceB}
      hints={revealedHints}
      canRevealHint={canRevealHint}
      onSelectNode={setSelectedModelNode}
      onPlaceInSlot={handlePlaceModelNode}
      onRelationChange={(index, kind) => {
        const next = [...relationKinds];
        next[index] = kind;
        setRelationKinds(next);
        persistModelDraft({ relationKinds: next });
      }}
      onCombustionChange={(enabled) => {
        setCombustionEnablesConversion(enabled);
        persistModelDraft({ combustionEnablesConversion: enabled });
      }}
      onSubmit={() => {
        if (!modelSlots.some(Boolean)) {
          setModelNeedStructure(true);
          return;
        }
        saveModelAttempt({
          slots: modelSlots,
          relationKinds,
          combustionEnablesConversion,
        });
      }}
      onRevealHint={revealHint}
    />
  ) : isModel && modelComplete ? (
    <div data-testid="engine-phase5-end">
      <Card className="space-y-2 p-4">
        <p className="font-medium text-[var(--ink)]">{ENGINE_MODEL_COPY.phase5Title}</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_MODEL_COPY.phase5Body}
        </p>
      </Card>
    </div>
  ) : isTransfer && !transferComplete && transferTarget ? (
    <EngineTransferTask
      targetId={transferTargetId}
      scenario={transferTarget.scenario}
      transferMode={
        transferTarget.transferMode === "partial-structure"
          ? "partial-structure"
          : "full-model"
      }
      judgments={transferJudgments}
      relationOrder={transferOrder}
      surfaceCueSelected={transferSurfaceCue}
      studentExplanation={transferText}
      feedback={
        latestTransferAttempt
          ? summarizeEngineTransferAttempt(latestTransferAttempt)
          : null
      }
      needMore={transferNeedMore}
      hints={revealedHints}
      canRevealHint={canRevealHint}
      canRetryMedium={
        transferTargetId === ENGINE_TRANSFER_TARGET_IDS.motorcycle &&
        session.transferAttempts.some(
          (attempt) =>
            (attempt.targetId ?? attempt.scenarioId) ===
              ENGINE_TRANSFER_TARGET_IDS.motorcycle && attempt.accepted !== true,
        )
      }
      onJudgmentChange={(relationId, judgment) => {
        const next = { ...transferJudgments, [relationId]: judgment };
        const nextOrder =
          judgment === "applies"
            ? transferOrder
            : transferOrder.filter((id) => id !== relationId);
        setTransferNeedMore(false);
        setTransferJudgments(next);
        setTransferOrder(nextOrder);
        persistTransferDraft({ judgments: next, relationOrder: nextOrder });
      }}
      onToggleOrder={(relationId) => {
        if (transferOrder.includes(relationId)) {
          return;
        }
        const next = [...transferOrder, relationId];
        setTransferNeedMore(false);
        setTransferOrder(next);
        persistTransferDraft({ relationOrder: next });
      }}
      onResetOrder={() => {
        setTransferOrder([]);
        persistTransferDraft({ relationOrder: [] });
      }}
      onSurfaceCueChange={(selected) => {
        setTransferNeedMore(false);
        setTransferSurfaceCue(selected);
        persistTransferDraft({ surfaceCueSelected: selected });
      }}
      onExplanationChange={(value) => {
        setTransferNeedMore(false);
        setTransferText(value);
        persistTransferDraft({ studentExplanation: value });
      }}
      onSubmit={() => {
        saveTransferAttempt({
          targetId: transferTargetId,
          judgments: transferJudgments,
          relationOrder: transferOrder,
          surfaceCueSelected: transferSurfaceCue,
          studentExplanation: transferText,
          timestamp: new Date().toISOString(),
        });
      }}
      onRevealHint={revealHint}
      onRetryMedium={() => {
        const next = emptyEngineTransferDraft(ENGINE_TRANSFER_TARGET_IDS.lab);
        setTransferTargetId(next.targetId);
        setTransferJudgments(next.judgments);
        setTransferOrder(next.relationOrder);
        setTransferSurfaceCue(next.surfaceCueSelected);
        setTransferText(next.studentExplanation);
        setTransferNeedMore(false);
        persistTransferDraft(next);
      }}
    />
  ) : isExam && examOpen && examPattern ? (
    <EngineExamTask
      pattern={examPattern}
      questionIndex={examQuestionIndex}
      totalCount={examDraft.patternIds.length}
      step={examDraft.step}
      representation={examDraft.representation}
      modelRecognition={examDraft.modelRecognition}
      selectedAnswer={examDraft.selectedAnswer}
      reasoning={examDraft.reasoning}
      feedback={
        latestExamAttempt ? summarizeEngineExamAttempt(latestExamAttempt) : null
      }
      needSteps={examNeedSteps}
      canRetry={examCanRetry}
      hints={revealedHints}
      canRevealHint={canRevealHint}
      onRepresentationChange={(value) => persistExamDraft({ representation: value })}
      onModelRecognitionChange={(value) =>
        persistExamDraft({ modelRecognition: value })
      }
      onSelectedAnswerChange={(value) => persistExamDraft({ selectedAnswer: value })}
      onReasoningChange={(value) => persistExamDraft({ reasoning: value })}
      onContinueToModel={() => persistExamDraft({ step: "model" })}
      onRevealChoices={() => persistExamDraft({ step: "answer" })}
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
        saveExamAttempt(input);
        setExamDraft(
          nextEngineExamDraft(
            [...session.examAttempts, buildEngineExamAttempt(input)],
            examDraft,
            examPatternId,
          ),
        );
      }}
      onNext={() => {
        const next = retireEngineExamDraft(session.examAttempts, examDraft);
        setExamDraft(next);
        skipExamRetry();
      }}
      onRevealHint={revealHint}
    />
  ) : isAiOff && aiOffOpen ? (
    <EngineAiOffTask
      challengeId={aiOffChallengeId}
      questionIndex={aiOffQuestionIndex}
      totalCount={aiOffDraft.challengeIds.length}
      step={aiOffStep}
      selectedAnswer={aiOffDraft.selectedAnswer}
      reasoning={aiOffDraft.reasoning}
      postCheckSelections={aiOffDraft.postCheckSelections}
      committed={latestAiOffAttempt ?? null}
      needResponse={aiOffNeedResponse}
      needPostCheck={aiOffNeedPostCheck}
      onSelectedAnswerChange={(value) => persistAiOffDraft({ selectedAnswer: value })}
      onReasoningChange={(value) => persistAiOffDraft({ reasoning: value })}
      onPostCheckToggle={(id) => {
        const selected = new Set(aiOffDraft.postCheckSelections);
        if (selected.has(id)) {
          selected.delete(id);
        } else {
          selected.add(id);
        }
        persistAiOffDraft({ postCheckSelections: [...selected] });
      }}
      onCommit={() => {
        const input = {
          challengeId: aiOffChallengeId,
          selectedAnswer: aiOffDraft.selectedAnswer,
          studentReasoning: aiOffDraft.reasoning,
          timestamp: new Date().toISOString(),
        };
        if (!canCommitEngineAiOffResponse(input)) {
          setAiOffNeedResponse(true);
          return;
        }
        saveAiOffIndependentResponse(input);
      }}
      onSubmitPostCheck={() => {
        if (aiOffDraft.postCheckSelections.length === 0) {
          setAiOffNeedPostCheck(true);
          return;
        }
        saveAiOffPostCheck({
          challengeId: aiOffChallengeId,
          postCheckIds: aiOffDraft.postCheckSelections,
        });
      }}
      onRetry={() => {
        const next = retryEngineAiOffDraft(aiOffDraft, aiOffChallengeId);
        setAiOffDraft(next);
        saveAiOffDraft(next);
        setAiOffNeedResponse(false);
        setAiOffNeedPostCheck(false);
      }}
    />
  ) : isComplete ? (
    <EngineCompleteView
      prediction={
        session.predictions.at(-1)?.reasoning ||
        session.predictions.at(-1)?.prediction ||
        "你先写下了自己的猜测。"
      }
      experiment={
        studentEvidenceB || studentEvidenceA || "你用实验检查了自己的预测。"
      }
      model={
        latestModelAttempt
          ? summarizeEngineModelAttempt(latestModelAttempt)
          : "你把能量从燃料到机械运动的过程连了起来。"
      }
      transfer={
        latestTransferAttempt
          ? summarizeEngineTransferAttempt(latestTransferAttempt)
          : "你把这个想法用到了新的情境。"
      }
      independent="你在没有提示的情况下，独立完成了新问题。"
    />
  ) : null;

  const actions = isEntry ? (
    <Button size="lg" onClick={startLesson} aria-label={ENGINE_COPY.startCta}>
      {ENGINE_COPY.startCta}
    </Button>
  ) : (
    <p className="text-sm text-[var(--ink-muted)]">
      {ENGINE_FOOTER[session.stage] ?? ""}
    </p>
  );

  const tutorStudentText = isObserve
    ? selectedOptionIds.join("，")
    : isDescribe
      ? describeText
      : isExplain
        ? explainText
        : isModel
          ? latestModelAttempt
            ? summarizeEngineModelAttempt(latestModelAttempt)
            : modelSlots.filter(Boolean).join(" → ")
          : isTransfer
            ? transferText
            : isExam
              ? examDraft.reasoning
              : predictReason;

  const useWorkspace =
    isEntry || isObserve || isDescribe || isPredict || isExperiment || isExplain;
  const predictLeadQuestion = isPredict
    ? ENGINE_COPY.predictAQuestion
    : awaitingExperimentBPrediction
      ? ENGINE_COPY.predictBQuestion
      : null;
  const workspaceLead = isEntry ? (
    <div>
      <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        {ENGINE_COPY.headline}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{ENGINE_COPY.subheadline}</p>
    </div>
  ) : predictLeadQuestion ? (
    <div>
      <p className="text-xs font-medium tracking-wide text-[var(--heat)]">先预测</p>
      <h1 className="mt-1 font-serif text-2xl leading-snug text-[var(--ink)] sm:text-3xl">
        {ENGINE_STAGE_PROMPTS[LearningStage.PREDICT]}
      </h1>
      <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--ink)]">
        {predictLeadQuestion}
      </p>
      <p
        className="mt-2 text-sm text-[var(--ink-muted)]"
        data-testid="engine-predict-not-exam"
      >
        {ENGINE_COPY.predictNotExam}
      </p>
    </div>
  ) : (
    <h1 className="font-serif text-2xl leading-snug text-[var(--ink)] sm:text-3xl">
      {ENGINE_STAGE_PROMPTS[session.stage]}
    </h1>
  );
  const workspaceWorld = (
    <div className="space-y-4">
      {scene}
      {isEntry || isObserve || isDescribe ? (
        <EngineVocabRow terms={["piston", "cylinder"]} />
      ) : null}
    </div>
  );
  const tutorNode =
    tutor.allowed && !isAiOff && !isComplete ? (
      <TutorPanel
        message={tutor.message}
        loading={tutor.loading}
        onAsk={() => {
          void tutor.askTutor(tutorStudentText);
        }}
      />
    ) : null;

  return (
    <LearningShell
      stage={session.stage}
      stageLabels={ENGINE_STAGE_LABELS}
      stagePrompts={useWorkspace ? {} : ENGINE_STAGE_PROMPTS}
      progressStages={[...ENGINE_PHASE8_STAGES]}
      examNotice={isExam ? ENGINE_EXAM_COPY.notice : undefined}
      scene={useWorkspace ? undefined : scene}
      task={useWorkspace ? undefined : task}
      workspace={
        useWorkspace ? (
          <LearnerWorkspace
            emphasis={isObserve || isExperiment ? "world" : "task"}
            lead={workspaceLead}
            world={workspaceWorld}
            task={isEntry ? actions : task}
            support={tutorNode}
          />
        ) : undefined
      }
      tutor={useWorkspace ? null : tutorNode}
      actions={useWorkspace && isEntry ? null : actions}
      onStartOver={handleStartOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
    />
  );
}

function emptySnapshotAnswers(): EngineSnapshotAnswer[] {
  return ENGINE_DESCRIBE_SNAPSHOTS.map((spec) => ({
    stroke: spec.stroke,
    piston: "",
    intake: "",
    exhaust: "",
    combustion: "",
  }));
}

function observedLabel(
  evidence:
    | ReturnType<typeof firstClosedEngineEvidence>
    | undefined,
): string | null {
  if (!evidence?.observedResult) {
    return null;
  }
  const observed = asEngineObservedResult(evidence.observedResult);
  const combustion =
    observed.combustionOccurred === "yes" ? "发生燃烧" : "没有正常燃烧";
  const output =
    observed.mainOutputOccurred === "yes" ? "有主要动力输出" : "没有主要动力输出";
  return `${combustion}，${output}`;
}

function applyExperimentForm(
  session: NonNullable<ReturnType<typeof useEngineLearningSession>["session"]>,
  experimentKey: string,
  setters: {
    setPredictOutcome: (value: string) => void;
    setPredictReason: (value: string) => void;
    setPredictReasonStance: (value: EnginePredictReasonStance) => void;
    setPredictNeedMore: (value: boolean) => void;
    setObserved: (value: EngineObservedResult) => void;
    setComparison: (value: "" | "same" | "different" | "partial") => void;
    setReflection: (value: string) => void;
    setScriptedCycle: (value: EngineState[] | null) => void;
  },
) {
  const experimentId =
    experimentKey === ENGINE_EXPERIMENT_A || experimentKey === ENGINE_EXPERIMENT_B
      ? experimentKey
      : null;

  if (!experimentId) {
    setters.setPredictOutcome("");
    setters.setPredictReason("");
    setters.setPredictReasonStance("");
    setters.setPredictNeedMore(false);
    setters.setObserved(emptyObservedResult());
    setters.setComparison("");
    setters.setReflection("");
    const lastClosed =
      firstClosedEngineEvidence(session, ENGINE_EXPERIMENT_B) ??
      firstClosedEngineEvidence(session, ENGINE_EXPERIMENT_A);
    setters.setScriptedCycle(
      lastClosed?.experimentId &&
        isEngineSceneExperimentId(lastClosed.experimentId)
        ? runSceneExperiment(lastClosed.experimentId).states
        : null,
    );
    return;
  }

  const committed = firstCommittedEnginePrediction(
    session.predictions,
    experimentId,
  );
  setters.setPredictOutcome(committed?.prediction ?? "");
  setters.setPredictReason(committed?.reasoning ?? "");
  setters.setPredictReasonStance(
    committed?.reasoning ? enginePredictStanceFromReason(committed.reasoning) : "",
  );
  setters.setPredictNeedMore(false);

  const evidence =
    activeIncompleteEngineEvidence(session, experimentId) ??
    firstClosedEngineEvidence(session, experimentId);
  setters.setObserved(asEngineObservedResult(evidence?.observedResult));
  setters.setComparison(evidence?.comparison || "");
  setters.setReflection(evidence?.reflection ?? "");
  if (evidence?.interventionAt) {
    setters.setScriptedCycle(runSceneExperiment(experimentId).states);
  } else {
    setters.setScriptedCycle(null);
  }
}

function experimentKeyFor(
  session: ReturnType<typeof useEngineLearningSession>["session"],
): string {
  if (!session) {
    return "";
  }
  if (session.stage === LearningStage.PREDICT) {
    return ENGINE_EXPERIMENT_A;
  }
  if (session.stage === LearningStage.EXPERIMENT) {
    return activeEngineExperimentId(session) ?? "done";
  }
  return session.stage;
}
