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
    text: "一块面包被加热后，温度升高了。根据你刚才连起来的想法，下面哪一句最合适？",
    options: [
      "它的内能增加了。",
      "它的质量一定增加了。",
      "它变热是因为热量像东西一样储存在里面。",
      "温度升高了，所以同样温度的物体一定有相同的内能。",
    ],
    correctAnswer: "它的内能增加了。",
    targetConcepts: ["temperature", "internal energy", "energy transfer"],
    requiredCognitiveActions: ["C3", "C4", "C5", "C9"],
    misconceptionTargets: ["M01", "M06"],
    difficulty: "intro",
    reasoningPrompt: "用一两句话说说你为什么选它。",
    representationOptions: [
      "温度",
      "内能",
      "能量怎样传递",
      "几个量之间的关系",
    ],
    modelOptions: [
      "能量进入 → 内能变化 → 温度升高",
      "温度单独就能决定内能",
      "加热就意味着质量增加",
    ],
  },
  {
    id: "exam-q2",
    text: "下面哪一句一定正确？",
    options: [
      "更热的物体，内能一定比任何更凉的物体都大。",
      "物体吸收能量后，温度一定会马上升高。",
      "温度升高，可以说明内能可能发生了变化。",
      "温度升高，物体一定增加了质量。",
    ],
    correctAnswer: "温度升高，可以说明内能可能发生了变化。",
    targetConcepts: ["temperature", "internal energy", "conditions"],
    requiredCognitiveActions: ["C4", "C7", "C13"],
    misconceptionTargets: ["M02", "M03", "M06"],
    difficulty: "standard",
    reasoningPrompt: "为什么你选的这句话，比其他几句更站得住？",
    representationOptions: [
      "温度",
      "内能",
      "这句话的成立条件",
      "几个量之间的关系",
    ],
    modelOptions: [
      "看看哪句话一定能由刚才的想法推出来",
      "把温度和内能当成一回事",
      "只看物体摸起来热不热",
    ],
  },
  {
    id: "exam-q3",
    text: "下面哪种情况，内能变化主要是通过热传递发生的？",
    options: [
      "金属棒被反复敲打后变热。",
      "手贴着热水袋，渐渐变暖。",
      "金属丝反复弯折后变热。",
      "手变暖只是因为手在动。",
    ],
    correctAnswer: "手贴着热水袋，渐渐变暖。",
    targetConcepts: ["energy transfer", "mechanism", "temperature"],
    requiredCognitiveActions: ["C5", "C6", "C14"],
    misconceptionTargets: ["M04", "M09"],
    difficulty: "transfer",
    reasoningPrompt: "为什么你选的这个，更像热传递？",
    representationOptions: [
      "能量怎样传递",
      "温度",
      "能量怎样进入物体",
      "比较不同方式",
    ],
    modelOptions: [
      "比较能量是怎样进入物体的",
      "凡是变热都当成同一件事",
      "只看最后的温度",
    ],
  },
  {
    id: "exam-q4",
    text: "把一把热勺子放进较凉的水里。一开始通常会发生什么？",
    options: [
      "能量从勺子传到水。",
      "能量从水传到勺子。",
      "两边都是物体，所以没有能量传递。",
      "方向只取决于哪个物体质量更大。",
    ],
    correctAnswer: "能量从勺子传到水。",
    targetConcepts: ["energy transfer", "temperature difference", "direction"],
    requiredCognitiveActions: ["C5", "C7", "C14"],
    misconceptionTargets: ["M01", "M09"],
    difficulty: "standard",
    reasoningPrompt: "你是根据什么判断能量传递方向的？",
    representationOptions: [
      "能量怎样传递",
      "温度差",
      "变化的方向",
      "过程发生的条件",
    ],
    modelOptions: [
      "能量往往会从温度较高的一方传到温度较低的一方",
      "大的物体总会把能量传给小的物体",
      "方向只取决于储存了多少热",
    ],
  },
  {
    id: "exam-q5",
    text: "两种材料质量相同，都要使温度升高 10°C。材料 A 的比热容是材料 B 的两倍。谁需要的能量更多？",
    options: [
      "材料 A 需要更多能量。",
      "材料 B 需要更多能量。",
      "温度变化一样，所以需要的能量一样。",
      "题目没给质量，所以没法判断。",
    ],
    correctAnswer: "材料 A 需要更多能量。",
    targetConcepts: ["specific heat capacity", "controlled variables", "quantitative reasoning"],
    requiredCognitiveActions: ["C7", "C8", "C12"],
    misconceptionTargets: ["M03"],
    difficulty: "standard",
    reasoningPrompt: "用题目给出的条件，说说你为什么这样选。",
    representationOptions: [
      "比热容",
      "哪些量保持不变",
      "能量和温度变化的关系",
      "比较两个量",
    ],
    modelOptions: [
      "质量和温度变化相同，再比较材料本身的差别",
      "只看最后的温度",
      "先不管材料有什么不同",
    ],
  },
];

export const REQUIRED_EXAM_QUESTION_IDS = EXAM_QUESTIONS.map(
  (question) => question.id,
);
