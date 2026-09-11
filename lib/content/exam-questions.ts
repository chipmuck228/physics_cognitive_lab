export interface ExamQuestionDefinition {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  targetConcepts: string[];
  requiredCognitiveActions: string[];
  misconceptionTargets: string[];
  difficulty: "intro" | "standard" | "transfer";
  reasoningPrompt: string;
  representationOptions: string[];
  modelOptions: string[];
}

export const EXAM_QUESTIONS: ExamQuestionDefinition[] = [
  {
    id: "exam-q1",
    text: "A piece of bread is heated and its temperature increases. Which statement is best supported by the model you built?",
    options: [
      "Its internal energy increased.",
      "Its mass must have increased.",
      "It became hot because heat is stored inside it like a substance.",
      "Its temperature increased, so every object at that temperature must have the same internal energy.",
    ],
    correctAnswer: "Its internal energy increased.",
    targetConcepts: ["temperature", "internal energy", "energy transfer"],
    requiredCognitiveActions: ["C3", "C4", "C5", "C9"],
    misconceptionTargets: ["M01", "M06"],
    difficulty: "intro",
    reasoningPrompt: "Give a short reason for your choice.",
    representationOptions: [
      "temperature",
      "internal energy",
      "energy transfer",
      "relationship between quantities",
    ],
    modelOptions: [
      "energy enters -> internal energy changes -> temperature increases",
      "temperature alone determines internal energy in every case",
      "heating always means mass increases",
    ],
  },
  {
    id: "exam-q2",
    text: "Which statement is always correct?",
    options: [
      "A hotter object must have more internal energy than any cooler object.",
      "If an object absorbs energy, its temperature must increase immediately.",
      "A temperature increase can be evidence that internal energy changed.",
      "If temperature increases, the object must have gained mass.",
    ],
    correctAnswer: "A temperature increase can be evidence that internal energy changed.",
    targetConcepts: ["temperature", "internal energy", "conditions"],
    requiredCognitiveActions: ["C4", "C7", "C13"],
    misconceptionTargets: ["M02", "M03", "M06"],
    difficulty: "standard",
    reasoningPrompt: "Why is your chosen statement safer than the others?",
    representationOptions: [
      "temperature",
      "internal energy",
      "conditions of a claim",
      "relationship between quantities",
    ],
    modelOptions: [
      "check which claims are always justified by the model",
      "assume temperature and internal energy are interchangeable",
      "focus only on whether the object feels hot",
    ],
  },
  {
    id: "exam-q3",
    text: "Which situation changes internal energy mainly through heat transfer?",
    options: [
      "A metal rod is hammered until it becomes warm.",
      "A hand becomes warmer while touching a hot-water bag.",
      "A wire becomes warm after repeated bending.",
      "Hands become warm only because they moved fast.",
    ],
    correctAnswer: "A hand becomes warmer while touching a hot-water bag.",
    targetConcepts: ["energy transfer", "mechanism", "temperature"],
    requiredCognitiveActions: ["C5", "C6", "C14"],
    misconceptionTargets: ["M04", "M09"],
    difficulty: "transfer",
    reasoningPrompt: "Explain why your choice matches heat transfer better than the others.",
    representationOptions: [
      "energy transfer",
      "temperature",
      "how energy enters a system",
      "comparison of mechanisms",
    ],
    modelOptions: [
      "compare the mechanism that moves energy into the object",
      "assume every warming process is the same",
      "look only at the final temperature",
    ],
  },
  {
    id: "exam-q4",
    text: "A hot spoon is placed in cooler water. What happens naturally at first?",
    options: [
      "Energy transfers from the spoon to the water.",
      "Energy transfers from the water to the spoon.",
      "No energy transfer happens because both are objects.",
      "The direction depends only on which object has more mass.",
    ],
    correctAnswer: "Energy transfers from the spoon to the water.",
    targetConcepts: ["energy transfer", "temperature difference", "direction"],
    requiredCognitiveActions: ["C5", "C7", "C14"],
    misconceptionTargets: ["M01", "M09"],
    difficulty: "standard",
    reasoningPrompt: "What tells you the direction of energy transfer here?",
    representationOptions: [
      "energy transfer",
      "temperature difference",
      "direction of change",
      "conditions of a process",
    ],
    modelOptions: [
      "energy tends to move from higher temperature to lower temperature",
      "the larger object always sends energy to the smaller object",
      "direction depends only on how much heat is stored",
    ],
  },
  {
    id: "exam-q5",
    text: "Two equal masses of different materials both need their temperature to rise by 10°C. Material A has twice the specific heat capacity of Material B. Which needs more energy?",
    options: [
      "Material A needs more energy.",
      "Material B needs more energy.",
      "They need the same energy because the temperature change is the same.",
      "There is not enough information because mass is missing.",
    ],
    correctAnswer: "Material A needs more energy.",
    targetConcepts: ["specific heat capacity", "controlled variables", "quantitative reasoning"],
    requiredCognitiveActions: ["C7", "C8", "C12"],
    misconceptionTargets: ["M03"],
    difficulty: "standard",
    reasoningPrompt: "Use the given conditions to explain your choice.",
    representationOptions: [
      "specific heat capacity",
      "controlled variables",
      "relationship between energy and temperature change",
      "quantitative reasoning",
    ],
    modelOptions: [
      "compare the variables while keeping mass and temperature change fixed",
      "focus only on the final temperature",
      "ignore the role of material properties",
    ],
  },
];

export const REQUIRED_EXAM_QUESTION_IDS = EXAM_QUESTIONS.map(
  (question) => question.id,
);
