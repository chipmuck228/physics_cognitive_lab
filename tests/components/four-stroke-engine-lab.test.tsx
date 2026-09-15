import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FourStrokeEngineLab } from "@/components/learning/FourStrokeEngineLab";
import {
  ENGINE_COPY,
  ENGINE_FORBIDDEN_REVEAL_TERMS,
  ENGINE_OBSERVE_OPTIONS,
  ENGINE_STAGE_PROMPTS,
} from "@/lib/content/four-stroke-engine";
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
  render(<FourStrokeEngineLab />);
  expect(
    await screen.findByRole("heading", { name: ENGINE_COPY.headline }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: ENGINE_COPY.startCta }));
  expect(
    await screen.findByRole("heading", {
      name: ENGINE_STAGE_PROMPTS[LearningStage.OBSERVE],
    }),
  ).toBeInTheDocument();
}

async function submitSufficientObservation(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.click(screen.getByLabelText("活塞会上下运动"));
  await user.click(screen.getByLabelText("有时进气门打开"));
  await user.click(screen.getByRole("button", { name: ENGINE_COPY.observeSubmit }));
  expect(
    await screen.findByRole("heading", {
      name: ENGINE_STAGE_PROMPTS[LearningStage.DESCRIBE],
    }),
  ).toBeInTheDocument();
}

async function fillCorrectSnapshots(user: ReturnType<typeof userEvent.setup>) {
  const snapshotA = within(
    screen.getByTestId("engine-snapshot-a").closest("section") as HTMLElement,
  );
  await user.click(snapshotA.getByRole("radio", { name: "活塞 向下" }));
  await user.click(snapshotA.getByRole("radio", { name: "进气门 打开" }));
  await user.click(snapshotA.getByRole("radio", { name: "排气门 关闭" }));
  await user.click(snapshotA.getByRole("radio", { name: "燃烧 没出现" }));

  const snapshotB = within(
    screen.getByTestId("engine-snapshot-b").closest("section") as HTMLElement,
  );
  await user.click(snapshotB.getByRole("radio", { name: "活塞 向下" }));
  await user.click(snapshotB.getByRole("radio", { name: "进气门 关闭" }));
  await user.click(snapshotB.getByRole("radio", { name: "排气门 关闭" }));
  await user.click(snapshotB.getByRole("radio", { name: "燃烧 出现" }));
}

async function reachPredict(user: ReturnType<typeof userEvent.setup>) {
  await startObserve(user);
  await submitSufficientObservation(user);
  await fillCorrectSnapshots(user);
  await user.type(
    screen.getByLabelText(ENGINE_COPY.describeQuestion),
    "活塞向下运动，这里发生了燃烧，两个气门都关着。",
  );
  await user.click(screen.getByRole("button", { name: ENGINE_COPY.describeSubmit }));
  expect(
    await screen.findByRole("heading", {
      name: ENGINE_STAGE_PROMPTS[LearningStage.PREDICT],
    }),
  ).toBeInTheDocument();
}

async function commitPredictionA(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: "不能产生主要动力" }));
  await user.click(screen.getByRole("radio", { name: ENGINE_COPY.reasonHasIdea }));
  await user.type(
    screen.getByLabelText(ENGINE_COPY.reasonLabel),
    "没有燃烧，可能就没有刚才那种主要动力。",
  );
  await user.click(screen.getByRole("button", { name: ENGINE_COPY.predictSubmit }));
  expect(
    await screen.findByRole("heading", {
      name: ENGINE_STAGE_PROMPTS[LearningStage.EXPERIMENT],
    }),
  ).toBeInTheDocument();
}

async function closeExperimentA(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId("engine-run-experiment"));
  const observed = await screen.findByTestId("engine-observed-result");
  await user.click(
    within(observed).getByRole("radio", { name: "有没有发生燃烧？ 没有" }),
  );
  await user.click(
    within(observed).getByRole("radio", {
      name: "活塞或机构有没有在运动？ 还在运动",
    }),
  );
  await user.click(
    within(observed).getByRole("radio", {
      name: "有没有正常的主要动力输出？ 没有正常的主要动力输出",
    }),
  );
  await user.click(
    screen.getByRole("button", { name: ENGINE_COPY.observeSubmitExperiment }),
  );

  const comparison = await screen.findByTestId("engine-comparison");
  await user.click(within(comparison).getByRole("radio", { name: ENGINE_COPY.compareDifferent }));
  await user.click(screen.getByRole("button", { name: ENGINE_COPY.compareSubmit }));

  await user.type(
    screen.getByLabelText(ENGINE_COPY.reflectionA),
    "燃烧对发动机产生动力好像很重要。",
  );
  await user.click(screen.getByRole("button", { name: ENGINE_COPY.reflectionSubmit }));
}

describe("FourStrokeEngineLab Phase 4", () => {
  it("asks the physical question and does not show the energy model", async () => {
    mockReducedMotion();
    render(<FourStrokeEngineLab />);

    expect(
      await screen.findByRole("heading", { name: ENGINE_COPY.headline }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ENGINE_COPY.startCta })).toBeInTheDocument();
    expect(screen.getByTestId("four-stroke-engine")).toBeInTheDocument();

    for (const term of ENGINE_FORBIDDEN_REVEAL_TERMS) {
      expect(screen.queryByText(new RegExp(term))).not.toBeInTheDocument();
    }
    expect(screen.queryByText(/吸气冲程|压缩冲程|做功冲程|排气冲程/)).not.toBeInTheDocument();
  });

  it("shows the engine and does not complete OBSERVE from autoplay alone", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await startObserve(user);

    expect(screen.getByTestId("four-stroke-engine")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.play }));

    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.OBSERVE],
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("engine-observe-task")).toBeInTheDocument();
  });

  it("does not let a random single checkbox pass OBSERVE", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await startObserve(user);

    await user.click(screen.getByLabelText("有时进气门打开"));
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.observeSubmit }));

    expect(screen.getByText(ENGINE_COPY.observeNeedMore)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.OBSERVE],
      }),
    ).toBeInTheDocument();
  });

  it("does not let incorrect observations satisfy OBSERVE", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await startObserve(user);

    await user.click(screen.getByLabelText("每个阶段都会发生燃烧"));
    await user.click(screen.getByLabelText("活塞始终只向下运动"));
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.observeSubmit }));

    expect(screen.getByText(ENGINE_COPY.observeNeedMore)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.OBSERVE],
      }),
    ).toBeInTheDocument();
  });

  it("passes OBSERVE with piston and valve or combustion evidence", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await startObserve(user);
    await submitSufficientObservation(user);

    expect(screen.getByTestId("engine-describe-task")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeInTheDocument();
  });

  it("does not let a sentence alone pass DESCRIBE", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await startObserve(user);
    await submitSufficientObservation(user);

    await user.type(
      screen.getByLabelText(ENGINE_COPY.describeQuestion),
      "活塞向下运动，进气门打开，有气体进入。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.describeSubmit }));

    expect(screen.getByText(ENGINE_COPY.describeNeedStructure)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.DESCRIBE],
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("engine-predict-task")).not.toBeInTheDocument();
  });

  it("passes DESCRIBE into PREDICT without revealing the energy chain", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await reachPredict(user);

    expect(screen.getByTestId("engine-predict-task")).toBeInTheDocument();
    expect(
      screen.getAllByText(ENGINE_COPY.predictAQuestion).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByTestId("engine-run-experiment")).not.toBeInTheDocument();
    expect(screen.queryByText(/吸气冲程|做功冲程/)).not.toBeInTheDocument();
    for (const term of ENGINE_FORBIDDEN_REVEAL_TERMS) {
      expect(screen.queryByText(new RegExp(term))).not.toBeInTheDocument();
    }
  });

  it("cannot run the experiment before a committed prediction and reason", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await reachPredict(user);

    await user.click(screen.getByRole("button", { name: ENGINE_COPY.predictSubmit }));
    expect(screen.getByTestId("engine-predict-task")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.PREDICT],
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "不能产生主要动力" }));
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.predictSubmit }));
    expect(screen.getByText(ENGINE_COPY.predictNeedBoth)).toBeInTheDocument();
    expect(screen.queryByTestId("engine-run-experiment")).not.toBeInTheDocument();
  });

  it("lets 我现在还说不上来 continue without fabricating energy reasoning", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await reachPredict(user);

    await user.click(screen.getByRole("radio", { name: "不能产生主要动力" }));
    await user.click(screen.getByRole("radio", { name: ENGINE_COPY.reasonUnknown }));
    expect(screen.queryByLabelText(ENGINE_COPY.reasonLabel)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.predictSubmit }));

    expect(
      await screen.findByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXPERIMENT],
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("engine-run-experiment")).toBeEnabled();
    expect(screen.getByTestId("learner-workspace")).toBeInTheDocument();
  });

  it("accepts a wrong prediction and unlocks experiment A", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await reachPredict(user);

    await user.click(screen.getByRole("radio", { name: "还能产生主要动力" }));
    await user.click(screen.getByRole("radio", { name: ENGINE_COPY.reasonHasIdea }));
    await user.type(
      screen.getByLabelText(ENGINE_COPY.reasonLabel),
      "它还在转，所以应该还有主要动力。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.predictSubmit }));

    expect(
      await screen.findByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXPERIMENT],
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("engine-run-experiment")).toBeEnabled();
    expect(screen.getByText("还能产生主要动力")).toBeInTheDocument();
  });

  it("does not complete experiment A from running the intervention alone", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await reachPredict(user);
    await commitPredictionA(user);

    await user.click(screen.getByTestId("engine-run-experiment"));
    expect(await screen.findByTestId("engine-observed-result")).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COPY.motionHint)).toBeInTheDocument();
    expect(screen.queryByTestId("engine-comparison")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase4-end")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXPERIMENT],
      }),
    ).toBeInTheDocument();
  });

  it("closes both experiments with the five-part loop and continues to EXPLAIN", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    await reachPredict(user);
    await commitPredictionA(user);
    await closeExperimentA(user);

    expect(
      await screen.findByTestId("engine-predict-task"),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(ENGINE_COPY.predictBQuestion).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByLabelText(ENGINE_COPY.reasonLabel)).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "不能产生主要动力" }));
    await user.click(screen.getByRole("radio", { name: ENGINE_COPY.reasonHasIdea }));
    await user.type(
      screen.getByLabelText(ENGINE_COPY.reasonLabel),
      "活塞不能动，可能就没有正常输出。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.predictSubmit }));

    await user.click(await screen.findByTestId("engine-run-experiment"));
    const observed = await screen.findByTestId("engine-observed-result");
    await user.click(
      within(observed).getByRole("radio", { name: "有没有发生燃烧？ 有" }),
    );
    await user.click(
      within(observed).getByRole("radio", {
        name: "活塞有没有正常向下运动？ 没有",
      }),
    );
    await user.click(
      within(observed).getByRole("radio", { name: "动力输出是否成功？ 没有成功" }),
    );
    await user.click(
      screen.getByRole("button", { name: ENGINE_COPY.observeSubmitExperiment }),
    );
    const comparison = await screen.findByTestId("engine-comparison");
    await user.click(within(comparison).getByRole("radio", { name: ENGINE_COPY.compareDifferent }));
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.compareSubmit }));
    await user.type(
      screen.getByLabelText(ENGINE_COPY.reflectionB),
      "燃烧已经发生了，但活塞不能动，所以没有正常输出。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.reflectionSubmit }));

    expect(await screen.findByTestId("engine-explain-task")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXPLAIN],
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("engine-evidence-drawer")).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COPY.explainEvidenceA)).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COPY.explainEvidenceB)).toBeInTheDocument();
    expect(screen.getByText(ENGINE_COPY.explainLead)).toBeInTheDocument();
    expect(screen.queryByTestId("engine-phase4-end")).not.toBeInTheDocument();
    expect(screen.queryByTestId("engine-model-builder")).not.toBeInTheDocument();
    expect(screen.queryByText(/化学能\s*→\s*内能/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }),
    ).toBeInTheDocument();
  });

  it("keeps deterministic progression if the tutor API fails", async () => {
    mockReducedMotion();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("tutor unavailable"));
    const user = userEvent.setup();
    await startObserve(user);

    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }));
    expect(await screen.findByText(ENGINE_COPY.observePrompt)).toBeInTheDocument();

    await submitSufficientObservation(user);
    await fillCorrectSnapshots(user);
    await user.type(
      screen.getByLabelText(ENGINE_COPY.describeQuestion),
      "活塞向下运动，进气门打开。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.describeSubmit }));
    expect(
      await screen.findByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.PREDICT],
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.tutorAskAria }));
    await user.click(screen.getByRole("radio", { name: "不能产生主要动力" }));
    await user.click(screen.getByRole("radio", { name: ENGINE_COPY.reasonHasIdea }));
    await user.type(
      screen.getByLabelText(ENGINE_COPY.reasonLabel),
      "没有燃烧可能就没有主要动力。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.predictSubmit }));
    expect(await screen.findByTestId("engine-run-experiment")).toBeEnabled();
    fetchMock.mockRestore();
  });

  it("restores committed prediction before the experiment after remount", async () => {
    mockReducedMotion();
    const user = userEvent.setup();
    const view = render(<FourStrokeEngineLab />);
    expect(
      await screen.findByRole("heading", { name: ENGINE_COPY.headline }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.startCta }));
    await submitSufficientObservation(user);
    await fillCorrectSnapshots(user);
    await user.type(
      screen.getByLabelText(ENGINE_COPY.describeQuestion),
      "活塞向下运动，这里出现了燃烧。",
    );
    await user.click(screen.getByRole("button", { name: ENGINE_COPY.describeSubmit }));
    await commitPredictionA(user);
    await user.click(screen.getByTestId("engine-run-experiment"));
    expect(await screen.findByTestId("engine-observed-result")).toBeInTheDocument();

    view.unmount();
    resetSessionMemory();
    render(<FourStrokeEngineLab />);

    expect(
      await screen.findByRole("heading", {
        name: ENGINE_STAGE_PROMPTS[LearningStage.EXPERIMENT],
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("engine-prediction-locked")).toHaveTextContent(
      "不能产生主要动力",
    );
    expect(screen.getByTestId("engine-observed-result")).toBeInTheDocument();
    expect(screen.queryByTestId("engine-predict-task")).not.toBeInTheDocument();
  });

  it("does not put energy-model words in Phase 4 student copy", () => {
    const visible = JSON.stringify({
      copy: ENGINE_COPY,
      prompts: ENGINE_STAGE_PROMPTS,
      options: ENGINE_OBSERVE_OPTIONS,
    });
    for (const term of ENGINE_FORBIDDEN_REVEAL_TERMS) {
      expect(visible).not.toContain(term);
    }
  });
});
