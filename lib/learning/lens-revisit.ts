import { previousStage, stageIndex } from "@/lib/learning/state-machine";
import {
  createInitialConvexLensState,
  isConvexLensSceneState,
  type ConvexLensSceneState,
} from "@/lib/physics/convex-lens-optical-bench";
import { LearningStage, type LearningSession } from "@/types/learning";

export const LENS_VIEWING_STAGE_KEY = "viewingStage";
export const LENS_REVIEW_PHYSICS_KEY = "reviewPhysics";

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

export function authoritativeLensPhysics(session: LearningSession): ConvexLensSceneState {
  return isConvexLensSceneState(session.physicsState.state)
    ? session.physicsState.state
    : createInitialConvexLensState();
}

export function lensReviewPhysics(session: LearningSession): ConvexLensSceneState | null {
  const raw = session.sceneData[LENS_REVIEW_PHYSICS_KEY];
  return isConvexLensSceneState(raw) ? raw : null;
}

export function lensPreviewPhysics(session: LearningSession): ConvexLensSceneState {
  if (isLensRevisiting(session)) {
    return lensReviewPhysics(session) ?? authoritativeLensPhysics(session);
  }
  return authoritativeLensPhysics(session);
}

export function withLensReviewPhysics(
  sceneData: Record<string, unknown>,
  state: ConvexLensSceneState | null,
): Record<string, unknown> {
  if (!state) {
    const next = { ...sceneData };
    delete next[LENS_REVIEW_PHYSICS_KEY];
    return next;
  }
  return { ...sceneData, [LENS_REVIEW_PHYSICS_KEY]: { ...state } };
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
  const viewingData = withLensViewingStage(session.sceneData, target);
  const seeded = lensReviewPhysics({ ...session, sceneData: viewingData })
    ? viewingData
    : withLensReviewPhysics(viewingData, authoritativeLensPhysics(session));
  return {
    ...session,
    sceneData: seeded,
  };
}

export function applyLensReturnToProgress(session: LearningSession): LearningSession {
  if (!isLensRevisiting(session)) {
    return session;
  }
  return {
    ...session,
    sceneData: withLensReviewPhysics(
      withLensViewingStage(session.sceneData, null),
      null,
    ),
  };
}

export function applyLensReviewPhysics(
  session: LearningSession,
  updater: (state: ConvexLensSceneState) => ConvexLensSceneState,
): LearningSession {
  if (!isLensRevisiting(session)) {
    return session;
  }
  return {
    ...session,
    sceneData: withLensReviewPhysics(
      session.sceneData,
      updater(lensPreviewPhysics(session)),
    ),
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
