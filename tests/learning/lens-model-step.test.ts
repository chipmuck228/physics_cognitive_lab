import { describe, expect, it } from "vitest";

import { twoStandardRays } from "@/content/physics-models/convex-lens-imaging/construction";
import {
  completeLensModelDraft,
  emptyLensModelDraft,
  evaluateLensModelStep,
  lensModelRepairStep,
} from "@/lib/learning/lens-model";

function incoherentParallel() {
  return {
    kind: "parallel-axis",
    beforeLens: "parallel-to-principal-axis",
    afterLens: "undeviated",
    incidentPath: "actual",
  };
}

describe("Scene 07 MODEL local step checks", () => {
  it("step 2: incomplete ray is missing, inconsistent pairing is blocked, coherent ray is ready", () => {
    const draft = { ...emptyLensModelDraft(), objectStation: "beyond-2f" };
    expect(evaluateLensModelStep(draft, 2).status).toBe("missing");
    const incoherent = { ...draft, rayA: incoherentParallel() };
    const blocked = evaluateLensModelStep(incoherent, 2);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/走法/);
    expect(blocked.status === "inconsistent" && blocked.message).not.toMatch(/经过另一侧焦点/);
    const [parallel] = twoStandardRays();
    expect(evaluateLensModelStep({ ...draft, rayA: parallel! }, 2).status).toBe("ready");
  });

  it("step 3: required-pair structure is checked after both rays exist", () => {
    const [parallel] = twoStandardRays();
    const duplicate = {
      ...emptyLensModelDraft(),
      objectStation: "beyond-2f",
      rayA: parallel!,
      rayB: parallel!,
    };
    const blocked = evaluateLensModelStep(duplicate, 3);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/两条必做光线/);
    const ready = completeLensModelDraft("beyond-2f");
    ready.constructionStep = 3;
    expect(evaluateLensModelStep(ready, 3).status).toBe("ready");
  });

  it("step 4: meeting that conflicts with the station is inconsistent", () => {
    const draft = {
      ...completeLensModelDraft("beyond-2f"),
      meetingMode: "backward-extension",
    };
    const blocked = evaluateLensModelStep(draft, 4);
    expect(blocked.status).toBe("inconsistent");
    expect(evaluateLensModelStep(completeLensModelDraft("beyond-2f"), 4).status).toBe("ready");
  });

  it("step 5: image consequence must match meeting, but official size can wait for final submit", () => {
    const conflict = {
      ...completeLensModelDraft("beyond-2f"),
      nature: "virtual",
      side: "same-side",
    };
    const blocked = evaluateLensModelStep(conflict, 5);
    expect(blocked.status).toBe("inconsistent");
    const wrongSize = { ...completeLensModelDraft("beyond-2f"), size: "enlarged" };
    expect(evaluateLensModelStep(wrongSize, 5).status).toBe("ready");
  });

  it("step 6: slogan-like bind is inconsistent; sufficient causal bind is ready", () => {
    const empty = { ...completeLensModelDraft("beyond-2f"), studentReasoning: "" };
    expect(evaluateLensModelStep(empty, 6).status).toBe("missing");
    const slogan = { ...completeLensModelDraft("beyond-2f"), studentReasoning: "倒立缩小实像" };
    expect(evaluateLensModelStep(slogan, 6).status).toBe("inconsistent");
    expect(evaluateLensModelStep(completeLensModelDraft("beyond-2f"), 6).status).toBe("ready");
  });

  it("maps final evaluator failures to a repair step", () => {
    expect(lensModelRepairStep("geometrically-incoherent-rays")).toBe(2);
    expect(
      lensModelRepairStep("missing-required-construction-pair", completeLensModelDraft()),
    ).toBe(3);
    expect(lensModelRepairStep("meeting-mode-conflicts-station")).toBe(4);
    expect(lensModelRepairStep("image-conflicts-meeting-mode")).toBe(5);
    expect(lensModelRepairStep("properties-without-relation")).toBe(6);
  });
});
