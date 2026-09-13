import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import { LENS_COPY, LENS_OBSERVE_OPTIONS } from "@/lib/content/convex-lens-optical-bench";

interface LensObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  onMoveScreen: () => void;
  screenAtImagePlane: boolean;
  needMore: boolean;
  needMoreMessage?: string;
  saved: boolean;
  reviewOnly?: boolean;
}

export function LensObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  onMoveScreen,
  screenAtImagePlane,
  needMore,
  needMoreMessage,
  saved,
  reviewOnly = false,
}: LensObserveTaskProps) {
  const selected = new Set(selectedOptionIds);

  return (
    <div data-testid="lens-observe-task">
      <Card className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onPlayDemo} data-testid="lens-play-demo">
            {LENS_COPY.playDemo}
          </Button>
          <Button variant="secondary" onClick={onMoveScreen} data-testid="lens-move-screen">
            {screenAtImagePlane ? LENS_COPY.screenOffImage : LENS_COPY.screenAtImage}
          </Button>
        </div>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {LENS_COPY.observePrompt}
          </legend>
          {LENS_OBSERVE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`flex items-start gap-3 text-sm leading-relaxed text-[var(--ink)] ${
                reviewOnly ? "cursor-default opacity-70" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selected.has(option.id)}
                onChange={() => onToggle(option.id)}
                value={option.id}
                disabled={reviewOnly}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        {needMore ? (
          <ValidationMessage kind="missing" testId="lens-observe-need-more">
            {needMoreMessage ?? LENS_COPY.observeNeedRecord}
          </ValidationMessage>
        ) : null}
        {saved && !needMore ? (
          <ValidationMessage kind="info">已经记下你看见的。</ValidationMessage>
        ) : null}
        {reviewOnly ? null : (
          <div className="flex justify-end">
            <Button onClick={onSubmit}>{LENS_COPY.observeSubmit}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
