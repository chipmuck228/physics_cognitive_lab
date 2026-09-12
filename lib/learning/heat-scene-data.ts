import type { HeatDescribeInput } from "@/lib/learning/heat-describe";
import {
  HEAT_AI_OFF_DRAFT_KIND,
  emptyHeatAiOffDraft,
  type HeatAiOffDraft,
} from "@/lib/learning/heat-ai-off";
import {
  HEAT_EXAM_DRAFT_KIND,
  emptyHeatExamDraft,
  type HeatExamDraft,
} from "@/lib/learning/heat-exam";
import {
  HEAT_MODEL_DRAFT_KIND,
  emptyHeatModelDraft,
  type HeatModelDraft,
} from "@/lib/learning/heat-model";
import {
  HEAT_TRANSFER_DRAFT_KIND,
  emptyHeatTransferDraft,
  type HeatTransferDraft,
} from "@/lib/learning/heat-transfer";
import { emptyHeatExplainInput, type HeatExplainInput } from "@/lib/learning/heat-explain";
import type { LearningSession } from "@/types/learning";

export const HEAT_WATCHED_DEMO_KEY = "watchedObserveDemo";
export const HEAT_DESCRIBE_DRAFT_KEY = "describeDraft";
export const HEAT_EXPLAIN_DRAFT_KEY = "explainDraft";
export const HEAT_MODEL_DRAFT_KEY = "modelDraft";
export const HEAT_TRANSFER_DRAFT_KEY = "transferDraft";
export const HEAT_EXAM_DRAFT_KEY = "examDraft";
export const HEAT_AI_OFF_DRAFT_KEY = "aiOffDraft";

export function emptyHeatSceneData(): Record<string, unknown> {
  return {
    [HEAT_WATCHED_DEMO_KEY]: false,
  };
}

export function heatWatchedObserveDemo(session: LearningSession): boolean {
  return session.sceneData[HEAT_WATCHED_DEMO_KEY] === true;
}

export function withHeatWatchedDemo(
  sceneData: Record<string, unknown>,
  watched: boolean,
): Record<string, unknown> {
  return {
    ...sceneData,
    [HEAT_WATCHED_DEMO_KEY]: watched,
  };
}

export function heatDescribeDraft(session: LearningSession): HeatDescribeInput | null {
  const draft = session.sceneData[HEAT_DESCRIBE_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  return draft as HeatDescribeInput;
}

export function withHeatDescribeDraft(
  sceneData: Record<string, unknown>,
  draft: HeatDescribeInput,
): Record<string, unknown> {
  return {
    ...sceneData,
    [HEAT_DESCRIBE_DRAFT_KEY]: draft,
  };
}

export function heatExplainDraft(session: LearningSession): HeatExplainInput {
  const draft = session.sceneData[HEAT_EXPLAIN_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyHeatExplainInput();
  }
  const record = draft as Partial<HeatExplainInput>;
  return {
    ...emptyHeatExplainInput(),
    heatVsTemperature: record.heatVsTemperature ?? "",
    sameMassSameQ: record.sameMassSameQ ?? "",
    sameCSameQ: record.sameCSameQ ?? "",
    timeAndPhase: record.timeAndPhase ?? "",
    studentExplanation: record.studentExplanation ?? "",
  };
}

export function withHeatExplainDraft(
  sceneData: Record<string, unknown>,
  draft: HeatExplainInput,
): Record<string, unknown> {
  return {
    ...sceneData,
    [HEAT_EXPLAIN_DRAFT_KEY]: draft,
  };
}

export function heatModelDraft(session: LearningSession): HeatModelDraft {
  const draft = session.sceneData[HEAT_MODEL_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyHeatModelDraft();
  }
  const record = draft as Partial<HeatModelDraft>;
  return {
    kind: HEAT_MODEL_DRAFT_KIND,
    factorC: record.factorC ?? "",
    factorM: record.factorM ?? "",
    factorDeltaT: record.factorDeltaT ?? "",
    productQ: record.productQ ?? "",
    sameMassSameDeltaT: record.sameMassSameDeltaT ?? "",
    sameMassSameQ: record.sameMassSameQ ?? "",
    sameCSameQ: record.sameCSameQ ?? "",
    sufficiency: record.sufficiency ?? "",
    conditions: Array.isArray(record.conditions) ? record.conditions : [],
  };
}

export function withHeatModelDraft(
  sceneData: Record<string, unknown>,
  draft: HeatModelDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [HEAT_MODEL_DRAFT_KEY]: draft,
  };
}

export function heatTransferDraft(session: LearningSession): HeatTransferDraft {
  const draft = session.sceneData[HEAT_TRANSFER_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyHeatTransferDraft();
  }
  const record = draft as Partial<HeatTransferDraft>;
  const empty = emptyHeatTransferDraft(record.targetId);
  return {
    kind: HEAT_TRANSFER_DRAFT_KIND,
    targetId: record.targetId ?? empty.targetId,
    judgments: {
      ...empty.judgments,
      ...(record.judgments ?? {}),
    },
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

export function withHeatTransferDraft(
  sceneData: Record<string, unknown>,
  draft: HeatTransferDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [HEAT_TRANSFER_DRAFT_KEY]: draft,
  };
}

export function heatExamDraft(session: LearningSession): HeatExamDraft {
  const draft = session.sceneData[HEAT_EXAM_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyHeatExamDraft();
  }
  const record = draft as Partial<HeatExamDraft>;
  const empty = emptyHeatExamDraft(
    Array.isArray(record.patternIds) ? record.patternIds : undefined,
  );
  return {
    kind: HEAT_EXAM_DRAFT_KIND,
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

export function withHeatExamDraft(
  sceneData: Record<string, unknown>,
  draft: HeatExamDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [HEAT_EXAM_DRAFT_KEY]: draft,
  };
}

export function heatAiOffDraft(session: LearningSession): HeatAiOffDraft {
  const draft = session.sceneData[HEAT_AI_OFF_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptyHeatAiOffDraft();
  }
  const record = draft as Partial<HeatAiOffDraft>;
  const empty = emptyHeatAiOffDraft(
    Array.isArray(record.challengeIds) ? record.challengeIds : undefined,
  );
  return {
    kind: HEAT_AI_OFF_DRAFT_KIND,
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

export function withHeatAiOffDraft(
  sceneData: Record<string, unknown>,
  draft: HeatAiOffDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [HEAT_AI_OFF_DRAFT_KEY]: draft,
  };
}
