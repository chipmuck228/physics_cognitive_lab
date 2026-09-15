import { LENS_STEP6_UNCLEAR_MESSAGE } from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_AI_OFF_COPY, LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import {
  applyLensStep6Parse,
  parseLensReasoningSemantic,
  resolveLensStep6WithoutLlm,
} from "@/lib/learning/lens-step6-semantic";
import {
  applyLensTransferParse,
  resolveLensTransferWithoutLlm,
} from "@/lib/learning/lens-transfer-semantic";
import { resolveLensAiOffWithoutLlm } from "@/lib/learning/lens-ai-off-semantic";
import type { LensTransferDraft } from "@/lib/learning/lens-transfer";
import type { LensAiOffDraft } from "@/lib/learning/lens-ai-off";
import type { LensModelDraft, LensModelStepCheck } from "@/lib/learning/lens-model";
import { normalizeLensStep6Text } from "@/content/physics-models/convex-lens-imaging/construction";
import type { LensReasoningSemanticParse } from "@/content/physics-models/convex-lens-imaging/construction";

const parseCache = new Map<string, LensReasoningSemanticParse>();

export function clearLensStep6ParseCache() {
  parseCache.clear();
}

export async function requestLensStep6Parse(
  text: string,
): Promise<{ ok: true; parse: LensReasoningSemanticParse } | { ok: false; reason: "unavailable" | "invalid" }> {
  const key = normalizeLensStep6Text(text);
  const cached = parseCache.get(key);
  if (cached) {
    return { ok: true, parse: cached };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch("/api/lens-step6-parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sceneId: "convex-lens-optical-bench",
        step: 6,
        text,
      }),
      signal: controller.signal,
    });
    const raw: unknown = await response.json();
    if (!response.ok || !raw || typeof raw !== "object") {
      logClientParse({
        semanticPath: "llm",
        providerCalled: false,
        providerHttpStatus: response.status,
        parseResultStatus: "unavailable",
        failureCategory: "provider_unavailable",
      });
      return { ok: false, reason: "unavailable" };
    }
    const record = raw as {
      ok?: boolean;
      parse?: unknown;
      reason?: string;
      failureCategory?: string;
      providerCalled?: boolean;
      providerHttpStatus?: number;
    };
    if (!record.ok) {
      logClientParse({
        semanticPath: "llm",
        providerCalled: record.providerCalled === true,
        providerHttpStatus: record.providerHttpStatus ?? response.status,
        parseResultStatus: record.reason === "invalid" ? "invalid" : "unavailable",
        failureCategory: record.failureCategory ?? record.reason,
      });
      return { ok: false, reason: record.reason === "invalid" ? "invalid" : "unavailable" };
    }
    const parse = parseLensReasoningSemantic(record.parse);
    if (!parse) {
      logClientParse({
        semanticPath: "llm",
        providerCalled: true,
        providerHttpStatus: response.status,
        parseResultStatus: "invalid",
        failureCategory: "schema_invalid",
      });
      return { ok: false, reason: "invalid" };
    }
    logClientParse({
      semanticPath: "llm",
      providerCalled: true,
      providerHttpStatus: response.status,
      parseResultStatus: "valid",
      normalizedParseCategory: parse.meetingClaim,
    });
    parseCache.set(key, parse);
    return { ok: true, parse };
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    logClientParse({
      semanticPath: "llm",
      providerCalled: false,
      parseResultStatus: "unavailable",
      failureCategory: aborted ? "timeout" : "request_aborted",
    });
    return { ok: false, reason: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

function logClientParse(entry: {
  semanticPath: "fast-path" | "llm";
  providerCalled: boolean;
  providerHttpStatus?: number;
  parseResultStatus: "valid" | "invalid" | "unavailable";
  normalizedParseCategory?: string;
  failureCategory?: string;
}) {
  console.info("[lens-step6-parse]", {
    semanticPath: entry.semanticPath,
    providerCalled: entry.providerCalled,
    providerHttpStatus: entry.providerHttpStatus ?? null,
    parseResultStatus: entry.parseResultStatus,
    normalizedParseCategory: entry.normalizedParseCategory ?? null,
    failureCategory: entry.failureCategory ?? null,
  });
}

export async function resolveLensStep6Check(
  draft: LensModelDraft,
  requestParse: typeof requestLensStep6Parse = requestLensStep6Parse,
): Promise<{ draft: LensModelDraft; check: LensModelStepCheck }> {
  const local = resolveLensStep6WithoutLlm(draft);
  if (local.handled) {
    return { draft: local.draft, check: local.check };
  }
  const remote = await requestParse(draft.studentReasoning);
  if (!remote.ok) {
    return {
      draft,
      check: { status: "missing", message: LENS_STEP6_UNCLEAR_MESSAGE },
    };
  }
  return applyLensStep6Parse(draft, remote.parse, "llm-semantic-parse");
}

export async function resolveLensTransferCheck(
  draft: LensTransferDraft,
  requestParse: typeof requestLensStep6Parse = requestLensStep6Parse,
): Promise<{ draft: LensTransferDraft; check: LensModelStepCheck }> {
  const local = resolveLensTransferWithoutLlm(draft);
  if (local.handled) {
    console.info("[lens-step6-parse]", {
      semanticPath: "fast-path",
      providerCalled: false,
      providerHttpStatus: null,
      parseResultStatus: local.check.status === "ready" ? "valid" : "unavailable",
      normalizedParseCategory: local.draft.authoredInterpretation?.parse.meetingClaim ?? null,
      failureCategory: local.check.status === "ready" ? null : "fast_path_handled",
    });
    return { draft: local.draft, check: local.check };
  }
  const remote = await requestParse(draft.studentExplanation);
  if (!remote.ok) {
    return {
      draft,
      check: { status: "missing", message: LENS_COPY.transferUnclear },
    };
  }
  return applyLensTransferParse(draft, remote.parse, "llm-semantic-parse");
}

export async function resolveLensAiOffCheck(
  draft: LensAiOffDraft,
  requestParse: typeof requestLensStep6Parse = requestLensStep6Parse,
): Promise<{ draft: LensAiOffDraft; check: LensModelStepCheck }> {
  const local = resolveLensAiOffWithoutLlm(draft);
  if (local.handled) {
    console.info("[lens-step6-parse]", {
      semanticPath: "fast-path",
      providerCalled: false,
      providerHttpStatus: null,
      parseResultStatus: local.check.status === "ready" ? "valid" : "unavailable",
      normalizedParseCategory: local.draft.authoredInterpretation?.parse.meetingClaim ?? null,
      failureCategory: local.check.status === "ready" ? null : "fast_path_handled",
    });
    return { draft: local.draft, check: local.check };
  }
  void requestParse;
  console.info("[lens-step6-parse]", {
    semanticPath: "ai-off-no-llm",
    providerCalled: false,
    providerHttpStatus: null,
    parseResultStatus: "unavailable",
    normalizedParseCategory: null,
    failureCategory: "ai_off_hard_boundary",
  });
  return {
    draft,
    check: { status: "missing", message: LENS_AI_OFF_COPY.unclear },
  };
}
