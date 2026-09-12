import { applyTutorGuardrails } from "@/lib/ai/guardrails";
import { completeChat } from "@/lib/ai/provider";
import { buildTutorUserPrompt, TUTOR_SYSTEM_PROMPT } from "@/lib/ai/tutor-prompt";
import {
  SAFE_TUTOR_FALLBACK,
  tutorResponseSchema,
  type TutorRequestInput,
  type TutorResponseParsed,
} from "@/lib/ai/tutor-schema";
import { canCallTutor } from "@/lib/learning/stage-policy";
import type { SceneId } from "@/types/learning";

export function createFallbackTutorResponse(): TutorResponseParsed {
  return { ...SAFE_TUTOR_FALLBACK };
}

export function parseTutorResponse(
  raw: unknown,
  stage: TutorRequestInput["stage"],
  sceneId?: SceneId,
): TutorResponseParsed {
  const parsed = tutorResponseSchema.safeParse(raw);
  if (!parsed.success) {
    return createFallbackTutorResponse();
  }

  return applyTutorGuardrails(parsed.data, stage, sceneId);
}

export async function generateTutorResponse(
  request: TutorRequestInput,
): Promise<TutorResponseParsed> {
  if (!canCallTutor(request.stage)) {
    return createFallbackTutorResponse();
  }

  try {
    const content = await completeChat([
      { role: "system", content: TUTOR_SYSTEM_PROMPT },
      { role: "user", content: buildTutorUserPrompt(request) },
    ]);
    return parseTutorResponse(
      parseJsonContent(content),
      request.stage,
      request.sceneId,
    );
  } catch {
    return createFallbackTutorResponse();
  }
}

function parseJsonContent(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}
