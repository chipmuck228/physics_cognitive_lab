import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  HEAT_AI_OFF_COPY,
  HEAT_COPY,
  HEAT_ICE_CONDITION_PROBES,
} from "@/lib/content/equal-mass-heated-samples";
import {
  HEAT_AI_OFF_ICE_CHALLENGE_ID,
  canCommitHeatAiOffResponse,
  heatAiOffChallenge,
  heatAiOffJudgments,
  heatAiOffPostCheckOptions,
  heatJudgmentLabelFor,
  type HeatAiOffStep,
} from "@/lib/learning/heat-ai-off";
import type { IndependentChallengeAttempt } from "@/types/learning";

interface HeatAiOffTaskProps {
  challengeId: string;
  questionIndex: number;
  totalCount: number;
  step: HeatAiOffStep;
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

export function HeatAiOffTask({
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
}: HeatAiOffTaskProps) {
  const challenge = heatAiOffChallenge(challengeId);
  const judgments = heatAiOffJudgments(challengeId);
  const postCheckOptions = heatAiOffPostCheckOptions(challengeId);
  const showPostCheck = step === "post-check" && Boolean(committed);
  const selectedFacts = new Set(postCheckSelections);
  const canCommit = canCommitHeatAiOffResponse({
    challengeId,
    selectedAnswer,
    studentReasoning: reasoning,
    preCommitEvidenceIds,
    timestamp: "",
  });
  const showIcePreCommit =
    !showPostCheck && challengeId === HEAT_AI_OFF_ICE_CHALLENGE_ID;
  const canSubmitPostCheck = postCheckSelections.length > 0;
  const showRetry =
    showPostCheck &&
    committed &&
    committed.accepted === false &&
    committed.postCheckIds.length > 0;

  return (
    <div
      className="space-y-5"
      data-testid="heat-ai-off-task"
      data-challenge={challengeId}
      data-step={step}
    >
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-6">
        <p
          className="text-xs tracking-[0.16em] text-[var(--ink-muted)]"
          data-testid="heat-ai-off-number"
        >
          {`第 ${questionIndex + 1} 题 / 共 ${totalCount} 题`}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink)]" data-testid="heat-ai-off-scenario">
          {challenge.scenario}
        </p>
        <p
          className="font-medium leading-relaxed text-[var(--ink)]"
          data-testid="heat-ai-off-question"
        >
          {challenge.question}
        </p>
      </article>

      {!showPostCheck ? (
        <>
          <fieldset className="space-y-3" data-testid="heat-ai-off-options">
            <legend className="text-sm font-medium text-[var(--ink)]">选择你的判断</legend>
            {judgments.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]"
              >
                <input
                  type="radio"
                  name={`heat-ai-off-${challengeId}`}
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => onSelectedAnswerChange(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {showIcePreCommit ? (
            <fieldset
              className="space-y-4"
              data-testid="heat-ai-off-pre-commit-probes"
            >
              <legend className="text-sm font-medium text-[var(--ink)]">
                {HEAT_AI_OFF_COPY.icePreCommitTitle}
              </legend>
              {HEAT_ICE_CONDITION_PROBES.map((probe) => (
                <div key={probe.id} className="space-y-2">
                  <p className="text-sm font-medium text-[var(--ink)]">{probe.prompt}</p>
                  {probe.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]"
                    >
                      <input
                        type="radio"
                        name={`heat-ai-off-pre-commit-${probe.id}`}
                        checked={preCommitEvidenceIds.includes(option.value)}
                        onChange={() => {
                          const optionValues: string[] = probe.options.map(
                            (item) => item.value,
                          );
                          onPreCommitEvidenceChange([
                            ...preCommitEvidenceIds.filter(
                              (id) => !optionValues.includes(id),
                            ),
                            option.value,
                          ]);
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </fieldset>
          ) : null}
          <div className="space-y-2" data-testid="heat-ai-off-reasoning">
            <label
              className="text-sm font-medium text-[var(--ink)]"
              htmlFor="heat-ai-off-reason"
            >
              {HEAT_COPY.reasonLabel}
            </label>
            <textarea
              id="heat-ai-off-reason"
              className="min-h-28 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] p-3 text-sm leading-relaxed text-[var(--ink)]"
              placeholder={HEAT_COPY.reasonPlaceholder}
              value={reasoning}
              onChange={(event) => onReasoningChange(event.target.value)}
            />
          </div>
          {needResponse ? (
            <p className="text-sm text-[var(--ink-muted)]">{HEAT_AI_OFF_COPY.needCommit}</p>
          ) : null}
          <Button onClick={onCommit} disabled={!canCommit} data-testid="heat-ai-off-commit">
            {HEAT_AI_OFF_COPY.commit}
          </Button>
        </>
      ) : (
        <>
          <Card className="space-y-2 p-4" data-testid="heat-ai-off-committed">
            <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
              你刚才独立写下的内容
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {heatJudgmentLabelFor(challengeId, committed?.selectedAnswer ?? "")}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {committed?.studentReasoning}
            </p>
          </Card>
          <fieldset className="space-y-3" data-testid="heat-ai-off-post-check">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {HEAT_AI_OFF_COPY.postCheckTitle}
            </legend>
            {postCheckOptions.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]"
              >
                <input
                  type="checkbox"
                  checked={selectedFacts.has(option.id)}
                  onChange={() => onPostCheckToggle(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {needPostCheck ? (
            <p className="text-sm text-[var(--ink-muted)]">请标出你刚才判断时用到的事实。</p>
          ) : null}
          {committed && committed.postCheckIds.length > 0 && !committed.accepted ? (
            <p className="text-sm text-[var(--ink-muted)]" data-testid="heat-ai-off-feedback">
              这次还不能算独立完成。你刚才写下的内容会留着。可以再独立写一次。
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onSubmitPostCheck}
              disabled={!canSubmitPostCheck}
              data-testid="heat-ai-off-post-check-submit"
            >
              {HEAT_AI_OFF_COPY.postCheckSubmit}
            </Button>
            {showRetry ? (
              <Button variant="secondary" onClick={onRetry} data-testid="heat-ai-off-retry">
                再独立写一次
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
