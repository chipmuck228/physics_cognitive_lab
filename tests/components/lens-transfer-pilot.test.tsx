import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LensTransferTask } from "@/components/learning/LensTransferTask";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import { emptyLensTransferDraft } from "@/lib/learning/lens-transfer";
import { transferTargets } from "@/content/physics-models/convex-lens-imaging/transfer";

const projector = transferTargets.find((target) => target.id === "near-projector-real-enlarged")!;

describe("Scene 07 TRANSFER pilot UI", () => {
  it("does not render the seven-field imaging form", () => {
    render(
      <LensTransferTask
        target={projector}
        draft={emptyLensTransferDraft(projector.id)}
        onChange={() => undefined}
        onSubmit={() => undefined}
      />,
    );
    expect(screen.getByTestId("lens-transfer-station")).toBeInTheDocument();
    expect(screen.getByText(LENS_COPY.transferConditionQuestion)).toBeInTheDocument();
    expect(screen.getByTestId("lens-transfer-explanation")).toBeInTheDocument();
    expect(screen.getByText(LENS_COPY.transferOwnWords)).toBeInTheDocument();
    expect(screen.getByTestId("lens-transfer-model-link")).toHaveTextContent(
      LENS_COPY.transferModelLinkBody,
    );
    expect(screen.queryByTestId("lens-transfer-meeting")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-transfer-side")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-transfer-nature")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-transfer-orientation")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-transfer-size")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-transfer-receive")).not.toBeInTheDocument();
    expect(screen.queryByText("光线怎样相遇？")).not.toBeInTheDocument();
    expect(screen.queryByText("像的性质？")).not.toBeInTheDocument();
  });

  it("still requires the learner to choose a condition and write a sentence", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <LensTransferTask
        target={projector}
        draft={emptyLensTransferDraft(projector.id)}
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    );
    await user.click(screen.getByRole("radio", { name: /物体在 F 和 2F 之间/ }));
    expect(onChange).toHaveBeenCalled();
    await user.type(screen.getByTestId("lens-transfer-explanation"), "先写一句。");
    expect(onChange).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: LENS_COPY.transferSubmit }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
