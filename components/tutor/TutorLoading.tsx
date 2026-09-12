import { STUDENT_CHROME } from "@/lib/content/student-language";

export function TutorLoading() {
  return (
    <p className="text-sm text-[var(--ink-muted)]" role="status">
      {STUDENT_CHROME.tutorLoading}
    </p>
  );
}
