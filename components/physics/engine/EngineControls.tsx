import { Button } from "@/components/common/Button";
import {
  ENGINE_DEMO_COPY,
  ENGINE_STROKE_LABELS,
} from "@/lib/content/engine-visual";
import { ENGINE_STROKE_ORDER, type EngineStroke } from "@/lib/physics/engine";

interface EngineControlsProps {
  playing: boolean;
  currentStroke: EngineStroke;
  combustionEnabled: boolean;
  pistonCanMove: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onReset: () => void;
  onSelectStroke: (stroke: EngineStroke) => void;
  onCombustionEnabledChange: (enabled: boolean) => void;
  onPistonCanMoveChange: (canMove: boolean) => void;
}

export function EngineControls({
  playing,
  currentStroke,
  combustionEnabled,
  pistonCanMove,
  onPlay,
  onPause,
  onNext,
  onReset,
  onSelectStroke,
  onCombustionEnabledChange,
  onPistonCanMoveChange,
}: EngineControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={playing ? onPause : onPlay}
          aria-label={playing ? ENGINE_DEMO_COPY.pause : ENGINE_DEMO_COPY.play}
        >
          {playing ? ENGINE_DEMO_COPY.pause : ENGINE_DEMO_COPY.play}
        </Button>
        <Button
          variant="secondary"
          onClick={onNext}
          aria-label={ENGINE_DEMO_COPY.next}
        >
          {ENGINE_DEMO_COPY.next}
        </Button>
        <Button
          variant="secondary"
          onClick={onReset}
          aria-label={ENGINE_DEMO_COPY.reset}
        >
          {ENGINE_DEMO_COPY.reset}
        </Button>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[var(--ink)]">
          {ENGINE_DEMO_COPY.chooseStroke}
        </legend>
        <div className="flex flex-wrap gap-2">
          {ENGINE_STROKE_ORDER.map((stroke) => (
            <Button
              key={stroke}
              variant={stroke === currentStroke ? "primary" : "secondary"}
              onClick={() => onSelectStroke(stroke)}
              aria-pressed={stroke === currentStroke}
              aria-label={ENGINE_STROKE_LABELS[stroke]}
            >
              {ENGINE_STROKE_LABELS[stroke]}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2 rounded-2xl border border-[var(--line)] bg-white/60 p-4">
        <legend className="px-1 text-sm font-medium text-[var(--ink)]">
          {ENGINE_DEMO_COPY.developerConditions}
        </legend>
        <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            checked={combustionEnabled}
            onChange={(event) => onCombustionEnabledChange(event.target.checked)}
          />
          {ENGINE_DEMO_COPY.combustionEnabled}
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            checked={pistonCanMove}
            onChange={(event) => onPistonCanMoveChange(event.target.checked)}
          />
          {ENGINE_DEMO_COPY.pistonCanMove}
        </label>
      </fieldset>
    </div>
  );
}
