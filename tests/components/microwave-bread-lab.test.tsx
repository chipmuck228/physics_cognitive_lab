import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MicrowaveBreadLab } from "@/components/learning/MicrowaveBreadLab";
import { resetSessionMemory } from "@/lib/learning/session-store";

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

describe("MicrowaveBreadLab", () => {
  it("starts the investigation and runs the deterministic heating", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);

    expect(
      await screen.findByRole("heading", {
        name: "Why does bread become hot in a microwave?",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start the investigation" }));

    expect(
      screen.getByRole("heading", {
        name: "What changes when the bread is heated?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("20.0 °C")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start heating" }));

    await waitFor(() => {
      expect(screen.getByText("What did you observe?")).toBeInTheDocument();
      expect(screen.getAllByText("35.0 °C").length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText("500 W")).toBeInTheDocument();
    expect(screen.getByText("30 s")).toBeInTheDocument();
  });

  it("moves from observe to describe to predict to experiment", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);

    await user.click(
      await screen.findByRole("button", { name: "Start the investigation" }),
    );
    await user.click(screen.getByRole("button", { name: "Start heating" }));

    await screen.findByText("What did you observe?");
    await user.type(
      screen.getByLabelText("What did you observe?"),
      "The bread got hotter.",
    );
    await user.click(screen.getByRole("button", { name: "Save observation" }));

    expect(
      await screen.findByRole("heading", {
        name: "Describe the change in physics language.",
      }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText("How would you describe the change in the bread?"),
      "The temperature of the bread increased.",
    );
    await user.click(screen.getByRole("button", { name: "Save description" }));

    expect(
      await screen.findByRole("heading", {
        name: "Make a prediction before the next experiment.",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("radio", { name: "The temperature increases." }),
    );
    await user.type(
      screen.getByLabelText("Why do you think that will happen?"),
      "Longer heating should put more energy into the bread.",
    );
    await user.click(screen.getByRole("button", { name: "Save prediction" }));

    expect(
      await screen.findByRole("heading", {
        name: "Test your prediction by changing the conditions.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your prediction")).toBeInTheDocument();
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("continues through explanation, model building, transfer, and exam", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);

    await user.click(
      await screen.findByRole("button", { name: "Start the investigation" }),
    );
    await user.click(screen.getByRole("button", { name: "Start heating" }));
    await screen.findByText("What did you observe?");

    await user.type(
      screen.getByLabelText("What did you observe?"),
      "The bread got hotter.",
    );
    await user.click(screen.getByRole("button", { name: "Save observation" }));

    await user.type(
      screen.getByLabelText("How would you describe the change in the bread?"),
      "The temperature of the bread increased.",
    );
    await user.click(screen.getByRole("button", { name: "Save description" }));

    await user.click(
      screen.getByRole("radio", { name: "The temperature increases." }),
    );
    await user.type(
      screen.getByLabelText("Why do you think that will happen?"),
      "Longer heating should put more energy into the bread.",
    );
    await user.click(screen.getByRole("button", { name: "Save prediction" }));

    await user.click(screen.getByRole("button", { name: "Continue to explanation" }));

    expect(
      await screen.findByRole("heading", {
        name: "Explain why the temperature increased.",
      }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText("Why did the bread's temperature increase?"),
      "Energy entered the bread, so its internal energy changed and its temperature increased.",
    );
    await user.click(screen.getByRole("button", { name: "Save explanation" }));

    expect(
      await screen.findByRole("heading", {
        name: "Build the physical model.",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "internal energy changes" }));
    await user.click(screen.getByRole("button", { name: "Connect top to middle" }));
    await user.click(screen.getByRole("button", { name: "Connect middle to bottom" }));
    await user.click(screen.getByRole("button", { name: "Submit model" }));

    expect(
      await screen.findByRole("heading", {
        name: "Transfer the model to a new situation.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hot-water bag")).toBeInTheDocument();

    await user.type(
      screen.getByLabelText("Your explanation"),
      "Energy moves into the hand, so the hand becomes warmer.",
    );
    await user.click(screen.getByRole("button", { name: "Save transfer response" }));

    expect(await screen.findByText("Rubbing hands")).toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Your explanation"),
      "Energy is transferred during the rubbing, so the hands become warm.",
    );
    await user.click(screen.getByRole("button", { name: "Save transfer response" }));

    expect(await screen.findByText("Electric kettle")).toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Your explanation"),
      "Energy enters the water and its temperature increases.",
    );
    await user.click(screen.getByRole("button", { name: "Save transfer response" }));

    expect(
      await screen.findByRole("heading", {
        name: "Connect the model to an exam-style question.",
      }),
    ).toBeInTheDocument();

    await answerExamQuestion(user, {
      representation: "internal energy",
      model:
        "energy enters -> internal energy changes -> temperature increases",
      answer: "Its internal energy increased.",
      reasoning:
        "Energy entered the bread, so its internal energy increased and the temperature rose.",
    });

    expect(await screen.findByText(/Which statement is always correct/)).toBeInTheDocument();

    await answerExamQuestion(user, {
      representation: "conditions of a claim",
      model: "check which claims are always justified by the model",
      answer: "A temperature increase can be evidence that internal energy changed.",
      reasoning:
        "That statement is cautious because it connects temperature and internal energy without claiming too much.",
    });

    await answerExamQuestion(user, {
      representation: "energy transfer",
      model: "compare the mechanism that moves energy into the object",
      answer: "A hand becomes warmer while touching a hot-water bag.",
      reasoning:
        "Energy enters the hand from the hot-water bag through heat transfer.",
    });

    await answerExamQuestion(user, {
      representation: "temperature difference",
      model:
        "energy tends to move from higher temperature to lower temperature",
      answer: "Energy transfers from the spoon to the water.",
      reasoning:
        "The spoon starts hotter, so energy transfers toward the cooler water.",
    });

    await answerExamQuestion(user, {
      representation: "specific heat capacity",
      model:
        "compare the variables while keeping mass and temperature change fixed",
      answer: "Material A needs more energy.",
      reasoning:
        "With the same mass and the same temperature rise, the larger specific heat capacity needs more energy.",
    });

    expect(
      await screen.findByRole("heading", {
        name: "AI is now turned off for the independent task.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("AI is now turned off.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Ask the coach one question" }),
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByLabelText("Explain why."),
      "Energy entered the spoon from the hot water, so the spoon's temperature increased.",
    );
    await user.click(
      screen.getByRole("button", { name: "Save independent explanation" }),
    );

    await user.click(
      screen.getByRole("radio", {
        name: "Both can raise temperature, but energy can enter the nail in different ways.",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Submit independent exam answer" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Look back at the thinking you did.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Physics Thinking")).toBeInTheDocument();
    expect(screen.getByText(/not a score/i)).toBeInTheDocument();
    expect(screen.getByText(/do not mean you have mastered physics/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Ask the coach one question" }),
    ).not.toBeInTheDocument();
  });

  it("restores the current stage after a refresh", async () => {
    mockReducedMotion();
    const user = userEvent.setup();

    const first = render(<MicrowaveBreadLab />);
    await user.click(
      await screen.findByRole("button", { name: "Start the investigation" }),
    );
    expect(
      screen.getByRole("heading", {
        name: "What changes when the bread is heated?",
      }),
    ).toBeInTheDocument();
    first.unmount();
    resetSessionMemory();

    render(<MicrowaveBreadLab />);

    expect(
      await screen.findByRole("heading", {
        name: "What changes when the bread is heated?",
      }),
    ).toBeInTheDocument();
  });

  it("does not request a tutor API during Phase A", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();

    render(<MicrowaveBreadLab />);
    await user.click(
      await screen.findByRole("button", { name: "Start the investigation" }),
    );

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

async function answerExamQuestion(
  user: ReturnType<typeof userEvent.setup>,
  input: {
    representation: string;
    model: string;
    answer: string;
    reasoning: string;
  },
) {
  await user.click(screen.getByRole("radio", { name: input.representation }));
  await user.click(screen.getByRole("radio", { name: input.model }));
  await user.click(screen.getByRole("radio", { name: input.answer }));
  await user.type(screen.getByLabelText(/4\./), input.reasoning);
  await user.click(screen.getByRole("button", { name: "Save exam response" }));
}
