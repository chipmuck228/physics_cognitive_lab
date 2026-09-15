import type { ReactNode } from "react";

type LearnerWorkspaceEmphasis = "world" | "task";

interface LearnerWorkspaceProps {
  lead: ReactNode;
  world: ReactNode;
  task: ReactNode;
  support?: ReactNode;
  emphasis?: LearnerWorkspaceEmphasis;
}

/**
 * Layout slots only. Scene / evaluator / physics stay outside.
 * Pilot: Scene 07; Scene 02 may compose the same slots. Not a universal renderer.
 */
export function LearnerWorkspace({
  lead,
  world,
  task,
  support,
  emphasis = "world",
}: LearnerWorkspaceProps) {
  const worldShare = emphasis === "world" ? "lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.9fr)]" : "lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,1fr)]";

  return (
    <div
      className={`grid grid-cols-1 gap-6 ${worldShare}`}
      data-testid="learner-workspace"
      data-emphasis={emphasis}
    >
      <section
        className="order-1 lg:col-start-2 lg:row-start-1"
        data-testid="learner-workspace-lead"
      >
        {lead}
      </section>
      <section
        className="order-2 lg:col-start-1 lg:row-start-1 lg:row-span-3"
        data-testid="learner-workspace-world"
      >
        {world}
      </section>
      <section
        className="order-3 lg:col-start-2 lg:row-start-2"
        data-testid="learner-workspace-task"
      >
        {task}
      </section>
      {support ? (
        <section
          className="order-4 lg:col-start-2 lg:row-start-3"
          data-testid="learner-workspace-support"
        >
          {support}
        </section>
      ) : null}
    </div>
  );
}
