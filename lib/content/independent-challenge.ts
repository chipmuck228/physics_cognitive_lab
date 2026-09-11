export const INDEPENDENT_EXPLANATION_ID = "metal-spoon";

export const INDEPENDENT_EXPLANATION = {
  id: INDEPENDENT_EXPLANATION_ID,
  situation:
    "A metal spoon is placed in hot water. After some time, the temperature of the spoon increases.",
  prompt: "Explain why.",
} as const;

export const INDEPENDENT_EXAM_QUESTION = {
  id: "independent-q1",
  text: "An iron nail becomes warmer in two situations: it is placed in hot water, and it is hammered many times. Which statement is most accurate?",
  options: [
    "Both situations must be the same kind of heat transfer.",
    "Both can raise temperature, but energy can enter the nail in different ways.",
    "Only the hot water can change the nail's internal energy.",
    "Hammering cannot change temperature because no heat is added.",
  ],
  correctAnswer:
    "Both can raise temperature, but energy can enter the nail in different ways.",
} as const;
