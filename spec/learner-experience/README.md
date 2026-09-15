# Learner Experience Script

> Kind: **EXPERIMENTAL DESIGN ARTIFACT**  
> Status: not canonical  
> Date: 2026-09-15  
> Decision: D069  
> Pilot Scenes: Scene 07 (`convex-lens-optical-bench`), Scene 02 (`four-stroke-engine`)

This folder is **not** a Source of Truth.

It sits between canonical learning architecture and implementation:

```text
Canonical sources
        ↓
Scene Learner Experience Script   ← this folder (experimental)
        ↓
Scene Interaction Plan / mapping
        ↓
UI / Runtime implementation
        ↓
Learner
```

If a Script conflicts with a canonical contract, **the canonical contract wins**.

Do not call this a universal experience standard. Do not claim LEARNER_VALIDATED.

---

## Purpose

Describe what the learner should actually **experience** while learning a Physics Model.

Design by asking:

- What is the learner thinking at this moment?
- What do they already know?
- What do they not yet know?
- Why are we asking them to do this?
- What should they notice?
- What should happen in the physical world?
- What meaning should this moment have?

Only after those questions should the experience map to software interaction.

The learner must not feel that they are filling fields required by the software.

---

## Ownership

| This folder owns | This folder does **not** own |
|---|---|
| Learner-moment sequence for a Scene | UPLP stage meanings |
| Subjective meaning of a moment | Physics Truth / official results |
| Grade-9 learner-facing experience intention | Physics Model Schema / Library |
| What the learner should feel, notice, and do | Evidence levels, L4–L6, provenance rules |
| Authoring principles for Scripts | AI_OFF permission, tutor policy |
| | Interaction Runtime / State contracts |
| | Interaction Shell freeze |
| | PRI quantity identity |
| | Scene DSL |

Canonical owners remain those listed in `spec/SPEC_ALIGNMENT_MANIFEST.md`.

Existing Scene student-experience files (for example Scene 02 `interaction-script.md`) are **not** deleted by this experiment. They remain Scene sitting. This Script is an overlay used to inspect and reshape learner-facing interaction language.

---

## Relationship to canonical contracts

Constrained by, and subordinate to:

- `PROJECT_BRAIN.md`
- `spec/universal-physics-learning-protocol.md`
- `spec/physics-model-schema.md`
- `spec/physics-model-library.md`
- `spec/evidence-design-contract.md`
- `spec/architecture/learner-interaction-runtime-contract.md`
- `spec/architecture/learner-interaction-state-contract.md`
- `spec/architecture/learner-interaction-runtime-audit.md`
- `spec/physics-representation-integrity-contract.md`
- AI / AI_OFF rules in UPLP
- relevant Scene / model specs

The Script must not:

- modify UPLP
- modify Physics Model Schema
- modify Interaction Runtime / State contracts
- authorize LLM use in AI_OFF
- invent a new transfer target, exam pattern, or independent challenge
- turn structured UI completion into evidence of model construction

---

## Non-goals

- Not a new architecture owner
- Not executable runtime logic
- Not a React / component specification
- Not a universal Interaction Shell
- Not AI-generated UI at runtime
- Not a claim that Scene 01–07 share one experience grammar
- Not learner validation

Do **not** specify React components, radio groups, textarea components, event handlers, state hooks, or implementation details in a Script.

---

## Moment schema

Each Scene is a sequence of **LEARNER MOMENTS**.

Each moment contains:

```text
Moment ID
Stage                         UPLP stage this moment lives in

Learner enters with
  - what the learner has already experienced
  - what the learner may know
  - what the learner may NOT know

Experience intention
  - why this moment exists cognitively

Learner should feel
  - the subjective meaning of the moment

Physical world
  - what is visible
  - what changes
  - what can be manipulated

System says
  - natural Grade-9 Chinese
  - short
  - conversational but not childish

Learner does
  - the meaningful learner action

System responds
  - what happens after the action
  - without unnecessary judgment

Evidence meaning
  - what this action MAY support
  - what it MUST NOT be interpreted as

Do not
  - answer leakage
  - forced reasoning
  - evaluator-language leakage
  - unnecessary repetition
  - UI ambiguity
```

One moment → one meaning. The four questions below should be obvious from the experience, not necessarily written as four sentences of UI copy:

- why I am here
- what I should do now
- what I should pay attention to
- what happens next

---

## Authoring principles

1. **Physics should be the hard part.** Bad difficulty is “这个页面让我干什么？”
2. **Do not force a cognitive state.** “我还不知道为什么” is valid when the learner does not yet know why.
3. **Wrong predictions are learning material.** Prediction is not an exam.
4. **Vocabulary is grounded in the world.** Show the thing, then name it, then give the minimum meaning needed now.
5. **Do not expose internal schema.** The learner describes meaningful physics, not the Physics Model’s storage tuple.
6. **UPLP should be felt, not seen as a workflow.** Internally OBSERVE → … → AI_OFF. The learner should feel looking, guessing, trying, noticing, asking why, finding a relation, trying a new context, recognizing an exam, then doing it alone.
7. **Do not copy another Scene’s interaction pattern** just because both follow UPLP. Spatial/optical relation ≠ temporal/causal/energy relation.

Scene 07 v1.1 adds **candidate** principles. They are not canonical cross-Scene contracts. Do not promote them until a structurally different Scene is audited.

8. **Concept Introduction Integrity (candidate).** No concept may appear as an explanatory premise before the learner has had a meaningful opportunity to ground it in physical experience. Canonical Physics Truth does not mean every canonical truth must be immediately exposed.
9. **Control Semantic Integrity (candidate).** The control must match answer logic. Single-select means only one option can be true under the question as written. Radio → checkbox is not an automatic repair if the stage requires construction.
10. **System Priming Risk (candidate evidence concern).** SYSTEM PROVIDED ≠ RECOGNIZED ≠ CONNECTED ≠ AUTHORED ≠ INDEPENDENT CONSTRUCTION. Do not teach the relation and then count a paraphrase as independent model construction.
11. **Reasoning Sufficiency Integrity (candidate).** If the learner has expressed enough physically valid reasoning for the **current** claim, do not block because canonical wording, extra model branches, or textbook tokens are missing. Local sufficiency ≠ whole-model coverage. Semantic flexibility must not become physics leniency. Scene 07 evidence only; not a universal contract.

Design-time concept states (not L-levels): UNSEEN → REFERENCED → GROUNDED → NAMED → USED. See `scene07-concept-ledger-v1.md`.

---

## Files

| File | Role |
|---|---|
| `scene07-learner-experience-v1.md` | Scene 07 Script v1 (historical) |
| `scene07-learner-experience-v1.1.md` | Scene 07 Script v1.1 (concept introduction + MODEL construction repair) |
| `scene07-concept-ledger-v1.md` | Scene 07 concept sequencing ledger (EXPERIMENTAL / SCENE-SCOPED) |
| `scene07-interaction-mapping-v1.md` | Scene 07 mapping v1 (historical) |
| `scene07-interaction-mapping-v1.1.md` | Scene 07 mapping v1.1 |
| `scene07-reasoning-sufficiency-audit-v1.md` | Scene 07 evaluator audit: local sufficiency vs model coverage (EXPERIMENTAL) |
| `scene02-learner-experience-v1.md` | Scene 02 Script |
| `contract-check-v1.md` | Phase 2: Script vs canonical contracts |
| `scene02-interaction-mapping-v1.md` | Phase 3: experience → interaction bridge |

Related, not in this folder:

- `spec/architecture/learner-experience-ai-compilation.md` — future authoring compiler; **DESIGN_ONLY**. Runtime LLM UI generation is forbidden.
- `spec/architecture/learner-workspace-layout.md` — layout-responsibility pilot (World / Task / Support). Not owned by this Script.

---

## Status labels this experiment must not claim

- `LEARNER_VALIDATED`
- `UNIVERSAL_EXPERIENCE_STANDARD`
- `UNIVERSAL_LEARNER_EXPERIENCE_STANDARD`
- `CONCEPT_LEDGER_STANDARD`
- `UNIVERSAL_MODEL_UI`
- `UNIVERSAL_SEMANTIC_EVALUATOR`
- `UNIVERSAL_REASONING_SUFFICIENCY_STANDARD`
- `AI_GENERATED_UI_READY`
- `CANONICAL` (for this folder)
