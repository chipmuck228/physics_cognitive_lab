import { LENS_STEP6_UNCLEAR_MESSAGE } from "@/content/physics-models/convex-lens-imaging/construction";
import {
  applyLensStep6Parse,
  parseLensReasoningSemantic,
  resolveLensStep6WithoutLlm,
} from "@/lib/learning/lens-step6-semantic";
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
      return { ok: false, reason: "unavailable" };
    }
    const record = raw as { ok?: boolean; parse?: unknown; reason?: string };
    if (!record.ok) {
      return { ok: false, reason: record.reason === "invalid" ? "invalid" : "unavailable" };
    }
    const parse = parseLensReasoningSemantic(record.parse);
    if (!parse) {
      return { ok: false, reason: "invalid" };
    }
    parseCache.set(key, parse);
    return { ok: true, parse };
  } catch {
    return { ok: false, reason: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
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
