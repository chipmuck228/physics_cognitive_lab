import { LearningStage, type LearningSession } from "@/types/learning";

export const LENS_HELP_KEY = "helpByStage";

export const LENS_HELP_INTENTS = [
  { id: "what-now", label: "我不知道现在要做什么" },
  { id: "where-look", label: "我不知道该看哪里" },
  { id: "how-rays", label: "我不知道光线怎么走" },
  { id: "how-image", label: "我不知道怎么判断像" },
  { id: "how-say", label: "我不知道这句话怎么说" },
] as const;

export type LensHelpIntentId = (typeof LENS_HELP_INTENTS)[number]["id"];

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
  "how-rays": [
    "先选一条你能说清楚的光线，不要同时想三条。",
    "到达透镜前怎么走，和过透镜后怎么走，要说的是同一条光线。",
    QUESTION,
    "实线表示光真的这样走；虚线只表示把光线反方向延长。",
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

export function lensHelpAllowed(stage: LearningStage): boolean {
  return (
    stage !== LearningStage.AI_OFF &&
    stage !== LearningStage.COMPLETE &&
    stage !== LearningStage.ENTRY
  );
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

export function lensHelpPrompts(intentId: LensHelpIntentId, revealed: number): string[] {
  return LADDERS[intentId].slice(0, Math.max(0, revealed));
}

export function nextLensHelpPrompt(
  intentId: LensHelpIntentId,
  revealed: number,
): string | null {
  return LADDERS[intentId][revealed] ?? null;
}

export function applyLensHelpIntent(
  session: LearningSession,
  stage: LearningStage,
  intentId: LensHelpIntentId,
): LearningSession {
  if (!lensHelpAllowed(stage)) {
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
): LearningSession {
  if (!lensHelpAllowed(stage)) {
    return session;
  }
  const current = lensHelpState(session, stage);
  if (!current.intentId) {
    return session;
  }
  if (!nextLensHelpPrompt(current.intentId, current.revealed)) {
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
