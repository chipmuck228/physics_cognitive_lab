import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FourStrokeEngineLab } from "@/components/learning/FourStrokeEngineLab";
import {
  ENGINE_COPY,
  ENGINE_FORBIDDEN_REVEAL_TERMS,
  ENGINE_MODEL_COPY,
  ENGINE_STAGE_PROMPTS,
} from "@/lib/content/four-stroke-engine";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import {
  ENGINE_MODEL_NODE_IDS,
  ENGINE_STROKE_NODE_IDS,
  buildEngineModelAttempt,
  completeEngineModelInput,
  connectionsFromEngineSlots,
} from "@/lib/learning/engine-model";
import { replaceSession, resetSessionMemory } from "@/lib/learning/session-store";
import { LearningStage } from "@/types/learning";
import {
  explainReadySession,
  modelReadySession,
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

async function fillValidExplain(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: "气缸里的气体" }));
  await user.click(
    screen.getByRole("radio", { name: "气体变化以后，推动活塞或机械系统" }),
  );
  await user.click(
    screen.getByRole("radio", {
      name: "气体对机械系统产生了推动，机械部分才得到运动",
    }),
  );
  await user.type(
    screen.getByLabelText(ENGINE_COPY.explainOwnWords),
    "燃烧以后气体先变了，再推动活塞。",
  );
}

async function placeNode(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  slot: number,
) {
  await user.click(screen.getByRole("button", { name: label }));
  await user.click(screen.getByTestId(`engine-model-slot-${slot}`));
}

async function chooseRelation(
  user: ReturnType<typeof userEvent.setup>,
  index: number,
  label: string,
) {
  await user.click(
    within(screen.getByTestId(`engine-model-relation-${index}`)).getByRole(
      "button",
      { name: label },
    ),
  );
}

describe("FourStrokeEngineLab Phase 5", () => {
  it("opens EXPLAIN when both experiments are already closed", async () => {
    mockReducedMotion();
    replaceSession({
      ...explainReadySession(),
      stage: LearningStage.EXPERIMENT,
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-explain-task")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXPLAIN],
      }),
    ).toBeInTheDocument();
  });
  it("shows experiment evidence in EXPLAIN and does not dump the full model", async () => {
    mockReducedMotion();
    replaceSession(explainReadySession());
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-explain-task")).toBeInTheDocument();
    expect(screen.getByTestId("engine-evidence-drawer")).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COPY.explainEvidenceA)).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COPY.explainEvidenceB)).toBeInTheDocument();
    expect(screen.getByTestId("engine-explain-step-1")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-explain-step-2")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-model-builder")).not.toBeInTheDocument();
    expect(screen.queryByText(ENGINE_MODEL_COPY.phase5Title)).not.toBeInTheDocument();
    for (const term of ENGINE_FORBIDDEN_REVEAL_TERMS) {
      expect(screen.queryByText(new RegExp(`^${term}$`))).not.toBeInTheDocument();
    }
    expect(screen.queryByText(/化学能\s*→\s*内能/)).not.toBeInTheDocument();
  });

  it("does not advance from a direct combustion-to-crank explanation", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(explainReadySession());
    render(<FourStrokeEngineLab />);

    await user.click(await screen.findByRole("radio", { name: "曲轴直接被燃烧推着转" }));
    await user.click(screen.getByRole("radio", { name: "燃烧直接让曲轴转起来" }));
    await user.click(screen.getByRole("radio", { name: "燃烧本身就是动力" }));
    await user.type(
      screen.getByLabelText(ENGINE_COPY.explainOwnWords),
      "燃烧让曲轴转。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.explainSubmit }));

    expect(
      await screen.findByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXPLAIN],
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COPY.explainNeedMore)).toBeInTheDocument();
    expect(screen.queryByTestId("engine-model-builder")).not.toBeInTheDocument();
  });

  it("advances to MODEL after sufficient causal EXPLAIN evidence", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(explainReadySession());
    render(<FourStrokeEngineLab />);

    await fillValidExplain(user);
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.explainSubmit }));

    expect(
      await screen.findByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.MODEL],
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("engine-model-builder")).toBeInTheDocument();
    expect(screen.getByTestId("engine-evidence-drawer")).toBeInTheDocument();
    expect(screen.getByText(ENGINE_MODEL_COPY.glossaryWork)).toBeInTheDocument();
  });

  it("rejects four-stroke names and keeps the failed MODEL attempt", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(modelReadySession());
    render(<FourStrokeEngineLab />);

    await placeNode(user, "吸气冲程", 0);
    await placeNode(user, "压缩冲程", 1);
    await placeNode(user, "做功冲程", 2);
    await placeNode(user, "排气冲程", 3);
    await user.click(screen.getByRole("button", { name: ENGINE_MODEL_COPY.submit }));

    expect(await screen.findByTestId("engine-model-feedback")).toHaveTextContent(
      "四个冲程名字是运转顺序",
    );
    expect(screen.queryByTestId("engine-phase5-end")).not.toBeInTheDocument();
    expect(screen.getByTestId("engine-model-slot-0")).toHaveTextContent("吸气冲程");
  });

  it("completes MODEL with the structured causal chain and continues to TRANSFER", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(modelReadySession());
    render(<FourStrokeEngineLab />);

    await placeNode(user, "燃料的化学能", 0);
    await placeNode(user, "工作气体的内能/状态", 1);
    await placeNode(user, "机械系统", 2);
    await placeNode(user, "机械能", 3);
    await chooseRelation(user, 0, ENGINE_MODEL_COPY.relationConversion);
    await chooseRelation(user, 1, ENGINE_MODEL_COPY.relationWork);
    await chooseRelation(user, 2, ENGINE_MODEL_COPY.relationGains);
    await user.click(screen.getByTestId("engine-model-combustion-enable"));
    await user.click(screen.getByRole("button", { name: ENGINE_MODEL_COPY.submit }));

    expect(await screen.findByTestId("engine-transfer-task")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.TRANSFER],
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("engine-model-builder")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase5-end")).not.toBeInTheDocument();
  });

  it("restores an unfinished model after remount", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    const failed = buildEngineModelAttempt({
      slots: [...ENGINE_STROKE_NODE_IDS],
      connections: connectionsFromEngineSlots(
        [...ENGINE_STROKE_NODE_IDS],
        ["conversion", "work", "gains"],
      ),
      combustionEnablesConversion: false,
      timestamp: "t",
    });
    replaceSession({
      ...modelReadySession(),
      modelAttempts: [failed],
    });
    const view = render(<FourStrokeEngineLab />);
    expect(await screen.findByTestId("engine-model-slot-0")).toHaveTextContent(
      "吸气冲程",
    );

    view.unmount();
    resetSessionMemory();
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-model-builder")).toBeInTheDocument();
    expect(screen.getByTestId("engine-model-slot-1")).toHaveTextContent("压缩冲程");
    expect(screen.queryByTestId("engine-phase5-end")).not.toBeInTheDocument();
  });

  it("keeps the first app hint from revealing the full chain", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(explainReadySession());
    render(<FourStrokeEngineLab />);

    await user.click(await screen.findByTestId("engine-explain-hint"));
    const hints = await screen.findByTestId("engine-hint-list");
    expect(hints).not.toHaveTextContent(/化学能\s*→\s*内能/);
    expect(hints).not.toHaveTextContent(/化学能.{0,8}内能.{0,8}做功.{0,8}机械能/);
  });

  it("still completes MODEL if the tutor API fails", async () => {
    mockReducedMotion();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("tutor unavailable"));
    const user = userEvent.setup();
    replaceSession({
      ...modelReadySession(),
      modelAttempts: [buildEngineModelAttempt(completeEngineModelInput("t"))],
    });
    render(<FourStrokeEngineLab />);

    expect(await screen.findByTestId("engine-transfer-task")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }));
    expect(screen.getByTestId("engine-transfer-task")).toBeInTheDocument();
    expect(screen.queryByText("试试看考试题")).not.toBeInTheDocument();
    fetchMock.mockRestore();
  });

  it("does not treat a combustion quantity node as a completed model", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    replaceSession(modelReadySession());
    render(<FourStrokeEngineLab />);

    await placeNode(user, "燃烧", 0);
    await placeNode(user, "机械系统", 1);
    await placeNode(user, "机械能", 2);
    await placeNode(user, "燃料的化学能", 3);
    await chooseRelation(user, 0, ENGINE_MODEL_COPY.relationConversion);
    await user.click(screen.getByRole("button", { name: ENGINE_MODEL_COPY.submit }));

    expect(await screen.findByTestId("engine-model-feedback")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase5-end")).not.toBeInTheDocument();
    expect(ENGINE_MODEL_NODE_IDS.combustionQuantity).toBe("combustion-quantity");
  });
});
