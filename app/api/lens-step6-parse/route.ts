import { generateLensStep6Parse } from "@/lib/ai/lens-step6-parse";
import { lensStep6ParseRequestSchema } from "@/lib/learning/lens-step6-semantic";

const UNAVAILABLE = { ok: false as const, reason: "unavailable" as const };

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = lensStep6ParseRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
    }
    const result = await generateLensStep6Parse(parsed.data);
    return Response.json(result, { status: result.ok ? 200 : 200 });
  } catch {
    return Response.json(UNAVAILABLE);
  }
}
