export interface QuestionGroupOption {
  value: string;
  label: string;
}

interface QuestionGroupProps {
  id: string;
  question: string;
  name?: string;
  helperText?: string;
  options: ReadonlyArray<QuestionGroupOption>;
  value: string;
  onChange: (value: string) => void;
  /** When the question is already visible nearby, keep the association only. */
  hideQuestion?: boolean;
}

/**
 * One visible question bound to one radio group.
 * Contract: UI-01, UI-02, recommended QuestionGroup semantics.
 */
export function QuestionGroup({
  id,
  question,
  name,
  helperText,
  options,
  value,
  onChange,
  hideQuestion = false,
}: QuestionGroupProps) {
  const groupName = name ?? id;

  return (
    <fieldset className="space-y-2" data-testid={id} data-question-group={id}>
      <legend
        className={
          hideQuestion
            ? "sr-only"
            : "text-sm font-medium text-[var(--ink)]"
        }
      >
        {question}
      </legend>
      {helperText && !hideQuestion ? (
        <p className="text-xs text-[var(--ink-muted)]">{helperText}</p>
      ) : null}
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
        >
          <input
            type="radio"
            name={groupName}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-1"
            aria-label={`${question} ${option.label}`}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
