import {
  classifyLensStep6FastPath,
  evaluateLensAuthoredSemanticClaim,
  lensAuthoredBindMissingMessage,
  parseFromLensAuthoredAnalysis,
  type LensReasoningSemanticParse,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_AI_OFF_COPY } from "@/lib/content/convex-lens-optical-bench";
import {
  applyDerivedAiOffFields,
  hasLensAiOffDerivedStructure,
  lensAiOffJudgmentImplication,
  type LensAiOffDraft,
} from "@/lib/learning/lens-ai-off";
import type { LensModelStepCheck, LensStep6Interpretation } from "@/lib/learning/lens-model";

function claimPhysicallyInconsistent(parse: LensReasoningSemanticParse): boolean {
  if (parse.meetingClaim === "actual-convergence" && parse.imageNatureClaim === "virtual") {
    return true;
  }
  if (parse.meetingClaim === "backward-extension" && parse.imageNatureClaim === "real") {
    return true;
  }
  if (
    parse.meetingClaim === "parallel-no-finite-meeting" &&
    (parse.imageNatureClaim === "real" || parse.imageNatureClaim === "virtual")
  ) {
    return true;
  }
  if (parse.meetingClaim === "actual-convergence" && parse.screenClaim === "not-receivable") {
    return true;
  }
  if (parse.meetingClaim === "backward-extension" && parse.screenClaim === "receivable") {
    return true;
  }
  return false;
}

function judgmentDisagreesWithParse(
  draft: LensAiOffDraft,
  parse: LensReasoningSemanticParse,
): boolean {
  const implied = lensAiOffJudgmentImplication(draft.selectedAnswer);
  if (!implied) {
    return false;
  }
  const meeting = parse.meetingClaim === "unclear" ? null : parse.meetingClaim;
  if (
    implied.meetingMode &&
    meeting &&
    implied.meetingMode !==
      (meeting === "parallel-no-finite-meeting" ? "no-finite-meeting" : meeting)
  ) {
    return true;
  }
  if (
    implied.nature &&
    parse.imageNatureClaim !== "unclear" &&
    implied.nature !== parse.imageNatureClaim
  ) {
    return true;
  }
  if (implied.screenReceivable !== undefined && parse.screenClaim !== "unclear") {
    const receivable = parse.screenClaim === "receivable";
    if (receivable !== implied.screenReceivable) {
      return true;
    }
  }
  return false;
}

export function applyLensAiOffParse(
  draft: LensAiOffDraft,
  parse: LensReasoningSemanticParse,
  source: LensStep6Interpretation["source"],
): { draft: LensAiOffDraft; check: LensModelStepCheck } {
  const next = applyDerivedAiOffFields(draft, parse, source);
  if (!next.objectStation) {
    return {
      draft: next,
      check: { status: "missing", message: LENS_AI_OFF_COPY.needStation },
    };
  }
  if (!next.selectedAnswer) {
    return {
      draft: next,
      check: { status: "missing", message: LENS_AI_OFF_COPY.needJudgment },
    };
  }
  if (claimPhysicallyInconsistent(parse)) {
    return {
      draft: next,
      check: { status: "inconsistent", message: LENS_AI_OFF_COPY.inconsistent },
    };
  }
  if (judgmentDisagreesWithParse(next, parse)) {
    return {
      draft: next,
      check: { status: "inconsistent", message: LENS_AI_OFF_COPY.judgmentDisagree },
    };
  }
  if (!next.meetingMode || !next.nature) {
    return {
      draft: next,
      check: { status: "missing", message: LENS_AI_OFF_COPY.vague },
    };
  }
  const claim = evaluateLensAuthoredSemanticClaim(
    parse,
    next.meetingMode as MeetingMode,
    {
      nature: next.nature as "real" | "virtual" | "none",
      screenReceivable: next.screenReceivable === "true",
    },
  );
  if (claim.status === "ready") {
    return { draft: next, check: { status: "ready" } };
  }
  return { draft: next, check: { status: claim.status, message: claim.message } };
}

export function resolveLensAiOffWithoutLlm(draft: LensAiOffDraft): {
  handled: boolean;
  draft: LensAiOffDraft;
  check: LensModelStepCheck;
} {
  if (!draft.objectStation) {
    return {
      handled: true,
      draft,
      check: { status: "missing", message: LENS_AI_OFF_COPY.needStation },
    };
  }
  if (!draft.selectedAnswer.trim()) {
    return {
      handled: true,
      draft,
      check: { status: "missing", message: LENS_AI_OFF_COPY.needJudgment },
    };
  }
  if (!draft.reasoning.trim()) {
    return {
      handled: true,
      draft,
      check: { status: "missing", message: LENS_AI_OFF_COPY.needReason },
    };
  }
  const fast = classifyLensStep6FastPath(draft.reasoning);
  if (fast.kind === "sufficient") {
    return {
      handled: true,
      ...applyLensAiOffParse(draft, fast.parse, "deterministic-fast-path"),
    };
  }
  if (fast.kind === "insufficient") {
    if (
      fast.authored.contradictory &&
      fast.authored.hasMeetingLanguage &&
      fast.authored.hasConsequenceLanguage
    ) {
      return {
        handled: true,
        ...applyLensAiOffParse(
          draft,
          parseFromLensAuthoredAnalysis(fast.authored),
          "deterministic-fast-path",
        ),
      };
    }
    return {
      handled: true,
      draft: { ...draft, authoredInterpretation: null },
      check: {
        status: "inconsistent",
        message: lensAuthoredBindMissingMessage(fast.authored),
      },
    };
  }
  return {
    handled: false,
    draft,
    check: { status: "missing", message: LENS_AI_OFF_COPY.unclear },
  };
}

export function lensAiOffCanAdvanceToPostCheck(draft: LensAiOffDraft): boolean {
  return (
    Boolean(draft.objectStation) &&
    draft.selectedAnswer.trim().length > 0 &&
    draft.reasoning.trim().length > 0 &&
    hasLensAiOffDerivedStructure(draft)
  );
}
