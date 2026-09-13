import {
  lensContextHasCapability,
  lensContextHasReference,
  lensContextLookableReference,
  lensVisibleInteractionContext,
  type LensCapabilityId,
  type LensReferenceId,
  type LensVisibleInteractionContext,
} from "@/lib/learning/lens-interaction-context";
import { LearningStage, type LearningSession } from "@/types/learning";

export const LENS_HELP_KEY = "helpByStage";

export const LENS_HELP_INTENTS = [
  { id: "what-now", label: "我不知道现在要做什么" },
  { id: "where-look", label: "我不知道该看哪里" },
  { id: "how-distinguish", label: "我不知道怎么把这些东西分开" },
  { id: "what-compare", label: "我不知道该比较什么" },
  { id: "how-reason", label: "我不知道理由怎么写" },
  { id: "how-rays", label: "我不知道光线怎么走" },
  { id: "how-meeting", label: "我不知道光线怎样相遇" },
  { id: "how-image", label: "我不知道怎么判断像" },
  { id: "how-say", label: "我不知道这句话怎么说" },
] as const;

export type LensHelpIntentId = (typeof LENS_HELP_INTENTS)[number]["id"];

export interface LensHelpContext {
  constructionStep?: number;
  revisiting?: boolean;
  interaction?: LensVisibleInteractionContext;
  modelDraft?: import("@/lib/learning/lens-model").LensModelDraft;
}

interface LensHelpBinding {
  capabilities: readonly LensCapabilityId[];
  references: readonly LensReferenceId[];
}

const INTENT_BINDINGS: Record<LensHelpIntentId, LensHelpBinding> = {
  "what-now": { capabilities: ["request-help"], references: [] },
  "where-look": {
    capabilities: ["request-help"],
    references: ["object", "lens", "screen", "visible-image-state"],
  },
  "how-distinguish": {
    capabilities: ["request-help"],
    references: ["object", "lens", "f-marks", "visible-image-state"],
  },
  "what-compare": { capabilities: ["request-help"], references: [] },
  "how-reason": { capabilities: ["request-help"], references: [] },
  "how-rays": { capabilities: ["construct-relation"], references: ["ray"] },
  "how-meeting": { capabilities: ["request-help"], references: ["ray", "meeting-point"] },
  "how-image": { capabilities: ["request-help"], references: ["ray", "meeting-point"] },
  "how-say": { capabilities: ["request-help"], references: [] },
};

const REFERENCE_TOKENS: Partial<Record<LensReferenceId, readonly string[]>> = {
  ray: ["光线", "实线", "虚线"],
  "meeting-point": ["相遇", "相交", "会聚"],
};

const ATTENTION = "先停一下，只看眼前这一步，不要一次想完整张表。";
const COMPARE = "把两个东西并排放：你刚改的，和你看见的。";
const QUESTION = "先问一个中间问题，再决定怎么选。";
const EXPRESS = "写的时候先说你改了什么，再说你看见什么。";

const LADDERS: Record<LensHelpIntentId, readonly string[]> = {
  "what-now": [
    ATTENTION,
    "这一页只要完成眼前这一格，不要跳去后面的成像结论。",
    QUESTION,
    EXPRESS,
  ],
  "where-look": [
    "先看光具座中间的透镜，再看左边的物体和右边的光屏。",
    COMPARE,
    "F 和 2F 是位置标志，不是像，也不是光屏。",
    "先指给自己看：物体在哪，光屏在哪，再写。",
  ],
  "how-distinguish": [
    "先对着光具座指：左边是物体，中间是透镜。",
    "把 F / 2F 和像、光屏并排放：它们是不是同一件东西？",
    "先问：你指的是装置上的哪一块？",
    "写的时候分别说出物体、透镜、像和光屏。",
  ],
  "what-compare": [
    "先只看你刚改的那一项。",
    COMPARE,
    "先问：变的是位置，还是光屏上的画面？",
    "再说相同的地方和不同的地方。",
  ],
  "how-reason": [
    "先写你准备改什么，或你看见什么。",
    "不要先跳到整张成像表。",
    "先问：物体相对 F / 2F 换了没有？",
    "再用“所以”接上你预计会看见的。",
  ],
  "how-rays": [
    "先选一条你能说清楚的光线，不要同时想三条。",
    "到达透镜前怎么走，和过透镜后怎么走，要说的是同一条光线。",
    QUESTION,
    "实线表示光真的这样走；虚线只表示把光线反方向延长。",
  ],
  "how-meeting": [
    "先看两条光线过透镜以后是聚到一起，还是散开。",
    "把“真的交在一点”和“只有延长线相交”并排放。",
    "先问：交点在光线前进的方向上吗？",
    "用自己的话写会聚方式，不要只背表。",
  ],
  "how-image": [
    "先看两条光线过透镜以后是聚到一起，还是散开。",
    COMPARE,
    "像在哪一侧、光屏能不能接到，要跟刚才的会聚方式放在一起想。",
    EXPRESS,
  ],
  "how-say": [
    "先写半句：你改的是物体位置还是光屏位置。",
    COMPARE,
    QUESTION,
    "再用“所以”接上你看见的结果。不要只写“变了”。",
  ],
};

const HOW_MEETING_TEXTUAL = [
  "先问自己：出射以后，光线是聚到一起，还是散开。",
  "把“真的交在一点”和“只有延长线相交”并排放。",
  "先问：交点是在前进方向上，还是只有反方向延长才有？",
  "用自己的话写会聚方式，不要只背表。",
] as const;

const HOW_IMAGE_TEXTUAL = [
  "先问这个情境里，会聚方式会怎样，不要去找图上还不存在的光线。",
  COMPARE,
  "像在哪一侧、能不能接到，要跟会聚方式放在一起想。",
  EXPRESS,
] as const;

const LOOK_AT_RAY = /看(?:两条)?光线|先看两条/;
const LOOK_AT_MEETING = /看交点|看.*相遇/;

export function lensHelpAllowed(stage: LearningStage): boolean {
  return (
    stage !== LearningStage.AI_OFF &&
    stage !== LearningStage.COMPLETE &&
    stage !== LearningStage.ENTRY
  );
}

export function resolveLensHelpContext(
  stage: LearningStage,
  lookup: LensHelpContext = {},
): LensVisibleInteractionContext {
  return (
    lookup.interaction ??
    lensVisibleInteractionContext(stage, {
      constructionStep: lookup.constructionStep,
      revisiting: lookup.revisiting,
      modelDraft: lookup.modelDraft,
    })
  );
}

export function lensHelpLadder(
  intentId: LensHelpIntentId,
  context?: LensVisibleInteractionContext,
): readonly string[] {
  const canLookAtRays = context ? lensContextLookableReference(context, "ray") : false;
  if (intentId === "how-meeting" && !canLookAtRays) {
    return HOW_MEETING_TEXTUAL;
  }
  if (intentId === "how-image" && !canLookAtRays) {
    return HOW_IMAGE_TEXTUAL;
  }
  return LADDERS[intentId];
}

export function availableLensHelpIntents(
  stage: LearningStage,
  context: LensHelpContext = {},
): readonly LensHelpIntentId[] {
  if (!lensHelpAllowed(stage)) {
    return [];
  }
  const interaction = resolveLensHelpContext(stage, context);
  return candidateLensHelpIntents(stage, context.constructionStep ?? constructionStepFrom(interaction))
    .filter((intentId) => isLensHelpIntentLegal(intentId, interaction));
}

export function candidateLensHelpIntents(
  stage: LearningStage,
  constructionStep = 1,
): readonly LensHelpIntentId[] {
  if (stage === LearningStage.OBSERVE) {
    return ["what-now", "where-look"];
  }
  if (stage === LearningStage.DESCRIBE) {
    return ["what-now", "how-distinguish", "how-say"];
  }
  if (stage === LearningStage.PREDICT) {
    return ["what-now", "what-compare", "how-reason"];
  }
  if (stage === LearningStage.EXPERIMENT) {
    return ["what-now", "where-look", "what-compare"];
  }
  if (stage === LearningStage.EXPLAIN) {
    return ["what-now", "how-meeting", "how-say"];
  }
  if (stage === LearningStage.MODEL) {
    return modelHelpIntents(constructionStep);
  }
  if (stage === LearningStage.TRANSFER) {
    return ["what-now", "how-image", "how-say"];
  }
  if (stage === LearningStage.EXAM) {
    return ["what-now", "how-reason"];
  }
  return [];
}

function modelHelpIntents(step: number): readonly LensHelpIntentId[] {
  if (step <= 1) {
    return ["what-now"];
  }
  if (step === 2 || step === 3) {
    return ["what-now", "how-rays"];
  }
  if (step === 4) {
    return ["how-meeting"];
  }
  if (step === 5) {
    return ["how-image"];
  }
  if (step === 6) {
    return ["how-say"];
  }
  return ["what-now"];
}

function constructionStepFrom(context: LensVisibleInteractionContext): number {
  const match = context.substep?.match(/^construction-(\d+)$/);
  return match ? Number(match[1]) : 1;
}

export function isLensHelpIntentLegal(
  intentId: LensHelpIntentId,
  context: LensVisibleInteractionContext,
): boolean {
  const binding = INTENT_BINDINGS[intentId];
  if (!binding.capabilities.every((id) => lensContextHasCapability(context, id))) {
    return false;
  }
  if (!binding.references.every((id) => lensContextHasReference(context, id))) {
    return false;
  }
  return lensHelpLadder(intentId, context).every((line) => isLensHelpTextLegal(line, context));
}

export function isLensHelpTextLegal(
  text: string,
  context: LensVisibleInteractionContext,
): boolean {
  if (LOOK_AT_RAY.test(text) && !lensContextLookableReference(context, "ray")) {
    return false;
  }
  if (LOOK_AT_MEETING.test(text) && !lensContextLookableReference(context, "meeting-point")) {
    return false;
  }
  for (const [referenceId, tokens] of Object.entries(REFERENCE_TOKENS) as [
    LensReferenceId,
    readonly string[],
  ][]) {
    if (lensContextHasReference(context, referenceId)) {
      continue;
    }
    if (tokens.some((token) => text.includes(token))) {
      return false;
    }
  }
  return true;
}

export function lensHelpIntentLabel(intentId: LensHelpIntentId): string {
  return LENS_HELP_INTENTS.find((item) => item.id === intentId)?.label ?? intentId;
}

export function lensHelpState(
  session: LearningSession,
  stage: LearningStage,
): { intentId: LensHelpIntentId | ""; revealed: number } {
  const raw = session.sceneData[LENS_HELP_KEY];
  if (!raw || typeof raw !== "object") {
    return { intentId: "", revealed: 0 };
  }
  const record = (raw as Record<string, unknown>)[stage];
  if (!record || typeof record !== "object") {
    return { intentId: "", revealed: 0 };
  }
  const entry = record as { intentId?: string; revealed?: number };
  const intentId = LENS_HELP_INTENTS.some((item) => item.id === entry.intentId)
    ? (entry.intentId as LensHelpIntentId)
    : "";
  return {
    intentId,
    revealed: typeof entry.revealed === "number" ? entry.revealed : 0,
  };
}

export function withLensHelpState(
  sceneData: Record<string, unknown>,
  stage: LearningStage,
  next: { intentId: LensHelpIntentId | ""; revealed: number },
): Record<string, unknown> {
  const current =
    sceneData[LENS_HELP_KEY] && typeof sceneData[LENS_HELP_KEY] === "object"
      ? { ...(sceneData[LENS_HELP_KEY] as Record<string, unknown>) }
      : {};
  current[stage] = next;
  return { ...sceneData, [LENS_HELP_KEY]: current };
}

export function lensHelpPrompts(
  intentId: LensHelpIntentId,
  revealed: number,
  context?: LensVisibleInteractionContext,
): string[] {
  return lensHelpLadder(intentId, context).slice(0, Math.max(0, revealed));
}

export function nextLensHelpPrompt(
  intentId: LensHelpIntentId,
  revealed: number,
  context?: LensVisibleInteractionContext,
): string | null {
  return lensHelpLadder(intentId, context)[revealed] ?? null;
}

export function applyLensHelpIntent(
  session: LearningSession,
  stage: LearningStage,
  intentId: LensHelpIntentId,
  context: LensHelpContext = {},
): LearningSession {
  if (!availableLensHelpIntents(stage, context).includes(intentId)) {
    return session;
  }
  return {
    ...session,
    sceneData: withLensHelpState(session.sceneData, stage, {
      intentId,
      revealed: 1,
    }),
  };
}

export function applyLensHelpNext(
  session: LearningSession,
  stage: LearningStage,
  context: LensHelpContext = {},
): LearningSession {
  if (!lensHelpAllowed(stage)) {
    return session;
  }
  const current = lensHelpState(session, stage);
  if (!current.intentId) {
    return session;
  }
  if (!availableLensHelpIntents(stage, context).includes(current.intentId)) {
    return session;
  }
  if (!nextLensHelpPrompt(current.intentId, current.revealed, resolveLensHelpContext(stage, context))) {
    return session;
  }
  return {
    ...session,
    sceneData: withLensHelpState(session.sceneData, stage, {
      intentId: current.intentId,
      revealed: current.revealed + 1,
    }),
  };
}
