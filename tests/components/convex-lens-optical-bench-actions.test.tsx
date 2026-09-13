import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ConvexLensOpticalBenchLab } from "@/components/learning/ConvexLensOpticalBenchLab";
import {
  LENS_COPY,
  LENS_OBSERVE_OPTIONS,
  LENS_OBSERVE_REQUIRED_IDS,
} from "@/lib/content/convex-lens-optical-bench";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import { applyLensHelpIntent } from "@/lib/learning/lens-help-intents";
import { completeLensModelDraft } from "@/lib/learning/lens-model";
import {
  LENS_MODEL_DRAFT_KEY,
  LENS_TRANSFER_DRAFT_KEY,
  withLensExperimentFormDraft,
} from "@/lib/learning/lens-scene-data";
import {
  completeLensTransferDraft,
  LENS_TRANSFER_REQUIRED_IDS,
} from "@/lib/learning/lens-transfer";
import { createSession } from "@/lib/learning/session";
import {
  getSessionSnapshot,
  replaceSession,
  resetSessionMemory,
} from "@/lib/learning/session-store";
import { LENS_EXPERIMENT_A, LENS_EXPERIMENT_B } from "@/lib/physics/convex-lens-optical-bench";
import { CONVEX_LENS_SCENE_ID, LearningStage, type LearningSession } from "@/types/learning";

function openTrialSession(reflection = ""): LearningSession {
  const session = createSession(() => "t0", () => "lens-actions", CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage: LearningStage.EXPERIMENT,
    predictions: [
      {
        prediction: "real-larger-farther",
        reasoning: "物体更靠近焦点。",
        timestamp: "t3",
        experimentId: LENS_EXPERIMENT_A,
        committed: true,
      },
    ],
    experimentEvidence: [
      {
        prediction: "real-larger-farther",
        predictionReason: "物体更靠近焦点。",
        predictionComparison: "",
        reflection,
        timestamp: "t4",
        experimentId: LENS_EXPERIMENT_A,
        committedAt: "t3",
        interventionAt: "t4",
        observedResult: { screen: "", sizeOrCover: "" },
        comparison: "",
        physicsResult: { objectStation: "between-f-2f" },
        authoredBeforeIntervention: true,
        sufficient: false,
      },
    ],
    events: [
      ...session.events,
      { type: "stage_entered" as const, timestamp: "t4", stage: LearningStage.EXPERIMENT },
    ],
  };
}

afterEach(() => {
  resetSessionMemory();
  localStorage.clear();
});

async function recordObservedAndCompare(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: /光屏接到清晰像/ }));
  await user.click(screen.getByRole("radio", { name: /看见的像更大/ }));
  await user.click(screen.getByTestId("lens-save-observed"));
  await user.click(screen.getByRole("radio", { name: /基本一样/ }));
  await user.click(screen.getByTestId("lens-save-comparison"));
}

describe("Scene 07 enabled-action contract", () => {
  it("reproduces the prior silent 记下这次想法 failure: enabled click with no visible result", async () => {
    const user = userEvent.setup();
    replaceSession(openTrialSession());
    render(<ConvexLensOpticalBenchLab />);
    await recordObservedAndCompare(user);
    const button = screen.getByTestId("lens-save-reflection");
    expect(button).toBeEnabled();
    await user.click(button);
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
    expect(screen.getByTestId("lens-action-response-message")).toHaveTextContent(/自己的想法|中文字/);
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).experimentEvidence[0]?.sufficient).not.toBe(
      true,
    );
  });

  it("empty reflection stays enabled and shows missing", async () => {
    const user = userEvent.setup();
    replaceSession(openTrialSession());
    render(<ConvexLensOpticalBenchLab />);
    await recordObservedAndCompare(user);
    await user.click(screen.getByRole("button", { name: LENS_COPY.reflectionSubmit }));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
    await user.click(screen.getByRole("button", { name: LENS_COPY.reflectionSubmit }));
    expect(screen.getByTestId("lens-action-response-message")).toBeInTheDocument();
  });

  it("latin-only reflection cannot look like a successful save", async () => {
    const user = userEvent.setup();
    replaceSession(openTrialSession());
    render(<ConvexLensOpticalBenchLab />);
    await recordObservedAndCompare(user);
    await user.type(screen.getByTestId(`lens-reflection-${LENS_EXPERIMENT_A}`), "the image got bigger");
    await user.click(screen.getByTestId("lens-save-reflection"));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).experimentEvidence[0]?.sufficient).toBe(false);
  });

  it("valid visible form on the last button commits and leaves the open A trial", async () => {
    const user = userEvent.setup();
    replaceSession(openTrialSession());
    render(<ConvexLensOpticalBenchLab />);
    await recordObservedAndCompare(user);
    await user.type(screen.getByTestId(`lens-reflection-${LENS_EXPERIMENT_A}`), "像变大是因为物体更靠近焦点。");
    await user.click(screen.getByTestId("lens-save-reflection"));
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).experimentEvidence[0]?.sufficient).toBe(true);
    expect(screen.getByTestId("lens-trial-complete")).toHaveTextContent("第 1 次验证完成");
    await user.click(screen.getByTestId("lens-start-next-trial"));
    expect(screen.getByText(/物体正好放在焦点上/)).toBeInTheDocument();
  });

  it("help does not change the reflection draft used by submit", async () => {
    const user = userEvent.setup();
    const seeded = openTrialSession();
    replaceSession(
      applyLensHelpIntent(seeded, LearningStage.EXPERIMENT, "what-now", {
        constructionStep: 1,
      }),
    );
    render(<ConvexLensOpticalBenchLab />);
    await recordObservedAndCompare(user);
    await user.type(screen.getByTestId(`lens-reflection-${LENS_EXPERIMENT_A}`), "像变大是因为物体更靠近焦点。");
    expect(screen.getByTestId("lens-help-panel")).toBeInTheDocument();
    await user.click(screen.getByTestId("lens-help-what-compare"));
    expect(screen.getByTestId(`lens-reflection-${LENS_EXPERIMENT_A}`)).toHaveValue(
      "像变大是因为物体更靠近焦点。",
    );
    await user.click(screen.getByTestId("lens-save-reflection"));
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).experimentEvidence[0]?.reflection).toMatch(
      /靠近焦点/,
    );
  });

  it("review hides the working-path save; return restores an enabled next action", async () => {
    const user = userEvent.setup();
    replaceSession(openTrialSession());
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.backAria }));
    expect(screen.getByTestId("lens-review-banner")).toBeInTheDocument();
    expect(screen.queryByTestId("lens-save-observed")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("lens-return-progress"));
    expect(screen.getByTestId("lens-save-observed")).toBeEnabled();
    await user.click(screen.getByTestId("lens-save-observed"));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
  });

  it("refresh keeps an uncommitted reflection draft for the submit handler", async () => {
    const user = userEvent.setup();
    const seeded = openTrialSession();
    replaceSession({
      ...seeded,
      sceneData: withLensExperimentFormDraft(seeded.sceneData, {
        experimentId: LENS_EXPERIMENT_A,
        observed: { screen: "clear", sizeOrCover: "larger" },
        comparison: "same",
        reflection: "像变大是因为物体更靠近焦点。",
      }),
    });
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByTestId("lens-save-observed"));
    await user.click(screen.getByTestId("lens-save-comparison"));
    expect(screen.getByTestId(`lens-reflection-${LENS_EXPERIMENT_A}`)).toHaveValue(
      "像变大是因为物体更靠近焦点。",
    );
    await user.click(screen.getByTestId("lens-save-reflection"));
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).experimentEvidence[0]?.sufficient).toBe(true);
  });

  it("empty comparison click is missing, not silent", async () => {
    const user = userEvent.setup();
    replaceSession(openTrialSession());
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("radio", { name: /光屏接到清晰像/ }));
    await user.click(screen.getByRole("radio", { name: /看见的像更大/ }));
    await user.click(screen.getByTestId("lens-save-observed"));
    await user.click(screen.getByTestId("lens-save-comparison"));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
  });

  it("OBSERVE checkboxes without a bench action show the interaction reason", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-observe-no-bench", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    const required = new Set<string>(LENS_OBSERVE_REQUIRED_IDS);
    for (const option of LENS_OBSERVE_OPTIONS) {
      if (required.has(option.id)) {
        await user.click(screen.getByLabelText(option.label));
      }
    }
    await user.click(screen.getByRole("button", { name: LENS_COPY.observeSubmit }));
    expect(screen.getByTestId("lens-observe-need-more")).toHaveTextContent(
      LENS_COPY.observeNeedInteraction,
    );
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.OBSERVE);
  });

  it("TRANSFER progress chrome shows 1 / 2 then 2 / 2", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-transfer-progress-1", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.TRANSFER,
    });
    const { unmount } = render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-transfer-progress")).toHaveTextContent("第 1 / 2 个新情境");
    unmount();
    replaceSession({
      ...createSession(() => "t0", () => "lens-transfer-progress-2", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.TRANSFER,
      transferAttempts: [
        {
          scenarioId: LENS_TRANSFER_REQUIRED_IDS[0],
          targetId: LENS_TRANSFER_REQUIRED_IDS[0],
          accepted: true,
          response: "投影仪。",
          timestamp: "t1",
        },
      ],
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-transfer-progress")).toHaveTextContent("第 2 / 2 个新情境");
    expect(screen.getByText(LENS_COPY.transferFirstSaved)).toBeInTheDocument();
  });

  it("OBSERVE submit and screen move always produce a visible response class", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-observe-action", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByTestId("lens-move-screen"));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "applied",
    );
    await user.click(screen.getByRole("button", { name: LENS_COPY.observeSubmit }));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
  });

  it("DESCRIBE submit with empty structure is missing", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-describe-action", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.DESCRIBE,
    });
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("button", { name: LENS_COPY.describeSubmit }));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "missing",
    );
  });

  it("MODEL complete-but-incorrect presents rejected, not committed", async () => {
    const user = userEvent.setup();
    const draft = {
      ...completeLensModelDraft("beyond-2f"),
      meetingMode: "backward-extension",
      constructionStep: 7,
    };
    replaceSession({
      ...createSession(() => "t0", () => "lens-model-action", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.MODEL,
      sceneData: { [LENS_MODEL_DRAFT_KEY]: draft },
    });
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("button", { name: LENS_COPY.modelSubmit }));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "rejected",
    );
    expect(screen.getByTestId("lens-model-repair-panel")).toHaveTextContent(
      LENS_COPY.modelCannotSubmit,
    );
    expect(screen.getByTestId("lens-model-repair")).toHaveTextContent("回到第 4 步修改");
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).modelAttempts[0]?.correctStructure).toBe(
      false,
    );
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.MODEL);
  });

  it("TRANSFER rejected is not presented as committed", async () => {
    const user = userEvent.setup();
    const accepted = completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]);
    const draft = {
      ...accepted,
      meetingMode:
        accepted.meetingMode === "actual-convergence"
          ? "backward-extension"
          : "actual-convergence",
    };
    replaceSession({
      ...createSession(() => "t0", () => "lens-transfer-action", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.TRANSFER,
      sceneData: { [LENS_TRANSFER_DRAFT_KEY]: draft },
    });
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("button", { name: LENS_COPY.transferSubmit }));
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "rejected",
    );
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).transferAttempts[0]?.accepted).toBe(false);
  });

  it("OBSERVE exposes station hits and applying one changes canonical physics", async () => {
    const user = userEvent.setup();
    replaceSession({
      ...createSession(() => "t0", () => "lens-station-hit", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.OBSERVE,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("station-hit-between-f-and-2f")).toBeInTheDocument();
    await user.click(screen.getByTestId("station-hit-between-f-and-2f"));
    expect(screen.getByTestId("convex-lens-optical-bench")).toHaveAttribute(
      "data-object-station",
      "between-f-and-2f",
    );
    expect(screen.getByTestId("lens-action-response")).toHaveAttribute(
      "data-response-class",
      "applied",
    );
  });

  it("EXPLAIN has no station-hit or ray construction controls", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-explain-caps", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.EXPLAIN,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.queryByTestId("station-hit-beyond-2f")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ray-construction")).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-explain-task")).toBeInTheDocument();
  });

  it("AI_OFF has no help entry", () => {
    replaceSession({
      ...createSession(() => "t0", () => "lens-aioff-caps", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.AI_OFF,
    });
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.queryByRole("button", { name: /我不知道现在要做什么/ })).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-help-panel")).not.toBeInTheDocument();
  });
});
