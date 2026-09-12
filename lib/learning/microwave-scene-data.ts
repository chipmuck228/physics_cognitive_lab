import type { LearningSession } from "@/types/learning";
import type { MicrowaveExperimentResult } from "@/types/physics";
import type { MicrowaveDescribeInput } from "@/lib/learning/microwave-describe";
import {
  MICROWAVE_AI_OFF_DRAFT_KIND,
  emptyMicrowaveAiOffDraft,
  type MicrowaveAiOffDraft,
} from "@/lib/learning/microwave-ai-off";
import {
  MICROWAVE_EXAM_DRAFT_KIND,
  emptyMicrowaveExamDraft,
  type MicrowaveExamDraft,
} from "@/lib/learning/microwave-exam";
import { emptyMicrowaveExplainInput, type MicrowaveExplainInput } from "@/lib/learning/microwave-explain";
import {
  MICROWAVE_MODEL_DRAFT_KIND,
  emptyMicrowaveModelDraft,
  type MicrowaveModelDraft,
} from "@/lib/learning/microwave-model";
import {
  MICROWAVE_TRANSFER_DRAFT_KIND,
  emptyMicrowaveTransferDraft,
  type MicrowaveTransferDraft,
} from "@/lib/learning/microwave-transfer";

export const MICROWAVE_EXPERIMENT_HISTORY_KEY = "experimentHistory";
export const MICROWAVE_DESCRIBE_DRAFT_KEY = "describeDraft";
export const MICROWAVE_EXPLAIN_DRAFT_KEY = "explainDraft";
export const MICROWAVE_MODEL_DRAFT_KEY = "modelDraft";
export const MICROWAVE_TRANSFER_DRAFT_KEY = "transferDraft";
export const MICROWAVE_EXAM_DRAFT_KEY = "examDraft";
export const MICROWAVE_AI_OFF_DRAFT_KEY = "aiOffDraft";

export function emptyMicrowaveSceneData(): Record<string, unknown> {
  return { [MICROWAVE_EXPERIMENT_HISTORY_KEY]: [] };
}

export function getMicrowaveExperimentHistory(
  session: LearningSession,
): MicrowaveExperimentResult[] {
  const history = session.sceneData[MICROWAVE_EXPERIMENT_HISTORY_KEY];
  if (!Array.isArray(history)) {
    return [];
  }
  return history as MicrowaveExperimentResult[];
}

export function withMicrowaveExperimentHistory(
  session: LearningSession,
  history: MicrowaveExperimentResult[],
): Record<string, unknown> {
  return {
    ...session.sceneData,
    [MICROWAVE_EXPERIMENT_HISTORY_KEY]: history,
  };
}

export function microwaveDescribeDraft(
  session: LearningSession,
): MicrowaveDescribeInput | null {
  const draft = session.sceneData[MICROWAVE_DESCRIBE_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  return draft as MicrowaveDescribeInput;
}

export function withMicrowaveDescribeDraft(
  sceneData: Record<string, unknown>,
  draft: MicrowaveDescribeInput,
): Record<string, unknown> {
  return { ...sceneData, [MICROWAVE_DESCRIBE_DRAFT_KEY]: draft };
}

export function microwaveExplainDraft(session: LearningSession): MicrowaveExplainInput {
  const draft = session.sceneData[MICROWAVE_EXPLAIN_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyMicrowaveExplainInput();
  }
  const record = draft as Partial<MicrowaveExplainInput>;
  return {
    ...emptyMicrowaveExplainInput(),
    energyTransfer: record.energyTransfer ?? "",
    link: record.link ?? "",
    studentExplanation: record.studentExplanation ?? "",
  };
}

export function withMicrowaveExplainDraft(
  sceneData: Record<string, unknown>,
  draft: MicrowaveExplainInput,
): Record<string, unknown> {
  return { ...sceneData, [MICROWAVE_EXPLAIN_DRAFT_KEY]: draft };
}

export function microwaveModelDraft(session: LearningSession): MicrowaveModelDraft {
  const draft = session.sceneData[MICROWAVE_MODEL_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyMicrowaveModelDraft();
  }
  const record = draft as Partial<MicrowaveModelDraft>;
  return {
    kind: MICROWAVE_MODEL_DRAFT_KIND,
    system: record.system ?? "",
    energyTransfer: record.energyTransfer ?? "",
    internalEnergy: record.internalEnergy ?? "",
    temperatureRelation: record.temperatureRelation ?? "",
    distinction: record.distinction ?? "",
    conditions: Array.isArray(record.conditions) ? record.conditions : [],
    authoredDistinction: record.authoredDistinction ?? "",
  };
}

export function withMicrowaveModelDraft(
  sceneData: Record<string, unknown>,
  draft: MicrowaveModelDraft,
): Record<string, unknown> {
  return { ...sceneData, [MICROWAVE_MODEL_DRAFT_KEY]: draft };
}

export function microwaveTransferDraft(session: LearningSession): MicrowaveTransferDraft {
  const draft = session.sceneData[MICROWAVE_TRANSFER_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyMicrowaveTransferDraft();
  }
  const record = draft as Partial<MicrowaveTransferDraft>;
  const empty = emptyMicrowaveTransferDraft(record.targetId);
  return {
    kind: MICROWAVE_TRANSFER_DRAFT_KIND,
    targetId: record.targetId ?? empty.targetId,
    judgments: { ...empty.judgments, ...(record.judgments ?? {}) },
    surfaceCueSelected: record.surfaceCueSelected === true,
    studentExplanation: record.studentExplanation ?? "",
    conditionChecks:
      record.conditionChecks &&
      typeof record.conditionChecks === "object" &&
      !Array.isArray(record.conditionChecks)
        ? { ...record.conditionChecks }
        : {},
  };
}

export function withMicrowaveTransferDraft(
  sceneData: Record<string, unknown>,
  draft: MicrowaveTransferDraft,
): Record<string, unknown> {
  return { ...sceneData, [MICROWAVE_TRANSFER_DRAFT_KEY]: draft };
}

export function microwaveExamDraft(session: LearningSession): MicrowaveExamDraft {
  const draft = session.sceneData[MICROWAVE_EXAM_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyMicrowaveExamDraft();
  }
  const record = draft as Partial<MicrowaveExamDraft>;
  const empty = emptyMicrowaveExamDraft(
    Array.isArray(record.patternIds) ? record.patternIds : undefined,
  );
  return {
    kind: MICROWAVE_EXAM_DRAFT_KIND,
    patternIds: empty.patternIds,
    currentPatternId: record.currentPatternId ?? empty.currentPatternId,
    step:
      record.step === "model" ||
      record.step === "answer" ||
      record.step === "representation"
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

export function withMicrowaveExamDraft(
  sceneData: Record<string, unknown>,
  draft: MicrowaveExamDraft,
): Record<string, unknown> {
  return { ...sceneData, [MICROWAVE_EXAM_DRAFT_KEY]: draft };
}

export function microwaveAiOffDraft(session: LearningSession): MicrowaveAiOffDraft {
  const draft = session.sceneData[MICROWAVE_AI_OFF_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyMicrowaveAiOffDraft();
  }
  const record = draft as Partial<MicrowaveAiOffDraft>;
  const empty = emptyMicrowaveAiOffDraft(
    Array.isArray(record.challengeIds) ? record.challengeIds : undefined,
  );
  return {
    kind: MICROWAVE_AI_OFF_DRAFT_KIND,
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

export function withMicrowaveAiOffDraft(
  sceneData: Record<string, unknown>,
  draft: MicrowaveAiOffDraft,
): Record<string, unknown> {
  return { ...sceneData, [MICROWAVE_AI_OFF_DRAFT_KEY]: draft };
}
