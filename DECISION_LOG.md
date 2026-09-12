# Physics Cognitive Lab — Decision Log

> Version: 0.1
> Purpose: Record important product, pedagogy, and architecture decisions and why they were made.

## D001 — APP is the Track, LLM is the Engine

**Date:** 2026-09-11

**Decision:** The Web/App controls the world and learning path. The LLM is a constrained language/reasoning engine inside it.

**Why:** A free-form LLM can hallucinate physical facts, skip learning steps, or do the student's thinking. The product needs deterministic control over state and pedagogy.

**Consequence:** Physics state and learning progression must not be owned by the LLM.

---

## D002 — First MVP is “Microwave + Bread”

**Decision:** Use a microwave-heated slice of bread as the first physical environment.

**Why:** It is familiar, visual, experimentally controllable, connected to thermal physics, and capable of bridging real-world phenomena to exam concepts.

**Consequence:** MVP focuses on energy transfer, internal energy/state change, temperature, and transfer.

---

## D003 — MVP is a Vertical Slice, Not a Platform

**Decision:** Build one complete learning experience before building user accounts, curriculum management, dashboards, payments, or a question bank.

**Why:** The main uncertainty is educational effectiveness, not infrastructure.

**Consequence:** No auth/database/admin in MVP.

---

## D004 — Student Must Perform the Target Cognitive Action

**Decision:** The student must perform the key cognitive action for the current stage.

**Why:** If AI performs the key reasoning, the product may improve task completion without improving independent ability.

**Consequence:** The tutor has stage-specific permissions and answer-leak prevention.

---

## D005 — Physics State Must Be Deterministic

**Decision:** The physics environment is controlled by code, not by LLM-generated narrative.

**Why:** The LLM may hallucinate outcomes or generate physically inconsistent results.

**Consequence:** `simulateHeating()` and related rules are pure/deterministic functions.

---

## D006 — AI Off is Mandatory

**Decision:** The final assessment is completed with AI turned off.

**Why:** AI-assisted performance is not equivalent to independent learning.

**Consequence:** The learning environment must remain usable without an LLM, and independent assessment must not call the tutor API.

---

## D007 — Exam Questions Are Another Representation of the Model

**Decision:** Exam tasks are integrated after the model-building and transfer stages.

**Why:** School assessment must remain a product outcome. However, it should be connected to the same underlying physical model rather than treated as unrelated drilling.

**Consequence:** Exam questions are mapped to cognitive actions and physical models.

---

## D008 — Replace Low-Value Repetition With Structured Variation

**Decision:** Do not optimize for large quantities of similar questions.

**Why:** The product hypothesis is that model recognition and transfer are more informative than repeated surface-level practice.

**Consequence:** Use near, medium, and far transfer tasks.

---

## D009 — Reality → Model → Exam

**Decision:** Learning should move from real-world phenomena to physical models and then to exam representation.

**Why:** Students need both conceptual understanding and the ability to operate in school assessment formats.

**Consequence:** Physics World and Exam World can look different but must share the same underlying model.

---

## D010 — Do Not Over-Simulate Microwave Physics in MVP

**Decision:** The microwave environment uses a deterministic pedagogical approximation instead of a complete electromagnetic simulation.

**Why:** The MVP is validating the learning mechanism, not microwave engineering fidelity.

**Consequence:** The physical model must be explicitly documented as a teaching approximation.

---

## D011 — Evidence Before Mastery Labels

**Decision:** Store student evidence first; do not claim validated mastery scores.

**Why:** The product has not yet been psychometrically validated.

**Consequence:** Keep internal evidence and qualitative signals rather than pseudo-precise scores.

---

## D012 — Do Not Start With a Full Agent Swarm

**Decision:** MVP can begin with one constrained tutor model behind a schema-validated API.

**Why:** The educational workflow is still being validated; multiple agents add complexity before their value is known.

**Consequence:** Add specialized agents only when a demonstrated need appears.

---

## D013 — Build the Foundation Before Tutor Integration

**Date:** 2026-09-11

**Decision:** Implement the first coding checkpoint as a deterministic learning-environment foundation before adding `/api/tutor`.

**Why:** The highest-risk constraints are that physics remains application-controlled, stage transitions remain explicit, and the product remains usable without AI. Those can be validated earlier through the scene, session store, and progression rules than through model integration.

**Consequence:** The repository may temporarily contain the full learning-stage model while only the early `ENTRY -> OBSERVE` interaction is user-complete. This does not change the target MVP.

---

## D014 — Define Evidence Channels Before All Stage UI Exists

**Date:** 2026-09-11

**Decision:** Keep typed storage for observations, predictions, explanations, model attempts, transfer attempts, exam attempts, and independent assessment in the session shape before every corresponding UI has been implemented.

**Why:** The product is evidence-first. Fixing the state shape early reduces the risk that later UI work drifts away from the learning specification.

**Consequence:** Some session fields are currently reserved and usually empty. They represent planned evidence channels, not completed learning features.

---

## D015 — First Reusable Physics Model Is Data, Not a New Page

**Date:** 2026-09-11

**Decision:** Implement `chemical-energy-internal-energy-mechanical-energy` as a complete Physics Model definition, evaluator, and evidence contract before any Four-stroke Engine Scene UI.

**Why:** v0.2 requires model-first implementation. The four strokes are a Scene representation of this model, not a second learning architecture.

**Consequence:** Lifecycle remains `draft` until a Scene and full UPLP loop exist. Universal stages, hint semantics, and tutor permissions stay owned by UPLP.

---

## D016 — TransferMode Distinguishes Full, Partial, and Boundary Transfer

**Date:** 2026-09-11

**Decision:** Extend `TransferTarget` in physics-model-schema v0.2.1 with `transferMode`: `full-model` | `partial-structure` | `boundary-contrast`. Official L1–L6 is derived from accumulated stage evidence, not from a single free-text match.

**Why:** Far transfer such as a steam piston may share work/mechanical-energy structure without transferring the chemical-energy start. Keyword overlap is a diagnostic signal, not mastery.

**Consequence:** Steam far transfer is encoded as `partial-structure`. UPLP stage semantics are unchanged. No new model ID is created.

---

## D017 — Scene 02 Phase 3 Stops After DESCRIBE

**Date:** 2026-09-11

**Decision:** Production Scene 02 implements ENTRY → OBSERVE → DESCRIBE only. Canonical student stage labels live in `STUDENT_STAGE_LABELS`. Scene 02 uses that registry. Scene 01 keeps existing local labels until a later migration. After DESCRIBE, the application shows a development-safe endpoint and refuses later stage transitions.

**Why:** Phase 3 tests observation and description of the engine phenomenon. Teaching the energy model, prediction, or experiment would skip the student's target cognitive actions for this slice.

**Consequence:** `canLeaveStage` blocks four-stroke-engine sessions from leaving DESCRIBE forward. OBSERVE and DESCRIBE use structured evidence gates. UPLP, the Physics Model, and the deterministic engine core are unchanged.

---

## D018 — Scene 02 Phase 4 Stops After EXPERIMENT

**Date:** 2026-09-11

**Decision:** Production Scene 02 now implements ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT. PREDICT requires a committed explicit outcome plus own-word reason before the matching intervention. Each of the two model experiments must close with the UPLP five-part loop. After both close, the application shows a development-safe endpoint and refuses EXPLAIN and later stages.

**Why:** Phase 4 is the prediction/intervention/comparison loop. Teaching the energy chain, MODEL, TRANSFER, or EXAM here would skip the student's current cognitive actions.

**Consequence:** `ENGINE_PHASE4_LAST_STAGE` is `EXPERIMENT`. Experiment B's prediction is authored during EXPERIMENT, so the tutor stays off for that second prediction (UPLP EXPERIMENT has no tutor). Physics IDs stay `combustion-disabled` / `mechanical-system-locked`; Scene/model IDs stay `ignition-energy-release` / `immovable-mechanical-system`. UPLP, the Physics Model, and the deterministic engine core are unchanged.

---

## D019 — Experiment-Local Predictions Are Not Extra UPLP PREDICT Stages

**Date:** 2026-09-11

**Decision:** The UPLP PREDICT stage records the first pre-intervention prediction. During EXPERIMENT, each additional intervention still requires its own committed prediction before it runs. Those records are experiment-local. They do not add PREDICT stages to the universal sequence. Tutor permissions follow the enclosing UPLP stage.

**Why:** Phase 4 already implemented Experiment B's prediction inside EXPERIMENT. Documenting this keeps Scene 02 aligned with UPLP without forking the protocol.

**Consequence:** A second prediction authored inside EXPERIMENT does not receive tutor help, because EXPERIMENT disallows tutor. UPLP is unchanged.

---

## D020 — Scene 02 Phase 5 Stops After MODEL

**Date:** 2026-09-11

**Decision:** Production Scene 02 now implements ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT → EXPLAIN → MODEL. EXPLAIN is causal preparation from the two experiment outcomes. MODEL is structured construction of the approved Physics Model chain. After a valid MODEL, the application shows a development-safe endpoint and refuses TRANSFER and later stages.

**Why:** Phase 5 moves from observed outcomes to a reusable causal structure. Opening TRANSFER or Exam World here would skip the student's next cognitive actions.

**Consequence:** `ENGINE_PHASE5_LAST_STAGE` is `MODEL`. Official L4 is derived by `deriveModelEvidenceLevel` from `constructedValidCausalModel`, never written as `"L4"` by the Scene. UPLP, the Physics Model deep structure, and the deterministic engine core are unchanged.

---

## D021 — Scene 02 Phase 6 Stops After TRANSFER

**Date:** 2026-09-11

**Decision:** Production Scene 02 now implements ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT → EXPLAIN → MODEL → TRANSFER. TRANSFER uses the Physics Model's existing targets. Closing the stage requires one successful `full-model` transfer (motorcycle, or the lab device as retry/scaffold) and one successful `partial-structure` steam transfer. The medium library target is not required in one session. After the required pair, the application shows a development-safe endpoint and refuses EXAM and later stages.

The MODEL UI node “工作气体的内能/状态” and TRANSFER relation card “工作物质内能/状态 → 对机械系统做功” are Grade-9 pedagogical composites. They do not merge canonical quantities or relations in the Physics Model.

**Why:** TRANSFER must test reusable structure, including what does not automatically transfer. Opening Exam World here would skip that cognitive action. Requiring all three library targets in one sitting is stronger than the production goal of showing both full-model generalization and partial-structure limits.

**Consequence:** `ENGINE_PHASE6_LAST_STAGE` is `TRANSFER`. Official L5 is derived by `deriveModelEvidenceLevel` from `constructedValidCausalModel` plus `successfulTransfer`, never written as `"L5"` by the Scene. One accepted transfer is not enough for `successfulTransfer`. TRANSFER cannot set L6. UPLP, the Physics Model deep structure, and the deterministic engine core are unchanged.

---

## D022 — Scene 02 Phase 7 Stops After EXAM

**Date:** 2026-09-11

**Decision:** Production Scene 02 now implements ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT → EXPLAIN → MODEL → TRANSFER → EXAM. Exam World uses a stable representative subset of the Physics Model `examPatterns`: `exam-power-stroke-energy-conversion` (model recognition), `exam-why-power-stroke-works` (causal / condition reasoning), and `exam-stroke-diagram-energy-flow` (representation variation). Options stay hidden until the representation and model/relation steps are complete. Answer correctness is app-owned. After the selected items have structured attempts, the application shows a development-safe endpoint and refuses AI_OFF.

`ExamPattern` has no `intendedRepresentation` field, and `representationOptions[0]` is not always the intended “这道题在考什么” choice. The Scene maps that intended option for the selected items without rewriting `exam.ts`. `modelOptions[0]` is treated as the intended relation for these patterns.

**Why:** EXAM is another representation of the same Physics Model, not a second question bank. Opening AI_OFF here would skip the independent challenge. Requiring every library pattern in one sitting is stronger than the production goal of exercising distinct cognitive actions.

**Consequence:** `ENGINE_PHASE7_LAST_STAGE` was `EXAM`. Official L6 remained reserved for AI_OFF evidence. EXAM completion does not write `"L6"` and does not clear L5 transfer evidence. UPLP, the Physics Model deep structure, and the deterministic engine core are unchanged. Superseded for production reach by D023.

---

## D023 — Scene 02 Phase 8 Reaches COMPLETE

**Date:** 2026-09-11

**Decision:** Production Scene 02 now implements ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT → EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE. AI_OFF uses the Physics Model `independentChallenges` `ai-off-unfamiliar-combustion-piston` and `ai-off-condition-locked-mechanism`. `IndependentChallenge` has no options or `correctAnswer`; the Scene owns student-facing judgments and a post-commit structured fact check so official evaluation stays deterministic without LLM grading or a second question bank.

The independent response (judgment + own reasoning) is committed first. The post-check cannot rewrite that first response. Retries append; the original attempt is retained. Correct answer alone is not independent success. Official L6 is derived by `deriveModelEvidenceLevel` from `independentAiOffSuccess` plus `llmDisabledDuringIndependent` after valid L5 evidence. The Scene never writes `"L6"`. COMPLETE is terminal reflection with evidence-bounded wording.

**Why:** AI_OFF must be a hard independent-learning boundary, not Exam World with the tutor hidden. The canonical challenge schema does not include renderable options, so Scene-owned judgments are a documented rendering gap, not a model rewrite.

**Consequence:** `ENGINE_PHASE8_LAST_STAGE` is `COMPLETE`. Tutor requests in AI_OFF and COMPLETE are zero. LLM grading is not used. UPLP, the Physics Model deep structure, and the deterministic engine core are unchanged.

---

## D024 — Universal Scene Runtime Adapter and Assessment Overlay

**Date:** 2026-09-11

**Decision:** Introduce a thin `SceneAdapter` so universal progression resolves stage completion as `getSceneAdapter(sceneId).completion[stage](session)` instead of a growing `sceneId` switch. `LearningSession.physicsState` is discriminated `ScenePhysicsState`; `createSession` initializes it through the adapter. Production exam intended representation/model and AI_OFF judgments/post-checks live in a first-class `AssessmentOverlay` beside the Physics Model, not as private maps in Scene learning files and not as new canonical schema fields.

**Why:** Scene 02 validated the full UPLP loop, but Scene 03 must not copy the Scene 02 learning stack or inherit a false microwave physics invariant. Overlay architecture is validated before promoting answer-key fields into `physics-model-schema.md`.

**Consequence:** Scene 01 keeps a compatibility adapter with its current weaker gates. Scene 02 remains the first complete adapter and delegates to existing engine evaluators. Persisted sessions migrate wrapped physics without discarding learning evidence. UPLP, Physics Model deep structure, deterministic physics, and Scene 02 student-visible flow are unchanged. Scene 03 is not implemented.

---

## D025 — Scene-Owned Tutor Context and Session Extension

**Date:** 2026-09-11

**Decision:** Scene-specific tutor payload (learning goal, physics snapshot, prompt constraint, leak patterns) is supplied through `SceneAdapter`. Universal tutor code no longer branches on `sceneId`. `LearningSession.sceneData` is the only extension bag for Scene-owned data. Microwave `experimentHistory` is Scene 01 compatibility data inside `sceneData`, not a universal top-level field.

**Why:** A future Scene whose Physics Model is not an engine-like energy chain must not force new `if (sceneId === …)` tutor branches or new top-level session fields such as `scene03Answers`.

**Consequence:** Scene 01 and Scene 02 student-visible behavior is unchanged. AI_OFF/COMPLETE hard block still overrides any adapter tutor context. UPLP, Physics Model schema, and Scene 03 are unchanged.

---

## D026 — Scene 03 Specified on force-changes-motion-state

**Date:** 2026-09-11

**Decision:** Scene 03 is specified as Horizontal Force Cart (`horizontal-force-cart`) with primary model `force-changes-motion-state`. The canonical ID already existed in the Library; the previously empty model definition is now filled. The Scene is design/spec only: no production UI, no Universal Runtime `sceneId` branch, no UPLP change, and no Scene 01/02 student-visible change.

The deep structure is current motion state + net-force condition / direction relation → motion-state change. MODEL must use a relation board, not Scene 02's four-node energy chain. `ModelEvaluatorSpec.requiredComponents` is a model-owned map, not a universal energy-conversion checklist.

**Why:** The next protocol-validation Scene must prove that the runtime can teach a mechanics model whose structure is not an energy-conversion chain, while keeping Grade 9 distinctions such as force ≠ motion and zero net force ≠ must be stationary.

**Consequence:** Library coverage for this model is specified but still `draft` until a production Scene exists. Production implementation must register a Scene adapter and store Scene drafts in `sceneData`. Shared experiment IDs must be generic strings, not an engine-only union.

---

## D027 — Scene 03 Phase 1 Horizontal Force Cart through EXPERIMENT

**Date:** 2026-09-11

**Decision:** Implement Scene 03 production Phase 1: deterministic 1D cart physics, SceneAdapter registration, and ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT. Shared `PredictionEvidence.experimentId` and `ExperimentEvidence.experimentId` are generic `string`s. Cart experiments write into the universal experiment/prediction arrays. Microwave-shaped `actualResult` / `parameters` are optional. O014 reversal is not required for Experiment B; a second opposite-force tick may reverse after rest.

**Why:** Scene 03 must validate a non-energy Physics Model on the Universal Runtime without a `sceneId` branch, without hiding experiment evidence only in `sceneData`, and without F=ma.

**Consequence:** EXPLAIN through COMPLETE remain unimplemented. Phase 1 does not auto-advance past EXPERIMENT. Scene 01/02 student-visible behavior is unchanged. UPLP and L-level semantics are unchanged.

---

## D028 — Scene 03 Phase 2 EXPLAIN / MODEL / TRANSFER

**Date:** 2026-09-11

**Decision:** Open Horizontal Force Cart through TRANSFER. EXPLAIN uses structured causal choices that reject force/motion misconceptions and does not write L4. MODEL is a three-case relation board (same / opposite / zero net force) plus friction-omitted and zero-net-force-unchanged conditions, not Scene 02's four-slot energy chain. TRANSFER requires one accepted full-model target and the hover boundary-contrast. Official L4/L5 come only from `accumulateCartSceneEvidence` → `deriveModelEvidenceLevel`.

**Why:** Scene 03 must prove a non-energy MODEL and relation/condition TRANSFER on the Universal Runtime.

**Consequence:** EXAM / AI_OFF / COMPLETE remain unimplemented. Phase 2 does not auto-advance past TRANSFER. Scene 01/02 student-visible behavior is unchanged.

---

## D029 — Scene 03 Phase 3 EXAM / AI_OFF / COMPLETE

**Date:** 2026-09-11

**Decision:** Finish Horizontal Force Cart through COMPLETE. EXAM uses the model's canonical patterns and AssessmentOverlay intended representation/model, with options hidden until those steps. AI_OFF uses `ai-off-unfamiliar-hover-sled` and `ai-off-condition-tug-moving-crate`, commit-before-post-check, and a hard no-AI boundary. Official L6 comes only from `accumulateCartSceneEvidence` → `deriveModelEvidenceLevel` after L5 plus both accepted independent challenges with `llmUsed === false`. COMPLETE is terminal and evidence-bounded.

**Why:** Scene 03 must complete the UPLP loop on the Universal Runtime without a `sceneId` branch and without the Scene assigning L6.

**Consequence:** Scene 03 now implements ENTRY → COMPLETE. Scene 01/02 student-visible behavior is unchanged. UPLP and L-level semantics are unchanged.

---

## D030 — Physics Model Implementation Protocol

**Date:** 2026-09-11

**Decision:** Extract a repeatable implementation protocol from Scene 02 and Scene 03. `spec/physics-model-implementation-protocol.md` owns how a ready Physics Model becomes a Scene. `spec/prompts/implement-physics-model.md` is the default one-pass Cursor request. `validatePhysicsModelReadiness` is the smallest readiness gate. `implementation-ready` is a pipeline status, not a new `metadata.status` enum. Prototype means engineering contracts pass. Validated requires learner/educational evidence and is not conferred by tests.

**Why:** Further models should not require a custom prompt per UPLP stage or repeated architecture decisions. Scene 02 and Scene 03 together prove that energy-chain and force/motion models can share the Universal Runtime only if MODEL UI stays model-owned.

**Consequence:** Scene 04 is not implemented here. UPLP, schema deep structure, L-level semantics, and Scene 01/02/03 student-visible learning behavior are unchanged aside from moving microwave-specific exam chrome out of shared `STUDENT_CHROME`.

---

## D031 — density-mass-volume filled to implementation-ready

**Date:** 2026-09-11

**Decision:** Fill the existing Library ID `density-mass-volume` as a complete Physics Model plus AssessmentOverlay. The anchor Scene is `equal-volume-material-samples`. MODEL presentation is ratio-quantitative (`ρ = m / V` table), not an energy chain and not a force/motion board. Production UI, deterministic physics code, SceneAdapter, and E2E are not part of this change.

**Why:** Scene 04 must enter the one-pass implementation pipeline only after readiness. The ID already existed; inventing a second density ID would split the ontology.

**Consequence:** `validatePhysicsModelReadiness` can return `IMPLEMENTATION_READY` for this model. Library `metadata.status` stays `draft`. UPLP and L-level semantics are unchanged.

---

## D032 — Scene 04 one-pass implementation

**Date:** 2026-09-11

**Decision:** Implement Scene 04 (`equal-volume-material-samples` / `density-mass-volume`) in one pass after the readiness gate returned `IMPLEMENTATION_READY`. MODEL representation is a ratio-quantitative board. Production transfer pair is one successful `full-model` (cups or irregular stone) plus hollow `boundary-contrast`. Official correctness, physics outcomes, and L-levels remain app-owned. Library `metadata.status` stays `draft`.

**Why:** This is the first production validation of `spec/prompts/implement-physics-model.md`. The protocol forbids stage-by-stage prompts unless a stop condition is actually triggered. No schema, runtime, physics, or pedagogy blocker was found.

**Consequence:** Scene 04 walks ENTRY → COMPLETE on the Universal Runtime. UPLP, L-level semantics, and Scene 01/02/03 student-visible behavior are unchanged. No universal `sceneId` branch was added. Tests demonstrate prototype-level engineering, not educational validation.

---

## D033 — Scene 04 ratio-reasoning refinement

**Date:** 2026-09-12

**Decision:** Strengthen Scene 04 MODEL, Experiment C, and AI_OFF so density evidence requires ratio reasoning, not formula memorization. L4 now needs the same `ρ = m / V` to explain same-volume, same-mass, and uniform-cut proportional invariance, plus a C13 sufficiency check that mass increase alone does not determine density. AI_OFF rejects “same material, so density unchanged” as strongest independent evidence.

**Why:** The first production sitting could accept a correctly assembled formula plus isolated slogans. That is weaker than the model’s deep structure.

**Consequence:** UPLP, L-level derivation, and Scene 01/02/03 are unchanged. `dmv-M2` signals now include “质量变大，所以密度一定变大.” Library status stays `draft`.

---

## D034 — Physics Model Quality Review is separate from readiness and engineering

**Date:** 2026-09-12

**Decision:** Create `spec/physics-model-quality-review.md` as the single source of truth for Physics Model pedagogical and learning-evidence quality. Gate A (PRE) asks whether a model is physically correct, pedagogically meaningful, bounded, and worth implementing. Gate B (POST) asks what the implemented student actions actually evidence. Quality review is mandatory for new production models and is not the Readiness Gate, not engineering tests, and not learner validation.

**Why:** Scene 04 showed that a correct formula, a passing evaluator, and a green Playwright path can still accept weaker-than-intended reasoning. That distinction lived in conversation history. Future reviewers must be able to repeat PRE/POST review from project-owned specs alone.

**Consequence:** New production models follow design → PRE quality review → readiness → one-pass implementation → engineering gates → POST quality review → quality-reviewed prototype → future learner validation → `validated`. `IMPLEMENTATION_READY` does not imply `MODEL_QUALITY_PASS`. A POST pass does not mark a model learner-validated. UPLP, L-level semantics, Universal Runtime, and existing Scene student-visible behavior are unchanged.

---

## D035 — specific-heat-capacity filled for PRE quality review

**Date:** 2026-09-12

**Decision:** Fill the existing Library ID `specific-heat-capacity` as a complete Physics Model plus AssessmentOverlay. The candidate anchor Scene is `equal-mass-heated-samples`. MODEL presentation is a quantitative product/ratio board (`Q = c m ΔT`), not Scene 01's energy chain and not a force/motion board. Production UI, deterministic physics code, SceneAdapter, and E2E are not part of this change.

**Why:** Gate A requires a filled canonical model before implementation. The ID already existed in family G4; inventing a second specific-heat ID would split the ontology.

**Consequence:** The model is prepared for PRE Physics Model Quality Review. Library `metadata.status` stays `draft`. Scene 01/02/03/04 student-visible behavior is unchanged. The model is not learner-validated.

---

## D036 — specific-heat-capacity PRE refinements applied

**Date:** 2026-09-12

**Decision:** Apply only the five Gate A refinements for `specific-heat-capacity`: missing controls on `causalRelations`; locked six-part L4 evidence; heating-time as an explicit Q approximation; coastal/car non-transfer required; AI_OFF rejection of material-name-only conclusions. No production Scene.

**Why:** The first PRE review returned `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. Those items were design locks, not new physics.

**Consequence:** The model remains `draft`. UPLP, L-level semantics, Universal Runtime, and Scene 01–04 behavior are unchanged.

---

## D037 — specific-heat-capacity prepared for implementation readiness

**Date:** 2026-09-12

**Decision:** Finalize `equal-mass-heated-samples` as the production anchor Scene for `specific-heat-capacity`. Write the Scene spec, official numerical boundary, production sitting, and MODEL product/ratio contract. Do not implement React, SceneAdapter, a registered physics engine, routes, or E2E.

**Why:** PRE quality review has passed. The implementation protocol requires a SceneDefinition, named deterministic engine, overlay, and physics boundary before one-pass Scene work. The PRE-approved relation and L4 lock must not be weakened to satisfy readiness.

**Consequence:** `validatePhysicsModelReadiness` can return `IMPLEMENTATION_READY` for this model and Scene. Library `metadata.status` stays `draft`. UPLP, L-level semantics, Universal Runtime, and Scene 01–04 student-visible behavior are unchanged.

---

## D038 — Scene 05 one-pass implementation

**Date:** 2026-09-12

**Decision:** Implement `equal-mass-heated-samples` as a complete UPLP Scene for `specific-heat-capacity` in one pass on the Universal Runtime. MODEL UI is a product/ratio board for `Q = c m ΔT`, not Scene 02's energy chain, Scene 03's force board, or Scene 04's density table.

**Why:** PRE review passed and readiness returned `IMPLEMENTATION_READY`. The implementation protocol's default is one pass from ENTRY to COMPLETE.

**Consequence:** Engineering may claim a quality-review-pending prototype after tests. Library `metadata.status` stays `draft`. The model is not learner-validated. UPLP and Scene 01–04 student-visible behavior are unchanged.

---

## D039 — specific-heat-capacity Gate B: shortcut found

**Date:** 2026-09-12

**Decision:** Record POST Learning Evidence Review for `specific-heat-capacity` / `equal-mass-heated-samples` as `LEARNING_EVIDENCE_SHORTCUT_FOUND`. Do not treat the Scene as a quality-reviewed prototype. Do not promote Library `metadata.status` to `validated`.

**Why:** Live weakest-pass probes show formula-only and slogan-only MODEL fail, but the required ice TRANSFER can pass with only the core relation and “两边都还在加热。”, and the required ice AI_OFF can pass with eight vague Han characters plus post-check clicks. Those are weaker than the intended L5 boundary and L6 independence claims.

**Consequence:** Scene 05 remains a draft engineering prototype. Later repair of ice TRANSFER and ice AI_OFF is a separate request. UPLP, L-level semantics, Universal Runtime, and Scene 01–04 student-visible behavior are unchanged.

---

## D040 — Scene 05 Gate B evidence repair

**Date:** 2026-09-12

**Decision:** Repair only the Gate B blockers for `equal-mass-heated-samples`: ice boundary-contrast transfer, ice AI_OFF pre-commit provenance, and physics-noun sandwiches. Add the general Quality Review rule that post-check evidence cannot retroactively substitute for missing pre-commit reasoning. Do not change UPLP or L1–L6 derivation.

**Why:** Gate B found that ice TRANSFER and ice AI_OFF could pass without condition-aware boundary evidence, and that noun lists such as “质量温度能量都有。” could count as a relation.

**Consequence:** Ice L5/L6 now require structured pre-commit boundary evidence. Library `metadata.status` stays `draft`. The model is not learner-validated. Scene 01–04 student-visible behavior is unchanged.

---

## D041 — Canonical Physics Model lifecycle status

**Date:** 2026-09-12

**Decision:** `PhysicsModel.metadata.status` is the canonical lifecycle maturity of a Physics Model as a project artifact. Schema §20 owns the field, allowed values (`draft | prototype | validated | production`), and transition semantics. The Library owns the current value of each model. Gate results (`MODEL_QUALITY_PASS`, `IMPLEMENTATION_READY`, `LEARNING_EVIDENCE_*`) remain local answers and are not enum values.

`draft` covers everything before a quality-reviewed prototype, including PRE PASS, `IMPLEMENTATION_READY`, a complete Scene, and an engineering-complete implementation.

`prototype` may be written only after (1) a complete production Scene for that primary model, (2) Engineering PASS, and (3) POST `LEARNING_EVIDENCE_PASS` or `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. `BLOCKED`, `OVERCLAIM`, and `SHORTCUT_FOUND` must not promote. The write is inventory finalization after POST, not an inference before POST.

`validated` requires real learner evidence under the future Learner Validation protocol. PRE, readiness, Scene completion, tests, Engineering PASS, POST PASS, AI review, and `prototype` are not sufficient.

Use “engineering-complete implementation” for Scene + engineering contracts without POST PASS. Reserve “quality-reviewed prototype” for POST PASS / PASS_WITH_REFINEMENTS.

**Why:** Draft vs prototype was ambiguous. Lifecycle diagrams implied `POST → prototype`, while Library narratives, Scene 04’s worked example, and several decisions kept `draft` and called engineering PASS “prototype-level engineering.” That made `metadata.status` unreadable as maturity.

Engineering PASS is insufficient because it verifies contracts, not learning-evidence claims. POST PASS / PASS_WITH_REFINEMENTS is the prototype boundary because Gate B is the project-owned check that the implementation can actually evidence the intended student actions. `PASS_WITH_REFINEMENTS` is allowed because remaining risks are named and non-blocking. `validated` stays reserved so a quality-reviewed prototype is not mistaken for learner proof.

**Consequence:** `density-mass-volume` and `specific-heat-capacity` are promoted to `prototype` on repository evidence. Scene 01–03 primary models stay `draft`; Scene 02/03 are `POST_REVIEW_REQUIRED`. Scene 01 has no filled `model.ts` status to invent; the coverage matrix is aligned to `draft`. UPLP, L-level derivation, physics/evaluators, and student-visible Scene behavior are unchanged.

---

## D042 — Scene 02 Gate B evidence repair

**Date:** 2026-09-12

**Decision:** Repair only the Gate B blockers for `four-stroke-engine`: steam partial-structure transfer authorship, and AI_OFF pre-commit provenance for work-relation and locked-mechanism condition evidence. Do not change UPLP, L1–L6 derivation, Universal Runtime, or the canonical Physics Model.

**Why:** POST found that steam TRANSFER could pass with isolated tokens such as “化学能 / 来源 / 不一定”, and that AI_OFF could accept generic committed text while manufacturing `identifiesWorkRelation` / `identifiesConditionOrBoundary` from post-check clicks.

**Consequence:** Steam L5 now requires structured transferable / non-transferable judgments plus authored structural distinction. AI_OFF L6 now requires those critical independent flags in the committed response; post-check may confirm, not create them. Rerun POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`, so inventory may write `metadata.status = "prototype"`. The model is not learner-validated. Scene 01 and Scene 03–05 student-visible behavior is unchanged.

---

## D043 — Scene 03 Gate B evidence repair

**Date:** 2026-09-12

**Decision:** Repair only the Gate B blockers for `horizontal-force-cart`: target-specific full-model transfer, hover zero-net-force boundary authorship, and AI_OFF pre-commit provenance. Do not change UPLP, L1–L6 derivation, Universal Runtime, MODEL L4, or the canonical Physics Model.

**Why:** POST found that bicycle TRANSFER could pass with an unrelated opposite-force card plus “好好” / “合力”, that hover could pass with generic text, and that AI_OFF could accept generic committed text while manufacturing motion / force / boundary flags from post-check clicks.

**Consequence:** L5 now requires the case-appropriate state + condition + consequence relation. L6 now requires those critical independent flags in the committed response; post-check may confirm, not create them. Rerun POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`, so inventory may write `metadata.status = "prototype"`. The model is not learner-validated. Scene 01–02 and Scene 04–05 student-visible behavior is unchanged.

---

## D044 — Evidence Design Contract

**Date:** 2026-09-12

**Decision:** Create `spec/evidence-design-contract.md` as the single owner of how implementation evidence must justify a cognitive claim. Formalize provenance, relation-over-token, target-specific transfer evidence, transfer-mode evidence semantics, stage-completion ≠ mastery, authorship floors ≠ understanding, claim-bounded structured UI, weakest-pass testing, and Evidence Claim Design. Evidence Claim Design is an implementation activity, not a `metadata.status` value and not a Gate result.

Quality Review continues to own WHETHER claims are justified. Schema continues to own `transferMode` and L1–L6 meanings. UPLP continues to own stage semantics. Implementation Protocol and the implement/review prompts point to the contract instead of duplicating the rules.

**Why:** Scenes 02, 03, and 05 independently rediscovered the same evaluator shortcuts: post-check manufacture of independent reasoning, token/noun-sandwich “relations,” generic authorship floors, and transfer not bound to the actual target. Those rules were scattered across POST artifacts and repairs. A future model would repeat them unless one document owned the design contract.

**Consequence:** Future production models design evaluators against this contract before implementation completion. Scene 02–05 student-visible behavior, evaluators, UPLP, L1–L6 semantics, and `metadata.status` are unchanged by this decision.

---

## D045 — Scene 01 legacy model reconstruction and PRE review

**Date:** 2026-09-12

**Decision:** Reconstruct `energy-internal-energy-temperature` as a filled canonical Physics Model. Separate the microwave-bread phenomenon from the reusable energy-transfer → internal-energy change → temperature-may-change structure. Keep `metadata.status = "draft"`. Record PRE as `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. Do not migrate or repair the existing Scene 01 adapter in the same pass.

**Why:** Scene 01 predates the current production model system. Its UI, keyword gates, three-box MODEL, transfer set, and empty accumulator cannot be treated as the Physics Model. The Library ID already existed and needed a real definition before any later migration.

**Consequence:** The canonical model, overlay design, and PRE artifact now exist. Scene 01 student-visible behavior, evaluators, accumulator, tests, UPLP, L1–L6 semantics, and Universal Runtime are unchanged. Prototype promotion is not authorized.

---

## D046 — Scene 01 readiness and Evidence Claim Design

**Date:** 2026-09-12

**Decision:** Resolve PRE refinements A and B at design time, run `validatePhysicsModelReadiness` for `energy-internal-energy-temperature` / `microwave-bread`, and record Evidence Claim Design in `spec/scenes/microwave-bread/evidence-claim-design.md`. Required production transfer pair is kettle full-model + ice boundary-contrast. Rubbing hands stays outside the required pair. AI_OFF A is ordinary independent application; AI_OFF B is the energy-in boundary check. Microwave EXPERIMENT is an ordinary within-boundary case and must not prove “energy always raises T.” Readiness result is `IMPLEMENTATION_READY`. `metadata.status` remains `draft`. Do not migrate the running Scene in this pass.

**Why:** PRE `MODEL_QUALITY_PASS_WITH_REFINEMENTS` is not readiness. The reconstructed model needed a sitting lock, L1–L6 evidence contracts, and a minimum migration scope before any evaluator or UI rewrite. Starting from legacy gates would have preserved keyword floors, unbound transfer, and the empty accumulator.

**Consequence:** A later one-pass or evidence-split migration may implement the designed contracts. Scene 01 student-visible behavior, evaluators, physics runtime, adapter, accumulator implementation, AI, persistence, E2E, UPLP, L1–L6 semantics, and `metadata.status` are unchanged by this decision. Prototype promotion is not authorized.

---

## D047 — Scene 01 focused legacy migration

**Date:** 2026-09-12

**Decision:** Implement the already-approved Evidence Claim Design for `energy-internal-energy-temperature` / `microwave-bread`. Replace DESCRIBE, PREDICT commit, EXPERIMENT closure, EXPLAIN, MODEL, TRANSFER, EXAM, AI_OFF, the Scene-owned accumulator, AssessmentOverlay wiring, and E2E. Keep the microwave renderer, deterministic heating approximation, Universal Runtime, `sceneId`, `sceneData` persistence, and adapter architecture. Keep `metadata.status = "draft"`. Do not run POST or promote to `prototype` in this pass.

**Why:** Readiness and Evidence Claim Design were complete. The running Scene still used legacy keyword/length gates, rubbing-hands as a required transfer, neighboring-model exam items, and a no-op accumulator. Those could not justify L2–L6.

**Consequence:** Scene 01 now accumulates official flags only through student action → raw attempt → deterministic evaluator → accumulator → `deriveModelEvidenceLevel`. Rubbing hands, `explanationLevel` 0–4, and neighbor exam items are outside the required path. UPLP, L1–L6 meanings, transferMode semantics, and microwave physics are unchanged. POST Quality Review must run independently before any prototype inventory write.

---

## D048 — Scene 01 prototype inventory finalization

**Date:** 2026-09-12

**Decision:** After POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`, write Library / canonical `metadata.status = "prototype"` for `energy-internal-energy-temperature`. Do not change Scene behavior, evaluators, UI, tests of learning behavior, UPLP, L1–L6, or the POST result. Do not write `validated` or `production`.

**Why:** D041 allows inventory promotion only after POST `PASS` or `PASS_WITH_REFINEMENTS`. Engineering PASS and readiness were not enough. The POST artifact already exists and remains the authorizing Gate B result.

**Consequence:** Scene 01 is a quality-reviewed prototype. It is not learner-validated. Student-visible behavior is unchanged by this inventory write.

---

## D049 — Five-Scene prototype milestone synthesis

**Date:** 2026-09-12

**Decision:** Record `spec/milestones/five-scene-prototype-synthesis.md` as the project-level reading of Scenes 01–05. The five prototypes are sufficient for an architecture milestone (`DIVERSITY_SUFFICIENT_FOR_ARCHITECTURE_MILESTONE`). They are not learner validation. Scene 06 information value is medium and is not the next step. Recommended next step is `LEARNER_VALIDATION_PREP`, then a small observation, then a later choice between a new-category Scene 06 and further learner work.

**Why:** Implementation momentum would favor Scene 06. The repository’s own open questions (O001–O003, O007) and POST residuals (structured UI too leading) are learner-behavior unknowns. Another same-family Scene would mostly show that the pipeline can be run again.

**Consequence:** No UPLP, Schema, Evidence Design, L1–L6, Scene behavior, evaluator, or `metadata.status` change. No new lifecycle enum. All five models remain quality-reviewed prototypes, not `validated`.

---

## D050 — Learner validation prep protocol

**Date:** 2026-09-12

**Decision:** Record a thin first-observation protocol in `spec/learner-validation/learner-validation-prep.md` and a review template in `spec/learner-validation/templates/first-session-review.md`. First observation Scene is Scene 03 (`horizontal-force-cart` / `force-changes-motion-state`). Scene 04 remains a candidate second observation. No product code, evaluator, Scene behavior, UPLP, L1–L6, Evidence Design Contract, or lifecycle enum change. No model is marked `validated`. Current `localStorage` session JSON is sufficient; no analytics or identity collection.

**Why:** D049 set `NEXT_STEP = LEARNER_VALIDATION_PREP`. The highest-risk unknown is whether a Grade-9 learner constructs and transfers a model or only follows structured UI. A first watch needs questions, observer non-teaching rules, a rescue valve, and a way to inspect existing session fields without building telemetry.

**Consequence:** One informal observation may proceed on Scene 03 with an anonymous session label, an observation sheet, and a post-session review. Official L-levels stay derived product evidence, not learner-validation claims. Scene 03 `metadata.status` remains `prototype`.

---

## D051 — First learner observation execution guide

**Date:** 2026-09-12

**Decision:** Record `spec/learner-validation/first-learner-observation-guide.md` as the operational HOW for the first real Grade-9 observation of Scene 03. Prep remains WHY/WHAT. The session-review template remains HOW to record one session. No Scene, evaluator, UI, runtime, UPLP, L1–L6, Evidence Design Contract, or `metadata.status` change. No analytics. No identity collection. No `validated` claim.

**Why:** D050 prepared the protocol. A parent / observer still needs a repeatable sequence: reset, opening script, classify stuck moments, save raw notes and JSON first, then review product evidence against observed thinking before any product change.

**Consequence:** The first observation may be executed from this Guide. Scene 03 remains a quality-reviewed prototype. One completed or stopped session is evidence discovery, not learner validation.

---

## D052 — Cross-Scene student UI contract audit

**Date:** 2026-09-12

**Decision:** Audit Scene 01–05 against `spec/student-ui-interaction-contract.md`. Repair presentation and interaction (visible questions, missing-vs-incorrect feedback, Tutor CTA “给我一点提示”) without changing evaluators, UPLP, L1–L6, or AI_OFF provenance. Dual hint systems (Tutor panel + stage hint ladder) stay separate. Recorded in `spec/student-ui/cross-scene-ui-audit.md`.

**Why:** Students were inferring questions from unlabeled option groups and treating silent blocked MODEL submits as broken buttons.

**Consequence:** Level A/B UI regression only. No PRE/POST rewrite. No `validated` claim. Dual-hint provenance left unchanged (U9 report only).

Evidence completion (same date, no product change): `spec/student-ui/cross-scene-ui-audit-evidence.md`. U9 targeted review = `NO_EVIDENCE_REGRESSION`. Formal POST rerun = NO.

---

## D053 — Physical Representation Integrity contract

**Date:** 2026-09-12

**Decision:** Create `spec/physics-representation-integrity-contract.md` as the owner of whether student-visible physics representations preserve quantity identity, units, relations, and provenance. Scene 05 (`equal-mass-heated-samples`) PRI-05-01 is the worked example. Wire the contract into the implementation protocol and the default implement-physics-model request for **new** Scenes and targeted repairs. Do not open a Scene 01–05 full PRI audit. Do not change Scene 01–05 runtime as part of establishing the contract.

**Why:** Scene 05 showed that Physics Truth can PASS while `ΔT 10℃ → 30℃` still states the wrong relation. That class of defect needs a named owner, separate from interaction quality and evidence design.

**Consequence:** Future Scenes must bind displayed values to official runtime functions and must not put different quantities on opposite ends of a state-change arrow. Existing Scene 01–04 are not auto-audited. Scene 05 remaining findings PRI-05-02 / 03 / 04 stay open and non-blocking. PRE/POST are not rerun. `metadata.status` unchanged.

Default Scene-scoped review request: `spec/prompts/review-physics-representation-integrity.md`.

---

## D054 — Scene 06 primary is `ohms-law`

**Date:** 2026-09-12

**Decision:** Scene 06 primary Physics Model is the existing Library ID `ohms-law`. Fill the canonical definition, quantitative contract, PRI plan, evidence-claim preview, tutor boundaries, and PRE. Do not create a new model ID. Do not implement the Scene. Do not run Readiness. Do not promote `metadata.status`.

**Why:** Scenes 01–05 do not cover a circuit relation model. The architecture value of Scene 06 is a new electricity / circuit relational structure, not another thermal or density clone, and not an electricity survey. Formula memory of `I = U / R` is not the cognitive target.

**Consequence:** Intended Scene id is `simple-resistor-circuit`. `secondaryModels` is empty. Nearby quantity IDs and `series-circuit` / `parallel-circuit` stay out of the teaching target. PRE = `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. Status stays `draft`. Scene 01–05 are unchanged. D049’s “Scene 06 is not the next step” is overridden for this model-definition pass only; it is not learner validation and not a production Scene.

---

## D055 — Scene 06 Evidence Claim Design and Readiness

**Date:** 2026-09-12

**Decision:** Record Evidence Claim Design for `ohms-law` / `simple-resistor-circuit` before any Scene implementation. L4 completeness (six model parts) is not student construction evidence. L6 B diagnoses rearrangement-as-manufacture, not resistivity. Then run the canonical Readiness Gate. Do not implement React, runtime, or evaluator functions. Do not promote `metadata.status`.

**Why:** Human review accepted PRE `MODEL_QUALITY_PASS_WITH_REFINEMENTS` but rejected treating six structured L4 items as construction, and asked to retarget the AI_OFF distractor to the canonical rearrangement misconception.

**Consequence:** Official L4 flag may be set only by one coherent relation construction plus authored control→I bind. Six correct options must fail. “分子变大所以电阻变大” remains a slogan variant of ohm-M2, not a microscopic lesson. Status stays `draft`. Scene 01–05, UPLP, and L1–L6 meanings are unchanged.

---

## D056 — Scene 06 one-pass production implementation

**Date:** 2026-09-12

**Decision:** Implement Scene 06 (`simple-resistor-circuit`, primary `ohms-law`) as one UPLP pass behind the existing Scene adapter boundary. Do not add universal `sceneId` / `ohms-law` branches in `progression.ts`, `tutor-request.ts`, or `useTutor`. Do not change Scene 01–05, UPLP, or L1–L6 meanings. Keep `metadata.status = draft` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`.

**Why:** Readiness was `IMPLEMENTATION_READY`. This is the first Scene implemented natively under the current UPLP, Evidence Design, PRI, and Student UI contracts. Authored L4/L5/L6 still use deterministic regex gates; that residual shortcut risk is recorded, not promoted away.

**Consequence:** Production route is `/scenes/simple-resistor-circuit`. Student-visible current comes from `officialCurrentA`. Six-click MODEL fails L4. Required transfer pair and both AI_OFF challenges are implemented. No `validated` claim. No electricity-survey widening.

---

## D057 — Scene 06 prototype inventory finalization

**Date:** 2026-09-12

**Decision:** After POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` and the targeted authored-evidence adversarial probe PASS, write Library / canonical `metadata.status = "prototype"` for `ohms-law`. Do not change Scene behavior, physics, UI architecture, PRI, UPLP, L1–L6, or the POST result. Do not write `validated` or `production`. Stop new Scene development after this inventory write.

**Why:** Schema §20 / D041 allow inventory promotion only after a complete production Scene, Engineering PASS, and POST `PASS` or `PASS_WITH_REFINEMENTS`. The authored-evidence probe closed the named residual that physically incorrect or token-only text could pass L4/L5/L6 because keywords were present. Memorized-correct-pattern residual remains and is accepted as `PASS_WITH_REFINEMENTS`.

**Consequence:** Scene 06 is a quality-reviewed prototype. It is not learner-validated. Student-visible behavior is unchanged by this inventory write. No Scene 07 is authorized.

---

## D058 — Scene 01–06 abstraction audit

**Date:** 2026-09-12

**Decision:** Record `spec/architecture/scene-01-06-abstraction-audit.md` as architecture discovery only. Recommendation is `START_HYBRID_DSL_PILOT`. First pilot, if later authorized, is Scene 04 chrome/options. Do not implement a DSL, renderer, or database in this pass. Do not create Scene 07. Do not change UPLP, L1–L6, Evidence Design, PRI, or production Scene behavior.

**Why:** Six quality-reviewed prototypes now exist. About 30–35% of each Scene is repeated stage-shell / hook / exam / AI_OFF code. MODEL boards, physics engines, and authored evaluators are not the same thing and must stay code. A universal Scene renderer would move conditionals into a schema without reducing Gate B risk.

**Consequence:** New Scene development stays stopped. The audit does not promote any model to `validated`. It does not rewrite Scenes 01–06.

---

## D059 — Scene 04 hybrid DSL pilot

**Date:** 2026-09-12

**Decision:** Extract a Scene-04-only typed DSL v0.1 (`lib/scene-dsl/v01.ts`) and three generic stage shells (observe checklist, predict outcome+reason, complete lookback). Move Scene 04 exam/AI_OFF/transfer/observe/describe/explain IDs and chrome copy behind `samplesSceneDsl`. Keep density physics, `SamplesRatioBoard`, nontrivial evaluators, PRI rendering, tutor leaks, and `deriveModelEvidenceLevel` as code. Do not migrate another Scene. Do not create Scene 07.

**Why:** D058 recommended a hybrid pilot on Scene 04 chrome/options. The pilot is valid only if learner-visible behavior stays equivalent and no universal `sceneId` branch appears.

**Consequence:** Student-visible Scene 04 behavior is intended to be unchanged. Recommendation after the pilot is `KEEP_SCENE04_ONLY`. Not learner-validated. UPLP, L1–L6, Evidence Design, and PRI semantics are unchanged.

---

## D060 — Scene 07 starts as convex-lens-imaging model + PRE only

**Date:** 2026-09-12

**Decision:** After the Scene 01–06 abstraction freeze, authorize the first new Physics Model package for canonical ID `convex-lens-imaging`. This pass is canonical inspection, model definition, and PRE Gate A only. Do not implement Scene 07 UI, Scene spec, Scene DSL, or a new generic shell. Keep `metadata.status = draft`. Keep the primary model qualitative/spatial. Exclude `1/f = 1/u + 1/v` as the taught cause. Treat `u = f` as a no-finite-image limit.

**Why:** D057–D059 stopped Scene 07 while the first six prototypes and the shell freeze were recorded. A new domain after that freeze still has to begin with a Library ID and Gate A, not a page. The Grade-9 target is imaging structure, not a mnemonic table and not a thin-lens calculator.

**Consequence:** PRE may pass with refinements. That does not mean `IMPLEMENTATION_READY`, does not write `prototype` or `validated`, and does not authorize Scene 07 implementation. Interaction-shell freeze remains. Nearby optics IDs stay non-primary.

---

