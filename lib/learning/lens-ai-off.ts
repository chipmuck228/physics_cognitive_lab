import { independentChallenges } from "@/content/physics-models/convex-lens-imaging/independent-challenges";
import { convexLensImagingAssessmentOverlay } from "@/content/physics-models/convex-lens-imaging/assessment-overlay";
import { PRODUCTION_AI_OFF_IDS } from "@/content/physics-models/convex-lens-imaging/implementation-contract";
import {
  evaluateConvexLensAiOff,
  evaluateRequiredAiOffPair,
  officialImageConsequence,
  type AiOffChallengeId,
  type ConvexLensAiOffAttempt,
  type ImageConsequence,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import type {
  IndependentJudgmentOption,
  IndependentPostCheckOption,
} from "@/lib/runtime/types";
import { LearningStage } from "@/types/learning";
import type {
  IndependentAssessment,
  IndependentChallengeAttempt,
  IndependentReasoningSignals,
  LearningSession,
} from "@/types/learning";
import type { IndependentChallenge } from "@/types/physics-model";

export const LENS_AI_OFF_CHALLENGE_IDS = [...PRODUCTION_AI_OFF_IDS] as const;
export const LENS_AI_OFF_A = "ai-off-unfamiliar-window-card-projection" as const;
export const LENS_AI_OFF_B = "ai-off-boundary-magnifier-cannot-catch-virtual" as const;
export const LENS_AI_OFF_DRAFT_KIND = "lens-ai-off-draft";

export type LensAiOffStep = "response" | "post-check";

export interface LensAiOffDraft {
  kind: typeof LENS_AI_OFF_DRAFT_KIND;
  challengeIds: string[];
  currentChallengeId: string;
  step: LensAiOffStep;
  objectStation: string;
  meetingMode: string;
  side: string;
  nature: string;
  orientation: string;
  size: string;
  screenReceivable: string;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  retiredChallengeIds: string[];
}

export function lensAiOffChallenges(): IndependentChallenge[] {
  return LENS_AI_OFF_CHALLENGE_IDS.map((id) => {
    const challenge = independentChallenges.find((item) => item.id === id);
    if (!challenge) {
      throw new Error(`Missing canonical independent challenge: ${id}`);
    }
    return challenge;
  });
}

export function lensAiOffChallenge(challengeId: string): IndependentChallenge {
  const challenge = independentChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error(`Missing canonical independent challenge: ${challengeId}`);
  }
  return challenge;
}

export function lensAiOffJudgments(challengeId: string): IndependentJudgmentOption[] {
  return convexLensImagingAssessmentOverlay.independent?.[challengeId]?.judgments ?? [];
}

export function lensAiOffPostCheckOptions(
  challengeId: string,
): IndependentPostCheckOption[] {
  return convexLensImagingAssessmentOverlay.independent?.[challengeId]?.postCheck ?? [];
}

export function intendedLensAiOffAnswerId(challengeId: string): string {
  const intended = lensAiOffJudgments(challengeId).find((option) => option.correct);
  if (!intended) {
    throw new Error(`Missing intended AI_OFF judgment: ${challengeId}`);
  }
  return intended.id;
}

export function intendedLensAiOffPostCheckIds(challengeId: string): string[] {
  return lensAiOffPostCheckOptions(challengeId)
    .filter((option) => option.required && !option.distractor)
    .map((option) => option.id);
}

export function lensJudgmentLabelFor(challengeId: string, answerId: string): string {
  return (
    lensAiOffJudgments(challengeId).find((option) => option.id === answerId)?.label ??
    answerId
  );
}

export function emptyLensAiOffDraft(
  challengeIds: readonly string[] = LENS_AI_OFF_CHALLENGE_IDS,
): LensAiOffDraft {
  const ids = [...challengeIds];
  return {
    kind: LENS_AI_OFF_DRAFT_KIND,
    challengeIds: ids,
    currentChallengeId: ids[0] ?? LENS_AI_OFF_A,
    step: "response",
    objectStation: "",
    meetingMode: "",
    side: "",
    nature: "",
    orientation: "",
    size: "",
    screenReceivable: "",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    retiredChallengeIds: [],
  };
}

export function draftToLensAiOffAttempt(
  draft: LensAiOffDraft,
  llmUsed: boolean,
): ConvexLensAiOffAttempt | null {
  if (
    !isLensAiOffId(draft.currentChallengeId) ||
    !draft.objectStation ||
    !draft.meetingMode ||
    !draft.side ||
    !draft.nature ||
    !draft.orientation ||
    !draft.size ||
    (draft.screenReceivable !== "true" && draft.screenReceivable !== "false")
  ) {
    return null;
  }
  return {
    challengeId: draft.currentChallengeId,
    objectStation: draft.objectStation as ObjectStation,
    meetingMode: draft.meetingMode as MeetingMode,
    image: {
      side: draft.side as ImageConsequence["side"],
      nature: draft.nature as ImageConsequence["nature"],
      orientation: draft.orientation as ImageConsequence["orientation"],
      size: draft.size as ImageConsequence["size"],
      screenReceivable: draft.screenReceivable === "true",
    },
    preCommitReasoning: draft.reasoning,
    judgmentId: draft.selectedAnswer,
    postCheckIds: draft.postCheckSelections,
    llmUsed,
  };
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
): boolean {
  const options = lensAiOffPostCheckOptions(challengeId);
  const selected = new Set(postCheckIds);
  const required = options.filter((option) => option.required && !option.distractor);
  const distractors = options.filter((option) => option.distractor);
  return (
    required.length > 0 &&
    required.every((option) => selected.has(option.id)) &&
    distractors.every((option) => !selected.has(option.id))
  );
}

export function canCommitLensAiOffResponse(draft: LensAiOffDraft): boolean {
  return (
    Boolean(draft.objectStation) &&
    Boolean(draft.meetingMode) &&
    Boolean(draft.side) &&
    Boolean(draft.nature) &&
    Boolean(draft.orientation) &&
    Boolean(draft.size) &&
    (draft.screenReceivable === "true" || draft.screenReceivable === "false") &&
    draft.selectedAnswer.trim().length > 0 &&
    draft.reasoning.trim().length >= 12
  );
}

export function evaluateLensAiOffAttempt(input: {
  draft: LensAiOffDraft;
  postCheckIds: readonly string[];
  llmUsed: boolean;
}): {
  answerCorrect: boolean;
  accepted: boolean;
  official: ReturnType<typeof evaluateConvexLensAiOff>;
  reasoningSignals: IndependentReasoningSignals;
} {
  const structured = draftToLensAiOffAttempt(
    { ...input.draft, postCheckSelections: [...input.postCheckIds] },
    input.llmUsed,
  );
  const official = structured
    ? evaluateConvexLensAiOff(structured)
    : { ok: false, failureKind: "wrong-precommit-structure" as const };
  const answerCorrect =
    input.draft.selectedAnswer === intendedLensAiOffAnswerId(input.draft.currentChallengeId);
  const matchesPostCheck = postCheckMatchesRequired(
    input.draft.currentChallengeId,
    input.postCheckIds,
  );
  const accepted = official.ok && matchesPostCheck && input.llmUsed === false;
  return {
    answerCorrect,
    accepted,
    official,
    reasoningSignals: {
      preCommitRelation: official.ok,
      identifiesConditionOrBoundary: official.ok,
      conclusionOnlyReasoning: official.failureKind === "answer-only",
      hasOwnWords: input.draft.reasoning.trim().length >= 12,
      postCheckMatchesRequired: matchesPostCheck,
    },
  };
}

export function buildLensAiOffAttempt(
  draft: LensAiOffDraft,
  timestamp: string,
  postCheckIds: readonly string[] = [],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateLensAiOffAttempt({ draft, postCheckIds, llmUsed });
  const structured = draftToLensAiOffAttempt(draft, llmUsed);
  return {
    challengeId: draft.currentChallengeId,
    selectedAnswer: draft.selectedAnswer,
    studentReasoning: draft.reasoning,
    answerCorrect: evaluation.answerCorrect,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    preCommitEvidenceIds: structured
      ? [
          structured.objectStation,
          structured.meetingMode,
          structured.image.nature,
          structured.image.side,
          structured.image.orientation,
          structured.image.size,
          String(structured.image.screenReceivable),
        ]
      : [],
    timestamp,
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function applyLensAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  draft: LensAiOffDraft,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateLensAiOffAttempt({
    draft: { ...draft, selectedAnswer: attempt.selectedAnswer, reasoning: attempt.studentReasoning },
    postCheckIds,
    llmUsed,
  });
  return {
    ...attempt,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function reconstructLensAiOffAttempts(
  assessment: IndependentAssessment | undefined,
): ConvexLensAiOffAttempt[] {
  return (assessment?.challengeAttempts ?? []).flatMap((attempt) => {
    if (!isLensAiOffId(attempt.challengeId)) {
      return [];
    }
    const parts = attempt.preCommitEvidenceIds ?? [];
    if (parts.length < 7) {
      return [];
    }
    const station = parts[0] as ObjectStation;
    return [
      {
        challengeId: attempt.challengeId,
        objectStation: station,
        meetingMode: parts[1] as MeetingMode,
        image: {
          nature: parts[2] as ImageConsequence["nature"],
          side: parts[3] as ImageConsequence["side"],
          orientation: parts[4] as ImageConsequence["orientation"],
          size: parts[5] as ImageConsequence["size"],
          screenReceivable: parts[6] === "true",
        },
        preCommitReasoning: attempt.studentReasoning,
        judgmentId: attempt.selectedAnswer,
        postCheckIds: attempt.postCheckIds,
        llmUsed: assessment?.llmUsed === true,
      },
    ];
  });
}

export function hasAcceptedLensAiOffChallenge(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): boolean {
  return (assessment?.challengeAttempts ?? []).some(
    (attempt) =>
      attempt.challengeId === challengeId &&
      attempt.accepted &&
      attempt.llmUsed === false,
  );
}

export function hasAcceptedLensAiOffChallenges(
  assessment: IndependentAssessment | undefined,
): boolean {
  return (
    evaluateRequiredAiOffPair(reconstructLensAiOffAttempts(assessment)).ok &&
    LENS_AI_OFF_CHALLENGE_IDS.every((id) => hasAcceptedLensAiOffChallenge(assessment, id))
  );
}

export function lensTutorUsedDuringIndependent(session: LearningSession): boolean {
  if (session.independentAssessment?.llmUsed === true) {
    return true;
  }
  const blocked = new Set<string>([LearningStage.AI_OFF, LearningStage.COMPLETE]);
  if (session.aiInteractions.some((item) => blocked.has(item.stage))) {
    return true;
  }
  return session.events.some(
    (event) => event.type === "ai_interaction" && blocked.has(event.stage),
  );
}

export function hasCompletedLensAiOff(session: LearningSession): boolean {
  return (
    hasAcceptedLensAiOffChallenges(session.independentAssessment) &&
    session.independentAssessment?.llmUsed === false &&
    session.independentAssessment.completedWithoutAI === true &&
    !lensTutorUsedDuringIndependent(session)
  );
}

export function currentLensAiOffChallengeId(
  assessment: IndependentAssessment | undefined,
  draft: Pick<LensAiOffDraft, "challengeIds" | "currentChallengeId" | "retiredChallengeIds">,
): string | null {
  const retired = new Set(draft.retiredChallengeIds);
  if (
    draft.currentChallengeId &&
    !retired.has(draft.currentChallengeId) &&
    !hasAcceptedLensAiOffChallenge(assessment, draft.currentChallengeId)
  ) {
    return draft.currentChallengeId;
  }
  return (
    draft.challengeIds.find(
      (id) => !retired.has(id) && !hasAcceptedLensAiOffChallenge(assessment, id),
    ) ?? null
  );
}

export function isLensAiOffSessionOpen(
  assessment: IndependentAssessment | undefined,
  draft: Pick<LensAiOffDraft, "challengeIds" | "currentChallengeId" | "retiredChallengeIds">,
): boolean {
  return currentLensAiOffChallengeId(assessment, draft) !== null;
}

export function nextLensAiOffDraft(
  assessment: IndependentAssessment | undefined,
  previous: LensAiOffDraft,
  justChallengeId: string,
): LensAiOffDraft {
  const retired = new Set(previous.retiredChallengeIds);
  if (hasAcceptedLensAiOffChallenge(assessment, justChallengeId)) {
    retired.add(justChallengeId);
  }
  const nextId = currentLensAiOffChallengeId(assessment, {
    challengeIds: previous.challengeIds,
    currentChallengeId: "",
    retiredChallengeIds: [...retired],
  });
  if (!nextId || nextId !== justChallengeId) {
    return {
      ...emptyLensAiOffDraft(previous.challengeIds),
      currentChallengeId: nextId ?? justChallengeId,
      retiredChallengeIds: [...retired],
    };
  }
  return {
    ...previous,
    step: "post-check",
    retiredChallengeIds: [...retired],
  };
}

export function retryLensAiOffDraft(
  previous: LensAiOffDraft,
  challengeId: string,
): LensAiOffDraft {
  return {
    ...previous,
    currentChallengeId: challengeId,
    step: "response",
    objectStation: "",
    meetingMode: "",
    side: "",
    nature: "",
    orientation: "",
    size: "",
    screenReceivable: "",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
  };
}

export function buildLensAiOffAssessment(
  attempts: IndependentChallengeAttempt[],
  llmUsed: boolean,
): IndependentAssessment {
  const accepted = hasAcceptedLensAiOffChallenges({
    explanation: "",
    examResponses: {},
    completedWithoutAI: false,
    challengeAttempts: attempts,
  });
  const examResponses: Record<string, string> = {};
  for (const attempt of attempts) {
    examResponses[attempt.challengeId] = attempt.selectedAnswer;
  }
  return {
    explanation: attempts.map((attempt) => attempt.studentReasoning).join("\n"),
    examResponses,
    completedWithoutAI: accepted && !llmUsed,
    llmUsed,
    challengeAttempts: attempts,
  };
}

export function completeLensAiOffDraft(challengeId: string): LensAiOffDraft {
  const station = challengeId === LENS_AI_OFF_A ? "beyond-2f" : "inside-f";
  const image = officialImageConsequence(station);
  return {
    ...emptyLensAiOffDraft(),
    currentChallengeId: challengeId,
    objectStation: station,
    meetingMode: station === "beyond-2f" ? "actual-convergence" : "backward-extension",
    side: image.side,
    nature: image.nature,
    orientation: image.orientation,
    size: image.size,
    screenReceivable: image.screenReceivable ? "true" : "false",
    selectedAnswer: intendedLensAiOffAnswerId(challengeId),
    reasoning:
      challengeId === LENS_AI_OFF_A
        ? "窗外景物在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小实像，白卡片是接收器，要放到像的位置才能接到。"
        : "邮票在焦点以内，光线散开，只有反向延长线相交，所以是虚像，白纸接不到。物体正好在焦点上时，出射光线平行，有限远处不成完整的像。",
    postCheckSelections: intendedLensAiOffPostCheckIds(challengeId),
  };
}

function isLensAiOffId(value: string): value is AiOffChallengeId {
  return (LENS_AI_OFF_CHALLENGE_IDS as readonly string[]).includes(value);
}
