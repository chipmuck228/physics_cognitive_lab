import { LEARNING_STAGE_ORDER, LearningStage } from "@/types/learning";

export const SCENE_ID = "microwave-bread" as const;

export const SCENE_COPY = {
  productName: "Physics Thinking Lab",
  headline: "Why does bread become hot in a microwave?",
  subheadline: "Let's investigate.",
  startCta: "Start",
  observeInstruction: "Start the microwave and watch what happens to the bread.",
  observeQuestion: "What did you observe?",
  observeSubmit: "Save observation",
  describeInstruction:
    "Now describe the change using physics language instead of everyday wording.",
  describeQuestion: "How would you describe the change in the bread?",
  describeSubmit: "Save description",
  describeNeedsPhysics:
    "That is a useful everyday observation. Now name the physical quantity and how it changed.",
  predictInstruction:
    "Before changing the conditions again, make a prediction and explain why.",
  predictQuestion:
    "If we heat the bread for longer, what do you predict will happen to its temperature?",
  predictSubmit: "Save prediction",
  experimentInstruction:
    "Change the heating conditions and test your prediction with the deterministic lab.",
  experimentCompareQuestion: "How does the actual result compare with your prediction?",
  experimentReflectionQuestion: "What did this experiment show you?",
  experimentSubmit: "Save comparison",
  experimentNeedNewRun:
    "Run a new experiment after your prediction. The first observation run does not count here.",
  explainInstruction:
    "Now explain why the bread's temperature increased. Focus on what changed physically.",
  explainQuestion: "Why did the bread's temperature increase?",
  explainSubmit: "Save explanation",
  modelInstruction:
    "Build the physical relationship. Choose what belongs between energy entering and temperature increasing.",
  modelSubmit: "Submit model",
  examInstruction:
    "You are now in Exam World. The microwave lab is hidden. First say what the question is about, then choose a model. Answer choices appear only after that.",
  examWorldLabel: "Exam World",
  examContinueToModel: "Continue to the model",
  examRevealChoices: "Reveal answer choices",
  aiOffBanner: "AI is now turned off.",
  aiOffInstruction:
    "Solve this one yourself. There are no hints, chat, or previous tutor messages on this page.",
  independentExplainSubmit: "Save independent explanation",
  independentExamIntro: "Now answer one exam-style question on your own.",
  independentExamSubmit: "Submit answer",
  completeTitle: "Physics Thinking",
  completeCaution:
    "These marks are a rough look at the traces you left in this session. They are not a score, and they do not mean you have mastered physics.",
  heatingCta: "Start heating",
  heatingInProgress: "Heating…",
  heatAgainCta: "Heat again",
  resetBreadCta: "Reset bread",
  heatingComplete: "Heating complete.",
  lastRun: "Last run",
  continueLater: "Observation and description come next. For now, watch the change.",
} as const;

export const STAGE_LABELS: Record<(typeof LEARNING_STAGE_ORDER)[number], string> = {
  [LearningStage.ENTRY]: "Begin",
  [LearningStage.OBSERVE]: "Observe",
  [LearningStage.DESCRIBE]: "Describe",
  [LearningStage.PREDICT]: "Predict",
  [LearningStage.EXPERIMENT]: "Experiment",
  [LearningStage.EXPLAIN]: "Explain",
  [LearningStage.MODEL]: "Model",
  [LearningStage.TRANSFER]: "Transfer",
  [LearningStage.EXAM]: "Exam",
  [LearningStage.AI_OFF]: "Independent",
  [LearningStage.COMPLETE]: "Reflect",
};

export const STAGE_PROMPTS: Partial<Record<(typeof LEARNING_STAGE_ORDER)[number], string>> = {
  [LearningStage.ENTRY]: SCENE_COPY.headline,
  [LearningStage.OBSERVE]: "What changes when the bread is heated?",
  [LearningStage.DESCRIBE]: "Describe the change in physics language.",
  [LearningStage.PREDICT]: "Make a prediction before the next experiment.",
  [LearningStage.EXPERIMENT]: "Test your prediction by changing the conditions.",
  [LearningStage.EXPLAIN]: "Explain why the temperature increased.",
  [LearningStage.MODEL]: "Build the physical model.",
  [LearningStage.TRANSFER]: "Transfer the model to a new situation.",
  [LearningStage.EXAM]: "Connect the model to an exam-style question.",
  [LearningStage.AI_OFF]: "AI is now turned off for the independent task.",
  [LearningStage.COMPLETE]: "Look back at the thinking you did.",
};

export const OBSERVATION_VOCAB = ["hotter", "warmer", "steam", "softer"] as const;

export const DESCRIPTION_VOCAB = [
  "bread",
  "temperature",
  "increased",
  "energy",
  "internal energy",
] as const;

export const EXPLANATION_VOCAB = [
  "energy",
  "entered",
  "bread",
  "internal energy",
  "temperature",
  "increased",
] as const;

export const PREDICTION_OPTIONS = [
  {
    value: "temperature increases",
    label: "The temperature increases.",
  },
  {
    value: "temperature stays about the same",
    label: "The temperature stays about the same.",
  },
  {
    value: "temperature decreases",
    label: "The temperature decreases.",
  },
  {
    value: "not sure",
    label: "I am not sure yet.",
  },
] as const;
