import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FourStrokeEngineLab } from "@/components/learning/FourStrokeEngineLab";
import {
  ENGINE_EXAM_COPY,
  ENGINE_STAGE_PROMPTS,
} from "@/lib/content/four-stroke-engine";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  ENGINE_EXAM_INTENDED_REPRESENTATION,
  ENGINE_EXAM_PATTERN_IDS,
  buildEngineExamAttempt,
  completeEngineExamInput,
  emptyEngineExamDraft,
  engineExamPattern,
  intendedExamModel,
} from "@/lib/learning/engine-exam";
import {
  buildEngineTransferAttempt,
  completeEngineFullModelInput,
  completeEnginePartialTransferInput,
} from "@/lib/learning/engine-transfer";
import { createLearningEvent } from "@/lib/learning/events";
import { replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { LearningStage } from "@/types/learning";
import {
  completedEngineExamAttempts,
  examReadySession,
  transferReadySession,
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

const FIRST = ENGINE_EXAM_PATTERN_IDS[0];
const SECOND = ENGINE_EXAM_PATTERN_IDS[1];
const THIRD = ENGINE_EXAM_PATTERN_IDS[2];

async function completeCurrentExamItem(
  user: ReturnType<typeof userEvent.setup>,
  patternId: string,
  answer?: string,
  reasoning = "燃烧后气体状态变了，再对可以运动的部分做功。",
) {
  const pattern = engineExamPattern(patternId);
  if (!pattern) {
    throw new Error(`Missing pattern ${patternId}`);
  }
  await user.click(
    screen.getByRole("radio", {
      name: ENGINE_EXAM_INTENDED_REPRESENTATION[patternId],
    }),
  );
  await user.click(screen.getByTestId("engine-exam-continue-model"));
  await user.click(screen.getByRole("radio", { name: intendedExamModel(pattern) }));
  await user.click(screen.getByTestId("engine-exam-reveal-options"));
  await user.click(
    screen.getByDisplayValue(answer ?? pattern.correctAnswer),
  );
  await user.type(screen.getByRole("textbox"), reasoning);
  await user.click(screen.getByTestId("engine-exam-submit"));
}

describe("FourStrokeEngineLab Phase 7 EXAM", () => {
  it("hides the lab engine and shows an exam-style stem before options", async () => {
    mockReducedMotion();
    replaceSession(examReadySession());
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-exam-world")).toBeInTheDocument();
    expect(screen.queryByTestId("four-stroke-engine")).not.toBeInTheDocument();
    expect(screen.getByText(ENGINE_EXAM_COPY.notice)).toBeInTheDocument();
    expect(screen.getByTestId("engine-exam-stem")).toHaveTextContent(
      engineExamPattern(FIRST)?.stem ?? "",
    );
    expect(screen.queryByTestId("engine-exam-options")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXAM],
      }),
    ).toBeInTheDocument();
  });

  it("keeps options hidden until representation and model steps are complete", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(examReadySession());
    render(<FourStrokeEngineLab />);

    await screen.findByTestId("engine-exam-world");
    await user.click(
      screen.getByRole("radio", {
        name: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST],
      }),
    );
    expect(screen.queryByTestId("engine-exam-options")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("engine-exam-continue-model"));
    expect(screen.getByTestId("engine-exam-model")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-exam-options")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("radio", {
        name: intendedExamModel(engineExamPattern(FIRST)!),
      }),
    );
    await user.click(screen.getByTestId("engine-exam-reveal-options"));
    expect(screen.getByTestId("engine-exam-options")).toBeInTheDocument();
  });

  it("opens EXAM after valid TRANSFER and does not skip to AI_OFF", async () => {
    mockReducedMotion();
    replaceSession({
      ...transferReadySession(),
      transferAttempts: [
        buildEngineTransferAttempt(completeEngineFullModelInput("t")),
        buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
      ],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-exam-world")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase6-end")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "这一次，自己来。" }),
    ).not.toBeInTheDocument();
  });

  it("does not immediately reveal the correct option after a wrong answer", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(examReadySession());
    render(<FourStrokeEngineLab />);

    const pattern = engineExamPattern(FIRST);
    await completeCurrentExamItem(user, FIRST, pattern?.options[1], "因为名字叫做功冲程。");

    const feedback = await screen.findByTestId("engine-exam-feedback");
    expect(feedback).toHaveTextContent("先回到题目里");
    expect(feedback).not.toHaveTextContent(pattern?.correctAnswer ?? "MISSING");
    expect(screen.getByTestId("engine-exam-world")).toHaveAttribute("data-pattern", FIRST);
  });

  it("keeps the first wrong attempt after a retry", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    const firstWrong = buildEngineExamAttempt({
      patternId: FIRST,
      representation: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST] ?? "",
      modelRecognition: intendedExamModel(engineExamPattern(FIRST)!),
      selectedAnswer: engineExamPattern(FIRST)?.options[1] ?? "wrong",
      reasoning: "因为名字叫做功冲程。",
      timestamp: "t1",
    });
    replaceSession({
      ...examReadySession(),
      examAttempts: [firstWrong],
      events: [
        ...examReadySession().events,
        createLearningEvent("student_response", LearningStage.EXAM, {
          ...emptyEngineExamDraft(),
          currentPatternId: FIRST,
          step: "answer",
          representation: firstWrong.representation?.[0],
          modelRecognition: firstWrong.modelRecognition,
        }),
      ],
    });
    render(<FourStrokeEngineLab />);

    await screen.findByTestId("engine-exam-options");
    await user.click(screen.getByDisplayValue(engineExamPattern(FIRST)?.correctAnswer ?? ""));
    await user.type(
      screen.getByRole("textbox"),
      "燃烧后气体状态变了，再对可以运动的部分做功。",
    );
    await user.click(screen.getByTestId("engine-exam-submit"));

    expect(await screen.findByTestId("engine-exam-world")).toHaveAttribute(
      "data-pattern",
      SECOND,
    );
  });

  it("shows the diagram item as a representation variation", async () => {
    mockReducedMotion();
    replaceSession({
      ...examReadySession(),
      examAttempts: [
        buildEngineExamAttempt(completeEngineExamInput(FIRST, "t1")),
        buildEngineExamAttempt(completeEngineExamInput(SECOND, "t2")),
      ],
      events: [
        ...examReadySession().events,
        createLearningEvent("student_response", LearningStage.EXAM, {
          ...emptyEngineExamDraft(),
          currentPatternId: THIRD,
        }),
      ],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-exam-diagram")).toBeInTheDocument();
    expect(screen.getByTestId("engine-exam-stem")).toHaveTextContent(
      engineExamPattern(THIRD)?.stem ?? "",
    );
    expect(screen.queryByTestId("four-stroke-engine")).not.toBeInTheDocument();
  });

  it("restores the current question and answers after remount", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(examReadySession());
    const view = render(<FourStrokeEngineLab />);

    await user.click(
      await screen.findByRole("radio", {
        name: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST],
      }),
    );
    await user.click(screen.getByTestId("engine-exam-continue-model"));

    view.unmount();
    resetSessionMemory();
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-exam-world")).toHaveAttribute(
      "data-pattern",
      FIRST,
    );
    expect(
      screen.getByRole("radio", {
        name: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST],
      }),
    ).toBeChecked();
    expect(screen.getByTestId("engine-exam-model")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-exam-options")).not.toBeInTheDocument();
  });

  it("opens AI_OFF after EXAM completion", async () => {
    mockReducedMotion();
    replaceSession({
      ...examReadySession(),
      examAttempts: completedEngineExamAttempts(),
      events: [
        ...examReadySession().events,
        createLearningEvent("student_response", LearningStage.EXAM, {
          ...emptyEngineExamDraft(),
          currentPatternId: THIRD,
          step: "answer",
          retiredPatternIds: [...ENGINE_EXAM_PATTERN_IDS],
        }),
      ],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-ai-off-task")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase7-end")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-exam-options")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "这一次，自己来。" }),
    ).toBeInTheDocument();
  });

  it("still completes EXAM if the tutor API fails", async () => {
    mockReducedMotion();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("tutor unavailable"));
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
    expect(screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    fetchMock.mockRestore();
  });
});
