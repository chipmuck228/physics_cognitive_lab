# Physics Model Implementation Protocol

**Project:** `physics-cognitive-lab`  
**Version:** 0.1  
**Status:** Engineering contract  
**References:** Scene 02 (Four-stroke Engine) and Scene 03 (Horizontal Force Cart)

---

## Architecture Contract

This document answers:

> HOW does a canonical Physics Model become a production Scene?

It does **not** answer how students learn. That remains UPLP ownership.

| Document | Owns |
|---|---|
| [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) | HOW students learn: stages, stage semantics, evidence kinds, tutor permissions, hint ladder, AI_OFF |
| [`physics-model-schema.md`](./physics-model-schema.md) | WHAT a valid Physics Model contains |
| [`physics-model-library.md`](./physics-model-library.md) | WHICH models exist, IDs, families, inventory lifecycle |
| [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md) | Canonical C1–C14 IDs |
| [`physics-model-quality-review.md`](./physics-model-quality-review.md) | WHETHER physics, pedagogy, and learning-evidence claims are justified |
| [`evidence-design-contract.md`](./evidence-design-contract.md) | HOW implementation evidence must justify a cognitive claim |
| **This document** | HOW a ready model is implemented on the Universal Runtime |

Scene-specific specs instantiate the protocol. They must not redefine UPLP stages, hint semantics, L-level meanings, or canonical model IDs.

Reference implementations (do **not** infer the protocol from only one of these):

- **Reference A — Scene 02** `four-stroke-engine`  
  Primary model: `chemical-energy-internal-energy-mechanical-energy`  
  Structure: energy / causal chain
- **Reference B — Scene 03** `horizontal-force-cart`  
  Primary model: `force-changes-motion-state`  
  Structure: condition / relation board

Scene 01 (Microwave Bread) is a compatibility adapter with weaker historical gates. It is **not** the implementation template.

Default implementation request: [`prompts/implement-physics-model.md`](./prompts/implement-physics-model.md)

---

## 1. Goal

Move implementation from:

```text
model → many custom Cursor prompts
      → repeated architecture decisions
      → repeated manual review
```

to:

```text
canonical Physics Model
  → PRE Model Quality Review
  → readiness validation
  → Evidence Claim Design
  → standard implementation pipeline
  → adversarial evaluator tests
  → automated contract tests
  → POST Learning Evidence Review
```

The pipeline must never silently invent missing physics semantics.

---

## 2. Standard Implementation Pipeline

Never begin a new learning unit by building a page.

```text
Physics Model definition
  → PRE Model Quality Review
  → readiness gate
  → Evidence Claim Design
  → SceneDefinition
  → deterministic physics
  → evaluators
  → AssessmentOverlay
  → SceneAdapter
  → UPLP UI implementation
  → evidence accumulation
  → persistence
  → tutor context
  → adversarial evaluator tests
  → tests
  → E2E
  → POST Learning Evidence Review
  → implementation report
```

Evidence Claim Design is required before evaluator completion. It is owned by [`evidence-design-contract.md`](./evidence-design-contract.md). It is **not** a `metadata.status` value.

Default: **one implementation pass** covering ENTRY → COMPLETE.

Phased fallback is allowed only when a stop condition in §11 is true.

### 2.1 Physics Model

Use a Library ID. Do not invent an ID inside a Scene.

Content lives under `content/physics-models/<model-id>/`.

`energyRelations` is optional. Do not force an energy-chain structure onto a mechanics / condition model.

`modelEvaluator.requiredComponents` is a **model-owned map**, not a universal energy-conversion checklist.

### 2.2 Readiness

Run `validatePhysicsModelReadiness(model, sceneDefinition, overlay)` before writing UI.

Statuses: `NOT_READY` | `IMPLEMENTATION_READY` | `BLOCKED_BY_SCHEMA` | `BLOCKED_BY_RUNTIME` | `AMBIGUOUS_PHYSICS`

Stop on any status other than `IMPLEMENTATION_READY`. Return a blocker report. Do not invent workarounds.

### 2.2a Evidence Claim Design

Before writing production evaluators, design the evidence claims for MODEL, TRANSFER, EXAM, and AI_OFF against [`evidence-design-contract.md`](./evidence-design-contract.md).

Record required student action, raw evidence, allowed provenance, required failures, accumulator flag, and derived-level risk. Write adversarial weakest-pass tests for those claims.

Do not add a lifecycle enum for this step.

### 2.3 SceneDefinition

The model already declares `scenes[]`. The production Scene must use that identity:

- `id` → runtime `sceneId`
- exactly one `primaryModel`
- optional `secondaryModels` (supporting only; not a second MODEL task)
- `phenomenonId` must be an anchor or declared supporting phenomenon
- `physicsEngine` names a deterministic engine, not an LLM

Scene specs live under `spec/scenes/<scene-id>/` using the Scene 02/03 directory pattern.

### 2.4 Deterministic physics

Typed functions own:

- physical outcomes
- numerical / qualitative simulation state
- experimental measurements
- official correctness of deterministic calculations

The LLM must never decide these.

Add a discriminated `ScenePhysicsState` wrapper for the new Scene. That is adapter-owned physics, **not** a new top-level `LearningSession` field and **not** a universal `sceneId` branch in progression or tutor code.

### 2.5 Evaluators

Stage completion is deterministic and Scene-owned, then exposed through `SceneAdapter.completion`.

Keyword extractors are diagnostic signals only. They must not assign L1–L6.

### 2.6 AssessmentOverlay

`AssessmentOverlay` owns production answer semantics that the canonical schema does not yet represent:

- exam intended representation
- exam intended relation / model
- AI_OFF judgments (`correct: true` on the option, never array index)
- AI_OFF required vs distractor post-checks

`PhysicsModel` still owns identities, stems, `correctAnswer` for exam patterns, `requiredEvidence`, and `llmAllowed`.

Do not duplicate official answer keys inside React components. Do not use `options[0]` / `representationOptions[0]` as “the intended choice.”

### 2.7 SceneAdapter

Register one adapter. Universal progression resolves:

```ts
getSceneAdapter(sceneId).completion[stage](session)
```

The adapter also supplies:

- initial physics and `sceneData`
- `getTutorContext` / `looksLikeTutorLeak`
- `accumulateEvidence`
- `assessmentOverlay`
- `runExperiment` when experiments are Scene-run

Forbidden:

- `if (sceneId === "…")` in `lib/learning/progression.ts`
- `if (sceneId === "…")` in `lib/learning/tutor-request.ts` or `hooks/useTutor.ts`
- new top-level session fields such as `scene04Answers`

Scene-owned drafts live in `LearningSession.sceneData`.

### 2.8 UPLP UI implementation

Implement every default stage:

```text
ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT
  → EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE
```

Reuse `LearningShell`, stage chrome, and universal session persistence. Write Scene-owned copy, visuals, MODEL builder, and stage tasks.

Student-facing labels stay in the student-language registry / Scene copy. Do not expose Transfer, Evidence, AI_OFF, or L-levels as student vocabulary.

### 2.9 Evidence accumulation

```text
student action
  → raw attempt
  → deterministic evaluator
  → append-only evidence
  → Scene accumulateEvidence()
  → AccumulatedModelEvidence
  → deriveModelEvidenceLevel()
```

The Scene never writes `"L4"`, `"L5"`, or `"L6"`.

### 2.10 Persistence

Persist:

- physics state
- stage
- observations, descriptions, predictions, experiments, explanations
- model / transfer / exam / independent attempts (append-only)
- Scene drafts in `sceneData`
- first wrong EXAM attempt and first failed AI_OFF attempt
- COMPLETE / `session.completed`

Refresh during AI_OFF must restore the stage and remain tutor-blocked.

### 2.11 Tutor context

`SceneAdapter` owns the payload: learning goal, physics snapshot, prompt constraint, leak patterns.

Universal runtime owns permission, AI_OFF / COMPLETE hard block, request lifecycle, Zod validation, and guardrails.

### 2.12 Tests and E2E

See §9. Every learning-state transition and physics rule needs tests. At least one Playwright path must walk ENTRY → COMPLETE without mutating session state directly.

### 2.13 Implementation report

Use the report template in [`prompts/implement-physics-model.md`](./prompts/implement-physics-model.md).

---

## 3. Model Readiness Gate

A model must not enter automatic implementation unless required information exists.

### 3.1 Checklist

Check at least:

| Area | Required |
|---|---|
| Canonical model ID | Registered in the Library; kebab-case; not a Scene name |
| Title / core idea | Non-empty; core idea is the reusable structure, not a chapter title |
| Quantities or relevant model entities | At least one; causal endpoints must resolve |
| Relations | `causalRelations` required; `energyRelations` only if the model is an energy-conversion / transfer model |
| Conditions | At least one essential or important condition |
| Boundaries / counterexamples | At least one |
| Misconceptions | At least one, with diagnostic signals and interventions |
| Anchor phenomenon | `phenomena` includes `modelRole: "anchor"` |
| Experiments | At least one; each requires the UPLP five-part evidence kinds |
| Transfer targets | At least one; `full-model` / `partial-structure` / `boundary-contrast` used as the structure requires |
| Exam patterns | At least one canonical pattern with stem, options, `correctAnswer`, representation/model options |
| AI_OFF challenges | At least one; `llmAllowed === false` |
| Evaluator | Model-owned `requiredComponents` (do not require energy-chain keys) |
| AssessmentOverlay | Intended exam representation/model for the production exam set; judgments + post-checks for every independent challenge |
| Deterministic physics boundary | Named `physicsEngine`; outcomes must be code, not narrative |
| SceneDefinition | `primaryModel === model.id`; phenomenon exists; controllable/observable variables present |

Do **not** require:

- an energy chain
- Scene 02's four MODEL slots
- Scene 03's three-case relation board
- every library exam pattern in one sitting (production subset is an implementation choice, but overlay must cover the subset that will ship)

### 3.2 Statuses

```ts
type PhysicsModelReadinessStatus =
  | "NOT_READY"
  | "IMPLEMENTATION_READY"
  | "BLOCKED_BY_SCHEMA"
  | "BLOCKED_BY_RUNTIME"
  | "AMBIGUOUS_PHYSICS";
```

| Status | Meaning | Cursor action |
|---|---|---|
| `IMPLEMENTATION_READY` | Schema-valid, overlay covers production assessment, SceneDefinition matches, physics boundary named | One-pass implementation |
| `NOT_READY` | Missing content (overlay, scene match, completeness) that a human can still author without architecture change | Stop; list missing fields |
| `BLOCKED_BY_SCHEMA` | Fails `validatePhysicsModel` / Zod contract | Stop; do not invent schema fields in the Scene |
| `BLOCKED_BY_RUNTIME` | Would require UPLP weakening, a universal `sceneId` branch, LLM-owned physics/correctness, or new top-level session fields | Stop; blocker report |
| `AMBIGUOUS_PHYSICS` | Relations, MODEL representation, or energy-vs-mechanics structure conflict | Stop; do not guess the physics |

Severity order: schema > runtime > ambiguous physics > not ready > ready.

`implementation-ready` is this gate. It is **not** a `PhysicsModel.metadata.status` enum value. Metadata remains `draft | prototype | validated | production` (Schema semantics; Library current values).

### 3.3 Automation vs human review

Passing this gate means **engineering may start**. It does not certify physical truth, pedagogical validity, or learning efficacy.

---

## 4. Automation-Safe vs Review-Required

### 4.1 Automation-safe

Cursor may implement these from the protocol + ready model without inventing physics:

- wiring `SceneAdapter` and registry
- discriminated physics wrapper + `sceneData` drafts
- persistence registration / session restore
- standard `LearningShell` stage chrome
- append-only attempt history
- hard AI_OFF / COMPLETE tutor block (universal policy)
- Exam World sequencing (stem → representation → model → reveal options → answer → reasoning)
- commit-before-post-check AI_OFF shell
- COMPLETE terminal copy pattern (evidence-bounded; Scene fills the words)
- runtime contract tests
- standard E2E skeleton (ENTRY → COMPLETE, AI_OFF refresh, tutor failure nonblocking)
- leak-pattern wiring through the adapter

### 4.2 Review-required (do not silently invent)

A human / reasoning review must own:

- physical correctness of the deterministic rules
- model boundary and counterexamples
- causal / relational structure
- misconception validity
- experiment information value
- transfer structural validity (`full-model` vs `partial-structure` vs `boundary-contrast`)
- assessment validity (intended representation/model, distractors)
- whether the MODEL UI matches the model
- Grade 9 wording that could become scientifically misleading
- production exam subset choice when the library has more patterns than one sitting needs

If any of these are missing or contradictory, **stop**. Do not fill gaps from another Scene.

---

## 5. Scene Implementation Contract

Every production Scene must provide:

| Item | Owner |
|---|---|
| Scene ID | `SceneDefinition.id` / runtime `SceneId` |
| Primary Physics Model | exactly one Library ID |
| Optional secondary models | supporting only |
| Deterministic physics state | Scene physics module + discriminated wrapper |
| Scene-owned data | `LearningSession.sceneData` only |
| Stage evaluators | Scene learning modules → adapter `completion` |
| Evidence accumulator | adapter `accumulateEvidence` → `AccumulatedModelEvidence` |
| Tutor context | adapter `getTutorContext` / `looksLikeTutorLeak` |
| Misconception leak rules | adapter + `lib/ai/scene-tutor-leaks.ts` |
| AssessmentOverlay | model content, referenced by adapter |
| MODEL representation | model-owned UI (see §6) |
| Transfer implementation | canonical `transferTargets`; required pair is an implementation choice documented in the Scene spec |
| Exam implementation | canonical `examPatterns` + overlay; Exam World gating |
| AI_OFF implementation | canonical `independentChallenges` + overlay; hard no-AI |
| COMPLETE copy | evidence-bounded; no mastery / score-guarantee claims |
| Tests | physics, stage, overlay, L-derivation, persistence, E2E |

### 5.1 Forbidden

New Scenes must **not**:

- add universal `sceneId` branches in progression or tutor
- add Scene-specific top-level `LearningSession` fields
- let the LLM determine physics
- let the LLM determine official correctness
- assign L4 / L5 / L6 directly
- copy another Scene's MODEL UI when the model structure differs
- treat secondary models as extra MODEL tasks
- claim validated learning outcomes from passing tests
- expose internal stage IDs such as `AI_OFF` as student vocabulary

### 5.2 Suggested file layout

```text
content/physics-models/<model-id>/
spec/scenes/<scene-id>/
lib/physics/<scene>/
lib/learning/<scene>-*.ts
lib/runtime/adapters/<scene>.ts
lib/content/<scene>.ts
components/physics/<scene>/
components/learning/<Scene>Lab.tsx
components/learning/<Scene>*Task.tsx
hooks/use<Scene>LearningSession.ts
app/scenes/<scene-id>/page.tsx
tests/physics/<scene>/
tests/learning/<scene>-*.test.ts
tests/components/<scene>-lab*.test.tsx
tests/e2e/<scene>-happy-path.spec.ts
tests/e2e/<scene>-helpers.ts
```

---

## 6. MODEL Representation Rule

MODEL UI is **model-owned presentation**.

Universal Runtime must not prescribe one MODEL visual grammar.

| Reference | Deep structure | MODEL UI |
|---|---|---|
| Scene 02 | chemical energy → internal energy / state → work → mechanical energy | energy / causal chain |
| Scene 03 | current motion state + net-force condition / direction → motion-state change | condition / relation board |
| Scene 04 (model ready, UI not built) | mass and volume → density as ratio ρ = m / V | ratio / quantitative table |

Copying Scene 02's four-slot chain onto Scene 03 would have taught the wrong ontology. The reverse is equally wrong. Copying either onto density would teach the wrong ontology again.

### 6.1 Choosing a representation

Infer from the model, not from the last Scene you implemented:

- If `energyRelations` exist and the core idea is a conversion / transfer chain → chain / flow UI is a candidate.
- If the core idea is a condition–relation (force vs motion, equilibrium, …) → board / case / relation UI is a candidate.
- If the core idea is a ratio / quantitative definition (density ρ = m / V, later density-like models) → comparison table / ratio board is a candidate.
- Other structures (measurement procedure, circuit topology, ray diagram) need their own grammar.

If the representation is not obvious, status is `AMBIGUOUS_PHYSICS`. Stop.

### 6.2 Pedagogical composite nodes

Grade 9 UI may group canonical quantities for readability.

Scene 02 example: the node “工作气体的内能/状态” is a pedagogical composite. It must not silently merge canonical quantities or relations in the Physics Model.

Rule:

> Pedagogical composites are allowed when documented in the Scene spec. They must not change the canonical ontology.

---

## 7. Evidence Contract

### 7.1 Standard path

```text
student action
  → raw attempt (typed, append-only)
  → deterministic evaluator (Scene / model)
  → session evidence arrays / sceneData drafts
  → adapter.accumulateEvidence(session)
  → AccumulatedModelEvidence
  → deriveModelEvidenceLevel(evidence)
```

Official L1–L6 meanings are owned by `physics-model-schema.md`. Derivation lives in `lib/physics-models/evidence.ts`. How those flags must be justified is owned by [`evidence-design-contract.md`](./evidence-design-contract.md).

### 7.2 Stage vs floor (do not collapse these)

| Evidence | May support | Must not |
|---|---|---|
| OBSERVE + DESCRIBE | L1 (`observedPhenomenon`) | Complete later stages |
| Identifying quantities | L2 | Substitute for MODEL |
| Identifying relations (EXPLAIN signals) | L3 | Write L4 |
| **EXPLAIN** | Causal preparation | **EXPLAIN ≠ L4** |
| Valid MODEL construction | L4 (`constructedValidCausalModel`) | Write `"L4"` in Scene code |
| MODEL + required TRANSFER success | L5 (`successfulTransfer`) | One accepted transfer if the Scene requires a pair |
| EXAM structured attempts | Exam-representation evidence | **EXAM alone does not create L6** |
| Both required AI_OFF challenges + `llmUsed === false` + prior L5 | L6 | Answer-only; tutor-assisted independent work |

L6 may be derived only when:

- L5 evidence already exists (`constructedValidCausalModel` and `successfulTransfer`)
- independent AI_OFF success is true
- `llmDisabledDuringIndependent` is true

### 7.3 Naming

Evidence names must not claim more than the observation proves.

Bad: `masteredForceModel`, `guaranteedTransfer`.

Good: `constructedValidCausalModel`, `successfulTransfer`, `independentAiOffSuccess`.

Keyword overlap is a signal, not mastery.

Retries append. First wrong EXAM / first failed AI_OFF remain.

---

## 8. Standard AI Contract

### 8.1 Ownership

| Owner | Responsibility |
|---|---|
| SceneAdapter | Tutor context, leak patterns, learning goal, physics snapshot |
| Universal Runtime | Permission (`STAGE_TUTOR_POLICY`), `isTutorHardBlocked`, `/api/tutor`, Zod, guardrails |
| LLM | Language only |
| Student | Target cognitive action at the current stage |

### 8.2 LLM may

- ask
- hint (H1–H5 remain UPLP-owned)
- challenge
- encourage
- reflect / request comparison

within the actions allowed for the current UPLP stage.

### 8.3 LLM may not

- decide physical truth
- decide official correctness (exam, experiment, AI_OFF, MODEL validity)
- advance stages
- write mastery levels
- operate in AI_OFF or COMPLETE
- perform the student's current target action (reveal PREDICT results, write the MODEL, name the shared TRANSFER model immediately, etc.)

### 8.4 AI_OFF

Hard boundary:

- no TutorPanel
- no tutor fetch
- API route remains 403
- refresh keeps the hard block
- no hints, model reminders, or step-by-step scaffolding
- no LLM grading

Per challenge:

```text
independent response → own reasoning → commit (read-only)
  → structured post-check
```

Post-check may verify evidence. It must never rewrite the committed response. Post-check confirmation must not manufacture missing pre-commit independent reasoning. See [`evidence-design-contract.md`](./evidence-design-contract.md) Principle 1.

Passing requires correct overlay judgment, authored reasoning, required relation/condition evidence, no forbidden misconception/distractor, and `llmUsed === false`. Answer-only must not pass. Text length is authorship/completeness at most, never understanding.

### 8.5 AI failure

Tutor API failure must remain nonblocking. The student can continue with deterministic interactions. Do not show provider errors.

---

## 9. Standard Test Contract

Do not build a large testing framework yet. Copying Scene 02/03 tests is acceptable if the **checks** below exist. Prefer extracting helpers only when a third Scene would otherwise triplicate logic.

### 9.1 Required checks

**Deterministic physics**

- same input → same output
- LLM is not on the physics path

**Stages**

- completion gates are semantic, not “any non-empty text”
- prediction is committed before the matching intervention
- each required experiment closes the five-part loop: prediction, intervention, observed result, prediction vs result, reflection
- retries are append-only

**MODEL**

- structural validity against **this** model's `requiredComponents`
- not an imported energy-chain checklist unless this model is an energy chain

**TRANSFER**

- structural validity against `transferMode`
- target-specific relation; a correct relation for another case fails
- required production pair documented (Scene 02: full-model + partial-structure; Scene 03: full-model + boundary-contrast)
- TRANSFER cannot set L6
- adversarial weakest-pass tests from [`evidence-design-contract.md`](./evidence-design-contract.md)

**EXAM**

- Exam World gating: final options hidden until representation/model work
- answer and reasoning stored separately
- first wrong attempt preserved
- deterministic grading; tutor cannot override correctness
- EXAM completion ≠ L6

**AI_OFF**

- zero tutor actions / zero tutor network requests
- refresh remains hard blocked
- commit before post-check; post-check cannot rewrite the first response
- post-check cannot manufacture missing pre-commit independent reasoning
- answer-only fails
- misconception-containing reasoning fails
- both required challenges
- `llmUsed === false`
- L6 only through accumulator → `deriveModelEvidenceLevel`

**COMPLETE**

- terminal (`nextStage` is null)
- no tutor
- wording is evidence-bounded

**Architecture**

- no universal progression `sceneId` branch
- no universal tutor `sceneId` branch
- Scene does not assign L4/L5/L6
- AssessmentOverlay owns official assessment semantics

**Persistence / failure**

- restore mid-loop
- AI_OFF refresh still blocked
- tutor failure before AI_OFF is nonblocking

**E2E**

- ENTRY → COMPLETE without mutating session state
- at least the AI_OFF refresh and tutor-failure cases above

### 9.2 Reuse before inventing a framework

Existing seeds to extend, not replace:

- `tests/runtime/universal-scene-runtime.test.ts` — adapter lookup, no progression switch
- `lib/physics-models/evidence.ts` + model tests — L-level derivation
- `tests/e2e/engine-helpers.ts` and `tests/e2e/cart-helpers.ts` — E2E skeletons to imitate
- Scene exam / AI_OFF unit tests — overlay-driven grading pattern

Helpers worth extracting later (not in this protocol's implementation):

- Exam World step machine assertions
- AI_OFF commit/post-check assertions
- append-only history assertions
- “no `sceneId ===` in progression/tutor” grep test

---

## 10. Standard Cursor Prompt

Use [`prompts/implement-physics-model.md`](./prompts/implement-physics-model.md) as the default future request.

Parameters: `MODEL_ID`, `SCENE_ID`.

The prompt instructs Cursor to:

1. run readiness
2. stop on true architecture / physics ambiguity
3. implement the complete Scene when ready
4. run tests
5. produce the standardized report

One pass is the default. Phased fallback only for §11 / prompt fallback cases.

---

## 11. Stop Conditions

Cursor must **STOP** and return a blocker report rather than invent a workaround if implementation would require:

- a new universal `sceneId` branch in progression or tutor
- weakening UPLP (stage order, hint semantics, AI_OFF, tutor permissions)
- changing L-level semantics
- LLM-owned physics
- LLM-owned official correctness
- new Scene-specific top-level `LearningSession` fields
- silently changing canonical Physics Model semantics
- copying an incompatible MODEL representation
- adding a canonical model ID that is not in the Library
- promoting overlay answer keys into schema fields without an explicit schema change request
- marking the model `validated` because tests passed

Blocker report must include: status, missing, blockers, warnings, and the smallest human decision needed to unblock.

---

## 12. Model Lifecycle

Lifecycle **semantics** are owned by [`physics-model-schema.md`](./physics-model-schema.md) §20.  
This protocol owns the **implementation pipeline**. It does not invent new `metadata.status` values.

```text
draft
  → PRE Quality Review
  → Readiness                         ← this protocol / validatePhysicsModelReadiness
  → Evidence Claim Design             ← implementation activity, not a status
  → Implementation
  → Engineering PASS                  ← engineering-complete implementation
  → POST Quality Review PASS / PASS_WITH_REFINEMENTS
  → prototype                         ← Library inventory write after POST
  → future Learner Validation
  → validated
  → future production decision
  → production
```

`implementation-ready` is this gate. It is **not** a `PhysicsModel.metadata.status` value.

| Pipeline / review result | Means | Writes `metadata.status`? |
|---|---|---|
| `MODEL_QUALITY_PASS` | Gate A judged the model worth implementing | No. Remains `draft`. |
| `IMPLEMENTATION_READY` | Enough information to implement safely | No. Remains `draft`. |
| Engineering PASS | **engineering-complete implementation** | No. Remains `draft`. |
| `LEARNING_EVIDENCE_PASS` or `PASS_WITH_REFINEMENTS` | **quality-reviewed prototype** | Eligible for Library `prototype`. |
| `BLOCKED` / `OVERCLAIM` / `SHORTCUT_FOUND` | POST did not authorize prototype | No. Remains `draft`. |
| future Learner Validation | Real learner evidence | Eligible for `validated` only then. |

Do **not** mark a model `validated` because tests pass.  
Do **not** call Engineering PASS “prototype-level engineering”.

Scene 02 and Scene 03 are quality-reviewed prototypes after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Neither is learner-validated.

---

## 13. Readiness Automation

Smallest useful validator:

```ts
validatePhysicsModelReadiness(
  model: PhysicsModel,
  sceneDefinition: SceneDefinition,
  overlay?: AssessmentOverlay,
): {
  status: PhysicsModelReadinessStatus;
  missing: ReadinessIssue[];
  blockers: ReadinessIssue[];
  warnings: ReadinessIssue[];
}
```

Implemented in `lib/physics-models/readiness.ts`.

It reuses `validatePhysicsModel`. It does not become a second schema. It does not certify pedagogy.

---

## 14. What Scene 02 and Scene 03 jointly proved

- Universal Runtime + `SceneAdapter` can host structurally different models.
- AssessmentOverlay can carry exam/AI_OFF semantics without schema expansion.
- Adapter-owned tutor context removes universal `sceneId` tutor branches.
- `sceneData` is sufficient for Scene drafts.
- L4/L5/L6 can stay derived.
- MODEL UI must follow the model, not the previous Scene.
- A full UPLP loop is implementable without changing UPLP.

Remaining debt (not blockers for this protocol):

- Scene 01 still uses a compatibility adapter and microwave-shaped copy in shared stage prompts/footers.
- Exam/AI_OFF draft storage differs slightly between Scene 02 (`events`) and Scene 03 (`sceneData`). New Scenes should use `sceneData`.
- Overlay fields are not yet in `physics-model-schema.md` (intentional; D024).

---

## 15. Cursor required reading (implementation)

```text
1. PROJECT_BRAIN.md
2. spec/SPEC_ALIGNMENT_MANIFEST.md
3. spec/universal-physics-learning-protocol.md
4. spec/physics-model-schema.md
5. spec/physics-model-library.md
6. spec/cognitive-action-taxonomy.md (if assessment / C-IDs involved)
7. this protocol
8. the concrete Physics Model
9. spec/scenes/<scene-id>/ (if it exists)
10. DECISION_LOG.md
```
