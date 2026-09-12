import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FourStrokeEngineLab } from "@/components/learning/FourStrokeEngineLab";
import {
  ENGINE_COMPLETE_COPY,
  ENGINE_STAGE_PROMPTS,
} from "@/lib/content/four-stroke-engine";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  ENGINE_AI_OFF_CHALLENGE_IDS,
  buildEngineAiOffAssessment,
  completeEngineAiOffAttempt,
  engineAiOffChallenge,
  engineAiOffPostCheckOptions,
  intendedAiOffAnswerId,
} from "@/lib/learning/engine-ai-off";
import { ENGINE_EXAM_PATTERN_IDS, emptyEngineExamDraft } from "@/lib/learning/engine-exam";
import { createLearningEvent } from "@/lib/learning/events";
import { replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { LearningStage } from "@/types/learning";
import {
  aiOffReadySession,
  completedEngineExamAttempts,
  examReadySession,
} from "../learning/engine-fixtures";

function mockReducedMotion() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

const PISTON = ENGINE_AI_OFF_CHALLENGE_IDS[0];
const LOCKED = ENGINE_AI_OFF_CHALLENGE_IDS[1];

async function commitIndependentResponse(
  user: ReturnType<typeof userEvent.setup>,
  challengeId: string,
  answerId = intendedAiOffAnswerId(challengeId),
  reasoning =
    challengeId === LOCKED
      ? "燃烧可以发生，气体也会变热，但机械卡住后没法做功，所以不能按原来方式输出。"
      : "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
) {
  await user.click(screen.getByDisplayValue(answerId));
  await user.type(screen.getByRole("textbox"), reasoning);
  await user.click(screen.getByTestId("engine-ai-off-commit"));
}

async function submitRequiredPostCheck(
  user: ReturnType<typeof userEvent.setup>,
  challengeId: string,
) {
  for (const option of engineAiOffPostCheckOptions(challengeId)) {
    if (!option.required) {
      continue;
    }
    await user.click(screen.getByRole("checkbox", { name: option.label }));
  }
  await user.click(screen.getByTestId("engine-ai-off-post-check-submit"));
}

describe("FourStrokeEngineLab Phase 8 AI_OFF", () => {
  it("has no tutor UI, hint control, or model reminder in AI_OFF", async () => {
    mockReducedMotion();
    const fetchMock = vi.spyOn(globalThis, "fetch");
    replaceSession(aiOffReadySession());
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-ai-off-task")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.AI_OFF],
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria })).not.toBeInTheDocument();
    expect(screen.queryByText(STUDENT_CHROME.tutorName)).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-exam-hint-button")).not.toBeInTheDocument();
    expect(screen.queryByText("再看一步提示")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-evidence-drawer")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-transfer-model-reminder")).not.toBeInTheDocument();
    expect(screen.queryByText("请选择哪条模型关系。")).not.toBeInTheDocument();
    expect(screen.queryByTestId("four-stroke-engine")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
  });

  it("opens AI_OFF after EXAM completion and keeps COMPLETE closed", async () => {
    mockReducedMotion();
    replaceSession({
      ...examReadySession(),
      examAttempts: completedEngineExamAttempts(),
      events: [
        ...examReadySession().events,
        createLearningEvent("student_response", LearningStage.EXAM, {
          ...emptyEngineExamDraft(),
          retiredPatternIds: [...ENGINE_EXAM_PATTERN_IDS],
        }),
      ],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-ai-off-task")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase7-end")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-complete")).not.toBeInTheDocument();
  });

  it("shows the canonical unfamiliar challenge without guided relation steps", async () => {
    mockReducedMotion();
    replaceSession(aiOffReadySession());
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-ai-off-task")).toHaveAttribute(
      "data-challenge",
      PISTON,
    );
    expect(screen.getByTestId("engine-ai-off-scenario")).toHaveTextContent(
      engineAiOffChallenge(PISTON).scenario,
    );
    expect(screen.getByTestId("engine-ai-off-question")).toHaveTextContent(
      engineAiOffChallenge(PISTON).question,
    );
    expect(screen.getByTestId("engine-ai-off-options")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-ai-off-post-check")).not.toBeInTheDocument();
    expect(screen.queryByText("刚才建立的模型")).not.toBeInTheDocument();
  });

  it("requires own reasoning and cannot pass on the answer alone", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(aiOffReadySession());
    render(<FourStrokeEngineLab />);

    await screen.findByTestId("engine-ai-off-options");
    await user.click(screen.getByDisplayValue(intendedAiOffAnswerId(PISTON)));
    await user.click(screen.getByTestId("engine-ai-off-commit"));
    expect(screen.getByTestId("engine-ai-off-task")).toHaveAttribute("data-step", "response");
    await user.type(screen.getByRole("textbox"), "刀具转了。");
    await user.click(screen.getByTestId("engine-ai-off-commit"));
    expect(screen.getByText(/先做出判断/)).toBeInTheDocument();
    expect(screen.queryByTestId("engine-ai-off-post-check")).not.toBeInTheDocument();
  });

  it("commits the independent response before any post-check appears", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(aiOffReadySession());
    render(<FourStrokeEngineLab />);

    expect(screen.queryByTestId("engine-ai-off-post-check")).not.toBeInTheDocument();
    await commitIndependentResponse(user, PISTON);
    expect(await screen.findByTestId("engine-ai-off-committed")).toBeInTheDocument();
    expect(screen.getByTestId("engine-ai-off-task")).toHaveAttribute("data-step", "post-check");
    expect(screen.getByTestId("engine-ai-off-committed")).toHaveTextContent(
      "燃料燃烧后气体先发生变化",
    );
    expect(screen.getByTestId("engine-ai-off-post-check")).toBeInTheDocument();
  });

  it("does not let a post-check rewrite the first committed response", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(aiOffReadySession());
    render(<FourStrokeEngineLab />);

    await commitIndependentResponse(user, PISTON);
    await screen.findByTestId("engine-ai-off-post-check");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await submitRequiredPostCheck(user, PISTON);
    expect(await screen.findByTestId("engine-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LOCKED,
    );
  });

  it("retains the original attempt after a retry", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(aiOffReadySession());
    render(<FourStrokeEngineLab />);

    await commitIndependentResponse(
      user,
      PISTON,
      "combustion-turns-cutter",
      "燃烧直接让机械转起来，刀具就会动。",
    );
    await screen.findByTestId("engine-ai-off-post-check");
    await user.click(screen.getByRole("checkbox", { name: "燃烧直接让刀具转起来。" }));
    await user.click(screen.getByTestId("engine-ai-off-post-check-submit"));
    expect(await screen.findByTestId("engine-ai-off-retry")).toBeInTheDocument();
    await user.click(screen.getByTestId("engine-ai-off-retry"));
    expect(screen.getByTestId("engine-ai-off-task")).toHaveAttribute("data-step", "response");
    await commitIndependentResponse(user, PISTON);
    expect(screen.getByTestId("engine-ai-off-committed")).toHaveTextContent(
      "燃料燃烧后气体先发生变化",
    );
  });

  it("does not restore tutor access after remounting AI_OFF", async () => {
    mockReducedMotion();
    const fetchMock = vi.spyOn(globalThis, "fetch");
    replaceSession(aiOffReadySession());
    const view = render(<FourStrokeEngineLab />);
    await screen.findByTestId("engine-ai-off-task");
    view.unmount();
    resetSessionMemory();
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-ai-off-task")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
  });

  it("opens COMPLETE only after both independent challenges succeed", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(aiOffReadySession());
    render(<FourStrokeEngineLab />);

    await commitIndependentResponse(user, PISTON);
    await submitRequiredPostCheck(user, PISTON);
    expect(await screen.findByTestId("engine-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LOCKED,
    );
    expect(screen.getByTestId("engine-ai-off-scenario")).toHaveTextContent(
      engineAiOffChallenge(LOCKED).scenario,
    );
    expect(screen.queryByTestId("engine-complete")).not.toBeInTheDocument();

    await commitIndependentResponse(user, LOCKED);
    await submitRequiredPostCheck(user, LOCKED);
    expect(await screen.findByTestId("engine-complete")).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COMPLETE_COPY.title)).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COMPLETE_COPY.caution)).toBeInTheDocument();
    expect(screen.queryByText(/完全掌握/)).not.toBeInTheDocument();
    expect(screen.queryByText(/L6|evidenceLevel|C1|C14/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria })).not.toBeInTheDocument();
  });

  it("does not open COMPLETE from a preloaded incomplete AI_OFF session", async () => {
    mockReducedMotion();
    replaceSession({
      ...aiOffReadySession(),
      independentAssessment: buildEngineAiOffAssessment(
        [completeEngineAiOffAttempt(PISTON, "t1")],
        false,
      ),
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-ai-off-task")).toHaveAttribute(
      "data-challenge",
      LOCKED,
    );
    expect(screen.queryByTestId("engine-complete")).not.toBeInTheDocument();
  });
});
