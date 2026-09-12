import type { LensDescribeInput } from "@/lib/learning/lens-describe";
import {
  LENS_AI_OFF_DRAFT_KIND,
  emptyLensAiOffDraft,
  type LensAiOffDraft,
} from "@/lib/learning/lens-ai-off";
import {
  LENS_EXAM_DRAFT_KIND,
  emptyLensExamDraft,
  type LensExamDraft,
} from "@/lib/learning/lens-exam";
import {
  emptyLensModelDraft,
  type LensModelDraft,
} from "@/lib/learning/lens-model";
import {
  LENS_TRANSFER_DRAFT_KIND,
  emptyLensTransferDraft,
  type LensTransferDraft,
} from "@/lib/learning/lens-transfer";
import { emptyLensExplainInput, type LensExplainInput } from "@/lib/learning/lens-explain";
import type { LearningSession } from "@/types/learning";

export const LENS_WATCHED_DEMO_KEY = "watchedObserveDemo";
export const LENS_DESCRIBE_DRAFT_KEY = "describeDraft";
export const LENS_EXPLAIN_DRAFT_KEY = "explainDraft";
export const LENS_MODEL_DRAFT_KEY = "modelDraft";
export const LENS_TRANSFER_DRAFT_KEY = "transferDraft";
export const LENS_EXAM_DRAFT_KEY = "examDraft";
export const LENS_AI_OFF_DRAFT_KEY = "aiOffDraft";

export function emptyLensSceneData(): Record<string, unknown> {
  return { [LENS_WATCHED_DEMO_KEY]: false };
}

export function lensWatchedObserveDemo(session: LearningSession): boolean {
  return session.sceneData[LENS_WATCHED_DEMO_KEY] === true;
}

export function withLensWatchedDemo(
  sceneData: Record<string, unknown>,
  watched: boolean,
): Record<string, unknown> {
  return { ...sceneData, [LENS_WATCHED_DEMO_KEY]: watched };
}

export function lensDescribeDraft(session: LearningSession): LensDescribeInput | null {
  const draft = session.sceneData[LENS_DESCRIBE_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  return draft as LensDescribeInput;
}

export function withLensDescribeDraft(
  sceneData: Record<string, unknown>,
  draft: LensDescribeInput,
): Record<string, unknown> {
  return { ...sceneData, [LENS_DESCRIBE_DRAFT_KEY]: draft };
}

export function lensExplainDraft(session: LearningSession): LensExplainInput {
  const draft = session.sceneData[LENS_EXPLAIN_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensExplainInput();
  }
  return { ...emptyLensExplainInput(), ...(draft as Partial<LensExplainInput>) };
}

export function withLensExplainDraft(
  sceneData: Record<string, unknown>,
  draft: LensExplainInput,
): Record<string, unknown> {
  return { ...sceneData, [LENS_EXPLAIN_DRAFT_KEY]: draft };
}

export function lensModelDraft(session: LearningSession): LensModelDraft {
  const draft = session.sceneData[LENS_MODEL_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensModelDraft();
  }
  return { ...emptyLensModelDraft(), ...(draft as Partial<LensModelDraft>) };
}

export function withLensModelDraft(
  sceneData: Record<string, unknown>,
  draft: LensModelDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_MODEL_DRAFT_KEY]: draft };
}

export function lensTransferDraft(session: LearningSession): LensTransferDraft {
  const draft = session.sceneData[LENS_TRANSFER_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensTransferDraft();
  }
  const record = draft as Partial<LensTransferDraft>;
  const empty = emptyLensTransferDraft(record.targetId);
  return {
    kind: LENS_TRANSFER_DRAFT_KIND,
    targetId: record.targetId ?? empty.targetId,
    objectStation: record.objectStation ?? "",
    meetingMode: record.meetingMode ?? "",
    side: record.side ?? "",
    nature: record.nature ?? "",
    orientation: record.orientation ?? "",
    size: record.size ?? "",
    screenReceivable: record.screenReceivable ?? "",
    studentExplanation: record.studentExplanation ?? "",
    surfaceCueSelected: record.surfaceCueSelected === true,
  };
}

export function withLensTransferDraft(
  sceneData: Record<string, unknown>,
  draft: LensTransferDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_TRANSFER_DRAFT_KEY]: draft };
}

export function lensExamDraft(session: LearningSession): LensExamDraft {
  const draft = session.sceneData[LENS_EXAM_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensExamDraft();
  }
  const record = draft as Partial<LensExamDraft>;
  const empty = emptyLensExamDraft(
    Array.isArray(record.patternIds) ? record.patternIds : undefined,
  );
  return {
    kind: LENS_EXAM_DRAFT_KIND,
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

export function withLensExamDraft(
  sceneData: Record<string, unknown>,
  draft: LensExamDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_EXAM_DRAFT_KEY]: draft };
}

export function lensAiOffDraft(session: LearningSession): LensAiOffDraft {
  const draft = session.sceneData[LENS_AI_OFF_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyLensAiOffDraft();
  }
  const record = draft as Partial<LensAiOffDraft>;
  const empty = emptyLensAiOffDraft(
    Array.isArray(record.challengeIds) ? record.challengeIds : undefined,
  );
  return {
    kind: LENS_AI_OFF_DRAFT_KIND,
    challengeIds: empty.challengeIds,
    currentChallengeId: record.currentChallengeId ?? empty.currentChallengeId,
    step: record.step === "post-check" ? "post-check" : "response",
    objectStation: record.objectStation ?? "",
    meetingMode: record.meetingMode ?? "",
    side: record.side ?? "",
    nature: record.nature ?? "",
    orientation: record.orientation ?? "",
    size: record.size ?? "",
    screenReceivable: record.screenReceivable ?? "",
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

export function withLensAiOffDraft(
  sceneData: Record<string, unknown>,
  draft: LensAiOffDraft,
): Record<string, unknown> {
  return { ...sceneData, [LENS_AI_OFF_DRAFT_KEY]: draft };
}
