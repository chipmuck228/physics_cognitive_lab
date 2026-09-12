import { readFileSync } from "node:fs";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { HeatObserveTask } from "@/components/learning/HeatObserveTask";
import { HeatPredictTask } from "@/components/learning/HeatPredictTask";
import {
  HEAT_COPY,
  HEAT_OBSERVE_OPTIONS,
  HEAT_PREDICT_OUTCOMES_A,
} from "@/lib/content/equal-mass-heated-samples";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

function renderObserve(overrides: Partial<ComponentProps<typeof HeatObserveTask>> = {}) {
  const onToggle = vi.fn();
  const onSubmit = vi.fn();
  const onPlayDemo = vi.fn();
  const view = render(
    <HeatObserveTask
      selectedOptionIds={[]}
      onToggle={onToggle}
      onSubmit={onSubmit}
      onPlayDemo={onPlayDemo}
      needMore={false}
      saved={false}
      demoPlaying={false}
      {...overrides}
    />,
  );
  return { onToggle, onSubmit, onPlayDemo, rerender: view.rerender };
}

function renderPredict(overrides: Partial<ComponentProps<typeof HeatPredictTask>> = {}) {
  const onOutcomeChange = vi.fn();
  const onReasonChange = vi.fn();
  const onCommit = vi.fn();
  render(
    <HeatPredictTask
      question={HEAT_COPY.predictA}
      outcomes={HEAT_PREDICT_OUTCOMES_A}
      outcome=""
      reason=""
      needMore={false}
      onOutcomeChange={onOutcomeChange}
      onReasonChange={onReasonChange}
      onCommit={onCommit}
      {...overrides}
    />,
  );
  return { onOutcomeChange, onReasonChange, onCommit };
}

describe("Scene 05 Observe chrome equivalence", () => {
  it("A. renders instruction, options, and CTA copy from HEAT_COPY", () => {
    renderObserve();

    expect(screen.getByTestId("heat-observe-task")).toBeInTheDocument();
    expect(screen.getByText(HEAT_COPY.observeInstruction)).toBeInTheDocument();
    expect(screen.getByText(HEAT_COPY.observePrompt)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: HEAT_COPY.playDemo })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: HEAT_COPY.observeSubmit })).toBeInTheDocument();

    for (const option of HEAT_OBSERVE_OPTIONS) {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    }
  });

  it("B. toggles option IDs without changing labels", async () => {
    const user = userEvent.setup();
    const { onToggle } = renderObserve({ selectedOptionIds: ["same-mass"] });

    expect(screen.getByLabelText("两份样品差不多一样多")).toBeChecked();
    expect(screen.getByLabelText("加热后，有一份升得更快、更烫")).not.toBeChecked();

    await user.click(screen.getByLabelText("加热后，有一份升得更快、更烫"));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith("different-rise");
  });

  it("C. play/pause demo callback and button copy", async () => {
    const user = userEvent.setup();
    const { onPlayDemo, onToggle, onSubmit, rerender } = renderObserve();

    await user.click(screen.getByTestId("heat-play-demo"));
    expect(onPlayDemo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: HEAT_COPY.playDemo })).toBeInTheDocument();

    rerender(
      <HeatObserveTask
        selectedOptionIds={[]}
        onToggle={onToggle}
        onSubmit={onSubmit}
        onPlayDemo={onPlayDemo}
        needMore={false}
        saved={false}
        demoPlaying
      />,
    );
    expect(screen.getByRole("button", { name: HEAT_COPY.pauseDemo })).toBeInTheDocument();
  });

  it("D. shows missing-observation feedback only when needMore", () => {
    renderObserve({ needMore: true, saved: true });
    expect(screen.getByText(HEAT_COPY.observeNeedMore)).toBeInTheDocument();
    expect(screen.queryByText(HEAT_COPY.observeSaved)).not.toBeInTheDocument();
  });

  it("E. shows saved feedback and submit still fires", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderObserve({ saved: true, needMore: false });
    expect(screen.getByText(HEAT_COPY.observeSaved)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: HEAT_COPY.observeSubmit }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("Scene 05 Predict chrome equivalence", () => {
  it("F. renders instruction, question, and authored outcomes", () => {
    renderPredict();

    expect(screen.getByTestId("heat-predict-task")).toBeInTheDocument();
    expect(screen.getByText(HEAT_COPY.predictInstruction)).toBeInTheDocument();
    expect(screen.getAllByText(HEAT_COPY.predictA)).toHaveLength(2);
    expect(screen.getByLabelText(HEAT_COPY.reasonLabel)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: HEAT_COPY.predictSubmit })).toBeInTheDocument();

    for (const option of HEAT_PREDICT_OUTCOMES_A) {
      expect(screen.getByRole("radio", { name: option.label })).toBeInTheDocument();
    }
  });

  it("G. authored reason and selected outcome stay controlled", async () => {
    const user = userEvent.setup();
    const { onOutcomeChange, onReasonChange } = renderPredict({
      outcome: "sand-hotter",
      reason: "质量相同，材料不同。",
    });

    expect(screen.getByRole("radio", { name: "沙子升得更快、更烫" })).toBeChecked();
    expect(screen.getByLabelText(HEAT_COPY.reasonLabel)).toHaveValue(
      "质量相同，材料不同。",
    );

    await user.click(screen.getByRole("radio", { name: "两边升得一样" }));
    expect(onOutcomeChange).toHaveBeenCalledWith("same-rise");

    await user.type(screen.getByLabelText(HEAT_COPY.reasonLabel), "再");
    expect(onReasonChange).toHaveBeenCalled();
    expect(onReasonChange.mock.calls[0]?.[0]).toBe("质量相同，材料不同。再");
  });

  it("H. missing-input feedback uses HEAT_COPY.predictNeedBoth", () => {
    renderPredict({ needMore: true });
    expect(screen.getByText(HEAT_COPY.predictNeedBoth)).toBeInTheDocument();
  });

  it("I. locked prediction disables inputs and hides submit", () => {
    renderPredict({
      outcome: "sand-hotter",
      reason: "先记下。",
      locked: true,
      committedLabel: "沙子升得更快、更烫",
    });

    expect(screen.getByRole("radio", { name: "沙子升得更快、更烫" })).toBeDisabled();
    expect(screen.getByLabelText(HEAT_COPY.reasonLabel)).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: HEAT_COPY.predictSubmit }),
    ).not.toBeInTheDocument();
  });

  it("J. committed prediction label uses existing locked copy", () => {
    renderPredict({ committedLabel: "沙子升得更快、更烫" });
    expect(
      screen.getByText(`${HEAT_COPY.predictLocked}：沙子升得更快、更烫`),
    ).toBeInTheDocument();
  });

  it("K. commit payload stays a zero-arg callback", async () => {
    const user = userEvent.setup();
    const { onCommit } = renderPredict({
      outcome: "sand-hotter",
      reason: "材料不同。",
    });
    await user.click(screen.getByRole("button", { name: HEAT_COPY.predictSubmit }));
    expect(onCommit).toHaveBeenCalledTimes(1);
  });
});

describe("Scene 05 chrome-only architecture bounds", () => {
  it("does not put Scene 05 through the Scene 04 DSL schema", () => {
    const schema = read("lib/scene-dsl/v01.ts");
    const heatContent = read("lib/content/equal-mass-heated-samples.ts");
    expect(schema).not.toMatch(/equal-mass-heated-samples/);
    expect(schema).not.toMatch(/specific-heat-capacity/);
    expect(heatContent).not.toMatch(/sceneDslV01Schema|parseSceneDslV01|heatSceneDsl/);
  });

  it("keeps generic shells free of scene, model, and evidence branches", () => {
    const observe = read("components/learning/dsl/ChecklistObserveTask.tsx");
    const predict = read("components/learning/dsl/OutcomePredictTask.tsx");
    for (const source of [observe, predict]) {
      expect(source).not.toMatch(/sceneId/);
      expect(source).not.toMatch(/modelId/);
      expect(source).not.toMatch(/equal-mass-heated-samples/);
      expect(source).not.toMatch(/HEAT_/);
      expect(source).not.toMatch(/accumulateHeat|evaluateHeat|deriveModelEvidenceLevel/);
    }
  });

  it("does not render official temperature or energy values in these shells", () => {
    renderObserve();
    renderPredict();
    expect(screen.queryByText(/℃|°C|J\/|\bkg\b/)).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/升温\s*[=：:]/);
    expect(document.body.textContent).not.toMatch(/温度\s*[=：:]\s*\d/);
  });
});
