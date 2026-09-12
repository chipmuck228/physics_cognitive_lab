# Physics Model Schema

**Project:** `physics-cognitive-lab`  
**Version:** 0.2.1  
**Status:** Design Contract


## Architecture Contract & Cross-References

This schema is the **WHAT** layer of the three-document architecture contract:

- [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) — HOW students learn a model.
- [`physics-model-schema.md`](./physics-model-schema.md) — WHAT a valid Physics Model contains. **This document is the source of truth for that contract.**
- [`physics-model-library.md`](./physics-model-library.md) — WHICH models exist and how they relate.
- [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md) — shared C1–C14 cognitive-action vocabulary; it does not alter this schema.
- [`physics-model-implementation-protocol.md`](./physics-model-implementation-protocol.md) — how a schema-valid model becomes a Scene; it must not add Physics Model fields here.
- [`physics-model-quality-review.md`](./physics-model-quality-review.md) — whether a schema-valid model's physics, pedagogy, and evidence claims are justified; it must not add Physics Model fields here.

### Source-of-truth boundary

This document exclusively owns the canonical `PhysicsModel` structure, field semantics, completeness rules, model evidence requirements, and model-content organization. It MUST NOT redefine the universal stage sequence or maintain the canonical list of curriculum models. Those belong to the Protocol and Library respectively.

The stage-specific objects in this schema map onto stages defined by the Universal Protocol:

```text
Phenomenon / Scene        → OBSERVE / DESCRIBE
ExperimentDefinition      → PREDICT / EXPERIMENT
causalRelations           → EXPLAIN / MODEL
TransferTarget            → TRANSFER
ExamPattern               → EXAM
IndependentChallenge      → AI_OFF
ModelEvaluator + evidence → progression evidence across stages
```

Every model instance MUST use a canonical model ID registered in `physics-model-library.md` (or add that ID to the Library in the same change).

### Cursor required reading order

```text
1. spec/universal-physics-learning-protocol.md
2. spec/physics-model-schema.md
3. spec/physics-model-library.md
4. spec/physics-model-quality-review.md when quality or evidence claims are reviewed
5. concrete model definition
6. Scene-specific specification
```

Cursor MUST NOT implement a new Scene first and infer the model contract afterward.

---
## 1. Purpose

This document defines the canonical software/content contract for a **Physics Model**.

The product architecture is:

```text
Universal Physics Learning Protocol
        ↓
Physics Model Schema
        ↓
Concrete Physics Model
        ↓
Scene / Experiment / Transfer / Exam / AI / Assessment
```

A Physics Model is a reusable cognitive object, not a chapter, question type, page, or isolated phenomenon.

The app should treat physical cognition as a first-class software object.

---

## 2. Core Type

```ts
export interface PhysicsModel {
  id: string;
  title: string;
  coreIdea: string;

  domain: PhysicsDomain[];
  curriculum: CurriculumMapping;

  quantities: PhysicalQuantity[];
  causalRelations: CausalRelation[];
  energyRelations?: EnergyRelation[];

  conditions: Condition[];
  counterexamples: Counterexample[];
  misconceptions: Misconception[];

  phenomena: Phenomenon[];
  scenes: SceneDefinition[];
  experiments: ExperimentDefinition[];

  transferTargets: TransferTarget[];
  examPatterns: ExamPattern[];

  tutorPolicy: TutorPolicy;
  independentChallenges: IndependentChallenge[];
  modelEvaluator: ModelEvaluator;

  metadata: PhysicsModelMetadata;
}
```

---

## 3. Model Identity

### `id`

Use stable, lowercase, kebab-case IDs.

Good:

```text
energy-internal-energy-temperature
chemical-energy-internal-energy-mechanical-energy
heat-transfer-direction
specific-heat-capacity
mechanical-work-energy-transfer
```

Do not use:

- Chinese display names as IDs
- textbook chapter numbers
- Scene names
- UI page names
- question numbers

A model ID represents the reusable physical structure.

### `title`

Human-readable model name. Student-facing localization may be Chinese while the internal ID remains English.

### `coreIdea`

The smallest reusable physical idea the student should be able to call in a new situation.

Example:

```text
Energy entering a system can change its internal energy/state and, under
appropriate conditions, produce a temperature change.
```

It must not merely repeat a chapter title.

---

## 4. Physics Domain

```ts
type PhysicsDomain =
  | "mechanics"
  | "energy"
  | "thermal"
  | "electricity"
  | "magnetism"
  | "optics"
  | "sound"
  | "pressure"
  | "matter"
  | "measurement";
```

A model may belong to more than one domain.

---

## 5. Curriculum Mapping

```ts
interface CurriculumMapping {
  grade: number[];
  units: string[];
  concepts: string[];
  formulas?: string[];
  requiredExperiments?: string[];
  examFrequency?: "low" | "medium" | "high";
}
```

Curriculum mapping is metadata around the model. It must not define the model itself.

Exact coverage should be validated against the target textbook/version and examination requirements.

---

## 6. Physical Quantities

```ts
interface PhysicalQuantity {
  id: string;
  name: string;
  symbol?: string;
  unit?: string;

  role:
    | "input"
    | "state"
    | "observable"
    | "controlled"
    | "derived";

  studentLanguage: string[];
  misconceptions?: string[];
}
```

Examples include temperature, time, power, mass, force, displacement, pressure, voltage, current, and resistance.

The model should explicitly distinguish:

- what the student can control,
- what can be observed,
- what describes system state,
- what is derived.

---

## 7. Causal Relations

```ts
interface CausalRelation {
  from: string;
  to: string;

  relation:
    | "causes"
    | "changes"
    | "transfers"
    | "converts"
    | "depends-on";

  direction?: "increase" | "decrease" | "bidirectional";
  conditions?: string[];
}
```

A model must encode the deep structure rather than only vocabulary.

Example:

```text
energy enters system
    ↓
internal energy/state changes
    ↓
temperature may change
```

---

## 8. Energy Relations

```ts
interface EnergyRelation {
  source: string;
  destination: string;

  mechanism:
    | "heat-transfer"
    | "work"
    | "conversion"
    | "mixed";

  description: string;
  conditions?: string[];
}
```

Use this whenever energy transfer or conversion is central.

The schema must not encode scientifically misleading statements such as “heat is stored inside an object.”

---

## 9. Conditions and Constraints

```ts
interface Condition {
  id: string;
  description: string;

  importance:
    | "essential"
    | "important"
    | "contextual";
}
```

Students should learn not only a relationship, but **when it is valid**.

Examples:

- fixed material,
- fixed mass,
- negligible heat loss,
- object in thermal contact,
- circuit closed,
- small deformation,
- idealized model assumptions.

Conditions are part of the model, not optional decoration.

---

## 10. Counterexamples and Boundaries

```ts
interface Counterexample {
  scenario: string;
  whyModelFails: string;
  requiredNewModel?: string;
}
```

Counterexamples prevent overgeneralization.

Example:

```text
A substance absorbs energy during a phase change but its temperature may
remain approximately constant.
```

This distinguishes:

```text
energy enters
```

from the incorrect rule:

```text
energy enters → temperature must rise
```

---

## 11. Misconceptions

```ts
interface Misconception {
  id: string;
  statement: string;
  diagnosticSignals: string[];

  severity:
    | "low"
    | "medium"
    | "high";

  recommendedInterventions: TutorIntervention[];
}
```

Every misconception should include:

1. what the misconception is,
2. signals that suggest it,
3. how the tutor should respond,
4. what evidence would indicate repair.

Misconception detection must not itself advance the learning stage.

---

## 12. Phenomena

```ts
interface Phenomenon {
  id: string;
  title: string;
  description: string;

  modelRole:
    | "anchor"
    | "supporting"
    | "transfer";

  observableChanges: string[];
  relatedVariables: string[];
}
```

Distinguish:

```text
Model      = reusable physical structure
Phenomenon = real-world manifestation
Scene      = interactive implementation
Exam       = another representation of the model
```

One model may explain many phenomena.

---

## 13. Scene Definition

```ts
interface SceneDefinition {
  id: string;

  primaryModel: string;
  secondaryModels?: string[];

  phenomenonId: string;

  visualType:
    | "interactive"
    | "simulation"
    | "observation"
    | "exam";

  controllableVariables: string[];
  observableVariables: string[];

  experimentOperations: ExperimentOperation[];
  physicsEngine: string;

  targetEvidence: EvidenceRequirement[];
}
```

The Scene owns the physical world.

The LLM must never decide deterministic physical outcomes.

`primaryModel` is required and MUST be a canonical ID from `physics-model-library.md`. `secondaryModels` is optional and MUST also use canonical Library IDs.

A learning loop should normally require construction of only one primary model.

---

## 14. Experiment Definition

```ts
interface ExperimentDefinition {
  id: string;
  question: string;

  controllableVariables: string[];
  fixedVariables: string[];
  predictedVariables: string[];

  allowedOperations: ExperimentOperation[];
  expectedEvidence: ExperimentEvidenceSpec[];

  informationGain:
    | "low"
    | "medium"
    | "high";
}
```

`expectedEvidence` MUST satisfy the canonical EXPERIMENT evidence contract defined in [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md). This Schema does not redefine the stage sequence or evidence-flow semantics.

Model-specific experiment definitions may specify variables, operations, expected evidence, and information gain, but stage progression rules remain owned by UPLP.

---

## 15. Transfer Targets

```ts
type TransferMode =
  | "full-model"
  | "partial-structure"
  | "boundary-contrast";

interface TransferTarget {
  id: string;

  level:
    | "near"
    | "medium"
    | "far"
    | "exam";

  scenario: string;

  surfaceFeatures: string[];
  deepStructure: string[];

  transferMode: TransferMode;

  expectedModelId?: string;
  transferableRelations?: string[];
  nonTransferableRelations?: string[];
  requiresConditionCheck?: boolean;
}
```

`transferMode` records how much of the source model is expected to apply:

- `full-model` — the whole model applies. `expectedModelId` is required and MUST be a canonical Library ID.
- `partial-structure` — only some causal/energy relations apply. Encode them in `transferableRelations` and `nonTransferableRelations`. Do not require the student to pretend the complete source model applies.
- `boundary-contrast` — the case is designed to show that the model should not be fully applied.

This does not create a new Physics Model ID. It does not change UPLP transfer-stage semantics.

How implemented transfer evidence must justify each mode is owned by [`evidence-design-contract.md`](./evidence-design-contract.md). This schema owns the field meanings, not the evaluator-design rules.

Transfer difficulty should be controlled by changing surface features while preserving or deliberately modifying deep structure.

Suggested progression:

```text
core model
→ near transfer
→ medium transfer
→ far transfer
→ exam representation
→ independent transfer
```

---

## 16. Exam Patterns

```ts
interface ExamPattern {
  id: string;

  format:
    | "multiple-choice"
    | "fill-blank"
    | "short-answer"
    | "calculation"
    | "diagram"
    | "experimental";

  representation: string;
  testedModel: string;

  commonDistractors?: string[];
  requiredReasoning: string[];

  difficulty:
    | "basic"
    | "medium"
    | "advanced";
}
```

Exam questions are another representation of physical models:

```text
REALITY → MODEL → EXAM REPRESENTATION
```

Exam assessment should store final answer and reasoning separately.

Where appropriate, the interaction sequence should be:

```text
What is this question mainly testing?
        ↓
Which physical relationship/model is relevant?
        ↓
Answer/options
        ↓
Reasoning
```

---

## 17. Tutor Policy

```ts
interface TutorPolicy {
  allowedActionsByStage: Record<LearningStage, TutorAction[]>;

  answerLeakageRules: string[];
  hintLadder: HintLevel[];
  misconceptionStrategies: MisconceptionStrategy[];

  maxExplanationLength?: number;
}
```

Recommended actions:

```ts
type TutorAction =
  | "ASK"
  | "HINT"
  | "CHALLENGE"
  | "ENCOURAGE"
  | "EXPLAIN";
```

The tutor should generally provide one useful question, hint, challenge, or reflection rather than a long lecture.

### Hint ladder and protected-stage semantics

The canonical hint progression, protected-stage behavior, and answer-leakage semantics are defined in [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md). This Schema only allows a model to provide model-specific hint/intervention content through `hintLadder`, `answerLeakageRules`, and `misconceptionStrategies`.

Model configuration MUST NOT weaken the universal stage policy. The application must validate LLM output against UPLP before presenting it to the student.

---

## 18. Independent Challenge / AI_OFF

```ts
interface IndependentChallenge {
  id: string;

  scenario: string;
  unfamiliarity:
    | "low"
    | "medium"
    | "high";

  question: string;
  expectedModelId: string;

  requiredEvidence: EvidenceRequirement[];

  llmAllowed: false;
}
```

AI_OFF is the final validation that the student can use the model independently.

During AI_OFF:

- no tutor component,
- no LLM request,
- no hidden AI-generated hint,
- no AI progression decision,
- no answer leakage.

This must be enforced at application level.

---

## 19. Model Evaluator

```ts
interface ModelEvaluator {
  evaluateDescription(
    input: StudentResponse
  ): EvaluationResult;

  evaluateExplanation(
    input: StudentResponse
  ): EvaluationResult;

  evaluateModel(
    input: StudentModelAttempt
  ): ModelEvaluation;

  evaluateTransfer(
    input: StudentTransferAttempt
  ): TransferEvaluation;
}
```

The evaluator should use explicit evidence requirements rather than “sounds correct.”

TypeScript `modelEvaluator.requiredComponents` is a **model-owned** map from component id to student-facing requirement. It is not a universal energy-conversion checklist. A force/motion model must name force, motion-state, direction-relation, and boundary components; it must not be forced to fill `identifiesEnergySource` and related energy-chain keys.

Suggested cognitive levels:

```text
L0  无关 / 无法解释
L1  能描述现象
L2  能识别关键物理量
L3  能识别物理关系
L4  能建立因果模型
L5  能在新情境调用模型
L6  能独立解决新问题
```

These levels are derived from **accumulated structured evidence** across stages, not from a single free-text match:

- L1 — observation/description evidence
- L4 — MODEL-stage construction of a valid causal model
- L5 — successful TRANSFER evidence in addition to a valid causal model
- L6 — successful AI_OFF evidence with the LLM disabled

A correct final answer or keyword overlap alone is insufficient evidence for L4–L6. Keyword matching may supply diagnostic signals; it must not assign mastery.

---

## 20. Metadata

```ts
interface PhysicsModelMetadata {
  version: string;
  author?: string;

  status:
    | "draft"
    | "prototype"
    | "validated"
    | "production";

  sourceReferences: string[];
  lastReviewedAt?: string;
  notes?: string[];
}
```

`PhysicsModel.metadata.status` is the **canonical lifecycle maturity of the Physics Model as a project artifact**.

This Schema owns the field, the allowed values, and the lifecycle semantics below.  
The Library owns the **current** status of each canonical model.  
Quality Review owns PRE/POST **results**. Those results are not `metadata.status` values.  
The Implementation Protocol owns how a ready model becomes a Scene.  
Engineering tests own implementation-contract verification.  
Future Learner Validation owns evidence for `validated`.

Do **not** add `implementation-ready`, `MODEL_QUALITY_PASS`, or `LEARNING_EVIDENCE_*` to this enum.

### Lifecycle

```text
draft
  ↓
PRE Quality Review
  ↓
Readiness
  ↓
Implementation
  ↓
Engineering PASS
  ↓
POST Quality Review PASS / PASS_WITH_REFINEMENTS
  ↓
prototype
  ↓
future Learner Validation
  ↓
validated
  ↓
future production decision
  ↓
production
```

### `draft`

The canonical Physics Model is still somewhere before completion of the prototype lifecycle.

It may be under model design, PRE reviewed, implementation-ready, partially implemented, an **engineering-complete implementation**, or blocked by a quality gate.

The following do **not** promote `metadata.status` out of `draft`:

- PRE Quality PASS
- `IMPLEMENTATION_READY`
- a complete Scene
- TypeScript / Vitest / Playwright success
- Engineering PASS

### `prototype`

Eligible only after all of:

1. at least one production Scene implementing that primary model is complete;
2. required Engineering Gates pass;
3. POST Learning Evidence Review returns `LEARNING_EVIDENCE_PASS` or `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`.

Promotion is an inventory finalization **after** that POST result. It is not inferred before POST.

These POST results must **not** promote to `prototype`:

- `LEARNING_EVIDENCE_BLOCKED`
- `LEARNING_EVIDENCE_OVERCLAIM`
- `LEARNING_EVIDENCE_SHORTCUT_FOUND`

`PASS_WITH_REFINEMENTS` may promote because remaining risks are explicitly non-blocking and recorded.

Terminology:

- **engineering-complete implementation** — complete Scene + engineering contracts/tests pass; POST has not yet passed.
- **quality-reviewed prototype** — POST is `LEARNING_EVIDENCE_PASS` or `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. The model is then eligible for `metadata.status = "prototype"`.

Do not call Engineering PASS alone “prototype-level engineering”.

### `validated`

Requires real learner evidence under the future Learner Validation protocol.

The following are **not** sufficient:

- PRE Quality PASS
- `IMPLEMENTATION_READY`
- complete Scene implementation
- TypeScript / Vitest / Playwright success
- Engineering PASS
- POST Quality PASS
- AI reviewer approval
- quality-reviewed prototype / `metadata.status = "prototype"`

Do not invent learner-validation criteria here.

### `production`

Later than `validated`. A future production-release / scaled-use decision. Detailed promotion criteria are not defined here.

---

## 21. Recommended Content Layout

```text
content/
└── physics-models/
    ├── energy-internal-energy-temperature/
    │   ├── model.yaml
    │   ├── misconceptions.yaml
    │   ├── experiments.yaml
    │   ├── transfer.yaml
    │   └── exam.yaml
    │
    └── chemical-energy-internal-energy-mechanical-energy/
        ├── model.yaml
        ├── misconceptions.yaml
        ├── experiments.yaml
        ├── transfer.yaml
        └── exam.yaml
```

Code should consume model definitions instead of hard-coding pedagogy independently into every Scene.

---

## 22. Completeness Checklist

A model is not complete unless it defines:

- `coreIdea`
- physical quantities
- causal relations
- conditions/constraints
- counterexamples/boundaries
- misconceptions + interventions
- at least one anchor phenomenon
- at least one meaningful experiment
- transfer targets
- exam representations
- tutor policy
- AI_OFF independent challenge
- model evaluator/evidence requirements

If a required core item is missing:

```text
DO NOT MARK MODEL COMPLETE
```

---

## 23. Cursor Implementation Contract

When Cursor adds a new Physics Model, implement in this order:

```text
1. Create model definition
2. Validate physical quantities
3. Define causal relations
4. Define conditions
5. Define misconceptions + interventions
6. Define anchor phenomenon
7. Implement Scene
8. Implement experiment evidence closure
9. Implement transfer targets
10. Implement exam representation
11. Implement tutor policy
12. Implement AI_OFF challenge
13. Implement evaluator
14. Add tests
15. Integrate with universal Learning Engine
```

Never use this workflow:

```text
build page first → add physics model later
```

The model is the source of truth.

---

## 24. Architectural Boundary

```text
APP = TRACK
LLM = ENGINE
STUDENT = THINKER
```

### App owns

- deterministic physical state
- physics engine
- learning state machine
- evidence
- progression
- model definition
- assessment rules
- AI guardrails

### LLM owns

- adaptive language
- questions
- hints
- challenges
- reflection
- reasoning diagnosis

### Student owns

- observation
- prediction
- explanation
- model construction
- transfer
- final independent problem solving

This separation is mandatory for every Physics Model.
