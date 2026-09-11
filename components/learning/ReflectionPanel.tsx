import { Card } from "@/components/common/Card";
import { SCENE_COPY } from "@/lib/content/microwave-bread";
import {
  reflectionDimensions,
  summarizeReflection,
} from "@/lib/learning/reflection";
import type { StudentCognitiveProfile } from "@/types/learning";

interface ReflectionPanelProps {
  profile: StudentCognitiveProfile;
}

export function ReflectionPanel({ profile }: ReflectionPanelProps) {
  const dimensions = reflectionDimensions(profile);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          Learning reflection
        </p>
        <h2 className="font-serif text-3xl text-[var(--ink)]">
          {SCENE_COPY.completeTitle}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {SCENE_COPY.completeCaution}
        </p>
      </div>

      <Card className="space-y-4 p-5">
        {dimensions.map((dimension) => (
          <div
            key={dimension.id}
            className="flex items-center justify-between gap-4"
          >
            <p className="text-sm text-[var(--ink)]">{dimension.label}</p>
            <p
              className="font-mono text-sm tracking-[0.2em] text-[var(--ink)]"
              aria-label={`${dimension.label}: ${dimension.value} out of 4`}
            >
              {renderMarks(dimension.value)}
            </p>
          </div>
        ))}
      </Card>

      <Card className="p-5">
        <p className="text-sm leading-relaxed text-[var(--ink)]">
          {summarizeReflection(profile)}
        </p>
      </Card>
    </div>
  );
}

function renderMarks(value: number): string {
  const filled = Math.min(4, Math.max(0, Math.round(value)));
  return `${"●".repeat(filled)}${"○".repeat(4 - filled)}`;
}
