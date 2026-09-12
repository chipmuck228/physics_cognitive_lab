import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HorizontalForceCartLab } from "@/components/learning/HorizontalForceCartLab";
import {
  CART_COPY,
  CART_FORBIDDEN_REVEAL_TERMS,
  CART_STAGE_PROMPTS,
} from "@/lib/content/horizontal-force-cart";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import { resetSessionMemory } from "@/lib/learning/session-store";
import { LearningStage } from "@/types/learning";

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

async function startObserve(user: ReturnType<typeof userEvent.setup>) {
  render(<HorizontalForceCartLab />);
  expect(
    await screen.findByRole("heading", { name: CART_COPY.headline }),
  ).toBeInTheDocument();
  for (const term of CART_FORBIDDEN_REVEAL_TERMS) {
    expect(screen.queryByText(term)).not.toBeInTheDocument();
  }
  await user.click(screen.getByRole("button", { name: CART_COPY.startCta }));
  expect(
    await screen.findByRole("heading", {
      name: CART_STAGE_PROMPTS[LearningStage.OBSERVE],
    }),
  ).toBeInTheDocument();
}

describe("HorizontalForceCartLab Phase 1", () => {
  mockReducedMotion();

  it("starts ENTRY without stating the target rule", async () => {
    resetSessionMemory();
    localStorage.clear();
    const user = userEvent.setup();
    await startObserve(user);
  });

  it("does not let playback or a distractor pass OBSERVE", async () => {
    resetSessionMemory();
    localStorage.clear();
    const user = userEvent.setup();
    await startObserve(user);
    await user.click(screen.getByTestId("cart-play-demo"));
    await user.click(screen.getByLabelText("画面里有一辆小车"));
    await user.click(screen.getByRole("button", { name: CART_COPY.observeSubmit }));
    expect(
      screen.getByRole("heading", {
        name: CART_STAGE_PROMPTS[LearningStage.OBSERVE],
      }),
    ).toBeInTheDocument();
  });

  it("walks OBSERVE through PREDICT with structured description", async () => {
    resetSessionMemory();
    localStorage.clear();
    const user = userEvent.setup();
    await startObserve(user);
    await user.click(screen.getByLabelText("小车一开始是停着的"));
    await user.click(screen.getByLabelText("后来它开始运动"));
    await user.click(screen.getByRole("button", { name: CART_COPY.observeSubmit }));
    expect(
      await screen.findByRole("heading", {
        name: CART_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /^小车$/ }));
    await user.click(screen.getByRole("radio", { name: /^静止$/ }));
    await user.click(screen.getByRole("radio", { name: /^向右$/ }));
    await user.click(screen.getByRole("radio", { name: /^开始运动$/ }));
    await user.type(
      screen.getByLabelText(CART_COPY.describeQuestion),
      "小车先停着，后来向右动起来了。",
    );
    await user.click(screen.getByRole("button", { name: CART_COPY.describeSubmit }));
    expect(
      await screen.findByRole("heading", {
        name: CART_STAGE_PROMPTS[LearningStage.PREDICT],
      }),
    ).toBeInTheDocument();
  });

  it("keeps learning usable when the tutor API fails", async () => {
    resetSessionMemory();
    localStorage.clear();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("tutor unavailable"));
    const user = userEvent.setup();
    await startObserve(user);
    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }));
    expect(screen.queryByText("Internal Server Error")).not.toBeInTheDocument();
    fetchMock.mockRestore();
  });
});
