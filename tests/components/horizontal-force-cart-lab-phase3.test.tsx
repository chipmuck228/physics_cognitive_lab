import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HorizontalForceCartLab } from "@/components/learning/HorizontalForceCartLab";
import {
  CART_COMPLETE_COPY,
  CART_EXAM_COPY,
  CART_STAGE_PROMPTS,
} from "@/lib/content/horizontal-force-cart";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  buildCartAiOffAssessment,
  completeCartAiOffAttempt,
} from "@/lib/learning/cart-ai-off";
import {
  CART_EXAM_INTENDED_REPRESENTATION,
  CART_EXAM_PATTERN_IDS,
  completeCartExamInput,
  completedCartExamAttempts,
  intendedCartExamModel,
  cartExamPattern,
} from "@/lib/learning/cart-exam";
import {
  buildCartModelAttempt,
  completeCartModelInput,
} from "@/lib/learning/cart-model";
import { createSession } from "@/lib/learning/session";
import { replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import {
  buildCartTransferAttempt,
  completeCartBicycleTransferInput,
  completeCartHoverTransferInput,
} from "@/lib/learning/cart-transfer";
import { CART_SCENE_ID, LearningStage } from "@/types/learning";
import type { LearningSession } from "@/types/learning";

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

function baseSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    ...createSession(() => "t0", () => "cart-lab", CART_SCENE_ID),
    modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
    transferAttempts: [
      buildCartTransferAttempt(completeCartBicycleTransferInput("t1")),
      buildCartTransferAttempt(completeCartHoverTransferInput("t2")),
    ],
    ...overrides,
  };
}

describe("HorizontalForceCartLab Phase 3", () => {
  mockReducedMotion();

  it("hides final exam options until representation and model work are complete", async () => {
    resetSessionMemory();
    localStorage.clear();
    replaceSession(baseSession({ stage: LearningStage.EXAM }));
    render(<HorizontalForceCartLab />);
    expect(await screen.findByTestId("cart-exam-world")).toBeInTheDocument();
    expect(screen.queryByTestId("cart-exam-options")).not.toBeInTheDocument();
    expect(screen.getByText(CART_EXAM_COPY.notice)).toBeInTheDocument();

    const user = userEvent.setup();
    const first = CART_EXAM_PATTERN_IDS[0];
    const pattern = cartExamPattern(first);
    await user.click(
      screen.getByRole("radio", { name: CART_EXAM_INTENDED_REPRESENTATION[first] }),
    );
    await user.click(screen.getByTestId("cart-exam-continue-model"));
    expect(screen.queryByTestId("cart-exam-options")).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: intendedCartExamModel(pattern!) }));
    await user.click(screen.getByTestId("cart-exam-reveal-options"));
    expect(screen.getByTestId("cart-exam-options")).toBeInTheDocument();
  });

  it("does not show tutor chrome in AI_OFF and COMPLETE", async () => {
    resetSessionMemory();
    localStorage.clear();
    replaceSession(
      baseSession({
        stage: LearningStage.AI_OFF,
        examAttempts: completedCartExamAttempts(),
      }),
    );
    const { unmount } = render(<HorizontalForceCartLab />);
    expect(await screen.findByTestId("cart-ai-off-task")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria })).not.toBeInTheDocument();
    unmount();

    replaceSession(
      baseSession({
        stage: LearningStage.COMPLETE,
        completed: true,
        examAttempts: completedCartExamAttempts(),
        independentAssessment: buildCartAiOffAssessment(
          [
            completeCartAiOffAttempt("ai-off-unfamiliar-hover-sled", "t1"),
            completeCartAiOffAttempt("ai-off-condition-tug-moving-crate", "t2"),
          ],
          false,
        ),
      }),
    );
    render(<HorizontalForceCartLab />);
    expect(await screen.findByTestId("cart-complete")).toBeInTheDocument();
    expect(screen.getByText(CART_COMPLETE_COPY.title)).toBeInTheDocument();
    expect(screen.getByText(CART_COMPLETE_COPY.caution)).toBeInTheDocument();
    expect(screen.queryByText(/完全掌握/)).not.toBeInTheDocument();
    expect(screen.queryByText(/提高成绩/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: CART_STAGE_PROMPTS[LearningStage.COMPLETE] }),
    ).toBeInTheDocument();
  });

  it("does not let an answer-only exam click skip representation work", async () => {
    resetSessionMemory();
    localStorage.clear();
    replaceSession(baseSession({ stage: LearningStage.EXAM }));
    render(<HorizontalForceCartLab />);
    expect(await screen.findByTestId("cart-exam-stem")).toBeInTheDocument();
    expect(screen.queryByTestId("cart-exam-submit")).not.toBeInTheDocument();
    expect(completeCartExamInput(CART_EXAM_PATTERN_IDS[0], "t").representation).toBeTruthy();
  });
});
