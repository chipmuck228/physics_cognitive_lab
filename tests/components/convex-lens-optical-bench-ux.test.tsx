import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ConvexLensOpticalBenchLab } from "@/components/learning/ConvexLensOpticalBenchLab";
import { LensAiOffTask } from "@/components/learning/LensAiOffTask";
import { LensObserveTask } from "@/components/learning/LensObserveTask";
import { LensRayConstruction } from "@/components/learning/LensRayConstruction";
import {
  LENS_COPY,
  LENS_OBSERVE_OPTIONS,
  LENS_STAGE_LABELS,
  LENS_TASK_FRAMES,
} from "@/lib/content/convex-lens-optical-bench";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import { emptyLensAiOffDraft } from "@/lib/learning/lens-ai-off";
import { completeLensModelDraft, emptyLensModelDraft } from "@/lib/learning/lens-model";
import { createSession } from "@/lib/learning/session";
import { getSessionSnapshot, replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function modelSession() {
  const session = createSession(() => "t0", () => "lens-lab-ux", CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage: LearningStage.MODEL,
    observations: [
      {
        text: "光屏有时清晰有时接不到。",
        timestamp: "t1",
        selectedOptionIds: ["screen-can-change", "size-can-change", "screen-not-always"],
        sufficient: true,
      },
    ],
    descriptions: [
      {
        text: "物体、透镜、像和光屏不是同一个东西。",
        timestamp: "t2",
        sufficient: true,
      },
    ],
    explanations: [
      {
        text: "有的位置光线真正会聚，光屏才能接到。",
        timestamp: "t5",
        sufficient: true,
      },
    ],
    modelAttempts: [],
    sceneData: {
      ...session.sceneData,
      modelDraft: completeLensModelDraft(),
    },
    events: [
      ...session.events,
      { type: "stage_entered" as const, timestamp: "t6", stage: LearningStage.MODEL },
    ],
  };
}

afterEach(() => {
  resetSessionMemory();
  localStorage.clear();
});

describe("Scene 07 learner UX chrome", () => {
  it("does not reveal that every Observe option is required", () => {
    render(
      <LensObserveTask
        selectedOptionIds={[]}
        onToggle={() => undefined}
        onSubmit={() => undefined}
        onPlayDemo={() => undefined}
        onMoveScreen={() => undefined}
        screenAtImagePlane={false}
        needMore={false}
        saved={false}
      />,
    );
    expect(screen.queryByText(/这三项都要勾上/)).not.toBeInTheDocument();
    expect(screen.queryByText(/都要勾上/)).not.toBeInTheDocument();
    expect(screen.queryByText(/才能继续/)).not.toBeInTheDocument();
    expect(LENS_OBSERVE_OPTIONS).toHaveLength(4);
    expect(screen.getByTestId("lens-play-demo")).toBeInTheDocument();
    expect(screen.getByTestId("lens-move-screen")).toBeInTheDocument();
  });

  it("keeps MODEL as progressive steps without a finished diagram", () => {
    render(
      <LensRayConstruction
        draft={emptyLensModelDraft()}
        onChange={() => undefined}
        onSubmit={() => undefined}
      />,
    );
    expect(screen.getByTestId("lens-ray-construction")).toHaveAttribute("data-step", "1");
    expect(screen.getByTestId("lens-model-station")).toBeInTheDocument();
    expect(screen.queryByTestId("lens-model-review")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows a primary task frame on OBSERVE", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-observe-ux", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-task-frame")).toHaveTextContent(
      LENS_TASK_FRAMES[LearningStage.OBSERVE]!.action,
    );
    expect(screen.getByTestId("lens-help-panel")).toBeInTheDocument();
  });

  it("MODEL back to EXPLAIN and return does not destroy progress", async () => {
    const user = userEvent.setup();
    const seeded = modelSession();
    replaceSession(seeded);
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-ray-construction")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.backAria }));
    expect(screen.getByTestId("lens-review-banner")).toHaveTextContent(
      `你正在回看：${LENS_STAGE_LABELS[LearningStage.EXPLAIN]}`,
    );
    expect(screen.getByText("之前的进度不会丢失")).toBeInTheDocument();
    expect(screen.getByTestId("lens-return-progress")).toHaveTextContent("返回建构光路");
    expect(screen.getByTestId("lens-explain-task")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: LENS_COPY.explainSubmit })).not.toBeInTheDocument();
    const viewing = getSessionSnapshot(CONVEX_LENS_SCENE_ID);
    expect(viewing.stage).toBe(LearningStage.MODEL);
    expect(viewing.explanations).toEqual(seeded.explanations);
    expect(viewing.modelAttempts).toEqual(seeded.modelAttempts);
    expect(viewing.events.filter((event) => event.type === "stage_entered")).toEqual(
      seeded.events.filter((event) => event.type === "stage_entered"),
    );
    await user.click(screen.getByTestId("lens-return-progress"));
    expect(screen.getByTestId("lens-ray-construction")).toBeInTheDocument();
    expect(screen.queryByTestId("lens-review-banner")).not.toBeInTheDocument();
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.MODEL);
  });

  it("TRANSFER back to MODEL and return keeps TRANSFER authoritative", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...modelSession(),
      stage: LearningStage.TRANSFER,
      events: [
        ...modelSession().events,
        { type: "stage_entered", timestamp: "t7", stage: LearningStage.TRANSFER },
      ],
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-transfer-task")).toBeInTheDocument();
    expect(screen.getByText("先看这个新情境")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.backAria }));
    expect(screen.getByTestId("lens-review-banner")).toHaveTextContent("建构光路");
    expect(screen.getByTestId("lens-ray-construction")).toBeInTheDocument();
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.TRANSFER);
    await user.click(screen.getByTestId("lens-return-progress"));
    expect(screen.getByTestId("lens-transfer-task")).toBeInTheDocument();
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.TRANSFER);
  });

  it("hides help intents on AI_OFF", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-ai-off-ux", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.AI_OFF,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.queryByTestId("lens-help-panel")).not.toBeInTheDocument();
    expect(screen.queryByText(STUDENT_CHROME.tutorName)).not.toBeInTheDocument();
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
    expect(screen.queryByTestId("lens-help-panel")).not.toBeInTheDocument();
  });
});
