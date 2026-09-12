import { LEARNING_STAGE_ORDER, LearningStage } from "@/types/learning";
import { STUDENT_STAGE_LABELS } from "@/lib/content/student-language";
import { MODEL_RELATION_IDS } from "@/content/physics-models/specific-heat-capacity/model";
import {
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
  type HeatExperimentId,
} from "@/lib/physics/equal-mass-heated-samples";

export const HEAT_PHASE_STAGES = [
  LearningStage.ENTRY,
  LearningStage.OBSERVE,
  LearningStage.DESCRIBE,
  LearningStage.PREDICT,
  LearningStage.EXPERIMENT,
  LearningStage.EXPLAIN,
  LearningStage.MODEL,
  LearningStage.TRANSFER,
  LearningStage.EXAM,
  LearningStage.AI_OFF,
  LearningStage.COMPLETE,
] as const;

export const HEAT_STAGE_LABELS = STUDENT_STAGE_LABELS;

export const HEAT_STAGE_PROMPTS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.ENTRY]: "同样多的水和沙子，同样加热，为什么有的更烫？",
  [LearningStage.OBSERVE]: "先不要下结论。看看两份样品是不是一样多，加热后谁升得更快。",
  [LearningStage.DESCRIBE]: "用你看到的现象，说清楚质量和升温怎样。",
  [LearningStage.PREDICT]: "先猜一猜温度会怎样变，再说说你为什么这样想。",
  [LearningStage.EXPERIMENT]: "改一个比较方式，看看是不是和你想的一样。",
  [LearningStage.EXPLAIN]: "把三次比较放在一起看：能量、质量、材料和温度变化怎样一起看？",
  [LearningStage.MODEL]: "把 Q、c、m、ΔT 怎样一起决定写清楚。不要排成能量链，也不要排成密度表。",
  [LearningStage.TRANSFER]: "情况换了，刚才的想法还能不能用？",
  [LearningStage.EXAM]: "先想清楚题目在问什么，再选答案。",
  [LearningStage.AI_OFF]: "这一次没有提示。自己判断能量、质量和温度变化怎样一起看。",
  [LearningStage.COMPLETE]: "回头看看你刚才想了什么。",
};

export const HEAT_COPY = {
  landingKicker: "场景 05",
  landingTitle: "同样质量的水和沙子",
  landingBody: "先看谁升得更快，先别急着背公式。加热时间相同只表示能量输入可以看成相近。",
  landingCta: "开始探索",
  headline: "同样多的水和沙子，同样加热，为什么有的更烫？",
  subheadline: "先看质量和升温，先别急着解释。",
  startCta: "开始探索",
  observeInstruction:
    "先看一遍加热。留意两份样品是不是一样多，加热之后谁升得更快。同样加热时间只是让能量输入可以看成相近。",
  observePrompt: "下面这些，哪些是你确实看见的？可以多选。",
  observeSubmit: "记下看到的",
  observeNeedMore: "再看看：它们是不是一样多？加热后谁升得更快？",
  observeSaved: "你已经记下看到的现象了。",
  playDemo: "播放加热",
  pauseDemo: "暂停",
  replayDemo: "再看一遍",
  describeInstruction: "先选出你看见的事实，再用一句话说出来。不必背课文原句。",
  objectLabel: "你看到的物体是什么？",
  massRelationLabel: "它们的质量怎样？",
  temperatureRelationLabel: "加热后温度变化怎样？",
  describeQuestion: "请用一句话描述你看见的现象。",
  describePlaceholder: "例如：两份差不多一样多，但沙子升得更快。",
  describeSubmit: "记下描述",
  describeNeedStructure: "先把物体、质量和升温都选清楚，再用自己的话写一句。",
  predictInstruction: "先猜结果，再写下理由。猜错了也可以继续做实验。",
  predictA:
    "两份样品质量相同。同样加热时间只表示吸收的能量可以看成相近。如果一种材料比热容更大，温度会怎样？",
  predictB: "同一种材料，同样加热。如果一份质量明显更大，温度会怎样？",
  predictC: "同一种材料、质量相同。如果这一次吸收的能量更多，温度会怎样？",
  reasonLabel: "你为什么这样想？",
  reasonPlaceholder: "用自己的话说一句。",
  predictSubmit: "记下猜测",
  predictNeedBoth: "请先选一个结果，再写一句理由。",
  predictLocked: "你刚才的猜测",
  experimentIntro: "改一个比较方式，看看是不是和你想的一样。",
  runExperiment: "动手看结果",
  runNeedPrediction: "先记下猜测，再动手。",
  observeSubmitExperiment: "记下看到的结果",
  massCompareLabel: "质量怎样比？",
  energyCompareLabel: "吸收的能量怎样比？",
  deltaTCompareLabel: "温度变化怎样比？",
  compareQuestion: "和你刚才猜的比，怎样？",
  compareSame: "差不多一样",
  compareDifferent: "不一样",
  comparePartial: "有一部分一样",
  compareSubmit: "记下比较",
  reflectionA: "这次动手让你看清了什么？时间是不是就是吸收的能量？",
  reflectionB: "同一种材料、能量相近、质量不同时，你看清了什么？",
  reflectionC: "同样材料、同样质量、能量更多时，你看清了什么？",
  reflectionSubmit: "记下想法",
  experimentATitle: "同样多，同样加热，比材料",
  experimentBTitle: "同一种材料，比质量",
  experimentCTitle: "同样样品，比能量",
  unitsNote:
    "质量用千克，温度用℃，能量用焦耳。官方数值由规则算出。加热时间不是能量本身。",
  explainLead: "把三次比较放在一起看。",
  explainFollow: "先选出关系，再用自己的话说一两句。不要只抄公式。",
  explainHeatVsTemp: "温度和吸收的能量是同一件事吗？",
  explainSameMassSameQ: "质量和吸收能量相同时，比热容更大的温度会怎样？",
  explainSameCSameQ: "材料和吸收能量相同时，质量更大的温度会怎样？",
  explainTimeAndPhase: "加热时间和物态变化，你怎样看？",
  explainOwnWords: "用自己的话，把能量、质量、比热容和温度变化怎样一起看说一遍。",
  explainPlaceholder:
    "例如：更烫不等于吸热更多。质量相同、能量相近时，比热容大的升得慢。时间不是能量。",
  explainSubmit: "记下解释",
  explainNeedMore: "先把四步选清楚，再用自己的话说。不要把更烫直接写成吸热更多。",
  explainEvidenceTitle: "你刚才三次动手记下的",
  modelInstruction:
    "三次比较都来自同一个关系 Q = c m ΔT，不是三条互不相干的口号。先写出乘积，再看它怎样同时解释三次比较。",
  modelEvidenceTitle: "对照三次比较",
  modelProductLabel: "吸收或放出的能量怎样由比热容、质量和温度变化得到？",
  modelCLabel: "比热容",
  modelMLabel: "质量",
  modelDeltaTLabel: "温度变化",
  modelQLabel: "得到的能量",
  modelSameMassDeltaTLabel: "同样质量、同样升温",
  modelSameMassQLabel: "同样质量、同样能量",
  modelSameCQLabel: "同样材料、同样能量",
  modelSufficiencyLabel: "如果只知道温度升了，能不能断定吸收的能量或比热容？",
  modelConditionLabel: "这个关系在什么条件下能用？",
  modelSubmit: "记下关系",
  modelNeedStructure:
    "先写出 Q、c、m、ΔT 的乘积，再说明三次比较怎样从它推出来。还要标出：没有物态变化，时间不是 Q。",
  modelRetry: "这次关系还不完整。刚才那一次还留着，可以再试。",
  transferFullQuestion: "这个新情境里，哪些关系还能用？哪些只是看起来像？",
  transferBoundaryQuestion: "温度几乎不变时，哪些想法还能用？哪些不能直接搬过来？",
  transferApplies: "还能用",
  transferNotNecessarily: "不能直接搬过来",
  transferSurfaceCue: "因为都是在加热，所以和刚才课堂上的样品是一回事。",
  transferOwnWords: "用能量、质量和温度变化的关系说说为什么。不要只说“看起来像”。",
  transferPlaceholder: "先说哪个量相同、哪个量不同，温度怎样比。",
  iceConditionTitle: "先看这个新情境的条件，再判断公式能不能原样搬过来。",
  transferSubmit: "记下迁移",
  transferNeedMore: "先判断每条关系能不能用，再用自己的话写一句。",
  transferRetry: "这次还不能算迁移成功。刚才那一次还留着，可以再试。",
  hintAsk: "再看一步提示",
  hintDone: "提示已经到这一步能给的位置了。",
  sceneAria: "同样质量的水和沙子",
  massUnit: "kg",
  tempUnit: "℃",
  energyUnit: "J",
} as const;

export const HEAT_FORBIDDEN_REVEAL_TERMS = [
  "热量等于比热容乘质量乘温度变化",
  "Q = c m ΔT",
  "Q=cmΔT",
] as const;

export const HEAT_OBSERVE_OPTIONS = [
  { id: "same-mass", label: "两份样品差不多一样多", distractor: false },
  { id: "different-rise", label: "加热后，有一份升得更快、更烫", distractor: false },
  { id: "two-dishes-on-screen", label: "画面里有两份样品", distractor: true },
  { id: "same-time-same-rise", label: "加热时间相同，所以升温一定相同", distractor: true },
  { id: "already-boiling", label: "水已经沸腾了", distractor: true },
  {
    id: "hotter-means-more-heat",
    label: "更烫的那一份一定吸收了更多能量",
    distractor: true,
  },
] as const;

export const HEAT_OBJECT_OPTIONS = [
  { value: "samples", label: "两份加热样品" },
  { value: "heater-only", label: "只有加热器，没有样品" },
  { value: "labels-only", label: "只有文字标签" },
] as const;

export const HEAT_MASS_RELATION_OPTIONS = [
  { value: "same", label: "两份差不多一样多" },
  { value: "different", label: "一份明显更多" },
  { value: "unsure", label: "看不出来" },
] as const;

export const HEAT_TEMPERATURE_RELATION_OPTIONS = [
  { value: "different", label: "加热后升温明显不同" },
  { value: "same", label: "升温完全一样" },
  { value: "unsure", label: "看不出来" },
] as const;

export const HEAT_PREDICT_OUTCOMES_A = [
  { value: "sand-hotter", label: "沙子升得更快、更烫" },
  { value: "water-hotter", label: "水升得更快、更烫" },
  { value: "same-rise", label: "两边升得一样" },
  { value: "unsure", label: "还说不准" },
] as const;

export const HEAT_PREDICT_OUTCOMES_B = [
  { value: "smaller-mass-hotter", label: "质量更小的那份升得更多" },
  { value: "larger-mass-hotter", label: "质量更大的那份升得更多" },
  { value: "same-rise", label: "两边升得一样" },
  { value: "unsure", label: "还说不准" },
] as const;

export const HEAT_PREDICT_OUTCOMES_C = [
  { value: "more-energy-hotter", label: "吸收能量更多的那次升得更多" },
  { value: "less-energy-hotter", label: "吸收能量更少的那次反而更烫" },
  { value: "same-rise", label: "两次升得一样" },
  { value: "unsure", label: "还说不准" },
] as const;

export const HEAT_PREDICT_OUTCOMES = [
  ...HEAT_PREDICT_OUTCOMES_A,
  ...HEAT_PREDICT_OUTCOMES_B,
  ...HEAT_PREDICT_OUTCOMES_C,
] as const;

export const HEAT_COMPARE_OPTIONS = [
  { value: "same", label: HEAT_COPY.compareSame },
  { value: "different", label: HEAT_COPY.compareDifferent },
  { value: "partial", label: HEAT_COPY.comparePartial },
] as const;

export const HEAT_MASS_COMPARE_OPTIONS_A = [
  { value: "same", label: "质量相同" },
  { value: "water-heavier", label: "水更重" },
  { value: "sand-heavier", label: "沙子更重" },
] as const;

export const HEAT_ENERGY_COMPARE_OPTIONS_A = [
  { value: "similar", label: "吸收的能量可以看成相近" },
  { value: "water-more", label: "水吸收的能量一定更多" },
  { value: "sand-more", label: "沙子吸收的能量一定更多" },
  { value: "time-is-q", label: "加热时间相同就是能量相同" },
] as const;

export const HEAT_DELTA_T_COMPARE_OPTIONS_A = [
  { value: "sand-larger", label: "沙子升温更多" },
  { value: "water-larger", label: "水升温更多" },
  { value: "same", label: "升温相同" },
] as const;

export const HEAT_MASS_COMPARE_OPTIONS_B = [
  { value: "left-smaller", label: "左边质量更小" },
  { value: "same", label: "质量相同" },
  { value: "left-larger", label: "左边质量更大" },
] as const;

export const HEAT_ENERGY_COMPARE_OPTIONS_B = [
  { value: "similar", label: "吸收的能量可以看成相近" },
  { value: "larger-mass-more-q", label: "质量大的吸收能量一定更多" },
  { value: "time-is-q", label: "加热时间相同就是能量相同" },
] as const;

export const HEAT_DELTA_T_COMPARE_OPTIONS_B = [
  { value: "smaller-mass-larger", label: "质量更小的升温更多" },
  { value: "larger-mass-larger", label: "质量更大的升温更多" },
  { value: "same", label: "升温相同" },
] as const;

export const HEAT_MASS_COMPARE_OPTIONS_C = [
  { value: "same", label: "质量相同" },
  { value: "left-larger", label: "左边质量更大" },
] as const;

export const HEAT_ENERGY_COMPARE_OPTIONS_C = [
  { value: "right-more", label: "右边吸收的能量更多" },
  { value: "same", label: "两次能量相同" },
  { value: "left-more", label: "左边吸收的能量更多" },
] as const;

export const HEAT_DELTA_T_COMPARE_OPTIONS_C = [
  { value: "more-energy-larger", label: "能量更多的那次升温更多" },
  { value: "same", label: "升温相同" },
  { value: "more-energy-smaller", label: "能量更多的那次升温更少" },
] as const;

export const HEAT_EXPLAIN_HEAT_VS_TEMP = [
  { value: "not-same", label: "不是同一件事。还要看质量、比热容和升了几度。" },
  { value: "hotter-more-heat", label: "更烫就是吸收的能量更多。" },
  { value: "c-is-temperature", label: "比热容就是现在有多热。" },
] as const;

export const HEAT_EXPLAIN_SAME_MASS_Q = [
  { value: "larger-c-smaller-rise", label: "比热容更大，升温更小。" },
  { value: "larger-c-larger-rise", label: "比热容更大，升温一定更大。" },
  { value: "same-q-same-rise", label: "能量相同，升温一定相同。" },
] as const;

export const HEAT_EXPLAIN_SAME_C_Q = [
  { value: "larger-mass-smaller-rise", label: "质量更大，升温更小。" },
  { value: "larger-mass-larger-rise", label: "质量更大，升温一定更大。" },
  { value: "same-material-same-rise", label: "同一种材料，升温一定相同。" },
] as const;

export const HEAT_EXPLAIN_TIME_PHASE = [
  { value: "time-not-q", label: "加热时间不是能量本身；没有物态变化时才能用这个式子写完升温。" },
  { value: "time-is-q", label: "加热时间相同就是吸收的能量相同，也就是 Q。" },
  { value: "heating-always-rises", label: "只要在加热，温度就一定会升高。" },
] as const;

export const HEAT_MODEL_FACTOR_OPTIONS = [
  { value: "specific-heat", label: "比热容 c" },
  { value: "mass", label: "质量 m" },
  { value: "temperature-change", label: "温度变化 ΔT" },
  { value: "heat-energy", label: "吸收或放出的能量 Q" },
  { value: "density", label: "密度 ρ" },
  { value: "clock-time", label: "加热时间" },
] as const;

export const HEAT_MODEL_SAME_MASS_DELTA_T = [
  { value: "larger-c-larger-q", label: "c 更大，需要的能量 Q 更大" },
  { value: "larger-c-smaller-q", label: "c 更大，需要的能量更小" },
  { value: "c-does-not-matter", label: "比热容不用看" },
] as const;

export const HEAT_MODEL_SAME_MASS_Q = [
  { value: "larger-c-smaller-delta-t", label: "c 更大，ΔT 更小" },
  { value: "larger-c-larger-delta-t", label: "c 更大，ΔT 更大" },
  { value: "same-q-same-delta-t", label: "能量相同，升温一定相同" },
] as const;

export const HEAT_MODEL_SAME_C_Q = [
  { value: "larger-mass-smaller-delta-t", label: "质量更大，ΔT 更小" },
  { value: "larger-mass-larger-delta-t", label: "质量更大，ΔT 更大" },
  { value: "mass-does-not-matter", label: "质量不用看" },
] as const;

export const HEAT_MODEL_SUFFICIENCY = [
  { value: "temperature-not-enough", label: "只知道升温还不够，还要看质量和 Q。" },
  { value: "temperature-enough", label: "只要温度升了，就能断定吸收的能量和比热容。" },
] as const;

export const HEAT_MODEL_CONDITIONS = [
  { id: "no-phase-change", label: "这段过程没有物态变化" },
  { id: "time-is-not-q", label: "加热时间不是 Q 本身" },
  { id: "energy-conversion-chain", label: "这是一条能量传送带" },
  { id: "force-equals-motion", label: "这是力和运动的关系板" },
  { id: "mass-over-volume", label: "这是质量除以体积的密度表" },
] as const;

export const HEAT_ICE_CONDITION_PROBES = [
  {
    id: "situation",
    prompt: "这个新情境里，正在发生什么？",
    options: [
      { value: "melting-phase-change", label: "冰水还在熔化，物态在变。" },
      { value: "same-as-classroom-heating", label: "这和课堂上加热水和沙子是同一件事。" },
      { value: "heater-must-raise-t", label: "加热器开着，温度就一定会继续升。" },
    ],
  },
  {
    id: "energy",
    prompt: "加热还在进行时，能量和温度怎样？",
    options: [
      {
        value: "energy-can-enter-without-rise",
        label: "能量仍可能进入，但温度不必继续升。",
      },
      { value: "no-rise-means-no-energy", label: "温度没变，所以没有能量进入。" },
    ],
  },
  {
    id: "limit",
    prompt: "刚才的升温公式在这里还能不能原样搬过来？",
    options: [
      {
        value: "cannot-finish-with-q-equals-c-m-dt",
        label: "不能只用升温公式写完这段过程。",
      },
      { value: "plug-in-zero-delta-t", label: "把 ΔT 写成 0，公式就算写完了。" },
    ],
  },
] as const;

export const HEAT_TRANSFER_RELATIONS = [
  {
    id: MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT,
    label: "Q = c m ΔT 仍然可以用来看能量、质量和温度变化",
  },
  {
    id: MODEL_RELATION_IDS.sameMassSameQLargerCSmallerDeltaT,
    label: "质量和能量相近时，比热容更大则升温更小",
  },
  {
    id: MODEL_RELATION_IDS.sameCSameQLargerMassSmallerDeltaT,
    label: "材料和能量相同时，质量更大则升温更小",
  },
  {
    id: MODEL_RELATION_IDS.temperatureAloneDoesNotGiveQ,
    label: "只知道更烫，还不能断定吸收的能量",
  },
  {
    id: MODEL_RELATION_IDS.phaseChangeNeedsAnotherModel,
    label: "熔化或沸腾时，不能只用这个式子写完全部能量去向",
  },
] as const;

export const HEAT_TUTOR_GOALS: Partial<Record<LearningStage, string>> = {
  [LearningStage.OBSERVE]: "帮助学生看清质量和升温，不先塞公式。",
  [LearningStage.DESCRIBE]: "帮助学生用自己的话说出质量和升温。",
  [LearningStage.PREDICT]: "帮助学生先猜，不透露结果。",
  [LearningStage.EXPERIMENT]: "帮助学生对照猜测和结果。",
  [LearningStage.EXPLAIN]: "帮助学生一层一层说出关系，不一次写完公式。",
  [LearningStage.MODEL]: "可以指出缺了哪个量，但不替学生建好关系。",
  [LearningStage.TRANSFER]: "等学生先判断，不先说出同一个模型。",
  [LearningStage.EXAM]: "保持先认清题目再看选项，不说出答案。",
};

export const HEAT_EXAM_COPY = {
  notice: "先认清题目在问什么，再选用到的关系，最后才看选项。",
  representationPrompt: "这道题主要在问什么？",
  modelPrompt: "你要用哪条关系？",
  answerPrompt: "现在再看选项。",
  reasoningPrompt: "用自己的话写一句理由。",
  submit: "提交这题",
  continueModel: "下一步：选用到的关系",
  revealOptions: "看选项",
} as const;

export const HEAT_AI_OFF_COPY = {
  commit: "先记下判断和理由",
  postCheckTitle: "再勾出你用到的证据",
  postCheckSubmit: "提交核对",
  needCommit: "先写下判断和自己的理由，再核对。",
  icePreCommitTitle: "记下判断前，先标出这个情境的条件。",
} as const;

export const HEAT_COMPLETE_COPY = {
  title: "这次你做了什么",
  body: "你从同样加热的样品出发，用能量、质量、比热容和温度变化一起看问题，并在新情境和独立题目里试过这些想法。",
  noMastery: "这只说明你走完了这一轮。它不能代替以后的课堂检验。",
  restart: "再走一遍",
} as const;

export const HEAT_FOOTER: Partial<Record<LearningStage, string>> = {
  [LearningStage.ENTRY]: "先看现象，再想关系。",
  [LearningStage.OBSERVE]: "先看，先别下结论。",
  [LearningStage.AI_OFF]: "这一段没有助手。",
  [LearningStage.COMPLETE]: "停在这里。",
};

export function heatExperimentTitle(experimentId: HeatExperimentId): string {
  if (experimentId === HEAT_EXPERIMENT_A) {
    return HEAT_COPY.experimentATitle;
  }
  if (experimentId === HEAT_EXPERIMENT_B) {
    return HEAT_COPY.experimentBTitle;
  }
  return HEAT_COPY.experimentCTitle;
}

export function heatPredictQuestion(experimentId: HeatExperimentId): string {
  if (experimentId === HEAT_EXPERIMENT_A) {
    return HEAT_COPY.predictA;
  }
  if (experimentId === HEAT_EXPERIMENT_B) {
    return HEAT_COPY.predictB;
  }
  return HEAT_COPY.predictC;
}

export function heatPredictOutcomes(experimentId: HeatExperimentId) {
  if (experimentId === HEAT_EXPERIMENT_A) {
    return HEAT_PREDICT_OUTCOMES_A;
  }
  if (experimentId === HEAT_EXPERIMENT_B) {
    return HEAT_PREDICT_OUTCOMES_B;
  }
  return HEAT_PREDICT_OUTCOMES_C;
}

export function heatReflectionPrompt(experimentId: HeatExperimentId): string {
  if (experimentId === HEAT_EXPERIMENT_A) {
    return HEAT_COPY.reflectionA;
  }
  if (experimentId === HEAT_EXPERIMENT_B) {
    return HEAT_COPY.reflectionB;
  }
  return HEAT_COPY.reflectionC;
}
