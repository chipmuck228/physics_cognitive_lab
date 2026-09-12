import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/tutor/route";
import { LearningStage } from "@/types/learning";

const payload = {
  sessionId: "engine-session",
  learningGoal: "独立完成",
  studentResponse: "请提示我",
  currentPhysicsState: {
    scene: "four-stroke-engine" as const,
    stroke: "power" as const,
    pistonDirection: "down" as const,
    intakeValveOpen: false,
    exhaustValveOpen: false,
    combustionEventActive: true,
  },
  knownMisconceptions: [],
  allowedActions: [],
};

describe("tutor API AI_OFF boundary", () => {
  it("rejects AI_OFF with tutor_disabled", async () => {
    const response = await POST(
      new Request("http://localhost/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, stage: LearningStage.AI_OFF }),
      }),
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "tutor_disabled" });
  });

  it("rejects COMPLETE with tutor_disabled", async () => {
    const response = await POST(
      new Request("http://localhost/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, stage: LearningStage.COMPLETE }),
      }),
    );
    expect(response.status).toBe(403);
  });
});
