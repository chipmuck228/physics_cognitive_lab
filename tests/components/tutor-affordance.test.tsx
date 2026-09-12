import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TutorPanel } from "@/components/tutor/TutorPanel";
import { STUDENT_CHROME } from "@/lib/content/student-language";

describe("Tutor affordance contract", () => {
  it("states that the control requests a hint", () => {
    render(
      <TutorPanel message={null} loading={false} onAsk={() => undefined} />,
    );
    expect(screen.getByRole("button", { name: STUDENT_CHROME.tutorAskAria })).toHaveTextContent(
      "给我一点提示",
    );
    expect(screen.getByText(STUDENT_CHROME.tutorIdle)).toBeInTheDocument();
    expect(screen.queryByText("问我一句")).not.toBeInTheDocument();
  });

  it("shows a visible pending state while loading", () => {
    render(<TutorPanel message={null} loading onAsk={() => undefined} />);
    expect(screen.getByRole("status")).toHaveTextContent(STUDENT_CHROME.tutorLoading);
  });
});
