# Physics Model Quality Review

**Project:** `physics-cognitive-lab`  
**Version:** 0.1  
**Status:** Canonical review contract  
**Worked example:** [`reviews/examples/density-mass-volume.md`](./reviews/examples/density-mass-volume.md)

---

## 1. Purpose

This document is the **single source of truth** for Physics Model Quality Review.

It exists so a future reviewer can judge a Physics Model without prior ChatGPT or Cursor conversation history.

It answers two different questions. Do not merge them.

| Gate | Name | Question |
|---|---|---|
| **GATE A** | Pre-implementation Physics Model Quality Review | Is this Physics Model physically correct, pedagogically meaningful, bounded correctly, and worth implementing in this learning form? |
| **GATE B** | Post-implementation Learning Evidence Review | Given the implemented student actions, evaluators, evidence, transfer, exam, and AI_OFF behavior, what does the implementation actually provide evidence that the student can do? |

Gate A reviews the **canonical model and Scene design**.  
Gate B reviews **what the running implementation can actually credit**.

---

## 2. Ownership / non-duplication

| Document | Owns | Does not own |
|---|---|---|
| [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) | HOW the student learning loop works: stages, stage semantics, universal evidence flow, tutor permissions, hint ladder, AI_OFF | Whether a particular model's evidence claims are justified |
| [`physics-model-schema.md`](./physics-model-schema.md) | WHAT a canonical Physics Model contains | Whether that content is pedagogically sufficient |
| [`physics-model-library.md`](./physics-model-library.md) | WHICH canonical models exist, IDs, families, inventory lifecycle | Whether a listed model is worth implementing as designed |
| [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md) | Canonical C1–C14 IDs and meanings | Scene-specific evidence for those actions |
| [`physics-model-implementation-protocol.md`](./physics-model-implementation-protocol.md) | HOW a ready model becomes software | Whether the model should be implemented yet |
| [`evidence-design-contract.md`](./evidence-design-contract.md) | HOW implementation evidence must justify a cognitive claim | Stage meanings, L-level meanings, Gate results |
| [`physics-representation-integrity-contract.md`](./physics-representation-integrity-contract.md) | Whether student-visible physics representations preserve quantity identity | Physics calculations, UPLP, L-levels, interaction chrome |
| Readiness Gate (`validatePhysicsModelReadiness`) | WHETHER enough canonical implementation information exists to implement safely | Whether physics/pedagogy/evidence claims are justified |
| **This document** | WHETHER physics, pedagogy, and learning-evidence claims are justified | UPLP stage meanings, schema fields, Library IDs, runtime architecture, evaluator-design rules |
| Engineering tests (TypeScript, Vitest, Playwright, deterministic evaluators) | WHETHER implementation behavior matches deterministic contracts | Educational effectiveness |
| Future Learner Validation Protocol | WHETHER real students actually learn as intended | Implementation completeness |

Do **not** redefine UPLP stage semantics here. Reference them.  
Do **not** duplicate `PhysicsModel` TypeScript or schema fields here. Reference them.  
Do **not** invent new L1–L6 meanings. Official derivation remains `deriveModelEvidenceLevel`.

Quality Review is **not optional** for a new production model.

---

## 3. Core quality principle

```text
Correct answer
  ≠ Correct reasoning
  ≠ Constructed model
  ≠ Successful transfer
  ≠ Independent model use
```

A later evidence level must **never** be inferred merely because an earlier one is present.

Post-check evidence cannot retroactively substitute for missing pre-commit reasoning. Confirmation, reflection, or labeled distractor checks after commit may refine or reject an attempt. They must not create independent model reasoning that was absent in the committed response.

Evaluator-design rules for provenance, relation-over-token, target-specific transfer, and weakest-pass probes are owned by [`evidence-design-contract.md`](./evidence-design-contract.md). This review uses that contract. It does not redefine it.

Also:

```text
Engineering correctness
  ≠ Pedagogical validity
  ≠ Learner validation
```

Passing TypeScript, Vitest, Playwright, and deterministic evaluator tests proves **implementation behavior**, not educational effectiveness.

A complete Scene plus Engineering PASS is an **engineering-complete implementation**. It remains `draft`.

A POST result of `LEARNING_EVIDENCE_PASS` or `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` makes it a **quality-reviewed prototype** and eligible for Library `metadata.status = "prototype"`. See [`physics-model-schema.md`](./physics-model-schema.md) §20.

It must **not** become `validated` merely because:

- engineering tests pass;
- an AI reviewer judges the pedagogy to be good;
- Gate A or Gate B returns PASS;
- `metadata.status` is `prototype`.

Learner validation requires actual learner evidence under the project's future validation protocol.

---

## 4. Required order for a new production model

```text
canonical model design
  → PRE Model Quality Review          ← Gate A
  → fix quality blockers
  → Readiness Gate
  → Evidence Claim Design             ← implementation activity; see evidence-design-contract.md
  → one-pass implementation
  → adversarial evaluator tests
  → engineering gates
  → POST Learning Evidence Review     ← Gate B
  → quality-reviewed prototype
  → Library may write metadata.status = prototype
  → future learner validation
  → VALIDATED
```

Evidence Claim Design is not a `metadata.status` value and not a Gate result.

`MODEL_QUALITY_PASS` does **not** mean `IMPLEMENTATION_READY`.  
`IMPLEMENTATION_READY` does **not** mean `MODEL_QUALITY_PASS`.  
`LEARNING_EVIDENCE_PASS` does **not** mean learner-validated.  
`LEARNING_EVIDENCE_PASS` / `PASS_WITH_REFINEMENTS` authorize `prototype`, not `validated`.  
`BLOCKED` / `OVERCLAIM` / `SHORTCUT_FOUND` must not authorize `prototype`.

Readiness asks: is there enough canonical implementation information to implement safely?  
Quality Review asks: are the physics, pedagogy, and evidence claims justified?

Use:

- [`evidence-design-contract.md`](./evidence-design-contract.md) for evaluator-justification rules
- [`prompts/review-physics-model-quality.md`](./prompts/review-physics-model-quality.md)
- [`reviews/templates/pre-model-quality-review.md`](./reviews/templates/pre-model-quality-review.md)
- [`reviews/templates/post-learning-evidence-review.md`](./reviews/templates/post-learning-evidence-review.md)

---

## 5. GATE A — Pre-implementation Physics Model Quality Review

Review the canonical model under `content/physics-models/<MODEL_ID>/` and the Scene spec under `spec/scenes/<SCENE_ID>/` if it exists.

Do not infer quality from UI code. The model may not be implemented yet.

### A1. Physics Truth

- Is the physical model scientifically correct at the intended Grade-9 abstraction?
- Are quantities, relations, and mechanisms represented correctly?
- Is a mathematical relation being incorrectly taught as physical causation?
- Are important conditions hidden?

A formula may be true and still be the wrong thing to teach as a cause.  
Example risk: teaching `ρ = m / V` as if writing the symbols explains why density stays the same when a sample is cut.

### A2. Deep Structure

- What reusable structure should the student construct?
- Can it be expressed independently of the anchor phenomenon?
- Is it genuinely a model rather than a fact, formula, procedure, or slogan?

If removing the classroom objects also removes the idea, it is not yet a reusable model.

### A3. Conditions and Boundaries

- Under what conditions is the model valid?
- What assumptions are intentionally made?
- Where does the model stop?
- Which nearby phenomena require another model?

Do not expand a model into a neighboring domain just because students will ask.  
Keep hollow-object, buoyancy, microstructure, or other nearby ideas as **boundary** problems unless they are the primary model.

### A4. Cognitive Target

- What must the student learn to THINK or DO?
- Which C1–C14 actions are targeted? Use [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md).
- Distinguish knowing vocabulary from performing a cognitive action.

“Student can say density” is not the same as “student can check whether mass information is sufficient.”

### A5. Misconceptions

For each major misconception record:

| Field | Required |
|---|---|
| Incorrect mental model | What the student actually thinks |
| Observable student signal | What the student says, clicks, or builds |
| Why it is attractive | Why the idea feels plausible |
| Discriminating intervention / evidence | What would distinguish it from the target model |
| Target corrected structure | What the student should construct instead |

Misconceptions should expose **model structure**, not just a list of common wrong answers.

### A6. Anchor Phenomenon

- Does the anchor naturally create a need for the model?
- Can the phenomenon be understood at the intended level without front-loading the answer?
- Is the phenomenon simple enough that irrelevant complexity does not dominate?

Do not open OBSERVE by stating the target relation.

### A7. Experiments

For every experiment ask:

- What uncertainty does this experiment resolve?
- What prediction must occur before intervention?
- What new evidence becomes available?
- Does it distinguish competing student models?
- Is it redundant with another experiment?
- Can a student complete it mechanically without gaining useful evidence?

Prefer **high-information** experiments over activity count.

UPLP still owns the PREDICT → intervene → observe → compare → reflect loop. This review asks whether each experiment earns its place in that loop.

### A8. MODEL Representation

- What representation matches this model's deep structure?

Allowed examples. The runtime must **not** force every model into one visual grammar:

- energy / causal chain
- relation / condition board
- ratio / quantitative representation
- another **model-owned** grammar

Define the **minimum evidence** needed before MODEL can support L4.

Formula construction alone must not count as model construction unless the canonical model genuinely requires nothing beyond that relation.

L4 meaning remains Schema/UPLP-owned: MODEL-stage construction of a valid causal / structural model. This review asks whether the proposed student work actually justifies that claim.

### A9. Transfer Design

Review near / medium / far / boundary transfer.

For each target:

- What deep structure transfers?
- What surface features change?
- What does **not** transfer?
- Is this `full-model`, `partial-structure`, or `boundary-contrast`?
- Could the student succeed by surface similarity alone?

A transfer is not valid merely because the story nouns changed.

### A10. Exam Representation

- Does the exam task represent the **same** Physics Model?
- Does it test representation / model selection / reasoning rather than only the final answer?
- Are answer and reasoning separable?
- Does it include condition checking where appropriate?
- Does it accidentally introduce an untaught primary model?

Exam World sequencing remains UPLP-owned. This review asks whether the items still test this model.

### A11. AI_OFF

Define what independent performance would constitute **strong** evidence.

Review:

- unfamiliarity of the challenge
- model reasoning required
- conditions / boundaries
- answer vs reasoning
- independence from tutor / LLM
- whether a memorized conclusion can pass
- whether post-check evidence can retroactively substitute for missing pre-commit reasoning

AI_OFF must test independent model use, not merely recall.

Post-check evidence cannot retroactively substitute for missing pre-commit reasoning.

### A12. Evidence Ladder

Trace expected evidence:

```text
student action
  → raw attempt
  → deterministic evaluation
  → evidence flag
  → accumulator
  → deriveModelEvidenceLevel
```

Review whether the **proposed** evidence actually justifies L1–L6 semantics owned by the Schema and derived by `deriveModelEvidenceLevel`.

Do not assign `"L4" | "L5" | "L6"` inside Scene code. Reviewers must confirm the design does not plan to do that.

---

## 6. GATE A outcomes

| Result | Meaning |
|---|---|
| `MODEL_QUALITY_PASS` | Physically correct, pedagogically meaningful, bounded, and worth implementing in this form |
| `MODEL_QUALITY_PASS_WITH_REFINEMENTS` | Worth implementing after named, non-blocking refinements |
| `MODEL_QUALITY_BLOCKED_PHYSICS` | Scientific error, hidden condition, or false causation at the intended abstraction |
| `MODEL_QUALITY_BLOCKED_PEDAGOGY` | Deep structure, cognitive target, or misconception design is not yet a model |
| `MODEL_QUALITY_BLOCKED_BOUNDARY` | Scope creeps into another model, or the model stops in the wrong place |
| `MODEL_QUALITY_INSUFFICIENT_EVIDENCE_DESIGN` | Experiments, MODEL, transfer, exam, or AI_OFF cannot yet justify the intended claims |

`MODEL_QUALITY_PASS` does **not** mean `IMPLEMENTATION_READY`.  
After a PASS or PASS_WITH_REFINEMENTS, still run the Readiness Gate before implementation.

If blocked: report the blocker. Do **not** invent missing physics or pedagogy to make the model implementable.

---

## 7. GATE B — Post-implementation Learning Evidence Review

Inspect **actual implementation behavior**, not only the spec.

Required inspection includes:

- Scene UI / stage tasks
- stored attempt types
- deterministic evaluators
- Scene evidence accumulator
- transfer / exam / AI_OFF evaluators
- AssessmentOverlay
- COMPLETE copy

For each important cognitive claim, trace:

```text
UI asks
  → student action
  → stored attempt
  → evaluator
  → evidence accumulator
  → derived evidence level
```

### Weakest-passing-behavior method

This is a core adversarial review technique.

Ask:

> What is the weakest student behavior that can still pass this gate?

Hunt for shortcuts such as:

- formula memorization
- keyword matching
- clicking structured radios without reasoning
- answer-only success
- copying a visible relation
- surface matching in transfer
- memorized conclusion in AI_OFF
- long text being mistaken for understanding
- completing steps without correct evidence
- evaluator accepting distractor reasoning
- accidental L4 / L5 / L6 escalation
- post-check evidence retroactively substituting for missing pre-commit reasoning
- physics-noun sandwiches treated as a relation

If the weakest passing behavior is weaker than the claim, the claim is an overclaim.

---

## 8. POST review by stage

Use UPLP stage meanings. Do not redefine them here.

### OBSERVE / DESCRIBE

- Is evidence observation / representation only?
- Is higher-level model knowledge accidentally credited?

### PREDICT

- Is prediction committed before intervention?
- Can the student edit history after seeing the result?

### EXPERIMENT

- Does the experiment close the UPLP evidence loop?
- Does completion mean “performed” rather than automatically “understood”?
- Is the result deterministic and app-owned?

### EXPLAIN

- Does explanation evidence remain below model construction where appropriate?
- Can keyword overlap incorrectly become L4?

### MODEL

- What exact behavior earns valid model evidence?
- Can formula / slogan / drag-order memorization pass?
- Does the representation test the deep structure?
- Are conditions represented?

### TRANSFER

- Is success based on structural transfer?
- Can surface similarity pass?
- Are non-transferable relations handled?
- Does required transfer justify L5?

### EXAM

- Does it preserve Exam World sequencing?
- Is the final answer separate from reasoning?
- Can EXAM alone create L6? It must not.

### AI_OFF

- Is AI technically and pedagogically absent?
- Is the response committed before post-check?
- Can answer-only pass?
- Can a memorized conclusion pass?
- Does reasoning demonstrate independent model use?
- Does `llmUsed` remain `false`?
- Can post-check evidence retroactively substitute for missing pre-commit reasoning? It must not.

### COMPLETE

- Is wording evidence-bounded?
- Does it avoid claims such as mastery or score improvement without evidence?

---

## 9. Evidence Claim Audit

For every important claim, complete this table.

Typical claims:

- “student constructed the model”
- “student transferred the model”
- “student independently used the model”

| Field | Question |
|---|---|
| CLAIM | What exactly is being claimed? |
| REQUIRED STUDENT ACTION | What must the student think or do? |
| RAW EVIDENCE | What is stored? |
| PROVENANCE | `PRE_COMMIT_AUTHORED` / `PRE_COMMIT_STRUCTURED` / `POST_COMMIT_CONFIRMATION` / `SYSTEM_DERIVED` / `LLM_GENERATED` — see [`evidence-design-contract.md`](./evidence-design-contract.md) |
| DETERMINISTIC EVALUATOR | Which function accepts or rejects it? |
| MISCONCEPTION / DISTRACTOR CHECK | What wrong structure is rejected? |
| ACCUMULATED FLAG | Which `AccumulatedModelEvidence` field is set? |
| DERIVED LEVEL | What can `deriveModelEvidenceLevel` now return? |
| WEAKEST PASS / KNOWN SHORTCUTS | Weakest behavior that still produces the flag |
| REVIEW VERDICT | Supported / overclaimed / blocked |

The reviewer must be able to explain **why** the evidence supports the claim.

This table is Markdown review structure. It is not runtime code and not a second evidence engine.

---

## 10. GATE B outcomes

| Result | Meaning |
|---|---|
| `LEARNING_EVIDENCE_PASS` | Implemented evidence matches the intended claims closely enough for a quality-reviewed prototype |
| `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | Prototype is usable; named shortcuts or copy issues remain |
| `LEARNING_EVIDENCE_BLOCKED` | An intended claim cannot be supported by the current implementation |
| `LEARNING_EVIDENCE_OVERCLAIM` | Copy, tests, or status language claim more than the evidence can support |
| `LEARNING_EVIDENCE_SHORTCUT_FOUND` | A weaker-than-intended behavior can still pass a critical gate |

A POST `LEARNING_EVIDENCE_PASS` or `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` allows the implementation to be considered a **quality-reviewed prototype** and eligible for `metadata.status = "prototype"`.

It still does **not** mean learner-validated. It does **not** write `validated`.

Engineering status is context only. Record it. Do not let it decide the Gate B result.

---

## 11. Worked example

Scene 04 / `density-mass-volume` is the first worked example because it shows:

```text
correct answer
  ≠ correct reasoning
  ≠ constructed model
  ≠ transfer
  ≠ independent use
```

See [`reviews/examples/density-mass-volume.md`](./reviews/examples/density-mass-volume.md).

That example records a quality-reviewed prototype. After inventory alignment it may hold `metadata.status = "prototype"`. It does **not** mark the canonical model `validated`.

---

## 12. What reviewers must not do

- Rely on prior conversation history instead of project-owned specs
- Change UPLP, L-level semantics, or Universal Runtime to make a review pass
- Invent missing physics or pedagogy
- Promote Library `metadata.status` to `validated` because a review passed
- Promote to `prototype` after `BLOCKED`, `OVERCLAIM`, or `SHORTCUT_FOUND`
- Treat `IMPLEMENTATION_READY` as pedagogical certification
- Treat Playwright / Vitest green as learner validation
- Duplicate this methodology only in chat

If the model is blocked, stop and report the blocker.
