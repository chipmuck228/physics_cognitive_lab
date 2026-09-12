import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SCENE_COPY } from "@/lib/content/microwave-bread";
import {
  studentModelLabel,
} from "@/lib/content/student-language";
import {
  MODEL_ANCHORS,
  MODEL_NODE_OPTIONS,
} from "@/lib/learning/model-evaluation";

interface ModelCanvasProps {
  selectedMiddleNode: string;
  connectSourceToMiddle: boolean;
  connectMiddleToTarget: boolean;
  onSelectMiddleNode: (node: string) => void;
  onToggleSourceToMiddle: () => void;
  onToggleMiddleToTarget: () => void;
  onSubmit: () => void;
  feedback?: string | null;
}

export function ModelCanvas({
  selectedMiddleNode,
  connectSourceToMiddle,
  connectMiddleToTarget,
  onSelectMiddleNode,
  onToggleSourceToMiddle,
  onToggleMiddleToTarget,
  onSubmit,
  feedback,
}: ModelCanvasProps) {
  const canSubmit =
    selectedMiddleNode.length > 0 &&
    connectSourceToMiddle &&
    connectMiddleToTarget;

  return (
    <div className="space-y-4">
      <Card className="space-y-5 p-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--ink)]">{SCENE_COPY.chooseMiddle}</p>
          <div className="grid gap-2">
            {MODEL_NODE_OPTIONS.map((node) => {
              const selected = selectedMiddleNode === node;
              return (
                <button
                  key={node}
                  type="button"
                  onClick={() => onSelectMiddleNode(node)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] ${
                    selected
                      ? "border-[var(--heat)] bg-[var(--heat)]/8 text-[var(--ink)]"
                      : "border-[var(--line)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink-muted)]"
                  }`}
                  aria-pressed={selected}
                >
                  {studentModelLabel(node)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">
            {SCENE_COPY.connectRelationship}
          </p>
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-[var(--line)] p-3 text-[var(--ink)]">
              {studentModelLabel(MODEL_ANCHORS.source)}
            </div>
            <button
              type="button"
              onClick={onToggleSourceToMiddle}
              className={`w-full rounded-full border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] ${
                connectSourceToMiddle
                  ? "border-[var(--heat)] bg-[var(--heat)]/8 text-[var(--ink)]"
                  : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink-muted)]"
              }`}
              aria-pressed={connectSourceToMiddle}
            >
              {connectSourceToMiddle ? SCENE_COPY.connected : SCENE_COPY.connectTop}
            </button>
            <div className="rounded-xl border border-dashed border-[var(--line)] p-3 text-[var(--ink)]">
              {selectedMiddleNode
                ? studentModelLabel(selectedMiddleNode)
                : SCENE_COPY.chooseMiddleFirst}
            </div>
            <button
              type="button"
              onClick={onToggleMiddleToTarget}
              className={`w-full rounded-full border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] ${
                connectMiddleToTarget
                  ? "border-[var(--heat)] bg-[var(--heat)]/8 text-[var(--ink)]"
                  : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink-muted)]"
              }`}
              aria-pressed={connectMiddleToTarget}
            >
              {connectMiddleToTarget ? SCENE_COPY.connected : SCENE_COPY.connectBottom}
            </button>
            <div className="rounded-xl border border-[var(--line)] p-3 text-[var(--ink)]">
              {studentModelLabel(MODEL_ANCHORS.target)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--ink-muted)]">{SCENE_COPY.buildYourself}</p>
          <Button onClick={onSubmit} disabled={!canSubmit}>
            {SCENE_COPY.modelSubmit}
          </Button>
        </div>
      </Card>

      {feedback ? (
        <Card className="p-4">
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{feedback}</p>
        </Card>
      ) : null}
    </div>
  );
}
