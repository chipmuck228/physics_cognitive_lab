import { previousStage, stageIndex } from "@/lib/learning/state-machine";
import { LearningStage, type LearningSession } from "@/types/learning";

export const LENS_VIEWING_STAGE_KEY = "viewingStage";

export function lensViewingStage(session: LearningSession): LearningStage | null {
  const value = session.sceneData[LENS_VIEWING_STAGE_KEY];
  if (typeof value !== "string") {
    return null;
  }
  if (!Object.values(LearningStage).includes(value as LearningStage)) {
    return null;
  }
  const viewing = value as LearningStage;
  if (stageIndex(viewing) >= stageIndex(session.stage)) {
    return null;
  }
  return viewing;
}

export function lensDisplayStage(session: LearningSession): LearningStage {
  return lensViewingStage(session) ?? session.stage;
}

export function isLensRevisiting(session: LearningSession): boolean {
  return lensViewingStage(session) !== null;
}

export function withLensViewingStage(
  sceneData: Record<string, unknown>,
  viewing: LearningStage | null,
): Record<string, unknown> {
  if (!viewing) {
    const next = { ...sceneData };
    delete next[LENS_VIEWING_STAGE_KEY];
    return next;
  }
  return { ...sceneData, [LENS_VIEWING_STAGE_KEY]: viewing };
}

export function canLensGoBack(session: LearningSession): boolean {
  const display = lensDisplayStage(session);
  return previousStage(display) !== null && display !== LearningStage.ENTRY;
}

export function applyLensGoBack(session: LearningSession): LearningSession {
  const display = lensDisplayStage(session);
  const target = previousStage(display);
  if (!target) {
    return session;
  }
  if (stageIndex(target) >= stageIndex(session.stage)) {
    return session;
  }
  return {
    ...session,
    sceneData: withLensViewingStage(session.sceneData, target),
  };
}

export function applyLensReturnToProgress(session: LearningSession): LearningSession {
  if (!isLensRevisiting(session)) {
    return session;
  }
  return {
    ...session,
    sceneData: withLensViewingStage(session.sceneData, null),
  };
}

export function lensReturnCta(authoritative: LearningStage): string {
  const labels: Partial<Record<LearningStage, string>> = {
    [LearningStage.OBSERVE]: "返回看一看",
    [LearningStage.DESCRIBE]: "返回说清楚",
    [LearningStage.PREDICT]: "返回先猜一猜",
    [LearningStage.EXPERIMENT]: "返回动手比一比",
    [LearningStage.EXPLAIN]: "返回试着说明",
    [LearningStage.MODEL]: "返回建构光路",
    [LearningStage.TRANSFER]: "返回换个样子",
    [LearningStage.EXAM]: "返回题目",
    [LearningStage.AI_OFF]: "返回自己做",
    [LearningStage.COMPLETE]: "返回结束",
  };
  return labels[authoritative] ?? "返回刚才的进度";
}
