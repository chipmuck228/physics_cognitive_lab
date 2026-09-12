interface ValidationMessageProps {
  kind?: "missing" | "incorrect" | "info";
  children: string;
  testId?: string;
}

export function ValidationMessage({
  kind = "info",
  children,
  testId = "validation-message",
}: ValidationMessageProps) {
  const tone =
    kind === "missing" || kind === "incorrect"
      ? "border-[var(--heat)]/30 bg-[var(--heat)]/8 text-[var(--ink)]"
      : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]";

  return (
    <p
      role="status"
      data-testid={testId}
      data-validation-kind={kind}
      className={`rounded-xl border px-3 py-2 text-sm leading-relaxed ${tone}`}
    >
      {children}
    </p>
  );
}
