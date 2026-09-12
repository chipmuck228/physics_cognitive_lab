import { LearningStage } from "@/types/learning";
import {
  OHMS_EXPERIMENT_A,
  OHMS_EXPERIMENT_B,
  type OhmsExperimentId,
} from "@/lib/physics/simple-resistor-circuit";

export const OHMS_COPY = {
  productName: "物理认知实验室",
  landingKicker: "场景 06",
  landingTitle: "一个电阻上的电流、电压和电阻",
  landingBody:
    "先看一条只含一个电阻的电路。电压变了或电阻变了，电流会怎样？不要先背公式。",
  landingCta: "开始这条电路",
  sceneTitle: "一个电阻的电路",
  currentLabel: "电流 I",
  voltageLabel: "电压 U",
  resistanceLabel: "电阻 R",
  currentUnit: "A",
  voltageUnit: "V",
  resistanceUnit: "Ω",
  sourceVoltageLabel: "电源电压",
  resistorVoltageLabel: "电阻两端电压 U",
  closedLabel: "电路闭合",
  openLabel: "电路断开",
  resistorGraphic: "一段电阻",
  leftCircuit: "左边",
  rightCircuit: "右边",
  sameRCaption: "电阻相同，电压不同",
  sameUCaption: "电压相同，电阻不同",
  observeCaption: "先看这两条闭合电路",
  modelFrozenCaption: "这是刚才电路关系的静止图，不是正在做的实验。",
  startLesson: "开始观察",
  continue: "继续",
  submit: "提交",
  tryAgain: "再改一改",
  blockedNeedMore: "还没有写完。先把下面标出的问题补上。",
  playDemo: "看一次读数",
  pauseDemo: "停一下",
  openSwitchDemo: "断开电路看一看",
  closeSwitchDemo: "再闭合电路",
  observePrompt: "你看见了什么？把对的都勾上。",
  observeSubmit: "记下我看见的",
  observeNeedMore: "这三项都要勾上，才能继续。",
  describeInstruction: "用自己的话说清楚：你看见了哪几个量，哪个大小不同。",
  describeObject: "你在看什么？",
  describeQuantities: "你看见了哪几个量？",
  describeChange: "两边有什么不同？",
  describeQuestion: "再用一句话写下来。",
  describeSubmit: "记下我的说法",
  describeNeedStructure: "先把三个问题和一句话都写上。",
  predictInstruction: "先猜电流会怎样，再写下理由。先不要看读数。",
  reasonLabel: "为什么这样想？",
  reasonPlaceholder: "先说清哪个量没变。",
  predictSubmit: "先记下我的猜测",
  predictNeedBoth: "先选电流会怎样，再写理由。",
  predictLocked: "你已经记下猜测",
  runExperiment: "对照读数",
  runNeedPrediction: "先写下猜测，才能对照读数。",
  observeSubmitExperiment: "记下我看见的读数",
  heldQuantityQuestion: "这次比较时，哪个量可以看成没变？",
  currentChangeQuestion: "电流怎样变了？",
  compareQuestion: "和你刚才猜的比一比",
  compareSubmit: "记下这次对照",
  reflectionSubmit: "记下这次想法",
  explainOwnWords: "用自己的话写一次比较。",
  explainSubmit: "记下我的说明",
  modelSubmit: "提交关系",
  transferApplies: "还能用",
  transferNotNecessarily: "不能直接搬过来",
  transferSurfaceCue: "也是电路，所以还是 I = U / R",
  transferOwnWords: "用自己的话说明这个新情境。",
  transferSubmit: "提交这次判断",
  transferNeedMore: "先判断哪些还能用，再写出哪个量不变、电流怎样。",
  transferFullQuestion: "换了样子，刚才的关系还能不能用？",
  transferBoundaryQuestion: "这里哪些还能用？哪些不能直接搬？",
  filamentRQuestion: "灯丝明显更热时，电阻还能看成不变吗？",
  filamentProportionQuestion: "还能不能说电压加倍，电流一定加倍？",
} as const;

export const OHMS_STAGE_LABELS: Record<LearningStage, string> = {
  [LearningStage.ENTRY]: "开始",
  [LearningStage.OBSERVE]: "看一看",
  [LearningStage.DESCRIBE]: "说清楚",
  [LearningStage.PREDICT]: "先猜一猜",
  [LearningStage.EXPERIMENT]: "动手比一比",
  [LearningStage.EXPLAIN]: "试着说明",
  [LearningStage.MODEL]: "写出关系",
  [LearningStage.TRANSFER]: "换个样子",
  [LearningStage.EXAM]: "题目",
  [LearningStage.AI_OFF]: "自己做",
  [LearningStage.COMPLETE]: "结束",
};

export const OHMS_STAGE_PROMPTS: Record<LearningStage, string> = {
  [LearningStage.ENTRY]: "一条只含一个电阻的电路。电压或电阻变了，电流会怎样？",
  [LearningStage.OBSERVE]: "先看读数。电流、电压、电阻是不是一回事？开关断开时哪个量变成零？",
  [LearningStage.DESCRIBE]: "用自己的话说：你看见了哪几个量？哪个大小不同？",
  [LearningStage.PREDICT]: "先猜电流会怎样，再写下理由。先不要看结果。",
  [LearningStage.EXPERIMENT]: "比一比。先说清哪个量没变，再看电流。",
  [LearningStage.EXPLAIN]: "用一次比较说明：保持哪个量不变时，电流怎样变？",
  [LearningStage.MODEL]: "在同一块板上写出电流、电压和电阻怎样一起变。再用一句话说明。",
  [LearningStage.TRANSFER]: "换了样子还能不能用刚才的关系？哪里不能直接搬？",
  [LearningStage.EXAM]: "先判断题目在考什么，再选用你学过的关系，最后作答。",
  [LearningStage.AI_OFF]: "没有提示。自己用刚才的关系说明。",
  [LearningStage.COMPLETE]: "这条电路先到这里。下面的小结不是“已经学会了”。",
};

export const OHMS_PHASE_STAGES = [
  LearningStage.OBSERVE,
  LearningStage.DESCRIBE,
  LearningStage.PREDICT,
  LearningStage.EXPERIMENT,
  LearningStage.EXPLAIN,
  LearningStage.MODEL,
  LearningStage.TRANSFER,
  LearningStage.EXAM,
  LearningStage.AI_OFF,
] as const;

export const OHMS_FOOTER: Record<LearningStage, string> = {
  [LearningStage.ENTRY]: "",
  [LearningStage.OBSERVE]: "先看读数，再勾出你看见的。",
  [LearningStage.DESCRIBE]: "说出看见了哪几个量，哪个不同。",
  [LearningStage.PREDICT]: "先猜电流会怎样，再动手对照。",
  [LearningStage.EXPERIMENT]: "先说清哪个量没变，再看电流。",
  [LearningStage.EXPLAIN]: "用一次比较说明电流怎样变。",
  [LearningStage.MODEL]: "在同一块板上写出关系，再用一句话说明。",
  [LearningStage.TRANSFER]: "换了样子，看看刚才的关系还能不能用。",
  [LearningStage.EXAM]: "先判断题目在考什么，再选用关系，最后作答。",
  [LearningStage.AI_OFF]: "这一页没有提示，也没有人帮你。",
  [LearningStage.COMPLETE]: "这些只是你刚才留下的思考痕迹，不是掌握程度。",
};

export const OHMS_OBSERVE_OPTIONS = [
  { id: "three-quantities", label: "电流、电压、电阻是三个不同的量" },
  { id: "readings-differ", label: "电压或电阻不同时，电流读数可以不同" },
  { id: "open-current-zero", label: "断开时电流是 0，但这不等于电源也没有电压" },
] as const;

export const OHMS_COMPARE_OPTIONS = [
  { value: "same", label: "和我猜的差不多" },
  { value: "different", label: "和我猜的不一样" },
  { value: "partial", label: "只有一部分对上了" },
] as const;

export const OHMS_PREDICT_OUTCOMES = [
  { value: "larger-i", label: "电流会变大" },
  { value: "smaller-i", label: "电流会变小" },
  { value: "same-i", label: "电流几乎不变" },
  { value: "unsure", label: "我还不确定" },
] as const;

export function ohmsExperimentTitle(id: OhmsExperimentId): string {
  if (id === OHMS_EXPERIMENT_A) {
    return "同一个电阻，电压不同";
  }
  return "同一个电压，电阻不同";
}

export function ohmsPredictQuestion(id: OhmsExperimentId): string {
  if (id === OHMS_EXPERIMENT_A) {
    return "电阻可以看成不变，两端电压变大。电流会怎样？为什么？先说清哪个量没变。";
  }
  return "两端电压可以看成相同，换了一个更大的电阻。电流会怎样？为什么？先说清哪个量没变。";
}

export const OHMS_TRANSFER_RELATIONS = [
  { id: "same-relation", label: "仍然是一个电阻上的电流、电压和电阻关系" },
  { id: "need-series-course", label: "必须改学串联电路才能说明" },
  { id: "need-power", label: "必须先算电功率才能说明" },
] as const;

export const OHMS_COMPLETE_COPY = {
  title: "先停在这里",
  body: "你走完了这条电路的步骤。这只能说明这次任务做完了，不能说明已经掌握电学。",
} as const;

export const OHMS_EXAM_COPY = {
  notice: "现在先不看实验台。先把题目想清楚，再选答案。",
  representationQuestion: "这道题主要在考什么？",
  modelQuestion: "你打算用哪一句关系来想？",
  answerQuestion: "最后选哪一句？",
  reasoningQuestion: "用自己的话写理由。不要只抄选项。",
  continueModel: "下一步：选用关系",
  revealOptions: "再看选项",
  submit: "提交这道题",
} as const;

export const OHMS_AI_OFF_COPY = {
  commit: "记下我的判断",
  needCommit: "先选判断、勾出用到的想法，再用自己的话写理由。",
  postCheckTitle: "对照一下：你刚才判断时用到了哪些？",
  postCheckSubmit: "记下这次对照",
  preCommitATitle: "先标出你用到的两次比较",
  preCommitBTitle: "先标出你用到的想法",
} as const;

export const OHMS_OBJECT_OPTIONS = [
  { value: "resistor-circuit", label: "一条只含一个电阻的电路" },
  { value: "battery-only", label: "只看电池" },
  { value: "wires-only", label: "只看导线" },
] as const;

export const OHMS_QUANTITY_OPTIONS = [
  { value: "i-u-r", label: "电流、电压和电阻" },
  { value: "current-only", label: "只有电流" },
  { value: "unsure", label: "我还分不清" },
] as const;

export const OHMS_CHANGE_OPTIONS = [
  { value: "readings-differ", label: "电压或电阻不同时，电流可以不同" },
  { value: "all-same", label: "两边读数完全一样" },
  { value: "unsure", label: "我还看不出来" },
] as const;

export const OHMS_HELD_OPTIONS = [
  { value: "resistance", label: "电阻可以看成没变" },
  { value: "voltage", label: "电压可以看成没变" },
  { value: "neither", label: "两个量都变了" },
] as const;

export const OHMS_CURRENT_CHANGE_OPTIONS = [
  { value: "larger", label: "电流更大" },
  { value: "smaller", label: "电流更小" },
  { value: "same", label: "电流几乎不变" },
  { value: "unsure", label: "我还不确定" },
] as const;

export const OHMS_FILAMENT_PROBES = [
  {
    id: "r-may-change",
    prompt: "灯丝明显更热时，电阻还能看成不变吗？",
    options: [
      { value: "r-may-change", label: "电阻可能会变" },
      { value: "r-fixed", label: "电阻一定还能看成不变" },
    ],
  },
  {
    id: "not-fixed-proportion",
    prompt: "还能不能说电压加倍，电流一定加倍？",
    options: [
      { value: "not-fixed-proportion", label: "不能，因为电阻不一定还能看成不变" },
      { value: "fixed-proportion", label: "能，电压加倍电流一定加倍" },
    ],
  },
] as const;

export const OHMS_AI_OFF_PRE_COMMIT_A = [
  { id: "change-u-same-r", label: "换更高电压时，电阻可以看成不变" },
  { id: "change-r-same-u", label: "换更大电阻时，电压可以看成不变" },
] as const;

export const OHMS_AI_OFF_PRE_COMMIT_B = [
  { id: "r-is-property", label: "电阻是这段导体的属性" },
  { id: "same-relation", label: "R = U / I 只是同一个关系" },
] as const;

export const OHMS_TUTOR_GOALS: Partial<Record<LearningStage, string>> = {
  [LearningStage.OBSERVE]: "让学生先分开看电流、电压和电阻，不要先塞公式。",
  [LearningStage.DESCRIBE]: "让学生说出看见了哪个量不同。",
  [LearningStage.PREDICT]: "不要透露电流会变成多少。",
  [LearningStage.EXPLAIN]: "可以问缺了哪个量，不要一次说完关系。",
  [LearningStage.MODEL]: "可以指出缺了控制条件，不要替学生建好关系。",
  [LearningStage.TRANSFER]: "不要先说这和刚才是同一个关系。",
  [LearningStage.EXAM]: "不要直接给出最后选项的对错。",
};

export function ohmsReflectionPrompt(id: OhmsExperimentId): string {
  if (id === OHMS_EXPERIMENT_A) {
    return "这次动手让你看清了：比较电压时，哪个量要先保持不变？";
  }
  return "这次动手让你看清了：比较电阻时，哪个量要先保持不变？";
}
