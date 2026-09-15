import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ConvexLensOpticalBenchLab } from "@/components/learning/ConvexLensOpticalBenchLab";
import { LENS_COPY, LENS_VOCAB, lensPredictQuestion } from "@/lib/content/convex-lens-optical-bench";
import { createSession } from "@/lib/learning/session";
import { getSessionSnapshot, replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { LENS_EXPERIMENT_A } from "@/lib/physics/convex-lens-optical-bench";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

afterEach(() => {
  resetSessionMemory();
  localStorage.clear();
});

const EVALUATOR_LEAK = /不要只写|对着光具座分开说/;

function predictSession() {
  return {
    ...createSession(() => "t0", () => "lens-workspace-predict", CONVEX_LENS_SCENE_ID),
    stage: LearningStage.PREDICT,
  };
}

function experimentASession() {
  const session = createSession(() => "t0", () => "lens-workspace-exp", CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage: LearningStage.EXPERIMENT,
    predictions: [
      {
        prediction: "virtual-or-none",
        reasoning: LENS_COPY.reasonUnknown,
        timestamp: "t3",
        experimentId: LENS_EXPERIMENT_A,
        committed: true,
      },
    ],
    events: [
      ...session.events,
      { type: "stage_entered" as const, timestamp: "t4", stage: LearningStage.EXPERIMENT },
    ],
  };
}

describe("Scene 07 learner workspace pilot", () => {
  it("PREDICT has one dominant question and no redundant instruction copies", () => {
    replaceSession(predictSession());
    render(<ConvexLensOpticalBenchLab />);
    const question = lensPredictQuestion(LENS_EXPERIMENT_A);
    expect(screen.getAllByTestId("lens-now-do")).toHaveLength(1);
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent(question);
    expect(screen.getAllByRole("heading", { name: question })).toHaveLength(1);
    expect(within(screen.getByTestId("learner-workspace-world")).getByTestId("lens-vocab-F")).toBeInTheDocument();
    expect(screen.queryByTestId("lens-task-context")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-task-goal")).not.toBeInTheDocument();
    expect(screen.queryByText("先猜你会看见什么")).not.toBeInTheDocument();
    expect(screen.queryByText("接下来")).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-predict-not-exam")).toHaveTextContent(LENS_COPY.predictNotExam);
    expect(screen.getByRole("button", { name: LENS_COPY.predictSubmit })).toBeInTheDocument();
  });

  it("lets 我现在还说不上来 commit a wrong prediction", async () => {
    const user = userEvent.setup();
    replaceSession(predictSession());
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("radio", { name: /光屏接不到清晰像/ }));
    await user.click(screen.getByRole("radio", { name: /我现在还说不上来/ }));
    await user.click(screen.getByRole("button", { name: LENS_COPY.predictSubmit }));
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.EXPERIMENT);
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).predictions[0]?.prediction).toBe(
      "virtual-or-none",
    );
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("把物体移到 F 和 2F 之间");
  });

  it("exposes one current EXPERIMENT action and changes it after the previous physical action", async () => {
    const user = userEvent.setup();
    replaceSession(experimentASession());
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getAllByTestId("lens-now-do")).toHaveLength(1);
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("把物体移到 F 和 2F 之间");
    expect(screen.queryByText("你观察到了什么？")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-experiment-look-screen")).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-experiment-task")).toHaveAttribute("data-phase", "intervene");

    await user.click(screen.getByTestId("station-hit-between-f-and-2f"));
    expect(screen.getAllByTestId("lens-now-do")).toHaveLength(1);
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("移动光屏，看看哪里最清楚");
    expect(screen.queryByRole("button", { name: LENS_COPY.observeSubmitExperiment })).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-experiment-task")).toHaveAttribute("data-phase", "inspect");

    await user.click(screen.getByTestId("lens-experiment-look-screen"));
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("你观察到了什么");
    expect(screen.getByRole("button", { name: LENS_COPY.observeSubmitExperiment })).toBeInTheDocument();
    expect(screen.getByTestId("lens-experiment-task")).toHaveAttribute("data-phase", "record");
  });

  it("grounds vocabulary in the Physical World without leaking imaging rules", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-workspace-vocab", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    const world = screen.getByTestId("learner-workspace-world");
    expect(within(world).getByTestId("lens-vocab-F")).toHaveTextContent(LENS_VOCAB.F.body);
    expect(within(world).getByTestId("lens-vocab-screen")).toHaveTextContent(LENS_VOCAB.screen.body);
    expect(within(world).getByTestId("lens-vocab-image")).toHaveTextContent(LENS_VOCAB.image.body);
    expect(world.textContent).not.toMatch(/实像|虚像|倒立|正立/);
  });

  it("does not expose evaluator-language patterns on DESCRIBE", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-workspace-describe", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.DESCRIBE,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("learner-workspace").textContent).not.toMatch(EVALUATOR_LEAK);
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent(
      "看着左边的实验，说说你实际看到了什么",
    );
    expect(screen.getByLabelText(LENS_COPY.describeQuestion)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: LENS_COPY.describeSubmit })).toBeInTheDocument();
  });

  it("EXPLAIN uses LearnerWorkspace with a causal question, not ray construction", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-workspace-explain", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.EXPLAIN,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("learner-workspace")).toBeInTheDocument();
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("光屏是不是每次都能接到清楚的像");
    expect(screen.getByTestId("lens-explain-task")).toBeInTheDocument();
    expect(screen.queryByTestId("lens-ray-construction")).not.toBeInTheDocument();
  });

  it("keeps current action first in source order for narrow screens", () => {
    replaceSession(predictSession());
    render(<ConvexLensOpticalBenchLab />);
    const workspace = screen.getByTestId("learner-workspace");
    expect(workspace).toHaveAttribute("data-emphasis", "task");
    expect(screen.getByTestId("learner-workspace-lead").className).toMatch(/order-1/);
    expect(screen.getByTestId("learner-workspace-world").className).toMatch(/order-2/);
    expect(screen.getByTestId("learner-workspace-task").className).toMatch(/order-3/);
    expect(screen.getByTestId("learner-workspace-support").className).toMatch(/order-4/);
  });
});
