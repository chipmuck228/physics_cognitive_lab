import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MicrowaveBreadLab } from "@/components/learning/MicrowaveBreadLab";
import { energyInternalEnergyTemperatureAssessmentOverlay } from "@/content/physics-models/energy-internal-energy-temperature/assessment-overlay";
import { examPatterns } from "@/content/physics-models/energy-internal-energy-temperature/exam";
import { independentChallenges } from "@/content/physics-models/energy-internal-energy-temperature/independent-challenges";
import { PRODUCTION_EXAM_PATTERN_IDS } from "@/content/physics-models/energy-internal-energy-temperature/implementation-contract";
import {
  MICROWAVE_CHANGE_OPTIONS,
  MICROWAVE_EXPLAIN_ENERGY_OPTIONS,
  MICROWAVE_EXPLAIN_LINK_OPTIONS,
  MICROWAVE_MODEL_CONDITION_OPTIONS,
  MICROWAVE_MODEL_DISTINCTION_OPTIONS,
  MICROWAVE_MODEL_ENERGY_OPTIONS,
  MICROWAVE_MODEL_INTERNAL_OPTIONS,
  MICROWAVE_MODEL_SYSTEM_OPTIONS,
  MICROWAVE_MODEL_TEMPERATURE_OPTIONS,
  MICROWAVE_OBJECT_OPTIONS,
  MICROWAVE_OBSERVE_OPTIONS,
  MICROWAVE_QUANTITY_OPTIONS,
  MICROWAVE_TASK_COPY,
  MICROWAVE_TRANSFER_RELATIONS,
  SCENE_COPY,
  STAGE_PROMPTS,
} from "@/lib/content/microwave-bread";
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

async function completeObserve(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: SCENE_COPY.heatingCta }));
  await screen.findByText(SCENE_COPY.observeQuestion);
  await user.click(
    screen.getByRole("radio", { name: MICROWAVE_OBSERVE_OPTIONS[0].label }),
  );
  await user.type(
    screen.getByLabelText(SCENE_COPY.observePrompt),
    "面包摸起来更热了。",
  );
  await user.click(screen.getByRole("button", { name: SCENE_COPY.observeSubmit }));
  expect(
    await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.DESCRIBE] }),
  ).toBeInTheDocument();
}

async function completeDescribe(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: MICROWAVE_OBJECT_OPTIONS[0].label }));
  await user.click(screen.getByRole("radio", { name: MICROWAVE_QUANTITY_OPTIONS[0].label }));
  await user.click(screen.getByRole("radio", { name: MICROWAVE_CHANGE_OPTIONS[0].label }));
  await user.type(
    screen.getByLabelText(SCENE_COPY.describeQuestion),
    "面包的温度升高了。",
  );
  await user.click(screen.getByRole("button", { name: SCENE_COPY.describeSubmit }));
  expect(
    await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.PREDICT] }),
  ).toBeInTheDocument();
}

async function completePredict(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: "温度会升高。" }));
  await user.type(
    screen.getByLabelText(SCENE_COPY.whyGuess),
    "加热更久，进入面包的能量会更多。",
  );
  await user.click(screen.getByRole("button", { name: SCENE_COPY.predictSubmit }));
  expect(
    await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
  ).toBeInTheDocument();
}

async function completeExperiment(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: SCENE_COPY.heatAgainCta }));
  await screen.findByText(SCENE_COPY.experimentReflectionQuestion);
  await user.click(screen.getByRole("radio", { name: "和我猜的一样。" }));
  await user.type(
    screen.getByLabelText(SCENE_COPY.experimentReflectionQuestion),
    "再做一次后，能量更多，面包更热。",
  );
  await user.click(screen.getByRole("button", { name: SCENE_COPY.experimentSubmit }));
  expect(
    await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.EXPLAIN] }),
  ).toBeInTheDocument();
}

async function judgeTransfer(
  user: ReturnType<typeof userEvent.setup>,
  relationIndex: number,
  judgment: "applies" | "not-necessarily",
) {
  const relation = MICROWAVE_TRANSFER_RELATIONS[relationIndex];
  const suffix = judgment === "applies" ? "在这里还能用" : "不能原样搬过来";
  await user.click(screen.getByRole("radio", { name: `${relation.label}：${suffix}` }));
}

async function answerExamQuestion(
  user: ReturnType<typeof userEvent.setup>,
  input: {
    representation: string;
    model: string;
    answer: string;
    reasoning: string;
    reasoningPrompt: string;
  },
) {
  expect(screen.queryByText(SCENE_COPY.examChoose)).not.toBeInTheDocument();
  await user.click(screen.getByRole("radio", { name: input.representation }));
  await user.click(screen.getByRole("button", { name: SCENE_COPY.examContinueToModel }));
  await user.click(screen.getByRole("radio", { name: input.model }));
  expect(screen.queryByText(SCENE_COPY.examChoose)).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: SCENE_COPY.examRevealChoices }));
  await user.click(screen.getByRole("radio", { name: input.answer }));
  await user.type(screen.getByLabelText(input.reasoningPrompt), input.reasoning);
  await user.click(screen.getByRole("button", { name: SCENE_COPY.examSave }));
}

describe("MicrowaveBreadLab", () => {
  it("starts the investigation and runs the deterministic heating", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);

    expect(
      await screen.findByRole("heading", { name: SCENE_COPY.headline }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: STUDENT_CHROME.startAria }));

    expect(
      screen.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.OBSERVE] }),
    ).toBeInTheDocument();
    expect(screen.getByText("20.0 °C")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: SCENE_COPY.heatingCta }));

    await waitFor(() => {
      expect(screen.getByText(SCENE_COPY.observeQuestion)).toBeInTheDocument();
      expect(screen.getAllByText("35.0 °C").length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText("500 W")).toBeInTheDocument();
    expect(screen.getByText("30 s")).toBeInTheDocument();
  });

  it("rejects everyday heat-only describe text and then advances with the L2 triple", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);

    await user.click(
      await screen.findByRole("button", { name: STUDENT_CHROME.startAria }),
    );
    await completeObserve(user);

    await user.type(screen.getByLabelText(SCENE_COPY.describeQuestion), "变热了");
    await user.click(screen.getByRole("button", { name: SCENE_COPY.describeSubmit }));

    expect(await screen.findByText(MICROWAVE_TASK_COPY.describeNeedStructure)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.DESCRIBE] }),
    ).toBeInTheDocument();

    await completeDescribe(user);

    await user.click(screen.getByRole("radio", { name: "温度会升高。" }));
    await user.type(
      screen.getByLabelText(SCENE_COPY.whyGuess),
      "加热更久，进入面包的能量会更多。",
    );
    await user.click(screen.getByRole("button", { name: SCENE_COPY.predictSubmit }));

    expect(
      await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.EXPERIMENT] }),
    ).toBeInTheDocument();
    expect(screen.getByText(SCENE_COPY.yourGuess)).toBeInTheDocument();
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("continues through explanation, model building, kettle-ice transfer, exam, and AI_OFF", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);

    await user.click(
      await screen.findByRole("button", { name: STUDENT_CHROME.startAria }),
    );
    await completeObserve(user);
    await completeDescribe(user);
    await completePredict(user);

    expect(
      screen.queryByRole("button", { name: SCENE_COPY.continueToWhy }),
    ).not.toBeInTheDocument();

    await completeExperiment(user);

    await user.click(
      screen.getByRole("radio", { name: MICROWAVE_EXPLAIN_ENERGY_OPTIONS[0].label }),
    );
    await user.click(
      screen.getByRole("radio", { name: MICROWAVE_EXPLAIN_LINK_OPTIONS[1].label }),
    );
    await user.type(
      screen.getByLabelText(SCENE_COPY.explainQuestion),
      "能量进入面包后，面包的内能发生了变化，温度升高。",
    );
    await user.click(screen.getByRole("button", { name: SCENE_COPY.explainSubmit }));

    expect(
      await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.MODEL] }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("radio", { name: MICROWAVE_MODEL_SYSTEM_OPTIONS[0].label }),
    );
    await user.click(
      screen.getByRole("radio", { name: MICROWAVE_MODEL_ENERGY_OPTIONS[0].label }),
    );
    await user.click(
      screen.getByRole("radio", { name: MICROWAVE_MODEL_INTERNAL_OPTIONS[0].label }),
    );
    await user.click(
      screen.getByRole("radio", { name: MICROWAVE_MODEL_TEMPERATURE_OPTIONS[0].label }),
    );
    await user.click(
      screen.getByRole("radio", { name: MICROWAVE_MODEL_DISTINCTION_OPTIONS[0].label }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: MICROWAVE_MODEL_CONDITION_OPTIONS[0].label }),
    );
    await user.type(
      screen.getByLabelText(MICROWAVE_TASK_COPY.modelAuthoredLabel),
      "温度不是内能。",
    );
    await user.click(screen.getByRole("button", { name: SCENE_COPY.modelSubmit }));

    expect(
      await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.TRANSFER] }),
    ).toBeInTheDocument();
    expect(screen.getByText(MICROWAVE_TASK_COPY.kettleQuestion)).toBeInTheDocument();
    expect(screen.queryByText("搓手")).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "壶里的水" }));
    await user.click(
      screen.getByRole("radio", { name: "可以。这是普通加热，没有物态变化。" }),
    );
    await judgeTransfer(user, 0, "applies");
    await judgeTransfer(user, 1, "applies");
    await judgeTransfer(user, 2, "not-necessarily");
    await judgeTransfer(user, 3, "applies");
    await user.type(
      screen.getByLabelText(SCENE_COPY.yourTake),
      "能量进入壶里的水，水的内能增加，没有物态变化，所以温度升高。",
    );
    await user.click(screen.getByRole("button", { name: SCENE_COPY.saveSituation }));

    expect(await screen.findByText(MICROWAVE_TASK_COPY.iceQuestion)).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "可以有能量进入。" }));
    await user.click(screen.getByRole("radio", { name: "内能或状态仍可以改变。" }));
    await user.click(
      screen.getByRole("radio", { name: "不能原样搬过来，因为条件不一样。" }),
    );
    await judgeTransfer(user, 0, "applies");
    await judgeTransfer(user, 1, "not-necessarily");
    await judgeTransfer(user, 2, "applies");
    await judgeTransfer(user, 3, "applies");
    await user.type(
      screen.getByLabelText(SCENE_COPY.yourTake),
      "能量还可以进入冰块，内能或状态可以变，但温度不一定升高。",
    );
    await user.click(screen.getByRole("button", { name: SCENE_COPY.saveSituation }));

    expect(
      await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.EXAM] }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(SCENE_COPY.microwaveAria)).not.toBeInTheDocument();
    expect(screen.getByText(SCENE_COPY.examNotice)).toBeInTheDocument();

    for (const id of PRODUCTION_EXAM_PATTERN_IDS) {
      const pattern = examPatterns.find((item) => item.id === id);
      const overlay = energyInternalEnergyTemperatureAssessmentOverlay.exam?.[id];
      if (!pattern || !overlay) {
        throw new Error(`Missing exam pattern ${id}`);
      }
      await answerExamQuestion(user, {
        representation: overlay.intendedRepresentation,
        model: overlay.intendedModel,
        answer: pattern.correctAnswer,
        reasoning: `${pattern.requiredReasoning.join("，")}。`,
        reasoningPrompt: pattern.reasoningPrompt,
      });
    }

    expect(
      await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.AI_OFF] }),
    ).toBeInTheDocument();
    expect(screen.getByText(SCENE_COPY.aiOffBanner)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria }),
    ).not.toBeInTheDocument();

    for (const challenge of independentChallenges) {
      expect(screen.getByText(challenge.question)).toBeInTheDocument();
      const overlay =
        energyInternalEnergyTemperatureAssessmentOverlay.independent?.[challenge.id];
      const correct = overlay?.judgments.find((item) => item.correct);
      if (!correct || !overlay) {
        throw new Error(`Missing overlay for ${challenge.id}`);
      }
      await user.click(screen.getByRole("radio", { name: correct.label }));
      if (challenge.id === "ai-off-unfamiliar-metal-spoon") {
        await user.click(screen.getByRole("radio", { name: "有能量进入勺子。" }));
        await user.click(screen.getByRole("radio", { name: "勺子的内能发生了变化。" }));
        await user.click(
          screen.getByRole("radio", {
            name: "温度升高是可以观察的结果，不是内能的另一个名字。",
          }),
        );
        await user.click(screen.getByRole("radio", { name: "热不是装在勺子里的东西。" }));
        await user.type(
          screen.getByLabelText(SCENE_COPY.yourIndependentWhy),
          "能量进入勺子，勺子的内能改变，温度升高。温度不是内能，热不是装在勺子里的东西。",
        );
      } else {
        await user.click(screen.getByRole("radio", { name: "仍然可以有能量进入。" }));
        await user.click(screen.getByRole("radio", { name: "能量进入，温度不一定升高。" }));
        await user.click(
          screen.getByRole("radio", {
            name: "不能。温度几乎不变，不能直接写成内能一定不变。",
          }),
        );
        await user.type(
          screen.getByLabelText(SCENE_COPY.yourIndependentWhy),
          "能量还可以进入冰块，内能或状态可以变，但温度不一定升高。",
        );
      }
      await user.click(
        screen.getByRole("button", { name: SCENE_COPY.independentExplainSubmit }),
      );
      const postCheck = await screen.findByTestId("microwave-ai-off-post-check");
      for (const option of overlay.postCheck) {
        if (option.required && !option.distractor) {
          await user.click(within(postCheck).getByText(option.label));
        }
      }
      await user.click(
        screen.getByRole("button", { name: SCENE_COPY.independentExamSubmit }),
      );
    }

    expect(
      await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.COMPLETE] }),
    ).toBeInTheDocument();
    expect(screen.getByText(SCENE_COPY.completeTitle)).toBeInTheDocument();
    expect(screen.getByText(/不是分数/)).toBeInTheDocument();
    expect(screen.getByText(/不表示你已经学会了物理/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: STUDENT_CHROME.tutorAskAria }),
    ).not.toBeInTheDocument();
  }, 15_000);

  it("restores the current stage after a refresh", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    const first = render(<MicrowaveBreadLab />);
    await user.click(
      await screen.findByRole("button", { name: STUDENT_CHROME.startAria }),
    );
    expect(
      screen.getByRole("heading", { name: STAGE_PROMPTS[LearningStage.OBSERVE] }),
    ).toBeInTheDocument();
    first.unmount();
    resetSessionMemory();

    render(<MicrowaveBreadLab />);

    expect(
      await screen.findByRole("heading", { name: STAGE_PROMPTS[LearningStage.OBSERVE] }),
    ).toBeInTheDocument();
  });

  it("does not request a tutor API during Phase A", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);
    await user.click(
      await screen.findByRole("button", { name: STUDENT_CHROME.startAria }),
    );

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
