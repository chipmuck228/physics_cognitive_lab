import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { SamplesRatioBoard } from "@/components/learning/SamplesRatioBoard";
import { SAMPLES_COPY } from "@/lib/content/equal-volume-material-samples";
import {
  buildSamplesModelAttempt,
  completeSamplesModelInput,
  emptySamplesModelDraft,
  samplesModelStudentFeedback,
  type SamplesModelDraft,
} from "@/lib/learning/samples-model";
import type { StudentUiFeedback } from "@/lib/learning/student-ui-feedback";

function RatioBoardHarness({
  initial = emptySamplesModelDraft(),
}: {
  initial?: SamplesModelDraft;
}) {
  const [draft, setDraft] = useState(initial);
  const [gateFeedback, setGateFeedback] = useState<StudentUiFeedback | null>(null);
  const [accepted, setAccepted] = useState(false);

  return (
    <div>
      {accepted ? <p>已进入下一步</p> : null}
      <SamplesRatioBoard
        draft={draft}
        evidence={{ sameVolume: "", sameMass: "", cut: "" }}
        gateFeedback={gateFeedback}
        needStructure={false}
        hints={[]}
        canRevealHint={false}
        onChange={setDraft}
        onToggleCondition={(value) => {
          const conditions = draft.conditions.includes(value)
            ? draft.conditions.filter((item) => item !== value)
            : [...draft.conditions, value];
          setDraft({ ...draft, conditions });
        }}
        onSubmit={() => {
          const attempt = buildSamplesModelAttempt({
            ...draft,
            timestamp: "2026-09-12T00:00:00.000Z",
          });
          if (attempt.correctStructure) {
            setAccepted(true);
            setGateFeedback(null);
            return;
          }
          setGateFeedback(samplesModelStudentFeedback(draft, attempt));
        }}
        onRevealHint={() => undefined}
      />
    </div>
  );
}

describe("Scene 04 MODEL UI contract", () => {
  it("shows a visible question for each cut-compare group", () => {
    render(<RatioBoardHarness />);
    expect(screen.getByText(SAMPLES_COPY.modelCutCompareLabel)).toBeInTheDocument();
    expect(screen.getByText(SAMPLES_COPY.modelCutMassLabel)).toBeInTheDocument();
    expect(screen.getByText(SAMPLES_COPY.modelCutVolumeLabel)).toBeInTheDocument();
    expect(screen.getByText(SAMPLES_COPY.modelCutRatioLabel)).toBeInTheDocument();
    expect(screen.getByText(SAMPLES_COPY.modelCutWhyLabel)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: SAMPLES_COPY.modelSubmit })).toHaveTextContent(
      SAMPLES_COPY.modelSubmit,
    );
  });

  it("empty submit shows visible missing feedback", async () => {
    const user = userEvent.setup();
    render(<RatioBoardHarness />);
    await user.click(screen.getByRole("button", { name: SAMPLES_COPY.modelSubmit }));
    const status = await screen.findByTestId("samples-model-feedback");
    expect(status).toHaveAttribute("data-validation-kind", "missing");
    expect(status).toHaveTextContent("还有没选完的问题");
  });

  it("wrong complete relation shows visible incorrect feedback", async () => {
    const user = userEvent.setup();
    const wrong = {
      ...completeSamplesModelInput("2026-09-12T00:00:00.000Z"),
      kind: "samples-model-draft" as const,
      cutWhy: "same-material-alone",
    };
    render(<RatioBoardHarness initial={wrong} />);
    await user.click(screen.getByRole("button", { name: SAMPLES_COPY.modelSubmit }));
    const status = await screen.findByTestId("samples-model-feedback");
    expect(status).toHaveAttribute("data-validation-kind", "incorrect");
    expect(status).toHaveTextContent("同一种物质");
  });

  it("accepted relation produces a visible state change", async () => {
    const user = userEvent.setup();
    const complete = {
      ...completeSamplesModelInput("2026-09-12T00:00:00.000Z"),
      kind: "samples-model-draft" as const,
    };
    render(<RatioBoardHarness initial={complete} />);
    await user.click(screen.getByRole("button", { name: SAMPLES_COPY.modelSubmit }));
    expect(await screen.findByText("已进入下一步")).toBeInTheDocument();
  });
});
