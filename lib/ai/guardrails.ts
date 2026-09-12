import { SAFE_TUTOR_FALLBACK, type TutorResponseParsed } from "@/lib/ai/tutor-schema";
import {
  isActionAllowed,
  isRevealProtected,
  isTutorAllowed,
} from "@/lib/learning/stage-policy";
import { registerProductionSceneAdapters } from "@/lib/runtime/register-production-adapters";
import { getSceneAdapter, hasSceneAdapter } from "@/lib/runtime/registry";
import { type LearningStage as LearningStageType, type SceneId } from "@/types/learning";
import { TutorAction, type TutorAction as TutorActionType } from "@/types/ai";

registerProductionSceneAdapters();

const MAX_MESSAGE_LENGTH = 280;

export function applyTutorGuardrails(
  response: TutorResponseParsed,
  stage: LearningStageType,
  sceneId?: SceneId,
): TutorResponseParsed {
  if (!isTutorAllowed(stage)) {
    return { ...SAFE_TUTOR_FALLBACK };
  }

  const allowedAction = isActionAllowed(stage, response.action)
    ? response.action
    : firstAllowedAction(stage);

  const sanitizedMessage = sanitizeTutorMessage(response.message);
  const leaked =
    response.revealsAnswer ||
    looksLikeAnswerLeak(stage, sanitizedMessage, sceneId);

  if (isRevealProtected(stage) && leaked) {
    return {
      ...SAFE_TUTOR_FALLBACK,
      action: allowedAction,
      cognitiveGoal: response.cognitiveGoal,
    };
  }

  return {
    ...response,
    action: allowedAction,
    message: sanitizedMessage,
    revealsAnswer: false,
    suggestedNextStage: null,
  };
}

export function sanitizeTutorMessage(message: string): string {
  const withoutMarkup = message
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (withoutMarkup.length <= MAX_MESSAGE_LENGTH) {
    return withoutMarkup;
  }

  return `${withoutMarkup.slice(0, MAX_MESSAGE_LENGTH).trimEnd()}…`;
}

export function looksLikeAnswerLeak(
  stage: LearningStageType,
  message: string,
  sceneId?: SceneId,
): boolean {
  if (!sceneId || !hasSceneAdapter(sceneId)) {
    return false;
  }
  return (
    getSceneAdapter(sceneId).looksLikeTutorLeak?.(stage, message) ?? false
  );
}

function firstAllowedAction(stage: LearningStageType): TutorActionType {
  if (isActionAllowed(stage, TutorAction.ASK)) {
    return TutorAction.ASK;
  }

  return TutorAction.ENCOURAGE;
}
