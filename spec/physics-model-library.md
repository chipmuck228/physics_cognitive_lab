# Physics Model Library

**Project:** `physics-cognitive-lab`  
**Version:** 0.2  
**Status:** Initial Model Ontology / Coverage Plan


## Architecture Contract & Cross-References

This library is the **WHICH** layer of the three-document architecture contract:

- [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) — HOW every model is learned and independently validated.
- [`physics-model-schema.md`](./physics-model-schema.md) — WHAT every model must contain.
- [`physics-model-library.md`](./physics-model-library.md) — WHICH models exist, their canonical IDs, coverage, priorities, status, and relationships. **This document is the source of truth for the model inventory.**
- [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md) — shared C1–C14 cognitive-action vocabulary used by mappings; it does not own model IDs.
- [`physics-model-quality-review.md`](./physics-model-quality-review.md) — WHETHER a listed model's physics, pedagogy, and evidence claims are justified. This Library does not own that review.

### Source-of-truth boundary

This document owns:

- canonical Physics Model IDs and model families;
- curriculum/model coverage;
- model priorities and lifecycle status;
- Model Graph relationships;
- anchor-Scene/model mapping at the inventory level.

It MUST NOT redefine the Universal Learning Protocol or the `PhysicsModel` type contract. Those belong to the Protocol and Schema. Each Library entry MUST conform to `physics-model-schema.md`, and each production learning experience MUST teach/validate the model through `universal-physics-learning-protocol.md`.

### Canonical relationship

```text
Curriculum
    ↓
Physics Model Library        ← WHICH
    ↓ instantiate
Physics Model Schema         ← WHAT
    ↓ taught through
Universal Learning Protocol  ← HOW
    ↓
Scene / Experiment / Transfer / Exam / AI_OFF
    ↓
Student Evidence
```

### Cursor required reading order

Before adding a model or Scene:

```text
1. spec/universal-physics-learning-protocol.md
2. spec/physics-model-schema.md
3. spec/physics-model-library.md
4. concrete model definition
5. Scene-specific specification
```

Any new Scene MUST identify a `primaryModel`. If that model is absent from this Library, add the model definition and Library entry before treating the Scene as complete.

---
## 1. Purpose

This document defines the initial Physics Model Library for the product.

The goal is **not** to enumerate every physics phenomenon or every examination question.

The target architecture is:

```text
Curriculum
    ↓
Physics Models
    ↓
Scenes / Phenomena / Experiments / Transfer / Exam Representations
```

Many different surface situations should map to a smaller set of reusable physical models.

Therefore:

```text
Library completeness = model coverage
not phenomenon enumeration
```

Exact Grade 9 coverage varies by textbook/version, region, and examination requirements. The final production library must be validated against the actual target curriculum materials.

---

## 2. What Counts as a Physics Model?

A Physics Model is a reusable causal, relational, quantitative, or representational structure that a student can use to:

1. describe a phenomenon,
2. explain why it occurs,
3. predict what will happen,
4. reason about variables,
5. solve a new problem,
6. recognize the same deep structure in another representation.

Examples:

```text
ρ = m / V
```

is not merely a formula to memorize. It belongs to a density model involving mass, volume, material properties, comparison, conditions, and transfer.

Likewise:

```text
chemical energy → internal energy → mechanical energy
```

is a reusable energy-conversion model, not merely a fact about an engine.

---

## 3. Model Families

The following is an initial ontology. It is a design starting point, not a claim of exhaustive curriculum coverage.

### A. Measurement and Physical Description

Candidate models:

```text
measurement-length
measurement-time
measurement-mass
measurement-temperature
measurement-volume
measurement-error-and-estimation
```

Core cognition:

- identify the physical quantity,
- select a measurement method,
- distinguish quantity from instrument reading,
- use units correctly,
- estimate reasonableness,
- recognize measurement uncertainty.

---

### B. Matter and Density

Primary candidate:

```text
density-mass-volume
```

Deep structure:

```text
mass
volume
material
   ↓
density ρ = m / V
```

Important cognition:

- density is a material-related property under stated conditions,
- distinguish mass, volume, and density,
- compare objects without relying on size alone,
- use proportional reasoning,
- transfer between everyday materials and exam representations.

Potential anchor phenomena:

- identifying materials,
- same-volume objects with different masses,
- same-mass objects with different volumes.

Scene 04 primary model and anchor (quality-reviewed prototype; Library `metadata.status` = `prototype`):

```text
density-mass-volume
Anchor Scene — Equal-volume material samples
Scene spec — spec/scenes/equal-volume-material-samples/
```

The samples are the observable environment. The reusable structure is ρ = m / V. MODEL UI must be a ratio/quantitative table, not Scene 02's energy chain and not Scene 03's force board.

---

### C. Force and Motion

Candidate models:

```text
force-changes-motion-state
force-equilibrium
inertia-motion-state
friction-force
```

Deep structures include:

```text
net force → change in motion state
```

and:

```text
balanced forces → motion state remains unchanged
```

Important cognition:

- distinguish force from motion,
- identify interaction objects,
- identify force direction,
- reason about net effect,
- avoid “motion requires a continuous forward force” misconceptions.

Planned Scene 03 primary model and anchor:

```text
force-changes-motion-state
Anchor Scene — Horizontal Force Cart
Scene spec — spec/scenes/horizontal-force-cart/
```

The cart is the observable environment. The reusable structure is:

```text
object + current motion state
      + net-force condition
      + force direction relative to motion
      → change in motion state
```

This is deliberately not Scene 02's energy-conversion chain. Secondary models `force-equilibrium` and `inertia-motion-state` are supporting only.

---

### D. Pressure

Candidate models:

```text
pressure-force-area
liquid-pressure
atmospheric-pressure
```

Deep structure:

```text
pressure = force / area
```

and, for fluids, pressure relationships governed by the relevant conditions.

Important cognition:

- distinguish pressure from force,
- identify contact area,
- reason about changing one variable while controlling another,
- recognize pressure effects in different surface contexts.

---

### E. Buoyancy

Candidate model:

```text
buoyancy-displaced-fluid
```

Deep structure may connect:

```text
fluid pressure difference
        ↓
buoyant force
        ↓
floating / sinking / equilibrium
```

Important cognition:

- distinguish buoyant force from object weight,
- connect displaced fluid to buoyancy,
- compare forces for floating/sinking states,
- reason about conditions rather than memorize surface rules.

---

### F. Work and Mechanical Energy

Candidate models:

```text
mechanical-work-energy-transfer
kinetic-energy-motion
gravitational-potential-energy
mechanical-energy-conversion
```

Deep structures:

```text
work → energy transfer
```

and:

```text
kinetic energy ↔ gravitational potential energy
```

Important cognition:

- distinguish force from work,
- identify whether displacement occurs,
- track energy rather than memorize isolated formulas,
- connect physical process to energy representation.

---

### G. Thermal Physics

Current and candidate models:

```text
energy-internal-energy-temperature
temperature-microscopic-motion
heat-transfer-direction
internal-energy-change-mechanisms
specific-heat-capacity
phase-change-energy
```

#### G1. Energy → Internal Energy → Temperature

Current Scene 01 primary model. Canonical definition: [`content/physics-models/energy-internal-energy-temperature/`](../content/physics-models/energy-internal-energy-temperature/).

```text
energy transfer into / out of a system
        ↓
internal energy of the system changes
        ↓
temperature may change
```

Anchor Scene:

```text
Microwave Bread
```

The bread and microwave are the observable environment, not the model. The production Scene implements the Evidence Claim Design as a focused legacy migration.

Readiness + Evidence Claim Design exist (`IMPLEMENTATION_READY`; `spec/scenes/microwave-bread/evidence-claim-design.md`). Required production transfer pair is kettle full-model + ice boundary-contrast. Rubbing hands is not a required Scene 01 transfer. Pipeline readiness is not `metadata.status`.

Important boundaries:

- temperature is not energy,
- heat is not a stored substance,
- absorbing energy does not always imply a temperature increase,
- temperature alone does not determine total internal energy.

Library `metadata.status` = `prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Quality-reviewed prototype. Not learner-validated.

#### G2. Heat Transfer Direction

Deep structure:

```text
temperature difference
        ↓
energy transfer from higher-temperature body
toward lower-temperature body
```

Avoid reasoning based on a fictional “amount of heat stored.”

#### G3. Ways to Change Internal Energy

Deep structure:

```text
heat transfer ─┐
               ├→ internal energy changes
doing work ────┘
```

Anchor phenomena may include:

- hot-water bag,
- hammering metal,
- rubbing hands,
- repeated bending,
- compression.

#### G4. Specific Heat Capacity

Canonical ID: `specific-heat-capacity`

The definition now lives in [`content/physics-models/specific-heat-capacity/`](../content/physics-models/specific-heat-capacity/). This is not a duplicate ID.

Model:

```text
Q = c m ΔT
        ↓ equivalently
c = Q / (m ΔT)
```

But student cognition should include:

- variable identification,
- controlled comparison,
- condition checking,
- proportional reasoning,
- interpretation of `c`,
- C13: temperature rise alone does not determine Q.

Production anchor Scene: `equal-mass-heated-samples`  
Same-mass water vs sand, same heating. Do not open with the formula.

Library `metadata.status` = `prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Not learner-validated.

#### G5. Phase Change Energy

Used partly as a boundary/counterexample to simpler temperature-change reasoning.

---

### H. Energy Conversion

Candidate models:

```text
energy-conversion
energy-form-system-description
chemical-energy-internal-energy-mechanical-energy
electrical-energy-conversion
```

#### H1. Chemical → Internal → Mechanical Energy

Planned Scene 02 primary model:

```text
chemical energy
      ↓
combustion
      ↓
gas internal energy/state changes
      ↓
gas does work on piston
      ↓
mechanical energy
```

Anchor Scene:

```text
Four-stroke Internal Combustion Engine
```

The four strokes should support the model rather than become an isolated memorization task:

```text
吸气 → 压缩 → 做功 → 排气
```

Suggested declaration:

```ts
{
  primaryModel: "chemical-energy-internal-energy-mechanical-energy",
  secondaryModels: [
    "force-changes-motion-state",
    "mechanical-work-energy-transfer"
  ]
}
```

Only the primary model should normally be newly constructed in this learning loop.

Scene specification and production loop: [`spec/scenes/four-stroke-engine/`](scenes/four-stroke-engine/).  
Library `metadata.status` = `prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Not learner-validated.

---

### I. Electricity

Candidate models:

```text
electric-current
voltage-potential-difference
electrical-resistance
ohms-law
series-circuit
parallel-circuit
electric-power
electrical-energy
```

Deep structures include:

```text
I = U / R
```

and circuit topology relationships.

Important cognition:

- distinguish current, voltage, and resistance,
- identify what remains common in series/parallel structures,
- reason from circuit structure rather than visual appearance,
- connect electrical quantities to energy/power where appropriate.

---

### J. Magnetism and Electromagnetism

Candidate models:

```text
magnetic-field-interaction
magnetic-effect-of-current
electric-motor
electromagnetic-induction
```

Potential model connections:

```text
electric current
      ↓
magnetic effect
      ↓
force / motion
      ↓
mechanical energy
```

and:

```text
changing magnetic conditions
      ↓
induced electrical effect
```

Exact inclusion should follow the target curriculum.

---

### K. Optics

Candidate models:

```text
light-rectilinear-propagation
light-reflection
light-refraction
plane-mirror-imaging
convex-lens-imaging
```

Important cognition:

- construct ray representations,
- distinguish physical object/image relationships,
- reason from propagation rules,
- connect diagram representation to observable phenomena.

Intended Scene 07 primary (canonical package exists; `metadata.status` = `draft`; PRE only; no production Scene):

```text
convex-lens-imaging
```

Deep structure:

```text
object position relative to F / 2F
        ↓
emergent rays after the convex lens
        ↓
actual convergence / backward extension / no finite meeting
        ↓
image position and properties
```

The five imaging cases are reports of that structure, not the model. `1/f = 1/u + 1/v` is not this Grade-9 primary. `u = f` is a no-finite-image limit. Anchor Scene id, if later implemented: `convex-lens-optical-bench`. Readiness + Evidence Claim Design exist (`IMPLEMENTATION_READY`; `spec/scenes/convex-lens-optical-bench/evidence-claim-design.md`). Pipeline readiness is not `metadata.status`. This Library entry does not authorize Scene 07 implementation by itself. `metadata.status` stays `draft`.

---

### L. Sound

Candidate models:

```text
sound-vibration-source
sound-propagation-medium
sound-pitch-frequency
sound-loudness-amplitude
sound-timbre
```

Deep structures include:

```text
vibration → sound production
```

and:

```text
source vibration + propagation medium → received sound
```

Important cognition:

- distinguish sound source from sound propagation,
- connect pitch to frequency,
- connect loudness to relevant vibration characteristics,
- reason across visible vibration and auditory representation.

---

## 4. Current Priority

### P0 — Core protocol-validation models

```text
energy-internal-energy-temperature
chemical-energy-internal-energy-mechanical-energy
```

These should validate that the Universal Physics Learning Protocol works across two meaningfully different physical models.

### Next strong candidates

```text
density-mass-volume
force-changes-motion-state
pressure-force-area
buoyancy-displaced-fluid
mechanical-work-energy-transfer
ohms-law
series-circuit
parallel-circuit
electric-power
convex-lens-imaging
sound-vibration-source
```

A third implementation should preferably come from a substantially different domain—such as density, force/motion, or circuits—to test whether the architecture is genuinely universal.

---

## 5. Coverage Matrix

Maintain a living coverage matrix.

| Model | Core Scene | Near Transfer | Medium Transfer | Far Transfer | Exam | AI_OFF | Status |
|---|---|---|---|---|---|---|---|
| energy-internal-energy-temperature | Microwave Bread | defined | defined | defined | defined | defined | prototype |
| chemical-energy-internal-energy-mechanical-energy | Four-stroke Engine | defined | defined | defined | defined | defined | prototype |
| density-mass-volume | Equal-volume material samples | defined | defined | defined | defined | defined | prototype |
| force-changes-motion-state | Horizontal Force Cart | defined | defined | defined | defined | defined | prototype |
| specific-heat-capacity | Equal-mass heated samples | defined | defined | defined | defined | defined | prototype |
| ohms-law | Simple resistor circuit | defined | defined | defined | defined | defined | prototype |
| convex-lens-imaging | Convex-lens optical bench (intended) | defined | defined | defined | defined | defined | draft |

The matrix should eventually be generated from model metadata rather than manually maintained.

---

## 6. Model Graph

The long-term structure should be a graph rather than a flat chapter list.

Example energy graph:

```text
Energy
├── Energy Transfer
│   ├── Heat Transfer
│   └── Work
│
└── Energy Conversion
    ├── Chemical → Internal
    ├── Electrical → Internal
    ├── Electrical → Mechanical
    ├── Electrical → Light
    └── Mechanical ↔ Potential / Kinetic
```

Cross-domain connections:

```text
Force
  ↓
Motion
  ↓
Work
  ↓
Energy
```

```text
Electric Current
      ↓
Magnetic Effect
      ↓
Motor
      ↓
Mechanical Energy
```

```text
Light
  ↓
Reflection / Refraction
  ↓
Imaging
```

The graph allows the product to train not only isolated models but model selection and connection.

---

## 7. One Model, Many Scenes

Far transfer may use Schema `transferMode: "partial-structure"` when only part of a model's causal/energy structure applies. That is a TransferTarget setting, not a new model ID.

Do not create a new Physics Model merely because the surface phenomenon changes.

For example:

```text
energy-internal-energy-temperature
```

may appear in:

- microwave bread,
- electric kettle,
- hot-water bag,
- rubbing hands,
- compressed gas,
- heated metal.

These are different phenomena and possibly different transfer mechanisms, but they can share or connect to the same deeper model.

This is how the product scales without becoming a collection of unrelated pages.

---

## 8. One Scene, Multiple Models

A Scene may contain multiple physical relationships.

However, every learning loop should declare:

```ts
primaryModel: string;
secondaryModels?: string[];
```

Example:

```ts
{
  primaryModel: "chemical-energy-internal-energy-mechanical-energy",
  secondaryModels: [
    "force-changes-motion-state",
    "mechanical-work-energy-transfer"
  ]
}
```

The student should not normally be asked to construct five unfamiliar models simultaneously.

Secondary models may be:

- previously learned prerequisites,
- supporting explanations,
- future learning targets,
- transfer connections.

---

## 9. What “Complete Coverage” Means

Do not define completeness as:

```text
every phenomenon
every textbook sentence
every possible exam question
```

Define it as sufficient coverage of:

```text
core curriculum models
+
important conditions/boundaries
+
representative anchor phenomena
+
required/key experiments
+
near/medium/far transfer
+
major exam representations
+
independent model use
```

This produces a tractable ontology while preserving transfer.

---

## 10. Curriculum-to-Model Pipeline

For a target textbook/version:

```text
教材
  ↓
抽取知识点 / 实验 / 公式 / 例题
  ↓
去重
  ↓
识别共同因果结构 / 数量关系
  ↓
聚类
  ↓
Physics Models
  ↓
Model Graph
  ↓
映射教材章节
  ↓
映射考试题型
```

Do not ask Cursor to infer a complete curriculum from general physics knowledge alone.

The textbook and applicable curriculum/examination standards should become authoritative source material.

---

## 11. Exams as a Coverage Validator

Exam questions should validate the model library rather than define the entire product.

Pipeline:

```text
Exam Question
     ↓
Which physical model is required?
     ↓
Map to PhysicsModel.id
```

If a substantial set of representative questions cannot be mapped, investigate whether:

1. a model is missing,
2. a model boundary is wrong,
3. a transfer representation is missing,
4. an exam representation is missing,
5. a cross-model reasoning path is missing.

This turns historical exam material into a **Model Coverage Validator**.

---

## 12. Model Lifecycle

Lifecycle **semantics** are owned by [`physics-model-schema.md`](./physics-model-schema.md) §20.  
This Library owns the **current** `metadata.status` of each canonical model.

`PhysicsModel.metadata.status` remains `draft | prototype | validated | production`.  
`implementation-ready` is the readiness-validator gate, not a schema enum value.  
`MODEL_QUALITY_PASS` and `LEARNING_EVIDENCE_*` are quality-review results, not Library enum values.

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

`IMPLEMENTATION_READY` does not imply `MODEL_QUALITY_PASS`.  
Engineering PASS is an **engineering-complete implementation**. It does not write `prototype`.  
A POST `LEARNING_EVIDENCE_PASS` or `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` makes the model a **quality-reviewed prototype** and eligible for inventory promotion to `metadata.status = "prototype"`.  
`BLOCKED` / `OVERCLAIM` / `SHORTCUT_FOUND` must not promote.  
`prototype` does not mean `validated`. `validated` requires future learner evidence.

---

## 13. Recommended Rollout

### Phase 1 — Validate the protocol

Use:

```text
Scene 01 — Microwave Bread
Model — energy-internal-energy-temperature
```

### Phase 2 — Validate cross-model reuse

Use:

```text
Scene 02 — Four-stroke Internal Combustion Engine
Model — chemical-energy-internal-energy-mechanical-energy
Scene spec — spec/scenes/four-stroke-engine/
```

The goal is to reuse the canonical learning sequence and stage semantics defined in [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md), while changing model content and deterministic physics state.

This Library intentionally does not reproduce the stage sequence because UPLP is the sole source of truth for the universal learning loop.

### Phase 3 — Test a different domain

```text
Scene 03 — Horizontal Force Cart
Model — force-changes-motion-state
Scene spec — spec/scenes/horizontal-force-cart/
```

The production Scene reuses the canonical learning sequence while changing both domain and deep structure: net force and motion-state change, not an energy-conversion chain.

Scene 02 and Scene 03 are quality-reviewed prototypes after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Neither is learner-validated.

If the same architecture survives this change, confidence in the universal protocol increases substantially. Remaining later candidates include density and electric circuits.

How a later model becomes a Scene is owned by [`physics-model-implementation-protocol.md`](./physics-model-implementation-protocol.md).

### Phase 4 — Build coverage matrix

Map the target Grade 9 curriculum to model IDs.

### Phase 5 — Validate with textbook + exams

Use actual curriculum materials as source of truth.

### Phase 6 — Build the Model Graph

Represent prerequisites, related models, superseding models, and cross-domain connections.

### Phase 7 — Build cross-model learning paths

Train students to answer:

```text
What model should I use here?
Why?
Under what conditions?
What other model could be confused with it?
```

This is closer to expert physics cognition than chapter-by-chapter recall.

---

## 14. Cursor Rule

Cursor should never be asked:

```text
“Build the next physics page.”
```

Instead:

```text
“Implement PhysicsModel <id> according to physics-model-schema.md
and the Universal Physics Learning Protocol.”
```

For every new model, Cursor must:

1. load the schema,
2. create/validate model data,
3. implement deterministic physical state,
4. reuse the universal learning state machine,
5. define model-specific evidence,
6. implement transfer,
7. implement Exam World,
8. enforce tutor guardrails,
9. implement AI_OFF,
10. add tests,
11. update the coverage matrix.

The learning protocol remains stable. The Physics Model is the variable.

---

## 15. Final Design Principle

The long-term product should not become:

```text
a large collection of Grade 9 physics pages
```

It should become:

```text
a network of reusable Physics Models
        ↓
students observe them in reality
        ↓
construct them
        ↓
connect them
        ↓
recognize them in unfamiliar situations
        ↓
use them to solve exam and real-world problems independently
```

The target is therefore a **Physics Model Network**, not a question bank.
