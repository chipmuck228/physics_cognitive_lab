import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Physics Model Quality Review governance", () => {
  const spec = read("spec/physics-model-quality-review.md");
  const preTemplate = read("spec/reviews/templates/pre-model-quality-review.md");
  const postTemplate = read("spec/reviews/templates/post-learning-evidence-review.md");
  const prompt = read("spec/prompts/review-physics-model-quality.md");
  const manifest = read("spec/SPEC_ALIGNMENT_MANIFEST.md");
  const agents = read("AGENTS.md");
  const brain = read("PROJECT_BRAIN.md");
  const example = read("spec/reviews/examples/density-mass-volume.md");

  it("keeps the quality review spec, templates, and prompt as project-owned files", () => {
    expect(spec).toMatch(/GATE A/);
    expect(spec).toMatch(/GATE B/);
    expect(spec).toMatch(/Correct answer/);
    expect(spec).toMatch(/MODEL_QUALITY_PASS/);
    expect(spec).toMatch(/LEARNING_EVIDENCE_PASS/);
    expect(spec).toMatch(
      /Post-check evidence cannot retroactively substitute for missing pre-commit reasoning/,
    );
    expect(preTemplate).toMatch(/Final Gate A result/);
    expect(postTemplate).toMatch(/Final Gate B result/);
    expect(prompt).toMatch(/MODE = PRE \| POST/);
    expect(prompt).toMatch(/rely on prior/);
  });

  it("registers quality review as the pedagogical/learning-evidence owner", () => {
    expect(manifest).toMatch(/physics-model-quality-review\.md/);
    expect(manifest).toMatch(
      /Physics Model pedagogical\/learning-evidence quality is owned by `physics-model-quality-review\.md`/,
    );
    expect(agents).toMatch(/PRE Model Quality Review/);
    expect(agents).toMatch(/POST Learning Evidence Review/);
    expect(brain).toMatch(/PRE Model Quality Review/);
    expect(brain).toMatch(/POST Learning Evidence Review/);
  });

  it("does not treat implementation-ready as model-quality-pass", () => {
    expect(spec).toMatch(/MODEL_QUALITY_PASS` does \*\*not\*\* mean `IMPLEMENTATION_READY/);
    expect(agents).toMatch(/`IMPLEMENTATION_READY` does not mean `MODEL_QUALITY_PASS`/);
    expect(read("spec/physics-model-library.md")).toMatch(
      /does not imply `MODEL_QUALITY_PASS`/,
    );
  });

  it("does not treat prototype or engineering pass as learner validation", () => {
    expect(spec).toMatch(/does \*\*not\*\* mean learner-validated/);
    expect(spec).toMatch(/Engineering correctness/);
    expect(agents).toMatch(/quality-reviewed prototype does not mean learner-validated/);
    expect(agents).toMatch(/Engineering tests do not confer `validated`/);
    expect(brain).toMatch(/never conferred by unit tests or an AI review/);
    expect(example).toMatch(/Learner Validation \| NOT YET/);
    expect(example).not.toMatch(/metadata\.status` remains `validated/);
  });

  it("keeps Scene 04 as a worked example without marking the model validated", () => {
    expect(example).toMatch(/ρ = m \/ V/);
    expect(example).toMatch(/因为是同一种物质，所以密度不变/);
    expect(example).toMatch(/质量和体积都按相同比例变小/);
    expect(example).toMatch(/does \*\*not\*\* mark the canonical model `validated`/);
    expect(example).toMatch(/LEARNING_EVIDENCE_PASS/);
  });
});
