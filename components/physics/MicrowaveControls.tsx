import {
  MAX_HEATING_TIME_SEC,
  MAX_POWER_W,
  MIN_HEATING_TIME_SEC,
  MIN_POWER_W,
} from "@/lib/physics/constants";
import { Button } from "@/components/common/Button";
import { SCENE_COPY } from "@/lib/content/microwave-bread";

interface MicrowaveControlsProps {
  isHeating: boolean;
  hasHeated: boolean;
  canReset: boolean;
  powerW?: number;
  heatingTimeSec?: number;
  onPowerChange?: (powerW: number) => void;
  onHeatingTimeChange?: (heatingTimeSec: number) => void;
  onStartHeating: () => void;
  onResetBread: () => void;
}

export function MicrowaveControls({
  isHeating,
  hasHeated,
  canReset,
  powerW,
  heatingTimeSec,
  onPowerChange,
  onHeatingTimeChange,
  onStartHeating,
  onResetBread,
}: MicrowaveControlsProps) {
  const startLabel = isHeating
    ? SCENE_COPY.heatingInProgress
    : hasHeated
      ? SCENE_COPY.heatAgainCta
      : SCENE_COPY.heatingCta;
  const canAdjust = typeof powerW === "number" && typeof heatingTimeSec === "number";

  return (
    <div className="space-y-4">
      {canAdjust ? (
        <div className="grid gap-4 rounded-2xl border border-[var(--line)] bg-white/60 p-4">
          <label className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[var(--ink)]">{SCENE_COPY.power}</span>
              <span className="text-sm text-[var(--ink-muted)]">{powerW} W</span>
            </div>
            <input
              type="range"
              min={MIN_POWER_W}
              max={MAX_POWER_W}
              step={100}
              value={powerW}
              onChange={(event) => onPowerChange?.(Number(event.target.value))}
              disabled={isHeating}
              className="w-full accent-[var(--heat)]"
            />
          </label>

          <label className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[var(--ink)]">{SCENE_COPY.heatingTime}</span>
              <span className="text-sm text-[var(--ink-muted)]">{heatingTimeSec} s</span>
            </div>
            <input
              type="range"
              min={MIN_HEATING_TIME_SEC}
              max={MAX_HEATING_TIME_SEC}
              step={10}
              value={heatingTimeSec}
              onChange={(event) =>
                onHeatingTimeChange?.(Number(event.target.value))
              }
              disabled={isHeating}
              className="w-full accent-[var(--heat)]"
            />
          </label>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={onStartHeating} disabled={isHeating} aria-label={startLabel}>
          {startLabel}
        </Button>
        <Button
          variant="secondary"
          onClick={onResetBread}
          disabled={isHeating || !canReset}
          aria-label={SCENE_COPY.resetBreadAria}
        >
          {SCENE_COPY.resetBreadCta}
        </Button>
      </div>
    </div>
  );
}
