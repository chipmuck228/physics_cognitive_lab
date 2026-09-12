import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  MICROWAVE_AI_OFF_A_PRE_COMMIT,
  MICROWAVE_AI_OFF_B_PRE_COMMIT,
  MICROWAVE_TASK_COPY,
  SCENE_COPY,
} from "@/lib/content/microwave-bread";
import {
  MICROWAVE_AI_OFF_ICE_ID,
  canCommitMicrowaveAiOffResponse,
  microwaveAiOffChallenge,
  microwaveAiOffJudgments,
  microwaveAiOffPostCheckOptions,
  microwaveJudgmentLabelFor,
  type MicrowaveAiOffStep,
} from "@/lib/learning/microwave-ai-off";
import type { IndependentChallengeAttempt } from "@/types/learning";

interface MicrowaveAiOffTaskProps {
  challengeId: string;
  questionIndex: number;
  totalCount: number;
  step: MicrowaveAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  preCommitEvidenceIds: string[];
  committed: IndependentChallengeAttempt | null;
  needResponse: boolean;
  needPostCheck: boolean;
  onSelectedAnswerChange: (value: string) => void;
  onReasoningChange: (value: string) => void;
  onPreCommitEvidenceChange: (ids: string[]) => void;
  onPostCheckToggle: (id: string) => void;
  onCommit: () => void;
  onSubmitPostCheck: () => void;
  onRetry: () => void;
}

export function MicrowaveAiOffTask({
  challengeId,
  questionIndex,
  totalCount,
  step,
  selectedAnswer,
  reasoning,
  postCheckSelections,
  preCommitEvidenceIds,
  committed,
  needResponse,
  needPostCheck,
  onSelectedAnswerChange,
  onReasoningChange,
  onPreCommitEvidenceChange,
  onPostCheckToggle,
  onCommit,
  onSubmitPostCheck,
  onRetry,
}: MicrowaveAiOffTaskProps) {
  const challenge = microwaveAiOffChallenge(challengeId);
  const judgments = microwaveAiOffJudgments(challengeId);
  const postCheckOptions = microwaveAiOffPostCheckOptions(challengeId);
  const showPostCheck = step === "post-check" && Boolean(committed);
  const probes =
    challengeId === MICROWAVE_AI_OFF_ICE_ID
      ? MICROWAVE_AI_OFF_B_PRE_COMMIT
      : MICROWAVE_AI_OFF_A_PRE_COMMIT;
  const canCommit = canCommitMicrowaveAiOffResponse({
    challengeId,
    selectedAnswer,
    studentReasoning: reasoning,
    preCommitEvidenceIds,
    timestamp: "",
  });
  const showRetry =
    showPostCheck &&
    committed &&
    committed.accepted === false &&
    committed.postCheckIds.length > 0;

  return (
    <div
      className="space-y-5"
      data-testid="microwave-ai-off-task"
      data-challenge={challengeId}
      data-step={step}
    >
      <p className="text-sm font-medium text-[var(--ink)]">{SCENE_COPY.aiOffBanner}</p>
      <p className="text-sm text-[var(--ink-muted)]">{SCENE_COPY.aiOffInstruction}</p>
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
        <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
          {`第 ${questionIndex + 1} 题 / 共 ${totalCount} 题`}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink)]">{challenge.scenario}</p>
        <p className="font-medium leading-relaxed text-[var(--ink)]">{challenge.question}</p>
      </article>
      {!showPostCheck ? (
        <>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-[var(--ink)]">选择你的判断</legend>
            {judgments.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
              >
                <input
                  type="radio"
                  name={`microwave-ai-off-${challengeId}`}
                  checked={selectedAnswer === option.id}
                  onChange={() => onSelectedAnswerChange(option.id)}
                  className="mt-1"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="space-y-4" data-testid="microwave-ai-off-pre-commit">
            <legend className="text-sm font-medium text-[var(--ink)]">提交前先标出你的想法</legend>
            {probes.map((probe) => (
              <div key={probe.id} className="space-y-2">
                <p className="text-sm font-medium text-[var(--ink)]">{probe.prompt}</p>
                {probe.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
                  >
                    <input
                      type="radio"
                      name={`microwave-ai-off-pre-${probe.id}`}
                      checked={preCommitEvidenceIds.includes(option.value)}
                      onChange={() => {
                        const values = probe.options.map((item) => item.value as string);
                        onPreCommitEvidenceChange([
                          ...preCommitEvidenceIds.filter((id) => !values.includes(id)),
                          option.value,
                        ]);
                      }}
                      className="mt-1"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            ))}
          </fieldset>
          <div className="space-y-2">
            <label htmlFor="microwave-ai-off-reason" className="text-sm font-medium text-[var(--ink)]">
              {SCENE_COPY.yourIndependentWhy}
            </label>
            <textarea
              id="microwave-ai-off-reason"
              value={reasoning}
              onChange={(event) => onReasoningChange(event.target.value)}
              placeholder={SCENE_COPY.independentPlaceholder}
              className="min-h-28 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] p-3 text-sm"
            />
          </div>
          {needResponse ? (
            <p className="text-sm text-[var(--ink-muted)]">
              {MICROWAVE_TASK_COPY.aiOffNeedResponse}
            </p>
          ) : null}
          <Button onClick={onCommit} disabled={!canCommit}>
            {SCENE_COPY.independentExplainSubmit}
          </Button>
        </>
      ) : (
        <>
          <Card className="space-y-2 p-4">
            <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
              你刚才独立写下的内容
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {microwaveJudgmentLabelFor(challengeId, committed?.selectedAnswer ?? "")}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {committed?.studentReasoning}
            </p>
          </Card>
          <fieldset className="space-y-3" data-testid="microwave-ai-off-post-check">
            <legend className="text-sm font-medium text-[var(--ink)]">再核对这些句子</legend>
            {postCheckOptions.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
              >
                <input
                  type="checkbox"
                  checked={postCheckSelections.includes(option.id)}
                  onChange={() => onPostCheckToggle(option.id)}
                  className="mt-1"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {needPostCheck ? (
            <p className="text-sm text-[var(--ink-muted)]">
              {MICROWAVE_TASK_COPY.aiOffNeedPostCheck}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onSubmitPostCheck}
              disabled={postCheckSelections.length === 0}
            >
              {SCENE_COPY.independentExamSubmit}
            </Button>
            {showRetry ? (
              <Button variant="secondary" onClick={onRetry}>
                再独立写一次
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
