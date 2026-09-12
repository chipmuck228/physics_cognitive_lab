# Scene 05 → Scene DSL v0.1 Fit Test

> Date: 2026-09-12  
> Kind: analysis only  
> Compared: Scene 04 `equal-volume-material-samples` vs Scene 05 `equal-mass-heated-samples`  
> Against: `lib/scene-dsl/v01.ts` and `components/learning/dsl/*`  
> Not: Scene 05 migration, schema widening, Scene 07, database, production code change

Scene 05 is a different Physics Model (`specific-heat-capacity`, product `Q = c m ΔT`) that still uses the same UPLP shell as Scene 04. This test asks whether the Scene 04 pilot abstractions are reusable, not whether Scene 05 should be forced into them.

Fit codes:

| Code | Meaning |
|---|---|
| EXACT_FIT | Same shape; Scene 05 values drop in |
| CONFIG_ONLY_FIT | Same shape; only strings / IDs change |
| PLUGIN_DIFFERENCE | Same slot; implementation must stay a different plugin |
| NEEDS_GENERALIZATION | Current field/shell cannot host Scene 05 without a schema or shell change |
| SCENE_SPECIFIC | Scene 04-only; should not be generalized |
| WRONG_ABSTRACTION | Treating Scene 05 as this field would hide a real difference |

---

## A. Field-by-field Scene 05 fit matrix

| v0.1 field | Scene 05 evidence | Fit | Notes |
|---|---|---|---|
| `identity.sceneId` / `primaryModelId` | `equal-mass-heated-samples` / `specific-heat-capacity` | NEEDS_GENERALIZATION | Schema is `z.literal` Scene 04 only |
| `stageOrder` | `HEAT_PHASE_STAGES` = full UPLP | EXACT_FIT | Same 11 stages |
| `stagePrompts` | `HEAT_STAGE_PROMPTS` all stages | CONFIG_ONLY_FIT | Different sentences, same keys |
| `stageFooters` | `HEAT_FOOTER` only ENTRY/OBSERVE/AI_OFF/COMPLETE | CONFIG_ONLY_FIT | Schema already allows missing stages |
| `tutorGoals` | `HEAT_TUTOR_GOALS` same 8 stages | CONFIG_ONLY_FIT | Same required-stage object |
| `copy` landing / observe / predict CTAs | `HEAT_COPY` parallel keys | CONFIG_ONLY_FIT | Same chrome verbs |
| `copy.complete*` | `HEAT_COMPLETE_COPY` is `title/body/noMastery` | NEEDS_GENERALIZATION | No `caution/theme/demonstrated` |
| `copy.massUnit/volumeUnit/densityUnit` | Scene 05 uses `kg` / `℃` / `J` | SCENE_SPECIFIC | Density units must not become Scene 05 units |
| `observe.options` + `requiredIds` | `HEAT_OBSERVE_OPTIONS`; required `same-mass` + `different-rise` | CONFIG_ONLY_FIT | Same checklist rule |
| `describe.accepted` `{object,sizeRelation,massRelation}` | Heat is `{object,massRelation,temperatureRelation}` | SCENE_SPECIFIC | Size/mass is density describe, not heat |
| `predict.outcomes` | `HEAT_PREDICT_OUTCOMES_*` | CONFIG_ONLY_FIT | Flat outcome list still works |
| `explain.accepted` density keys | Heat is `heatVsTemperature/sameMassSameQ/sameCSameQ/timeAndPhase` | SCENE_SPECIFIC | Density-named keys are wrong for heat |
| `explain.rejectIds` | Heat has its own misconception set | CONFIG_ONLY_FIT *if* keys were generic | Safe only as `string[]`, not density names |
| `transfer.requiredFullModelIds` | One full-model: `near-two-pots-water-and-oil` | CONFIG_ONLY_FIT | Array already allows one or two |
| `transfer.boundaryTargetId` | `far-ice-water-heated` | CONFIG_ONLY_FIT | Same pair shape |
| `transfer.relationIds` | `HEAT_TRANSFER_RELATIONS` | CONFIG_ONLY_FIT | IDs only |
| ice `conditionChecks` / `HEAT_ICE_CONDITION_PROBES` | Required for ice L5 | SCENE_SPECIFIC | Not in v0.1; must stay heat transfer code |
| `exam.patternIds` + `maxAttemptsPerItem` | `PRODUCTION_EXAM_PATTERN_IDS`, max 2 | CONFIG_ONLY_FIT | Same machine |
| `aiOff.challengeIds` + `tutorEnabled: false` | `PRODUCTION_AI_OFF_IDS`, `llmAllowed: false` | CONFIG_ONLY_FIT | Sequence + hard block |
| ice AI_OFF pre-commit IDs | `HEAT_AI_OFF_ICE_PRE_COMMIT_IDS` | SCENE_SPECIFIC | Extra gate; not in v0.1 |
| `hintLadder.source` | `heatHintLadder()` reads model `tutorPolicy` | EXACT_FIT | Same binding |
| `evidenceBindings` `samples-*` enum | Heat accumulator calls `hasSufficientHeat*` | WRONG_ABSTRACTION | Do not rename heat predicates to `samples-*` |
| `plugins.physics` | `deterministic-equal-mass-heat-samples` | PLUGIN_DIFFERENCE | Different official engine |
| `plugins.modelRepresentation` | Metadata says `ratio-quantitative`; UI is `HeatProductBoard` | PLUGIN_DIFFERENCE | Same family name, not the same board |
| `plugins.evaluator` | `evaluateHeat*` + specific-heat signals | PLUGIN_DIFFERENCE | Different module |

---

## B. Generic-shell fit matrix

| Shell | Scene 05 component | Fit | Could adopt without behavior change? |
|---|---|---|---|
| `ChecklistObserveTask` | `HeatObserveTask` (74 LOC, same checkbox + demo CTA) | EXACT_FIT | Yes. Pass `HEAT_COPY` + `HEAT_OBSERVE_OPTIONS` + heat testids |
| `OutcomePredictTask` | `HeatPredictTask` (96 LOC, same outcome + reason) | EXACT_FIT | Yes. Pass heat question/outcomes/copy |
| `LookbackCompleteView` | `HeatCompleteView` (48 LOC) | NEEDS_GENERALIZATION | Not as-is. Heat has no demonstrated list. Forcing the Scene 04 card would add chrome |

No generic Describe / Explain / Experiment / MODEL / Transfer / Exam / AI_OFF shells exist. Those Scene 05 tasks stay code.

---

## C. Scene 04-specific leakage in v0.1

These are Scene 04-shaped, not universal:

1. `identity` literals `equal-volume-material-samples` / `density-mass-volume`
2. Plugin catalogs with one physics, one MODEL, one evaluator name
3. `copy.volumeUnit` + `copy.densityUnit` (density PRI)
4. `describe.accepted` fixed `{object, sizeRelation, massRelation}`
5. `explain.accepted` fixed `{densityVsMass, sameVolume, sameMass, uniformCut}`
6. `evidenceBindings` enum `samples-observation` … `samples-ai-off`
7. `tutorGoals` `.strict()` eight-stage object (works for Scene 05 by coincidence, not by design)
8. `LookbackCompleteView` always renders a demonstrated card
9. `parseSceneDslV01` transfer check assumes every listed ID is only a target ID (fine) but catalogs are passed from the density model at Scene 04 module load

Do **not** assume all of these should be generalized. 3–6 and 8 are correctly Scene 04-local if v0.1 remains a Scene 04 config type.

---

## D. Required generalizations for Scene 05

Only if the goal is “Scene 05 becomes a `sceneDslV01Schema` instance.” Chrome-only does not need these.

| Change | Why | Class |
|---|---|---|
| Widen `identity` to a second literal pair, or `z.string()` + catalog | Current parse rejects Scene 05 | **B** merely accommodating if we add one more literal; **A** if identity is any registered Scene |
| Append heat plugin names to the three enums | Scene 05 cannot name its plugins | **B** if append-only; **A** if names come from a registry |
| Replace density unit trio with a free `units: Record<string,string>` | Heat units are kg/℃/J | **A** as a small unit map; **C** if it becomes a PRI formula table |
| Replace `describe.accepted` with `Record<string,string>` or per-scene describe plugin | Heat fields differ | **A** if “accepted field map”; **C** if describe becomes an expression DSL |
| Replace `explain.accepted` density keys the same way | Heat four-step keys differ | same as describe |
| Replace `samples-*` evidence enum with Scene-local predicate names, or drop bindings from schema | Heat must not share samples vocabulary | **A** drop or namespace; **C** dispatcher that calls functions by string |
| Make `LookbackCompleteView` demonstrated block optional | Heat complete has no list | **A** optional chrome section |

Ice transfer probes and ice AI_OFF pre-commit are **not** required generalizations. They stay Scene 05 code.

---

## E. Generalizations rejected as premature

| Proposal | Why reject |
|---|---|
| One `UniversalDescribeAccepted` object with union of size + temperature fields | Invents a fake shared describe model |
| One MODEL plugin `ratio-quantitative` that renders both boards | Violates model-owned MODEL UI; product ≠ density table |
| Put ice condition probes into `transfer` schema | Encodes Scene 05 Gate B repair as generic transfer |
| Put AI_OFF pre-commit into v0.1 | Scene 05-specific provenance |
| `evidenceBindings` as a runtime dispatcher | Evaluator language |
| Free-form `copy` bag of every HEAT_COPY key | Copy-field explosion; no pedagogy gain |
| Tutor-goal expression language | Goals are strings; keep a stage map |

---

## F. Physics / MODEL / evaluator code that must remain untouched

- `officialTemperatureChangeC` / heat catalogs / `lib/physics/equal-mass-heated-samples`
- `HeatProductBoard` + `evaluateHeatModelStructure`
- `heat-experiment.ts` observed fields (mass / energy / ΔT)
- `evaluateHeatTransfer` ice structured checks + authored boundary
- `EqualMassHeatedSamples` PRI (temperature vs 升温)
- `accumulateHeatSceneEvidence` + `deriveModelEvidenceLevel`
- `looksLikeHeatTutorLeak` / `heatTutorConstraint`

A chrome-only shell swap does not require touching any of these.

---

## G. Estimated Scene 05-specific LOC removable with *current* abstractions

| Current | LOC | If wrapped onto existing shells |
|---|---|---|
| `HeatObserveTask` | 74 | ~40 wrapper |
| `HeatPredictTask` | 96 | ~40 wrapper |
| `HeatCompleteView` | 48 | **0 removable today** (shell would change UI) |

Removable markup: about **90 LOC**.  
Not removable without new shells: Describe, Experiment, Explain, MODEL, Transfer, Exam, AI_OFF, lab, hook (~still the majority).

---

## H. Estimated new generic / schema LOC required

| Path | New LOC |
|---|---|
| Chrome-only (Observe + Predict wrappers only) | ~80 wrappers; **0 schema** |
| Optional demonstrated on Complete | ~10 shell LOC |
| Full Scene 05 `sceneDslV01` instance (widen identity/plugins/copy/describe/explain/evidence + `heatSceneDsl` composition) | ~80–150 schema + ~140 config object (Scene 04 pattern) |

Full declarative path is a net **increase**, as the Scene 04 pilot already was.

---

## I. Net complexity judgment

The **shells** `ChecklistObserveTask` and `OutcomePredictTask` are genuinely reusable. They do not know Scene 04.

The **Zod schema** is a Scene 04 config type with a universal-looking name. Putting Scene 05 into it without redesign would either (1) add Scene 05 literals (accommodation) or (2) invent generic describe/explain/evidence maps (premature).

Chrome-only on Observe + Predict **reduces** a small amount of copy-paste and does not raise Gate B risk.

Declarative migration into current v0.1 **increases** complexity and risks hiding heat-specific L5/L6 gates (ice probes, pre-commit) inside a density-shaped schema.

---

## Critical question

Can Scene 05 adopt the existing generic shells and declarative ownership while keeping heat physics, product MODEL board, experiment fields, evaluators, PRI, and evidence semantics unchanged?

- **Shells:** Yes for Observe and Predict. Not for Complete without an optional demonstrated section (or leaving Complete Scene-specific).
- **Declarative ownership of current `sceneDslV01Schema`:** No. Identity, plugin catalogs, density units, describe/explain shapes, and `samples-*` evidence names reject Scene 05 or would mislabel it.
- **Declarative ownership of IDs/copy in `lib/content/equal-mass-heated-samples.ts` (already data, not v0.1):** Already true. Scene 05 does not need the Zod file to keep chrome in data.

---

## J. Recommendation

**SCENE05_CHROME_ONLY_MIGRATION_SAFE**

Meaning: a later pass may wrap Scene 05 Observe and Predict onto the existing shells. Do not put Scene 05 through `sceneDslV01Schema`. Do not widen the schema in that pass. Leave Complete, Describe, Explain, Transfer ice probes, and AI_OFF pre-commit as Scene 05 code.

Not `SCENE05_DECLARATIVE_MIGRATION_SAFE` — current schema is Scene 04-shaped.  
Not `REDESIGN_DSL_BOUNDARY_FIRST` unless the goal is a second *schema* instance.  
Not `DSL_PILOT_NOT_REUSABLE` — two shells already reuse.  
`KEEP_SCENE04_ONLY` remains correct for the Zod file itself.

This document does not authorize the chrome-only pass. It only answers the fit test.
