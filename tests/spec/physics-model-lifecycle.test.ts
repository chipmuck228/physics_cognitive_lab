import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { chemicalEnergyInternalEnergyMechanicalEnergyModel } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy";
import { densityMassVolumeModel } from "@/content/physics-models/density-mass-volume";
import { energyInternalEnergyTemperatureModel } from "@/content/physics-models/energy-internal-energy-temperature";
import { forceChangesMotionStateModel } from "@/content/physics-models/force-changes-motion-state";
import { convexLensImagingModel } from "@/content/physics-models/convex-lens-imaging";
import { ohmsLawModel } from "@/content/physics-models/ohms-law";
import { specificHeatCapacityModel } from "@/content/physics-models/specific-heat-capacity";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Physics Model lifecycle governance", () => {
  const schema = read("spec/physics-model-schema.md");
  const library = read("spec/physics-model-library.md");
  const protocol = read("spec/physics-model-implementation-protocol.md");
  const quality = read("spec/physics-model-quality-review.md");
  const types = read("types/physics-model.ts");

  it("keeps metadata.status as draft|prototype|validated|production", () => {
    expect(schema).toMatch(/\| "draft"/);
    expect(schema).toMatch(/\| "prototype"/);
    expect(schema).toMatch(/\| "validated"/);
    expect(schema).toMatch(/\| "production"/);
    expect(types).toMatch(
      /status: "draft" \| "prototype" \| "validated" \| "production"/,
    );
    expect(schema).toMatch(/Do \*\*not\*\* add `implementation-ready`/);
    expect(protocol).toMatch(/not\*\* a `PhysicsModel\.metadata\.status`/);
  });

  it("does not treat IMPLEMENTATION_READY or PRE PASS as metadata.status", () => {
    expect(schema).toMatch(/PRE Quality PASS/);
    expect(schema).toMatch(/`IMPLEMENTATION_READY`/);
    expect(schema).toMatch(/do \*\*not\*\* promote `metadata\.status` out of `draft`/);
    expect(library).toMatch(/`implementation-ready` is the readiness-validator gate/);
    expect(quality).toMatch(/`IMPLEMENTATION_READY` does \*\*not\*\* mean `MODEL_QUALITY_PASS`/);
  });

  it("does not let Engineering PASS imply prototype", () => {
    expect(schema).toMatch(/engineering-complete implementation/);
    expect(schema).toMatch(
      /Do not call Engineering PASS alone “prototype-level engineering”/,
    );
    expect(protocol).toMatch(/Engineering PASS[\s\S]*Remains `draft`/);
  });

  it("lets POST PASS or PASS_WITH_REFINEMENTS authorize prototype", () => {
    expect(schema).toMatch(/LEARNING_EVIDENCE_PASS` or `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS/);
    expect(quality).toMatch(/authorize `prototype`, not `validated`/);
    expect(protocol).toMatch(/Eligible for Library `prototype`/);
  });

  it("forbids BLOCKED / OVERCLAIM / SHORTCUT_FOUND from authorizing prototype", () => {
    expect(schema).toMatch(/LEARNING_EVIDENCE_BLOCKED/);
    expect(schema).toMatch(/LEARNING_EVIDENCE_OVERCLAIM/);
    expect(schema).toMatch(/LEARNING_EVIDENCE_SHORTCUT_FOUND/);
    expect(quality).toMatch(
      /`BLOCKED` \/ `OVERCLAIM` \/ `SHORTCUT_FOUND` must not authorize `prototype`/,
    );
  });

  it("keeps prototype distinct from validated and reserves validated for learner evidence", () => {
    expect(schema).toMatch(/Requires real learner evidence/);
    expect(schema).toMatch(/quality-reviewed prototype \/ `metadata\.status = "prototype"`/);
    expect(quality).toMatch(/must \*\*not\*\* become `validated`/);
    expect(library).toMatch(/`validated` requires future learner evidence/);
  });

  it("keeps gate results distinct from lifecycle statuses", () => {
    expect(schema).toMatch(/Those results are not `metadata\.status` values/);
    expect(library).toMatch(/`LEARNING_EVIDENCE_\*` are quality-review results/);
    expect(protocol).toMatch(/Writes `metadata\.status`\?/);
  });

  it("promotes only models with a formal POST pass in the repository", () => {
    expect(densityMassVolumeModel.metadata.status).toBe("prototype");
    expect(specificHeatCapacityModel.metadata.status).toBe("prototype");
    expect(chemicalEnergyInternalEnergyMechanicalEnergyModel.metadata.status).toBe(
      "prototype",
    );
    expect(forceChangesMotionStateModel.metadata.status).toBe("prototype");
    expect(energyInternalEnergyTemperatureModel.metadata.status).toBe("prototype");
    expect(ohmsLawModel.metadata.status).toBe("prototype");
    expect(ohmsLawModel.metadata.status).not.toBe("validated");
    expect(convexLensImagingModel.metadata.status).toBe("prototype");
    expect(convexLensImagingModel.metadata.status).not.toBe("validated");
    expect(read("spec/reviews/post/convex-lens-imaging.md")).toMatch(
      /LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS/,
    );
    expect(read("spec/reviews/pre/convex-lens-imaging.md")).toMatch(
      /MODEL_QUALITY_PASS_WITH_REFINEMENTS/,
    );
    expect(read("spec/scenes/convex-lens-optical-bench/readiness.md")).toMatch(
      /IMPLEMENTATION_READY/,
    );
    expect(
      read("spec/scenes/convex-lens-optical-bench/evidence-claim-design.md"),
    ).toMatch(/constructedValidCausalModel/);
    expect(read("spec/reviews/pre/energy-internal-energy-temperature.md")).toMatch(
      /MODEL_QUALITY_PASS_WITH_REFINEMENTS/,
    );
    expect(read("spec/reviews/post/energy-internal-energy-temperature.md")).toMatch(
      /LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS/,
    );
    expect(read("spec/reviews/examples/density-mass-volume.md")).toMatch(
      /LEARNING_EVIDENCE_PASS/,
    );
    expect(read("spec/reviews/post/specific-heat-capacity.md")).toMatch(
      /LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS/,
    );
    expect(
      read("spec/reviews/post/chemical-energy-internal-energy-mechanical-energy.md"),
    ).toMatch(/LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS/);
    expect(read("spec/reviews/post/force-changes-motion-state.md")).toMatch(
      /LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS/,
    );
    expect(library).toMatch(
      /energy-internal-energy-temperature \| Microwave Bread[\s\S]*\| prototype \|/,
    );
  });
});
