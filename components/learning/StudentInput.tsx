import { useId } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SCENE_COPY } from "@/lib/content/microwave-bread";

interface StudentInputProps {
  label: string;
  prompt?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  minLength?: number;
}

export function StudentInput({
  label,
  prompt,
  placeholder,
  value,
  onChange,
  onSubmit,
  submitLabel,
  minLength = 1,
}: StudentInputProps) {
  const id = useId();
  const trimmedLength = value.trim().length;
  const canSubmit = trimmedLength >= minLength;

  return (
    <Card className="space-y-4 p-4">
      {prompt ? <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{prompt}</p> : null}
      <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--ink-muted)]">
          {canSubmit ? SCENE_COPY.inputReady : SCENE_COPY.inputNeedMore}
        </p>
        <Button onClick={onSubmit} disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </Card>
  );
}
