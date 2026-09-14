import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LearningShell } from "@/components/learning/LearningShell";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import { LearningStage } from "@/types/learning";

describe("LearningShell home exit", () => {
  it("exposes a home link that is not stage back or start over", () => {
    render(
      <LearningShell
        stage={LearningStage.ENTRY}
        task={<p>task</p>}
        actions={<span>actions</span>}
        onStartOver={() => undefined}
        onGoBack={() => undefined}
        canGoBack
      />,
    );

    const home = screen.getByRole("link", { name: STUDENT_CHROME.homeAria });
    expect(home).toHaveAttribute("href", "/");
    expect(home).toHaveTextContent(STUDENT_CHROME.home);
    expect(screen.getByRole("button", { name: STUDENT_CHROME.backAria })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: STUDENT_CHROME.startOverAria }),
    ).toBeInTheDocument();
  });
});
