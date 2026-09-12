import { LEARNING_STAGE_ORDER, LearningStage } from "@/types/learning";
import { STUDENT_STAGE_LABELS } from "@/lib/content/student-language";
import type { CartExperimentId } from "@/lib/physics/horizontal-force-cart";
import {
  CART_EXPERIMENT_A,
  CART_EXPERIMENT_B,
  CART_EXPERIMENT_C,
} from "@/lib/physics/horizontal-force-cart";

export const CART_PHASE1_STAGES = [
  LearningStage.ENTRY,
  LearningStage.OBSERVE,
  LearningStage.DESCRIBE,
  LearningStage.PREDICT,
  LearningStage.EXPERIMENT,
] as const;

export const CART_PHASE2_STAGES = [
  ...CART_PHASE1_STAGES,
  LearningStage.EXPLAIN,
  LearningStage.MODEL,
  LearningStage.TRANSFER,
] as const;

export const CART_PHASE3_STAGES = [
  ...CART_PHASE2_STAGES,
  LearningStage.EXAM,
  LearningStage.AI_OFF,
  LearningStage.COMPLETE,
] as const;

export const CART_STAGE_LABELS = STUDENT_STAGE_LABELS;

export const CART_STAGE_PROMPTS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.ENTRY]: "这个小车什么时候会走得更快、更慢，或者改变方向？",
  [LearningStage.OBSERVE]: "先不要下结论。仔细看看：小车先是怎样的？后来哪些东西变了？",
  [LearningStage.DESCRIBE]: "用你看到的现象，说清楚小车先是怎样的，后来怎样变了。",
  [LearningStage.PREDICT]: "先猜一猜，再说说你为什么这样想。",
  [LearningStage.EXPERIMENT]: "改一个条件，看看是不是和你想的一样。",
  [LearningStage.EXPLAIN]: "把三次实验放在一起看：合力怎样改变运动状态？力和运动是同一件事吗？",
  [LearningStage.MODEL]: "把“现在怎么运动、合力怎样、运动状态怎样变”连起来。",
  [LearningStage.TRANSFER]: "情况换了，刚才的想法还能不能用？",
  [LearningStage.EXAM]: "先想清楚题目在问什么，再选答案。",
  [LearningStage.AI_OFF]: "这一次没有提示。自己判断合力和运动状态。",
  [LearningStage.COMPLETE]: "回头看看你刚才想了什么。",
};

export const CART_COPY = {
  landingKicker: "场景 03",
  landingTitle: "水平轨道上的小车",
  landingBody: "先看它怎样动，先别急着下结论。",
  landingCta: "开始探索",
  headline: "这个小车什么时候会走得更快、更慢，或者改变方向？",
  subheadline: "先看它怎样动，先别急着解释。",
  startCta: "开始探索",
  observeInstruction: "先看一遍演示。留意小车一开始怎样，后来快慢有没有变。",
  observePrompt: "下面这些，哪些是你确实看见的？可以多选。",
  observeSubmit: "记下看到的",
  observeNeedMore: "再看看：它一开始停着吗？后来是开始运动了，还是越来越快了？",
  observeSaved: "你已经记下看到的变化了。",
  playDemo: "播放演示",
  pauseDemo: "暂停",
  replayDemo: "再看一遍",
  describeInstruction:
    "先选出你看见的事实，再用一句话说出来。不必背课文原句。",
  objectLabel: "你看到的物体是什么？",
  initialMotionLabel: "它一开始是怎样的？",
  forceDirectionLabel: "力的箭头朝哪边？",
  observedChangeLabel: "后来运动怎样变了？",
  describeQuestion: "请用一句话描述你看见的变化。",
  describePlaceholder: "例如：小车先停着，后来向右动起来了。",
  describeSubmit: "记下描述",
  describeNeedStructure: "先把物体、一开始的运动、力的方向和后来的变化都选清楚。",
  predictInstruction: "先猜结果，再写下理由。猜错了也可以继续做实验。",
  predictA:
    "小车已经在向右运动。如果再给它一个向右的水平力，它的运动快慢会怎样变？",
  predictB: "小车仍在向右运动。如果给它一个向左的水平力，它的运动状态会怎样变？",
  predictC: "小车已经在向右运动。如果水平方向的合力变为零，它会不会立刻停下来？",
  reasonLabel: "你为什么这样想？",
  reasonPlaceholder: "用自己的话说一句。",
  predictSubmit: "记下猜测",
  predictNeedBoth: "请先选一个结果，再写一句理由。",
  predictLocked: "你刚才的猜测",
  experimentIntro: "改一个条件，看看是不是和你想的一样。",
  runExperiment: "动手看结果",
  runNeedPrediction: "先记下猜测，再动手。",
  observeSubmitExperiment: "记下看到的结果",
  speedChangeLabel: "快慢怎样变了？",
  directionChangeLabel: "运动方向有没有变？",
  motionChangeLabel: "运动状态怎样变了？",
  compareQuestion: "和你刚才猜的比，怎样？",
  compareSame: "差不多一样",
  compareDifferent: "不一样",
  comparePartial: "有一部分一样",
  compareSubmit: "记下比较",
  reflectionA: "这次动手让你看清了什么？",
  reflectionB: "力顶着运动方向时，你看清了什么？",
  reflectionC: "合力变为零时，你看清了什么？",
  reflectionSubmit: "记下想法",
  experimentATitle: "顺着推一下",
  experimentBTitle: "顶着推一下",
  experimentCTitle: "不再推它",
  frictionNote: "这一次轨道被看成很滑。先只看水平方向的合力。",
  phase1Done: "这一段先做到这里。后面的解释和建模还没有打开。",
  phase2Done: "这一段先做到这里。后面的考试题和独立挑战还没有打开。",
  explainLead: "把三次实验放在一起看。",
  explainFollow: "先选出关系，再用自己的话说一两句。不要只抄课文原句。",
  explainForceVsMotion: "力和运动是同一件事吗？",
  explainSameDirection: "合力与运动同一边时，快慢会怎样？",
  explainOppositeDirection: "合力顶着运动方向时，快慢会怎样？",
  explainZeroNetForce: "合力为零时，运动状态会怎样？",
  explainOwnWords: "用自己的话，把三次实验连起来说一遍。",
  explainPlaceholder: "例如：顺着推会更快，顶着推会更慢，合力为零时不必立刻停下。",
  explainSubmit: "记下解释",
  explainNeedMore: "先把四步选清楚，再用自己的话说。不要把有力写成一定在运动。",
  explainEvidenceTitle: "你刚才三次动手记下的",
  modelInstruction: "把“现在怎么运动、合力怎样、运动状态怎样变”连成关系。不要排成能量传送带。",
  modelEvidenceTitle: "对照三次实验",
  modelSameLabel: "顺着推",
  modelOppositeLabel: "顶着推",
  modelZeroLabel: "合力为零",
  modelMotionLabel: "现在怎么运动",
  modelForceLabel: "合力怎样",
  modelChangeLabel: "运动状态怎样变",
  modelConditionLabel: "这个关系在什么条件下能用？",
  modelSubmit: "记下关系",
  modelNeedStructure: "三个对照都要连对，还要标出合力为零时不变这个条件。",
  modelRetry: "这次关系还不完整。刚才那一次还留着，可以再试。",
  transferFullQuestion: "这个新情境里，哪些关系还能用？哪些只是看起来像？",
  transferBoundaryQuestion: "合力接近零时，哪些想法还能用？哪些不能直接搬过来？",
  transferApplies: "还能用",
  transferNotNecessarily: "不能直接搬过来",
  transferSurfaceCue: "因为都有轮子，所以和刚才的小车是一回事。",
  transferOwnWords: "用关系和条件说说为什么。不要只说“看起来像”。",
  transferPlaceholder: "先说合力怎样、运动状态怎样变。",
  transferSubmit: "记下迁移",
  transferNeedMore: "先判断每条关系能不能用，再用自己的话写一句。",
  transferRetry: "这次还不能算迁移成功。刚才那一次还留着，可以再试。",
  transferMedium: "换一个情境再试试",
  hintAsk: "再看一步提示",
  hintDone: "提示已经到这一步能给的位置了。",
  cartAria: "水平轨道上的小车",
  forceArrowRight: "向右的力",
  forceArrowLeft: "向左的力",
  forceArrowNone: "没有明显的水平力",
  speedStill: "静止",
  speedSlow: "慢",
  speedMedium: "中",
  speedFast: "快",
} as const;

export const CART_FORBIDDEN_REVEAL_TERMS = [
  "力能改变物体运动状态",
  "合力不为零会改变运动状态",
  "F=ma",
] as const;

export const CART_OBSERVE_OPTIONS = [
  { id: "initially-still", label: "小车一开始是停着的", distractor: false },
  { id: "started-moving", label: "后来它开始运动", distractor: false },
  { id: "sped-up", label: "它越来越快", distractor: false },
  { id: "cart-is-on-screen", label: "画面里有一辆小车", distractor: true },
  { id: "always-reverses", label: "每个时候它都在掉头", distractor: true },
  {
    id: "has-wheels-so-must-speed-up",
    label: "它有轮子所以一定会越来越快",
    distractor: true,
  },
] as const;

export type CartObserveOptionId = (typeof CART_OBSERVE_OPTIONS)[number]["id"];

export const CART_OBJECT_OPTIONS = [
  { value: "cart", label: "小车" },
  { value: "track-only", label: "只有轨道，没有小车" },
  { value: "arrow-only", label: "只有箭头" },
] as const;

export const CART_INITIAL_MOTION_OPTIONS = [
  { value: "still", label: "静止" },
  { value: "moving-right", label: "已经向右运动" },
  { value: "moving-left", label: "已经向左运动" },
] as const;

export const CART_FORCE_DIRECTION_OPTIONS = [
  { value: "none", label: "一开始没有明显的水平力" },
  { value: "right", label: "向右" },
  { value: "left", label: "向左" },
] as const;

export const CART_CHANGE_OPTIONS = [
  { value: "started-moving", label: "开始运动" },
  { value: "sped-up", label: "越来越快" },
  { value: "slowed-down", label: "越来越慢" },
  { value: "reversed", label: "改变方向" },
  { value: "unchanged", label: "几乎没有变化" },
] as const;

export type CartPredictOutcome =
  | "sped-up"
  | "slowed-down"
  | "unchanged"
  | "reversed"
  | "unsure";

export const CART_PREDICT_OUTCOMES: Array<{
  value: CartPredictOutcome;
  label: string;
}> = [
  { value: "sped-up", label: "会越来越快" },
  { value: "slowed-down", label: "会越来越慢" },
  { value: "unchanged", label: "快慢差不多不变" },
  { value: "reversed", label: "会立刻掉转方向" },
  { value: "unsure", label: "不确定" },
];

export const CART_SPEED_CHANGE_OPTIONS = [
  { value: "up", label: "更快" },
  { value: "down", label: "更慢" },
  { value: "none", label: "快慢几乎不变" },
] as const;

export const CART_DIRECTION_CHANGE_OPTIONS = [
  { value: "no", label: "方向没有变" },
  { value: "yes", label: "方向变了" },
] as const;

export const CART_MOTION_CHANGE_OPTIONS = [
  { value: "started-moving", label: "开始运动" },
  { value: "sped-up", label: "加快" },
  { value: "slowed-down", label: "减慢" },
  { value: "reversed", label: "改变方向" },
  { value: "unchanged", label: "保持原来的运动" },
] as const;

export const CART_COMPARE_OPTIONS = [
  { value: "same", label: CART_COPY.compareSame },
  { value: "different", label: CART_COPY.compareDifferent },
  { value: "partial", label: CART_COPY.comparePartial },
] as const;

export const CART_EXPERIMENT_QUESTIONS: Record<CartExperimentId, string> = {
  [CART_EXPERIMENT_A]: CART_COPY.predictA,
  [CART_EXPERIMENT_B]: CART_COPY.predictB,
  [CART_EXPERIMENT_C]: CART_COPY.predictC,
};

export const CART_EXPERIMENT_TITLES: Record<CartExperimentId, string> = {
  [CART_EXPERIMENT_A]: CART_COPY.experimentATitle,
  [CART_EXPERIMENT_B]: CART_COPY.experimentBTitle,
  [CART_EXPERIMENT_C]: CART_COPY.experimentCTitle,
};

export const CART_REFLECTION_PROMPTS: Record<CartExperimentId, string> = {
  [CART_EXPERIMENT_A]: CART_COPY.reflectionA,
  [CART_EXPERIMENT_B]: CART_COPY.reflectionB,
  [CART_EXPERIMENT_C]: CART_COPY.reflectionC,
};

export const CART_TUTOR_GOALS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.OBSERVE]: "只帮学生把看见的变化说清楚",
  [LearningStage.DESCRIBE]: "帮学生分开说：物体、一开始的运动、力的方向、后来怎样变",
  [LearningStage.PREDICT]: "帮学生写下猜测和理由，不要透露实验结果",
  [LearningStage.EXPERIMENT]: "实验阶段不要调用导师",
  [LearningStage.EXPLAIN]: "帮学生把三次实验连成因果关系，不要替学生写出完整关系",
  [LearningStage.MODEL]: "指出缺了哪一块，但不要替学生摆好关系板",
  [LearningStage.TRANSFER]: "等学生先判断关系和条件，不要先说出这是同一个模型",
  [LearningStage.EXAM]: "保持考试题顺序，不要说出正确答案",
};

export const CART_FOOTER: Record<(typeof LEARNING_STAGE_ORDER)[number], string> = {
  [LearningStage.ENTRY]: "",
  [LearningStage.OBSERVE]: "先看小车怎么动，再记下你看到的。",
  [LearningStage.DESCRIBE]: "试着说出：物体、一开始怎样、力朝哪边、后来怎样变。",
  [LearningStage.PREDICT]: "先猜，再动手。",
  [LearningStage.EXPERIMENT]: "改一个条件，对照一下刚才的猜测。",
  [LearningStage.EXPLAIN]: "先说清楚为什么，不要急着套名词。",
  [LearningStage.MODEL]: "自己把关系连起来。",
  [LearningStage.TRANSFER]: "情况换了，看看刚才的想法还能不能用。",
  [LearningStage.EXAM]: "先想清楚，再选答案，并写下理由。",
  [LearningStage.AI_OFF]: "这一页没有提示，也没有人帮你。",
  [LearningStage.COMPLETE]: "这些只是你刚才留下的思考痕迹，不是掌握程度。",
};

export const CART_EXAM_COPY = {
  notice: "现在先不看小车。先把题目想清楚，再选答案。",
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

export const CART_AI_OFF_COPY = {
  progress: "第 {n} 题 / 共 {total} 题",
  choose: "选择你的判断",
  reasonLabel: "用你自己的话说明理由。",
  reasonPlaceholder: "写出合力和运动状态的关系。不要只重复选项。",
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

export const CART_COMPLETE_COPY = {
  title: "你已经完成了这次学习循环和独立挑战。",
  caution:
    "这只说明你完成了这次要做的事，不表示已经掌握所有力和运动问题，也不保证考试一定会更好。",
  theme:
    "今天真正要抓住的，不是小车长什么样，而是：当前运动状态加上合力条件，会怎样改变运动状态。",
  demonstratedTitle: "这次你做了这些事",
  demonstrated: [
    "能从现象中分开力和运动；",
    "能用实验检查自己的预测；",
    "能建立合力与运动状态变化的关系；",
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

export const CART_EXPLAIN_FORCE_VS_MOTION = [
  { value: "not-same", label: "不是同一件事。有力不等于物体一定在运动。" },
  { value: "force-means-motion", label: "有力就一定运动。" },
  { value: "needs-forward-force", label: "物体在运动，就一定一直受到向前的力。" },
] as const;

export const CART_EXPLAIN_SAME_DIRECTION = [
  { value: "sped-up", label: "会加快。" },
  { value: "unchanged", label: "本来就在动，所以快慢不会变。" },
  { value: "force-means-motion", label: "有力就一定已经在运动，谈不上加快。" },
] as const;

export const CART_EXPLAIN_OPPOSITE_DIRECTION = [
  { value: "slowed-down", label: "会减慢。" },
  { value: "sped-up", label: "力必须和运动同一边，所以还是会加快。" },
  { value: "must-stop", label: "只要受力就会立刻停住。" },
] as const;

export const CART_EXPLAIN_ZERO_NET_FORCE = [
  { value: "unchanged", label: "运动状态保持不变。原来在动的，还可以继续动。" },
  { value: "must-stop", label: "合力为零就一定静止。" },
  { value: "balanced-means-no-force", label: "平衡力就是没有力，所以一定会停。" },
  { value: "needs-forward-force", label: "没有向前的力，物体就不能继续运动。" },
] as const;

export const CART_MODEL_MOTION_OPTIONS = [
  { value: "still", label: "静止" },
  { value: "moving-right", label: "正在向右运动" },
  { value: "moving-left", label: "正在向左运动" },
  { value: "chemical-energy", label: "化学能" },
] as const;

export const CART_MODEL_FORCE_OPTIONS = [
  { value: "same-as-motion", label: "合力和运动同一边" },
  { value: "opposite-to-motion", label: "合力顶着运动方向" },
  { value: "zero", label: "水平合力为零" },
  { value: "force-means-motion", label: "有力就等于在运动" },
  { value: "internal-energy", label: "内能" },
] as const;

export const CART_MODEL_CHANGE_OPTIONS = [
  { value: "sped-up", label: "加快" },
  { value: "slowed-down", label: "减慢" },
  { value: "unchanged", label: "保持原来的运动" },
  { value: "started-moving", label: "开始运动" },
  { value: "must-stop", label: "一定静止" },
  { value: "must-move", label: "一定在运动" },
  { value: "mechanical-energy", label: "机械能" },
] as const;

export const CART_MODEL_CONDITION_OPTIONS = [
  { value: "one-dimensional-motion", label: "先只看一条水平直线上的运动" },
  { value: "friction-omitted", label: "这一模型里轨道摩擦先不算" },
  { value: "net-force-zero-unchanged", label: "合力为零时，运动状态保持不变" },
  { value: "energy-conversion-chain", label: "化学能转化成内能再变成机械能" },
  { value: "force-equals-motion", label: "力的方向必须等于运动方向" },
] as const;

export const CART_MODEL_CASE_IDS = ["same", "opposite", "zero"] as const;

export type CartModelCaseId = (typeof CART_MODEL_CASE_IDS)[number];

export const CART_TRANSFER_RELATIONS = [
  {
    id: "net-force-changes-motion-state",
    label: "合力可以改变运动状态",
  },
  {
    id: "same-direction-force-increases-speed",
    label: "合力和运动同一边时会加快",
  },
  {
    id: "opposite-direction-force-decreases-speed",
    label: "合力顶着运动时会减慢",
  },
  {
    id: "zero-net-force-leaves-motion-unchanged",
    label: "合力为零时运动状态保持不变",
  },
] as const;

export const CART_TRANSFER_RELATION_DISPLAY_ORDER = [
  "opposite-direction-force-decreases-speed",
  "zero-net-force-leaves-motion-unchanged",
  "same-direction-force-increases-speed",
  "net-force-changes-motion-state",
] as const;
