"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ExamQuestion } from "@/components/learning/ExamQuestion";
import { ExperimentEvidencePanel } from "@/components/learning/ExperimentEvidencePanel";
import { ExplanationPanel } from "@/components/learning/ExplanationPanel";
import { IndependentChallenge } from "@/components/learning/IndependentChallenge";
import { LearningShell } from "@/components/learning/LearningShell";
import { ModelCanvas } from "@/components/learning/ModelCanvas";
import { PredictionPanel } from "@/components/learning/PredictionPanel";
import { ReflectionPanel } from "@/components/learning/ReflectionPanel";
import { StudentInput } from "@/components/learning/StudentInput";
import { TransferScenario } from "@/components/learning/TransferScenario";
import { VocabularyChips } from "@/components/learning/VocabularyChips";
import { TutorPanel } from "@/components/tutor/TutorPanel";
import { ExperimentResult } from "@/components/physics/ExperimentResult";
import { MicrowaveControls } from "@/components/physics/MicrowaveControls";
import { MicrowaveScene } from "@/components/physics/MicrowaveScene";
import { useHeatingAnimation } from "@/hooks/useHeatingAnimation";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useTutor } from "@/hooks/useTutor";
import {
  DESCRIPTION_VOCAB,
  EXPLANATION_VOCAB,
  OBSERVATION_VOCAB,
  SCENE_COPY,
} from "@/lib/content/microwave-bread";
import {
  EXAM_QUESTIONS,
  REQUIRED_EXAM_QUESTION_IDS,
} from "@/lib/content/exam-questions";
import {
  REQUIRED_TRANSFER_SCENARIO_IDS,
  TRANSFER_SCENARIOS,
} from "@/lib/content/transfer-scenarios";
import { INDEPENDENT_EXAM_QUESTION } from "@/lib/content/independent-challenge";
import { isSufficientPhysicsDescription } from "@/lib/learning/describe";
import { evaluateExamAttempt, summarizeExamAttempt } from "@/lib/learning/exam";
import {
  hasCompletedExperimentEvidence,
  hasPostPredictionExperiment,
} from "@/lib/learning/experiment-evidence";
import { summarizeExplanationLevel } from "@/lib/learning/explanation";
import { summarizeModelAttempt } from "@/lib/learning/model-evaluation";
import { buildCognitiveProfile } from "@/lib/learning/reflection";
import { classifyTransferAttempt, summarizeTransferAttempt } from "@/lib/learning/transfer";
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
    goToStage,
    saveObservation,
    saveDescription,
    savePrediction,
    saveExperimentEvidence,
    saveExplanation,
    saveModelAttempt,
    saveTransferAttempt,
    saveExamAttempt,
    saveIndependentExplanation,
    saveIndependentExam,
    runExperiment,
    commitExperiment,
    resetBread,
    updateControls,
    startOver,
    canGoBack,
  } = useLearningSession();
  const tutor = useTutor(session);

  const [heating, setHeating] = useState<ActiveHeating | null>(null);
  const [observationText, setObservationText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [predictionChoice, setPredictionChoice] = useState("");
  const [predictionReasoning, setPredictionReasoning] = useState("");
  const [predictionComparison, setPredictionComparison] = useState("");
  const [experimentReflection, setExperimentReflection] = useState("");
  const [explanationText, setExplanationText] = useState("");
  const [modelMiddleNode, setModelMiddleNode] = useState("");
  const [connectSourceToMiddle, setConnectSourceToMiddle] = useState(false);
  const [connectMiddleToTarget, setConnectMiddleToTarget] = useState(false);
  const [modelFeedback, setModelFeedback] = useState<string | null>(null);
  const [transferText, setTransferText] = useState("");
  const [transferFeedback, setTransferFeedback] = useState<string | null>(null);
  const [examRepresentation, setExamRepresentation] = useState("");
  const [examModelFocus, setExamModelFocus] = useState("");
  const [examSelectedAnswer, setExamSelectedAnswer] = useState("");
  const [examReasoning, setExamReasoning] = useState("");
  const [examFeedback, setExamFeedback] = useState<string | null>(null);
  const [independentExplanation, setIndependentExplanation] = useState("");
  const [independentAnswer, setIndependentAnswer] = useState("");
  const heatingRef = useRef<ActiveHeating | null>(null);

  useEffect(() => {
    heatingRef.current = heating;
  }, [heating]);

  const physicsState = session?.physicsState ?? null;
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
        Preparing the lab…
      </div>
    );
  }

  const activeSession = session;
  const activePhysics = physicsState;
  const breadIsReset =
    activePhysics.currentTemperatureC === activePhysics.initialTemperatureC;
  const displayTemperatureC = isHeating
    ? animation.temperatureC
    : activePhysics.currentTemperatureC;
  const remainingTimeSec = isHeating
    ? animation.remainingSec
    : activePhysics.heatingTimeSec;
  const lastResult = activeSession.experimentHistory.at(-1) ?? null;
  const hasHeated = activeSession.experimentHistory.length > 0;
  const canReset =
    !isHeating && activePhysics.currentTemperatureC !== activePhysics.initialTemperatureC;
  const isEntry = activeSession.stage === LearningStage.ENTRY;
  const latestObservation = activeSession.observations.at(-1)?.text ?? "";
  const latestDescriptionRecord = activeSession.descriptions.at(-1) ?? null;
  const latestDescription = latestDescriptionRecord?.text ?? "";
  const describeNeedsPhysics =
    Boolean(latestDescriptionRecord) &&
    !isSufficientPhysicsDescription(latestDescription);
  const latestPrediction = activeSession.predictions.at(-1) ?? null;
  const ranPostPredictionExperiment = hasPostPredictionExperiment(activeSession);
  const experimentEvidenceComplete = hasCompletedExperimentEvidence(activeSession);
  const latestExplanation = activeSession.explanations.at(-1) ?? null;
  const latestModelAttempt = activeSession.modelAttempts.at(-1) ?? null;
  const explanationFeedback = latestExplanation
    ? summarizeExplanationLevel(latestExplanation.explanationLevel)
    : null;

  const completedTransferIds = new Set(
    activeSession.transferAttempts.map((attempt) => attempt.scenarioId),
  );
  const nextTransferScenario = TRANSFER_SCENARIOS.find(
    (scenario) => !completedTransferIds.has(scenario.id),
  );

  const completedExamIds = new Set(
    activeSession.examAttempts.map((attempt) => attempt.questionId),
  );
  const nextExamQuestion = EXAM_QUESTIONS.find(
    (question) => !completedExamIds.has(question.id),
  );

  function handleStartHeating() {
    if (heating) {
      return;
    }
    const result = runExperiment();
    if (!result) {
      return;
    }

    const durationMs = visualDurationMs(
      activePhysics.heatingTimeSec,
      prefersReducedMotion(),
    );

    if (durationMs <= 0) {
      commitExperiment(result);
      return;
    }

    setHeating({ result, durationMs });
  }

  function handleResetBread() {
    if (heating) {
      return;
    }
    resetBread();
  }

  function handleSaveObservation() {
    saveObservation(observationText);
    setObservationText("");
  }

  function handleSaveDescription() {
    saveDescription(descriptionText);
    setDescriptionText("");
  }

  function handleSavePrediction() {
    savePrediction(predictionChoice, predictionReasoning);
    setPredictionChoice("");
    setPredictionReasoning("");
  }

  function handleSaveExperimentEvidence() {
    saveExperimentEvidence(predictionComparison, experimentReflection);
    setPredictionComparison("");
    setExperimentReflection("");
  }

  function handleSaveExplanation() {
    saveExplanation(explanationText);
    setExplanationText("");
  }

  function handleSaveModel() {
    const preview = {
      nodes: ["energy enters", modelMiddleNode, "temperature increases"],
      connections: [
        ...(connectSourceToMiddle
          ? [{ from: "energy enters", to: modelMiddleNode }]
          : []),
        ...(connectMiddleToTarget
          ? [{ from: modelMiddleNode, to: "temperature increases" }]
          : []),
      ],
      correctStructure:
        modelMiddleNode === "internal energy changes" &&
        connectSourceToMiddle &&
        connectMiddleToTarget,
      timestamp: new Date().toISOString(),
    };

    saveModelAttempt({
      middleNode: modelMiddleNode,
      connectSourceToMiddle,
      connectMiddleToTarget,
    });

    setModelFeedback(summarizeModelAttempt(preview));
    if (preview.correctStructure) {
      setModelMiddleNode("");
      setConnectSourceToMiddle(false);
      setConnectMiddleToTarget(false);
    }
  }

  function handleSaveTransfer() {
    if (!nextTransferScenario) {
      return;
    }

    const preview = {
      scenarioId: nextTransferScenario.id,
      response: transferText.trim(),
      identifiedSharedModel: classifyTransferAttempt(transferText),
      timestamp: new Date().toISOString(),
    };

    saveTransferAttempt(nextTransferScenario.id, transferText);
    setTransferFeedback(summarizeTransferAttempt(preview));
    setTransferText("");
  }

  function handleSaveExam() {
    if (!nextExamQuestion) {
      return;
    }

    const evaluation = evaluateExamAttempt({
      question: nextExamQuestion,
      representation: [examRepresentation],
      modelFocus: examModelFocus,
      selectedAnswer: examSelectedAnswer,
      reasoning: examReasoning,
    });

    saveExamAttempt({
      question: nextExamQuestion,
      representation: [examRepresentation],
      modelFocus: examModelFocus,
      selectedAnswer: examSelectedAnswer,
      reasoning: examReasoning,
    });

    setExamFeedback(summarizeExamAttempt(evaluation));
    setExamRepresentation("");
    setExamModelFocus("");
    setExamSelectedAnswer("");
    setExamReasoning("");
  }

  function handleSaveIndependentExplanation() {
    saveIndependentExplanation(independentExplanation);
    setIndependentExplanation("");
  }

  function handleSaveIndependentExam() {
    saveIndependentExam(independentAnswer);
  }

  const scene = (
    <MicrowaveScene
      temperatureC={displayTemperatureC}
      isHeating={isHeating}
      remainingTimeSec={remainingTimeSec}
      powerW={activePhysics.powerW}
    />
  );

  const task = isEntry ? (
    <div className="mx-auto max-w-md text-center lg:text-left">
      <h1 className="font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
        {SCENE_COPY.headline}
      </h1>
      <p className="mt-3 text-lg text-[var(--ink-muted)]">{SCENE_COPY.subheadline}</p>
    </div>
  ) : activeSession.stage === LearningStage.OBSERVE ? (
    <div className="space-y-6">
      <p className="text-[var(--ink-muted)]">{SCENE_COPY.observeInstruction}</p>
      <MicrowaveControls
        isHeating={isHeating}
        hasHeated={hasHeated}
        canReset={canReset}
        onStartHeating={handleStartHeating}
        onResetBread={handleResetBread}
      />
      {lastResult && !isHeating ? (
        <>
          <Card className="space-y-3 p-4">
            <p className="text-sm font-medium text-[var(--ink)]">
              {breadIsReset ? SCENE_COPY.lastRun : SCENE_COPY.heatingComplete}
            </p>
            <ExperimentResult physicsState={activePhysics} result={lastResult} />
          </Card>
          <StudentInput
            label={SCENE_COPY.observeQuestion}
            prompt="Write what you actually observed before trying to explain it."
            placeholder="For example: The bread got hotter."
            value={observationText}
            onChange={setObservationText}
            onSubmit={handleSaveObservation}
            submitLabel={SCENE_COPY.observeSubmit}
            minLength={3}
          />
          <VocabularyChips
            label="Helpful observation words"
            words={OBSERVATION_VOCAB}
            onSelect={(word) => setObservationText((current) => appendWord(current, word))}
          />
        </>
      ) : null}
    </div>
  ) : activeSession.stage === LearningStage.DESCRIBE ? (
    <div className="space-y-6">
      <Card className="space-y-3 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">Your observation</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{latestObservation}</p>
      </Card>
      {describeNeedsPhysics ? (
        <Card className="space-y-2 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">Try again in physics language</p>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            {SCENE_COPY.describeNeedsPhysics}
          </p>
        </Card>
      ) : null}
      <StudentInput
        label={SCENE_COPY.describeQuestion}
        prompt={SCENE_COPY.describeInstruction}
        placeholder="For example: The temperature of the bread increased."
        value={descriptionText}
        onChange={setDescriptionText}
        onSubmit={handleSaveDescription}
        submitLabel={SCENE_COPY.describeSubmit}
        minLength={8}
      />
      <VocabularyChips
        label="Physics words you can use"
        words={DESCRIPTION_VOCAB}
        onSelect={(word) => setDescriptionText((current) => appendWord(current, word))}
      />
    </div>
  ) : activeSession.stage === LearningStage.PREDICT ? (
    <div className="space-y-6">
      <Card className="space-y-3 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">Your physics description</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{latestDescription}</p>
      </Card>
      <div className="space-y-2">
        <p className="text-[var(--ink-muted)]">{SCENE_COPY.predictInstruction}</p>
        <p className="text-sm font-medium text-[var(--ink)]">
          {SCENE_COPY.predictQuestion}
        </p>
      </div>
      <PredictionPanel
        selected={predictionChoice}
        reasoning={predictionReasoning}
        onSelect={setPredictionChoice}
        onReasoningChange={setPredictionReasoning}
        onSubmit={handleSavePrediction}
      />
    </div>
  ) : activeSession.stage === LearningStage.EXPERIMENT ? (
    <div className="space-y-6">
      <p className="text-[var(--ink-muted)]">{SCENE_COPY.experimentInstruction}</p>
      {latestPrediction ? (
        <Card className="space-y-3 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">Your prediction</p>
          <p className="text-sm text-[var(--ink-muted)]">{latestPrediction.prediction}</p>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            {latestPrediction.reasoning}
          </p>
        </Card>
      ) : null}
      <MicrowaveControls
        isHeating={isHeating}
        hasHeated={hasHeated}
        canReset={canReset}
        powerW={activePhysics.powerW}
        heatingTimeSec={activePhysics.heatingTimeSec}
        onPowerChange={(powerW) => updateControls({ powerW })}
        onHeatingTimeChange={(nextHeatingTimeSec) =>
          updateControls({ heatingTimeSec: nextHeatingTimeSec })
        }
        onStartHeating={handleStartHeating}
        onResetBread={handleResetBread}
      />
      {!ranPostPredictionExperiment && !isHeating ? (
        <Card className="p-4">
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            {SCENE_COPY.experimentNeedNewRun}
          </p>
        </Card>
      ) : null}
      {ranPostPredictionExperiment && lastResult && !isHeating ? (
        <Card className="space-y-3 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">
            {breadIsReset ? SCENE_COPY.lastRun : SCENE_COPY.heatingComplete}
          </p>
          <ExperimentResult physicsState={activePhysics} result={lastResult} />
        </Card>
      ) : null}
      {ranPostPredictionExperiment && !isHeating && !experimentEvidenceComplete ? (
        <ExperimentEvidencePanel
          comparison={predictionComparison}
          reflection={experimentReflection}
          onComparisonChange={setPredictionComparison}
          onReflectionChange={setExperimentReflection}
          onSubmit={handleSaveExperimentEvidence}
        />
      ) : null}
      {experimentEvidenceComplete ? (
        <Card className="space-y-3 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">
            You compared the result with your prediction.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => goToStage(LearningStage.EXPLAIN)}>
              Continue to explanation
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  ) : activeSession.stage === LearningStage.EXPLAIN ? (
    <div className="space-y-6">
      <Card className="space-y-3 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">What you tested</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {latestPrediction?.prediction ?? "No saved prediction."}
        </p>
        {lastResult ? <ExperimentResult physicsState={activePhysics} result={lastResult} /> : null}
      </Card>
      <ExplanationPanel
        prompt={SCENE_COPY.explainInstruction}
        question={SCENE_COPY.explainQuestion}
        value={explanationText}
        onChange={setExplanationText}
        onSubmit={handleSaveExplanation}
        feedback={latestExplanation ? explanationFeedback : null}
        words={EXPLANATION_VOCAB}
        onSelectWord={(word) => setExplanationText((current) => appendWord(current, word))}
      />
    </div>
  ) : activeSession.stage === LearningStage.MODEL ? (
    <div className="space-y-6">
      <Card className="space-y-3 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">Your explanation</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {latestExplanation?.text ?? "No saved explanation yet."}
        </p>
        {latestExplanation ? (
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            {explanationFeedback}
          </p>
        ) : null}
      </Card>
      <div className="space-y-2">
        <p className="text-[var(--ink-muted)]">{SCENE_COPY.modelInstruction}</p>
      </div>
      <ModelCanvas
        selectedMiddleNode={modelMiddleNode}
        connectSourceToMiddle={connectSourceToMiddle}
        connectMiddleToTarget={connectMiddleToTarget}
        onSelectMiddleNode={setModelMiddleNode}
        onToggleSourceToMiddle={() =>
          setConnectSourceToMiddle((current) => !current)
        }
        onToggleMiddleToTarget={() =>
          setConnectMiddleToTarget((current) => !current)
        }
        onSubmit={handleSaveModel}
        feedback={modelFeedback}
      />
    </div>
  ) : activeSession.stage === LearningStage.TRANSFER ? (
    <div className="space-y-6">
      <Card className="space-y-3 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">Your model</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {latestModelAttempt ? summarizeModelAttempt(latestModelAttempt) : modelFeedback}
        </p>
      </Card>
      {nextTransferScenario ? (
        <TransferScenario
          scenario={nextTransferScenario}
          value={transferText}
          onChange={setTransferText}
          onSubmit={handleSaveTransfer}
          completedCount={completedTransferIds.size}
          totalCount={REQUIRED_TRANSFER_SCENARIO_IDS.length}
          feedback={transferFeedback}
        />
      ) : (
        <Card className="space-y-2 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">Transfer completed</p>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            You have responded to all three transfer situations. The next step is moving into exam-style representation.
          </p>
        </Card>
      )}
    </div>
  ) : activeSession.stage === LearningStage.EXAM ? (
    <div className="space-y-6">
      <Card className="space-y-3 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">Exam mode</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {SCENE_COPY.examInstruction}
        </p>
      </Card>
      {nextExamQuestion ? (
        <ExamQuestion
          key={nextExamQuestion.id}
          question={nextExamQuestion}
          representation={examRepresentation}
          modelFocus={examModelFocus}
          selectedAnswer={examSelectedAnswer}
          reasoning={examReasoning}
          completedCount={completedExamIds.size}
          totalCount={REQUIRED_EXAM_QUESTION_IDS.length}
          onRepresentationChange={setExamRepresentation}
          onModelFocusChange={setExamModelFocus}
          onSelectedAnswerChange={setExamSelectedAnswer}
          onReasoningChange={setExamReasoning}
          onSubmit={handleSaveExam}
          feedback={examFeedback}
        />
      ) : (
        <Card className="space-y-2 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">Exam completed</p>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            You finished the current exam set. The next step is the independent `AI_OFF` stage.
          </p>
        </Card>
      )}
    </div>
  ) : activeSession.stage === LearningStage.AI_OFF ? (
    <IndependentChallenge
      explanation={independentExplanation}
      savedExplanation={activeSession.independentAssessment?.explanation ?? ""}
      onExplanationChange={setIndependentExplanation}
      onSubmitExplanation={handleSaveIndependentExplanation}
      explanationSaved={Boolean(activeSession.independentAssessment?.explanation)}
      selectedAnswer={
        independentAnswer ||
        activeSession.independentAssessment?.examResponses[INDEPENDENT_EXAM_QUESTION.id] ||
        ""
      }
      onSelectAnswer={setIndependentAnswer}
      onSubmitExam={handleSaveIndependentExam}
      examSaved={Boolean(
        activeSession.independentAssessment?.examResponses[INDEPENDENT_EXAM_QUESTION.id],
      )}
    />
  ) : (
    <ReflectionPanel
      profile={activeSession.cognitiveProfile ?? buildCognitiveProfile(activeSession)}
    />
  );

  const actions = isEntry ? (
    <Button size="lg" onClick={startLesson} aria-label="Start the investigation">
      {SCENE_COPY.startCta}
    </Button>
  ) : (
    <p className="text-sm text-[var(--ink-muted)]">
      {activeSession.stage === LearningStage.OBSERVE
        ? "Watch the bread first, then record what you noticed."
        : activeSession.stage === LearningStage.DESCRIBE
          ? "Name the physical quantity that changed."
          : activeSession.stage === LearningStage.PREDICT
            ? "Commit to a prediction before you test it."
            : activeSession.stage === LearningStage.EXPERIMENT
              ? "Change one condition and compare the result with your prediction."
              : activeSession.stage === LearningStage.EXPLAIN
                ? "Explain the physical change without jumping straight to a label."
                : activeSession.stage === LearningStage.MODEL
                  ? "Build the full cause-and-effect chain yourself."
                  : activeSession.stage === LearningStage.TRANSFER
                    ? "Keep the model the same while the surface story changes."
                    : activeSession.stage === LearningStage.EXAM
                      ? "Store both the answer and the reasoning."
                      : activeSession.stage === LearningStage.AI_OFF
                        ? "No tutor help belongs in this stage."
                        : "These marks are traces of thinking, not a claim of mastery."}
    </p>
  );

  return (
    <LearningShell
      stage={activeSession.stage}
      scene={
        activeSession.stage === LearningStage.EXAM ||
        activeSession.stage === LearningStage.AI_OFF ||
        activeSession.stage === LearningStage.COMPLETE
          ? undefined
          : scene
      }
      task={task}
      tutor={
        tutor.allowed &&
        activeSession.stage !== LearningStage.AI_OFF &&
        activeSession.stage !== LearningStage.COMPLETE ? (
          <TutorPanel
            message={tutor.message}
            loading={tutor.loading}
            onAsk={() => {
              void tutor.askTutor(
                currentStudentThought(activeSession, {
                  observationText,
                  descriptionText,
                  predictionReasoning,
                  explanationText,
                  transferText,
                  examReasoning,
                }),
              );
            }}
          />
        ) : null
      }
      actions={actions}
      onStartOver={startOver}
      onGoBack={goBack}
      canGoBack={canGoBack}
    />
  );
}

function currentStudentThought(
  session: LearningSession,
  drafts: {
    observationText: string;
    descriptionText: string;
    predictionReasoning: string;
    explanationText: string;
    transferText: string;
    examReasoning: string;
  },
): string {
  switch (session.stage) {
    case LearningStage.OBSERVE:
      return drafts.observationText || session.observations.at(-1)?.text || "";
    case LearningStage.DESCRIBE:
      return drafts.descriptionText || session.descriptions.at(-1)?.text || "";
    case LearningStage.PREDICT:
      return drafts.predictionReasoning || session.predictions.at(-1)?.reasoning || "";
    case LearningStage.EXPLAIN:
      return drafts.explanationText || session.explanations.at(-1)?.text || "";
    case LearningStage.TRANSFER:
      return drafts.transferText || session.transferAttempts.at(-1)?.response || "";
    case LearningStage.EXAM:
      return drafts.examReasoning || session.examAttempts.at(-1)?.reasoning || "";
    default:
      return "";
  }
}

function appendWord(current: string, word: string): string {
  if (current.trim().length === 0) {
    return word;
  }

  return current.endsWith(" ") ? `${current}${word}` : `${current} ${word}`;
}
