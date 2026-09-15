# Spec v0.2 Alignment Manifest

> Generated: 2026-09-11
> Purpose: Record the governance/alignment pass across the complete `/spec` bundle.

## Architecture sources of truth

1. `universal-physics-learning-protocol.md` — HOW: universal stages, stage semantics, universal evidence flow, AI role/permissions, hint progression, AI_OFF.
2. `physics-model-schema.md` — WHAT: canonical `PhysicsModel` contract, field semantics, content structure, completeness rules. Owns `metadata.status` allowed values and lifecycle semantics.
3. `physics-model-library.md` — WHICH: canonical model IDs, model families, coverage/status, Model Graph. Owns the current `metadata.status` of each listed model.
4. `cognitive-action-taxonomy.md` — shared vocabulary: canonical C1–C14 cognitive-action IDs.
5. `physics-model-quality-review.md` — WHETHER physics, pedagogy, and learning-evidence claims are justified. Gate A = PRE model quality. Gate B = POST learning evidence. It must not redefine UPLP stages, schema fields, or L-level meanings.
6. `evidence-design-contract.md` — HOW implementation evidence must justify a cognitive claim. Owns provenance, relation-over-token, target-specific transfer evidence, weakest-pass design, and Evidence Claim Design. It must not redefine UPLP stages, Schema `transferMode` / L-level meanings, or Quality Review gates.
7. `physics-model-implementation-protocol.md` — HOW a ready Physics Model becomes a production Scene. It must not redefine UPLP stage semantics.
8. `prompts/implement-physics-model.md` — default one-pass Cursor implementation request.
9. `prompts/review-physics-model-quality.md` — default PRE/POST quality-review request.
10. `student-ui-interaction-contract.md` — student-facing interaction quality. Does not own UPLP, L1–L6, Physics Model, evidence semantics, or physical representation identity.
11. `physics-representation-integrity-contract.md` — whether student-visible physics labels, units, and relations preserve canonical quantity identity. Does not own Physics Truth calculations, UPLP, L1–L6, evaluators, or interaction chrome. Scene 05 PRI-05-01 is the worked example. This contract does not authorize an immediate Scene 01–05 full audit.
12. `architecture/interaction-shell-contract.md` — whether reusable interaction chrome may absorb domain semantics. Owns adoption/extraction freeze for generic shells. Does not own UPLP stages, Scene DSL, evidence, PRI, or student-facing copy quality. Status: `SUFFICIENT_EVIDENCE_TO_FREEZE`.
13. `architecture/learner-interaction-runtime-contract.md` — HOW those architecture owners appear and behave in the learner UI (framing, VisibleInteractionContext, response chrome, help binding, revisit, cognitive trace). Framing and visible elements must be traceable Physics Model → cognitive objective → evidence requirement → learner task. Presentation must not infer an authoritative action result the Scene / evaluator / progression already owns. Does not own physics correctness, L-levels, evaluators, Scene DSL, or Interaction Shell freeze. Scene 01–07 are not claimed runtime-v1 compliant as a set.
14. `architecture/learner-interaction-state-contract.md` — Progress ≠ Draft ≠ View ≠ Review ≠ Evidence ≠ Physics. Evidence and Physics stay with their existing owners.
15. `architecture/learner-interaction-design-template.md` — pre-React Interaction Plan worksheet when implementing or rebuilding a Scene. Per stage / substep it now also names student question, expected response shape, surface justification, protected future structure, and primary CTA meaning. Not Evidence Claim Design and not a Physics Model. Not a second architecture owner.

Learner-observation documents are not architecture owners. `learner-validation/learner-validation-prep.md` (D050) owns WHY/WHAT for one informal Grade-9 observation of Scene 03. `learner-validation/first-learner-observation-guide.md` (D051) owns HOW to execute that first observation. They must not redefine UPLP stages, L1–L6, Schema lifecycle, Quality Review gates, or Evidence Design rules. They do not mark any model `validated`. `learner-validation/scene07-lv-001.md` is a formative Scene 07 observation record only.

`architecture/learner-workspace-layout.md` is a **PILOT / NOT YET UNIVERSALIZED** layout-responsibility candidate (D068). First consumer: Scene 07. Scene 02 may compose the same slots for layout only. It does not own physics, evidence, progression, MODEL grammar, or Scene DSL. It is not an architecture source of truth above this list. Do not claim UNIVERSAL_LAYOUT_VALIDATED. Interaction Shell freeze still applies.

`learner-experience/` Scripts are an **EXPERIMENTAL DESIGN ARTIFACT** (D069). They are not architecture owners and not a Source of Truth. Canonical contracts win on conflict. Do not claim UNIVERSAL_EXPERIENCE_STANDARD, LEARNER_VALIDATED, or AI_GENERATED_UI_READY. `architecture/learner-experience-ai-compilation.md` is DESIGN_ONLY; runtime LLM UI generation is forbidden.

## Scene 01 documents

Historical Scene specification remains flat under `spec/` for compatibility:

- `learning-spec.md` — Microwave Bread learning goals/boundaries; references architecture contract.
- `interaction-script.md` — Scene-specific student experience; does not own global stage/hint policy.
- `state-machine.md` — renamed by responsibility in content: Scene-specific state/evidence configuration; does not own universal state machine.
- `misconceptions.md` — model/Scene-specific misconception configuration aligned to Schema fields.
- `exam-mapping.md` — exam representation mapping using canonical model IDs and C1–C14 references.

Scene 01 evidence design lives under `spec/scenes/microwave-bread/`:

- `README.md` — Scene identity and pointer to historical specs.
- `evidence-claim-design.md` — L1–L6 evidence claims, evaluator contracts, accumulator, and minimum migration scope.

The running `/scenes/microwave-bread` implementation is the focused legacy migration of those contracts. POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. `metadata.status` is `prototype`. Quality-reviewed prototype. Not learner-validated.

## Scene 02 documents

Canonical location: `spec/scenes/four-stroke-engine/`

Scene 01 remains flat under `spec/` for historical reasons. New Scenes should follow the Scene 02 directory pattern.

- `README.md` — Scene identity and document index.
- `scene-spec.md` — purpose, pedagogical boundaries, future UI/component plan; does not own UPLP or the Physics Model.
- `physics-state.md` — deterministic `EngineState` and four-stroke table; LLM must not own these values.
- `learning-flow.md` — Scene-specific mapping onto canonical UPLP stages; does not redefine stage semantics.
- `interaction-script.md` — Grade 9 Chinese student experience. Not deleted by the experimental Learner Experience Script overlay (`spec/learner-experience/scene02-learner-experience-v1.md`).
- `evidence-contract.md` — Scene evidence → `AccumulatedModelEvidence`; Scene never assigns L1–L6.
- `ai-guardrails.md` — Scene-specific tutor constraints; H1–H5 remain UPLP-owned.
- `exam-mapping.md` — Exam World uses the model's existing `examPatterns`; not a second question bank.
- `test-plan.md` — future physics / learning / tutor / Playwright tests.

Primary model: `chemical-energy-internal-energy-mechanical-energy`  
Secondary models (supporting only): `mechanical-work-energy-transfer`, `force-changes-motion-state`

## Scene 03 documents

Canonical location: `spec/scenes/horizontal-force-cart/`

- `README.md` — Scene identity and document index.
- `scene-spec.md` — purpose, pedagogical boundaries, MODEL relation-board requirement; does not own UPLP or the Physics Model.
- `physics-state.md` — deterministic qualitative `CartState`; LLM must not own these values.
- `learning-flow.md` — Scene-specific mapping onto canonical UPLP stages; does not redefine stage semantics.
- `interaction-script.md` — Grade 9 Chinese student experience.
- `evidence-contract.md` — Scene evidence → `AccumulatedModelEvidence`; Scene never assigns L1–L6.
- `ai-guardrails.md` — Scene-specific tutor constraints; H1–H5 remain UPLP-owned.
- `exam-mapping.md` — Exam World uses the model's existing `examPatterns`; not a second question bank.
- `test-plan.md` — future physics / learning / tutor / Playwright tests.

Primary model: `force-changes-motion-state`  
Secondary models (supporting only): `force-equilibrium`, `inertia-motion-state`

The canonical model definition lives in `content/physics-models/force-changes-motion-state/`. This is not a duplicate model ID.

## Scene 04 documents

Canonical location: `spec/scenes/equal-volume-material-samples/`

- `README.md` — Scene identity.
- `scene-spec.md` — purpose, MODEL ratio grammar, pedagogical boundaries; production UI not implemented.
- `physics-state.md` — deterministic contract for `m / V`; not production code.

Primary model: `density-mass-volume`  
Secondary models (supporting only): `measurement-mass`, `measurement-volume`

The canonical model definition lives in `content/physics-models/density-mass-volume/`. This is not a duplicate model ID.

## Scene 05 documents

Canonical location: `spec/scenes/equal-mass-heated-samples/`

- `README.md` — Scene identity.
- `scene-spec.md` — purpose, MODEL product/ratio grammar, sitting, assessment contracts; production UI implemented.
- `physics-state.md` — deterministic contract for `ΔT = Q / (c m)`; not production code.

Primary model: `specific-heat-capacity`  
Secondary models (supporting only): `measurement-mass`, `measurement-temperature`

The canonical model definition lives in `content/physics-models/specific-heat-capacity/`. This is not a duplicate model ID.

## Scene 06 documents

Canonical location: `spec/scenes/simple-resistor-circuit/`

- `README.md` — Scene identity.
- `scene-spec.md` — purpose, MODEL relation/ratio grammar, secondary-model report.
- `physics-state.md` — deterministic contract for `I = U / R`; catalog numbers are not UI truth.
- `physical-representation-plan.md` — first native PRI plan; not a running-UI audit.
- `evidence-claim-design.md` — L4/L5/L6 claims; completeness ≠ construction.

Primary model: `ohms-law`  
Secondary models: none

The canonical model definition lives in `content/physics-models/ohms-law/`. This is not a duplicate model ID. PRE is `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. `metadata.status` is `prototype`. Quality-reviewed prototype. Not learner-validated.

## Scene 07 documents

Canonical location: `spec/scenes/convex-lens-optical-bench/`

Production Scene lives on the Universal Runtime (`app/scenes/convex-lens-optical-bench/`). No Scene DSL and no generic optics shell.

- `README.md` — Scene identity and document index.
- `evidence-claim-design.md` — L4/L5/L6 claims; construction ≠ table.
- `readiness.md` — information gate `IMPLEMENTATION_READY`.
- `physical-representation-plan.md` — design-time PRI locks.
- `interaction-plan.md` — Scene 07 learner-interaction plan (first reference consumer). Not a universal runtime and not learner validation.

Related experimental overlay (not an owner): `spec/learner-experience/scene07-learner-experience-v1.1.md` (v1 kept as history). Concept ledger: `spec/learner-experience/scene07-concept-ledger-v1.md` (EXPERIMENTAL / SCENE-SCOPED; not a standard).

Primary model: `convex-lens-imaging`  
Secondary models: none

The canonical model definition lives in `content/physics-models/convex-lens-imaging/`. This is not a duplicate model ID. PRE is `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. `metadata.status` is `prototype`. Quality-reviewed prototype. Not learner-validated. Interaction-shell freeze still forbids extracting a new generic shell.

## Research / implementation-support documents

- `architecture/scene-01-06-abstraction-audit.md` — discovery-only classification of Scenes 01–06 (D058). Not a source of truth for UPLP, L-levels, or lifecycle. Does not authorize a renderer or Scene 07.
- `architecture/scene-04-hybrid-dsl-pilot.md` — Scene 04 chrome/options extraction (D059). Not a universal renderer. Recommendation: `KEEP_SCENE04_ONLY`.
- `architecture/interaction-shell-contract.md` — reusable interaction-shell boundary after Scene 03/04/05 Observe+Predict reuse. Freeze: do not extract more shells merely because duplication exists. Not a Scene DSL. Not Scene 07.
- `architecture/learner-workspace-layout.md` — PILOT layout slots for World / Task / Support (D068). Scene 07 first consumer; Scene 02 may compose slots for layout only. Not universal. Not an architecture owner. Does not authorize Scene 01, 03–06 migration.
- `architecture/learner-experience-ai-compilation.md` — DESIGN_ONLY future authoring compiler. Not an owner. Runtime LLM UI generation is forbidden.
- `learner-experience/README.md` — experimental Learner Experience Script overlay (D069). Not canonical. Canonical contracts win.
- `EXPERIMENT_LOG.md` — evidence log; non-authoritative for architecture.
- `OPEN_QUESTIONS.md` — research backlog; non-authoritative for settled design decisions.
- `microwave-bread-development-notes.md` — dated implementation snapshot; must be re-verified against code.

## Alignment rules applied

- Removed/referenced duplicated architecture definitions instead of maintaining competing copies.
- All Scene/model references use canonical `PhysicsModel.id` values from the Library.
- UPLP remains sole owner of universal stage semantics and AI/hint policy.
- Schema remains sole owner of the `PhysicsModel` and Scene/model content contracts, including `metadata.status` lifecycle semantics.
- Library remains sole owner of model IDs/inventory, Model Graph, and the current `metadata.status` value of each model.
- Physics Model pedagogical/learning-evidence quality is owned by `physics-model-quality-review.md`. Readiness and engineering tests do not own that question.
- How implementation evidence must justify a cognitive claim is owned by `evidence-design-contract.md`. Quality Review uses that contract; it does not duplicate the evaluator-design rules.
- Whether student-visible physics representations preserve quantity identity is owned by `physics-representation-integrity-contract.md`. Correct runtime numbers do not imply correct representation. No immediate full audit of Scene 01–05.
- Whether reusable interaction chrome may absorb domain semantics is owned by `architecture/interaction-shell-contract.md`. Repeated React chrome does not justify widening `sceneDslV01Schema`. Do not extract more shells merely because duplication exists.
- How learner-facing navigation, drafts, framing, help, feedback chrome, and traces behave is owned by `architecture/learner-interaction-runtime-contract.md` and `architecture/learner-interaction-state-contract.md`. They do not take Physics Truth, evaluators, L-levels, or Scene DSL. Framing must stay traceable to the current model task. Presentation must not infer an authoritative action result the Scene already owns. Scene 01–07 are not claimed runtime-v1 compliant as a set.
- Scene 01 and Scene 02 documents are explicitly scoped as instances/configuration, not architecture sources of truth.
- Scene 02 four-stroke names belong to Scene representation, not to a new Physics Model.
- Scene 02 does not invent canonical model IDs and does not duplicate model experiments, transfer targets, exam patterns, or independent challenges.
- Scene 03 uses the existing Library ID `force-changes-motion-state`. The cart is Scene representation. MODEL must not reuse Scene 02's four-node energy chain.
- Scene 03 does not invent canonical model IDs and does not duplicate model experiments, transfer targets, exam patterns, or independent challenges.
- Scene 04 uses the existing Library ID `density-mass-volume`. Equal-volume samples are Scene representation. MODEL must not reuse Scene 02's energy chain or Scene 03's force board.
- Historical experiment/open-question content was preserved and marked non-authoritative.
- `__MACOSX` metadata is excluded from the aligned bundle.

## Files in bundle

- `EXPERIMENT_LOG.md`
- `OPEN_QUESTIONS.md`
- `architecture/interaction-shell-contract.md`
- `architecture/learner-workspace-layout.md` (PILOT; not an owner)
- `architecture/learner-experience-ai-compilation.md` (DESIGN_ONLY; not an owner)
- `learner-experience/README.md` (EXPERIMENTAL; not an owner)
- `learner-experience/scene07-learner-experience-v1.md`
- `learner-experience/scene07-learner-experience-v1.1.md`
- `learner-experience/scene07-concept-ledger-v1.md`
- `learner-experience/scene07-interaction-mapping-v1.1.md`
- `learner-experience/scene02-learner-experience-v1.md`
- `learner-experience/contract-check-v1.md`
- `learner-experience/scene07-interaction-mapping-v1.md`
- `learner-experience/scene02-interaction-mapping-v1.md`
- `architecture/learner-interaction-runtime-audit.md`
- `architecture/learner-interaction-runtime-contract.md`
- `architecture/learner-interaction-state-contract.md`
- `architecture/learner-interaction-design-template.md`
- `cognitive-action-taxonomy.md`
- `exam-mapping.md`
- `evidence-design-contract.md`
- `physics-representation-integrity-contract.md`
- `prompts/review-physics-representation-integrity.md`
- `interaction-script.md`
- `student-ui-interaction-contract.md`
- `student-ui/cross-scene-ui-audit.md`
- `learner-validation/first-learner-observation-guide.md`
- `learner-validation/learner-validation-prep.md`
- `learner-validation/templates/first-session-review.md`
- `learning-spec.md`
- `microwave-bread-development-notes.md`
- `misconceptions.md`
- `physics-model-implementation-protocol.md`
- `physics-model-library.md`
- `physics-model-quality-review.md`
- `physics-model-schema.md`
- `prompts/implement-physics-model.md`
- `prompts/review-physics-model-quality.md`
- `reviews/examples/density-mass-volume.md`
- `reviews/pre/energy-internal-energy-temperature.md`
- `reviews/pre/ohms-law.md`
- `reviews/pre/convex-lens-imaging.md`
- `reviews/post/convex-lens-imaging.md`
- `reviews/pre/specific-heat-capacity.md`
- `scenes/microwave-bread/README.md`
- `scenes/microwave-bread/evidence-claim-design.md`
- `reviews/templates/post-learning-evidence-review.md`
- `reviews/templates/pre-model-quality-review.md`
- `scenes/four-stroke-engine/README.md`
- `scenes/four-stroke-engine/ai-guardrails.md`
- `scenes/four-stroke-engine/evidence-contract.md`
- `scenes/four-stroke-engine/exam-mapping.md`
- `scenes/four-stroke-engine/interaction-script.md`
- `scenes/four-stroke-engine/learning-flow.md`
- `scenes/four-stroke-engine/physics-state.md`
- `scenes/four-stroke-engine/scene-spec.md`
- `scenes/four-stroke-engine/test-plan.md`
- `scenes/horizontal-force-cart/README.md`
- `scenes/horizontal-force-cart/ai-guardrails.md`
- `scenes/horizontal-force-cart/evidence-contract.md`
- `scenes/horizontal-force-cart/exam-mapping.md`
- `scenes/horizontal-force-cart/interaction-script.md`
- `scenes/horizontal-force-cart/learning-flow.md`
- `scenes/horizontal-force-cart/physics-state.md`
- `scenes/horizontal-force-cart/scene-spec.md`
- `scenes/horizontal-force-cart/test-plan.md`
- `scenes/equal-volume-material-samples/README.md`
- `scenes/equal-volume-material-samples/physics-state.md`
- `scenes/equal-volume-material-samples/scene-spec.md`
- `scenes/simple-resistor-circuit/README.md`
- `scenes/simple-resistor-circuit/scene-spec.md`
- `scenes/simple-resistor-circuit/physics-state.md`
- `scenes/simple-resistor-circuit/physical-representation-plan.md`
- `scenes/simple-resistor-circuit/evidence-claim-design.md`
- `scenes/convex-lens-optical-bench/README.md`
- `scenes/convex-lens-optical-bench/evidence-claim-design.md`
- `scenes/convex-lens-optical-bench/readiness.md`
- `scenes/convex-lens-optical-bench/physical-representation-plan.md`
- `scenes/convex-lens-optical-bench/interaction-plan.md`
- `scenes/convex-lens-optical-bench/model-aligned-surface-audit.md` (Scene-local; not an owner)
- `scenes/convex-lens-optical-bench/interaction-capability-pilot.md` (Scene-local CANDIDATE; not an owner)
- `state-machine.md`
- `universal-physics-learning-protocol.md`

