import type { OhmsDescribeInput } from "@/lib/learning/ohms-describe";
import {
  OHMS_AI_OFF_DRAFT_KIND,
  emptyOhmsAiOffDraft,
  type OhmsAiOffDraft,
} from "@/lib/learning/ohms-ai-off";
import {
  OHMS_EXAM_DRAFT_KIND,
  emptyOhmsExamDraft,
  type OhmsExamDraft,
} from "@/lib/learning/ohms-exam";
import {
  OHMS_MODEL_DRAFT_KIND,
  emptyOhmsModelDraft,
  type OhmsModelDraft,
} from "@/lib/learning/ohms-model";
import {
  OHMS_TRANSFER_DRAFT_KIND,
  emptyOhmsTransferDraft,
  type OhmsTransferDraft,
} from "@/lib/learning/ohms-transfer";
import { emptyOhmsExplainInput, type OhmsExplainInput } from "@/lib/learning/ohms-explain";
import type { LearningSession } from "@/types/learning";

export const OHMS_WATCHED_DEMO_KEY = "watchedObserveDemo";
export const OHMS_DESCRIBE_DRAFT_KEY = "describeDraft";
export const OHMS_EXPLAIN_DRAFT_KEY = "explainDraft";
export const OHMS_MODEL_DRAFT_KEY = "modelDraft";
export const OHMS_TRANSFER_DRAFT_KEY = "transferDraft";
export const OHMS_EXAM_DRAFT_KEY = "examDraft";
export const OHMS_AI_OFF_DRAFT_KEY = "aiOffDraft";

export function emptyOhmsSceneData(): Record<string, unknown> {
  return { [OHMS_WATCHED_DEMO_KEY]: false };
}

export function ohmsWatchedObserveDemo(session: LearningSession): boolean {
  return session.sceneData[OHMS_WATCHED_DEMO_KEY] === true;
}

export function withOhmsWatchedDemo(
  sceneData: Record<string, unknown>,
  watched: boolean,
): Record<string, unknown> {
  return { ...sceneData, [OHMS_WATCHED_DEMO_KEY]: watched };
}

export function ohmsDescribeDraft(session: LearningSession): OhmsDescribeInput | null {
  const draft = session.sceneData[OHMS_DESCRIBE_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  return draft as OhmsDescribeInput;
}

export function withOhmsDescribeDraft(
  sceneData: Record<string, unknown>,
  draft: OhmsDescribeInput,
): Record<string, unknown> {
  return { ...sceneData, [OHMS_DESCRIBE_DRAFT_KEY]: draft };
}

export function ohmsExplainDraft(session: LearningSession): OhmsExplainInput {
  const draft = session.sceneData[OHMS_EXPLAIN_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyOhmsExplainInput();
  }
  return { ...emptyOhmsExplainInput(), ...(draft as Partial<OhmsExplainInput>) };
}

export function withOhmsExplainDraft(
  sceneData: Record<string, unknown>,
  draft: OhmsExplainInput,
): Record<string, unknown> {
  return { ...sceneData, [OHMS_EXPLAIN_DRAFT_KEY]: draft };
}

export function ohmsModelDraft(session: LearningSession): OhmsModelDraft {
  const draft = session.sceneData[OHMS_MODEL_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyOhmsModelDraft();
  }
  return { ...emptyOhmsModelDraft(), ...(draft as Partial<OhmsModelDraft>) };
}

export function withOhmsModelDraft(
  sceneData: Record<string, unknown>,
  draft: OhmsModelDraft,
): Record<string, unknown> {
  return { ...sceneData, [OHMS_MODEL_DRAFT_KEY]: draft };
}

export function ohmsTransferDraft(session: LearningSession): OhmsTransferDraft {
  const draft = session.sceneData[OHMS_TRANSFER_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyOhmsTransferDraft();
  }
  const record = draft as Partial<OhmsTransferDraft>;
  const empty = emptyOhmsTransferDraft(record.targetId);
  return {
    kind: OHMS_TRANSFER_DRAFT_KIND,
    targetId: record.targetId ?? empty.targetId,
    judgments: { ...empty.judgments, ...(record.judgments ?? {}) },
    surfaceCueSelected: record.surfaceCueSelected === true,
    studentExplanation: record.studentExplanation ?? "",
    conditionChecks: record.conditionChecks ?? {},
  };
}

export function withOhmsTransferDraft(
  sceneData: Record<string, unknown>,
  draft: OhmsTransferDraft,
): Record<string, unknown> {
  return { ...sceneData, [OHMS_TRANSFER_DRAFT_KEY]: draft };
}

export function ohmsExamDraft(session: LearningSession): OhmsExamDraft {
  const draft = session.sceneData[OHMS_EXAM_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyOhmsExamDraft();
  }
  const record = draft as Partial<OhmsExamDraft>;
  const empty = emptyOhmsExamDraft(
    Array.isArray(record.patternIds) ? record.patternIds : undefined,
  );
  return {
    kind: OHMS_EXAM_DRAFT_KIND,
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

export function withOhmsExamDraft(
  sceneData: Record<string, unknown>,
  draft: OhmsExamDraft,
): Record<string, unknown> {
  return { ...sceneData, [OHMS_EXAM_DRAFT_KEY]: draft };
}

export function ohmsAiOffDraft(session: LearningSession): OhmsAiOffDraft {
  const draft = session.sceneData[OHMS_AI_OFF_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyOhmsAiOffDraft();
  }
  const record = draft as Partial<OhmsAiOffDraft>;
  const empty = emptyOhmsAiOffDraft(
    Array.isArray(record.challengeIds) ? record.challengeIds : undefined,
  );
  return {
    kind: OHMS_AI_OFF_DRAFT_KIND,
    challengeIds: empty.challengeIds,
    currentChallengeId: record.currentChallengeId ?? empty.currentChallengeId,
    step: record.step === "post-check" ? "post-check" : "response",
    selectedAnswer: record.selectedAnswer ?? "",
    reasoning: record.reasoning ?? "",
    postCheckSelections: Array.isArray(record.postCheckSelections)
      ? record.postCheckSelections
      : [],
    preCommitEvidenceIds: Array.isArray(record.preCommitEvidenceIds)
      ? record.preCommitEvidenceIds
      : [],
    retiredChallengeIds: Array.isArray(record.retiredChallengeIds)
      ? record.retiredChallengeIds
      : [],
  };
}

export function withOhmsAiOffDraft(
  sceneData: Record<string, unknown>,
  draft: OhmsAiOffDraft,
): Record<string, unknown> {
  return { ...sceneData, [OHMS_AI_OFF_DRAFT_KEY]: draft };
}
