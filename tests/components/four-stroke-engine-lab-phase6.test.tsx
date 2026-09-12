import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FourStrokeEngineLab } from "@/components/learning/FourStrokeEngineLab";
import {
  ENGINE_STAGE_PROMPTS,
  ENGINE_TRANSFER_COPY,
} from "@/lib/content/four-stroke-engine";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  ENGINE_TRANSFER_RELATION_IDS,
  ENGINE_TRANSFER_TARGET_IDS,
  buildEngineTransferAttempt,
  completeEngineFullModelInput,
  completeEnginePartialTransferInput,
  emptyEngineTransferDraft,
  emptyEngineTransferJudgments,
} from "@/lib/learning/engine-transfer";
import { engineHintLadder } from "@/lib/learning/hint-ladder";
import { CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID } from "@/lib/physics-models/canonical-ids";
import { replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { LearningStage } from "@/types/learning";
import {
  modelReadySession,
  transferReadySession,
  validEngineModelAttempt,
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

const CHEMICAL = ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal;
const WORK = ENGINE_TRANSFER_RELATION_IDS.internalToWork;
const MECHANICAL = ENGINE_TRANSFER_RELATION_IDS.systemToMechanical;

async function markRelation(
  user: ReturnType<typeof userEvent.setup>,
  relationId: string,
  kind: "applies" | "not",
) {
  await user.click(
    screen.getByTestId(
      kind === "applies"
        ? `engine-transfer-applies-${relationId}`
        : `engine-transfer-not-${relationId}`,
    ),
  );
}

async function fillValidFullModel(user: ReturnType<typeof userEvent.setup>) {
  await markRelation(user, CHEMICAL, "applies");
  await markRelation(user, WORK, "applies");
  await markRelation(user, MECHANICAL, "applies");
  await user.click(screen.getByTestId(`engine-transfer-order-${CHEMICAL}`));
  await user.click(screen.getByTestId(`engine-transfer-order-${WORK}`));
  await user.click(screen.getByTestId(`engine-transfer-order-${MECHANICAL}`));
  await user.type(
    screen.getByTestId("engine-transfer-explanation"),
    "汽油燃烧后工作气体的状态变了，再推动机械部分，车子得到机械能。",
  );
}

async function fillValidSteam(user: ReturnType<typeof userEvent.setup>) {
  await markRelation(user, CHEMICAL, "not");
  await markRelation(user, WORK, "applies");
  await markRelation(user, MECHANICAL, "applies");
  await user.type(
    screen.getByTestId("engine-transfer-explanation"),
    "后面的关系还可以用，但前面的能量来源不一定相同。",
  );
}

describe("FourStrokeEngineLab Phase 6 TRANSFER", () => {
  it("presents the motorcycle context without the model answer", async () => {
    mockReducedMotion();
    replaceSession(transferReadySession());
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-transfer-task")).toBeInTheDocument();
    expect(screen.getByTestId("engine-transfer-visual-motorcycle")).toBeInTheDocument();
    expect(screen.queryByTestId("four-stroke-engine")).not.toBeInTheDocument();
    expect(screen.getByText(/摩托车靠活塞发动机行驶/)).toBeInTheDocument();
    expect(
      screen.queryByText(CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("只有后半段可以迁移")).not.toBeInTheDocument();
    expect(screen.getByText(ENGINE_TRANSFER_COPY.fullQuestion)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.TRANSFER],
      }),
    ).toBeInTheDocument();
  });

  it("opens TRANSFER only after a valid MODEL", async () => {
    mockReducedMotion();
    replaceSession({
      ...modelReadySession(),
      modelAttempts: [validEngineModelAttempt()],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-transfer-task")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-model-builder")).not.toBeInTheDocument();
  });

  it("does not complete TRANSFER from surface recognition alone", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(transferReadySession());
    render(<FourStrokeEngineLab />);

    await user.click(await screen.findByTestId("engine-transfer-surface-cue"));
    await user.type(screen.getByTestId("engine-transfer-explanation"), "都有活塞。");
    await user.click(screen.getByTestId("engine-transfer-submit"));

    expect(await screen.findByTestId("engine-transfer-feedback")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase6-end")).not.toBeInTheDocument();
    expect(screen.getByTestId("engine-transfer-task")).toHaveAttribute(
      "data-target",
      ENGINE_TRANSFER_TARGET_IDS.motorcycle,
    );
  });

  it("moves from a valid full-model transfer to the steam partial-structure task", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(transferReadySession());
    render(<FourStrokeEngineLab />);

    await fillValidFullModel(user);
    await user.click(screen.getByTestId("engine-transfer-submit"));

    expect(await screen.findByTestId("engine-transfer-visual-steam")).toBeInTheDocument();
    expect(screen.getByText(ENGINE_TRANSFER_COPY.partialQuestion)).toBeInTheDocument();
    expect(screen.getByText(/没有汽油在气缸里燃烧/)).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase6-end")).not.toBeInTheDocument();
  });

  it("opens EXAM after required TRANSFER success", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession({
      ...transferReadySession(),
      transferAttempts: [buildEngineTransferAttempt(completeEngineFullModelInput("t"))],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-transfer-visual-steam")).toBeInTheDocument();
    await fillValidSteam(user);
    await user.click(screen.getByTestId("engine-transfer-submit"));

    expect(await screen.findByTestId("engine-exam-world")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase6-end")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXAM],
      }),
    ).toBeInTheDocument();
  });

  it("keeps a failed transfer attempt and restores unfinished work after remount", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(transferReadySession());
    const view = render(<FourStrokeEngineLab />);

    await user.click(await screen.findByTestId("engine-transfer-surface-cue"));
    await user.type(screen.getByTestId("engine-transfer-explanation"), "都有活塞。");
    await user.click(screen.getByTestId("engine-transfer-submit"));
    expect(await screen.findByTestId("engine-transfer-feedback")).toBeInTheDocument();

    view.unmount();
    resetSessionMemory();
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-transfer-task")).toBeInTheDocument();
    expect(screen.getByTestId("engine-transfer-explanation")).toHaveValue("都有活塞。");
    expect(screen.getByTestId("engine-transfer-surface-cue")).toBeChecked();
    expect(screen.queryByTestId("engine-phase6-end")).not.toBeInTheDocument();
  });

  it("restores accepted transfer evidence after remount", async () => {
    mockReducedMotion();
    replaceSession({
      ...transferReadySession(),
      transferAttempts: [
        buildEngineTransferAttempt(completeEngineFullModelInput("t")),
        buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
      ],
    });
    const view = render(<FourStrokeEngineLab />);
    expect(await screen.findByTestId("engine-exam-world")).toBeInTheDocument();

    view.unmount();
    resetSessionMemory();
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-exam-world")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-transfer-task")).not.toBeInTheDocument();
  });

  it("keeps the first app hint from revealing the transfer answer", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(transferReadySession());
    render(<FourStrokeEngineLab />);

    await user.click(await screen.findByTestId("engine-transfer-hint"));
    const hints = await screen.findByTestId("engine-hint-list");
    expect(hints).toHaveTextContent(engineHintLadder()[0]?.prompt ?? "");
    expect(hints).not.toHaveTextContent("只有后半段可以迁移");
    expect(hints).not.toHaveTextContent(
      CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID,
    );
  });

  it("still completes TRANSFER if the tutor API fails", async () => {
    mockReducedMotion();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("tutor unavailable"));
    const user = userEvent.setup();
    replaceSession({
      ...transferReadySession(),
      transferAttempts: [
        buildEngineTransferAttempt(completeEngineFullModelInput("t")),
        buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
      ],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-exam-world")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }));
    expect(screen.getByTestId("engine-exam-world")).toBeInTheDocument();
    fetchMock.mockRestore();
  });

  it("does not pre-select the correct steam judgments", async () => {
    mockReducedMotion();
    replaceSession({
      ...transferReadySession(),
      transferAttempts: [buildEngineTransferAttempt(completeEngineFullModelInput("t"))],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId(`engine-transfer-applies-${WORK}`)).not.toHaveClass(
      "bg-[var(--heat)]/10",
    );
    expect(emptyEngineTransferDraft().judgments).toEqual(emptyEngineTransferJudgments());
  });
});
