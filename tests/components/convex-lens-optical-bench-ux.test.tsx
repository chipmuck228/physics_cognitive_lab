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
import { authoritativeLensPhysics } from "@/lib/learning/lens-revisit";
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

async function goBackTimes(user: ReturnType<typeof userEvent.setup>, times: number) {
  for (let index = 0; index < times; index += 1) {
    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.backAria }));
  }
}

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
    expect(screen.getByTestId("lens-model-next")).toBeDisabled();
    expect(screen.getByTestId("lens-model-next-reason")).toHaveTextContent(
      "还需要先选出物体相对 F / 2F 在哪里。",
    );
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
    expect(screen.getByTestId("lens-task-context")).toHaveTextContent(
      LENS_TASK_FRAMES[LearningStage.OBSERVE]!.context,
    );
    expect(screen.getByTestId("lens-task-goal")).toHaveTextContent(
      LENS_TASK_FRAMES[LearningStage.OBSERVE]!.goal,
    );
    expect(screen.getByTestId("lens-task-focus")).toHaveTextContent(
      LENS_TASK_FRAMES[LearningStage.OBSERVE]!.focus,
    );
    expect(screen.getByTestId("lens-task-action")).toHaveTextContent(
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

  it("A. revisiting OBSERVE lets the student move the screen in preview only", async () => {
    const user = userEvent.setup();
    const seeded = modelSession();
    replaceSession(seeded);
    render(<ConvexLensOpticalBenchLab />);
    await goBackTimes(user, 5);
    expect(screen.getByTestId("lens-observe-task")).toBeInTheDocument();
    const bench = screen.getByTestId("convex-lens-optical-bench");
    const screenBefore = bench.getAttribute("data-screen-x");
    const objectBefore = bench.getAttribute("data-object-station");
    const physicsBefore = JSON.parse(
      JSON.stringify(getSessionSnapshot(CONVEX_LENS_SCENE_ID).physicsState),
    );
    const evidenceBefore = getSessionSnapshot(CONVEX_LENS_SCENE_ID).observations;
    await user.click(screen.getByTestId("lens-move-screen"));
    expect(screen.getByTestId("convex-lens-optical-bench")).not.toHaveAttribute(
      "data-screen-x",
      screenBefore,
    );
    await user.click(screen.getByTestId("lens-play-demo"));
    expect(screen.getByTestId("convex-lens-optical-bench")).not.toHaveAttribute(
      "data-object-station",
      objectBefore,
    );
    const viewing = getSessionSnapshot(CONVEX_LENS_SCENE_ID);
    expect(viewing.stage).toBe(LearningStage.MODEL);
    expect(viewing.physicsState).toEqual(physicsBefore);
    expect(viewing.observations).toEqual(evidenceBefore);
    await user.click(screen.getByTestId("lens-return-progress"));
    expect(screen.getByTestId("lens-ray-construction")).toBeInTheDocument();
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).physicsState).toEqual(physicsBefore);
    expect(authoritativeLensPhysics(getSessionSnapshot(CONVEX_LENS_SCENE_ID))).toEqual(
      authoritativeLensPhysics(seeded),
    );
  });

  it("B. OBSERVE help does not offer ray-construction intents", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-observe-help", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-help-what-now")).toBeInTheDocument();
    expect(screen.getByTestId("lens-help-where-look")).toBeInTheDocument();
    expect(screen.queryByTestId("lens-help-how-rays")).not.toBeInTheDocument();
    expect(screen.queryByText("我不知道光线怎么走")).not.toBeInTheDocument();
  });

  it("C. unsubmitted Observe selection survives help", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-observe-draft", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    const option = screen.getByLabelText(LENS_OBSERVE_OPTIONS[0]!.label);
    await user.click(option);
    expect(option).toBeChecked();
    await user.click(screen.getByTestId("lens-help-what-now"));
    expect(screen.getByLabelText(LENS_OBSERVE_OPTIONS[0]!.label)).toBeChecked();
    await user.click(screen.getByTestId("lens-help-next"));
    expect(screen.getByLabelText(LENS_OBSERVE_OPTIONS[0]!.label)).toBeChecked();
  });

  it("D. partial MODEL construction survives help", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...modelSession(),
      modelAttempts: [],
      sceneData: {
        ...modelSession().sceneData,
        modelDraft: emptyLensModelDraft(),
      },
    });
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("radio", { name: /物体在 2F 以外/ }));
    expect(screen.getByRole("radio", { name: /物体在 2F 以外/ })).toBeChecked();
    await user.click(screen.getByTestId("lens-help-what-now"));
    expect(screen.getByRole("radio", { name: /物体在 2F 以外/ })).toBeChecked();
    expect(screen.getByTestId("lens-ray-construction")).toHaveAttribute("data-step", "1");
  });

  it("E. Scene 07 has only LensHelpPanel, not the generic tutor entry", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-one-help", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-help-panel")).toBeInTheDocument();
    expect(screen.queryByText(STUDENT_CHROME.tutorAsk)).not.toBeInTheDocument();
    expect(screen.queryByText(STUDENT_CHROME.tutorName)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria })).not.toBeInTheDocument();
  });

  it("exposes OBSERVE interaction context without ray references", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-observe-context", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    const context = screen.getByTestId("lens-interaction-context");
    expect(context.getAttribute("data-references")).toContain("screen:rendered");
    expect(context.getAttribute("data-references") ?? "").not.toMatch(/ray:/);
    expect(context.getAttribute("data-capabilities")).toContain("move-screen");
    expect(screen.getByTestId("lens-cognitive-trace")).toBeInTheDocument();
  });

  it("MODEL ray substep exposes ray references for help", () => {
    replaceSession({
      ...modelSession(),
      sceneData: {
        ...modelSession().sceneData,
        modelDraft: { ...emptyLensModelDraft(), constructionStep: 2 },
      },
    });
    render(<ConvexLensOpticalBenchLab />);
    const refs = screen.getByTestId("lens-interaction-context").getAttribute("data-references") ?? "";
    expect(refs).toContain("ray:textual");
    expect(refs).not.toContain("ray:constructed");
    expect(screen.getByTestId("lens-interaction-context")).toHaveAttribute(
      "data-student-ray-count",
      "0",
    );
    expect(screen.queryByTestId("ray-parallel-axis")).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-help-how-rays")).toBeInTheDocument();
  });

  it("EXPLAIN help cannot say look at two rays when the bench hides rays", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-explain-help", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.EXPLAIN,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("convex-lens-optical-bench")).toBeInTheDocument();
    expect(screen.queryByTestId("ray-parallel-axis")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ray-through-center")).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-interaction-context")).toHaveAttribute(
      "data-student-ray-count",
      "0",
    );
    await user.click(screen.getByTestId("lens-help-how-meeting"));
    expect(screen.queryByText(/先看两条光线/)).not.toBeInTheDocument();
    expect(screen.getByText(/先问自己：出射以后/)).toBeInTheDocument();
  });

  it("TRANSFER help cannot say look at rays when no bench renders", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...modelSession(),
      stage: LearningStage.TRANSFER,
      events: [
        ...modelSession().events,
        { type: "stage_entered" as const, timestamp: "t7", stage: LearningStage.TRANSFER },
      ],
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.queryByTestId("convex-lens-optical-bench")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("lens-help-how-image"));
    expect(screen.queryByText(/先看两条光线/)).not.toBeInTheDocument();
    expect(screen.getByText(/不要去找图上还不存在的光线/)).toBeInTheDocument();
  });

  it("MODEL look-at-ray help appears only after learner rays are on the bench", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...modelSession(),
      sceneData: {
        ...modelSession().sceneData,
        modelDraft: { ...completeLensModelDraft(), constructionStep: 4 },
      },
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-interaction-context")).toHaveAttribute(
      "data-student-ray-count",
      "2",
    );
    expect(screen.getByTestId("ray-parallel-axis")).toBeInTheDocument();
    expect(screen.getByTestId("ray-through-center")).toBeInTheDocument();
    await user.click(screen.getByTestId("lens-help-how-meeting"));
    expect(screen.getByText(/先看两条光线过透镜以后/)).toBeInTheDocument();
  });

  it("cognitive trace does not mutate evidence when opened", async () => {
    const user = userEvent.setup();
    const seeded = modelSession();
    replaceSession(seeded);
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByText("我走过的路"));
    expect(screen.getByText("我的观察")).toBeInTheDocument();
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).observations).toEqual(seeded.observations);
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).explanations).toEqual(seeded.explanations);
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.MODEL);
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
