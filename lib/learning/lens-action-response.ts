export type LensActionResponseClass =
  | "applied"
  | "committed"
  | "advanced"
  | "missing"
  | "rejected"
  | "blocked"
  | "loading"
  | "system-error"
  | "review-applied"
  | "discarded";

export type LensDomainOutcome =
  | { kind: "physics-applied"; review: boolean }
  | { kind: "committed"; advanced?: boolean }
  | { kind: "rejected"; missing?: boolean }
  | { kind: "missing" }
  | { kind: "blocked" }
  | { kind: "loading" }
  | { kind: "system-error" }
  | { kind: "preview-discarded" };

/**
 * Presentation mapping only. The Scene / evaluator / progression already
 * decided the domain outcome. This does not re-evaluate physics or evidence.
 */
export function presentLensActionResponse(
  outcome: LensDomainOutcome,
): LensActionResponseClass {
  if (outcome.kind === "physics-applied") {
    return outcome.review ? "review-applied" : "applied";
  }
  if (outcome.kind === "committed") {
    return outcome.advanced ? "advanced" : "committed";
  }
  if (outcome.kind === "rejected") {
    return outcome.missing ? "missing" : "rejected";
  }
  if (outcome.kind === "missing") {
    return "missing";
  }
  if (outcome.kind === "blocked") {
    return "blocked";
  }
  if (outcome.kind === "loading") {
    return "loading";
  }
  if (outcome.kind === "system-error") {
    return "system-error";
  }
  return "discarded";
}
