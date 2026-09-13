import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ConvexLensOpticalBenchLab } from "@/components/learning/ConvexLensOpticalBenchLab";
import { emptyLensModelDraft } from "@/lib/learning/lens-model";
import { createSession } from "@/lib/learning/session";
import { replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function modelStep2Session(station = "beyond-2f") {
  const session = createSession(() => "t0", () => "lens-ray-ui", CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage: LearningStage.MODEL,
    sceneData: {
      ...session.sceneData,
      modelDraft: {
        ...emptyLensModelDraft(),
        objectStation: station,
        constructionStep: 2,
      },
    },
  };
}

afterEach(() => {
  resetSessionMemory();
});

describe("Scene 07 MODEL required-ray UI", () => {
  it("does not ask duplicate before-lens or actual/backward questions", () => {
    replaceSession(modelStep2Session());
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-ray-a")).toBeInTheDocument();
    expect(screen.queryByText(/到达透镜前/)).not.toBeInTheDocument();
    expect(screen.queryByText(/实际光线还是反向延长/)).not.toBeInTheDocument();
    expect(screen.queryByText(/过近侧焦点/)).not.toBeInTheDocument();
    expect(screen.getByText(/先选一条要用的特殊光线/)).toBeInTheDocument();
    expect(screen.getByText(/经过透镜后，它应该怎样走/)).toBeInTheDocument();
  });

  it("renders a solid incident segment as soon as parallel-axis is chosen", async () => {
    const user = userEvent.setup();
    replaceSession(modelStep2Session());
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.queryByTestId("ray-parallel-axis")).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /第一条光线：先选一条要用的特殊光线。 平行主光轴/ }));
    const ray = screen.getByTestId("ray-parallel-axis");
    expect(ray).toHaveAttribute("data-ray-style", "solid");
    expect(ray.querySelector('[data-ray-segment="incident"]')).toBeTruthy();
    expect(ray.querySelector('[data-ray-segment="outgoing-actual"]')).toBeNull();
    expect(ray.querySelector('[data-ray-segment="backward-extension"]')).toBeNull();
  });

  it("renders the learner-selected outgoing path and blocks a wrong pairing", async () => {
    const user = userEvent.setup();
    replaceSession(modelStep2Session());
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("radio", { name: /第一条光线：先选一条要用的特殊光线。 平行主光轴/ }));
    await user.click(screen.getByRole("radio", { name: /第一条光线：经过透镜后，它应该怎样走？ 过透镜后：方向不变/ }));
    const ray = screen.getByTestId("ray-parallel-axis");
    const outgoing = ray.querySelector('[data-ray-segment="outgoing-actual"]');
    expect(outgoing).toBeTruthy();
    expect(outgoing).toHaveAttribute("data-bench-y1", outgoing!.getAttribute("data-bench-y2"));
    expect(screen.getByTestId("lens-model-next")).toBeDisabled();
    expect(screen.getByTestId("lens-model-next-reason")).toHaveTextContent(/走法还对不上/);
    expect(screen.getByTestId("lens-model-next-reason")).not.toHaveTextContent(/经过另一侧焦点/);
  });

  it("does not offer optional focal as a required-slot kind", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...modelStep2Session(),
      sceneData: {
        ...modelStep2Session().sceneData,
        modelDraft: {
          ...emptyLensModelDraft(),
          objectStation: "beyond-2f",
          constructionStep: 3,
          rayA: {
            kind: "parallel-axis",
            beforeLens: "parallel-to-principal-axis",
            afterLens: "through-far-focal-point",
            incidentPath: "actual",
          },
        },
      },
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-optional-focal")).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /第二条光线：先选一条要用的特殊光线。 过近侧焦点/ })).not.toBeInTheDocument();
    await user.click(screen.getByTestId("lens-optional-focal"));
    expect(screen.getByTestId("ray-through-near-focus")).toHaveAttribute(
      "data-optional-reference",
      "true",
    );
    expect(screen.getByTestId("lens-model-next")).toBeDisabled();
  });

  it("clears a stale outgoing path when the required family changes", async () => {
    const user = userEvent.setup();
    replaceSession(modelStep2Session());
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("radio", { name: /第一条光线：先选一条要用的特殊光线。 平行主光轴/ }));
    await user.click(
      screen.getByRole("radio", { name: /第一条光线：经过透镜后，它应该怎样走？ 过透镜后：经过另一侧焦点/ }),
    );
    expect(screen.getByTestId("ray-parallel-axis").querySelector('[data-ray-segment="outgoing-actual"]')).toBeTruthy();
    await user.click(screen.getByRole("radio", { name: /第一条光线：先选一条要用的特殊光线。 过光心/ }));
    expect(screen.queryByTestId("ray-parallel-axis")).not.toBeInTheDocument();
    const ray = screen.getByTestId("ray-through-center");
    expect(ray.querySelector('[data-ray-segment="incident"]')).toBeTruthy();
    expect(ray.querySelector('[data-ray-segment="outgoing-actual"]')).toBeNull();
    expect(screen.getByTestId("lens-model-next")).toBeDisabled();
    expect(screen.getByTestId("lens-model-next-reason")).toHaveTextContent(/经过透镜后怎么走/);
    expect(screen.queryByTestId("lens-model-next-reason")).not.toHaveTextContent(/走法还对不上/);
    expect(screen.getByTestId("lens-ray-a-after").querySelector("input:checked")).toBeNull();
  });

  it("renders through-center incident immediately", async () => {
    const user = userEvent.setup();
    replaceSession(modelStep2Session());
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("radio", { name: /第一条光线：先选一条要用的特殊光线。 过光心/ }));
    expect(screen.getByTestId("ray-through-center")).toHaveAttribute("data-ray-style", "solid");
    expect(
      screen.getByTestId("ray-through-center").querySelector('[data-ray-segment="incident"]'),
    ).toBeTruthy();
  });
});
