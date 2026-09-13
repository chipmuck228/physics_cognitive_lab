import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ConvexLensOpticalBenchLab } from "@/components/learning/ConvexLensOpticalBenchLab";
import { LensExamTask } from "@/components/learning/LensExamTask";
import { LENS_AI_OFF_COPY } from "@/lib/content/convex-lens-optical-bench";
import { applyLensAiOffCommit, applyLensAiOffPostCheckSave } from "@/lib/learning/lens-action";
import {
  LENS_AI_OFF_A,
  LENS_AI_OFF_B,
  completeLensAiOffDraft,
  intendedLensAiOffPostCheckIds,
  lensAiOffPostCheckOptions,
} from "@/lib/learning/lens-ai-off";
import { lensExamPattern } from "@/lib/learning/lens-exam";
import { LENS_AI_OFF_DRAFT_KEY } from "@/lib/learning/lens-scene-data";
import { createSession } from "@/lib/learning/session";
import {
  getSessionSnapshot,
  replaceSession,
  resetSessionMemory,
} from "@/lib/learning/session-store";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

afterEach(() => {
  resetSessionMemory();
});

function examTaskProps(patternId: string) {
  const pattern = lensExamPattern(patternId);
  if (!pattern) {
    throw new Error(`Missing ${patternId}`);
  }
  return {
    pattern,
    questionIndex: 0,
    totalCount: 5,
    step: "representation" as const,
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    needSteps: false,
    canRetry: false,
    hints: [] as string[],
    canRevealHint: false,
    onRepresentationChange: () => undefined,
    onModelRecognitionChange: () => undefined,
    onSelectedAnswerChange: () => undefined,
    onReasoningChange: () => undefined,
    onContinueToModel: () => undefined,
    onRevealChoices: () => undefined,
    onSubmit: () => undefined,
    onNext: () => undefined,
    onRevealHint: () => undefined,
  };
}

function committedAiOffSession(challengeId = LENS_AI_OFF_A) {
  const base = {
    ...createSession(() => "t0", () => "lens-ai-off-ui", CONVEX_LENS_SCENE_ID),
    stage: LearningStage.AI_OFF,
  };
  const draft = {
    ...completeLensAiOffDraft(challengeId),
    step: "response" as const,
    postCheckSelections: [] as string[],
  };
  return applyLensAiOffCommit(base, draft).session;
}

describe("Scene 07 EXAM diagram and AI_OFF post-check UI", () => {
  it("does not insert a figure on a text exam pattern", () => {
    render(<LensExamTask {...examTaskProps("exam-move-object-toward-f-real-image")} />);
    expect(screen.queryByTestId("lens-exam-diagram")).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-exam-stem")).not.toHaveTextContent("如图");
  });

  it("empty post-check stays current with one missing repair", async () => {
    const user = userEvent.setup();
    replaceSession(committedAiOffSession());
    render(<ConvexLensOpticalBenchLab />);
    await user.click(screen.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit }));
    expect(screen.getByTestId("lens-ai-off-repair")).toHaveTextContent(/勾出/);
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_A,
    );
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "post-check");
    expect(screen.queryByTestId("lens-action-response")).not.toBeInTheDocument();
  });

  it("wrong post-check stays on the same challenge with one repair", async () => {
    const user = userEvent.setup();
    const session = committedAiOffSession();
    replaceSession(session);
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_A,
    );
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "post-check");
    await user.click(screen.getByRole("checkbox", { name: /这也有凸透镜/ }));
    await user.click(screen.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit }));
    expect(screen.getByTestId("lens-ai-off-repair")).toHaveTextContent(/对照还对不上/);
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_A,
    );
    expect(screen.queryByTestId("lens-action-response")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit })).toBeInTheDocument();
  });

  it("accepted first post-check shows challenge 2 with a clean draft", async () => {
    const user = userEvent.setup();
    replaceSession(committedAiOffSession());
    render(<ConvexLensOpticalBenchLab />);
    for (const id of intendedLensAiOffPostCheckIds(LENS_AI_OFF_A)) {
      const option = lensAiOffPostCheckOptions(LENS_AI_OFF_A).find((item) => item.id === id);
      if (option) {
        await user.click(screen.getByRole("checkbox", { name: option.label }));
      }
    }
    await user.click(screen.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit }));
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_B,
    );
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "response");
    expect(screen.queryByTestId("lens-ai-off-post-check")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-repair")).not.toBeInTheDocument();
    expect(screen.getByTestId("lens-ai-off-reasoning")).toHaveValue("");
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).sceneData[LENS_AI_OFF_DRAFT_KEY]).toMatchObject({
      currentChallengeId: LENS_AI_OFF_B,
      step: "response",
      postCheckSelections: [],
    });
  });

  it("refresh after accepted first post-check restores challenge 2, not the old post-check", () => {
    const afterFirst = applyLensAiOffPostCheckSave(committedAiOffSession(), {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
    });
    replaceSession(afterFirst.session);
    const first = render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_B,
    );
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "response");
    expect(screen.queryByTestId("lens-ai-off-post-check")).not.toBeInTheDocument();
    first.unmount();
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_B,
    );
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "response");
    expect(screen.queryByRole("button", { name: /我不知道现在要做什么/ })).not.toBeInTheDocument();
  });

  it("accepted final post-check shows COMPLETE after one click", async () => {
    const user = userEvent.setup();
    const afterFirst = applyLensAiOffPostCheckSave(committedAiOffSession(), {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
    }).session;
    replaceSession(
      applyLensAiOffCommit(afterFirst, {
        ...completeLensAiOffDraft(LENS_AI_OFF_B),
        postCheckSelections: [],
        step: "response",
      }).session,
    );
    render(<ConvexLensOpticalBenchLab />);
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LENS_AI_OFF_B,
    );
    expect(screen.getByTestId("lens-ai-off-task")).toHaveAttribute("data-step", "post-check");
    for (const id of intendedLensAiOffPostCheckIds(LENS_AI_OFF_B)) {
      const option = lensAiOffPostCheckOptions(LENS_AI_OFF_B).find((item) => item.id === id);
      if (option) {
        await user.click(screen.getByRole("checkbox", { name: option.label }));
      }
    }
    await user.click(screen.getByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit }));
    expect(screen.getByTestId("lens-complete")).toBeInTheDocument();
    expect(screen.queryByTestId("lens-ai-off-task")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: LENS_AI_OFF_COPY.postCheckSubmit })).not.toBeInTheDocument();
    expect(getSessionSnapshot(CONVEX_LENS_SCENE_ID).stage).toBe(LearningStage.COMPLETE);
  });
});
