import { LEARNING_STAGE_ORDER } from "@/types/learning";

import { STUDENT_STAGE_PROMPTS } from "@/lib/content/student-language";

export const SCENE_ID = "microwave-bread" as const;

export const SCENE_COPY = {
  productName: "物理思考实验室",
  headline: "面包放进微波炉，为什么会变热？",
  subheadline: "一起来看看。",
  startCta: "开始",
  observeInstruction: "打开微波炉，仔细看看面包发生了什么。",
  observePrompt: "先写下你真正看到的，先别急着解释。",
  observeQuestion: "你看到了什么？",
  observePlaceholder: "例如：面包变热了。",
  observeSubmit: "记下看到的",
  describeInstruction: "刚才可以说“变热了”。现在试着用更清楚的话说：到底什么变了？",
  describeQuestion: "面包到底发生了什么变化？",
  describePlaceholder: "例如：面包的温度升高了。",
  describeSubmit: "记下这句话",
  describeNeedsPhysics:
    "“变热了”说得通，但还不够。试着说出是哪个量在怎样变化。",
  predictInstruction: "先别急着再加热。先猜一猜，再说说你为什么这样想。",
  predictQuestion: "如果加热时间更长，你觉得温度会怎样？",
  predictSubmit: "记下我的猜测",
  experimentInstruction: "改一个加热条件，看看实际结果是不是和你想的一样。",
  experimentCompareQuestion: "实际结果和你刚才猜的，一样吗？",
  experimentReflectionQuestion: "这次动手，让你看清了什么？",
  experimentSubmit: "记下对照",
  experimentNeedNewRun:
    "刚才那次只是先看一看。猜完以后，还要再做一次，才能对照。",
  explainInstruction: "说说为什么温度会升高。先想面包里面发生了什么变化。",
  explainQuestion: "为什么会这样？",
  explainSubmit: "记下我的想法",
  modelInstruction:
    "把想法连起来：能量进入之后，中间发生了什么，最后温度才升高？",
  modelSubmit: "记下这条因果链",
  examInstruction:
    "现在先不看微波炉。先说这道题主要在问什么，再想想该用什么关系。选项会在那之后出现。",
  examNotice: "现在先不看微波炉。先把题目想清楚，再选答案。",
  examWorldLabel: "像考试一样做",
  examContinueToModel: "下一步：想想该用什么关系",
  examRevealChoices: "现在再看选项",
  aiOffBanner: "现在自己试试。",
  aiOffInstruction: "这一页没有提示，也看不到刚才的问句。请自己想、自己写。",
  independentExplainSubmit: "记下我的解释",
  independentExamIntro: "再自己做一道题。",
  independentExamSubmit: "提交这道题",
  completeTitle: "你刚才想了这些",
  completeCaution:
    "这些圆点只是这次留下的思考痕迹。它们不是分数，也不表示你已经学会了物理。",
  heatingCta: "开始加热",
  heatingInProgress: "加热中…",
  heatAgainCta: "再加热一次",
  resetBreadCta: "让面包回到开始温度",
  heatingComplete: "加热结束。",
  lastRun: "刚才那一次",
  continueLater: "先看变化。后面再慢慢说清楚。",
  yourObservation: "你刚才看到的",
  yourDescription: "你刚才的说法",
  tryPhysicsLanguage: "再用更清楚的话说一次",
  yourGuess: "你刚才的猜测",
  comparedReady: "你已经对照过猜测和结果了。",
  continueToWhy: "接下来想想为什么",
  whatYouTested: "你刚才试的",
  noSavedGuess: "还没有记下猜测。",
  yourWhy: "你刚才的想法",
  noSavedWhy: "还没有写下为什么。",
  yourChain: "你刚才连起来的想法",
  situationsDoneTitle: "这几个情况都想过了",
  situationsDoneBody: "情况换了，你也试着解释了。接下来像考试一样，先想清楚再选。",
  examIntroTitle: "先想清楚再选",
  examDoneTitle: "这几道题做完了",
  examDoneBody: "接下来是独立挑战：没有提示，自己完成。",
  landingKicker: "场景 01",
  landingTitle: "微波炉里的面包",
  landingBody:
    "一片面包放进微波炉加热。实验室负责把变化呈现出来，思考交给你。",
  landingCta: "进入实验室",
  inputReady: "写好后会先记下来。",
  inputNeedMore: "先写一两句。",
  helpfulObserveWords: "可以先用这些词",
  physicsWords: "可以试试这些词",
  chooseGuess: "先选一个猜测。",
  whyGuess: "你为什么这样想？",
  whyGuessPlaceholder: "用一两句话说说你的想法。",
  guessBeforeTest: "先猜完，再动手。",
  comparePlaceholder: "说说结果和猜测一样还是不一样，哪里不一样。",
  reflectionPlaceholder: "用一两句写下这次动手让你看清了什么。",
  compareHint: "先对照结果和猜测，再去想为什么。",
  explainPlaceholder: "例如：能量进入面包后，面包的内能发生了变化，温度升高。",
  chooseMiddle: "中间这一步，你觉得是什么？",
  connectRelationship: "把前后连起来。",
  connectTop: "连上上面一步",
  connectBottom: "连上下面一步",
  connected: "已连上",
  chooseMiddleFirst: "先选出中间这一步",
  buildYourself: "自己把顺序连好，再继续。",
  situationN: "第 {n} 个情况，共 {total} 个",
  yourTake: "你怎么解释？",
  transferPlaceholder: "用刚才的想法解释这个新情况。",
  transferHint: "先想：能量怎样进来，什么发生了变化。",
  saveSituation: "记下这个情况",
  examProgress: "第 {n} 题，共 {total} 题",
  examAbout: "1. 这道题主要在问什么？",
  examRelationship: "2. 你觉得该想哪一种关系？",
  examChoose: "3. 选择你的答案。",
  examReasonStep: "4.",
  examSave: "记下这道题",
  examStores: "把你的想法记下来。",
  examReasonPlaceholder: "用你想到的关系，写一句理由。",
  independentKicker: "独立挑战",
  lookAtThis: "先看这个情况",
  yourIndependentWhy: "你的解释",
  independentPrompt: "这一页不会提示你，也不会帮你改。",
  independentPlaceholder: "用你自己的想法解释温度为什么会变。",
  learningLookback: "回头看看",
  power: "功率",
  heatingTime: "加热时间",
  initialTemperature: "开始温度",
  finalTemperature: "后来温度",
  breadTemperature: "面包温度",
  microwaveAria: "微波炉里有一片面包",
  resetBreadAria: "让面包回到开始的温度",
} as const;

/** Scene 01 local labels. Shared registry lives in student-language.ts. */
export const STAGE_LABELS: Record<(typeof LEARNING_STAGE_ORDER)[number], string> = {
  ENTRY: "开始",
  OBSERVE: "先观察",
  DESCRIBE: "说说你看到的",
  PREDICT: "猜一猜",
  EXPERIMENT: "动手试试",
  EXPLAIN: "想想为什么",
  MODEL: "把想法连起来",
  TRANSFER: "换个情况试试",
  EXAM: "像考试一样做",
  AI_OFF: "独立挑战",
  COMPLETE: "回头看看",
};

export const STAGE_PROMPTS: Partial<Record<(typeof LEARNING_STAGE_ORDER)[number], string>> =
  STUDENT_STAGE_PROMPTS;

export const OBSERVATION_VOCAB = ["更热", "变热了", "冒热气", "变软了"] as const;

export const DESCRIPTION_VOCAB = [
  "面包",
  "温度",
  "升高",
  "能量",
  "内能",
] as const;

export const EXPLANATION_VOCAB = [
  "能量",
  "进入",
  "面包",
  "内能",
  "温度",
  "升高",
] as const;

export const PREDICTION_OPTIONS = [
  {
    value: "temperature increases",
    label: "温度会升高。",
  },
  {
    value: "temperature stays about the same",
    label: "温度差不多不变。",
  },
  {
    value: "temperature decreases",
    label: "温度会降低。",
  },
  {
    value: "not sure",
    label: "我还不确定。",
  },
] as const;

export const MICROWAVE_EXPERIMENT_ID = "more-energy-in-no-phase-change" as const;

export const MICROWAVE_COMPARE_OPTIONS = [
  { value: "same", label: "和我猜的一样。" },
  { value: "different", label: "和我猜的不一样。" },
  { value: "partial", label: "只有一部分一样。" },
] as const;

export const MICROWAVE_OBSERVE_OPTIONS = [
  { id: "bread-warmer", label: "面包摸起来更热了，或者温度看起来升高了。" },
  { id: "light-only", label: "只看到微波炉灯亮了。" },
  { id: "nothing", label: "什么都没变。" },
] as const;

export const MICROWAVE_OBJECT_OPTIONS = [
  { value: "bread", label: "面包" },
  { value: "microwave-only", label: "微波炉" },
  { value: "room", label: "房间" },
] as const;

export const MICROWAVE_QUANTITY_OPTIONS = [
  { value: "temperature", label: "温度" },
  { value: "heat-stuff", label: "装在里面的热" },
  { value: "color", label: "颜色" },
] as const;

export const MICROWAVE_CHANGE_OPTIONS = [
  { value: "increases", label: "升高了" },
  { value: "same", label: "差不多没变" },
  { value: "decreases", label: "降低了" },
] as const;

export const MICROWAVE_EXPLAIN_ENERGY_OPTIONS = [
  { value: "energy-entered", label: "有能量进入面包。" },
  { value: "no-energy", label: "没有能量进出。" },
  { value: "heat-stored", label: "热量被装进面包里。" },
] as const;

export const MICROWAVE_EXPLAIN_LINK_OPTIONS = [
  { value: "energy-and-t", label: "能量进来后，温度升高了。" },
  { value: "u-and-t", label: "面包的内能变了，温度升高了。" },
  { value: "t-is-u", label: "温度升高就是内能这个词的另一种说法。" },
  { value: "microwave-only", label: "因为这是微波炉。" },
] as const;

export const MICROWAVE_MODEL_SYSTEM_OPTIONS = [
  { value: "bread", label: "面包这个系统" },
  { value: "microwave", label: "微波炉本身" },
  { value: "room", label: "整个房间" },
] as const;

export const MICROWAVE_MODEL_ENERGY_OPTIONS = [
  { value: "enters-system", label: "有能量进入这个系统。" },
  { value: "no-transfer", label: "没有能量进出。" },
  { value: "heat-stored-in", label: "热被装进物体里。" },
] as const;

export const MICROWAVE_MODEL_INTERNAL_OPTIONS = [
  { value: "changes", label: "系统的内能发生了变化。" },
  { value: "unchanged", label: "内能一定没变。" },
  { value: "same-as-temperature", label: "内能就是温度。" },
] as const;

export const MICROWAVE_MODEL_TEMPERATURE_OPTIONS = [
  { value: "may-change", label: "在适当条件下，温度可能改变。" },
  { value: "must-rise", label: "能量进来，温度就一定升高。" },
  { value: "same-as-internal-energy", label: "温度就是内能。" },
] as const;

export const MICROWAVE_MODEL_DISTINCTION_OPTIONS = [
  { value: "t-not-u", label: "温度不是内能。" },
  { value: "t-is-u", label: "温度就是内能。" },
  { value: "hotter-more-u", label: "更热就一定总内能更大。" },
] as const;

export const MICROWAVE_MODEL_CONDITION_OPTIONS = [
  { id: "no-phase-change", label: "没有物态变化时，才能这样推出温度升高。" },
  {
    id: "energy-in-does-not-require-temperature-rise",
    label: "能量进入，温度不一定升高。",
  },
  { id: "heat-is-process-not-store", label: "热不是装在物体里的东西。" },
] as const;

export const MICROWAVE_TRANSFER_RELATIONS = [
  {
    id: "energy-transfer-changes-internal-energy",
    label: "能量进入或离开系统时，系统的内能会改变。",
  },
  {
    id: "internal-energy-may-change-temperature",
    label: "在适当条件下，内能变化后温度可能升高。",
  },
  {
    id: "energy-in-does-not-always-raise-temperature",
    label: "能量进入，温度不一定升高。",
  },
  {
    id: "temperature-does-not-equal-internal-energy",
    label: "温度不是内能。",
  },
] as const;

export const MICROWAVE_KETTLE_CONDITION_PROBES = [
  {
    id: "system",
    prompt: "这里要把谁看成系统？",
    options: [
      { value: "water", label: "壶里的水" },
      { value: "microwave", label: "刚才的微波炉" },
      { value: "room", label: "整个房间" },
    ],
  },
  {
    id: "condition",
    prompt: "这里能不能直接推出温度升高？",
    options: [
      { value: "ordinary-heating", label: "可以。这是普通加热，没有物态变化。" },
      { value: "must-always-rise", label: "只要在加热，温度就一定升高。" },
      { value: "same-as-ice", label: "和水结冰时完全一样。" },
    ],
  },
] as const;

export const MICROWAVE_ICE_CONDITION_PROBES = [
  {
    id: "energy",
    prompt: "这里还可以有能量进入吗？",
    options: [
      { value: "energy-can-enter", label: "可以有能量进入。" },
      { value: "no-energy", label: "温度几乎不变，所以一定没有能量进出。" },
    ],
  },
  {
    id: "state",
    prompt: "内能或状态可以变吗？",
    options: [
      { value: "state-can-change", label: "内能或状态仍可以改变。" },
      { value: "unchanged", label: "温度不变，内能也一定不变。" },
    ],
  },
  {
    id: "limit",
    prompt: "刚才“温度会升高”那一句还能原样搬过来吗？",
    options: [
      { value: "cannot-transfer-unchanged", label: "不能原样搬过来，因为条件不一样。" },
      { value: "same-as-kettle", label: "能。还在吸热，所以温度一定升高。" },
    ],
  },
] as const;

export const MICROWAVE_AI_OFF_A_PRE_COMMIT = [
  {
    id: "energy-enters-spoon",
    prompt: "勺子这个系统有没有能量进入？",
    options: [
      { value: "energy-enters-spoon", label: "有能量进入勺子。" },
      { value: "no-energy", label: "没有能量进出。" },
    ],
  },
  {
    id: "spoon-u-changes",
    prompt: "勺子的内能怎样？",
    options: [
      { value: "spoon-u-changes", label: "勺子的内能发生了变化。" },
      { value: "t-is-u", label: "温度升高就是内能的另一种说法。" },
    ],
  },
  {
    id: "t-rose-as-observable",
    prompt: "温度升高说明什么？",
    options: [
      { value: "t-rose-as-observable", label: "温度升高是可以观察的结果，不是内能的另一个名字。" },
      { value: "because-metal", label: "因为它是金属，所以和刚才的关系不一样。" },
    ],
  },
  {
    id: "heat-not-stored",
    prompt: "热在这里是什么？",
    options: [
      { value: "heat-not-stored", label: "热不是装在勺子里的东西。" },
      { value: "heat-stored", label: "热量被装进勺子里。" },
    ],
  },
] as const;

export const MICROWAVE_AI_OFF_B_PRE_COMMIT = [
  {
    id: "energy-can-enter",
    prompt: "这里还可以有能量进入吗？",
    options: [
      { value: "energy-can-enter", label: "仍然可以有能量进入。" },
      { value: "no-energy", label: "看起来还是冷的，所以没有能量进出。" },
    ],
  },
  {
    id: "t-need-not-rise",
    prompt: "能量进入后，温度一定升高吗？",
    options: [
      { value: "t-need-not-rise", label: "能量进入，温度不一定升高。" },
      { value: "must-rise", label: "只要在吸收能量，温度就一定会升高。" },
    ],
  },
  {
    id: "t-unchanged-not-u-unchanged",
    prompt: "温度几乎不变，能写成内能一定不变吗？",
    options: [
      { value: "t-unchanged-not-u-unchanged", label: "不能。温度几乎不变，不能直接写成内能一定不变。" },
      { value: "looks-cold", label: "因为它看起来还是冷的，所以和课堂上的关系无关。" },
    ],
  },
] as const;

export const MICROWAVE_TASK_COPY = {
  observeNeedStructure: "先选出你真正看到的变化。只看一遍动画还不够。",
  describeObjectLabel: "你在说哪个对象？",
  describeQuantityLabel: "哪个量发生了变化？",
  describeChangeLabel: "它怎样变？",
  describeNeedStructure: "“变热了”还不够。请说出对象、哪个量和怎样变。",
  explainEnergyLabel: "能量怎样了？",
  explainLinkLabel: "这和温度有什么关系？",
  explainNeedStructure: "先把能量或内能，和温度变化连起来。不要只列出几个词。",
  modelSystemLabel: "你把谁看成系统？",
  modelEnergyLabel: "能量怎样进出？",
  modelInternalLabel: "内能怎样？",
  modelTemperatureLabel: "温度怎样？",
  modelDistinctionLabel: "温度和内能是同一件事吗？",
  modelConditionLabel: "还要标出哪一句限制？",
  modelAuthoredLabel: "用自己的话写一句关键区别。",
  modelAuthoredPlaceholder: "例如：温度不是内能。",
  modelNeedStructure: "只点格子还不够。还要写出一句真正的区别或条件。",
  transferSurfaceCue: "这只是另一种加热装置，所以和刚才一样。",
  transferNeedMore: "先判断每句话在这个情境里还能不能用，再用自己的话写清楚。",
  kettleQuestion: "用电热水壶加热水时，刚才的想法还能怎样用？",
  iceQuestion: "冰还在吸热，哪些想法还能用？哪一句不能原样搬过来？",
  experimentNeedPrediction: "先记下猜测，再加热对照。",
  experimentCompareLabel: "实际结果和你刚才猜的，一样吗？",
  experimentAlwaysHint:
    "这一次是普通加热。它不能证明：只要有能量进来，温度就一定升高。",
  aiOffNeedResponse: "先写出提交前的想法，再核对。",
  aiOffNeedPostCheck: "再核对这些句子。核对不能代替你刚才写下的想法。",
} as const;
