import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ENGINE_TRANSFER_COPY } from "@/lib/content/four-stroke-engine";
import {
  ENGINE_TRANSFER_RELATION_DISPLAY_ORDER,
  ENGINE_TRANSFER_RELATIONS,
  type EngineTransferJudgment,
  type EngineTransferRelationId,
} from "@/lib/learning/engine-transfer";
import { TransferMode } from "@/types/physics-model";

interface EngineTransferTaskProps {
  targetId: string;
  scenario: string;
  transferMode: typeof TransferMode.FULL_MODEL | typeof TransferMode.PARTIAL_STRUCTURE;
  judgments: Record<string, EngineTransferJudgment>;
  relationOrder: string[];
  surfaceCueSelected: boolean;
  studentExplanation: string;
  feedback?: string | null;
  needMore: boolean;
  hints: string[];
  canRevealHint: boolean;
  canRetryMedium: boolean;
  onJudgmentChange: (
    relationId: EngineTransferRelationId,
    judgment: EngineTransferJudgment,
  ) => void;
  onToggleOrder: (relationId: EngineTransferRelationId) => void;
  onResetOrder: () => void;
  onSurfaceCueChange: (selected: boolean) => void;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
  onRetryMedium: () => void;
}

export function EngineTransferTask({
  targetId,
  scenario,
  transferMode,
  judgments,
  relationOrder,
  surfaceCueSelected,
  studentExplanation,
  feedback,
  needMore,
  hints,
  canRevealHint,
  canRetryMedium,
  onJudgmentChange,
  onToggleOrder,
  onResetOrder,
  onSurfaceCueChange,
  onExplanationChange,
  onSubmit,
  onRevealHint,
  onRetryMedium,
}: EngineTransferTaskProps) {
  const isPartial = transferMode === TransferMode.PARTIAL_STRUCTURE;
  const question = isPartial
    ? ENGINE_TRANSFER_COPY.partialQuestion
    : ENGINE_TRANSFER_COPY.fullQuestion;
  const ownWordsLabel = isPartial
    ? ENGINE_TRANSFER_COPY.ownWordsPartial
    : ENGINE_TRANSFER_COPY.ownWordsFull;

  return (
    <div className="space-y-4" data-testid="engine-transfer-task" data-target={targetId}>
      <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">{question}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{scenario}</p>

      <Card className="space-y-2 p-4" data-testid="engine-transfer-model-reminder">
        <p className="text-sm font-medium text-[var(--ink)]">
          {ENGINE_TRANSFER_COPY.reminderTitle}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_TRANSFER_COPY.reminderBody}
        </p>
        <ul className="space-y-1 text-sm text-[var(--ink)]">
          {ENGINE_TRANSFER_RELATIONS.map((relation) => (
            <li key={relation.id}>{relation.label}</li>
          ))}
        </ul>
      </Card>

      <div className="space-y-3">
        {ENGINE_TRANSFER_RELATION_DISPLAY_ORDER.map((relationId) => {
          const relation = ENGINE_TRANSFER_RELATIONS.find((item) => item.id === relationId);
          if (!relation) {
            return null;
          }
          const judgment = judgments[relation.id] ?? "";
          return (
            <Card
              key={relation.id}
              className="space-y-3 p-4"
              data-testid={`engine-transfer-relation-${relation.id}`}
            >
              <p className="text-sm font-medium text-[var(--ink)]">{relation.label}</p>
              <div className="flex flex-wrap gap-2">
                <ChoiceButton
                  testId={`engine-transfer-applies-${relation.id}`}
                  selected={judgment === "applies"}
                  onClick={() =>
                    onJudgmentChange(relation.id, judgment === "applies" ? "" : "applies")
                  }
                >
                  {isPartial ? ENGINE_TRANSFER_COPY.applies : ENGINE_TRANSFER_COPY.markApplies}
                </ChoiceButton>
                <ChoiceButton
                  testId={`engine-transfer-not-${relation.id}`}
                  selected={judgment === "not-necessarily"}
                  onClick={() =>
                    onJudgmentChange(
                      relation.id,
                      judgment === "not-necessarily" ? "" : "not-necessarily",
                    )
                  }
                >
                  {ENGINE_TRANSFER_COPY.notNecessarily}
                </ChoiceButton>
              </div>
            </Card>
          );
        })}
      </div>

      {isPartial ? null : (
        <Card className="space-y-3 p-4" data-testid="engine-transfer-order">
          <p className="text-sm font-medium text-[var(--ink)]">
            {ENGINE_TRANSFER_COPY.orderLabel}
          </p>
          <p className="text-sm text-[var(--ink-muted)]">{ENGINE_TRANSFER_COPY.orderHint}</p>
          <div className="flex flex-wrap gap-2">
            {ENGINE_TRANSFER_RELATION_DISPLAY_ORDER.map((relationId) => {
              const relation = ENGINE_TRANSFER_RELATIONS.find((item) => item.id === relationId);
              if (!relation || judgments[relation.id] !== "applies") {
                return null;
              }
              const orderIndex = relationOrder.indexOf(relation.id);
              return (
                <Button
                  key={relation.id}
                  variant={orderIndex >= 0 ? "primary" : "secondary"}
                  onClick={() => onToggleOrder(relation.id)}
                  data-testid={`engine-transfer-order-${relation.id}`}
                >
                  {orderIndex >= 0 ? `${orderIndex + 1}. ${relation.label}` : relation.label}
                </Button>
              );
            })}
          </div>
          {relationOrder.length > 0 ? (
            <Button variant="ghost" onClick={onResetOrder}>
              {ENGINE_TRANSFER_COPY.resetOrder}
            </Button>
          ) : null}
        </Card>
      )}

      {isPartial ? null : (
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={surfaceCueSelected}
            onChange={(event) => onSurfaceCueChange(event.target.checked)}
            data-testid="engine-transfer-surface-cue"
          />
          <span className="text-sm leading-relaxed text-[var(--ink)]">
            {ENGINE_TRANSFER_COPY.surfaceCue}
          </span>
        </label>
      )}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--ink)]">{ownWordsLabel}</span>
        <textarea
          value={studentExplanation}
          onChange={(event) => onExplanationChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)]"
          data-testid="engine-transfer-explanation"
          aria-label={ownWordsLabel}
        />
      </label>

      {feedback ? (
        <p className="text-sm text-[var(--ink)]" data-testid="engine-transfer-feedback">
          {feedback}
        </p>
      ) : null}
      {needMore ? (
        <p className="text-sm text-[var(--heat-strong)]">{ENGINE_TRANSFER_COPY.needMore}</p>
      ) : null}

      {hints.length > 0 ? (
        <ul className="space-y-2" data-testid="engine-hint-list">
          {hints.map((hint) => (
            <li
              key={hint}
              className="rounded-2xl bg-[var(--paper)] px-4 py-3 text-sm leading-relaxed text-[var(--ink)]"
            >
              {hint}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button onClick={onSubmit} data-testid="engine-transfer-submit">
          {ENGINE_TRANSFER_COPY.submit}
        </Button>
        <Button
          variant="secondary"
          onClick={onRevealHint}
          disabled={!canRevealHint}
          data-testid="engine-transfer-hint"
        >
          {canRevealHint ? ENGINE_TRANSFER_COPY.hint : ENGINE_TRANSFER_COPY.hintDone}
        </Button>
        {canRetryMedium ? (
          <Button
            variant="ghost"
            onClick={onRetryMedium}
            data-testid="engine-transfer-try-medium"
          >
            {ENGINE_TRANSFER_COPY.tryMedium}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
  testId,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        selected
          ? "border-[var(--heat)] bg-[var(--heat)]/10 text-[var(--ink)]"
          : "border-[var(--line)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink-muted)]"
      }`}
    >
      {children}
    </button>
  );
}
