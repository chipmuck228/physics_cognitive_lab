import type { CartDescribeInput } from "@/lib/learning/cart-describe";
import type { CartExplainInput } from "@/lib/learning/cart-explain";
import {
  CART_AI_OFF_DRAFT_KIND,
  emptyCartAiOffDraft,
  type CartAiOffDraft,
} from "@/lib/learning/cart-ai-off";
import {
  CART_EXAM_DRAFT_KIND,
  emptyCartExamDraft,
  type CartExamDraft,
} from "@/lib/learning/cart-exam";
import {
  CART_MODEL_DRAFT_KIND,
  emptyCartModelDraft,
  type CartModelDraft,
} from "@/lib/learning/cart-model";
import {
  CART_TRANSFER_DRAFT_KIND,
  emptyCartTransferDraft,
  type CartTransferDraft,
} from "@/lib/learning/cart-transfer";
import { emptyCartExplainInput } from "@/lib/learning/cart-explain";
import type { LearningSession } from "@/types/learning";

export const CART_WATCHED_DEMO_KEY = "watchedObserveDemo";
export const CART_DESCRIBE_DRAFT_KEY = "describeDraft";
export const CART_EXPLAIN_DRAFT_KEY = "explainDraft";
export const CART_MODEL_DRAFT_KEY = "modelDraft";
export const CART_TRANSFER_DRAFT_KEY = "transferDraft";
export const CART_EXAM_DRAFT_KEY = "examDraft";
export const CART_AI_OFF_DRAFT_KEY = "aiOffDraft";

export function emptyCartSceneData(): Record<string, unknown> {
  return {
    [CART_WATCHED_DEMO_KEY]: false,
  };
}

export function cartWatchedObserveDemo(session: LearningSession): boolean {
  return session.sceneData[CART_WATCHED_DEMO_KEY] === true;
}

export function withCartWatchedDemo(
  sceneData: Record<string, unknown>,
  watched: boolean,
): Record<string, unknown> {
  return {
    ...sceneData,
    [CART_WATCHED_DEMO_KEY]: watched,
  };
}

export function cartDescribeDraft(
  session: LearningSession,
): CartDescribeInput | null {
  const draft = session.sceneData[CART_DESCRIBE_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  return draft as CartDescribeInput;
}

export function withCartDescribeDraft(
  sceneData: Record<string, unknown>,
  draft: CartDescribeInput,
): Record<string, unknown> {
  return {
    ...sceneData,
    [CART_DESCRIBE_DRAFT_KEY]: draft,
  };
}

export function cartExplainDraft(session: LearningSession): CartExplainInput {
  const draft = session.sceneData[CART_EXPLAIN_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyCartExplainInput();
  }
  const record = draft as Partial<CartExplainInput>;
  return {
    ...emptyCartExplainInput(),
    forceVsMotion: record.forceVsMotion ?? "",
    sameDirection: record.sameDirection ?? "",
    oppositeDirection: record.oppositeDirection ?? "",
    zeroNetForce: record.zeroNetForce ?? "",
    studentExplanation: record.studentExplanation ?? "",
  };
}

export function withCartExplainDraft(
  sceneData: Record<string, unknown>,
  draft: CartExplainInput,
): Record<string, unknown> {
  return {
    ...sceneData,
    [CART_EXPLAIN_DRAFT_KEY]: draft,
  };
}

export function cartModelDraft(session: LearningSession): CartModelDraft {
  const draft = session.sceneData[CART_MODEL_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyCartModelDraft();
  }
  const record = draft as Partial<CartModelDraft>;
  const empty = emptyCartModelDraft();
  return {
    kind: CART_MODEL_DRAFT_KIND,
    cases: {
      ...empty.cases,
      ...(record.cases ?? {}),
    },
    conditions: Array.isArray(record.conditions) ? record.conditions : [],
  };
}

export function withCartModelDraft(
  sceneData: Record<string, unknown>,
  draft: CartModelDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [CART_MODEL_DRAFT_KEY]: draft,
  };
}

export function cartTransferDraft(session: LearningSession): CartTransferDraft {
  const draft = session.sceneData[CART_TRANSFER_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyCartTransferDraft();
  }
  const record = draft as Partial<CartTransferDraft>;
  const empty = emptyCartTransferDraft(record.targetId);
  return {
    kind: CART_TRANSFER_DRAFT_KIND,
    targetId: record.targetId ?? empty.targetId,
    judgments: {
      ...empty.judgments,
      ...(record.judgments ?? {}),
    },
    surfaceCueSelected: record.surfaceCueSelected === true,
    studentExplanation: record.studentExplanation ?? "",
  };
}

export function withCartTransferDraft(
  sceneData: Record<string, unknown>,
  draft: CartTransferDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [CART_TRANSFER_DRAFT_KEY]: draft,
  };
}

export function cartExamDraft(session: LearningSession): CartExamDraft {
  const draft = session.sceneData[CART_EXAM_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyCartExamDraft();
  }
  const record = draft as Partial<CartExamDraft>;
  const empty = emptyCartExamDraft(
    Array.isArray(record.patternIds) ? record.patternIds : undefined,
  );
  return {
    kind: CART_EXAM_DRAFT_KIND,
    patternIds: empty.patternIds,
    currentPatternId: record.currentPatternId ?? empty.currentPatternId,
    step:
      record.step === "model" || record.step === "answer" || record.step === "representation"
        ? record.step
        : "representation",
    representation: record.representation ?? "",
    modelRecognition: record.modelRecognition ?? "",
    selectedAnswer: record.selectedAnswer ?? "",
    reasoning: record.reasoning ?? "",
    retiredPatternIds: Array.isArray(record.retiredPatternIds)
      ? record.retiredPatternIds
      : [],
  };
}

export function withCartExamDraft(
  sceneData: Record<string, unknown>,
  draft: CartExamDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [CART_EXAM_DRAFT_KEY]: draft,
  };
}

export function cartAiOffDraft(session: LearningSession): CartAiOffDraft {
  const draft = session.sceneData[CART_AI_OFF_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyCartAiOffDraft();
  }
  const record = draft as Partial<CartAiOffDraft>;
  const empty = emptyCartAiOffDraft(
    Array.isArray(record.challengeIds) ? record.challengeIds : undefined,
  );
  return {
    kind: CART_AI_OFF_DRAFT_KIND,
    challengeIds: empty.challengeIds,
    currentChallengeId: record.currentChallengeId ?? empty.currentChallengeId,
    step: record.step === "post-check" ? "post-check" : "response",
    selectedAnswer: record.selectedAnswer ?? "",
    reasoning: record.reasoning ?? "",
    postCheckSelections: Array.isArray(record.postCheckSelections)
      ? record.postCheckSelections
      : [],
    retiredChallengeIds: Array.isArray(record.retiredChallengeIds)
      ? record.retiredChallengeIds
      : [],
  };
}

export function withCartAiOffDraft(
  sceneData: Record<string, unknown>,
  draft: CartAiOffDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [CART_AI_OFF_DRAFT_KEY]: draft,
  };
}
