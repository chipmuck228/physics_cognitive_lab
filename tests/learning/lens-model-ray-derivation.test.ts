import { describe, expect, it } from "vitest";

import { twoStandardRays } from "@/content/physics-models/convex-lens-imaging/construction";
import {
  asCompletedLensRay,
  asVisibleLensRay,
  deriveRequiredRaySupport,
  evaluateLensModelStep,
  officialOptionalFocalRay,
  visibleLensStudentRays,
  withDerivedRequiredRay,
  withRequiredRayKind,
  emptyLensModelDraft,
} from "@/lib/learning/lens-model";

describe("Scene 07 required-ray derivation", () => {
  it("derives beforeLens and actual incidentPath from required kind", () => {
    expect(deriveRequiredRaySupport("parallel-axis")).toEqual({
      beforeLens: "parallel-to-principal-axis",
      incidentPath: "actual",
    });
    expect(deriveRequiredRaySupport("through-center")).toEqual({
      beforeLens: "toward-optical-center",
      incidentPath: "actual",
    });
    expect(deriveRequiredRaySupport("through-near-focus")).toBeNull();
  });

  it("completes a required ray from kind + afterLens only", () => {
    const completed = asCompletedLensRay({
      kind: "parallel-axis",
      beforeLens: "",
      afterLens: "through-far-focal-point",
      incidentPath: "",
    });
    expect(completed).toEqual({
      kind: "parallel-axis",
      beforeLens: "parallel-to-principal-axis",
      afterLens: "through-far-focal-point",
      incidentPath: "actual",
    });
  });

  it("does not complete a ray from derived support fields without kind and afterLens", () => {
    expect(
      asCompletedLensRay({
        kind: "",
        beforeLens: "parallel-to-principal-axis",
        afterLens: "through-far-focal-point",
        incidentPath: "actual",
      }),
    ).toBeNull();
  });

  it("makes a kind-only required ray visible as incident-only", () => {
    const visible = asVisibleLensRay({
      kind: "through-center",
      beforeLens: "",
      afterLens: "",
      incidentPath: "",
    });
    expect(visible).toMatchObject({
      kind: "through-center",
      beforeLens: "toward-optical-center",
      afterLens: "",
      incidentPath: "actual",
    });
  });

  it("clears afterLens when the required family changes", () => {
    const switched = withRequiredRayKind(
      withDerivedRequiredRay({
        kind: "parallel-axis",
        beforeLens: "",
        afterLens: "through-far-focal-point",
        incidentPath: "",
      }),
      "through-center",
    );
    expect(switched).toEqual({
      kind: "through-center",
      beforeLens: "toward-optical-center",
      afterLens: "",
      incidentPath: "actual",
    });
    const same = withRequiredRayKind(switched, "through-center");
    expect(same.afterLens).toBe("");
    const draft = {
      ...emptyLensModelDraft(),
      objectStation: "beyond-2f",
      rayA: switched,
    };
    const check = evaluateLensModelStep(draft, 2);
    expect(check.status).toBe("missing");
    expect(check.status === "missing" && check.message).toMatch(/经过透镜后怎么走/);
    expect(check.status === "missing" && check.message).not.toMatch(/走法还对不上/);
  });

  it("does not let optional focal replace the required pair", () => {
    const [parallel] = twoStandardRays();
    const draft = {
      ...emptyLensModelDraft(),
      objectStation: "beyond-2f",
      rayA: withDerivedRequiredRay({
        kind: "parallel-axis",
        beforeLens: "",
        afterLens: parallel!.afterLens,
        incidentPath: "",
      }),
      rayB: withDerivedRequiredRay({
        kind: "parallel-axis",
        beforeLens: "",
        afterLens: parallel!.afterLens,
        incidentPath: "",
      }),
      includeOptionalFocal: true,
    };
    const blocked = evaluateLensModelStep(draft, 3);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/两条必做光线/);
    expect(officialOptionalFocalRay("beyond-2f")?.kind).toBe("through-near-focus");
    expect(officialOptionalFocalRay("at-f")).toBeNull();
    expect(officialOptionalFocalRay("inside-f")?.incidentPath).toBe("backward-extension");
    expect(visibleLensStudentRays(draft).some((ray) => ray.optionalReference)).toBe(true);
  });
});
