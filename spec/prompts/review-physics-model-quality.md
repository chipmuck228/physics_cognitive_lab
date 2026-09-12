# Standard Cursor prompt — review Physics Model quality

**Use this file as the default quality-review request.**  
Do not rely on prior ChatGPT or Cursor conversation history.

Fill in:

```text
MODE = PRE | POST
MODEL_ID = <canonical Physics Model id from spec/physics-model-library.md>
SCENE_ID = <required when MODE=POST; SceneDefinition.id / runtime sceneId>
```

Then paste the rest of this document as the Cursor task.

---

## Mission

Perform one canonical Physics Model Quality Review.

```text
MODE=PRE  → Gate A: is this model worth implementing correctly?
MODE=POST → Gate B: what does the implementation actually evidence?
```

These are different questions. Do not merge them.

This is **not** a Scene implementation request.  
Do **not** implement a new Scene.  
Do **not** change UPLP, L-level semantics, or Universal Runtime.  
Do **not** mark the model `validated`.

---

## Required reading (in order)

Read project-owned specs. Do **not** reconstruct the method from chat memory.

1. `PROJECT_BRAIN.md`
2. `spec/SPEC_ALIGNMENT_MANIFEST.md`
3. `spec/physics-model-quality-review.md` — this review's source of truth
4. `spec/evidence-design-contract.md` — how implemented evidence must justify a claim
5. `spec/universal-physics-learning-protocol.md`
6. `spec/physics-model-schema.md`
7. `spec/physics-model-library.md`
8. `spec/cognitive-action-taxonomy.md`
9. `spec/physics-model-implementation-protocol.md`
10. the concrete model under `content/physics-models/<MODEL_ID>/`
11. `spec/scenes/<SCENE_ID>/` if it exists
12. `DECISION_LOG.md`
13. if MODE=PRE: `spec/reviews/templates/pre-model-quality-review.md`
14. if MODE=POST: `spec/reviews/templates/post-learning-evidence-review.md`
15. optional worked example: `spec/reviews/examples/density-mass-volume.md`

If documents disagree, follow the designated owner. Quality Review owns whether physics/pedagogy/evidence claims are justified. It does not own stage meanings, schema fields, or Library IDs. Evidence-design rules are owned by `evidence-design-contract.md`.

---

## Hard distinctions

```text
Correct answer ≠ correct reasoning ≠ constructed model ≠ transfer ≠ independent use
Engineering correctness ≠ pedagogical validity ≠ learner validation
MODEL_QUALITY_PASS ≠ IMPLEMENTATION_READY
LEARNING_EVIDENCE_PASS ≠ validated
```

Passing TypeScript, Vitest, Playwright, or deterministic evaluator tests is **context**, not a quality result.

A later evidence level must never be inferred merely because an earlier one is present.

---

## MODE=PRE

Inspect the canonical model and Scene spec only.

Complete [`spec/reviews/templates/pre-model-quality-review.md`](../reviews/templates/pre-model-quality-review.md).

Cover A1–A12 from `spec/physics-model-quality-review.md`.

Return exactly one Gate A result:

- `MODEL_QUALITY_PASS`
- `MODEL_QUALITY_PASS_WITH_REFINEMENTS`
- `MODEL_QUALITY_BLOCKED_PHYSICS`
- `MODEL_QUALITY_BLOCKED_PEDAGOGY`
- `MODEL_QUALITY_BLOCKED_BOUNDARY`
- `MODEL_QUALITY_INSUFFICIENT_EVIDENCE_DESIGN`

If blocked: report the blocker. Do **not** invent missing physics or pedagogy. Do **not** start implementation.

`MODEL_QUALITY_PASS` does not authorize implementation by itself. The Readiness Gate is still required.

---

## MODE=POST

`SCENE_ID` is required.

Inspect the **actual implementation**, not only the spec. Read evaluators, the Scene evidence accumulator, UI tasks, overlay, and COMPLETE copy.

Complete [`spec/reviews/templates/post-learning-evidence-review.md`](../reviews/templates/post-learning-evidence-review.md).

For every important claim, fill the Evidence Claim Audit, including provenance. Hunt with the weakest-pass question from `spec/evidence-design-contract.md`.

Explicitly test the **weakest student behavior that can still pass** MODEL, TRANSFER, EXAM, and AI_OFF. Hunt for:

- formula memorization
- keyword matching
- radio click-through
- answer-only success
- surface transfer
- memorized AI_OFF conclusion
- long text treated as understanding
- accidental L4/L5/L6 escalation
- post-check evidence retroactively substituting for missing pre-commit reasoning
- physics-noun sandwiches treated as a relation

Return exactly one Gate B result:

- `LEARNING_EVIDENCE_PASS`
- `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`
- `LEARNING_EVIDENCE_BLOCKED`
- `LEARNING_EVIDENCE_OVERCLAIM`
- `LEARNING_EVIDENCE_SHORTCUT_FOUND`

A PASS or `PASS_WITH_REFINEMENTS` means quality-reviewed prototype only.  
It authorizes later inventory promotion to `metadata.status = "prototype"`.  
It does **not** mean learner-validated.  
`BLOCKED` / `OVERCLAIM` / `SHORTCUT_FOUND` must not authorize `prototype`.

---

## Output

Produce one canonical review:

1. MODE and IDs
2. Completed template
3. Weakest-passing-behavior findings (POST) or A1–A12 verdicts (PRE)
4. Evidence claim table for the main claims
5. Exactly one official result
6. Remaining risks
7. Confirmation that Library status was not promoted to `validated`

Do not write a second competing review method in the report.
