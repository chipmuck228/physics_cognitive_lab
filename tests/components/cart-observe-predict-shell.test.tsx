import { readFileSync } from "node:fs";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { CartObserveTask } from "@/components/learning/CartObserveTask";
import { CartPredictTask } from "@/components/learning/CartPredictTask";
import {
  CART_COPY,
  CART_OBSERVE_OPTIONS,
  CART_PREDICT_OUTCOMES,
} from "@/lib/content/horizontal-force-cart";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

function renderObserve(overrides: Partial<ComponentProps<typeof CartObserveTask>> = {}) {
  const onToggle = vi.fn();
  const onSubmit = vi.fn();
  const onPlayDemo = vi.fn();
  const view = render(
    <CartObserveTask
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

function renderPredict(overrides: Partial<ComponentProps<typeof CartPredictTask>> = {}) {
  const onOutcomeChange = vi.fn();
  const onReasonChange = vi.fn();
  const onCommit = vi.fn();
  render(
    <CartPredictTask
      question={CART_COPY.predictA}
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

describe("Scene 03 Observe chrome equivalence", () => {
  it("A. renders instruction, options, and CTA copy from CART_COPY", () => {
    renderObserve();

    expect(screen.getByTestId("cart-observe-task")).toBeInTheDocument();
    expect(screen.getByText(CART_COPY.observeInstruction)).toBeInTheDocument();
    expect(screen.getByText(CART_COPY.observePrompt)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: CART_COPY.playDemo })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: CART_COPY.observeSubmit })).toBeInTheDocument();

    for (const option of CART_OBSERVE_OPTIONS) {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    }
  });

  it("B. toggles option IDs without changing labels", async () => {
    const user = userEvent.setup();
    const { onToggle } = renderObserve({ selectedOptionIds: ["initially-still"] });

    expect(screen.getByLabelText("小车一开始是停着的")).toBeChecked();
    expect(screen.getByLabelText("后来它开始运动")).not.toBeChecked();

    await user.click(screen.getByLabelText("后来它开始运动"));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith("started-moving");
  });

  it("C. play/pause demo callback and button copy", async () => {
    const user = userEvent.setup();
    const { onPlayDemo, onToggle, onSubmit, rerender } = renderObserve();

    await user.click(screen.getByTestId("cart-play-demo"));
    expect(onPlayDemo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: CART_COPY.playDemo })).toBeInTheDocument();

    rerender(
      <CartObserveTask
        selectedOptionIds={[]}
        onToggle={onToggle}
        onSubmit={onSubmit}
        onPlayDemo={onPlayDemo}
        needMore={false}
        saved={false}
        demoPlaying
      />,
    );
    expect(screen.getByRole("button", { name: CART_COPY.pauseDemo })).toBeInTheDocument();
  });

  it("D. shows missing-observation feedback only when needMore", () => {
    renderObserve({ needMore: true, saved: true });
    expect(screen.getByText(CART_COPY.observeNeedMore)).toBeInTheDocument();
    expect(screen.queryByText(CART_COPY.observeSaved)).not.toBeInTheDocument();
  });

  it("E. shows saved feedback", () => {
    renderObserve({ saved: true, needMore: false });
    expect(screen.getByText(CART_COPY.observeSaved)).toBeInTheDocument();
  });

  it("F. submit callback fires", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderObserve({ saved: true, needMore: false });
    await user.click(screen.getByRole("button", { name: CART_COPY.observeSubmit }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("Scene 03 Predict chrome equivalence", () => {
  it("G. renders instruction, question, and authored outcomes", () => {
    renderPredict();

    expect(screen.getByTestId("cart-predict-task")).toBeInTheDocument();
    expect(screen.getByText(CART_COPY.predictInstruction)).toBeInTheDocument();
    expect(screen.getAllByText(CART_COPY.predictA)).toHaveLength(2);
    expect(screen.getByLabelText(CART_COPY.reasonLabel)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: CART_COPY.predictSubmit })).toBeInTheDocument();

    for (const option of CART_PREDICT_OUTCOMES) {
      expect(screen.getByRole("radio", { name: option.label })).toBeInTheDocument();
    }
  });

  it("H. outcome callback uses existing option IDs", async () => {
    const user = userEvent.setup();
    const { onOutcomeChange } = renderPredict({ outcome: "sped-up" });

    expect(screen.getByRole("radio", { name: "会越来越快" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "会越来越慢" }));
    expect(onOutcomeChange).toHaveBeenCalledWith("slowed-down");
  });

  it("I. authored reason stays controlled", async () => {
    const user = userEvent.setup();
    const { onReasonChange } = renderPredict({
      outcome: "sped-up",
      reason: "力和运动同向。",
    });

    expect(screen.getByLabelText(CART_COPY.reasonLabel)).toHaveValue("力和运动同向。");
    await user.type(screen.getByLabelText(CART_COPY.reasonLabel), "再");
    expect(onReasonChange).toHaveBeenCalled();
    expect(onReasonChange.mock.calls[0]?.[0]).toBe("力和运动同向。再");
  });

  it("J. missing-input feedback uses CART_COPY.predictNeedBoth", () => {
    renderPredict({ needMore: true });
    expect(screen.getByText(CART_COPY.predictNeedBoth)).toBeInTheDocument();
  });

  it("K. locked prediction disables inputs and hides submit", () => {
    renderPredict({
      outcome: "sped-up",
      reason: "先记下。",
      locked: true,
      committedLabel: "会越来越快",
    });

    expect(screen.getByRole("radio", { name: "会越来越快" })).toBeDisabled();
    expect(screen.getByLabelText(CART_COPY.reasonLabel)).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: CART_COPY.predictSubmit }),
    ).not.toBeInTheDocument();
  });

  it("L. committed prediction label uses existing locked copy", () => {
    renderPredict({ committedLabel: "会越来越快" });
    expect(screen.getByText(`${CART_COPY.predictLocked}：会越来越快`)).toBeInTheDocument();
  });

  it("M. submit callback fires", async () => {
    const user = userEvent.setup();
    const { onCommit } = renderPredict({
      outcome: "sped-up",
      reason: "同向会加快。",
    });
    await user.click(screen.getByRole("button", { name: CART_COPY.predictSubmit }));
    expect(onCommit).toHaveBeenCalledTimes(1);
  });
});

describe("Scene 03 chrome-only architecture bounds", () => {
  it("does not put Scene 03 through the Scene 04 DSL schema", () => {
    const schema = read("lib/scene-dsl/v01.ts");
    const cartContent = read("lib/content/horizontal-force-cart.ts");
    expect(schema).not.toMatch(/horizontal-force-cart/);
    expect(schema).not.toMatch(/force-changes-motion-state/);
    expect(cartContent).not.toMatch(/sceneDslV01Schema|parseSceneDslV01|cartSceneDsl/);
  });

  it("keeps generic shells free of cart, model, and evidence branches", () => {
    const observe = read("components/learning/dsl/ChecklistObserveTask.tsx");
    const predict = read("components/learning/dsl/OutcomePredictTask.tsx");
    for (const source of [observe, predict]) {
      expect(source).not.toMatch(/sceneId/);
      expect(source).not.toMatch(/modelId/);
      expect(source).not.toMatch(/horizontal-force-cart|force-changes-motion-state|stepCart/);
      expect(source).not.toMatch(/\bCart\b|CART_|evaluateCart|accumulateCart/);
      expect(source).not.toMatch(/deriveModelEvidenceLevel/);
    }
  });

  it("does not render official force or motion values in these shells", () => {
    renderObserve();
    renderPredict();
    expect(document.body.textContent).not.toMatch(/N\b|m\/s|F\s*=/);
  });
});
