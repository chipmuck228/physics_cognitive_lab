import { LEARNING_STAGE_ORDER, LearningStage } from "@/types/learning";
import { STUDENT_STAGE_LABELS } from "@/lib/content/student-language";
import type { EngineStroke } from "@/lib/physics/engine";

export const ENGINE_PHASE5_STAGES = [
  LearningStage.ENTRY,
  LearningStage.OBSERVE,
  LearningStage.DESCRIBE,
  LearningStage.PREDICT,
  LearningStage.EXPERIMENT,
  LearningStage.EXPLAIN,
  LearningStage.MODEL,
] as const;

export const ENGINE_PHASE6_STAGES = [
  ...ENGINE_PHASE5_STAGES,
  LearningStage.TRANSFER,
] as const;

export const ENGINE_PHASE7_STAGES = [
  ...ENGINE_PHASE6_STAGES,
  LearningStage.EXAM,
] as const;

export const ENGINE_PHASE8_STAGES = [
  ...ENGINE_PHASE7_STAGES,
  LearningStage.AI_OFF,
  LearningStage.COMPLETE,
] as const;

export const ENGINE_PHASE4_STAGES = ENGINE_PHASE5_STAGES;

export const ENGINE_PHASE3_STAGES = ENGINE_PHASE4_STAGES;

export const ENGINE_SCENE_ID = "four-stroke-engine" as const;

export const ENGINE_STAGE_LABELS = STUDENT_STAGE_LABELS;

export const ENGINE_STAGE_PROMPTS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.ENTRY]: "先看它动一遍。不用记名字。",
  [LearningStage.OBSERVE]: "先别管每一步叫什么。看一遍以后，你注意到了哪些变化？",
  [LearningStage.DESCRIBE]: "看着这个时候的发动机。活塞在怎么动？气体发生了什么？",
  [LearningStage.PREDICT]: "先停在这里。你觉得接下来会发生什么？先猜就可以。",
  [LearningStage.EXPERIMENT]: "好，现在让它继续运行。看看和你刚才猜的一样不一样。",
  [LearningStage.EXPLAIN]: "刚才活塞自己动起来了吗？让它发生明显运动的能量从哪里来？",
  [LearningStage.MODEL]: "现在把一整轮放在一起看。这四段虽然动作不同，但它们一起完成了一件什么事？",
  [LearningStage.TRANSFER]: "先把四冲程的名字放一边。能量从哪里来？最后让什么东西动起来？",
  [LearningStage.EXAM]: "题目只是把刚才那条能量关系换了一种问法。",
  [LearningStage.AI_OFF]: "最后一个新的情况。这一次你自己判断。",
  [LearningStage.COMPLETE]: "回头看看你刚才想了什么。",
};

export const ENGINE_COPY = {
  headline: "先看它怎样动",
  subheadline: "不用记名字，先看看哪些东西在动、什么时候发生变化。",
  startCta: "开始探索",
  observeInstruction: "先看一遍正常运转。留意活塞、气门，还有有没有出现燃烧。",
  observePrompt: "下面这些，哪些是你确实看见的？可以多选。先别管每一步叫什么。",
  observeSubmit: "记下看到的",
  observeNeedMore: "再看看：活塞怎样动？气门或燃烧有没有变化？",
  observeSaved: "你已经记下看到的变化了。",
  describeInstruction:
    "看着这个时候的发动机。用自己的话说说：活塞在怎么动？气体发生了什么？哪边开着，哪边关着？不必使用冲程名称。",
  snapshotA: "画面 1",
  snapshotB: "画面 2",
  pistonLabel: "活塞",
  intakeLabel: "进气门",
  exhaustLabel: "排气门",
  combustionLabel: "燃烧",
  pistonUp: "向上",
  pistonDown: "向下",
  pistonHeld: "没有运动",
  valveOpen: "打开",
  valveClosed: "关闭",
  combustionPresent: "出现",
  combustionAbsent: "没出现",
  describeQuestion: "请用一句话描述这些画面里发生了什么。",
  describePlaceholder: "例如：活塞向下运动，进气门打开。",
  describeSubmit: "记下这句话",
  describeNeedStructure: "先把画面里能看见的变化选清楚，再用自己的话说一句。",
  predictAQuestion:
    "如果压缩之后没有发生燃烧，发动机还会像刚才一样产生主要动力吗？",
  predictBQuestion:
    "如果燃烧正常发生，但活塞不能运动，还能像正常情况一样输出机械动力吗？",
  predictInstruction: "先猜就可以。等会儿真的改一个条件看一看。没有理由也可以先猜。",
  predictNotExam: "这里不用答对。先猜，等会儿用实验看看。",
  reasonAvailability: "你现在想到理由了吗？",
  reasonHasIdea: "我有一个想法",
  reasonGuessOnly: "我就是先猜猜",
  reasonUnknown: "我现在还说不上来",
  predictSubmit: "记下我的猜测",
  predictNeedBoth: "先选出你的猜测。没有理由也可以先猜。",
  predictNeedStance: "先说你现在有没有一个理由。",
  predictNeedIdeaText: "你选了有一个想法。先写一句，或改成“我现在还说不上来”。",
  predictCommitted: "猜测已经记下。接下来才能改条件看一看。",
  predictLocked: "刚才记下的猜测",
  reasonLabel: "你为什么这样想？",
  reasonPlaceholder: "用一两句话写下你的想法。不必使用课本名称。没有也没关系。",
  experimentInstruction: "改一个条件，看看是不是和你想的一样。",
  runA: "关掉燃烧，看一看",
  runB: "让活塞不能运动，看一看",
  runLocked: "先记下猜测，才能做这个实验。",
  rerun: "再看一遍这次实验",
  observedQuestion: "你实际看到了什么？",
  observedCombustion: "有没有发生燃烧？",
  observedMotion: "活塞或机构有没有在运动？",
  observedOutput: "有没有正常的主要动力输出？",
  observedMotionB: "活塞有没有正常向下运动？",
  observedOutputB: "动力输出是否成功？",
  yes: "有",
  no: "没有",
  motionYes: "还在运动",
  motionNo: "没有运动",
  outputYes: "有正常的主要动力输出",
  outputNo: "没有正常的主要动力输出",
  outputYesB: "成功了",
  outputNoB: "没有成功",
  motionHint: "“它还在动”和“它正在提供主要动力”，是不是同一件事？先按你看见的来选。",
  observeSubmitExperiment: "记下看到的结果",
  observeNeedAll: "这三件事请分别选一选，不要合成一句话。",
  compareQuestion: "实验结果和你刚才的预测一样吗？",
  compareSame: "差不多一样",
  compareDifferent: "不太一样",
  comparePartial: "我还不确定",
  compareSubmit: "记下对照",
  reflectionA:
    "从这个实验里，你觉得燃烧对发动机产生动力有什么作用？",
  reflectionB:
    "这次燃烧已经发生了，为什么仍然没有正常的机械动力输出？",
  reflectionPlaceholder: "用一两句写下你现在想到的。先不必说完整的能量过程。",
  reflectionSubmit: "记下想法",
  reflectionNeedWords: "先用自己的话写一两句。",
  experimentAClosed: "第一次实验已经记下。",
  experimentBClosed: "第二次实验已经记下。",
  phase4Title: "这一段先到这里",
  phase4Body: "你已经做完这两次实验。后面的解释还在准备中。",
  explainLead:
    "刚才活塞自己动起来了吗？让它发生明显运动的能量从哪里来？",
  explainFollow:
    "燃料中的能量要经过哪些过程，才能最后让机械系统运动起来？先按你看见的来想，不必先背名词。",
  explainEvidenceTitle: "你刚才记下的两次实验",
  explainEvidenceA: "实验 1：没有正常燃烧 → 没有主要动力输出",
  explainEvidenceB: "实验 2：发生燃烧，但活塞被卡住 → 输出仍被阻断",
  explainStep1: "燃烧发生后，最先明显变化的是谁？",
  explainStep2: "变化后的气体怎样影响活塞或机械系统？",
  explainStep3: "机械系统为什么会获得运动？",
  explainOwnWords: "再用一两句，把你现在想到的关系说出来。",
  explainPlaceholder: "例如：燃烧以后气体变了，然后才推动机械部分。",
  explainSubmit: "记下这个解释",
  explainNeedMore: "先把三步选清楚，再用自己的话写一两句。不要把燃烧说成直接推动曲轴。",
  explainHint: "再看一步提示",
  explainHintDone: "提示已经到这一步能给的位置了。",
  play: "播放",
  pause: "暂停",
  next: "下一冲程",
  replay: "重看",
  engineAria: "四冲程发动机",
  landingKicker: "场景 02",
  landingTitle: "四冲程发动机",
  landingBody: "先看它动一遍。不用记名字，先看看哪些东西在动、什么时候发生变化。",
  landingCta: "开始探索",
} as const;

export const ENGINE_TUTOR_GOALS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.OBSERVE]:
    "帮学生先看清哪些东西在变化。不要说出能量转化，也不要把冲程名称当作答案。",
  [LearningStage.DESCRIBE]:
    "帮学生把看见的现象说清楚：谁在运动、往哪个方向、气门和燃烧有什么变化。不要说出化学能、内能或机械能，也不要求背冲程名称。",
  [LearningStage.PREDICT]:
    "帮学生先做出猜测。没有理由也可以先猜。不要透露实验结果，不要说出化学能、内能或机械能。",
  [LearningStage.EXPLAIN]:
    "帮学生从两次实验证据里找出因果环节。先问实验里卡住的是哪一步。不要一次给出化学能到机械能的完整链。",
  [LearningStage.MODEL]:
    "可以指出缺了哪一环，但不能替学生把整条链建好。不要把燃烧说成一个能量储存的量。",
  [LearningStage.TRANSFER]:
    "帮学生检查哪些关系能用到新情境。不要在第一次尝试前说出模型名称，也不要直接说只有后半段可以迁移。",
  [LearningStage.EXAM]:
    "帮学生先想清楚题目在考什么、该用哪条关系。不要在学生提交前说出正确选项，也不要一次给出完整解答。",
};

export const ENGINE_FORBIDDEN_REVEAL_TERMS = [
  "化学能",
  "内能",
  "机械能",
] as const;

export const ENGINE_FOOTER: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.ENTRY]: "",
  [LearningStage.OBSERVE]: "先看它怎么动，再记下你看见的。",
  [LearningStage.DESCRIBE]: "说出谁在动、往哪动、气门和燃烧有什么变化。",
  [LearningStage.PREDICT]: "先猜，再动手。",
  [LearningStage.EXPERIMENT]: "改一个条件，对照一下刚才的猜测。",
  [LearningStage.EXPLAIN]: "从两次实验出发，说说中间经过了什么。",
  [LearningStage.MODEL]: "自己把因果顺序连起来。",
  [LearningStage.TRANSFER]: "先看这里什么变了、什么被推动，再决定哪些关系还能用。",
  [LearningStage.EXAM]: "先想清楚题目在考什么，再选答案，并写下理由。",
  [LearningStage.AI_OFF]: "这一页没有提示，也没有人帮你。",
  [LearningStage.COMPLETE]: "这些只是你刚才留下的思考痕迹，不是掌握程度。",
};

export type EngineObserveKind = "piston" | "valve" | "combustion" | "distractor";

export interface EngineObserveOption {
  id: string;
  label: string;
  kind: EngineObserveKind;
}

export const ENGINE_OBSERVE_OPTIONS: EngineObserveOption[] = [
  {
    id: "piston-up-down",
    label: "活塞会上下运动",
    kind: "piston",
  },
  {
    id: "intake-opens",
    label: "有时进气门打开",
    kind: "valve",
  },
  {
    id: "exhaust-opens",
    label: "有时排气门打开",
    kind: "valve",
  },
  {
    id: "combustion-one-stage",
    label: "有一个阶段出现燃烧",
    kind: "combustion",
  },
  {
    id: "combustion-every-stage",
    label: "每个阶段都会发生燃烧",
    kind: "distractor",
  },
  {
    id: "piston-only-down",
    label: "活塞始终只向下运动",
    kind: "distractor",
  },
];

export type EnginePistonChoice = "up" | "down" | "held";
export type EngineValveChoice = "open" | "closed";
export type EngineCombustionChoice = "present" | "absent";

export interface EngineSnapshotSpec {
  id: "snapshot-a" | "snapshot-b";
  stroke: EngineStroke;
  label: string;
  expected: {
    piston: EnginePistonChoice;
    intake: EngineValveChoice;
    exhaust: EngineValveChoice;
    combustion: EngineCombustionChoice;
  };
}

export const ENGINE_DESCRIBE_SNAPSHOTS: EngineSnapshotSpec[] = [
  {
    id: "snapshot-a",
    stroke: "intake",
    label: ENGINE_COPY.snapshotA,
    expected: {
      piston: "down",
      intake: "open",
      exhaust: "closed",
      combustion: "absent",
    },
  },
  {
    id: "snapshot-b",
    stroke: "power",
    label: ENGINE_COPY.snapshotB,
    expected: {
      piston: "down",
      intake: "closed",
      exhaust: "closed",
      combustion: "present",
    },
  },
];

export const ENGINE_EXPERIMENT_A = "ignition-energy-release" as const;
export const ENGINE_EXPERIMENT_B = "immovable-mechanical-system" as const;

export type EngineSceneExperimentId =
  | typeof ENGINE_EXPERIMENT_A
  | typeof ENGINE_EXPERIMENT_B;

export const ENGINE_EXPERIMENT_ORDER: EngineSceneExperimentId[] = [
  ENGINE_EXPERIMENT_A,
  ENGINE_EXPERIMENT_B,
];

export type EnginePredictOutcome = "main-output" | "no-main-output" | "unsure";

export const ENGINE_VOCAB = {
  piston: {
    term: "活塞",
    body: "这个上下运动的部件叫活塞。",
  },
  cylinder: {
    term: "气缸",
    body: "活塞在这个空间里上下运动。",
  },
} as const;

export const ENGINE_PREDICT_REASON_STANCES = [
  { value: "has-idea", label: ENGINE_COPY.reasonHasIdea },
  { value: "guess-only", label: ENGINE_COPY.reasonGuessOnly },
  { value: "unknown", label: ENGINE_COPY.reasonUnknown },
] as const;

export const ENGINE_PREDICT_OUTCOMES: Array<{
  value: EnginePredictOutcome;
  label: string;
}> = [
  { value: "main-output", label: "还能产生主要动力" },
  { value: "no-main-output", label: "不能产生主要动力" },
  { value: "unsure", label: "不确定" },
];

export const ENGINE_COMPARE_OPTIONS = [
  { value: "same", label: ENGINE_COPY.compareSame },
  { value: "different", label: ENGINE_COPY.compareDifferent },
  { value: "partial", label: ENGINE_COPY.comparePartial },
] as const;

export const ENGINE_EXPLAIN_STEP1 = [
  { value: "working-gas", label: "气缸里的气体" },
  { value: "direct-crank", label: "曲轴直接被燃烧推着转" },
  { value: "intake-valve", label: "进气门" },
] as const;

export const ENGINE_EXPLAIN_STEP2 = [
  { value: "gas-pushes", label: "气体变化以后，推动活塞或机械系统" },
  { value: "fire-turns", label: "燃烧直接让曲轴转起来" },
  { value: "valves-spin", label: "气门开关让它转起来" },
] as const;

export const ENGINE_EXPLAIN_STEP3 = [
  { value: "work-like", label: "气体对机械系统产生了推动，机械部分才得到运动" },
  { value: "fire-is-power", label: "燃烧本身就是动力" },
  { value: "stroke-names", label: "因为吸气、压缩、做功、排气排好了顺序" },
] as const;

export const ENGINE_MODEL_COPY = {
  instruction: "现在把一整轮放在一起看。四段动作不同，但它们一起完成一件事。把能量从燃料到机械运动的过程连起来。燃烧是使转化能够发生的事件，不是一种被储存的能量。不要只靠冲程名字。",
  bankLabel: "可以选用的卡片",
  slotsLabel: "按发生的顺序放进格子",
  relationLabel: "两张卡片之间是什么关系？",
  combustionEnable:
    "燃烧发生：让燃料的化学能转化成工作气体的内能/状态变化。",
  combustionNote: "燃烧是过程，不是一张“能量卡片”。",
  glossaryTitle: "这几个词现在可以用",
  glossaryChemical: "化学能：燃料里储存的、可以通过燃烧转化的能量。",
  glossaryInternal: "内能：物体或气体内部的能量，状态变化时它也会变。",
  glossaryWork: "做功：一个物体通过力和运动把能量传给另一个系统。",
  glossaryMechanical: "机械能：和机械运动对应的能量。",
  evidenceTitle: "两次实验还在这里",
  evidenceA: "实验 1：没有正常燃烧 → 没有主要动力输出",
  evidenceB: "实验 2：发生燃烧，但活塞被卡住 → 输出仍被阻断",
  submit: "记下这条关系",
  needStructure: "先把卡片放进格子，再标出它们之间的关系。",
  phase5Title: "你已经建立了这个物理模型。",
  phase5Body: "下一步会试着把它用到新的情境里。",
  relationNone: "还没连",
  relationConversion: "转化",
  relationWork: "做功",
  relationGains: "得到机械能",
} as const;

export const ENGINE_TRANSFER_COPY = {
  fullQuestion: "先把四冲程的名字放一边。这里发生的过程和刚才的发动机，哪些物理关系是相同的？能量从哪里来？最后让什么东西动起来？",
  partialQuestion: "刚才模型中的哪些关系在这里还能用？哪些关系不能直接照搬？",
  reminderTitle: "刚才建立的模型",
  reminderBody:
    "下面是已经学过的关系。这个新情境里该用哪几条，要你自己判断，这里不会提前标出来。",
  applies: "这里还能用",
  notNecessarily: "不一定能照搬",
  markApplies: "这里也有这条关系",
  orderLabel: "如果这些关系在这里成立，按发生的先后点选它们",
  orderHint: "先点较早发生的关系。点错了可以重新排。",
  resetOrder: "重新排顺序",
  surfaceCue: "都有活塞，所以是同一个模型。",
  ownWordsFull: "用自己的话说说：能量是怎样一步步到机械运动的？",
  ownWordsPartial: "用自己的话说说：哪些还能用，哪些因为条件不同而不能直接照搬？",
  submit: "记下这次判断",
  needMore: "再检查关系，并写一句自己的理由。",
  tryMedium: "换一个实验室装置再试试",
  hint: "再看一步提示",
  hintDone: "提示已经到这一步能给的位置了。",
  phase6Title: "你已经把这个模型用到了新的情境。",
  phase6Body:
    "下一步会看看考试题怎样把同一个物理模型换一种方式来表示。",
} as const;

export const ENGINE_EXAM_COPY = {
  notice: "现在先不看发动机。题目只是把刚才那条能量关系换了一种问法。先把题目想清楚，再选答案。",
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
  phase7Title: "你已经把这个物理模型用到了考试题里。",
  phase7Body: "最后一步将是不使用 AI 的独立挑战。",
  hint: "再看一步提示",
  hintDone: "提示已经到这一步能给的位置了。",
} as const;

export const ENGINE_AI_OFF_COPY = {
  progress: "第 {n} 题 / 共 {total} 题",
  choose: "选择你的判断",
  reasonLabel: "能量从哪里来，经过了什么变化，最后表现在哪里？用你自己的话说明。",
  reasonPlaceholder: "写出你认为真正起作用的过程和条件。不要只重复选项。",
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

export const ENGINE_COMPLETE_COPY = {
  title: "这次先到这里",
  caution:
    "这只说明你完成了这次要做的事，不表示已经掌握所有发动机或能量问题。",
  theme:
    "一开始你只是看到活塞上下运动。后来你发现，不同阶段做的事情不同。再后来你把燃烧、气体变化和活塞运动连成了一条能量关系。最后你在新的装置里又找到了这条关系。真正要抓住的，不是四个冲程的名字。",
  demonstratedTitle: "这次你走过的路",
  demonstrated: [
    "一开始：先看发动机怎样动；",
    "后来：用实验检查自己的猜测；",
    "再后来：把燃烧、气体变化和活塞运动连起来；",
    "最后：在新情境和没有提示时自己用这条关系。",
  ],
  reviewTitle: "你留下的痕迹",
  reviewPredict: "你的预测",
  reviewExperiment: "实验结果",
  reviewModel: "你建立的模型",
  reviewTransfer: "你完成的迁移",
  reviewIndependent: "独立挑战",
} as const;

export const ENGINE_MODEL_QUANTITY_NODES = [
  { id: "fuel-chemical-energy", label: "燃料的化学能" },
  { id: "working-gas-internal-energy-or-state", label: "工作气体的内能/状态" },
  { id: "mechanical-system", label: "机械系统" },
  { id: "mechanical-energy", label: "机械能" },
] as const;

export const ENGINE_MODEL_DISTRACTOR_NODES = [
  { id: "combustion-quantity", label: "燃烧" },
  { id: "stroke-intake", label: "吸气冲程" },
  { id: "stroke-compression", label: "压缩冲程" },
  { id: "stroke-power", label: "做功冲程" },
  { id: "stroke-exhaust", label: "排气冲程" },
] as const;

export const ENGINE_MODEL_SLOT_COUNT = 4;

export const ENGINE_MODEL_RELATIONS = [
  { value: "conversion" as const, label: ENGINE_MODEL_COPY.relationConversion },
  { value: "work" as const, label: ENGINE_MODEL_COPY.relationWork },
  { value: "gains" as const, label: ENGINE_MODEL_COPY.relationGains },
];
