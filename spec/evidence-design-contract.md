# Evidence Design Contract

**Project:** `physics-cognitive-lab`  
**Version:** 0.1  
**Status:** Canonical implementation-evidence contract  
**Source reviews:** Scene 02–05 POST / PRE artifacts under `spec/reviews/`

---

## 1. Purpose

This document answers:

> HOW must implemented evidence justify a cognitive claim?

It sits between student action and derived cognitive level:

```text
student action
  → raw attempt
  → deterministic evaluator
  → evidence accumulator
  → deriveModelEvidenceLevel
```

It does **not** answer:

- HOW students learn (UPLP);
- WHAT a Physics Model contains, including `transferMode` field meanings and L1–L6 meanings (Schema);
- WHETHER a model's physics, pedagogy, or implemented claims are justified (Quality Review);
- HOW a ready model becomes a Scene on the runtime (Implementation Protocol);
- WHICH models exist (Library);
- WHICH C1–C14 IDs exist (Cognitive Action Taxonomy).

This is an implementation activity contract. It is **not** a `metadata.status` value and **not** a Gate result.

---

## 2. Ownership

| Document | Owns | Does not own |
|---|---|---|
| [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) | Stages, stage semantics, universal evidence kinds, tutor / AI_OFF policy | Evaluator design rules that justify a claim |
| [`physics-model-schema.md`](./physics-model-schema.md) | `PhysicsModel` fields, `transferMode` enum meanings, official L1–L6 meanings | Whether an evaluator actually evidences those meanings |
| [`physics-model-quality-review.md`](./physics-model-quality-review.md) | WHETHER physics / pedagogy / implemented claims are justified | How to design the evaluator |
| [`physics-model-implementation-protocol.md`](./physics-model-implementation-protocol.md) | HOW a ready model becomes software | The evidence-justification rules used while writing evaluators |
| [`physics-representation-integrity-contract.md`](./physics-representation-integrity-contract.md) | Whether student-visible physics representations preserve quantity identity | Cognitive-claim justification |
| **This document** | HOW implementation evidence must justify a cognitive claim | Stage meanings, L-level meanings, Gate results, runtime schema, display grammar |

When documents disagree: Schema owns field and L-level meanings; UPLP owns stage meanings; this document owns evaluator / accumulator justification rules; Quality Review uses those rules to judge a running Scene.

Do not copy these rules into Scene UI code, UPLP, or L-level derivation.

---

## 3. Core distinctions

```text
Correct answer
  ≠ Correct reasoning
  ≠ Constructed model
  ≠ Successful transfer
  ≠ Independent model use
```

A later evidence level must never be inferred merely because an earlier one is present.

Stage completion is not mastery evidence.

Engineering tests prove implementation behavior, not educational effectiveness.

---

## 4. Principles

### Principle 1 — Evidence provenance

Critical independent reasoning must already exist in the committed response or committed structured state.

Post-check evidence may:

- confirm;
- challenge;
- expose distractors;
- check consistency;
- support reflection.

Post-check evidence **cannot** retroactively manufacture missing pre-commit independent reasoning.

Especially: `identifiesConditionOrBoundary`, work/relation flags, current-state flags, net-force / boundary flags, and equivalents must not become true only because a later checkbox was selected.

### Principle 2 — Relation over token presence

Presence of physics nouns, keywords, or phrase fragments is not sufficient evidence of a physical relation.

Not relational evidence by themselves:

```text
mass + temperature + energy
chemical energy
net force / 合力
motion / 运动
source / 来源
different / 情况不一样
```

Prefer bounded structured evidence plus relational authored evidence where the claim requires a relation.

Do **not** “fix” an evaluator by requiring more characters or a longer noun list. A noun sandwich is not a relation.

### Principle 3 — Evidence must match the cognitive claim

The accumulator must not promote evidence beyond what the student's actual action justifies.

| Claim | Typical flag | Must not be earned by |
|---|---|---|
| constructed a model | `constructedValidCausalModel` | EXPLAIN keywords; formula recitation alone unless the model truly is only that relation |
| transferred the model | `successfulTransfer` | valid MODEL alone; a correct relation for a different target |
| used the model independently | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | EXAM; TRANSFER; post-check-only reasoning; tutor-on independent work |

Official L1–L6 remain Schema-owned and are derived only by `deriveModelEvidenceLevel`. Scene code must not assign `"L4" | "L5" | "L6"`.

### Principle 4 — Target-specific transfer

Transfer evidence is evaluated against the actual transfer target (`targetId` or equivalent Scene-owned deterministic context).

A correct physics relation about a different case does not prove transfer to this case.

Where the target requires it, one coherent evidence unit is:

```text
target
  + initial / current state
  + condition
  + relation
  + consequence
```

### Principle 5 — Transfer-mode evidence semantics

Align with Schema `transferMode`. Do not redefine the enum.

| Mode | Student must evidence | Must not count as success |
|---|---|---|
| `full-model` | The relevant complete deep structure for **this** target | Any one core relation from another case; surface similarity |
| `partial-structure` | Which relations transfer **and** which do not | Isolated tokens; applying the complete source model blindly |
| `boundary-contrast` | The relevant condition / boundary and why ordinary application does not transfer unchanged | Generic “情况不一样”; condition without consequence; forcing a nonzero-case relation onto the boundary |

### Principle 6 — Stage completion is not mastery evidence

A learner may exit a stage without every action becoming evidence for a high cognitive level.

Do not make every interaction artificially difficult merely to prevent shortcuts.

Audit **which flags are produced**, not only whether the stage can exit.

EXAM completion must not create L6. EXPERIMENT closure records that the loop was performed, not that the model was understood.

### Principle 7 — Authorship floors are not understanding

Character count, non-empty text, or “any two Han characters” may establish that the learner authored something.

They do not establish physical understanding.

If semantic / relational evidence is required, it must come from separate deterministic evidence: structured selections, target-bound relations, or authored relational structure.

### Principle 8 — Structured UI is allowed but claim-bounded

Radios, relation boards, cards, and checkboxes are not automatically invalid evidence.

Their strength depends on the claim:

- recognition / constrained construction may be supported by structured UI;
- independent model use is not established by post-commit labeled recognition alone;
- a visible intended board may support L4 while leaving a named click-through risk.

Do not automatically require free-form essays. Do not treat structured click-through as automatically sufficient for every later claim.

---

## 5. Evidence provenance types

These are **normative implementation categories**. They are not a required universal session-schema migration.

| Type | What it is | May support | Must not support |
|---|---|---|---|
| `PRE_COMMIT_AUTHORED` | Student-written reasoning frozen at commit | Relational / boundary / independent-use claims when the text actually expresses the required structure | Understanding merely by length |
| `PRE_COMMIT_STRUCTURED` | Radios, boards, probes, judgments frozen at commit | Recognition and constrained model / transfer structure | Independent reasoning that the student never produced |
| `POST_COMMIT_CONFIRMATION` | Later checks, distractors, reflection | Confirm, reject, or refine an already-committed attempt | Missing pre-commit independent-model flags |
| `SYSTEM_DERIVED` | Accumulator flags and `deriveModelEvidenceLevel` | Official L1–L6 after valid flags | A new L-level invented in Scene code |
| `LLM_GENERATED` | Tutor text, model output, leaked answers | None as student evidence | Any official evidence flag or L-level |

`LLM_GENERATED` must never count as student evidence.

`POST_COMMIT_CONFIRMATION` must not independently establish AI_OFF reasoning that was absent pre-commit.

---

## 6. Weakest-pass test

Canonical adversarial question:

> What is the weakest student behavior that still produces this evidence flag?

For every important claim, attempt the probes that apply:

- answer-only;
- keyword-only;
- noun sandwich;
- generic long text / character-count floor;
- correct structured choices with meaningless authored text;
- wrong-target correct relation;
- surface matching;
- memorized slogan;
- post-check manufacture;
- stage completion without required reasoning.

Not every probe applies to every model.

If the weakest passing behavior is weaker than the claim, the claim is an overclaim. That is a Quality Review finding, judged with these rules.

---

## 7. Evidence claim trace

Use this trace when designing evaluators and when filling the Quality Review Evidence Claim Audit. It is the same audit, with provenance made explicit. It is not a second evidence engine.

```text
COGNITIVE CLAIM
  → REQUIRED STUDENT ACTION
  → RAW EVIDENCE
  → PROVENANCE
  → DETERMINISTIC EVALUATOR
  → ACCUMULATED FLAG
  → DERIVED LEVEL
  → WEAKEST PASS
  → KNOWN SHORTCUTS
  → REVIEW VERDICT
```

Design the evaluator **before** treating implementation as complete. Write adversarial tests for the weakest pass of each high claim (especially L4 / L5 / L6).

---

## 8. Evidence Claim Design

Evidence Claim Design is an **implementation activity**, not a lifecycle enum and not a Gate result.

Required production flow:

```text
canonical model
  → PRE Quality Review
  → Readiness Gate
  → Evidence Claim Design
  → implementation
  → adversarial evaluator tests
  → Engineering PASS
  → POST Quality Review
```

Before finishing evaluators, record for each high claim:

1. required student action;
2. raw evidence that will be stored;
3. allowed provenance;
4. what must fail (tokens, wrong target, generic text, post-check-only, answer-only);
5. which accumulator flag may be set;
6. which derived level that flag may support.

Do not add `evidence-claim-design` to `metadata.status`.

---

## 9. What this document must not do

- Change UPLP stages or stage semantics.
- Change L1–L6 meanings or `deriveModelEvidenceLevel`.
- Force every model into one UI grammar.
- Require essays or longer keyword lists as a substitute for relational evidence.
- Treat residual structured click-through as automatically blocking if it does not independently create false L5 / L6.
- Promote `metadata.status`.

---

## 10. Observed synthesis (Scenes 02–05)

These patterns were observed in repository POST reviews, then repaired where they independently created false L5 / L6. They are listed so a future model does not rediscover them.

| Pattern | Observed | After repair |
|---|---|---|
| Post-check recognition substituted for pre-commit independent reasoning | Scene 02, 03, 05 AI_OFF | Official independent flags come from committed material; post-check confirms |
| Token / noun sandwich treated as a relation | Scene 02 steam; Scene 03 transfer; Scene 05 ice / pots | Isolated tokens and noun sandwiches fail |
| Generic authored text / character count treated as understanding | Scene 02, 03, 05 | Length remains authorship only; generic “好好 / 情况不一样 / 我觉得这样不太对吧” fail high claims |
| Transfer not bound to the actual target | Scene 03 bicycle accepted an opposite-force relation | `targetId` binds the required relation |
| Partial / boundary transfer without transferable vs non-transferable structure | Scene 02 steam; Scene 05 ice | Required pair now demands that distinction |
| Structured UI confused with later claims | All four MODEL boards | Named residual L4 click-through; must not independently create L5 / L6 |
| Stage completion confused with mastery | EXAM exits; COMPLETE demonstrated copy | EXAM cannot create L6; COMPLETE remains evidence-bounded |

Scene 04 designed several of these floors before Gate B (`ρ = m/V` formula ≠ L4; same-material conclusion ≠ L6). Residual phrase-family and structured-click risks remain named leftovers, not high-claim violations.

---

## 11. Related prompts

- Implementation: [`prompts/implement-physics-model.md`](./prompts/implement-physics-model.md)
- Review: [`prompts/review-physics-model-quality.md`](./prompts/review-physics-model-quality.md)
