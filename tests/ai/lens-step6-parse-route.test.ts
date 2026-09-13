import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/lens-step6-parse/route";

vi.mock("@/lib/ai/lens-step6-parse", () => ({
  generateLensStep6Parse: vi.fn(),
}));

import { generateLensStep6Parse } from "@/lib/ai/lens-step6-parse";

describe("lens-step6-parse route", () => {
  beforeEach(() => {
    vi.mocked(generateLensStep6Parse).mockReset();
  });

  it("rejects a non-Scene07 request without calling the model", async () => {
    const response = await POST(
      new Request("http://localhost/api/lens-step6-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sceneId: "four-stroke-engine",
          step: 6,
          text: "光线碰到一起，成实像。",
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(generateLensStep6Parse).not.toHaveBeenCalled();
  });

  it("returns an unavailable payload when the adapter fails", async () => {
    vi.mocked(generateLensStep6Parse).mockResolvedValue({
      ok: false,
      reason: "unavailable",
    });
    const response = await POST(
      new Request("http://localhost/api/lens-step6-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sceneId: "convex-lens-optical-bench",
          step: 6,
          text: "光线碰到一起，成实像。",
        }),
      }),
    );
    await expect(response.json()).resolves.toEqual({ ok: false, reason: "unavailable" });
  });
});
