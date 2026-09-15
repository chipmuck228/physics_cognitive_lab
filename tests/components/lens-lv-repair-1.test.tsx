import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ConvexLensOpticalBenchLab } from "@/components/learning/ConvexLensOpticalBenchLab";
import { LENS_COPY, LENS_VOCAB } from "@/lib/content/convex-lens-optical-bench";
import { createSession } from "@/lib/learning/session";
import { replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { LENS_EXPERIMENT_A } from "@/lib/physics/convex-lens-optical-bench";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

afterEach(() => {
  resetSessionMemory();
  localStorage.clear();
});

describe("Scene 07 learner-validation repair 1", () => {
  it("shows first-use vocabulary for F, 光屏, and 像 on OBSERVE", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-lv-observe", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    const world = screen.getByTestId("learner-workspace-world");
    expect(within(world).getByTestId("lens-vocab-F")).toHaveTextContent(LENS_VOCAB.F.body);
    expect(within(world).getByTestId("lens-vocab-screen")).toHaveTextContent(LENS_VOCAB.screen.body);
    expect(within(world).getByTestId("lens-vocab-image")).toHaveTextContent(LENS_VOCAB.image.body);
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("点物体位置，或移动一次光屏");
    expect(screen.getByTestId("lens-vocab-F")).not.toHaveTextContent("实像");
  });

  it("frames PREDICT as a guess, not an exam", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-lv-predict", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.PREDICT,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-predict-not-exam")).toHaveTextContent(
      LENS_COPY.predictNotExam,
    );
    expect(screen.getByRole("button", { name: LENS_COPY.predictSubmit })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /提交答案|正确答案|答题/ })).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("你觉得会看到什么");
  });

  it("lets 我还不知道为什么 commit a wrong prediction into EXPERIMENT", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-lv-unknown", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.PREDICT,
    });
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("radio", { name: /光屏接不到清晰像/ }));
    await user.click(screen.getByRole("radio", { name: /我还不知道为什么/ }));
    expect(screen.queryByTestId("lens-predict-reason")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: LENS_COPY.predictSubmit }));
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("把物体移到 F 和 2F 之间");
    expect(screen.getByTestId("lens-trial-progress")).toHaveTextContent("第 1 / 4 次");
    expect(screen.getByTestId("lens-experiment-task")).toHaveAttribute("data-phase", "intervene");
  });

  it("changes the current action after the required object move and shows a consequence", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-lv-action", CONVEX_LENS_SCENE_ID),
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
        ...createSession(() => "t0", () => "lens-lv-action", CONVEX_LENS_SCENE_ID).events,
        { type: "stage_entered", timestamp: "t4", stage: LearningStage.EXPERIMENT },
      ],
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("把物体移到 F 和 2F 之间");
    const bench = screen.getByTestId("convex-lens-optical-bench");
    const before = bench.getAttribute("data-object-station");
    await user.click(screen.getByTestId("station-hit-between-f-and-2f"));
    expect(screen.getByTestId("convex-lens-optical-bench")).not.toHaveAttribute(
      "data-object-station",
      before,
    );
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("移动光屏，看看哪里最清楚");
    expect(screen.getByTestId("lens-experiment-look-screen")).toBeInTheDocument();
    await user.click(screen.getByTestId("lens-experiment-look-screen"));
    expect(screen.getByTestId("lens-now-do")).toHaveTextContent("你观察到了什么");
  });
});
