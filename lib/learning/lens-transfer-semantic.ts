import {
  classifyLensStep6FastPath,
  evaluateLensAuthoredSemanticClaim,
  lensAuthoredBindMissingMessage,
  type LensReasoningSemanticParse,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import {
  applyDerivedTransferFields,
  type LensTransferDraft,
} from "@/lib/learning/lens-transfer";
import type { LensModelStepCheck, LensStep6Interpretation } from "@/lib/learning/lens-model";

export function applyLensTransferParse(
  draft: LensTransferDraft,
  parse: LensReasoningSemanticParse,
  source: LensStep6Interpretation["source"],
): { draft: LensTransferDraft; check: LensModelStepCheck } {
  const next = applyDerivedTransferFields(draft, parse, source);
  if (!next.objectStation) {
    return {
      draft: next,
      check: { status: "missing", message: LENS_COPY.transferStructureIncomplete },
    };
  }
  if (!next.meetingMode || !next.nature) {
    return {
      draft: next,
      check: { status: "missing", message: LENS_COPY.transferVague },
    };
  }
  const claim = evaluateLensAuthoredSemanticClaim(
    parse,
    next.meetingMode as "actual-convergence" | "backward-extension" | "no-finite-meeting",
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

export function resolveLensTransferWithoutLlm(draft: LensTransferDraft): {
  handled: boolean;
  draft: LensTransferDraft;
  check: LensModelStepCheck;
} {
  if (!draft.objectStation) {
    return {
      handled: true,
      draft,
      check: { status: "missing", message: LENS_COPY.transferStructureIncomplete },
    };
  }
  if (!draft.studentExplanation.trim()) {
    return {
      handled: true,
      draft,
      check: { status: "missing", message: LENS_COPY.transferNeedAuthored },
    };
  }
  const fast = classifyLensStep6FastPath(draft.studentExplanation);
  if (fast.kind === "sufficient") {
    return {
      handled: true,
      ...applyLensTransferParse(draft, fast.parse, "deterministic-fast-path"),
    };
  }
  if (fast.kind === "insufficient") {
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
    check: { status: "missing", message: LENS_COPY.transferNeedCheck },
  };
}
