import { expect, type Page } from "@playwright/test";

export const LAB_PATH = "/scenes/microwave-bread";

export async function openLab(page: Page) {
  await page.goto(LAB_PATH);
  await expect(
    page.getByRole("heading", {
      name: "Why does bread become hot in a microwave?",
    }),
  ).toBeVisible();
}

export async function startLesson(page: Page) {
  await page.getByRole("button", { name: "Start the investigation", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "What changes when the bread is heated?",
    }),
  ).toBeVisible();
}

export async function completeObserve(page: Page) {
  await page.getByRole("button", { name: "Start heating" }).click();
  await expect(page.getByText("What did you observe?")).toBeVisible();
  await page.getByLabel("What did you observe?").fill("The bread got hotter.");
  await page.getByRole("button", { name: "Save observation" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Describe the change in physics language.",
    }),
  ).toBeVisible();
}

export async function completeDescribe(page: Page) {
  await page
    .getByLabel("How would you describe the change in the bread?")
    .fill("The temperature of the bread increased.");
  await page.getByRole("button", { name: "Save description" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Make a prediction before the next experiment.",
    }),
  ).toBeVisible();
}

export async function completePredict(page: Page) {
  await page.getByRole("radio", { name: "The temperature increases." }).click();
  await page
    .getByLabel("Why do you think that will happen?")
    .fill("Longer heating should put more energy into the bread.");
  await page.getByRole("button", { name: "Save prediction" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Test your prediction by changing the conditions.",
    }),
  ).toBeVisible();
}

export async function completeExperiment(page: Page) {
  await expect(
    page.getByRole("button", { name: "Continue to explanation" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Heat again" }).click();
  await expect(
    page.getByLabel("How does the actual result compare with your prediction?"),
  ).toBeVisible();
  await page
    .getByLabel("How does the actual result compare with your prediction?")
    .fill("The temperature rose again, matching my prediction.");
  await page
    .getByLabel("What did this experiment show you?")
    .fill("A repeated run added more energy and the bread got hotter.");
  await page.getByRole("button", { name: "Save comparison" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Explain why the temperature increased.",
    }),
  ).toBeVisible();
}

export async function completeExplain(page: Page) {
  await page
    .getByLabel("Why did the bread's temperature increase?")
    .fill(
      "Energy entered the bread, so its internal energy changed and its temperature increased.",
    );
  await page.getByRole("button", { name: "Save explanation" }).click();
  await expect(
    page.getByRole("heading", { name: "Build the physical model." }),
  ).toBeVisible();
}

export async function completeModel(page: Page) {
  await page.getByRole("button", { name: "internal energy changes" }).click();
  await page.getByRole("button", { name: "Connect top to middle" }).click();
  await page.getByRole("button", { name: "Connect middle to bottom" }).click();
  await page.getByRole("button", { name: "Submit model" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Transfer the model to a new situation.",
    }),
  ).toBeVisible();
}

export async function completeTransfer(page: Page) {
  await page
    .getByLabel("Your explanation")
    .fill("Energy moves into the hand, so the hand becomes warmer.");
  await page.getByRole("button", { name: "Save transfer response" }).click();

  await expect(page.getByRole("heading", { name: "Rubbing hands" })).toBeVisible();
  await page
    .getByLabel("Your explanation")
    .fill("Energy is transferred during the rubbing, so the hands become warm.");
  await page.getByRole("button", { name: "Save transfer response" }).click();

  await expect(page.getByRole("heading", { name: "Electric kettle" })).toBeVisible();
  await page
    .getByLabel("Your explanation")
    .fill("Energy enters the water and its temperature increases.");
  await page.getByRole("button", { name: "Save transfer response" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Connect the model to an exam-style question.",
    }),
  ).toBeVisible();
}

export async function answerExamQuestion(
  page: Page,
  input: {
    representation: string;
    model: string;
    answer: string;
    reasoning: string;
  },
) {
  await expect(page.getByText("Choose your answer.")).toHaveCount(0);
  await page.getByRole("radio", { name: input.representation }).click();
  await page.getByRole("button", { name: "Continue to the model" }).click();
  await page.getByRole("radio", { name: input.model }).click();
  await expect(page.getByText("Choose your answer.")).toHaveCount(0);
  await page.getByRole("button", { name: "Reveal answer choices" }).click();
  await page.getByRole("radio", { name: input.answer }).click();
  await page.getByLabel(/4\./).fill(input.reasoning);
  await page.getByRole("button", { name: "Save exam response" }).click();
}

export async function completeExam(page: Page) {
  await expect(page.getByLabel("Microwave oven with a slice of bread")).toHaveCount(
    0,
  );

  await answerExamQuestion(page, {
    representation: "internal energy",
    model: "energy enters -> internal energy changes -> temperature increases",
    answer: "Its internal energy increased.",
    reasoning:
      "Energy entered the bread, so its internal energy increased and the temperature rose.",
  });

  await answerExamQuestion(page, {
    representation: "conditions of a claim",
    model: "check which claims are always justified by the model",
    answer: "A temperature increase can be evidence that internal energy changed.",
    reasoning:
      "That statement is cautious because it connects temperature and internal energy without claiming too much.",
  });

  await answerExamQuestion(page, {
    representation: "energy transfer",
    model: "compare the mechanism that moves energy into the object",
    answer: "A hand becomes warmer while touching a hot-water bag.",
    reasoning: "Energy enters the hand from the hot-water bag through heat transfer.",
  });

  await answerExamQuestion(page, {
    representation: "temperature difference",
    model: "energy tends to move from higher temperature to lower temperature",
    answer: "Energy transfers from the spoon to the water.",
    reasoning:
      "The spoon starts hotter, so energy transfers toward the cooler water.",
  });

  await answerExamQuestion(page, {
    representation: "specific heat capacity",
    model: "compare the variables while keeping mass and temperature change fixed",
    answer: "Material A needs more energy.",
    reasoning:
      "With the same mass and the same temperature rise, the larger specific heat capacity needs more energy.",
  });

  await expect(
    page.getByRole("heading", {
      name: "AI is now turned off for the independent task.",
    }),
  ).toBeVisible();
}

export async function completeIndependentAssessment(page: Page) {
  await page
    .getByLabel("Explain why.")
    .fill(
      "Energy entered the spoon from the hot water, so the spoon's temperature increased.",
    );
  await page.getByRole("button", { name: "Save independent explanation" }).click();
  await page
    .getByRole("radio", {
      name: "Both can raise temperature, but energy can enter the nail in different ways.",
    })
    .click();
  await page.getByRole("button", { name: "Submit independent exam answer" }).click();
  await expect(
    page.getByRole("heading", { name: "Look back at the thinking you did." }),
  ).toBeVisible();
}
