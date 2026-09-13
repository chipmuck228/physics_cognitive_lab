import { z } from "zod";

import {
  classifyLensStep6FastPath,
  evaluateLensAuthoredSemanticClaim,
  lensAuthoredBindMissingMessage,
  normalizeLensStep6Text,
  type ImageConsequence,
  type LensReasoningSemanticParse,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import type { LensModelDraft, LensModelStepCheck, LensStep6Interpretation } from "@/lib/learning/lens-model";

export const lensReasoningSemanticParseSchema = z.object({
  meetingClaim: z.enum([
    "actual-convergence",
    "backward-extension",
    "parallel-no-finite-meeting",
    "unclear",
  ]),
  imageNatureClaim: z.enum(["real", "virtual", "none", "unclear"]),
  screenClaim: z.enum(["receivable", "not-receivable", "unclear"]),
  hasMeetingClaim: z.boolean(),
  hasConsequenceClaim: z.boolean(),
  hasCausalBind: z.boolean(),
  ambiguity: z.enum(["none", "low", "high"]),
  unsupportedAdditions: z.array(z.string()).optional(),
});

export const lensStep6ParseRequestSchema = z.object({
  sceneId: z.literal("convex-lens-optical-bench"),
  step: z.literal(6),
  text: z.string().min(1).max(500),
});

export type LensStep6ParseRequest = z.infer<typeof lensStep6ParseRequestSchema>;

export function parseLensReasoningSemantic(raw: unknown): LensReasoningSemanticParse | null {
  const parsed = lensReasoningSemanticParseSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function interpretationFromParse(
  text: string,
  parse: LensReasoningSemanticParse,
  source: LensStep6Interpretation["source"],
): LensStep6Interpretation {
  return {
    provenance: "system-derived",
    source,
    textNormalized: normalizeLensStep6Text(text),
    parse,
  };
}

export function evaluateDraftAgainstParse(
  draft: LensModelDraft,
  parse: LensReasoningSemanticParse,
): LensModelStepCheck {
  const claim = evaluateLensAuthoredSemanticClaim(
    parse,
    draft.meetingMode as MeetingMode,
    {
      nature: draft.nature as ImageConsequence["nature"],
      screenReceivable: draft.screenReceivable === "true",
    },
  );
  if (claim.status === "ready") {
    return { status: "ready" };
  }
  return { status: claim.status, message: claim.message };
}

export function applyLensStep6Parse(
  draft: LensModelDraft,
  parse: LensReasoningSemanticParse,
  source: LensStep6Interpretation["source"],
): { draft: LensModelDraft; check: LensModelStepCheck } {
  const next = {
    ...draft,
    step6Interpretation: interpretationFromParse(draft.studentReasoning, parse, source),
  };
  return { draft: next, check: evaluateDraftAgainstParse(next, parse) };
}

export function resolveLensStep6WithoutLlm(draft: LensModelDraft): {
  handled: boolean;
  draft: LensModelDraft;
  check: LensModelStepCheck;
} {
  const fast = classifyLensStep6FastPath(draft.studentReasoning);
  if (fast.kind === "sufficient") {
    return { handled: true, ...applyLensStep6Parse(draft, fast.parse, "deterministic-fast-path") };
  }
  if (fast.kind === "insufficient") {
    return {
      handled: true,
      draft: { ...draft, step6Interpretation: null },
      check: {
        status: "inconsistent",
        message: lensAuthoredBindMissingMessage(fast.authored),
      },
    };
  }
  return {
    handled: false,
    draft,
    check: { status: "missing", message: LENS_COPY.modelStep6NeedCheck },
  };
}
