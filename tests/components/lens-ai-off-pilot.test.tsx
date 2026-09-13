import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LensAiOffTask } from "@/components/learning/LensAiOffTask";
import { LENS_AI_OFF_COPY } from "@/lib/content/convex-lens-optical-bench";
import {
  emptyLensAiOffDraft,
  LENS_AI_OFF_A,
  intendedLensAiOffAnswerId,
  lensJudgmentLabelFor,
} from "@/lib/learning/lens-ai-off";

describe("Scene 07 AI_OFF pilot UI", () => {
  it("does not render the seven-field imaging form", () => {
    render(
      <LensAiOffTask
        draft={emptyLensAiOffDraft()}
        questionIndex={0}
        totalCount={2}
        step="response"
        committed={null}
        needResponse={false}
        onChange={() => undefined}
        onCommit={() => undefined}
        onSubmitPostCheck={() => undefined}
        onRetry={() => undefined}
      />,
    );
    expect(screen.getByTestId("lens-ai-off-station")).toBeInTheDocument();
    expect(screen.getByText(LENS_AI_OFF_COPY.conditionQuestion)).toBeInTheDocument();
    expect(screen.getByText(LENS_AI_OFF_COPY.judgmentQuestion)).toBeInTheDocument();
    expect(screen.getByTestId("lens-ai-off-reasoning")).toBeInTheDocument();
    expect(screen.getByText(LENS_AI_OFF_COPY.reasonQuestion)).toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-meeting")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-side")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-nature")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-orientation")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-size")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-receive")).not.toBeInTheDocument();
    expect(screen.queryByText("光线怎样相遇？")).not.toBeInTheDocument();
    expect(screen.queryByText("像的性质？")).not.toBeInTheDocument();
    expect(screen.queryByText("正立还是倒立？")).not.toBeInTheDocument();
  });

  it("keeps one condition, one integrated judgment, and authored reasoning", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onCommit = vi.fn();
    render(
      <LensAiOffTask
        draft={emptyLensAiOffDraft()}
        questionIndex={0}
        totalCount={2}
        step="response"
        committed={null}
        needResponse={false}
        onChange={onChange}
        onCommit={onCommit}
        onSubmitPostCheck={() => undefined}
        onRetry={() => undefined}
      />,
    );
    await user.click(screen.getByRole("radio", { name: /物体在 2F 以外/ }));
    expect(onChange).toHaveBeenCalled();
    await user.click(
      screen.getByRole("radio", {
        name: lensJudgmentLabelFor(LENS_AI_OFF_A, intendedLensAiOffAnswerId(LENS_AI_OFF_A)),
      }),
    );
    await user.type(screen.getByTestId("lens-ai-off-reasoning"), "先写一句理由。");
    await user.click(screen.getByTestId("lens-ai-off-commit"));
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it("shows parser loading and does not reveal post-check before commit", () => {
    render(
      <LensAiOffTask
        draft={emptyLensAiOffDraft()}
        questionIndex={0}
        totalCount={2}
        step="response"
        committed={null}
        needResponse={false}
        checking
        onChange={() => undefined}
        onCommit={() => undefined}
        onSubmitPostCheck={() => undefined}
        onRetry={() => undefined}
      />,
    );
    expect(screen.getByTestId("lens-ai-off-commit")).toHaveTextContent(LENS_AI_OFF_COPY.checking);
    expect(screen.queryByTestId("lens-ai-off-post-check")).not.toBeInTheDocument();
  });

  it("does not show derived fields as learner answers", () => {
    render(
      <LensAiOffTask
        draft={{
          ...emptyLensAiOffDraft(),
          objectStation: "beyond-2f",
          meetingMode: "actual-convergence",
          side: "other-side",
          nature: "real",
          orientation: "inverted",
          size: "reduced",
          screenReceivable: "true",
        }}
        questionIndex={0}
        totalCount={2}
        step="response"
        committed={null}
        needResponse={false}
        onChange={() => undefined}
        onCommit={() => undefined}
        onSubmitPostCheck={() => undefined}
        onRetry={() => undefined}
      />,
    );
    expect(screen.queryByText("actual-convergence")).not.toBeInTheDocument();
    expect(screen.queryByText("other-side")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-meeting")).not.toBeInTheDocument();
  });
});
