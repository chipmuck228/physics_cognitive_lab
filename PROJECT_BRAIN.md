# Physics Cognitive Lab — Project Brain

> Version: 0.1
> Status: Working source of truth
> Last updated: 2026-09-12

## 1. Product Mission

Physics Cognitive Lab is an interactive learning environment designed to help Grade 9 students learn to **think with physics**, not merely memorize formulas or consume AI explanations.

The product should help a student move from:

**real-world phenomenon → physics language → causal relationship → physical model → transfer → independent problem solving**.

The first product hypothesis is that a carefully designed interactive physical environment can help students build a reusable physical model, and that this model can improve performance on unfamiliar real-world situations and exam-style problems.

## 2. Product Is Not

It is not primarily:

- an AI answer machine;
- a photo-solving or answer-search product;
- a chatbot wrapped in a physics UI;
- a traditional question bank;
- a video course;
- a game whose main objective is points, badges, streaks, or speed;
- a full digital textbook;
- a realistic physics simulator for its own sake.

## 3. Core Product Metaphor

> **APP = TRACK**
>
> **LLM = ENGINE**
>
> **STUDENT = DRIVER / THINKER**

The application owns:

- the physical world;
- the learning progression;
- the allowed cognitive actions;
- evidence collection;
- assessment;
- safety and educational guardrails.

The LLM owns:

- language;
- adaptive questioning;
- hints;
- reflection prompts;
- diagnosis of student reasoning;
- conversational scaffolding.

The student owns:

- observation;
- prediction;
- explanation;
- model construction;
- transfer;
- final problem solving.

## 4. Core Learning Loop

The default learning loop is:

1. Observe
2. Describe in physics language
3. Predict
4. Experiment / manipulate
5. Explain
6. Build or revise a physical model
7. Transfer the model to a new situation
8. Translate the model into exam/problem representation
9. Solve independently
10. Reflect

## 5. Core Educational Principle

The product should train **cognitive actions**, not just deliver information.

A student is not considered to have learned a model merely because the student:

- repeated a definition;
- selected the correct answer once;
- used the correct terminology;
- followed an AI solution;
- completed a guided activity.

Stronger evidence includes:

- accurate physical description;
- causal explanation;
- prediction under changed conditions;
- explicit model construction;
- application to a different surface context;
- correct reasoning in exam representation;
- independent performance with AI removed.

## 6. AI Principle

The LLM is a **constrained Socratic scaffold**, not a substitute thinker.

The LLM should generally prefer:

- one useful question;
- a small hint;
- a counterexample;
- a request for explanation;
- a request to compare outcomes;
- a reflection prompt.

The LLM should generally avoid:

- answer dumping;
- long lectures;
- premature formulas;
- performing the current target cognitive action;
- inventing physical outcomes;
- changing the learning sequence.

## 7. Physics Principle

The physical state must be deterministic and application-controlled.

The LLM must never be the source of physical truth.

For any simulation:

**physics rules → deterministic code → observable result → student interpretation → optional LLM scaffolding**.

## 8. Exam Principle

Exam questions are not a separate universe.

They are another representation of physical models.

The product should create a bridge:

**REALITY → MODEL → EXAM REPRESENTATION**

Exam questions should therefore be analyzed by the cognitive actions they require, such as:

- physical description;
- variable identification;
- concept distinction;
- causal reasoning;
- model recognition;
- condition checking;
- qualitative prediction;
- quantitative reasoning;
- transfer.

## 9. Practice Principle

The product does not aim to eliminate practice.

It aims to reduce low-information repetition and replace it with **high-information, structured variation**.

Preferred progression:

**one core model → near transfer → medium transfer → far transfer → exam representation → independent problem solving**.

## 10. MVP

First physical environment:

> **Microwave + bread**

Core question:

> **Why does bread become hot after being heated in a microwave?**

Core learning target:

> energy enters the system → internal energy/state changes → temperature changes

The MVP deliberately does not attempt to teach all microwave physics or all thermal physics.

## 11. MVP Success Hypothesis

The MVP is successful only if there is evidence that students can:

1. describe the phenomenon in physics language;
2. explain the core causal relationship;
3. construct a basic model;
4. use that model in new situations;
5. connect the model to exam-style problems;
6. solve a final problem without AI assistance.

## 12. Non-Goals for MVP

Do not prematurely build:

- authentication;
- parent dashboard;
- teacher dashboard;
- cloud database;
- payments;
- full curriculum;
- full question bank;
- social features;
- leaderboard;
- reward economy;
- native app;
- highly realistic microwave electromagnetic simulation.

## 13. Product Language

Preferred:

- physical model;
- physical reasoning;
- transfer;
- student evidence;
- cognitive action;
- learning environment;
- scaffold;
- independent problem solving.

Avoid overclaiming:

- “mastered physics”;
- “guaranteed score increase”;
- “AI understands the student completely”;
- “scientifically proven” unless supported by actual evidence.

## 14. Source-of-Truth Hierarchy

When documents conflict, use this order:

1. `PROJECT_BRAIN.md` — mission and non-negotiable principles
2. `DECISION_LOG.md` — historical decisions and rationale
3. `/spec/*` — current feature/learning specifications
4. `OPEN_QUESTIONS.md` — unresolved hypotheses
5. `EXPERIMENT_LOG.md` — evidence from real users
6. implementation code — current implementation, not automatically the intended design

If implementation conflicts with the learning specification, fix the implementation rather than silently changing the learning specification.

## 15. Core Research Question

The product ultimately exists to investigate:

> **Can a constrained, interactive physics environment help a student form a transferable physical model that remains usable after AI assistance is removed?**

## 16. Scene Runtime Boundary

Universal progression looks up a `SceneAdapter` by `sceneId`. It must not grow a `sceneId` switch for each new Scene.

`LearningSession.physicsState` is adapter-owned `ScenePhysicsState`. A four-stroke-engine session is not a microwave physics session.

`AssessmentOverlay` owns production exam/AI_OFF answer semantics that the current Physics Model schema does not represent. `PhysicsModel` still owns canonical identities, stems, required evidence, and `llmAllowed`.

Tutor request context (`learningGoal`, physics snapshot, prompt constraint, Scene-specific leak checks) is supplied by `SceneAdapter.getTutorContext` / `looksLikeTutorLeak`. Universal tutor code owns permission policy, AI_OFF/COMPLETE hard block, request lifecycle, and applying guardrails. It must not grow `if (sceneId === …)` branches.

Scene-specific session data lives in `LearningSession.sceneData`. New Scenes must not add `scene03Answers` / `scene04Answers` / microwave-shaped `experimentHistory` as universal top-level fields.

Scene 03 is implemented as Horizontal Force Cart (`/scenes/horizontal-force-cart`) through COMPLETE.

Scene 01 (`microwave-bread`) implements the Evidence Claim Design for `energy-internal-energy-temperature` as a focused legacy migration. PRE is `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. Readiness is `IMPLEMENTATION_READY`. POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. `metadata.status` is `prototype`. Quality-reviewed prototype. Not learner-validated.

## 17. Physics Model Implementation Protocol

How a canonical Physics Model becomes a production Scene is owned by `spec/physics-model-implementation-protocol.md`. UPLP still owns how students learn. Whether physics, pedagogy, and learning-evidence claims are justified is owned by `spec/physics-model-quality-review.md`. How implementation evidence must justify a cognitive claim is owned by `spec/evidence-design-contract.md`. Whether student-visible physics labels preserve quantity identity is owned by `spec/physics-representation-integrity-contract.md`. Scene 05 PRI-05-01 is the worked example. Correct runtime numbers do not imply correct representation. This contract does not start a Scene 01–05 full audit.

Default implementation request: `spec/prompts/implement-physics-model.md` (one pass, ENTRY → COMPLETE).  
Default quality-review request: `spec/prompts/review-physics-model-quality.md` (`MODE=PRE` or `MODE=POST`).

Required lifecycle for a new production model:

```text
canonical model design
  → PRE Model Quality Review
  → fix quality blockers
  → Readiness Gate
  → Evidence Claim Design
  → one-pass implementation
  → adversarial evaluator tests
  → engineering gates
  → POST Learning Evidence Review
  → quality-reviewed prototype
  → metadata.status = prototype
  → future learner validation
  → VALIDATED
```

Quality review is not optional. Gate A asks whether the model is worth implementing. Gate B asks what the implementation actually evidences. Neither gate is learner validation.

`metadata.status` lifecycle semantics are owned by `spec/physics-model-schema.md` §20. The Library owns the current value. Gate results are not enum values.

```text
Correct answer ≠ correct reasoning ≠ constructed model ≠ transfer ≠ independent use
Engineering correctness ≠ pedagogical validity ≠ learner validation
IMPLEMENTATION_READY ≠ MODEL_QUALITY_PASS
engineering-complete implementation ≠ quality-reviewed prototype
prototype ≠ validated
```

Reference implementations for the protocol are Scene 02 (energy/causal chain) and Scene 03 (condition/relation board). MODEL UI is model-owned. Scene 01 uses this model’s energy/state chain plus conditions, not Scene 02’s work/mechanical slots. The Library model `energy-internal-energy-temperature` is a quality-reviewed prototype (`metadata.status = prototype`) after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Not learner-validated.

The Library model `chemical-energy-internal-energy-mechanical-energy` is a quality-reviewed prototype (`metadata.status = prototype`) after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Scene 02 (`four-stroke-engine`) implements ENTRY → COMPLETE. MODEL UI is an energy/causal chain, not Scene 03's force board and not Scene 04/05 ratio boards. Tests passing does not mark the model `validated`.

The Library model `force-changes-motion-state` is a quality-reviewed prototype (`metadata.status = prototype`) after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Scene 03 (`horizontal-force-cart`) implements ENTRY → COMPLETE. MODEL UI is a three-case force/motion relation board, not Scene 02's energy chain and not Scene 04/05 ratio boards. Tests passing does not mark the model `validated`.

The Library model `density-mass-volume` is a quality-reviewed prototype (`metadata.status = prototype`). Scene 04 (`equal-volume-material-samples`) implements ENTRY → COMPLETE. MODEL UI is a ratio-quantitative board (`ρ = m / V`), not Scene 02's energy chain and not Scene 03's force relation board. Valid MODEL evidence requires ratio reasoning, not formula assembly alone. Worked quality-review example: `spec/reviews/examples/density-mass-volume.md`. Tests passing does not mark the model `validated`.

The Library model `specific-heat-capacity` is a quality-reviewed prototype (`metadata.status = prototype`) after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Scene 05 (`equal-mass-heated-samples`) implements ENTRY → COMPLETE. MODEL UI is a quantitative product/ratio board (`Q = c m ΔT`), not Scene 01/02's energy chain, not Scene 03's force board, and not Scene 04's density table. Tests passing does not mark the model `validated`.

The Library model `ohms-law` is a quality-reviewed prototype (`metadata.status = prototype`) after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` and the authored-evidence adversarial probe (D057). Canonical definition lives in `content/physics-models/ohms-law/`. Production Scene id is `simple-resistor-circuit` (D056). PRE is `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. Evidence Claim Design is `spec/scenes/simple-resistor-circuit/evidence-claim-design.md` (D055). L4 completeness is not construction. Not learner-validated. Secondary models: none. `series-circuit` / `parallel-circuit` must not become a second primary. MODEL must not degenerate into reciting `I = U / R` or six structured clicks.

The Library model `convex-lens-imaging` is a quality-reviewed prototype (`metadata.status = prototype`) after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` (D063). Canonical definition lives in `content/physics-models/convex-lens-imaging/`. Production Scene id is `convex-lens-optical-bench`. PRE is `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. Evidence Claim Design is `spec/scenes/convex-lens-optical-bench/evidence-claim-design.md`. L4 is one spatial-ray construction, not a five-row table and not a finished diagram. Thin-lens formula is not a success path. Not learner-validated. Secondary models: none. MODEL UI is Scene-owned and must not copy Scene 01–06 boards.

Scenes 01–07 are quality-reviewed prototypes. Architecture discovery is `spec/architecture/scene-01-06-abstraction-audit.md` (D058). The Scene 04 hybrid DSL pilot is `spec/architecture/scene-04-hybrid-dsl-pilot.md` (D059): `KEEP_SCENE04_ONLY`. Not a universal renderer. Scene 07 did not widen Scene DSL and did not extract an optics shell. Not learner-validated.

A model is implementation-ready only after the readiness gate. Engineering PASS is an engineering-complete implementation and stays `draft`. A POST `PASS` or `PASS_WITH_REFINEMENTS` allows a quality-reviewed prototype and inventory promotion to `prototype`. Validated requires learner evidence under a future validation protocol and is never conferred by unit tests or an AI review.

The first observation protocol is `spec/learner-validation/learner-validation-prep.md` (D050). How to run that observation is `spec/learner-validation/first-learner-observation-guide.md` (D051). They prepare one informal Grade-9 watch of Scene 03. They are not learner validation, not a `validated` write, and not a product instrumentation change.

Student-facing interaction quality is owned by `spec/student-ui-interaction-contract.md`. The Scene 01–05 baseline audit is `spec/student-ui/cross-scene-ui-audit.md` (D052). It does not own UPLP, L-levels, evidence semantics, or physical representation integrity (D053).
