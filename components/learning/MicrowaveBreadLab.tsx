"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { LearningShell } from "@/components/learning/LearningShell";
import { MicrowaveAiOffTask } from "@/components/learning/MicrowaveAiOffTask";
import { MicrowaveCompleteView } from "@/components/learning/MicrowaveCompleteView";
import { MicrowaveDescribeTask } from "@/components/learning/MicrowaveDescribeTask";
import { MicrowaveExamTask } from "@/components/learning/MicrowaveExamTask";
import { MicrowaveExplainTask } from "@/components/learning/MicrowaveExplainTask";
import { MicrowaveModelBoard } from "@/components/learning/MicrowaveModelBoard";
import { MicrowaveTransferTask } from "@/components/learning/MicrowaveTransferTask";
import { PredictionPanel } from "@/components/learning/PredictionPanel";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { ExperimentResult } from "@/components/physics/ExperimentResult";
import { MicrowaveControls } from "@/components/physics/MicrowaveControls";
import { MicrowaveScene } from "@/components/physics/MicrowaveScene";
import { useHeatingAnimation } from "@/hooks/useHeatingAnimation";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useTutor } from "@/hooks/useTutor";
import {
  MICROWAVE_COMPARE_OPTIONS,
  MICROWAVE_OBSERVE_OPTIONS,
  MICROWAVE_TASK_COPY,
  SCENE_COPY,
} from "@/lib/content/microwave-bread";
import { STUDENT_CHROME, STUDENT_FOOTER } from "@/lib/content/student-language";
import { emptyMicrowaveDescribeInput } from "@/lib/learning/microwave-describe";
import { emptyMicrowaveExplainInput } from "@/lib/learning/microwave-explain";
import {
  MICROWAVE_AI_OFF_CHALLENGE_IDS,
  microwaveAiOffAttemptsFor,
} from "@/lib/learning/microwave-ai-off";
import {
  microwaveExamPattern,
  MICROWAVE_EXAM_PATTERN_IDS,
} from "@/lib/learning/microwave-exam";
import {
  emptyMicrowaveModelDraft,
  summarizeMicrowaveModelAttempt,
} from "@/lib/learning/microwave-model";
import {
  microwavePredictLabel,
} from "@/lib/learning/microwave-predict";
import { getMicrowaveExperimentHistory } from "@/lib/learning/microwave-scene-data";
import {
  conditionCheckIdsFromRecord,
  emptyMicrowaveTransferDraft,
  microwaveTransferTarget,
  summarizeMicrowaveTransferAttempt,
} from "@/lib/learning/microwave-transfer";
import { hasCompletedMicrowaveExperiment } from "@/lib/learning/microwave-experiment";
import { isMicrowaveScenePhysics } from "@/lib/runtime/physics-state";
import { prefersReducedMotion, visualDurationMs } from "@/lib/physics/visual";
import { LearningStage, type LearningSession } from "@/types/learning";
import type { MicrowaveExperimentResult } from "@/types/physics";

interface ActiveHeating {
  result: MicrowaveExperimentResult;
  durationMs: number;
}

export function MicrowaveBreadLab() {
  const {
    session,
    hydrated,
    startLesson,
    goBack,
    saveObservation,
    saveDescription,
    savePrediction,
    saveExperimentEvidence,
    saveExplanation,
    saveModelAttempt,
    saveTransferAttempt,
    saveExamAttempt,
    saveExplainDraft,
    saveModelDraft,
    saveTransferDraft,
    saveExamDraft,
    saveAiOffDraft,
    saveAiOffIndependentResponse,
    saveAiOffPostCheck,
    retryAiOff,
    runExperiment,
    commitExperiment,
    resetBread,
    updateControls,
    startOver,
    explainDraft,
    modelDraft,
    transferDraft,
    examDraft,
    aiOffDraft,
    activeTransferTargetId,
    currentAiOffChallengeId,
    canGoBack,
  } = useLearningSession();
  const tutor = useTutor(session);

  const [heating, setHeating] = useState<ActiveHeating | null>(null);
  const [observeIds, setObserveIds] = useState<string[]>([]);
  const [observationText, setObservationText] = useState("");
  const [describeInput, setDescribeInput] = useState(emptyMicrowaveDescribeInput());
  const [describeNeed, setDescribeNeed] = useState(false);
  const [predictionChoice, setPredictionChoice] = useState("");
  const [predictionReasoning, setPredictionReasoning] = useState("");
  const [comparison, setComparison] = useState("");
  const [experimentReflection, setExperimentReflection] = useState("");
  const [explainNeed, setExplainNeed] = useState(false);
  const [modelNeed, setModelNeed] = useState(false);
  const [modelFeedback, setModelFeedback] = useState<string | null>(null);
  const [transferNeed, setTransferNeed] = useState(false);
  const [transferFeedback, setTransferFeedback] = useState<string | null>(null);
  const [examFeedback, setExamFeedback] = useState<string | null>(null);
  const [aiOffNeedResponse, setAiOffNeedResponse] = useState(false);
  const [aiOffNeedPostCheck, setAiOffNeedPostCheck] = useState(false);
  const heatingRef = useRef<ActiveHeating | null>(null);

  useEffect(() => {
    heatingRef.current = heating;
  }, [heating]);

  const physicsState =
    session && isMicrowaveScenePhysics(session.physicsState)
      ? session.physicsState.state
      : null;
  const fromTemperatureC = physicsState?.currentTemperatureC ?? 20;
  const toTemperatureC = heating?.result.finalTemperatureC ?? fromTemperatureC;
  const heatingTimeSec = physicsState?.heatingTimeSec ?? 30;
  const isHeating = heating !== null;

  const handleVisualComplete = useCallback(() => {
    const current = heatingRef.current;
    if (current) {
      commitExperiment(current.result);
    }
    setHeating(null);
  }, [commitExperiment]);

  const animation = useHeatingAnimation({
    active: isHeating,
    fromTemperatureC,
    toTemperatureC,
    heatingTimeSec,
    durationMs: heating?.durationMs ?? 0,
    onComplete: handleVisualComplete,
  });

  if (!hydrated || !session || !physicsState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--ink-muted)]">
        {STUDENT_CHROME.preparing}
      </div>
    );
  }

  const breadIsReset =
    physicsState.currentTemperatureC === physicsState.initialTemperatureC;
  const displayTemperatureC = isHeating
    ? animation.temperatureC
    : physicsState.currentTemperatureC;
  const remainingTimeSec = isHeating
    ? animation.remainingSec
    : physicsState.heatingTimeSec;
  const lastResult = getMicrowaveExperimentHistory(session).at(-1) ?? null;
  const hasHeated = getMicrowaveExperimentHistory(session).length > 0;
  const canReset =
    !isHeating && physicsState.currentTemperatureC !== physicsState.initialTemperatureC;
  const latestPrediction = session.predictions.at(-1) ?? null;
  const experimentClosed = hasCompletedMicrowaveExperiment(session);
  const openExperiment = [...session.experimentEvidence]
    .reverse()
    .find((item) => item.sufficient !== true);
  const currentExplain = explainDraft ?? emptyMicrowaveExplainInput();
  const currentModel = modelDraft ?? emptyMicrowaveModelDraft();
  const currentTransfer = transferDraft ?? emptyMicrowaveTransferDraft(activeTransferTargetId);
  const currentExam = examDraft;
  const currentAiOff = aiOffDraft;
  const examPattern = currentExam
    ? microwaveExamPattern(currentExam.currentPatternId)
    : undefined;
  const transferTarget = microwaveTransferTarget(currentTransfer.targetId);
  const committedAiOff = currentAiOff
    ? microwaveAiOffAttemptsFor(
        session.independentAssessment,
        currentAiOff.currentChallengeId,
      ).at(-1) ?? null
    : null;

  function handleStartHeating() {
    if (heating || !physicsState) {
      return;
    }
    const result = runExperiment();
    if (!result) {
      return;
    }
    const durationMs = visualDurationMs(
      physicsState.heatingTimeSec,
      prefersReducedMotion(),
    );
    if (durationMs <= 0) {
      commitExperiment(result);
      return;
    }
    setHeating({ result, durationMs });
  }

  const scene = (
    <MicrowaveScene
      temperatureC={displayTemperatureC}
      isHeating={isHeating}
      remainingTimeSec={remainingTimeSec}
      powerW={physicsState.powerW}
    />
  );

  const task =
    session.stage === LearningStage.ENTRY ? (
      <div className="mx-auto max-w-md text-center lg:text-left">
        <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
          {SCENE_COPY.headline}
        </h1>
        <p className="mt-3 text-lg text-[var(--ink-muted)]">{SCENE_COPY.subheadline}</p>
      </div>
    ) : session.stage === LearningStage.OBSERVE ? (
      <div className="space-y-6">
        <p className="text-[var(--ink-muted)]">{SCENE_COPY.observeInstruction}</p>
        <MicrowaveControls
          isHeating={isHeating}
          hasHeated={hasHeated}
          canReset={canReset}
          onStartHeating={handleStartHeating}
          onResetBread={resetBread}
        />
        {lastResult && !isHeating ? (
          <>
            <Card className="space-y-3 p-4">
              <p className="text-sm font-medium text-[var(--ink)]">
                {breadIsReset ? SCENE_COPY.lastRun : SCENE_COPY.heatingComplete}
              </p>
              <ExperimentResult physicsState={physicsState} result={lastResult} />
            </Card>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-[var(--ink)]">
                {SCENE_COPY.observeQuestion}
              </legend>
              {MICROWAVE_OBSERVE_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
                >
                  <input
                    type="radio"
                    name="microwave-observe"
                    checked={observeIds[0] === option.id}
                    onChange={() => setObserveIds([option.id])}
                    className="mt-1"
                    aria-label={option.label}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="space-y-2">
              <label
                htmlFor="microwave-observe-text"
                className="text-sm font-medium text-[var(--ink)]"
              >
                {SCENE_COPY.observePrompt}
              </label>
              <textarea
                id="microwave-observe-text"
                value={observationText}
                onChange={(event) => setObservationText(event.target.value)}
                placeholder={SCENE_COPY.observePlaceholder}
                className="min-h-20 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  saveObservation({
                    selectedOptionIds: observeIds,
                    studentObservation: observationText,
                  })
                }
              >
                {SCENE_COPY.observeSubmit}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    ) : session.stage === LearningStage.DESCRIBE ? (
      <div className="space-y-4">
        {session.observations.at(-1)?.text ? (
          <Card className="space-y-2 p-4">
            <p className="text-sm font-medium text-[var(--ink)]">{SCENE_COPY.yourObservation}</p>
            <p className="text-sm text-[var(--ink-muted)]">
              {session.observations.at(-1)?.text}
            </p>
          </Card>
        ) : null}
      <MicrowaveDescribeTask
        value={describeInput}
        onChange={setDescribeInput}
        onSubmit={() => {
          saveDescription(describeInput);
          setDescribeNeed(true);
        }}
        needStructure={describeNeed && !session.descriptions.at(-1)?.sufficient}
      />
      </div>
    ) : session.stage === LearningStage.PREDICT ? (
      <div className="space-y-4">
        <p className="text-sm text-[var(--ink-muted)]">{SCENE_COPY.predictInstruction}</p>
        <p className="text-sm font-medium text-[var(--ink)]">{SCENE_COPY.predictQuestion}</p>
        <PredictionPanel
          selected={predictionChoice}
          reasoning={predictionReasoning}
          onSelect={setPredictionChoice}
          onReasoningChange={setPredictionReasoning}
          onSubmit={() => savePrediction(predictionChoice, predictionReasoning)}
        />
      </div>
    ) : session.stage === LearningStage.EXPERIMENT ? (
      <div className="space-y-6">
        <p className="text-[var(--ink-muted)]">{SCENE_COPY.experimentInstruction}</p>
        <p className="text-sm text-[var(--ink-muted)]">
          {MICROWAVE_TASK_COPY.experimentAlwaysHint}
        </p>
        {latestPrediction ? (
          <Card className="space-y-2 p-4">
            <p className="text-sm font-medium text-[var(--ink)]">{SCENE_COPY.yourGuess}</p>
            <p className="text-sm text-[var(--ink-muted)]">
              {microwavePredictLabel(latestPrediction.prediction)}
            </p>
            <p className="text-sm text-[var(--ink-muted)]">{latestPrediction.reasoning}</p>
          </Card>
        ) : (
          <p className="text-sm text-[var(--ink-muted)]">
            {MICROWAVE_TASK_COPY.experimentNeedPrediction}
          </p>
        )}
        <MicrowaveControls
          isHeating={isHeating}
          hasHeated={hasHeated}
          canReset={canReset}
          powerW={physicsState.powerW}
          heatingTimeSec={physicsState.heatingTimeSec}
          onPowerChange={(powerW) => updateControls({ powerW })}
          onHeatingTimeChange={(heatingTimeSec) => updateControls({ heatingTimeSec })}
          onStartHeating={handleStartHeating}
          onResetBread={resetBread}
        />
        {openExperiment && !isHeating ? (
          <Card className="space-y-4 p-4">
            {lastResult ? (
              <ExperimentResult physicsState={physicsState} result={lastResult} />
            ) : null}
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-[var(--ink)]">
                {MICROWAVE_TASK_COPY.experimentCompareLabel}
              </legend>
              {MICROWAVE_COMPARE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
                >
                  <input
                    type="radio"
                    name="microwave-compare"
                    checked={comparison === option.value}
                    onChange={() => setComparison(option.value)}
                    className="mt-1"
                    aria-label={option.label}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="space-y-2">
              <label
                htmlFor="microwave-reflection"
                className="text-sm font-medium text-[var(--ink)]"
              >
                {SCENE_COPY.experimentReflectionQuestion}
              </label>
              <textarea
                id="microwave-reflection"
                value={experimentReflection}
                onChange={(event) => setExperimentReflection(event.target.value)}
                placeholder={SCENE_COPY.reflectionPlaceholder}
                className="min-h-20 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (
                    comparison === "same" ||
                    comparison === "different" ||
                    comparison === "partial"
                  ) {
                    saveExperimentEvidence(comparison, experimentReflection);
                  }
                }}
              >
                {SCENE_COPY.experimentSubmit}
              </Button>
            </div>
          </Card>
        ) : null}
        {experimentClosed ? (
          <p className="text-sm text-[var(--ink-muted)]">{SCENE_COPY.comparedReady}</p>
        ) : null}
      </div>
    ) : session.stage === LearningStage.EXPLAIN ? (
      <MicrowaveExplainTask
        value={currentExplain}
        onChange={(next) => {
          setExplainNeed(false);
          saveExplainDraft(next);
        }}
        onSubmit={() => {
          saveExplanation(currentExplain);
          setExplainNeed(true);
        }}
        needStructure={explainNeed && !session.explanations.at(-1)?.sufficient}
      />
    ) : session.stage === LearningStage.MODEL ? (
      <MicrowaveModelBoard
        value={currentModel}
        onChange={(next) => {
          setModelNeed(false);
          saveModelDraft(next);
        }}
        onSubmit={() => {
          saveModelAttempt(currentModel);
          setModelFeedback(summarizeMicrowaveModelAttempt(session.modelAttempts.at(-1) ?? {
            nodes: [],
            connections: [],
            correctStructure: false,
            timestamp: "",
          }));
          setModelNeed(true);
        }}
        feedback={modelFeedback}
        needStructure={modelNeed && !session.modelAttempts.some((item) => item.correctStructure)}
      />
    ) : session.stage === LearningStage.TRANSFER && transferTarget ? (
      <MicrowaveTransferTask
        targetId={currentTransfer.targetId}
        scenario={transferTarget.scenario}
        judgments={currentTransfer.judgments}
        surfaceCueSelected={currentTransfer.surfaceCueSelected}
        studentExplanation={currentTransfer.studentExplanation}
        conditionChecks={currentTransfer.conditionChecks}
        feedback={transferFeedback}
        needMore={transferNeed}
        onJudgmentChange={(relationId, judgment) =>
          saveTransferDraft({
            ...currentTransfer,
            judgments: { ...currentTransfer.judgments, [relationId]: judgment },
          })
        }
        onSurfaceCueChange={(selected) =>
          saveTransferDraft({ ...currentTransfer, surfaceCueSelected: selected })
        }
        onConditionCheckChange={(probeId, value) =>
          saveTransferDraft({
            ...currentTransfer,
            conditionChecks: { ...currentTransfer.conditionChecks, [probeId]: value },
          })
        }
        onExplanationChange={(value) =>
          saveTransferDraft({ ...currentTransfer, studentExplanation: value })
        }
        onSubmit={() => {
          const attemptInput = {
            targetId: currentTransfer.targetId,
            judgments: currentTransfer.judgments,
            surfaceCueSelected: currentTransfer.surfaceCueSelected,
            studentExplanation: currentTransfer.studentExplanation,
            conditionChecks: conditionCheckIdsFromRecord(currentTransfer.conditionChecks),
            timestamp: new Date().toISOString(),
          };
          saveTransferAttempt(attemptInput);
          setTransferNeed(true);
          const latest = session.transferAttempts.find(
            (item) => (item.targetId ?? item.scenarioId) === currentTransfer.targetId,
          );
          setTransferFeedback(
            latest ? summarizeMicrowaveTransferAttempt(latest) : null,
          );
        }}
      />
    ) : session.stage === LearningStage.EXAM && currentExam && examPattern ? (
      <MicrowaveExamTask
        pattern={examPattern}
        questionIndex={MICROWAVE_EXAM_PATTERN_IDS.indexOf(
          currentExam.currentPatternId as (typeof MICROWAVE_EXAM_PATTERN_IDS)[number],
        )}
        totalCount={MICROWAVE_EXAM_PATTERN_IDS.length}
        step={currentExam.step}
        representation={currentExam.representation}
        modelRecognition={currentExam.modelRecognition}
        selectedAnswer={currentExam.selectedAnswer}
        reasoning={currentExam.reasoning}
        feedback={examFeedback}
        onRepresentationChange={(value) =>
          saveExamDraft({ ...currentExam, representation: value })
        }
        onModelRecognitionChange={(value) =>
          saveExamDraft({ ...currentExam, modelRecognition: value })
        }
        onSelectedAnswerChange={(value) =>
          saveExamDraft({ ...currentExam, selectedAnswer: value })
        }
        onReasoningChange={(value) => saveExamDraft({ ...currentExam, reasoning: value })}
        onContinueToModel={() => saveExamDraft({ ...currentExam, step: "model" })}
        onRevealChoices={() => saveExamDraft({ ...currentExam, step: "answer" })}
        onSubmit={() => {
          saveExamAttempt({
            patternId: currentExam.currentPatternId,
            representation: currentExam.representation,
            modelRecognition: currentExam.modelRecognition,
            selectedAnswer: currentExam.selectedAnswer,
            reasoning: currentExam.reasoning,
            timestamp: new Date().toISOString(),
          });
          setExamFeedback("记下了。先想清楚题目，再对照关系和选项。");
        }}
      />
    ) : session.stage === LearningStage.AI_OFF && currentAiOff && currentAiOffChallengeId ? (
      <MicrowaveAiOffTask
        challengeId={currentAiOffChallengeId}
        questionIndex={MICROWAVE_AI_OFF_CHALLENGE_IDS.indexOf(
          currentAiOffChallengeId as (typeof MICROWAVE_AI_OFF_CHALLENGE_IDS)[number],
        )}
        totalCount={MICROWAVE_AI_OFF_CHALLENGE_IDS.length}
        step={currentAiOff.step}
        selectedAnswer={currentAiOff.selectedAnswer}
        reasoning={currentAiOff.reasoning}
        postCheckSelections={currentAiOff.postCheckSelections}
        preCommitEvidenceIds={currentAiOff.preCommitEvidenceIds}
        committed={committedAiOff}
        needResponse={aiOffNeedResponse}
        needPostCheck={aiOffNeedPostCheck}
        onSelectedAnswerChange={(value) =>
          saveAiOffDraft({ ...currentAiOff, selectedAnswer: value })
        }
        onReasoningChange={(value) => saveAiOffDraft({ ...currentAiOff, reasoning: value })}
        onPreCommitEvidenceChange={(ids) =>
          saveAiOffDraft({ ...currentAiOff, preCommitEvidenceIds: ids })
        }
        onPostCheckToggle={(id) => {
          const next = currentAiOff.postCheckSelections.includes(id)
            ? currentAiOff.postCheckSelections.filter((item) => item !== id)
            : [...currentAiOff.postCheckSelections, id];
          saveAiOffDraft({ ...currentAiOff, postCheckSelections: next });
        }}
        onCommit={() => {
          saveAiOffIndependentResponse({
            challengeId: currentAiOffChallengeId,
            selectedAnswer: currentAiOff.selectedAnswer,
            studentReasoning: currentAiOff.reasoning,
            preCommitEvidenceIds: currentAiOff.preCommitEvidenceIds,
            timestamp: new Date().toISOString(),
          });
          setAiOffNeedResponse(true);
        }}
        onSubmitPostCheck={() => {
          saveAiOffPostCheck(currentAiOffChallengeId, currentAiOff.postCheckSelections);
          setAiOffNeedPostCheck(true);
        }}
        onRetry={() => retryAiOff(currentAiOffChallengeId)}
      />
    ) : (
      <MicrowaveCompleteView
        description={session.descriptions.at(-1)?.text ?? ""}
        prediction={microwavePredictLabel(session.predictions.at(-1)?.prediction ?? "")}
        experiment={session.experimentEvidence.at(-1)?.reflection ?? ""}
        model={
          session.modelAttempts.at(-1)
            ? summarizeMicrowaveModelAttempt(session.modelAttempts.at(-1)!)
            : ""
        }
        transfer={
          session.transferAttempts.at(-1)
            ? summarizeMicrowaveTransferAttempt(session.transferAttempts.at(-1)!)
            : ""
        }
        independent={session.independentAssessment?.explanation ?? ""}
      />
    );

  return (
    <LearningShell
      stage={session.stage}
      scene={
        session.stage === LearningStage.EXAM ||
        session.stage === LearningStage.AI_OFF ||
        session.stage === LearningStage.COMPLETE
          ? undefined
          : scene
      }
      task={task}
      tutor={
        tutor.allowed &&
        session.stage !== LearningStage.AI_OFF &&
        session.stage !== LearningStage.COMPLETE ? (
          <TutorPanel
            message={tutor.message}
            loading={tutor.loading}
            onAsk={() => {
              void tutor.askTutor(currentStudentThought(session, observationText, describeInput.studentDescription));
            }}
          />
        ) : null
      }
      actions={
        session.stage === LearningStage.ENTRY ? (
          <Button size="lg" onClick={startLesson} aria-label={STUDENT_CHROME.startAria}>
            {SCENE_COPY.startCta}
          </Button>
        ) : (
          <p className="text-sm text-[var(--ink-muted)]">{STUDENT_FOOTER[session.stage]}</p>
        )
      }
      onStartOver={startOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
      examNotice={session.stage === LearningStage.EXAM ? SCENE_COPY.examNotice : undefined}
    />
  );
}

function currentStudentThought(
  session: LearningSession,
  observationText: string,
  descriptionText: string,
): string {
  switch (session.stage) {
    case LearningStage.OBSERVE:
      return observationText || session.observations.at(-1)?.text || "";
    case LearningStage.DESCRIBE:
      return descriptionText || session.descriptions.at(-1)?.text || "";
    default:
      return "";
  }
}
