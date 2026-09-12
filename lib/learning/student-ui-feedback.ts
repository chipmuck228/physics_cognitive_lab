export type StudentUiFeedbackKind = "missing" | "incorrect";

export interface StudentUiFeedback {
  kind: StudentUiFeedbackKind;
  message: string;
}

export function missingInputFeedback(labels: string[]): string | null {
  if (labels.length === 0) {
    return null;
  }
  return `还有没选完的问题：${labels.join("；")}。`;
}

export function studentUiFeedback(
  missingLabels: string[],
  incorrectMessage: string,
): StudentUiFeedback {
  const missing = missingInputFeedback(missingLabels);
  if (missing) {
    return { kind: "missing", message: missing };
  }
  return { kind: "incorrect", message: incorrectMessage };
}
