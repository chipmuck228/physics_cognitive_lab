import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";

interface LensCurrentActionProps {
  kicker?: string;
  nowDo: string;
  nextHint?: string;
}

export function LensCurrentAction({ kicker, nowDo, nextHint }: LensCurrentActionProps) {
  return (
    <section
      className="rounded-2xl border-2 border-[var(--heat)] bg-[var(--paper)] px-4 py-3"
      data-testid="lens-current-action"
      aria-label={LENS_COPY.nowDoLabel}
    >
      {kicker ? (
        <p
          className="text-xs font-medium tracking-wide text-[var(--ink-muted)]"
          data-testid="lens-trial-progress"
        >
          {kicker}
        </p>
      ) : null}
      <p className="mt-1 text-xs font-medium tracking-wide text-[var(--heat)]">
        {LENS_COPY.nowDoLabel}
      </p>
      <p
        className="mt-1 font-serif text-xl leading-snug text-[var(--ink)] sm:text-2xl"
        data-testid="lens-now-do"
      >
        {nowDo}
      </p>
      {nextHint ? (
        <p className="mt-2 text-sm text-[var(--ink-muted)]" data-testid="lens-next-action">
          {`${LENS_COPY.nextDoLabel}：${nextHint}`}
        </p>
      ) : null}
    </section>
  );
}
