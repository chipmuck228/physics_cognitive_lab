# Exam Mapping — Energy, Internal Energy, Temperature

> Version: 0.2 — Aligned
> Source: the Grade 9 review sheet supplied during product design discussion.
> Purpose: Map exam questions to cognitive actions, physical models, misconceptions, and environment training.

## Architecture Contract & Cross-References

This document is an exam-representation mapping layer. It does **not** define Physics Models.

- Canonical Physics Model IDs come only from [`physics-model-library.md`](./physics-model-library.md).
- Model structure and `ExamPattern` fields come from [`physics-model-schema.md`](./physics-model-schema.md).
- EXAM stage semantics, evidence flow, tutor permissions, and AI_OFF boundaries come from [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md).
- Every `primaryModelId` in this document MUST resolve to a canonical Library ID. Natural-language descriptions may be retained as explanatory labels, but they are not model identifiers.

### Cognitive Action Taxonomy ownership

C1–C14 are defined exclusively in [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md). This document references those IDs but does not redefine them.

## 1. Core Principle

An exam question should be represented as:

```text
physical situation
    ↓
problem representation
    ↓
physical quantities / process
    ↓
physical model
    ↓
reasoning
    ↓
answer
```

Exam Performance is not defined as answer recall alone.

Useful cognitive dimensions:

- problem representation;
- physical language;
- concept distinction;
- causal reasoning;
- model recognition;
- condition checking;
- qualitative prediction;
- quantitative reasoning;
- transfer.

## 2. Cognitive Action Taxonomy

This mapping uses the canonical `C1`–`C14` IDs from [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md).

## 3. Supplied Exam Questions

### Q1 — Carbon infiltration / molecular motion

**Surface:**
A heat-treatment process occurs at 900–950°C and carbon atoms enter the surface of steel.

**Primary model ID:** `temperature-microscopic-motion`

**Model label:** Temperature and microscopic random motion.

**Cognitive actions:**
- C1
- C2
- C3
- C9
- C13

**Core understanding:**
Higher temperature is associated with more intense microscopic random motion.

**MVP priority:**
Secondary extension.

---

### Q2 — Temperature, heat, internal energy, particle motion

**Surface:**
A compound statement asks which claims follow when an object's temperature increases.

**Primary model ID:** `energy-internal-energy-temperature`

**Model label:** Distinguish temperature, heat/energy transfer, internal energy, and microscopic motion.

**Cognitive actions:**
- C3
- C4
- C5
- C7
- C13

**Core understanding:**
Related physical quantities must not be treated as interchangeable.

**MVP priority:**
Core.

---

### Q3 — Specific heat capacity

**Surface:**
Compare the heating requirement of materials with different specific heat capacities.

**Primary model ID:** `specific-heat-capacity`

**Model label:** Q = cmΔT.

**Cognitive actions:**
- C3
- C7
- C8
- C9
- C12

**Core understanding:**
Variables must be controlled before making proportional comparisons.

**MVP priority:**
Secondary quantitative extension.

---

### Q4 — Internal energy vs mechanical energy

**Surface:**
Determine which statement about internal energy and mechanical energy is correct.

**Primary model ID:** `energy-form-system-description`

**Model label:** Distinguish energy forms / system descriptions.

**Cognitive actions:**
- C4
- C9
- C13

**Core understanding:**
Different forms of energy are not automatically identical, and change in one does not mechanically imply change in another under every condition.

**MVP priority:**
Core conceptual extension.

---

### Q5 — Heat transfer vs doing work

**Surface:**
Identify which scenario changes internal energy through heat transfer.

Examples include:
- heating iron with a hammer;
- warming hands with a hot-water bag;
- bending wire repeatedly;
- grinding with a wheel.

**Primary model ID:** `internal-energy-change-mechanisms`

**Model label:** Energy transfer mechanism.

**Cognitive actions:**
- C1
- C5
- C6
- C9
- C14

**Core understanding:**
The same outcome, such as temperature increase, can result from different processes.

**MVP priority:**
Core transfer.

---

### Q6 — Temperature, heat, internal energy relationships

**Surface:**
Judge statements such as:
- a higher-temperature object must have more internal energy;
- cooling always means internal energy decreases and heat is released;
- absorbing heat must always increase temperature;
- temperature increase must mean internal energy increases.

**Primary model ID:** `energy-internal-energy-temperature`

**Model label:** Conditions and distinctions among physical quantities.

**Cognitive actions:**
- C3
- C4
- C5
- C7
- C13

**Core understanding:**
Do not infer a universal relationship from a single observed change without checking conditions.

**MVP priority:**
Core.

---

### Q7 — Direction of heat transfer

**Surface:**
Determine the natural direction of heat transfer.

**Primary model ID:** `heat-transfer-direction`

**Model label:** Thermal energy transfer in relation to temperature difference.

**Cognitive actions:**
- C3
- C5
- C7
- C9
- C14

**Core understanding:**
The direction of spontaneous heat transfer is related to temperature difference, not to an imagined “amount of heat stored” in an object.

**MVP priority:**
Core transfer.

## 4. Environment-to-Exam Mapping

| Environment action | Cognitive skill | Exam link |
|---|---|---|
| Observe bread heating | C1 | Q2/Q6 |
| “bread became hot” → “temperature increased” | C2/C3 | Q2/Q6/Q7 |
| Change heating time | C7/C8/C11 | Q3 |
| Change microwave power | C5/C8/C11 | Q2/Q6 |
| Track energy entering system | C5/C6 | Q4/Q5/Q6 |
| Build internal-energy relationship | C4/C9 | Q2/Q4/Q6 |
| Hot-water bag transfer | C6/C14 | Q5/Q7 |
| Rubbing hands | C6/C14 | Q5 |
| Electric kettle | C6/C14 | Q5/Q7 |
| Identify model behind exam question | C9 | All |
| Explain why an option is invalid | C5/C7/C13 | Q2/Q6/Q7 |
| Simple equation/ratio problem | C8/C12 | Q3 |
| Novel independent scenario | C14 | All |

## 5. Exam Mode Design

Exam mode should deliberately look more like a real school test than the exploratory physics world.

Suggested sequence:

1. What physical process is this?
2. Which physical quantities matter?
3. Which relationship/model should be considered?
4. What does each option claim?
5. Which claim is supported by the model?
6. Give a short reason.

## 6. Answer vs Reasoning

Store both:

- selected answer;
- reasoning.

A correct answer with contradictory reasoning should not be treated as equivalent to a correct answer supported by a coherent model.

## 7. MVP Exam Set

Create approximately:

- 3 conceptual multiple-choice questions;
- 1 transfer question;
- 1 simple quantitative question.

Do not build a large bank before the learning mechanism is validated.
