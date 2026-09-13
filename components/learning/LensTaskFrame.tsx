interface LensTaskFrameProps {
  context: string;
  goal: string;
  focus: string;
  action: string;
}

export function LensTaskFrame({ context, goal, focus, action }: LensTaskFrameProps) {
  return (
    <div className="space-y-2" data-testid="lens-task-frame">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]" data-testid="lens-task-context">
        {context}
      </p>
      <h1
        className="font-serif text-xl leading-snug text-[var(--ink)] sm:text-2xl"
        data-testid="lens-task-goal"
      >
        {goal}
      </h1>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]" data-testid="lens-task-focus">
        {focus}
      </p>
      <p
        className="text-sm font-medium leading-relaxed text-[var(--ink)]"
        data-testid="lens-task-action"
      >
        {action}
      </p>
    </div>
  );
}
