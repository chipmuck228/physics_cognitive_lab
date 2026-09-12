import { LEARNING_STAGE_ORDER, LearningStage } from "@/types/learning";
import { STUDENT_STAGE_LABELS } from "@/lib/content/student-language";
import {
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
  type SamplesExperimentId,
} from "@/lib/physics/equal-volume-material-samples";

export const SAMPLES_PHASE_STAGES = [
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

export const SAMPLES_STAGE_LABELS = STUDENT_STAGE_LABELS;

export const SAMPLES_STAGE_PROMPTS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.ENTRY]: "两块看起来差不多大的东西，为什么一块更沉？",
  [LearningStage.OBSERVE]: "先不要下结论。仔细看看：它们看起来一样大吗？谁更沉？",
  [LearningStage.DESCRIBE]: "用你看到的现象，说清楚大小怎样、轻重怎样。",
  [LearningStage.PREDICT]: "先猜一猜，再说说你为什么这样想。",
  [LearningStage.EXPERIMENT]: "改一个比较方式，看看是不是和你想的一样。",
  [LearningStage.EXPLAIN]: "把三次比较放在一起看：质量和体积怎样一起决定密度？",
  [LearningStage.MODEL]: "把质量和体积怎样得到密度写清楚。不要排成能量链，也不要排成力的关系板。",
  [LearningStage.TRANSFER]: "情况换了，刚才的想法还能不能用？",
  [LearningStage.EXAM]: "先想清楚题目在问什么，再选答案。",
  [LearningStage.AI_OFF]: "这一次没有提示。自己判断质量和体积怎样决定密度。",
  [LearningStage.COMPLETE]: "回头看看你刚才想了什么。",
};

export const SAMPLES_COPY = {
  landingKicker: "场景 04",
  landingTitle: "同样大小的两块样品",
  landingBody: "先看谁更沉、谁占的空间一样，先别急着背公式。",
  landingCta: "开始探索",
  headline: "两块看起来差不多大的东西，为什么一块更沉？",
  subheadline: "先看它们的大小和轻重，先别急着解释。",
  startCta: "开始探索",
  observeInstruction:
    "先看一遍演示。留意两块样品看起来是不是一样大，以及哪一块更沉。",
  observePrompt: "下面这些，哪些是你确实看见的？可以多选。",
  observeSubmit: "记下看到的",
  observeNeedMore: "再看看：它们看起来一样大吗？有没有一块更沉？",
  observeSaved: "你已经记下看到的现象了。",
  playDemo: "播放演示",
  pauseDemo: "暂停",
  replayDemo: "再看一遍",
  describeInstruction: "先选出你看见的事实，再用一句话说出来。不必背课文原句。",
  objectLabel: "你看到的物体是什么？",
  sizeRelationLabel: "它们看起来大小怎样？",
  massRelationLabel: "它们的轻重怎样？",
  describeQuestion: "请用一句话描述你看见的现象。",
  describePlaceholder: "例如：两块看起来差不多大，但一块明显更沉。",
  describeSubmit: "记下描述",
  describeNeedStructure: "先把物体、大小和轻重都选清楚，再用自己的话写一句。",
  predictInstruction: "先猜结果，再写下理由。猜错了也可以继续做实验。",
  predictA: "两块样品体积相同。如果一块明显更沉，它的密度会怎样？为什么？",
  predictB: "两块样品质量相同。如果一块占的空间明显更大，它的密度会怎样？为什么？",
  predictC: "把一块内部均匀的样品切成一半。这一半的密度会变吗？为什么？",
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
  volumeCompareLabel: "体积怎样比？",
  densityCompareLabel: "密度怎样比？",
  massChangeLabel: "切开后，这一半的质量怎样？",
  volumeChangeLabel: "切开后，这一半的体积怎样？",
  densityChangeLabel: "切开后，这一半的密度怎样？",
  compareQuestion: "和你刚才猜的比，怎样？",
  compareSame: "差不多一样",
  compareDifferent: "不一样",
  comparePartial: "有一部分一样",
  compareSubmit: "记下比较",
  reflectionA: "这次动手让你看清了什么？",
  reflectionB: "质量相同、体积不同时，你看清了什么？",
  reflectionC: "均匀切开以后，质量和体积怎样一起变？比值怎样？",
  reflectionSubmit: "记下想法",
  experimentATitle: "同样大，比轻重",
  experimentBTitle: "同样重，比大小",
  experimentCTitle: "均匀切开一半",
  unitsNote: "质量用克，体积用立方厘米。密度由质量和体积算出来，不能编造。",
  explainLead: "把三次比较放在一起看。",
  explainFollow: "先选出关系，再用自己的话说一两句。不要只抄公式。",
  explainDensityVsMass: "密度和质量、大小是同一件事吗？",
  explainSameVolume: "体积相同时，更沉的那一块密度会怎样？",
  explainSameMass: "质量相同时，占空间更大的那一块密度会怎样？",
  explainUniformCut: "均匀切开一半以后，这一半的密度会怎样？",
  explainOwnWords: "用自己的话，把质量和体积怎样一起决定密度说一遍。",
  explainPlaceholder:
    "例如：同样大时更沉的更密；同样重时更大的更疏；均匀切开后密度不必变。",
  explainSubmit: "记下解释",
  explainNeedMore: "先把四步选清楚，再用自己的话说。不要把更重或更大直接写成密度。",
  explainEvidenceTitle: "你刚才三次动手记下的",
  modelInstruction:
    "三次比较都来自同一个比值，不是三条互不相干的规则。先写出比值，再看它怎样同时解释同样体积、同样质量和均匀切开。",
  modelEvidenceTitle: "对照三次比较",
  modelRatioLabel: "密度怎样由质量和体积得到？",
  modelNumeratorLabel: "上面这个量",
  modelDenominatorLabel: "下面这个量",
  modelResultLabel: "得到的量",
  modelSameVolumeLabel: "同样体积",
  modelSameMassLabel: "同样质量",
  modelCutLabel: "均匀切开",
  modelCutCompareLabel: "切开以后，比一比切开前和切开后",
  modelCutMassLabel: "切开后，质量怎样",
  modelCutVolumeLabel: "切开后，体积怎样",
  modelCutRatioLabel: "切开后，m ÷ V 怎样",
  modelCutWhyLabel: "比值为什么可以保持不变？",
  modelSufficiencyLabel: "如果只知道质量变大了，能不能断定密度一定变大？",
  modelConditionLabel: "这个关系在什么条件下能用？",
  modelSubmit: "记下关系",
  modelNeedStructure:
    "先写出比值，再说明三次比较怎样从它推出来。均匀切开要写出质量和体积怎样一起变。",
  modelRetry: "这次关系还不完整。刚才那一次还留着，可以再试。",
  experimentBeforeAfter: "切开前和切开后",
  experimentTogetherLabel: "质量和体积怎样一起变？",
  transferFullQuestion: "这个新情境里，哪些关系还能用？哪些只是看起来像？",
  transferBoundaryQuestion: "外形大小差很多时，哪些想法还能用？哪些不能直接搬过来？",
  transferApplies: "还能用",
  transferNotNecessarily: "不能直接搬过来",
  transferSurfaceCue: "因为都是固体块，所以和刚才课堂上的样品是一回事。",
  transferOwnWords: "用质量和体积的关系说说为什么。不要只说“看起来像”。",
  transferPlaceholder: "先说哪个量相同、哪个量不同，密度怎样比。",
  transferSubmit: "记下迁移",
  transferNeedMore: "先判断每条关系能不能用，再用自己的话写一句。",
  transferRetry: "这次还不能算迁移成功。刚才那一次还留着，可以再试。",
  transferMedium: "换一个情境再试试",
  hintAsk: "再看一步提示",
  hintDone: "提示已经到这一步能给的位置了。",
  sceneAria: "同样大小的两块样品",
  massUnit: "g",
  volumeUnit: "cm³",
  densityUnit: "g/cm³",
} as const;

export const SAMPLES_FORBIDDEN_REVEAL_TERMS = [
  "密度等于质量除以体积",
  "ρ = m / V",
  "ρ=m/V",
] as const;

export const SAMPLES_OBSERVE_OPTIONS = [
  { id: "same-size", label: "两块看起来差不多一样大", distractor: false },
  { id: "one-heavier", label: "有一块明显更沉", distractor: false },
  { id: "two-blocks-on-screen", label: "画面里有两块东西", distractor: true },
  { id: "one-hotter", label: "有一块明显更烫", distractor: true },
  { id: "one-floats", label: "有一块已经浮起来了", distractor: true },
  {
    id: "same-material-same-weight",
    label: "看起来一样大，所以一定一样重",
    distractor: true,
  },
] as const;

export const SAMPLES_OBJECT_OPTIONS = [
  { value: "samples", label: "两块样品" },
  { value: "scale-only", label: "只有天平，没有样品" },
  { value: "labels-only", label: "只有文字标签" },
] as const;

export const SAMPLES_SIZE_RELATION_OPTIONS = [
  { value: "same", label: "看起来大小差不多" },
  { value: "different", label: "一块明显更大" },
  { value: "unsure", label: "看不出来" },
] as const;

export const SAMPLES_MASS_RELATION_OPTIONS = [
  { value: "different", label: "一块明显更沉" },
  { value: "same", label: "两块一样重" },
  { value: "unsure", label: "看不出来" },
] as const;

export type SamplesPredictOutcome =
  | "heavier-denser"
  | "same-density"
  | "heavier-less-dense"
  | "larger-less-dense"
  | "density-unchanged"
  | "density-halves"
  | "cannot-tell"
  | "unsure";

export const SAMPLES_PREDICT_OUTCOMES_A: Array<{
  value: SamplesPredictOutcome;
  label: string;
}> = [
  { value: "heavier-denser", label: "更沉的那一块密度更大" },
  { value: "same-density", label: "体积相同，所以密度一定相同" },
  { value: "heavier-less-dense", label: "更沉的那一块密度更小" },
  { value: "cannot-tell", label: "不知道是什么材料，所以不能谈密度" },
  { value: "unsure", label: "不确定" },
];

export const SAMPLES_PREDICT_OUTCOMES_B: Array<{
  value: SamplesPredictOutcome;
  label: string;
}> = [
  { value: "larger-less-dense", label: "占空间更大的那一块密度更小" },
  { value: "same-density", label: "质量相同，所以密度一定相同" },
  { value: "heavier-denser", label: "谁看起来更大，密度就更大" },
  { value: "cannot-tell", label: "不知道是什么材料，所以不能谈密度" },
  { value: "unsure", label: "不确定" },
];

export const SAMPLES_PREDICT_OUTCOMES_C: Array<{
  value: SamplesPredictOutcome;
  label: string;
}> = [
  { value: "density-unchanged", label: "这一半的密度几乎不变" },
  { value: "density-halves", label: "切成一半，密度也变成一半" },
  { value: "heavier-denser", label: "变轻了，所以密度一定变小" },
  { value: "cannot-tell", label: "切开以后就不能再谈密度" },
  { value: "unsure", label: "不确定" },
];

export const SAMPLES_PREDICT_OUTCOMES = [
  ...SAMPLES_PREDICT_OUTCOMES_A,
  ...SAMPLES_PREDICT_OUTCOMES_B,
  ...SAMPLES_PREDICT_OUTCOMES_C,
];

export const SAMPLES_MASS_COMPARE_OPTIONS = [
  { value: "iron-heavier", label: "铁块更重" },
  { value: "wood-heavier", label: "木块更重" },
  { value: "same", label: "两块质量几乎相同" },
] as const;

export const SAMPLES_VOLUME_COMPARE_OPTIONS = [
  { value: "same", label: "体积几乎相同" },
  { value: "iron-larger", label: "铁块体积更大" },
  { value: "wood-larger", label: "木块体积更大" },
] as const;

export const SAMPLES_DENSITY_COMPARE_OPTIONS = [
  { value: "iron-denser", label: "铁块密度更大" },
  { value: "wood-denser", label: "木块密度更大" },
  { value: "same", label: "两块密度几乎相同" },
] as const;

export const SAMPLES_MASS_COMPARE_B_OPTIONS = [
  { value: "same", label: "两块质量几乎相同" },
  { value: "metal-heavier", label: "金属小块更重" },
  { value: "plastic-heavier", label: "塑料块更重" },
] as const;

export const SAMPLES_VOLUME_COMPARE_B_OPTIONS = [
  { value: "plastic-larger", label: "塑料块体积更大" },
  { value: "metal-larger", label: "金属小块体积更大" },
  { value: "same", label: "体积几乎相同" },
] as const;

export const SAMPLES_DENSITY_COMPARE_B_OPTIONS = [
  { value: "metal-denser", label: "金属小块密度更大" },
  { value: "plastic-denser", label: "塑料块密度更大" },
  { value: "same", label: "两块密度几乎相同" },
] as const;

export const SAMPLES_CUT_MASS_OPTIONS = [
  { value: "half", label: "大约变成一半" },
  { value: "unchanged", label: "几乎没变" },
  { value: "gone", label: "质量消失了" },
] as const;

export const SAMPLES_CUT_VOLUME_OPTIONS = [
  { value: "half", label: "大约变成一半" },
  { value: "unchanged", label: "几乎没变" },
  { value: "gone", label: "体积消失了" },
] as const;

export const SAMPLES_CUT_DENSITY_OPTIONS = [
  { value: "unchanged", label: "几乎不变" },
  { value: "half", label: "也变成一半" },
  { value: "smaller", label: "一定变小" },
] as const;

export const SAMPLES_CUT_TOGETHER_OPTIONS = [
  { value: "same-proportion", label: "两个量都变小了，而且差不多按同样比例" },
  { value: "only-mass", label: "只有质量变小了" },
  { value: "only-volume", label: "只有体积变小了" },
  { value: "both-so-density-down", label: "两个量都变了，所以密度一定变小" },
] as const;

export const SAMPLES_MODEL_CUT_MASS_OPTIONS = [
  { value: "smaller", label: "变小了" },
  { value: "unchanged", label: "几乎没变" },
  { value: "gone", label: "质量消失了" },
] as const;

export const SAMPLES_MODEL_CUT_VOLUME_OPTIONS = [
  { value: "smaller", label: "变小了" },
  { value: "unchanged", label: "几乎没变" },
  { value: "gone", label: "体积消失了" },
] as const;

export const SAMPLES_MODEL_CUT_RATIO_OPTIONS = [
  { value: "unchanged", label: "比值几乎不变" },
  { value: "halved", label: "比值也变成一半" },
  { value: "smaller", label: "比值一定变小" },
] as const;

export const SAMPLES_MODEL_CUT_WHY_OPTIONS = [
  { value: "same-proportion", label: "质量和体积按同样比例变，所以比值不变" },
  { value: "same-material-alone", label: "因为是同一种物质，所以密度不变" },
  { value: "smaller-less-dense", label: "变小了，所以密度一定变小" },
] as const;

export const SAMPLES_MODEL_SUFFICIENCY_OPTIONS = [
  { value: "need-both", label: "不能。只知道质量变大还不够，还要看体积" },
  { value: "mass-enough", label: "能。质量变大，密度一定变大" },
  { value: "volume-enough", label: "能。只要看起来不大，密度就一定更大" },
] as const;

export const SAMPLES_COMPARE_OPTIONS = [
  { value: "same", label: SAMPLES_COPY.compareSame },
  { value: "different", label: SAMPLES_COPY.compareDifferent },
  { value: "partial", label: SAMPLES_COPY.comparePartial },
] as const;

export const SAMPLES_EXPERIMENT_QUESTIONS: Record<SamplesExperimentId, string> = {
  [SAMPLES_EXPERIMENT_A]: SAMPLES_COPY.predictA,
  [SAMPLES_EXPERIMENT_B]: SAMPLES_COPY.predictB,
  [SAMPLES_EXPERIMENT_C]: SAMPLES_COPY.predictC,
};

export const SAMPLES_EXPERIMENT_TITLES: Record<SamplesExperimentId, string> = {
  [SAMPLES_EXPERIMENT_A]: SAMPLES_COPY.experimentATitle,
  [SAMPLES_EXPERIMENT_B]: SAMPLES_COPY.experimentBTitle,
  [SAMPLES_EXPERIMENT_C]: SAMPLES_COPY.experimentCTitle,
};

export const SAMPLES_REFLECTION_PROMPTS: Record<SamplesExperimentId, string> = {
  [SAMPLES_EXPERIMENT_A]: SAMPLES_COPY.reflectionA,
  [SAMPLES_EXPERIMENT_B]: SAMPLES_COPY.reflectionB,
  [SAMPLES_EXPERIMENT_C]: SAMPLES_COPY.reflectionC,
};

export const SAMPLES_PREDICT_OPTIONS_BY_EXPERIMENT: Record<
  SamplesExperimentId,
  Array<{ value: SamplesPredictOutcome; label: string }>
> = {
  [SAMPLES_EXPERIMENT_A]: SAMPLES_PREDICT_OUTCOMES_A,
  [SAMPLES_EXPERIMENT_B]: SAMPLES_PREDICT_OUTCOMES_B,
  [SAMPLES_EXPERIMENT_C]: SAMPLES_PREDICT_OUTCOMES_C,
};

export const SAMPLES_TUTOR_GOALS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.OBSERVE]: "只帮学生把看见的大小和轻重说清楚",
  [LearningStage.DESCRIBE]: "帮学生分开说：样品、大小、轻重",
  [LearningStage.PREDICT]: "帮学生写下猜测和理由，不要透露实验结果",
  [LearningStage.EXPERIMENT]: "实验阶段不要调用导师",
  [LearningStage.EXPLAIN]: "帮学生把三次比较连成质量和体积的关系，不要替学生写出完整比值",
  [LearningStage.MODEL]: "指出缺了质量或体积，但不要替学生把比值建好",
  [LearningStage.TRANSFER]: "等学生先判断关系和条件，不要先说出这是同一个 ρ = m / V",
  [LearningStage.EXAM]: "保持考试题顺序，不要说出正确答案",
};

export const SAMPLES_FOOTER: Record<(typeof LEARNING_STAGE_ORDER)[number], string> = {
  [LearningStage.ENTRY]: "",
  [LearningStage.OBSERVE]: "先看两块样品的大小和轻重，再记下你看到的。",
  [LearningStage.DESCRIBE]: "试着说出：什么物体、大小怎样、轻重怎样。",
  [LearningStage.PREDICT]: "先猜，再动手。",
  [LearningStage.EXPERIMENT]: "改一个比较方式，对照一下刚才的猜测。",
  [LearningStage.EXPLAIN]: "先说清楚为什么，不要急着套公式。",
  [LearningStage.MODEL]: "自己把质量和体积怎样得到密度写清楚。",
  [LearningStage.TRANSFER]: "情况换了，看看刚才的想法还能不能用。",
  [LearningStage.EXAM]: "先想清楚，再选答案，并写下理由。",
  [LearningStage.AI_OFF]: "这一页没有提示，也没有人帮你。",
  [LearningStage.COMPLETE]: "这些只是你刚才留下的思考痕迹，不是掌握程度。",
};

export const SAMPLES_EXAM_COPY = {
  notice: "现在先不看样品。先把题目想清楚，再选答案。",
  progress: "第 {n} 题 / 共 {total} 题",
  about: "这道题主要在考哪个物理关系？",
  relationship: "你准备用哪条已经学过的关系？",
  continueToModel: "继续",
  revealChoices: "再看选项",
  choose: "选择最合适的一句",
  reasonLabel: "用你想到的关系，写一句理由。",
  reasonPlaceholder: "不要只重复选项。写出题目里真正用到的关系。",
  submit: "记下这题",
  needSteps: "先想清楚题目在考什么、该用哪条关系，再选答案并写下理由。",
  retry: "再看一遍题目",
  next: "下一题",
  stores: "选择和理由会分开记下。",
  hint: "再看一步提示",
  hintDone: "提示已经到这一步能给的位置了。",
} as const;

export const SAMPLES_AI_OFF_COPY = {
  progress: "第 {n} 题 / 共 {total} 题",
  choose: "选择你的判断",
  reasonLabel: "用你自己的话说明理由。",
  reasonPlaceholder: "写出质量和体积怎样决定密度。不要只重复选项。",
  commit: "记下这次判断",
  needResponse: "先做出判断，再用自己的话写下理由。",
  committedTitle: "你刚才独立写下的内容",
  postCheckPrompt: "你的判断主要依据哪些事实？",
  postCheckSubmit: "记下这些依据",
  postCheckNeed: "请标出你刚才判断时用到的事实。",
  retry: "再独立写一次",
  feedbackFail: "这次还不能算独立完成。你刚才写下的内容会留着。",
  feedbackRetry: "可以再独立写一次。第一次写下的内容不会被改掉。",
} as const;

export const SAMPLES_COMPLETE_COPY = {
  title: "你已经完成了这次学习循环和独立挑战。",
  caution:
    "这只说明你完成了这次要做的事，不表示已经掌握所有密度问题，也不保证考试一定会更好。",
  theme:
    "今天真正要抓住的，不是这两块样品长什么样，而是：密度是单位体积的质量，比较密度必须同时看质量和体积。",
  demonstratedTitle: "这次你做了这些事",
  demonstrated: [
    "能从现象中分开质量和体积；",
    "能用实验检查自己的预测；",
    "能建立 ρ = m / V 这个比值；",
    "能把这个关系用到新情境和考试题；",
    "能在没有 AI 提示时独立判断新问题。",
  ],
  reviewTitle: "回头看看",
  reviewPredict: "你的预测",
  reviewExperiment: "实验结果",
  reviewModel: "你建立的关系",
  reviewTransfer: "你完成的迁移",
  reviewIndependent: "独立挑战",
} as const;

export const SAMPLES_EXPLAIN_DENSITY_VS_MASS = [
  { value: "not-same", label: "不是同一件事。密度不是“更重”，也不是“更大”。" },
  { value: "density-is-mass", label: "密度就是质量的另一个名字。" },
  { value: "density-is-size", label: "密度就是看起来有多大。" },
] as const;

export const SAMPLES_EXPLAIN_SAME_VOLUME = [
  { value: "heavier-denser", label: "体积相同，更沉的密度更大。" },
  { value: "heavier-always-denser", label: "更重的密度一定更大，不用看体积。" },
  { value: "same-density", label: "体积相同，所以密度一定相同。" },
] as const;

export const SAMPLES_EXPLAIN_SAME_MASS = [
  { value: "larger-less-dense", label: "质量相同，占空间更大的密度更小。" },
  { value: "bigger-always-denser", label: "看起来更大的密度一定更大。" },
  { value: "same-density", label: "质量相同，所以密度一定相同。" },
] as const;

export const SAMPLES_EXPLAIN_UNIFORM_CUT = [
  { value: "density-unchanged", label: "质量和体积按同样比例变，密度几乎不变。" },
  { value: "cut-lowers-density", label: "变小了，所以密度一定变小。" },
  { value: "mass-down-density-down", label: "质量变小了，密度就一定变小。" },
] as const;

export const SAMPLES_MODEL_QUANTITY_OPTIONS = [
  { value: "mass", label: "质量 m" },
  { value: "volume", label: "体积 V" },
  { value: "density", label: "密度 ρ" },
  { value: "size", label: "看起来有多大" },
  { value: "chemical-energy", label: "化学能" },
] as const;

export const SAMPLES_MODEL_SAME_VOLUME_OPTIONS = [
  { value: "larger-mass-larger-density", label: "质量更大，密度更大" },
  { value: "heavier-always-denser", label: "更重就一定更密，体积不用管" },
  { value: "same-volume-same-density", label: "体积相同，密度一定相同" },
] as const;

export const SAMPLES_MODEL_SAME_MASS_OPTIONS = [
  { value: "larger-volume-smaller-density", label: "体积更大，密度更小" },
  { value: "bigger-always-denser", label: "看起来更大，密度一定更大" },
  { value: "same-mass-same-density", label: "质量相同，密度一定相同" },
] as const;

export const SAMPLES_MODEL_CUT_OPTIONS = [
  { value: "density-unchanged", label: "质量和体积同比例变，密度不变" },
  { value: "cut-lowers-density", label: "切开以后密度变小" },
  { value: "must-stop", label: "合力为零就一定静止" },
] as const;

export const SAMPLES_MODEL_CONDITION_OPTIONS = [
  { value: "volume-positive", label: "体积必须大于零，不能只用“看起来很大”代替" },
  { value: "uniform-sample", label: "内部均匀时，切开后密度可以保持不变" },
  { value: "energy-conversion-chain", label: "化学能转化成内能再变成机械能" },
  { value: "force-equals-motion", label: "力的方向必须等于运动方向" },
  { value: "bigger-means-denser", label: "谁看起来更大，密度就更大" },
] as const;

export const SAMPLES_MODEL_ROW_IDS = [
  "ratio",
  "same-volume",
  "same-mass",
  "cut",
] as const;

export type SamplesModelRowId = (typeof SAMPLES_MODEL_ROW_IDS)[number];

export const SAMPLES_TRANSFER_RELATIONS = [
  {
    id: "density-is-mass-per-volume",
    label: "密度是单位体积的质量",
  },
  {
    id: "same-volume-larger-mass-larger-density",
    label: "体积相同时，质量更大则密度更大",
  },
  {
    id: "same-mass-larger-volume-smaller-density",
    label: "质量相同时，体积更大则密度更小",
  },
  {
    id: "uniform-cut-leaves-density-unchanged",
    label: "均匀切开后密度不变",
  },
  {
    id: "density-alone-does-not-explain-floating",
    label: "单靠密度不能直接说明浮沉",
  },
] as const;
