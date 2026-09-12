# Standard Cursor prompt — implement a Physics Model Scene

**Use this file as the default implementation request.**  
Do not write a custom per-stage prompt unless a fallback case below applies.

Fill in:

```text
MODEL_ID = <canonical Physics Model id from spec/physics-model-library.md>
SCENE_ID = <SceneDefinition.id / runtime sceneId>
```

Optional:

```text
PRODUCTION_EXAM_PATTERN_IDS = <subset of model.examPatterns, or ALL>
REQUIRED_TRANSFER_IDS = <production transfer pair, or DEFAULT from Scene spec>
```

Then paste the rest of this document as the Cursor task.

---

## Mission

Implement a complete production Scene for `MODEL_ID` / `SCENE_ID` on the Universal Runtime.

The Scene must run the full UPLP loop:

```text
ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT
  → EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE
```

Default: **one implementation pass**, not a prompt per stage.

This is not a request to change UPLP, the Physics Model schema, L-level semantics, or Scene 01/02/03 student-visible behavior.

---

## Required reading (in order)

1. `PROJECT_BRAIN.md`
2. `spec/SPEC_ALIGNMENT_MANIFEST.md`
3. `spec/physics-model-quality-review.md`
4. `spec/evidence-design-contract.md`
5. `spec/universal-physics-learning-protocol.md`
6. `spec/physics-model-schema.md`
7. `spec/physics-model-library.md`
8. `spec/cognitive-action-taxonomy.md` when cognitive actions or assessment are involved
9. `spec/physics-model-implementation-protocol.md`
10. the concrete model under `content/physics-models/<MODEL_ID>/`
11. `spec/scenes/<SCENE_ID>/` if it exists
12. `DECISION_LOG.md`

Do not infer architecture from UI code alone.  
Do not infer the MODEL UI from Scene 02 or Scene 03 until you have compared both against **this** model's structure.

Reference implementations:

- Scene 02 — energy / causal chain (`chemical-energy-internal-energy-mechanical-energy`)
- Scene 03 — condition / relation board (`force-changes-motion-state`)

Copy structure only when it matches. Never copy an incompatible MODEL builder.

---

## Step 0 — PRE Quality Review

A new production model must have a Gate A result of `MODEL_QUALITY_PASS` or `MODEL_QUALITY_PASS_WITH_REFINEMENTS` before implementation. Use `spec/prompts/review-physics-model-quality.md` with `MODE=PRE`.

If Gate A is blocked, **STOP**. Do not implement. Do not invent missing physics or pedagogy.

`MODEL_QUALITY_PASS` is not `IMPLEMENTATION_READY`. Continue to Step 1.

---

## Step 1 — Readiness

Run:

```ts
validatePhysicsModelReadiness(model, sceneDefinition, overlay)
```

Use the SceneDefinition whose `id === SCENE_ID`.  
Use the model's AssessmentOverlay.

If status is not `IMPLEMENTATION_READY`, **STOP**. Produce the blocker report in the Output section. Do not implement UI. Do not invent missing physics, overlay answers, or schema fields.

---

## Step 1.5 — Evidence Claim Design

Before writing production evaluators, design MODEL / TRANSFER / EXAM / AI_OFF evidence against `spec/evidence-design-contract.md`.

For each high claim record:

- required student action;
- raw evidence;
- allowed provenance (`PRE_COMMIT_*` vs `POST_COMMIT_CONFIRMATION`);
- required failures (answer-only, tokens, noun sandwich, generic text, wrong-target relation, post-check manufacture);
- accumulator flag and derived-level risk.

Write adversarial weakest-pass tests for those claims before treating implementation as complete.

Evidence Claim Design is an implementation activity. Do **not** add it to `metadata.status`.

---

## Step 2 — Implement when ready

Follow the pipeline in `spec/physics-model-implementation-protocol.md`:

Physics Model (already exists)  
→ Evidence Claim Design  
→ SceneDefinition  
→ deterministic physics  
→ evaluators  
→ AssessmentOverlay (already exists if ready)  
→ SceneAdapter  
→ UPLP UI  
→ Physical Representation Integrity check (`spec/physics-representation-integrity-contract.md`; new Scene only, do not audit Scene 01–05)  
→ evidence accumulation  
→ persistence  
→ tutor context  
→ tests  
→ E2E  
→ report

Preserve:

- UPLP
- Universal Runtime
- Scene 01/02/03 behavior
- adapter-owned tutor context
- append-only evidence
- derived L-level semantics
- no Scene-specific branch in universal progression / tutor
- no new LearningSession top-level Scene fields (`sceneData` only)

### Physics

Typed deterministic functions only. LLM must not decide outcomes, measurements, or official correctness.

Add a discriminated physics wrapper. Register the adapter. Do not add `if (sceneId === SCENE_ID)` to `lib/learning/progression.ts`, `lib/learning/tutor-request.ts`, or `hooks/useTutor.ts`.

### Physical representation

After the physics view exists, check student-visible quantities against `spec/physics-representation-integrity-contract.md`. Bind values to official runtime functions. Do not put ΔT and T (or this Scene's analogous pair) on opposite ends of one arrow. Scene 05 PRI-05-01 is the worked example. Do not open a full PRI audit of older Scenes.

### MODEL UI

Choose a representation from **this** model's relations:

- energy conversion / transfer chain → chain UI (Scene 02 pattern)
- condition / relation (force–motion, equilibrium, …) → board / case UI (Scene 03 pattern)
- anything else → stop if the grammar is genuinely new (fallback below)

Pedagogical composite nodes are allowed only if documented and they do not change the canonical ontology.

### EXAM

Canonical exam patterns. Exam World sequence:

```text
stem → identify representation → choose learned relation
  → reveal final options → submit answer → submit reasoning
```

Final options stay hidden until the representation/model steps are done.  
Answer and reasoning stored separately.  
Deterministic scoring only. Overlay owns intended representation/model.  
EXAM completion must not create L6.

### AI_OFF

Canonical independent challenges. Hard no-AI boundary.

Per challenge: independent response → own reasoning → commit → structured post-check.  
Committed response is read-only before post-check. Post-check must not rewrite it.  
Critical independent reasoning must exist pre-commit. Post-check may confirm; it must not manufacture missing independent-model flags.

Passing requires correct judgment, authored reasoning, required evidence, no forbidden misconception/distractor, and `llmUsed === false`. Answer-only must not pass.

### L6

Derived only by `accumulateEvidence` → `deriveModelEvidenceLevel`.  
Requires existing L5 evidence, required AI_OFF success, and no AI.  
Scene code must not assign `"L4"`, `"L5"`, or `"L6"`.

### COMPLETE

Terminal. Evidence-bounded wording. No tutor. No mastery / guaranteed-score claims.

---

## Step 3 — Tests

Add physics, stage, overlay, evidence, persistence, architecture, and Playwright tests from the test contract in the implementation protocol.

E2E must walk ENTRY → COMPLETE without mutating session state.

Also test:

- refresh during AI_OFF remains blocked
- zero tutor requests from AI_OFF onward
- tutor API failure before AI_OFF remains nonblocking

Run:

- Vitest
- Playwright for Scene 01, Scene 02, Scene 03, and the new Scene
- `npx tsc --noEmit`

Do not mark the model `validated` because tests pass. An Engineering PASS is an **engineering-complete implementation** and stays `draft`. Do not write `metadata.status = "prototype"` from this prompt. That write is inventory finalization after POST `LEARNING_EVIDENCE_PASS` or `PASS_WITH_REFINEMENTS`.

---

## Fallback (phased implementation)

Stay on one pass unless one of these is true:

- a runtime or schema change is required
- physics / MODEL representation is ambiguous
- the model introduces a genuinely new interaction grammar
- tests expose a protocol violation that cannot be fixed inside the Scene

Then implement the smallest slice that preserves UPLP, document the stop, and do not silently weaken gates.

---

## Stop conditions (hard)

STOP and return a blocker report if implementation would require:

- a new universal `sceneId` branch
- weakening UPLP
- changing L-level semantics
- LLM-owned physics
- LLM-owned official correctness
- new Scene-specific top-level LearningSession fields
- silently changing canonical Physics Model semantics
- copying an incompatible MODEL representation
- inventing a Library model ID
- treating test pass as educational validation

---

## Output

### If blocked

```text
Status: NOT_READY | BLOCKED_BY_SCHEMA | BLOCKED_BY_RUNTIME | AMBIGUOUS_PHYSICS
Missing:
Blockers:
Warnings:
Smallest human decision needed:
Scene implemented: NO
```

### If implemented

A. files created  
B. files modified  
C. readiness result  
D. MODEL representation chosen and why  
E. EXAM tasks / overlay usage  
F. AI_OFF challenges / deterministic evaluation  
G. L4 / L5 / L6 derivation (Scene does not assign levels)  
H. COMPLETE wording  
I. persistence  
J. architecture checks (no universal sceneId branch; no new top-level session fields)  
K. Vitest  
L. Playwright  
M. typecheck  
N. remaining runtime debt  
O. remaining model / spec questions  

Explicit confirmations:

```text
Complete ENTRY→COMPLETE: YES/NO
Universal progression branch added: NO
Universal tutor branch added: NO
Scene directly assigns L4/L5/L6: NO
EXAM completion creates L6: NO
Tutor available in AI_OFF: NO
LLM decides official correctness: NO
Model marked validated because tests passed: NO
PRE quality review skipped: NO
```

Engineering completion is not Gate B. After this prompt, run `spec/prompts/review-physics-model-quality.md` with `MODE=POST`. A POST `PASS` or `PASS_WITH_REFINEMENTS` makes a quality-reviewed prototype eligible for `metadata.status = "prototype"`. It still does not mark the model learner-validated.
