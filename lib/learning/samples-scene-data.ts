import type { SamplesDescribeInput } from "@/lib/learning/samples-describe";
import type { SamplesExplainInput } from "@/lib/learning/samples-explain";
import {
  SAMPLES_AI_OFF_DRAFT_KIND,
  emptySamplesAiOffDraft,
  type SamplesAiOffDraft,
} from "@/lib/learning/samples-ai-off";
import {
  SAMPLES_EXAM_DRAFT_KIND,
  emptySamplesExamDraft,
  type SamplesExamDraft,
} from "@/lib/learning/samples-exam";
import {
  SAMPLES_MODEL_DRAFT_KIND,
  emptySamplesModelDraft,
  type SamplesModelDraft,
} from "@/lib/learning/samples-model";
import {
  SAMPLES_TRANSFER_DRAFT_KIND,
  emptySamplesTransferDraft,
  type SamplesTransferDraft,
} from "@/lib/learning/samples-transfer";
import { emptySamplesExplainInput } from "@/lib/learning/samples-explain";
import type { LearningSession } from "@/types/learning";

export const SAMPLES_WATCHED_DEMO_KEY = "watchedObserveDemo";
export const SAMPLES_DESCRIBE_DRAFT_KEY = "describeDraft";
export const SAMPLES_EXPLAIN_DRAFT_KEY = "explainDraft";
export const SAMPLES_MODEL_DRAFT_KEY = "modelDraft";
export const SAMPLES_TRANSFER_DRAFT_KEY = "transferDraft";
export const SAMPLES_EXAM_DRAFT_KEY = "examDraft";
export const SAMPLES_AI_OFF_DRAFT_KEY = "aiOffDraft";

export function emptySamplesSceneData(): Record<string, unknown> {
  return {
    [SAMPLES_WATCHED_DEMO_KEY]: false,
  };
}

export function samplesWatchedObserveDemo(session: LearningSession): boolean {
  return session.sceneData[SAMPLES_WATCHED_DEMO_KEY] === true;
}

export function withSamplesWatchedDemo(
  sceneData: Record<string, unknown>,
  watched: boolean,
): Record<string, unknown> {
  return {
    ...sceneData,
    [SAMPLES_WATCHED_DEMO_KEY]: watched,
  };
}

export function samplesDescribeDraft(
  session: LearningSession,
): SamplesDescribeInput | null {
  const draft = session.sceneData[SAMPLES_DESCRIBE_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return null;
  }
  return draft as SamplesDescribeInput;
}

export function withSamplesDescribeDraft(
  sceneData: Record<string, unknown>,
  draft: SamplesDescribeInput,
): Record<string, unknown> {
  return {
    ...sceneData,
    [SAMPLES_DESCRIBE_DRAFT_KEY]: draft,
  };
}

export function samplesExplainDraft(session: LearningSession): SamplesExplainInput {
  const draft = session.sceneData[SAMPLES_EXPLAIN_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptySamplesExplainInput();
  }
  const record = draft as Partial<SamplesExplainInput>;
  return {
    ...emptySamplesExplainInput(),
    densityVsMass: record.densityVsMass ?? "",
    sameVolume: record.sameVolume ?? "",
    sameMass: record.sameMass ?? "",
    uniformCut: record.uniformCut ?? "",
    studentExplanation: record.studentExplanation ?? "",
  };
}

export function withSamplesExplainDraft(
  sceneData: Record<string, unknown>,
  draft: SamplesExplainInput,
): Record<string, unknown> {
  return {
    ...sceneData,
    [SAMPLES_EXPLAIN_DRAFT_KEY]: draft,
  };
}

export function samplesModelDraft(session: LearningSession): SamplesModelDraft {
  const draft = session.sceneData[SAMPLES_MODEL_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptySamplesModelDraft();
  }
  const record = draft as Partial<SamplesModelDraft>;
  return {
    kind: SAMPLES_MODEL_DRAFT_KIND,
    numerator: record.numerator ?? "",
    denominator: record.denominator ?? "",
    result: record.result ?? "",
    sameVolumeConclusion: record.sameVolumeConclusion ?? "",
    sameMassConclusion: record.sameMassConclusion ?? "",
    cutConclusion: record.cutConclusion ?? "",
    cutMassChange: record.cutMassChange ?? "",
    cutVolumeChange: record.cutVolumeChange ?? "",
    cutRatioChange: record.cutRatioChange ?? "",
    cutWhy: record.cutWhy ?? "",
    sufficiency: record.sufficiency ?? "",
    conditions: Array.isArray(record.conditions) ? record.conditions : [],
  };
}

export function withSamplesModelDraft(
  sceneData: Record<string, unknown>,
  draft: SamplesModelDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [SAMPLES_MODEL_DRAFT_KEY]: draft,
  };
}

export function samplesTransferDraft(
  session: LearningSession,
): SamplesTransferDraft {
  const draft = session.sceneData[SAMPLES_TRANSFER_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptySamplesTransferDraft();
  }
  const record = draft as Partial<SamplesTransferDraft>;
  const empty = emptySamplesTransferDraft(record.targetId);
  return {
    kind: SAMPLES_TRANSFER_DRAFT_KIND,
    targetId: record.targetId ?? empty.targetId,
    judgments: {
      ...empty.judgments,
      ...(record.judgments ?? {}),
    },
    surfaceCueSelected: record.surfaceCueSelected === true,
    studentExplanation: record.studentExplanation ?? "",
  };
}

export function withSamplesTransferDraft(
  sceneData: Record<string, unknown>,
  draft: SamplesTransferDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [SAMPLES_TRANSFER_DRAFT_KEY]: draft,
  };
}

export function samplesExamDraft(session: LearningSession): SamplesExamDraft {
  const draft = session.sceneData[SAMPLES_EXAM_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptySamplesExamDraft();
  }
  const record = draft as Partial<SamplesExamDraft>;
  const empty = emptySamplesExamDraft(
    Array.isArray(record.patternIds) ? record.patternIds : undefined,
  );
  return {
    kind: SAMPLES_EXAM_DRAFT_KIND,
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

export function withSamplesExamDraft(
  sceneData: Record<string, unknown>,
  draft: SamplesExamDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [SAMPLES_EXAM_DRAFT_KEY]: draft,
  };
}

export function samplesAiOffDraft(session: LearningSession): SamplesAiOffDraft {
  const draft = session.sceneData[SAMPLES_AI_OFF_DRAFT_KEY];
  if (!draft || typeof draft !== "object") {
    return emptySamplesAiOffDraft();
  }
  const record = draft as Partial<SamplesAiOffDraft>;
  const empty = emptySamplesAiOffDraft(
    Array.isArray(record.challengeIds) ? record.challengeIds : undefined,
  );
  return {
    kind: SAMPLES_AI_OFF_DRAFT_KIND,
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

export function withSamplesAiOffDraft(
  sceneData: Record<string, unknown>,
  draft: SamplesAiOffDraft,
): Record<string, unknown> {
  return {
    ...sceneData,
    [SAMPLES_AI_OFF_DRAFT_KEY]: draft,
  };
}
