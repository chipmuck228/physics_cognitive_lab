interface LensTaskFrameProps {
  context: string;
  focus: string;
  action: string;
}

export function LensTaskFrame({ context, focus, action }: LensTaskFrameProps) {
  return (
    <div className="space-y-2" data-testid="lens-task-frame">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{context}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{focus}</p>
      <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">{action}</p>
    </div>
  );
}
