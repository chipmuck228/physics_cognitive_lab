import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { useTutor } from "@/hooks/useTutor";
import { LearningStage, type LearningSession } from "@/types/learning";
import { aiOffReadySession } from "../learning/engine-fixtures";

function Probe({ session }: { session: LearningSession }) {
  const tutor = useTutor(session);
  return (
    <button type="button" onClick={() => void tutor.askTutor("请提示我")}>
      probe-tutor
    </button>
  );
}

describe("useTutor hard AI_OFF boundary", () => {
  it("cannot issue a tutor request in AI_OFF", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<Probe session={aiOffReadySession()} />);
    await user.click(screen.getByRole("button", { name: "probe-tutor" }));
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
  });

  it("cannot issue a tutor request in COMPLETE", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(
      <Probe
        session={{
          ...aiOffReadySession(),
          stage: LearningStage.COMPLETE,
          completed: true,
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "probe-tutor" }));
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
  });
});
