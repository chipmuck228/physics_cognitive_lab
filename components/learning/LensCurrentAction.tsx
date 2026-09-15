import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";

interface LensCurrentActionProps {
  kicker?: string;
  nowDo: string;
}

export function LensCurrentAction({ kicker, nowDo }: LensCurrentActionProps) {
  return (
    <section data-testid="lens-current-action" aria-label={LENS_COPY.nowDoLabel}>
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
      <h1
        className="mt-1 font-serif text-2xl leading-snug text-[var(--ink)] sm:text-3xl"
        data-testid="lens-now-do"
      >
        {nowDo}
      </h1>
    </section>
  );
}
