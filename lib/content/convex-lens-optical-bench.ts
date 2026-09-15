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
    "这里有一个凸透镜实验。先不用背规律。我们会移动物体和光屏，看看会发生什么。",
  landingCta: "开始看光具座",
  sceneTitle: "凸透镜光具座",
  startLesson: "开始观察",
  nowDoLabel: "现在",
  nextDoLabel: "接下来",
  observeCaption: "先看看这个装置。物体、透镜和光屏分别在哪里？",
  playDemo: "换一个物体位置看一看",
  moveScreen: "移动光屏",
  screenAtImage: "把光屏移近像的位置",
  screenOffImage: "把光屏移开一点",
  observePrompt: "你看见了什么变化？只勾你确实看见的。",
  observeSubmit: "记下我看见的",
  observeNeedInteraction: "先点一个物体位置，或移动一次光屏。",
  observeNeedRecord: "把你确实看见的变化勾下来。",
  observeNeedMore: "把你确实看见的变化勾下来。",
  describeInstruction: "看着左边的实验，说说你实际看到了什么。",
  describeObject: "左边这套装置，现在是在看什么？",
  describeQuantities: "物体、F / 2F、像和光屏，是同一件东西吗？",
  describeChange: "你刚动的是物体还是光屏？看见的结果变了吗？",
  describeQuestion: "物体移动以后，你看到了什么变化？",
  describeSubmit: "记下我的说法",
  describeNeedStructure: "先回答上面的问题，再写你看到的变化。",
  predictInstruction: "先猜你会看见什么，再去动手。",
  predictNotExam: "先猜就可以。等会儿我们真的试一次。",
  reasonAvailability: "你现在想到理由了吗？",
  reasonHasIdea: "我有一个想法",
  reasonGuessOnly: "我就是先猜猜",
  reasonUnknown: "我现在还说不上来",
  reasonLabel: "如果你有想法，用一句话说。",
  reasonPlaceholder: "可以说你为什么这样猜。没有也没关系。",
  predictSubmit: "记下我的猜想",
  predictNeedBoth: "先选一个你觉得可能发生的情况。",
  predictNeedStance: "先说你现在有没有一个理由。",
  predictNeedIdeaText: "你选了有一个想法。先写一句，或改成“我现在还说不上来”。",
  trialPredictFirst: "先记下这一次的猜想，再去光具座上动手。",
  predictLocked: "你已经记下猜想",
  runExperiment: "开始验证",
  runNeedPrediction: "先记下猜想，才能开始动手。",
  observeAfterIntervention: "光屏上怎样了？像怎样了？",
  observeNeedIntervention: "还没有在光具座上完成这次要求的改变。",
  compareNeedObserved: "还没有记录实际结果。",
  compareNeedSelect: "还没有完成预测对照。",
  compareMine: "我的预测",
  compareActual: "实际看到",
  coverLens: "遮住透镜一部分",
  observeSubmitExperiment: "记下我看见的结果",
  compareQuestion: "停在这里看看。和你刚才猜的一样吗？",
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
  predictNeedOwnWords: "先选一个你觉得可能发生的情况。没有理由也可以先猜。",
  predictSaved: "已经记下这次猜想。",
  reviewCannotEdit: "回看时不能再改已经记下的内容。",
  explainMeeting: "前面几次实验，光屏是不是每次都能接到清楚的像？",
  explainScreen: "透过透镜能看见，和光屏能接到，是同一回事吗？",
  explainOwnWords: "用自己的话说说：你觉得真正起作用的是什么？不必先背课本句子。",
  explainNeedMore: "先回答上面两个已经看见的结果，再用自己的话写。只背“2F 外倒立缩小实像”还不够。",
  explainSubmit: "记下我的说明",
  modelSubmit: "提交模型",
  modelStep6Checking: "正在看你这句话在说什么。",
  modelStep6NeedCheck: "点下一步，我先看你这句话在说什么。",
  modelStep6Unclear:
    "这句话我还没判断清楚。你可以再说具体一点：光线怎样相遇？然后形成什么像？",
  modelCannotSubmit: "模型还不能提交",
  modelAccepted: "模型已经记下，可以看新情境。",
  modelFrozenCaption: "这是你正在建构的光路，不是一张已经画好的标准图。",
  transferSubmit: "检查迁移",
  transferChecking: "正在看你这句话在说什么。",
  transferNeedCheck: "点检查迁移，我先看你这句话在说什么。",
  transferNeedAuthored: "还要用自己的话写一句：这里的条件让光线怎样走，最后得到怎样的像。",
  transferFirstSaved: "刚才那个新情境已经记下。现在看下一个。",
  transferSituationTitle: "先看这个新情境",
  transferConditionQuestion: "这里的物体相对焦点在哪里？",
  transferModelLinkTitle: "和刚才模型的联系",
  transferModelLinkBody: "刚才你建立的模型关注的是：物体条件 → 光线怎样相遇 → 像的结果",
  transferOwnWords:
    "这个新情境为什么能用刚才的模型？用自己的话说说：这里的条件让光线怎样走，最后得到怎样的像。",
  transferNeedMore: "先判断这个新情境里，物体相对焦点在哪里。",
  transferStructureIncomplete: "先判断这个新情境里，物体相对焦点在哪里。",
  transferStructureInconsistent:
    "这句话里的光线关系和像的结果，和这个新情境还对不上。再看看这里的条件会让光线怎样走。",
  transferMismatchStationProjector:
    "先看看物体位置。题目里说幻灯片在焦点以外、二倍焦距以内，你现在选的位置和这个条件还没对上。",
  transferMismatchStationMagnifier:
    "先看看物体位置。题目里说邮票在焦点以内，你现在选的位置和这个条件还没对上。",
  transferClaimMismatch:
    "这句话里的光线关系和像的结果，和这个新情境还对不上。再看看这里的条件会让光线怎样走。",
  transferVague: "这句话还太笼统。再说具体一点：光线怎样相遇？最后形成什么像？",
  transferUnclear:
    "这句话我还没判断清楚。可以再说具体一点：光线怎样相遇？最后形成什么像？",
  transferMismatchMeeting:
    "这句话里光线怎样相遇，和这个新情境还对不上。再看看出射光线是真的会聚、只有反向延长线相交，还是在有限距离内不相交。",
  transferMismatchSide:
    "物体位置和光线关系已经对上了。再看看像在哪一侧。",
  transferMismatchNature:
    "这句话里像的结果，和这个新情境还对不上。再看看会成实像还是虚像。",
  transferMismatchOrientation:
    "前面的物体位置和成像关系已经对上了。再看看像是正立还是倒立。",
  transferMismatchSize:
    "前面的物体位置和成像关系已经对上了。再看看像的大小这一项。",
  transferMismatchScreen:
    "前面的成像判断已经对上了。再想一想这种像能不能被光屏接到。",
  transferMeetingMissing: "还要说清楚光线是怎样相遇的。",
  transferConsequenceMissing: "还要接着说，这样相遇后会形成什么样的像。",
  transferBindMissing:
    "光线怎样相遇、会形成什么像你都写到了。再用一句话把这两件事连起来。",
  transferAuthoredContradicts:
    "这句话里光线怎样相遇和像的结果还对不上。再看看这里的条件会让光线怎样走。",
  transferSloganOnly:
    "“都有凸透镜”不够。要说这个新情境里光线怎样相遇，为什么会得到这样的像。",
  transferTableRowOnly: "这句话还只是在背表。先说光线怎样相遇，再接到会形成什么样的像。",
  transferJudgmentTitle: "你正在检查的判断",
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
  [LearningStage.ENTRY]: "这里有一个凸透镜实验。先不用背规律。",
  [LearningStage.OBSERVE]: "先看看这个装置。物体、透镜和光屏分别在哪里？",
  [LearningStage.DESCRIBE]: "看着左边的实验，用你自己的话说说你现在看到了什么。",
  [LearningStage.PREDICT]: "如果把物体移到 F 和 2F 之间，你觉得会发生什么？",
  [LearningStage.EXPERIMENT]: "记住你刚才的猜想。现在去光具座上试试看。",
  [LearningStage.EXPLAIN]: "前面几次，光屏是不是每次都能接到清楚的像？",
  [LearningStage.MODEL]: "把刚才几次实验放在一起看。到底是哪一步开始变得不一样？",
  [LearningStage.TRANSFER]: "光具座先放一边。刚才发现的关系还能不能用？",
  [LearningStage.EXAM]: "题目只是把刚才那个关系换了一种问法。",
  [LearningStage.AI_OFF]: "最后换一个新的情况。这一次没有提示。",
  [LearningStage.COMPLETE]: "回头看看你刚才想了什么。这不是“已经掌握了”。",
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
    goal: "先看看这个装置。物体、透镜和光屏分别在哪里？",
    focus: "先看光屏上有没有变化，再看透过透镜能不能看见像。",
    action: "先动手，再勾你确实看见的。",
  },
  [LearningStage.DESCRIBE]: {
    context: "你刚在光具座上动过物体或光屏。",
    goal: "看着左边的实验，说说你实际看到了什么",
    focus: "物体、透镜和光屏之间是什么样的位置关系？",
    action: "用自己的话写你看到的变化。",
  },
  [LearningStage.PREDICT]: {
    context: "动手之前，先留下你的猜测。现在不用答对。",
    goal: "如果把物体移到 F 和 2F 之间，你觉得会发生什么？",
    focus: "想的是物体相对 F / 2F 换了位置以后，像或光屏会怎样。",
    action: "选出你觉得可能发生的情况。没有理由也可以先猜。",
  },
  [LearningStage.EXPERIMENT]: {
    context: "你已经有一个猜想。现在去光具座上看看实际怎样。",
    goal: "把物体移到 F 和 2F 之间",
    focus: "看清楚这次改的是物体位置、光屏，还是透镜被遮住。",
    action: "先完成眼前这一步。",
  },
  [LearningStage.EXPLAIN]: {
    context: "前几次实验里，物体的位置变了，光屏上的结果也跟着变了。",
    goal: "前面几次，光屏是不是每次都能接到清楚的像？",
    focus: "先对着已经看见的光屏结果想，不要去找还没画出来的光线。",
    action: "先回答已经看见的结果，再写一段说明。",
  },
  [LearningStage.MODEL]: {
    context: "前面几次实验，物体放的位置不一样，最后看到的结果也不一样。",
    goal: "把它们放在一起看。到底是哪一步开始变得不一样？",
    focus: "一次只做眼前这一步。先看你做过的实验，再自己装光线。",
    action: "先对照刚才的实验，再自己装两条光线。",
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
  { value: "same", label: "差不多一样" },
  { value: "different", label: "不太一样" },
  { value: "partial", label: "我还不确定" },
] as const;

export const LENS_VOCAB = {
  F: {
    term: "F",
    body: "这个位置叫焦点 F。现在先认得它就可以。",
  },
  screen: {
    term: "光屏",
    body: "这块白色板叫光屏。等会儿可以移动它找清楚的图样。",
  },
  image: {
    term: "像",
    body: "通过透镜看到的物体图样，物理里叫“像”。",
  },
} as const;

export const LENS_PREDICT_REASON_STANCES = [
  { value: "has-idea", label: "我有一个想法" },
  { value: "guess-only", label: "我就是先猜猜" },
  { value: "unknown", label: "我现在还说不上来" },
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
  { value: "actual-convergence", label: "会在前面碰到一起" },
  { value: "backward-extension", label: "前面碰不到，只有往回画才碰到" },
  { value: "no-finite-meeting", label: "方向差不多，前面碰不到一起" },
] as const;

export const LENS_RAY_KIND_OPTIONS = [
  { value: "parallel-axis", label: "平行主光轴的光线" },
  { value: "through-center", label: "过光心的光线" },
  { value: "through-near-focus", label: "过近侧焦点的光线（可选参考）" },
] as const;

export const LENS_REQUIRED_RAY_KIND_OPTIONS = [
  { value: "parallel-axis", label: "平行主光轴" },
  { value: "through-center", label: "过光心" },
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
  { value: "none", label: "在光屏能放到的地方，没有清楚的像位置" },
] as const;

export const LENS_NATURE_OPTIONS = [
  { value: "real", label: "实像" },
  { value: "virtual", label: "虚像" },
  { value: "none", label: "接不到清楚的实像" },
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
  { value: "sometimes-receives", label: "有的位置能接到，有的位置怎么移都接不到" },
  { value: "always-receives", label: "每次都能接到清楚的像" },
  { value: "never-receives", label: "每次都接不到" },
  { value: "slogan-only", label: "2F 外倒立缩小实像" },
] as const;

export const LENS_EXPLAIN_SCREEN = [
  { value: "visible-not-same", label: "透过透镜能看见，不等于光屏一定能接到" },
  { value: "same-as-screen", label: "看见和接到是同一回事" },
  { value: "no-image-if-no-screen", label: "屏上没有就一定没有像" },
] as const;

export const LENS_TUTOR_GOALS: Partial<Record<LearningStage, string>> = {
  [LearningStage.OBSERVE]: "先看光屏上发生了什么变化。",
  [LearningStage.DESCRIBE]: "帮助学生把物体、透镜、像、光屏分开说。",
  [LearningStage.PREDICT]: "让学生先猜物体相对 F / 2F 变了以后会怎样。",
  [LearningStage.EXPERIMENT]: "问学生刚改变的是物体位置还是光屏位置。",
  [LearningStage.EXPLAIN]: "问已经看见的光屏结果有什么不一样。",
  [LearningStage.MODEL]: "问光线关系和像的性质之间还缺什么联系。",
  [LearningStage.TRANSFER]: "问这个新情境里光线怎样相遇，为什么会得到这样的像。",
  [LearningStage.EXAM]: "提醒先判断物体处在哪个成像区域。",
};

export const LENS_COMPLETE_COPY = {
  title: "这次先到这里",
  body: "一开始你先猜了会看见什么。实验以后你对照了实际发生的事情。后来你试着说出真正起作用的关系。最后你在新情境里自己用了它。这只能说明这次任务做完了，不能说明已经掌握凸透镜成像。",
} as const;

export const LENS_AI_OFF_COPY_LEAD =
  "最后换一个新的情况。这一次没有提示。按你自己的理解来判断。" as const;

export const LENS_EXAM_COPY = {
  notice: "现在先不看光具座。题目只是把刚才那个关系换了一种问法。先把题目想清楚，再选答案。",
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
  checking: "正在看你写的理由…",
  needCommit: "先判断物体相对 F / 2F 在哪里，选出最后会出现什么结果，再用自己的话写理由。",
  needStation: "先判断这个情境里物体相对 F / 2F 在哪里。",
  needJudgment: "先选出你认为最后会出现什么结果。",
  needReason: "先写下理由：这里的条件让光线怎样走，最后为什么会得到这个结果。",
  vague: "这句话还太笼统。再说具体一点：光线最后在哪里相遇？这会形成什么结果？",
  unclear:
    "这句话我还没看清你想表达的光线关系。可以再说具体一点：光线最后在哪里相遇？这会形成什么结果？",
  inconsistent: "你写的光线关系和像的后果对不上。先看光线是会聚、反向延长还是平行，再接到对应的结果。",
  judgmentDisagree: "你选的结果，和理由里的光线关系对不上。先对一下再提交。",
  postCheckTitle: "刚才判断时，哪些关系真正起作用？",
  postCheckSubmit: "记下这次对照",
  postCheckNeedFacts: "先勾出这次真正起作用的关系。",
  postCheckMissingRequired: "还有一条关键关系没有对照到。再看看哪一项还没有核对？",
  postCheckDistractor:
    "有一项只是表面上说得通，还不能说明这次真正起作用的关系。先去掉那一项。",
  postCheckPrecommit:
    "对照已经勾好了。还要回到上面的判断和理由，把条件、光线怎样走、最后结果说清楚。",
  postCheckWrongChallenge: "这次对照和当前题目对不上。先回到这一题再勾一次。",
  postCheckSystem: "这次对照没能记下。请再试一次。",
  editJudgment: "修改刚才的判断",
  structureTitle: LENS_AI_OFF_COPY_LEAD,
  conditionQuestion: "先判断这个情境里物体相对 F / 2F 在哪里。",
  judgmentQuestion: "你认为最后会出现什么结果？",
  reasonQuestion: "为什么？说说这里的条件让光线怎样走，最后为什么会得到这个结果。",
} as const;

export function lensExperimentTitle(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "物体换到 F 和 2F 之间";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "物体放到焦点上";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "物体放到焦点以内";
  }
  return "遮住透镜一部分";
}

export function lensPredictQuestion(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "如果把物体移到 F 和 2F 之间，你觉得会发生什么？";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "这次把物体放到 F。光屏还能找到清楚的像吗？";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "现在把物体放到 F 里面。你觉得会和前面哪里不一样？";
  }
  return "遮住透镜一部分后，像会少掉一半吗？";
}

export function lensTrialPurpose(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "先看 F 和 2F 之间";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "如果继续把物体移近 F 呢？";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "现在把物体放到 F 里面";
  }
  return "遮住透镜一部分，像会少掉一半吗？";
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
  const id = [LENS_EXPERIMENT_A, LENS_EXPERIMENT_B, LENS_EXPERIMENT_C, LENS_EXPERIMENT_D][
    nextIndex - 1
  ];
  return id ? lensTrialPurpose(id) : "继续看下一次";
}

export function lensTrialCompleteLabel(_index: number): string {
  return "这一轮看完了";
}

export function lensReflectionPrompt(id: LensExperimentId): string {
  if (id === LENS_EXPERIMENT_A) {
    return "这次让你看清了什么？像变大变远，是因为你移动了光屏，还是因为物体更靠近焦点？";
  }
  if (id === LENS_EXPERIMENT_B) {
    return "沿着这些光往前看，它们会不会在前面碰到一起？如果没有碰到一起，为什么光屏怎么移动都接不到清晰的实像？";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "这些光通过透镜以后，还会在另一边碰到一起吗？透过透镜能看见，和光屏能接到，是同一回事吗？";
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
    { value: "no-finite", label: "怎么移光屏都找不到清楚的像" },
  ],
} as const;

export function lensObservedSizeOptions(id: LensExperimentId) {
  if (id === LENS_EXPERIMENT_A) {
    return LENS_OBSERVED_FIELDS.sizeOrCover.filter(
      (option) => option.value === "larger" || option.value === "smaller",
    );
  }
  if (id === LENS_EXPERIMENT_B) {
    return LENS_OBSERVED_FIELDS.sizeOrCover.filter((option) => option.value === "no-finite");
  }
  if (id === LENS_EXPERIMENT_C) {
    return LENS_OBSERVED_FIELDS.sizeOrCover.filter(
      (option) => option.value === "larger" || option.value === "smaller",
    );
  }
  return LENS_OBSERVED_FIELDS.sizeOrCover.filter(
    (option) => option.value === "whole-dimmer" || option.value === "half-gone",
  );
}

export function lensLightPathNeedCopy(id: LensExperimentId): string | null {
  if (id === LENS_EXPERIMENT_B) {
    return "刚才我们一直在看光屏。这次换个角度，看看光通过透镜以后是怎么走的。";
  }
  if (id === LENS_EXPERIMENT_C) {
    return "刚才我们一直在看光屏。这次看看光通过透镜以后是怎么走的。";
  }
  return null;
}

export function lensRevealBackwardExtensionLabel(): string {
  return "把这些光往回画看看";
}

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
