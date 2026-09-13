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
  | { kind: "physics-applied"; review: boolean; message?: string }
  | { kind: "committed"; advanced?: boolean; message?: string }
  | { kind: "rejected"; missing?: boolean; message?: string }
  | { kind: "missing"; message?: string }
  | { kind: "blocked"; message?: string }
  | { kind: "loading"; message?: string }
  | { kind: "system-error"; message?: string }
  | { kind: "preview-discarded"; message?: string };

export interface LensActionResponseView {
  className: LensActionResponseClass;
  message: string;
  tone: "missing" | "incorrect" | "info";
}

const DEFAULT_MESSAGE: Record<LensActionResponseClass, string> = {
  applied: "已经改了眼前看到的。",
  committed: "已经记下。",
  advanced: "这一步记下了，可以看下一页。",
  missing: "还缺你自己要完成的一步。",
  rejected: "再想一想刚才写的关系。",
  blocked: "现在不能做这一步。",
  loading: "正在处理。",
  "system-error": "刚才没记下，请再试一次。",
  "review-applied": "这只是回看预览，不会改掉已经记下的进度。",
  discarded: "回看预览已经放下，进度还在原来的地方。",
};

export function lensActionResponseView(
  outcome: LensDomainOutcome,
): LensActionResponseView {
  const className = presentLensActionResponse(outcome);
  const tone =
    className === "rejected"
      ? "incorrect"
      : className === "missing"
        ? "missing"
        : "info";
  return {
    className,
    message: outcome.message?.trim() || DEFAULT_MESSAGE[className],
    tone,
  };
}

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
