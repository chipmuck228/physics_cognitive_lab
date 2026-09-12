import {
  ENGINE_DEMO_COPY,
  ENGINE_OUTPUT_LABELS,
  ENGINE_WORK_LABELS,
} from "@/lib/content/engine-visual";
import type { EngineState } from "@/lib/physics/engine";
import { hasMainMechanicalOutput } from "@/lib/physics/engine";

interface EngineStateDebugProps {
  state: EngineState;
}

export function EngineStateDebug({ state }: EngineStateDebugProps) {
  return (
    <aside
      className="rounded-2xl border border-[var(--line)] bg-white/70 p-4 text-sm"
      aria-label={ENGINE_DEMO_COPY.debugTitle}
    >
      <p className="font-medium text-[var(--ink)]">{ENGINE_DEMO_COPY.debugTitle}</p>
      <dl className="mt-3 grid grid-cols-[8.5rem_1fr] gap-x-3 gap-y-2 text-[var(--ink-muted)]">
        <dt>{ENGINE_DEMO_COPY.motionStatus}</dt>
        <dd data-testid="motion-status">
          {state.crankshaftMoving
            ? ENGINE_DEMO_COPY.crankMoving
            : ENGINE_DEMO_COPY.crankStill}
        </dd>
        <dt>{ENGINE_DEMO_COPY.outputStatus}</dt>
        <dd data-testid="output-status">
          {ENGINE_OUTPUT_LABELS[state.mechanicalOutput]}
        </dd>
        <dt>{ENGINE_DEMO_COPY.workStatus}</dt>
        <dd>{ENGINE_WORK_LABELS[state.workTransfer]}</dd>
      </dl>
      {state.crankshaftMoving && !hasMainMechanicalOutput(state) ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--ink-muted)]" data-testid="motion-is-not-output">
          曲轴在动，不等于主要动力输出。
        </p>
      ) : null}
    </aside>
  );
}
