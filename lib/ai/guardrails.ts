import {
  SAFE_TUTOR_FALLBACK,
  type TutorResponseParsed,
} from "@/lib/ai/tutor-schema";
import {
  isActionAllowed,
  isRevealProtected,
  isTutorAllowed,
} from "@/lib/learning/stage-policy";
import { LearningStage, type LearningStage as LearningStageType } from "@/types/learning";
import { TutorAction, type TutorAction as TutorActionType } from "@/types/ai";

const MAX_MESSAGE_LENGTH = 280;

export function applyTutorGuardrails(
  response: TutorResponseParsed,
  stage: LearningStageType,
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
    looksLikeAnswerLeak(stage, sanitizedMessage);

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
): boolean {
  const normalized = message.toLowerCase();

  if (stage === LearningStage.PREDICT) {
    return /the temperature will (increase|decrease)|correct prediction|the result will be/.test(
      normalized,
    );
  }

  if (stage === LearningStage.MODEL) {
    return /put (the )?internal energy|place internal energy|the middle (card|box) is|belongs between these two: internal/.test(
      normalized,
    );
  }

  if (stage === LearningStage.TRANSFER) {
    return /this is the same as the microwave|use the bread model|the shared model is/.test(
      normalized,
    );
  }

  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return /the temperature increased because energy entered/.test(normalized);
  }

  return false;
}

function firstAllowedAction(stage: LearningStageType): TutorActionType {
  if (isActionAllowed(stage, TutorAction.ASK)) {
    return TutorAction.ASK;
  }

  return TutorAction.ENCOURAGE;
}
