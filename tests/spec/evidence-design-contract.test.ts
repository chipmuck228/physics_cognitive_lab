import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Evidence Design Contract governance", () => {
  const contract = read("spec/evidence-design-contract.md");
  const quality = read("spec/physics-model-quality-review.md");
  const protocol = read("spec/physics-model-implementation-protocol.md");
  const schema = read("spec/physics-model-schema.md");
  const agents = read("AGENTS.md");
  const manifest = read("spec/SPEC_ALIGNMENT_MANIFEST.md");
  const implement = read("spec/prompts/implement-physics-model.md");
  const review = read("spec/prompts/review-physics-model-quality.md");
  const decision = read("DECISION_LOG.md");

  it("owns provenance and forbids post-check manufacture of missing pre-commit reasoning", () => {
    expect(contract).toMatch(/Principle 1 — Evidence provenance/);
    expect(contract).toMatch(/cannot\*\* retroactively manufacture missing pre-commit/);
    expect(contract).toMatch(/POST_COMMIT_CONFIRMATION/);
    expect(contract).toMatch(/PRE_COMMIT_AUTHORED/);
    expect(contract).toMatch(/PRE_COMMIT_STRUCTURED/);
    expect(contract).toMatch(/LLM_GENERATED` must never count as student evidence/);
    expect(protocol).toMatch(/must not manufacture missing pre-commit independent reasoning/);
  });

  it("owns relation-over-token and rejects noun sandwiches as relations", () => {
    expect(contract).toMatch(/Principle 2 — Relation over token presence/);
    expect(contract).toMatch(/noun sandwich is not a relation/);
    expect(contract).toMatch(/Do \*\*not\*\* “fix” an evaluator by requiring more characters/);
  });

  it("aligns transfer-mode evidence with Schema without redefining the enum", () => {
    expect(schema).toMatch(/type TransferMode/);
    expect(schema).toMatch(/"full-model"/);
    expect(schema).toMatch(/"partial-structure"/);
    expect(schema).toMatch(/"boundary-contrast"/);
    expect(contract).toMatch(/Do not redefine the enum/);
    expect(contract).toMatch(/A correct physics relation about a different case does not prove transfer/);
    expect(schema).toMatch(/evidence-design-contract\.md/);
  });

  it("keeps stage completion distinct from mastery evidence", () => {
    expect(contract).toMatch(/Principle 6 — Stage completion is not mastery evidence/);
    expect(contract).toMatch(/EXAM completion must not create L6/);
    expect(protocol).toMatch(/EXAM completion ≠ L6/);
  });

  it("keeps authorship floors distinct from understanding", () => {
    expect(contract).toMatch(/Principle 7 — Authorship floors are not understanding/);
    expect(contract).toMatch(/They do not establish physical understanding/);
    expect(protocol).toMatch(/Text length is authorship\/completeness at most, never understanding/);
  });

  it("keeps Gate results, lifecycle status, and Evidence Claim Design separate", () => {
    expect(contract).toMatch(/not\*\* a `metadata\.status` value and \*\*not\*\* a Gate result/);
    expect(contract).toMatch(/Evidence Claim Design is an \*\*implementation activity\*\*/);
    expect(quality).toMatch(/Evidence Claim Design is not a `metadata\.status` value and not a Gate result/);
    expect(protocol).toMatch(/It is \*\*not\*\* a `metadata\.status` value/);
    expect(implement).toMatch(/Do \*\*not\*\* add it to `metadata\.status`/);
    expect(contract).not.toMatch(/status:\s*"evidence-claim-design"/);
    expect(schema).not.toMatch(/"evidence-claim-design"/);
  });

  it("is referenced from governance owners without becoming a second review method", () => {
    expect(manifest).toMatch(/evidence-design-contract\.md/);
    expect(agents).toMatch(/evidence-design-contract\.md/);
    expect(quality).toMatch(/HOW implementation evidence must justify a cognitive claim/);
    expect(quality).toMatch(/does not redefine it/);
    expect(review).toMatch(/evidence-design-contract\.md/);
    expect(decision).toMatch(/D044 — Evidence Design Contract/);
  });
});
