import { LearningStage } from "@/types/learning";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  LENS_EXPERIMENT_D,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";

export const LENS_COPY = {
  productName: "物理认知实验室",
  landingKicker: "场景 07",
  landingTitle: "光具座上的凸透镜",
  landingBody:
    "物体可以左右移动，光屏也可以左右移动。换一个位置，光屏上看到的会不会不一样？先别背五种情况。",
  landingCta: "开始看光具座",
  sceneTitle: "凸透镜光具座",
  startLesson: "开始观察",
  observeCaption: "先点物体相对 F / 2F 的位置，再移动光屏，看这两次分别发生了什么。",
  playDemo: "换一个物体位置看一看",
  moveScreen: "移动光屏",
  screenAtImage: "光屏放到像的位置",
  screenOffImage: "光屏离开像的位置",
  observePrompt: "动过之后，你注意到了什么？只勾你确实看见的。",
  observeSubmit: "提交观察",
  observeNeedInteraction: "先换一个物体位置，或移动一次光屏，看光屏上有什么变化。",
  observeNeedRecord: "你已经动过光具座。把你确实看见的变化勾下来。",
  observeNeedMore: "你已经动过光具座。把你确实看见的变化勾下来。",
  describeInstruction: "对着光具座，把左边的物体、中间的透镜、F / 2F、像和光屏分开说。",
  describeObject: "光具座上，你现在看的整套装置是什么？",
  describeQuantities: "左边的物体、透镜上的 F / 2F、像，和右边的光屏，是同一件东西吗？",
  describeChange: "你刚动的是物体还是光屏？看见的结果变了吗？",
  describeQuestion: "再用一句话写下来。不要只写“变了”。",
  describeSubmit: "记下我的说法",
  describeNeedStructure: "先对着光具座回答三个问题，再用自己的话写一句。",
  predictInstruction: "先写下你预计会看见什么，再去动手。",
  reasonLabel: "为什么这样想？",
  reasonPlaceholder: "先说物体往哪边移，你预计光屏上会怎样。",
  predictSubmit: "锁定预测",
  predictNeedBoth: "先选你预计会看见什么，再写理由。",
  trialPredictFirst: "先锁定这一次的预测，再去光具座上动手。",
  predictLocked: "你已经锁定预测",
  runExperiment: "开始验证",
  runNeedPrediction: "先锁定预测，才能开始动手验证。",
  observeAfterIntervention: "刚才发生了什么？把你实际看到的记下来。",
  observeNeedIntervention: "还没有在光具座上完成这次要求的改变。",
  compareNeedObserved: "还没有记录实际结果。",
  compareNeedSelect: "还没有完成预测对照。",
  compareMine: "我的预测",
  compareActual: "实际看到",
  coverLens: "遮住透镜一部分",
  observeSubmitExperiment: "记下我看见的结果",
  compareQuestion: "和你刚才猜的比一比",
  compareSubmit: "记下这次对照",
  reflectionSubmit: "记下想法，完成本轮",
  reflectionNeedOwnWords: "还没有写下自己的想法。先用自己的话写一写（至少两个中文字）。",
  reflectionNeedObserved: "还没有记录实际结果。",
  reflectionNeedCompare: "还没有完成预测对照。",
  reflectionNeedRecord: "还没有记录实际结果，也还没有完成预测对照。",
  reflectionSaved: "已经完成本轮验证。",
  reflectionAlready: "这次想法已经记下了。",
  trialComplete: "次验证完成",
  startNextTrial: "开始第",
  startNextTrialSuffix: "次验证",
  observedSaved: "已经记下你看见的结果。",
  comparisonNeedSelect: "先选出和预测哪里相同或不同。",
  comparisonSaved: "已经记下这次对照。",
  predictNeedOwnWords: "先选你预计会看见什么，再用自己的话写理由（至少两个中文字）。",
  predictSaved: "已经锁定这次预测。",
  reviewCannotEdit: "回看时不能再改已经记下的内容。",
  explainMeeting: "你已经看见过：有的位置光屏能接到清楚的像，有的位置接不到。该怎么说明光线怎样相遇？",
  explainScreen: "光屏接到像，和透过透镜看见像，是同一回事吗？",
  explainOwnWords: "用自己的话写：刚才那些光屏结果，该用真正相交、反向延长，还是有限远处不相交来说明？",
  explainNeedMore: "先选出一段会聚或接收关系，再用自己的话写。只背“2F 外倒立缩小实像”还不够。",
  explainSubmit: "记下我的说明",
  modelSubmit: "提交模型",
  modelCannotSubmit: "模型还不能提交",
  modelAccepted: "模型已经记下，可以看新情境。",
  modelFrozenCaption: "这是你正在建构的光路，不是一张已经画好的标准图。",
  transferSubmit: "检查迁移",
  transferFirstSaved: "刚才那个新情境已经记下。现在看下一个。",
  transferOwnWords: "用自己的话说明这个新情境里，物体相对焦点在哪里、光线怎样会聚。",
  transferNeedMore: "先选出物距站点、会聚方式和像的后果，再写出理由。",
  transferSurfaceCue: "都有凸透镜，所以和刚才完全一样",
  examSubmit: "提交答案",
  aiOffCommit: "提交判断",
  aiOffPostCheck: "记下这次对照",
  completeIndependent: "完成独立挑战",
} as const;

export const LENS_STAGE_LABELS: Record<LearningStage, string> = {
  [LearningStage.ENTRY]: "开始",
  [LearningStage.OBSERVE]: "看一看",
  [LearningStage.DESCRIBE]: "说清楚",
  [LearningStage.PREDICT]: "先猜一猜",
  [LearningStage.EXPERIMENT]: "动手比一比",
  [LearningStage.EXPLAIN]: "试着说明",
  [LearningStage.MODEL]: "建构光路",
  [LearningStage.TRANSFER]: "换个样子",
  [LearningStage.EXAM]: "题目",
  [LearningStage.AI_OFF]: "自己做",
  [LearningStage.COMPLETE]: "结束",
};

export const LENS_STAGE_PROMPTS: Record<LearningStage, string> = {
  [LearningStage.ENTRY]: "光具座上，物体和光屏都可以移动。不同位置会看见什么？",
  [LearningStage.OBSERVE]: "先看光屏上发生了什么变化。先不要解释五种成像。",
  [LearningStage.DESCRIBE]: "你能把物体、透镜、像、光屏分开说吗？",
  [LearningStage.PREDICT]: "物体相对 F / 2F 的位置变了，你预计像会怎样？",
  [LearningStage.EXPERIMENT]: "你刚改变的是物体位置还是光屏位置？",
  [LearningStage.EXPLAIN]: "这些光线是真的相交，还是只有延长线相交？",
  [LearningStage.MODEL]: "你的光线关系和像的性质之间还缺什么联系？",
  [LearningStage.TRANSFER]: "这个新情境里，物体相对焦点的位置是什么？",
  [LearningStage.EXAM]: "先判断物体处在哪个成像区域。",
  [LearningStage.AI_OFF]: "没有提示。自己用刚才的会聚结构说明。",
  [LearningStage.COMPLETE]: "这条光具座先到这里。下面的小结不是“已经学会了”。",
};

export const LENS_PHASE_STAGES = [
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

export const LENS_FOOTER: Record<LearningStage, string> = {
  [LearningStage.ENTRY]: "",
  [LearningStage.OBSERVE]: "回看不会丢掉已经记下的内容。",
  [LearningStage.DESCRIBE]: "回看不会丢掉已经记下的内容。",
  [LearningStage.PREDICT]: "回看不会丢掉已经记下的内容。",
  [LearningStage.EXPERIMENT]: "回看不会丢掉已经记下的内容。",
  [LearningStage.EXPLAIN]: "回看不会丢掉已经记下的内容。",
  [LearningStage.MODEL]: "回看不会丢掉已经记下的内容。",
  [LearningStage.TRANSFER]: "回看不会丢掉已经记下的内容。",
  [LearningStage.EXAM]: "回看不会丢掉已经记下的内容。",
  [LearningStage.AI_OFF]: "这一页没有提示，也没有人帮你。",
  [LearningStage.COMPLETE]: "这些只是你刚才留下的思考痕迹，不是掌握程度。",
};

export const LENS_TASK_FRAMES: Partial<
  Record<LearningStage, { context: string; goal: string; focus: string; action: string }>
> = {
  [LearningStage.OBSERVE]: {
    context: "光具座上，物体可以换位置，光屏也可以左右移。",
    goal: "先看见变化，不解释五种成像。",
    focus: "先看光屏上有没有变化，再看透过透镜能不能看见像。",
    action: "先换物体位置或移动光屏，看光屏上有什么变化，再勾你看见的。",
  },
  [LearningStage.DESCRIBE]: {
    context: "你刚在光具座上动过物体或光屏。",
    goal: "把装置上的几样东西分开说清楚。",
    focus: "对着图，把物体、透镜、F / 2F、像和光屏分开指认。",
    action: "用自己的话写一句，不要只写“变了”。",
  },
  [LearningStage.PREDICT]: {
    context: "动手之前，先留下你的猜测。",
    goal: "先猜物体换位置以后会看见什么。",
    focus: "想的是物体相对 F / 2F 换了位置以后，像或光屏会怎样。",
    action: "选出预计结果，写理由，然后锁定。",
  },
  [LearningStage.EXPERIMENT]: {
    context: "你已经有一个锁定的预测。",
    goal: "用一次真实改变，对照你刚才的猜测。",
    focus: "看清楚这次改的是物体位置、光屏，还是透镜被遮住。",
    action: "按 预测 → 动手 → 看见 → 对照 → 想法 走完这一轮。",
  },
  [LearningStage.EXPLAIN]: {
    context: "你已经看见过几种不同的光屏结果：有的位置屏接得到，有的接不到。",
    goal: "用自己的话说明：这些结果该用真正相交、反向延长，还是有限远处不相交来解释。",
    focus: "先对着已经看见的光屏结果想，不要去找还没画出来的光线。",
    action: "选出一段会聚或接收关系，再写一段说明。",
  },
  [LearningStage.MODEL]: {
    context: "现在要把物距、光线和像收成一条自己建构的关系。",
    goal: "自己组装光线关系，不要点一张标准图。",
    focus: "一次只做眼前这一步。",
    action: "先放物体，再自己装两条光线。",
  },
  [LearningStage.TRANSFER]: {
    context: "器材换了，但还是一块凸透镜。",
    goal: "先看新情境，再用刚才的会聚结构说明。",
    focus: "先看这个新情境里，物体相对焦点在哪里。",
    action: "用会聚结构说明，不要只说“都有凸透镜”。",
  },
  [LearningStage.EXAM]: {
    context: "现在先不看光具座，只看题目。",
    goal: "先判断这题在考什么，再选用关系。",
    focus: "先读题干，选项最后才出现。",
    action: "最后才看选项，并写理由。",
  },
};

export const LENS_OBSERVE_OPTIONS = [
  { id: "screen-can-change", label: "换物体位置后，光屏上有时清晰、有时模糊或什么也接不到" },
  { id: "size-can-change", label: "换物体位置后，看见的像可以更大或更小" },
  { id: "screen-moves-image", label: "光屏一动，像就跟着光屏跑到新位置" },
  { id: "screen-not-always", label: "不是每次移动光屏都能接到一幅像" },
] as const;

export const LENS_OBSERVE_REQUIRED_IDS = [
  "screen-can-change",
  "size-can-change",
  "screen-not-always",
] as const;

export const LENS_COMPARE_OPTIONS = [
  { value: "same", label: "基本一样" },
  { value: "different", label: "不一样" },
  { value: "partial", label: "部分一样" },
] as const;

export const LENS_PREDICT_OUTCOMES = [
  { value: "real-larger-farther", label: "还能接到实像，像会更大、更远" },
  { value: "real-smaller-closer", label: "还能接到实像，像会更小、更近" },
  { value: "virtual-or-none", label: "光屏接不到清晰像" },
  { value: "unsure", label: "我还不确定" },
] as const;

export const LENS_OBJECT_OPTIONS = [
  { value: "optical-bench", label: "左边的物体、中间的凸透镜，还有可以移动的光屏" },
  { value: "only-screen", label: "我只在看光屏上的那一块画面" },
  { value: "only-lens", label: "我只在看透镜玻璃本身" },
] as const;

export const LENS_QUANTITY_OPTIONS = [
  { value: "object-f-image-screen", label: "物体、F / 2F、像和光屏要分开认，不是同一个" },
  { value: "image-is-screen", label: "像就是那块光屏" },
  { value: "unsure", label: "我还指不清楚" },
] as const;

export const LENS_CHANGE_OPTIONS = [
  { value: "object-or-screen-changes-view", label: "我改了物体位置或光屏位置，看见的结果跟着变" },
  { value: "always-same", label: "怎么放，看见的都一样" },
  { value: "just-changed", label: "变了" },
] as const;

export const LENS_STATION_OPTIONS = [
  { value: "beyond-2f", label: "物体在 2F 以外" },
  { value: "at-2f", label: "物体正好在 2F 上" },
  { value: "between-f-and-2f", label: "物体在 F 和 2F 之间" },
  { value: "at-f", label: "物体正好在焦点上" },
  { value: "inside-f", label: "物体在焦点以内" },
] as const;

export const LENS_MEETING_OPTIONS = [
  { value: "actual-convergence", label: "出射光线真正会聚" },
  { value: "backward-extension", label: "出射光线散开，只有反向延长线相交" },
  { value: "no-finite-meeting", label: "出射光线平行，有限远处不相交" },
] as const;

export const LENS_RAY_KIND_OPTIONS = [
  { value: "parallel-axis", label: "平行主光轴的光线" },
  { value: "through-center", label: "过光心的光线" },
  { value: "through-near-focus", label: "过近侧焦点的光线（可选参考）" },
] as const;

export const LENS_BEFORE_OPTIONS = [
  { value: "parallel-to-principal-axis", label: "到达透镜前：平行主光轴" },
  { value: "toward-optical-center", label: "到达透镜前：朝向光心" },
  { value: "through-near-focal-point", label: "到达透镜前：经过近侧焦点" },
] as const;

export const LENS_AFTER_OPTIONS = [
  { value: "through-far-focal-point", label: "过透镜后：经过另一侧焦点" },
  { value: "undeviated", label: "过透镜后：方向不变" },
  { value: "parallel-to-principal-axis", label: "过透镜后：平行主光轴" },
] as const;

export const LENS_INCIDENT_OPTIONS = [
  { value: "actual", label: "这是实际光线（实线）" },
  { value: "backward-extension", label: "这是反向延长（虚线）" },
] as const;

export const LENS_SIDE_OPTIONS = [
  { value: "other-side", label: "像在透镜另一侧" },
  { value: "same-side", label: "像和物体在同一侧" },
  { value: "none", label: "有限远处没有普通清晰像" },
] as const;

export const LENS_NATURE_OPTIONS = [
  { value: "real", label: "实像" },
  { value: "virtual", label: "虚像" },
  { value: "none", label: "有限远处不成普通清晰像" },
] as const;

export const LENS_ORIENTATION_OPTIONS = [
  { value: "inverted", label: "倒立" },
  { value: "upright", label: "正立" },
  { value: "none", label: "没有完整的像，谈不上正立倒立" },
] as const;

export const LENS_SIZE_OPTIONS = [
  { value: "reduced", label: "比物体小" },
  { value: "same-size", label: "和物体差不多大" },
  { value: "enlarged", label: "比物体大" },
  { value: "none", label: "没有完整的像，谈不上大小" },
] as const;

export const LENS_RECEIVE_OPTIONS = [
  { value: "true", label: "光屏放到像的位置可以接到" },
  { value: "false", label: "光屏接不到" },
] as const;

export const LENS_EXPLAIN_MEETING = [
  { value: "actual-convergence", label: "有的位置上，光线会真正交在一起" },
  { value: "backward-extension", label: "有的位置上，只有反向延长线相交" },
  { value: "no-finite-meeting", label: "物体正好在焦点上时，折射后光线平行，有限远处不相交" },
  { value: "slogan-only", label: "2F 外倒立缩小实像" },
] as const;

export const LENS_EXPLAIN_SCREEN = [
  { value: "screen-receives-real", label: "真正会聚时，光屏放到交点才能接到" },
  { value: "virtual-not-on-screen", label: "虚像可以看见，但光屏接不到" },
  { value: "no-image-if-no-screen", label: "屏上没有就一定没有像" },
] as const;

export const LENS_TUTOR_GOALS: Partial<Record<LearningStage, string>> = {
  [LearningStage.OBSERVE]: "先看光屏上发生了什么变化。",
  [LearningStage.DESCRIBE]: "帮助学生把物体、透镜、像、光屏分开说。",
  [LearningStage.PREDICT]: "让学生先猜物体相对 F / 2F 变了以后会怎样。",
  [LearningStage.EXPERIMENT]: "问学生刚改变的是物体位置还是光屏位置。",
  [LearningStage.EXPLAIN]: "问光线是真的相交，还是只有延长线相交。",
  [LearningStage.MODEL]: "问光线关系和像的性质之间还缺什么联系。",
  [LearningStage.TRANSFER]: "问新情境里物体相对焦点的位置是什么。",
  [LearningStage.EXAM]: "提醒先判断物体处在哪个成像区域。",
};

export const LENS_COMPLETE_COPY = {
  title: "先停在这里",
  body: "你走完了这条光具座的步骤。这只能说明这次任务做完了，不能说明已经掌握凸透镜成像。",
} as const;

export const LENS_EXAM_COPY = {
  notice: "现在先不看光具座。先把题目想清楚，再选答案。",
  worldTrail: "题干 → 考什么 → 表征 → 模型 → 作答",
  stemLabel: "题干",
  representationQuestion: "这道题主要在考什么？先判断题目在问哪一种成像情况。",
  modelQuestion: "你打算用哪一句关系来想？",
  answerQuestion: "最后选哪一句？",
  reasoningQuestion: "用自己的话写理由。不要只抄选项，也不要只背表。",
  continueModel: "下一步：选用关系",
  revealOptions: "再看选项",
  submit: "提交答案",
} as const;

export const LENS_AI_OFF_COPY = {
  commit: "提交判断",
  needCommit: "先选出物距、会聚方式和像的后果，再用自己的话写理由，最后选判断。",
  postCheckTitle: "对照一下：你刚才判断时用到了哪些？",
  postCheckSubmit: "记下这次对照",
  structureTitle: "先写下这次的光路结构",
} as const;

export function lensExperimentTitle(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "比较 2F 两侧的实像";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "物体正好在焦点上";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "物体在焦点以内";
  }
  return "遮住透镜一部分";
}

export function lensPredictQuestion(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "同一块透镜，物体从 2F 以外移到 F 与 2F 之间。你预计像和光屏会怎样？";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "物体正好放在焦点上。折射后的光线还会在有限位置会聚吗？光屏怎么移动，你预计能不能接到清晰像？";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "物体放到焦点以内。光屏还能不能接到像？透过透镜看会怎样？";
  }
  return "光屏已经接到清晰实像。遮住透镜上半部分，像会少掉一半吗？";
}

export function lensChangedVariable(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "这次改的是物体位置：从 2F 以外移到 F 与 2F 之间。";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "这次改的是物体位置：放到焦点上。";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "这次改的是物体位置：放到焦点以内。";
  }
  return "这次改的是透镜：遮住一部分，光屏先不要动。";
}

export function lensStartNextTrialLabel(nextIndex: number): string {
  return `开始第 ${nextIndex} 次验证`;
}

export function lensTrialCompleteLabel(index: number): string {
  return `第 ${index} 次验证完成`;
}

export function lensReflectionPrompt(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "这次让你看清了什么？像变大变远，是因为你移动了光屏，还是因为物体更靠近焦点？";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "折射后的光线还彼此平行吗？有限远处有没有交点？不要把它说成又一种普通成像。可以理解为像在无限远处，但光屏接不到清晰像。";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "光屏接不到，和透过透镜能看见，是不是一回事？";
  }
  return "透镜是不是把像按上下拼起来的？整幅像还在吗？";
}

export const LENS_OBSERVED_FIELDS = {
  screen: [
    { value: "clear", label: "光屏接到清晰像" },
    { value: "blurred-or-absent", label: "光屏模糊或接不到" },
    { value: "never", label: "怎么移光屏都接不到" },
  ],
  sizeOrCover: [
    { value: "larger", label: "看见的像更大" },
    { value: "smaller", label: "看见的像更小" },
    { value: "whole-dimmer", label: "整幅像还在，通常更暗" },
    { value: "half-gone", label: "像少掉了一半" },
    { value: "no-finite", label: "折射后光线平行，有限远处没有完整清晰的像" },
  ],
} as const;

export function lensObservedLabel(
  field: "screen" | "sizeOrCover",
  value: string,
): string {
  const options = LENS_OBSERVED_FIELDS[field];
  return options.find((option) => option.value === value)?.label ?? value;
}

export function lensModelRepairLabel(step: number): string {
  return `回到第 ${step} 步修改`;
}

export function lensTransferProgressLabel(current: number, total: number): string {
  return `第 ${current} / ${total} 个新情境`;
}

export function lensChoiceLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
