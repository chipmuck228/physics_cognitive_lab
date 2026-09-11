import { generateTutorResponse } from "@/lib/ai/tutor";
import {
  SAFE_TUTOR_FALLBACK,
  tutorRequestSchema,
} from "@/lib/ai/tutor-schema";
import { canCallTutor, isTutorHardBlocked } from "@/lib/learning/stage-policy";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = tutorRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(SAFE_TUTOR_FALLBACK);
    }

    if (isTutorHardBlocked(parsed.data.stage)) {
      return Response.json({ error: "tutor_disabled" }, { status: 403 });
    }

    if (!canCallTutor(parsed.data.stage)) {
      return Response.json({ error: "tutor_disabled" }, { status: 403 });
    }

    const response = await generateTutorResponse(parsed.data);
    return Response.json(response);
  } catch {
    return Response.json(SAFE_TUTOR_FALLBACK);
  }
}
