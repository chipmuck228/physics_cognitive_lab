import { LEARNING_STAGE_ORDER, LearningStage } from "@/types/learning";

/**
 * Student-facing language only.
 * Internal stage IDs stay English: OBSERVE, DESCRIBE, PREDICT, ...
 */
export const STUDENT_STAGE_LABELS: Record<
  (typeof LEARNING_STAGE_ORDER)[number],
  string
> = {
  [LearningStage.ENTRY]: "开始探索",
  [LearningStage.OBSERVE]: "先观察",
  [LearningStage.DESCRIBE]: "用物理语言描述",
  [LearningStage.PREDICT]: "先预测",
  [LearningStage.EXPERIMENT]: "动手验证",
  [LearningStage.EXPLAIN]: "解释为什么",
  [LearningStage.MODEL]: "建立物理模型",
  [LearningStage.TRANSFER]: "换个情境试试",
  [LearningStage.EXAM]: "试试看考试题",
  [LearningStage.AI_OFF]: "独立挑战",
  [LearningStage.COMPLETE]: "完成",
};

export const STUDENT_STAGE_PROMPTS: Partial<
  Record<(typeof LEARNING_STAGE_ORDER)[number], string>
> = {
  [LearningStage.ENTRY]: "面包放进微波炉，为什么会变热？",
  [LearningStage.OBSERVE]: "加热的时候，面包发生了什么？",
  [LearningStage.DESCRIBE]: "用更准确的话说说，到底什么变了？",
  [LearningStage.PREDICT]: "如果加热更久，你觉得会怎样？",
  [LearningStage.EXPERIMENT]: "改一个条件，看看是不是和你想的一样。",
  [LearningStage.EXPLAIN]: "为什么温度会升高？",
  [LearningStage.MODEL]: "把你的想法连成一条因果链。",
  [LearningStage.TRANSFER]: "换个情况，你还能这样解释吗？",
  [LearningStage.EXAM]: "先想清楚题目在问什么，再选答案。",
  [LearningStage.AI_OFF]: "这一次，自己来。",
  [LearningStage.COMPLETE]: "回头看看你刚才想了什么。",
};

export const STUDENT_CHROME = {
  productName: "物理思考实验室",
  preparing: "正在准备实验室…",
  back: "返回",
  backAria: "返回上一步",
  startOver: "重新开始",
  startOverAria: "从头再来一次",
  startAria: "开始探究",
  progressAria: "当前进度",
  tutorName: "问一句",
  tutorAsk: "问我一句",
  tutorAskAria: "针对你刚写的内容问一句",
  tutorIdle: "可选。针对你刚写的内容，可以问一句。",
  tutorLoading: "正在想一个问题…",
  examSeparate:
    "现在先不看实验场景。先把题目想清楚，再选答案。",
} as const;

export const STUDENT_FOOTER: Record<(typeof LEARNING_STAGE_ORDER)[number], string> = {
  [LearningStage.ENTRY]: "",
  [LearningStage.OBSERVE]: "先看面包怎么变，再写下你看到的。",
  [LearningStage.DESCRIBE]: "试着说出：什么量发生了怎样的变化。",
  [LearningStage.PREDICT]: "先猜，再动手。",
  [LearningStage.EXPERIMENT]: "改一个条件，对照一下刚才的猜测。",
  [LearningStage.EXPLAIN]: "先说清楚为什么，不要急着套名词。",
  [LearningStage.MODEL]: "自己把因果顺序连起来。",
  [LearningStage.TRANSFER]: "情况换了，看看刚才的想法还能不能用。",
  [LearningStage.EXAM]: "先想清楚，再选答案，并写下理由。",
  [LearningStage.AI_OFF]: "这一页没有提示，也没有人帮你。",
  [LearningStage.COMPLETE]: "这些只是你刚才留下的思考痕迹，不是掌握程度。",
};

export const MODEL_NODE_LABELS: Record<string, string> = {
  "internal energy changes": "内能发生了变化",
  "mass changes": "质量发生了变化",
  "speed changes": "速度发生了变化",
};

export const MODEL_ANCHOR_LABELS: Record<string, string> = {
  "energy enters": "能量进入",
  "temperature increases": "温度升高",
};

export function studentModelLabel(node: string): string {
  return MODEL_NODE_LABELS[node] ?? MODEL_ANCHOR_LABELS[node] ?? node;
}

export const PREDICTION_LABELS: Record<string, string> = {
  "temperature increases": "温度会升高。",
  "temperature stays about the same": "温度差不多不变。",
  "temperature decreases": "温度会降低。",
  "not sure": "我还不确定。",
};

export function studentPredictionLabel(value: string): string {
  return PREDICTION_LABELS[value] ?? value;
}
