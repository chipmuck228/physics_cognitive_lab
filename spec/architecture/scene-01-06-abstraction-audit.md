# Scene 01–06 Abstraction Audit

> Date: 2026-09-12  
> Kind: architecture discovery only  
> Authority used: production Scenes 01–06, adapters, evaluators, Physics Models, Universal Runtime  
> Not: refactor, schema implementation, database, Scene 07, UPLP change, evidence-semantics change, PRI change, L1–L6 change

Six quality-reviewed prototypes now exist (`metadata.status = prototype`).  
This document classifies **what the code actually does**. It does not authorize a renderer, a DSL implementation, or a seventh Scene.

Decision: `DECISION_LOG.md` D058.

---

## Lifecycle context

| Scene | ID | Primary model | POST | Status after D057 |
|---|---|---|---|---|
| 01 | `microwave-bread` | `energy-internal-energy-temperature` | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |
| 02 | `four-stroke-engine` | `chemical-energy-internal-energy-mechanical-energy` | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |
| 03 | `horizontal-force-cart` | `force-changes-motion-state` | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |
| 04 | `equal-volume-material-samples` | `density-mass-volume` | `LEARNING_EVIDENCE_PASS` (worked example) | prototype |
| 05 | `equal-mass-heated-samples` | `specific-heat-capacity` | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |
| 06 | `simple-resistor-circuit` | `ohms-law` | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` + authored-evidence probe | prototype |

None is learner-validated. None is `production`.

---

## Method

Inspected for every production Scene:

- `app/scenes/*/page.tsx`
- top-level `*Lab.tsx`
- stage task components
- `SceneDefinition` in each `content/physics-models/*/model.ts`
- `lib/runtime/adapters/*`
- physics engines / `physics-boundary.ts` / official functions
- representation components
- `lib/learning/{scene}-*.ts` evaluators
- `accumulate*SceneEvidence` → `deriveModelEvidenceLevel`
- tutor: `getTutorContext`, `looksLike*TutorLeak`, `STAGE_TUTOR_POLICY`
- transfer / exam / AI_OFF
- tests

Classification codes:

| Code | Meaning |
|---|---|
| UNIVERSAL_RUNTIME | Shared loop, session, progression, tutor policy, L-level derivation |
| DECLARATIVE_DATA | Content already in data files; runtime may or may not load it |
| PHYSICS_PLUGIN | Student-visible representation family |
| DETERMINISTIC_PHYSICS | Official numbers / state transitions |
| EVALUATOR_PRIMITIVE | Reusable validation / relation / provenance pattern |
| SCENE_SPECIFIC_ACCIDENTAL | Could be shared or data, but is copied per Scene |
| SCENE_SPECIFIC_ESSENTIAL | Must stay code: physics, geometry, nontrivial evaluator |
| UNCLEAR | Mixed or unused at runtime |

---

## A. Scene-by-scene classification matrix

Classes below are **dominant class of the behavior**, not every line.

### Scene 01 — `microwave-bread`

| Behavior / file family | Class | Evidence |
|---|---|---|
| `page.tsx` | UNIVERSAL_RUNTIME | Thin route → lab |
| `MicrowaveBreadLab` stage switch + inlined OBSERVE/PREDICT/EXPERIMENT | SCENE_SPECIFIC_ACCIDENTAL | Other Scenes extract `*Task`; same UPLP switch |
| `useLearningSession` | SCENE_SPECIFIC_ACCIDENTAL | Same save/evaluate/advance pattern as later hooks |
| `MicrowaveScene` / `Bread` / `TemperatureDisplay` / `simulateHeating` | DETERMINISTIC_PHYSICS + PHYSICS_PLUGIN | Continuous heating; `energyInputJ = powerW × time` |
| `MicrowaveDescribeTask` / `MicrowaveModelBoard` | PHYSICS_PLUGIN | Energy-state chain + object/quantity/change |
| `lib/content/microwave-bread.ts` | DECLARATIVE_DATA | Copy, options, probes |
| `content/physics-models/energy-internal-energy-temperature/*` | DECLARATIVE_DATA | Model, overlay, transfer, exam |
| `evaluateMicrowave*` | EVALUATOR_PRIMITIVE + SCENE_SPECIFIC_ESSENTIAL | Option IDs + ice-boundary authored text |
| `microwave-text.ts` | EVALUATOR_PRIMITIVE | Noun-sandwich / slogan filters |
| `accumulateMicrowaveSceneEvidence` | EVALUATOR_PRIMITIVE | Same 7 flags as all Scenes |
| `microwaveBreadAdapter` | UNIVERSAL_RUNTIME | Wiring; no `runExperiment` |
| `PredictionPanel` | SCENE_SPECIFIC_ACCIDENTAL | Nominally shared; imports Scene 01 `PREDICTION_OPTIONS` |
| `describe.ts` (legacy) | SCENE_SPECIFIC_ACCIDENTAL | Superseded by `microwave-describe.ts` |

`SceneDefinition` exists on the model. Runtime does not load `experimentOperations` / `physicsEngine` / `targetEvidence`.

### Scene 02 — `four-stroke-engine`

| Behavior / file family | Class | Evidence |
|---|---|---|
| `FourStrokeEngineLab` + `useEngineLearningSession` | SCENE_SPECIFIC_ACCIDENTAL | Extracted stage tasks; same shell |
| `FourStrokeEngine` SVG + geometry + playback | DETERMINISTIC_PHYSICS + PHYSICS_PLUGIN | Mechanism animation; `runEngineCycle` |
| `runCombustionDisabledExperiment` / locked piston | DETERMINISTIC_PHYSICS | Counterfactual engines |
| `EngineModelBuilder` | PHYSICS_PLUGIN | Energy-chain slot builder |
| `EngineDescribeTask` snapshots | SCENE_SPECIFIC_ESSENTIAL | Mini-engines bound to `getStrokeState` |
| `EngineExamStrokeDiagram` | PHYSICS_PLUGIN | Exam-world diagram |
| Dual-experiment A-then-B | SCENE_SPECIFIC_ESSENTIAL | `canRunEngineExperiment` |
| `evaluateEngineModelStructure` / `extractCausalSignals` | SCENE_SPECIFIC_ESSENTIAL | Slot order + work link |
| `hasOwnWords` in `engine-describe.ts` | EVALUATOR_PRIMITIVE | Imported by later Scenes |
| Exam / AI_OFF task shells | SCENE_SPECIFIC_ACCIDENTAL | Same 3-step / 2-step machines as Scene 01 |
| Model package + `lib/content/four-stroke-engine.ts` | DECLARATIVE_DATA | Copy, nodes, experiment IDs |

### Scene 03 — `horizontal-force-cart`

| Behavior / file family | Class | Evidence |
|---|---|---|
| Lab + session hook + `Cart*Task` shells | SCENE_SPECIFIC_ACCIDENTAL | Template for Scenes 04–06 |
| `HorizontalForceCart` + `stepCart` | DETERMINISTIC_PHYSICS + PHYSICS_PLUGIN | Qualitative force/motion; `SpeedTick 0–3` |
| `CartModelBoard` | PHYSICS_PLUGIN | Three-case force/motion relation board |
| `CartExamForceDiagram` | PHYSICS_PLUGIN | Arrow-diagram exam representation |
| `evaluateCartModelStructure` | SCENE_SPECIFIC_ESSENTIAL | Rejects `energy-chain-shape` |
| Observed-result schema (same/opposite/zero) | SCENE_SPECIFIC_ESSENTIAL | Not a generic experiment form |
| `lib/content/horizontal-force-cart.ts` + model package | DECLARATIVE_DATA | Options, relations, overlay |
| `accumulateCartSceneEvidence` | EVALUATOR_PRIMITIVE | 7-flag template |

### Scene 04 — `equal-volume-material-samples`

| Behavior / file family | Class | Evidence |
|---|---|---|
| Lab + hook + stage shells | SCENE_SPECIFIC_ACCIDENTAL | Near-clone of Scene 03 |
| `EqualVolumeSamples` + `densityGPerCm3` / `applyCutFactor` | DETERMINISTIC_PHYSICS + PHYSICS_PLUGIN | Sample comparison |
| `SamplesRatioBoard` | PHYSICS_PLUGIN | Ratio-quantitative `m ÷ V = ρ` |
| `SamplesExamTable` | PHYSICS_PLUGIN | Table exam representation |
| `evaluateSamplesModelStructure` | SCENE_SPECIFIC_ESSENTIAL | Cut invariance; rejects force-board and energy-chain |
| Model package + `lib/content/equal-volume-material-samples.ts` | DECLARATIVE_DATA | Already names `MODEL_REPRESENTATION_KIND: "ratio-quantitative"` |
| `QuestionGroup` / `ValidationMessage` | UNIVERSAL_RUNTIME | Shared chrome used here and Scene 06 |

### Scene 05 — `equal-mass-heated-samples`

| Behavior / file family | Class | Evidence |
|---|---|---|
| Lab + hook + stage shells | SCENE_SPECIFIC_ACCIDENTAL | Same template |
| `officialTemperatureChangeC` / heat catalogs | DETERMINISTIC_PHYSICS | Official ΔT; phase-change guard |
| `EqualMassHeatedSamples` | PHYSICS_PLUGIN | Thermal comparison; PRI-05-01 worked example |
| `HeatProductBoard` | PHYSICS_PLUGIN | Product `c × m × ΔT = Q`; ~80% chrome of Scene 04 board |
| `evaluateHeatModelStructure` | SCENE_SPECIFIC_ESSENTIAL | Structured L4 only; no authored L4 module |
| `extractSpecificHeatSignals` | EVALUATOR_PRIMITIVE | Transfer / AI_OFF text probes |
| Ice / phase boundary | SCENE_SPECIFIC_ESSENTIAL | Transfer and AI_OFF B |

### Scene 06 — `simple-resistor-circuit`

| Behavior / file family | Class | Evidence |
|---|---|---|
| Lab + hook + stage shells | SCENE_SPECIFIC_ACCIDENTAL | Same template |
| `officialCurrentA` / `officialCurrentFromVoltageAndResistanceA` | DETERMINISTIC_PHYSICS | `I = U / R`; open-circuit semantics |
| `SimpleResistorCircuit` | PHYSICS_PLUGIN | Circuit readings; I/U/R identity |
| `OhmsRelationBoard` | PHYSICS_PLUGIN | Controlled-relation board + authored textarea |
| `evaluateOhmsModelConstruction` | SCENE_SPECIFIC_ESSENTIAL | Completeness ≠ construction; six-click fail |
| `ohms-authored.ts` | EVALUATOR_PRIMITIVE + SCENE_SPECIFIC_ESSENTIAL | See §F |
| Filament boundary + rearrangement-as-manufacture | SCENE_SPECIFIC_ESSENTIAL | L5 far + L6 B |
| `ohms-law/evaluator.ts` | DECLARATIVE_DATA | Design spec / weakest-pass probes; runtime is `lib/learning/ohms-*` |

---

## B. Cross-scene repeated-pattern matrix

| Pattern | 01 | 02 | 03 | 04 | 05 | 06 | Kind |
|---|---|---|---|---|---|---|---|
| Thin `page.tsx` | Y | Y | Y | Y | Y | Y | UNIVERSAL_RUNTIME |
| `LearningShell` + `StageProgress` + `TutorPanel` | Y | Y | Y | Y | Y | Y | UNIVERSAL_RUNTIME |
| Lab `switch` on `LearningStage` | Y (partially inlined) | Y | Y | Y | Y | Y | SCENE_SPECIFIC_ACCIDENTAL |
| Session hook `save* → evaluate* → advanceIfReady` | Y | Y | Y | Y | Y | Y | SCENE_SPECIFIC_ACCIDENTAL |
| `SceneAdapter` completion map (11 stages) | Y | Y | Y | Y | Y | Y | UNIVERSAL_RUNTIME wiring |
| `accumulate*SceneEvidence` 7 flags | Y | Y | Y | Y | Y | Y | EVALUATOR_PRIMITIVE (copied) |
| `runExperiment` on adapter | N | Y | Y | Y | Y | Y | UNIVERSAL_RUNTIME optional |
| Observe option checklist | Y | Y | Y | Y | Y | Y | DECLARATIVE_DATA + shell |
| Predict outcome + reason | Y | Y | Y | Y | Y | Y | SCENE_SPECIFIC_ACCIDENTAL |
| Experiment compare + reflection + provenance | Y | Y | Y | Y | Y | Y | EVALUATOR_PRIMITIVE + essential observed fields |
| MODEL board (model-owned) | energy-state chain | energy-chain slots | force/motion cases | ratio table | product table | I–U–R relation | PHYSICS_PLUGIN (5 families) |
| Transfer judgments + own words | Y | Y + order | Y | Y | Y | Y + authored control | mix |
| Exam 3-step (rep → model → answer) | Y | Y | Y | Y | Y | Y | SCENE_SPECIFIC_ACCIDENTAL |
| AI_OFF 2-step (response → post-check) | Y + extra probes | Y | Y | Y | Y | Y | SCENE_SPECIFIC_ACCIDENTAL |
| `hasOwnWords` | uses engine helper | owns | uses | uses | uses | uses | EVALUATOR_PRIMITIVE |
| Tutor leak regex in `scene-tutor-leaks.ts` | Y | Y | Y | Y | Y | Y | SCENE_SPECIFIC_ESSENTIAL |
| Hint ladder from `tutorPolicy` | unused in UI | Y | Y | Y | Y | Y | DECLARATIVE_DATA |
| `SceneDefinition` loaded at runtime | N | N | N | N | N | N | DECLARATIVE_DATA unused |

---

## C. Candidate Universal Runtime responsibilities

Already owned and should stay owned:

- Stage order and transition (`LEARNING_STAGE_ORDER`, `canTransition`, `advanceIfReady`)
- Session create / persist / subscribe (`createSession`, `session-store`, `session-storage`)
- Adapter lookup (`getSceneAdapter`); no `if (sceneId === …)` in `progression.ts` / `tutor-request.ts` / `useTutor`
- Tutor permission (`STAGE_TUTOR_POLICY`), AI_OFF/COMPLETE hard block, request lifecycle, guardrail apply
- Official L-level derivation (`deriveModelEvidenceLevel` only)
- Shared chrome: `LearningShell`, `StageHeader`, `StageProgress`, `QuestionGroup`, `ValidationMessage`, `studentUiFeedback`

Not yet owned, but evidenced as accidental:

- Session-hook factory (six ~750–900 LOC copies)
- ExamWorld 3-step task
- AiOff 2-step task
- Predict task (outcome + reason)
- Observe checklist task
- Evidence-accumulator factory (same 7 flags)
- `physics-state.ts` per-scene wrap/get/default helpers (grows linearly)

Must not move into a universal switch: MODEL UI, physics engines, authored L4, tutor leak lexicons.

---

## D. Candidate Declarative Scene fields

Derived from files that already exist. Not a proposed giant schema.

### Already in `PhysicsModel` / overlay (partially unused)

| Field (actual) | Where | Runtime today |
|---|---|---|
| `scenes[].id`, `primaryModel`, `physicsEngine` | `SceneDefinition` | Readiness only; IDs re-hardcoded on adapters |
| `controllableVariables`, `observableVariables` | `SceneDefinition` | Unused by labs |
| `experimentOperations`, `targetEvidence` | `SceneDefinition` | Unused by labs |
| `experiments[]` | model `experiments.ts` | IDs/stems; runners live in `lib/physics` |
| `transferTargets[]` | model `transfer.ts` | Used by `*-transfer.ts` |
| `examPatterns[]` (`stem`, `options`, `correctAnswer`, `representationOptions`) | model `exam.ts` | Used by `*-exam.ts` |
| `independentChallenges[]` | model | Used by `*-ai-off.ts` |
| `assessmentOverlay.exam[].intendedRepresentation/intendedModel` | overlay | Used |
| `assessmentOverlay.independent[].judgments/postCheck` | overlay | Used |
| `tutorPolicy.hintLadder` | model | Used via `*-hint-ladder.ts` |
| `tutorPolicy.allowedActionsByStage` | model | Validated; runtime uses universal `STAGE_TUTOR_POLICY` |
| `tutorPolicy.answerLeakageRules` | model | Not compiled into `looksLikeTutorLeak` |
| `misconceptions[]` | model | Tutor uses generic `lib/content/misconceptions.ts` instead |
| `implementation-contract` production ID sets | 01/05/06 | Exam/transfer/AI_OFF allowlists |

### Already in `lib/content/{scene}.ts` (student-facing, not schema)

| Probable field | Evidence |
|---|---|
| Stage labels / prompts | `*_STAGE_PROMPTS`, `STAGE_LABELS` |
| Observe options | `*_OBSERVE_OPTIONS` |
| Describe structured fields | object/quantity/change or I/U/R identities |
| Predict questions + outcomes | `PREDICTION_OPTIONS`, `*_PREDICT_OUTCOMES` |
| Explain step option sets | `ENGINE_EXPLAIN_STEP*`, `MICROWAVE_EXPLAIN_*` |
| MODEL slot/row options | `ENGINE_MODEL_QUANTITY_NODES`, `CART_MODEL_*`, `SAMPLES_MODEL_*`, heat product options, ohms identities |
| Transfer relation cards | `*_TRANSFER_RELATIONS` |
| Exam / AI_OFF chrome copy | `*_EXAM_COPY`, `*_AI_OFF_COPY` |
| Complete lookback copy | `*_COMPLETE_COPY` |
| Tutor goals / constraints | `*_TUTOR_GOALS`, `*-tutor-context.ts` |
| CTA labels | heating/reset/run/compare/submit |

A v0.1 declarative layer should start from **these existing objects**, not invent a second question bank.

---

## E. Candidate Physics Plugin families

Derived from MODEL UI + scene representations actually shipped:

| Family | Scenes | Components | Do not merge with |
|---|---|---|---|
| Energy / causal chain | 01, 02 | `MicrowaveModelBoard`, `EngineModelBuilder` | Force board, ratio board |
| Mechanism animation | 02 | `FourStrokeEngine` + SVG parts | Generic “simulation” |
| Force / motion | 03 | `HorizontalForceCart`, `CartModelBoard`, `CartExamForceDiagram` | Energy chain |
| Sample / thermal comparison | 04, 05 | `EqualVolumeSamples`, `EqualMassHeatedSamples` | Circuit |
| Ratio / product board | 04, 05 | `SamplesRatioBoard`, `HeatProductBoard` | Scene 03 cases; Scene 06 relation rows |
| Circuit readings | 06 | `SimpleResistorCircuit` | Meters-as-course |
| Controlled-relation board | 06 | `OhmsRelationBoard` | Density/heat equation grid |
| Exam diagram / table | 02, 03, 04 | stroke diagram, force arrows, density table | Generic exam MCQ |

No graph-plot family exists yet. Do not invent one.

Shared board chrome (instruction, card, `ValidationMessage`, hint list, submit) is accidental, not a sixth physics family.

---

## F. Candidate Evaluator Primitive library

### Already reusable

| Primitive | Evidence |
|---|---|
| Own-words length (`hasOwnWords`, `hasOwnHan`) | `engine-describe.ts`; used across Scenes |
| Slogan / formula-only reject | microwave-text, ohms-authored |
| Token / noun sandwich (list without relation) | microwave-text, ohms-authored |
| Completeness-without-construction | Scene 06 MODEL; analogous six-click risk named in other POSTs |
| Target binding | `evaluateTransferAttempt` + required pair IDs |
| Provenance: `authoredBeforeIntervention` | experiment modules |
| Provenance: `llmDisabledDuringIndependent` | all AI_OFF accumulators |
| Post-check cannot create missing pre-commit flags | Scene 06 `applyOhmsAiOffPostCheck`; Scene 01 ice / Scene 05 steam repairs |
| Overlay-intended exam answers | all `*-exam.ts` |
| Cross-shape MODEL reject | `energy-chain-shape`, `force-board-shape`, `density-board` |

### Scene 06 authored split

Reusable semantic primitives (`lib/learning/ohms-authored.ts`):

- clause segmentation
- generic / too-short / formula-only
- token sandwich / no relation
- negation of required direction
- wrong direction given held quantity
- reversed held/changed quantity
- wrong consequence quantity
- two-control vs one-control completeness
- failure-kind cascade

Ohm-specific (must stay a pattern pack, not a universal Chinese physics parser):

- 电流 / 电压 / 电阻 lexicons
- `sameRLargerI`, `sameUSmallerI`
- filament / “R may change” boundary
- rearrangement-as-manufacture (`R = U / I` does not make R)

A DSL may declare:

```text
hold(R) ∧ U↑ → I↑
hold(U) ∧ R↑ → I↓
require_both
reject: formula_only, token_sandwich, negated, wrong_consequence
```

It may **not** replace the adversarial corpus. Compiling that declaration to regex without `ohms-authored-adversarial.test.ts` would recreate the keyword false-positive Gate B already caught.

### Stage-specific hardcoded (keep as code)

- Scene 02 explanation step IDs (`working-gas` → `gas-pushes`)
- Scene 02 dual-experiment order
- Scene 05 phase / ice boundary
- Scene 06 six-click + rearrangement
- Per-scene tutor leak regex

---

## G. Accidental duplication list

1. Six labs (~850–1200 LOC) with the same stage switch and tutor wiring.
2. Six session hooks (~750–900 LOC) with the same persist/evaluate/advance loop.
3. Six `accumulate*SceneEvidence` files with the same 7 flags.
4. Exam 3-step UI copied six times (`MicrowaveExamTask` … `OhmsExamTask`).
5. AI_OFF 2-step UI copied six times.
6. Predict / Observe / Complete shells copied six times.
7. `lib/content/{scene}.ts` restates IDs already in `content/physics-models/*`.
8. `HeatProductBoard` and `SamplesRatioBoard` each private-copy `QuantitySelect` / `ChoiceGroup`.
9. `looksLikeEnergyChain` copied into cart/samples/heat/ohms model evaluators.
10. Hint-ladder wrappers that only read `tutorPolicy.hintLadder`.
11. E2E helper files with the same click-through shape.
12. `SceneDefinition` fields duplicated as adapter constants.
13. `PredictionPanel` hardcoded to Scene 01 options.
14. `physics-state.ts` wrap/get/default quartet per Scene.

---

## H. Essential code list

Must remain TypeScript (or an equivalent typed engine), not YAML:

- `simulateHeating`, engine cycle / counterfactuals, `stepCart`, `densityGPerCm3` / `applyCutFactor`, `officialTemperatureChangeC`, `officialCurrentA`
- SVG / geometry: engine parts, cart arrows, sample cubes, circuit layout
- MODEL grammars: energy-chain slots, force triples, ratio/product grids, I–U–R construction lock
- Experiment observed-result schemas (heating trajectory vs stroke triple vs force case vs density comparison vs I/U/R pair)
- Authored L4/L5/L6 probes and their adversarial tests
- Completeness-without-construction gates
- Target-specific transfer (ice, steam/filament, hollow, locked mechanism)
- PRI representations (quantity identity, units, Scene 05 PRI-05-01)
- Tutor leak lexicons
- `deriveModelEvidenceLevel` (must stay one function)

---

## I. Minimum viable Physics Learning Scene DSL v0.1

**Boundary:** hybrid. Data drives chrome and options. Code owns physics, MODEL grammar, and evidence gates.

v0.1 may declare, per Scene:

```text
scene.id
primaryModel
stagePrompts / stageLabels
observe.options + requiredIds
describe.fields + acceptedCombination
predict[].{experimentId, question, outcomes, requireReason}
explain.steps[].{options, acceptedIds, rejectIds}
exam: use PhysicsModel.examPatterns + AssessmentOverlay
aiOff: use independentChallenges + overlay + required pre-commit ids
complete.copy
hintLadder: use PhysicsModel.tutorPolicy
cta labels
```

v0.1 must **reference**, not generate:

```text
physicsPlugin: energy-state-chain | energy-chain-slots | force-motion-board
             | ratio-quantitative | product-quantitative | circuit-relation
physicsEngine module
modelEvaluator module
authoredEvaluator? module
representation component
```

v0.1 must **not** include:

- a universal renderer that picks layout from `visualType`
- a free-text “physics language” parser
- L-level assignment
- experiment observed-field inference
- database tables
- Scene 07

Pilot conversion rule: learner-visible copy, options, and stage order stay bit-identical. Only the **source** of those values moves from hardcoded JSX to data.

---

## J. Risks of premature abstraction

1. A Scene DSL that includes MODEL + EXPERIMENT + authored text becomes an expression language. Conditionals move; complexity does not fall.
2. `SceneDefinition` is unread at runtime. Extending it without wiring creates a third source of truth beside `lib/content/*` and adapters.
3. Three-to-five MODEL families already exist. One generic `ModelBoard` will violate “MODEL UI is model-owned.”
4. Authored evaluators look declarative and are not. Scene 06 probe showed keyword gates pass wrong physics.
5. `physics-state.ts` linear growth is real, but a generic `Record<string, unknown>` would hide PRI and session typing.
6. Abstracting the session hook before a hybrid pilot freezes Scene 03–06’s API and fights Scene 01’s inlined experiment flow.
7. Tutor leak inheritance (`looksLikeEngineTutorLeak` calls microwave) will break if leaks are generated per Scene in isolation.
8. Another same-family Scene would mostly re-test the implementation protocol, not the abstraction boundary.

---

## K. Recommended first DSL pilot Scene

**Scene 04 — `equal-volume-material-samples` / `density-mass-volume`.**

Why:

- Structured L4 only (no authored-relation module)
- Ratio board already declares `MODEL_REPRESENTATION_KIND: "ratio-quantitative"`
- Physics is discrete and small (`SAMPLE_CATALOG`, cut factor)
- Stage shells are the clean Scene 03–06 template, not Scene 01 legacy
- Success is testable: convert Observe / Predict / Exam / AI_OFF / Complete copy+options to data and keep Playwright + evaluator tests green
- Scene 05 is the immediate generalization (product board, same family)

Not the first pilot: Scene 06 (authored L4/L5/L6), Scene 02 (SVG + dual experiment), Scene 01 (legacy inline + `PredictionPanel` coupling), Scene 03 (unique force board and current learner-observation target).

---

## L. Recommendation

**START_HYBRID_DSL_PILOT**

Not `CONTINUE_CODE_FIRST`: six Scenes already prove the UPLP loop; ~30–35% of each Scene is stage-shell copy.

Not `READY_FOR_BROAD_DSL_MIGRATION`: MODEL, physics, and authored evidence are not generatable without losing Gate B.

Next implementation, if authorized later: Scene 04 chrome/options only. No Scene 07. No schema rewrite of UPLP.

---

## Architecture questions

### Q1. Repeated structure vs physics-specific?

Across stage implementation (labs + tasks + `lib/learning/{scene}-*.ts`, excluding SVG/physics engines):

| Bucket | Share |
|---|---|
| Repeated stage shell / hook / exam / AI_OFF / accumulator | ~30–35% |
| Declarative copy already in `lib/content` + model packages | ~15–20% |
| Genuine physics, MODEL grammar, experiment fields, authored/target evaluators | ~45–50% |

PREDICT / EXAM / AI_OFF / COMPLETE are mostly shell. MODEL / EXPERIMENT / DESCRIBE (when bound to snapshots or boards) are mostly essential.

### Q2. What could already be generated from data?

Without losing pedagogy or evidence validity, if evaluators stay typed:

- ENTRY / COMPLETE copy
- OBSERVE option lists + required IDs
- PREDICT questions / outcomes (including Scene 02’s two sequential predicts as data)
- EXAM 3-step machine driven by `examPatterns` + overlay
- AI_OFF 2-step machine driven by challenges + overlay + pre-commit IDs
- Hint-ladder display
- Stage labels / prompts / CTA strings

### Q3. What must remain code?

Physics engines and official functions; representation geometry; MODEL boards; experiment observed-result schemas; authored-relation analysis; target-specific transfer; PRI labels/units; tutor leak regex; `deriveModelEvidenceLevel`.

### Q4. What kind of duplication is dominant?

**Stage-shell duplication first**, then content duplication (`lib/content` vs `PhysicsModel`), then evaluator-template duplication (accumulator / exam / AI_OFF), then representation duplication (ratio vs product boards). Runtime duplication is small: adapters are ~70 LOC.

### Q5. Would a Scene DSL reduce complexity now?

A **hybrid** layer for chrome and options would reduce copy. A **universal Scene renderer** would move `if (sceneId)` into schema `when` blocks and hide MODEL ownership. That would increase, not reduce, risk.

### Q6. Minimum viable DSL boundary?

See §I. Data for prompts/options/exam/AI_OFF. Plugins for physics and MODEL. Typed evaluators stay code.

### Q7. Best first pilot?

Scene 04. See §K.

### Q8. Which Scene must not be first, and why?

**Scene 06.** L4/L5/L6 authored gates are Ohm-lexicon regex plus two-control / boundary / rearrangement semantics. A first DSL attempt would either (a) reintroduce keyword false positives or (b) invent a general Chinese physics parser. Scene 02 is the second-worst first pilot (geometry + counterfactual sequencing).

### Q9. What would Scene 07 still need to discover?

Not the UPLP loop. Not adapter wiring. Only a **new representation family** (graph/table-as-primary, optics, waves) or **learner behavior**. A seventh ratio/circuit clone would discover almost nothing. This audit does not authorize Scene 07.

### Q10. After this audit?

**B. Begin hybrid declarative pilot** (Scene 04 chrome/options). Stay code-defined for MODEL, physics, and authored evidence. Do not migrate all six Scenes.

---

## M. Explicit nonclaims

- Not learner-validated. `prototype ≠ validated`.
- Does not change UPLP, L1–L6, Evidence Design, PRI, or model semantics.
- Does not implement a DSL, renderer, or database.
- Does not rewrite existing Scenes.
- Does not create Scene 07.
- Does not claim that regex authored gates prove understanding.
- Does not claim that reducing LOC improves learning.
- `SceneDefinition` is not a loaded runtime config today.
- Engineering tests and this audit do not confer educational validity.
