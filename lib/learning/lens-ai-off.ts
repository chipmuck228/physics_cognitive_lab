import { LENS_AI_OFF_COPY } from "@/lib/content/convex-lens-optical-bench";
import { independentChallenges } from "@/content/physics-models/convex-lens-imaging/independent-challenges";
import { convexLensImagingAssessmentOverlay } from "@/content/physics-models/convex-lens-imaging/assessment-overlay";
import { PRODUCTION_AI_OFF_IDS } from "@/content/physics-models/convex-lens-imaging/implementation-contract";
import {
  classifyLensStep6FastPath,
  evaluateConvexLensAiOff,
  evaluateRequiredAiOffPair,
  meetingModeFromClaim,
  officialImageConsequence,
  officialMeetingMode,
  type AiOffChallengeId,
  type ConvexLensAiOffAttempt,
  type ImageConsequence,
  type LensReasoningSemanticParse,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { normalizeLensStep6Text } from "@/content/physics-models/convex-lens-imaging/construction";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import { inferLensAiOffLocalTask } from "@/lib/learning/lens-local-reasoning";
import { parseLensReasoningSemantic } from "@/lib/learning/lens-step6-semantic";
import type { LensStep6Interpretation } from "@/lib/learning/lens-model";
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

/**
 * Pilot metric: committed learner-facing units per AI_OFF challenge.
 * BEFORE: 7 imaging radios + judgment + authored + post-check facts.
 * AFTER: 1 station + 1 integrated judgment + 1 authored causal bind + simplified post-check.
 */
export const LENS_AI_OFF_UNITS_BEFORE_PER_CHALLENGE = 10;
export const LENS_AI_OFF_LEARNER_OWNED_FIELDS = [
  "objectStation",
  "selectedAnswer",
  "reasoning",
] as const;
export const LENS_AI_OFF_SYSTEM_DERIVED_FIELDS = [
  "meetingMode",
  "side",
  "nature",
  "orientation",
  "size",
  "screenReceivable",
] as const;

export type LensAiOffFieldProvenance = {
  objectStation: "pre-commit-structured";
  selectedAnswer: "pre-commit-structured";
  reasoning: "pre-commit-authored";
  authoredInterpretation: "system-derived";
  meetingMode: "system-derived";
  image: "system-derived";
  postCheck: "post-commit-confirmation";
};

export const LENS_AI_OFF_FIELD_PROVENANCE: LensAiOffFieldProvenance = {
  objectStation: "pre-commit-structured",
  selectedAnswer: "pre-commit-structured",
  reasoning: "pre-commit-authored",
  authoredInterpretation: "system-derived",
  meetingMode: "system-derived",
  image: "system-derived",
  postCheck: "post-commit-confirmation",
};

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
  authoredInterpretation?: LensStep6Interpretation | null;
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

export function localRequiredLensAiOffPostCheckIds(
  challengeId: string,
  localTask: "window-real" | "u-equals-f" | "u-less-than-f" | "compound" = "compound",
): string[] {
  const options = lensAiOffPostCheckOptions(challengeId);
  return options
    .filter((option) => option.required && !option.distractor)
    .filter((option) => {
      if (!option.localScope || option.localScope === "always" || localTask === "compound" || localTask === "window-real") {
        return true;
      }
      return option.localScope === localTask;
    })
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
    authoredInterpretation: null,
    postCheckSelections: [],
    retiredChallengeIds: [],
  };
}

export function withLensAiOffStation(
  draft: LensAiOffDraft,
  objectStation: string,
): LensAiOffDraft {
  if (objectStation === draft.objectStation) {
    return draft;
  }
  return {
    ...draft,
    objectStation,
    meetingMode: "",
    side: "",
    nature: "",
    orientation: "",
    size: "",
    screenReceivable: "",
  };
}

export function withLensAiOffReasoning(
  draft: LensAiOffDraft,
  reasoning: string,
): LensAiOffDraft {
  if (reasoning === draft.reasoning) {
    return draft;
  }
  return {
    ...draft,
    reasoning,
    authoredInterpretation: null,
    meetingMode: "",
    side: "",
    nature: "",
    orientation: "",
    size: "",
    screenReceivable: "",
  };
}

function isObjectStationValue(value: string): value is ObjectStation {
  return (
    value === "beyond-2f" ||
    value === "at-2f" ||
    value === "between-f-and-2f" ||
    value === "at-f" ||
    value === "inside-f"
  );
}

export function deriveLensAiOffInternalFields(
  objectStation: ObjectStation,
  parse: LensReasoningSemanticParse,
): { meetingMode: MeetingMode; image: ImageConsequence } | null {
  const official = officialImageConsequence(objectStation);
  const officialMeeting = officialMeetingMode(objectStation);
  let meetingMode = meetingModeFromClaim(parse.meetingClaim);
  if (!meetingMode) {
    const natureOk =
      parse.imageNatureClaim === "unclear" || parse.imageNatureClaim === official.nature;
    const screenOk =
      parse.screenClaim === "unclear" ||
      (parse.screenClaim === "receivable") === official.screenReceivable;
    if (
      natureOk &&
      screenOk &&
      (parse.hasMeetingClaim || parse.hasConsequenceClaim)
    ) {
      meetingMode = officialMeeting;
    } else {
      return null;
    }
  }
  const claimedNature =
    parse.imageNatureClaim === "real" ||
    parse.imageNatureClaim === "virtual" ||
    parse.imageNatureClaim === "none"
      ? parse.imageNatureClaim
      : meetingMode === "actual-convergence"
        ? "real"
        : meetingMode === "backward-extension"
          ? "virtual"
          : "none";
  const claimedScreen =
    parse.screenClaim === "receivable"
      ? true
      : parse.screenClaim === "not-receivable"
        ? false
        : claimedNature === "real";
  if (
    meetingMode === officialMeeting &&
    claimedNature === official.nature &&
    claimedScreen === official.screenReceivable
  ) {
    return { meetingMode, image: official };
  }
  return {
    meetingMode,
    image: imageFamilyFromClaim(claimedNature, claimedScreen, official.size),
  };
}

function imageFamilyFromClaim(
  nature: ImageConsequence["nature"],
  screenReceivable: boolean,
  size: ImageConsequence["size"],
): ImageConsequence {
  if (nature === "real") {
    return {
      side: "other-side",
      nature: "real",
      orientation: "inverted",
      size: size === "none" ? "enlarged" : size,
      screenReceivable,
    };
  }
  if (nature === "virtual") {
    return {
      side: "same-side",
      nature: "virtual",
      orientation: "upright",
      size: size === "none" ? "enlarged" : size,
      screenReceivable,
    };
  }
  return {
    side: "none",
    nature: "none",
    orientation: "none",
    size: "none",
    screenReceivable: false,
  };
}

export function applyDerivedAiOffFields(
  draft: LensAiOffDraft,
  parse: LensReasoningSemanticParse,
  source: LensStep6Interpretation["source"],
): LensAiOffDraft {
  const interpretation: LensStep6Interpretation = {
    provenance: "system-derived",
    source,
    textNormalized: normalizeLensStep6Text(draft.reasoning),
    parse,
  };
  if (!isObjectStationValue(draft.objectStation)) {
    return { ...draft, authoredInterpretation: interpretation };
  }
  const derived = deriveLensAiOffInternalFields(draft.objectStation, parse);
  return {
    ...draft,
    meetingMode: derived?.meetingMode ?? "",
    side: derived?.image.side ?? "",
    nature: derived?.image.nature ?? "",
    orientation: derived?.image.orientation ?? "",
    size: derived?.image.size ?? "",
    screenReceivable:
      derived == null ? "" : derived.image.screenReceivable ? "true" : "false",
    authoredInterpretation: interpretation,
  };
}

export function aiOffParseFromDraft(
  draft: LensAiOffDraft,
): LensReasoningSemanticParse | null {
  const stored = draft.authoredInterpretation;
  if (
    stored &&
    stored.provenance === "system-derived" &&
    stored.textNormalized === normalizeLensStep6Text(draft.reasoning)
  ) {
    return stored.parse;
  }
  const fast = classifyLensStep6FastPath(draft.reasoning);
  return fast.kind === "sufficient" ? fast.parse : null;
}

export function hasLensAiOffDerivedStructure(draft: LensAiOffDraft): boolean {
  return (
    Boolean(draft.meetingMode) &&
    Boolean(draft.side) &&
    Boolean(draft.nature) &&
    Boolean(draft.orientation) &&
    Boolean(draft.size) &&
    (draft.screenReceivable === "true" || draft.screenReceivable === "false")
  );
}

export function isLensAiOffLearnerReady(draft: LensAiOffDraft): boolean {
  return (
    Boolean(draft.objectStation) &&
    draft.selectedAnswer.trim().length > 0 &&
    draft.reasoning.trim().length > 0
  );
}

export function lensAiOffJudgmentImplication(judgmentId: string): {
  meetingMode?: MeetingMode;
  nature?: ImageConsequence["nature"];
  screenReceivable?: boolean;
} | null {
  return lensAiOffJudgmentImplications(judgmentId)[0] ?? null;
}

export function lensAiOffJudgmentImplications(judgmentId: string): Array<{
  meetingMode?: MeetingMode;
  nature?: ImageConsequence["nature"];
  screenReceivable?: boolean;
}> {
  if (judgmentId === "distant-object-real-reduced") {
    return [{ meetingMode: "actual-convergence", nature: "real", screenReceivable: true }];
  }
  if (judgmentId === "also-convex-lens") {
    return [{ meetingMode: "backward-extension", nature: "virtual", screenReceivable: false }];
  }
  if (judgmentId === "virtual-not-on-screen-and-f-is-limit") {
    return [
      { meetingMode: "backward-extension", nature: "virtual", screenReceivable: false },
      { meetingMode: "no-finite-meeting", nature: "none", screenReceivable: false },
    ];
  }
  if (judgmentId === "image-on-card-is-the-image-itself") {
    return [{ meetingMode: "no-finite-meeting", nature: "none", screenReceivable: false }];
  }
  if (judgmentId === "catch-virtual-on-paper") {
    return [{ screenReceivable: true }];
  }
  if (judgmentId === "at-f-ordinary-row") {
    return [{ meetingMode: "actual-convergence", nature: "real" }];
  }
  return [];
}

function encodeAiOffParse(parse: LensReasoningSemanticParse | null | undefined): string[] {
  return parse ? [JSON.stringify(parse)] : [];
}

function decodeAiOffParse(parts: readonly string[]): LensReasoningSemanticParse | null {
  if (parts.length < 8 || !parts[7]) {
    return null;
  }
  try {
    return parseLensReasoningSemantic(JSON.parse(parts[7]));
  } catch {
    return null;
  }
}

export function draftToLensAiOffAttempt(
  draft: LensAiOffDraft,
  llmUsed: boolean,
): ConvexLensAiOffAttempt | null {
  if (!isLensAiOffId(draft.currentChallengeId) || !isObjectStationValue(draft.objectStation)) {
    return null;
  }
  const parse = aiOffParseFromDraft(draft);
  const derived = parse ? deriveLensAiOffInternalFields(draft.objectStation, parse) : null;
  if (derived) {
    return {
      challengeId: draft.currentChallengeId,
      objectStation: draft.objectStation,
      meetingMode: derived.meetingMode,
      image: derived.image,
      preCommitReasoning: draft.reasoning,
      authoredInterpretation: parse,
      judgmentId: draft.selectedAnswer,
      postCheckIds: draft.postCheckSelections,
      llmUsed,
    };
  }
  if (!hasLensAiOffDerivedStructure(draft)) {
    return null;
  }
  return {
    challengeId: draft.currentChallengeId,
    objectStation: draft.objectStation,
    meetingMode: draft.meetingMode as MeetingMode,
    image: {
      side: draft.side as ImageConsequence["side"],
      nature: draft.nature as ImageConsequence["nature"],
      orientation: draft.orientation as ImageConsequence["orientation"],
      size: draft.size as ImageConsequence["size"],
      screenReceivable: draft.screenReceivable === "true",
    },
    preCommitReasoning: draft.reasoning,
    authoredInterpretation: parse,
    judgmentId: draft.selectedAnswer,
    postCheckIds: draft.postCheckSelections,
    llmUsed,
  };
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
  localTask: "window-real" | "u-equals-f" | "u-less-than-f" | "compound" = "compound",
): boolean {
  const options = lensAiOffPostCheckOptions(challengeId);
  const selected = new Set(postCheckIds);
  const required = localRequiredLensAiOffPostCheckIds(challengeId, localTask);
  const distractors = options.filter((option) => option.distractor);
  return (
    required.length > 0 &&
    required.every((id) => selected.has(id)) &&
    distractors.every((option) => !selected.has(option.id))
  );
}

export function canCommitLensAiOffResponse(draft: LensAiOffDraft): boolean {
  return isLensAiOffLearnerReady(draft);
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
  const localTask = inferLensAiOffLocalTask({
    challengeId: input.draft.currentChallengeId,
    objectStation: input.draft.objectStation,
    reasoning: input.draft.reasoning,
  });
  const matchesPostCheck = postCheckMatchesRequired(
    input.draft.currentChallengeId,
    input.postCheckIds,
    localTask,
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
          ...encodeAiOffParse(structured.authoredInterpretation),
        ]
      : [],
    timestamp,
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function lensAiOffDraftFromCommittedAttempt(
  attempt: IndependentChallengeAttempt,
  fallback: LensAiOffDraft,
): LensAiOffDraft {
  const parts = attempt.preCommitEvidenceIds ?? [];
  const parse = decodeAiOffParse(parts);
  if (parts.length < 7) {
    return {
      ...fallback,
      currentChallengeId: attempt.challengeId,
      selectedAnswer: attempt.selectedAnswer,
      reasoning: attempt.studentReasoning ?? "",
      authoredInterpretation: parse
        ? {
            provenance: "system-derived",
            source: "deterministic-fast-path",
            textNormalized: normalizeLensStep6Text(attempt.studentReasoning ?? ""),
            parse,
          }
        : fallback.authoredInterpretation ?? null,
    };
  }
  return {
    ...fallback,
    currentChallengeId: attempt.challengeId,
    objectStation: parts[0] ?? "",
    meetingMode: parts[1] ?? "",
    nature: parts[2] ?? "",
    side: parts[3] ?? "",
    orientation: parts[4] ?? "",
    size: parts[5] ?? "",
    screenReceivable: parts[6] === "true" ? "true" : "false",
    selectedAnswer: attempt.selectedAnswer,
    reasoning: attempt.studentReasoning ?? "",
    authoredInterpretation: parse
      ? {
          provenance: "system-derived",
          source: "deterministic-fast-path",
          textNormalized: normalizeLensStep6Text(attempt.studentReasoning ?? ""),
          parse,
        }
      : null,
  };
}

export function classifyLensAiOffPostCheck(input: {
  challengeId: string;
  postCheckIds: readonly string[];
  officialOk: boolean;
  localTask?: "window-real" | "u-equals-f" | "u-less-than-f" | "compound";
}): { kind: "missing" | "rejected"; message: string } | { kind: "ok" } {
  if (input.postCheckIds.length === 0) {
    return { kind: "missing", message: LENS_AI_OFF_COPY.postCheckNeedFacts };
  }
  const options = lensAiOffPostCheckOptions(input.challengeId);
  if (options.length === 0) {
    return { kind: "rejected", message: LENS_AI_OFF_COPY.postCheckSystem };
  }
  const ownIds = new Set(options.map((option) => option.id));
  if (input.postCheckIds.some((id) => !ownIds.has(id))) {
    return { kind: "rejected", message: LENS_AI_OFF_COPY.postCheckWrongChallenge };
  }
  const selected = new Set(input.postCheckIds);
  const required = localRequiredLensAiOffPostCheckIds(
    input.challengeId,
    input.localTask ?? "compound",
  );
  const distractors = options.filter((option) => option.distractor);
  if (distractors.some((option) => selected.has(option.id))) {
    return { kind: "rejected", message: LENS_AI_OFF_COPY.postCheckDistractor };
  }
  if (required.some((id) => !selected.has(id))) {
    return { kind: "rejected", message: LENS_AI_OFF_COPY.postCheckMissingRequired };
  }
  if (!input.officialOk) {
    return { kind: "rejected", message: LENS_AI_OFF_COPY.postCheckPrecommit };
  }
  return { kind: "ok" };
}

export function lensAiOffPostCheckRepair(
  challengeId: string,
  postCheckIds: readonly string[],
  accepted: boolean,
  officialOk = false,
  localTask: "window-real" | "u-equals-f" | "u-less-than-f" | "compound" = "compound",
): { kind: "missing" | "rejected"; message: string } | null {
  if (accepted) {
    return null;
  }
  const classified = classifyLensAiOffPostCheck({
    challengeId,
    postCheckIds,
    officialOk,
    localTask,
  });
  return classified.kind === "ok" ? { kind: "rejected", message: LENS_AI_OFF_COPY.postCheckSystem } : classified;
}

export function applyLensAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  draft: LensAiOffDraft,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateLensAiOffAttempt({
    draft: lensAiOffDraftFromCommittedAttempt(attempt, draft),
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
    const parse = decodeAiOffParse(parts);
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
        authoredInterpretation: parse,
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

export function lensAiOffNeedsResponseEdit(
  challengeId: string,
  postCheckIds: readonly string[],
  officialOk: boolean,
): boolean {
  const classified = classifyLensAiOffPostCheck({
    challengeId,
    postCheckIds,
    officialOk,
  });
  return classified.kind === "rejected" && classified.message === LENS_AI_OFF_COPY.postCheckPrecommit;
}

export function retryLensAiOffDraft(
  previous: LensAiOffDraft,
  attempt: IndependentChallengeAttempt,
): LensAiOffDraft {
  return {
    ...lensAiOffDraftFromCommittedAttempt(attempt, previous),
    currentChallengeId: attempt.challengeId,
    step: "response",
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
  const reasoning =
    challengeId === LENS_AI_OFF_A
      ? "窗外景物在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小实像，白卡片是接收器，要放到像的位置才能接到。"
      : "邮票在焦点以内，光线散开，只有反向延长线相交，所以是虚像，白纸接不到。物体正好在焦点上时，折射后的光线彼此平行，有限远处不相交，所以光屏怎么移动都接不到清晰像。";
  const base: LensAiOffDraft = {
    ...emptyLensAiOffDraft(),
    currentChallengeId: challengeId,
    objectStation: station,
    selectedAnswer: intendedLensAiOffAnswerId(challengeId),
    reasoning,
    postCheckSelections: intendedLensAiOffPostCheckIds(challengeId),
  };
  const withOfficial: LensAiOffDraft = {
    ...base,
    meetingMode: station === "beyond-2f" ? "actual-convergence" : "backward-extension",
    side: image.side,
    nature: image.nature,
    orientation: image.orientation,
    size: image.size,
    screenReceivable: image.screenReceivable ? "true" : "false",
  };
  const parse = aiOffParseFromDraft(withOfficial);
  if (parse && deriveLensAiOffInternalFields(station, parse)) {
    return applyDerivedAiOffFields(withOfficial, parse, "deterministic-fast-path");
  }
  return withOfficial;
}

function isLensAiOffId(value: string): value is AiOffChallengeId {
  return (LENS_AI_OFF_CHALLENGE_IDS as readonly string[]).includes(value);
}
