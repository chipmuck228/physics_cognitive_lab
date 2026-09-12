# Physical Representation Integrity Contract

**Project:** `physics-cognitive-lab`  
**Version:** 0.1  
**Status:** Canonical representation contract  
**Pilot / worked example:** Scene 05 `equal-mass-heated-samples` (PRI-05-01)

---

## 1. Purpose

This document answers:

> Does the student-visible representation preserve the identity, value, unit, relationship, and state meaning of canonical physics truth?

It sits between runtime physics and what the student sees:

```text
canonical physics definition
  → runtime state
  → derived physical quantity
  → UI binding
  → rendered student-visible representation
```

Correct runtime numbers do **not** imply a correct representation.

---

## 2. Ownership

| Document | Owns | Does not own |
|---|---|---|
| Physics engine / `physics-boundary` / Scene `physics-state.md` | Canonical values and official calculations | How those values are labeled on screen |
| [`student-ui-interaction-contract.md`](./student-ui-interaction-contract.md) | Task intent, questions, CTA, blocked-action feedback, Tutor affordance | Quantity identity, units, arrows |
| [`evidence-design-contract.md`](./evidence-design-contract.md) | How a cognitive claim is justified | Whether a dish/label states the right quantity |
| [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) | Stage meanings, tutor / AI_OFF policy | Display grammar for T₀ / ΔT / T |
| [`physics-model-implementation-protocol.md`](./physics-model-implementation-protocol.md) | HOW a ready model becomes a Scene | PRI rules themselves |
| **This document** | Student-visible physics identity, units, relations, provenance of displayed values | UPLP, L1–L6, evaluators, lifecycle, interaction chrome |

When documents disagree: physics-boundary owns numbers; this document owns whether the UI states those numbers as the right quantities.

This is **not** a `metadata.status` value and **not** a PRE/POST Gate result.

---

## 3. Core distinctions

```text
Physics Truth
≠ Numerical Consistency
≠ Runtime Calculation Integrity
≠ Physical Representation Integrity
≠ Interaction Correctness
≠ Learner Comprehension
```

A Scene may PASS Physics Truth and still FAIL or need refinement on this contract.

Do not merge these verdicts.

---

## 4. Invariants

### PRI-01 — Quantity identity

Every displayed value must correspond to one named physical quantity.

Flag any label that visually implies a different quantity than the bound runtime field.

### PRI-02 — Runtime value consistency

```text
displayed value
  → component binding
  → runtime physical state
  → canonical source or official function
```

The shown number must equal the runtime value. Do not inspect screenshot literals alone.

### PRI-03 — Unit integrity

Correct unit for the quantity. No unit mismatch. No concatenation that collapses two quantities into one unit phrase.

Temperature **state** and temperature **change** may both use ℃. That does not make them the same quantity.

### PRI-04 — Relationship semantics

Arrows, equals, grouping, before/after layouts, and captions must describe a physically valid relation.

If an arrow expresses a state change, **both endpoints must be the same physical quantity**.

```text
T₀ → Tfinal     allowed
ΔT → Tfinal     forbidden
```

Individually correct numbers may still form a false or ambiguous statement.

### PRI-05 — State / derived-value provenance

Classify every student-visible quantitative value as one of:

```text
INPUT
PHYSICAL_CONSTANT
RUNTIME_STATE
DERIVED_QUANTITY
```

Do not author a second production copy of a derived value in the UI.

### PRI-06 — Representation must not create new physics meaning

The UI must not combine correct values into a false, ambiguous, or unintended physics statement.

Examples:

- ΔT shown as if it were initial temperature
- final temperature shown as if it were part of ΔT
- energy and heating time visually conflated
- the same symbol used for two quantities in one visual group

---

## 5. Display-source rule

Student-facing physics values must travel:

```text
canonical physics → runtime state → official derived functions → UI
```

Forbidden in production display code:

```ts
const initial = 20
const final = 30
const delta = 10
```

Tests may state expected values. Production components must not hardcode those results.

---

## 6. Verdicts

Issue taxonomy:

| Code | Meaning |
|---|---|
| PRI-A | Quantity identity mismatch |
| PRI-B | Numeric mismatch |
| PRI-C | Unit mismatch |
| PRI-D | Relationship semantics error |
| PRI-E | State / derived-value ambiguity |
| PRI-F | Duplicate truth source |
| PRI-G | Documentation / runtime mismatch |

Severity:

| Sev | Meaning |
|---|---|
| P0 | Presents physically false information |
| P1 | Likely causes the student to infer the wrong physical meaning |
| P2 | Ambiguous or drift-prone, not currently false |
| P3 | Wording / format cleanup only |

Scene-level representation verdict (keep separate from Physics Truth):

```text
PASS
PASS_WITH_REFINEMENTS
PASS_WITH_ISSUES
FAIL
```

`PASS_WITH_REFINEMENTS` means blocking P0/P1 representation defects are closed, and only non-blocking findings remain.

A PRI repair that does not change physics, evaluators, evidence provenance, or L4–L6 does **not** require PRE/POST rerun.

---

## 7. Future Scene workflow

This contract is in force for **new** production Scenes and for **targeted** repairs. It does **not** authorize an immediate Scene 01–05 full audit.

### 7.1 New Scene (default)

During UPLP UI implementation, for every student-visible quantitative readout:

1. Name the quantity.
2. Bind it to runtime state or an official function.
3. Give it a unit.
4. If using an arrow, check PRI-04.
5. Add at least one representation regression that fails if ΔT and T (or the Scene's analogous pair) are glued onto one arrow.

Do not open a full PRI audit of older Scenes as part of implementing a new one.

### 7.2 Existing Scene 01–04

No bulk audit in this decision. Open a Scene-scoped review only when a representation defect is observed or requested.

Default request: [`prompts/review-physics-representation-integrity.md`](./prompts/review-physics-representation-integrity.md). One Scene per request unless the user asks otherwise.

### 7.3 Scene 05 (pilot)

Worked example only. Remaining open findings PRI-05-02 / 03 / 04 are not a mandate to audit other Scenes.

---

## 8. Worked example — Scene 05 PRI-05-01

Pilot Scene: `equal-mass-heated-samples`  
Primary model: `specific-heat-capacity`  
Canonical numbers: [`content/physics-models/specific-heat-capacity/physics-boundary.ts`](../content/physics-models/specific-heat-capacity/physics-boundary.ts)

Physics Truth audit: [`scenes/equal-mass-heated-samples/physics-truth-audit.md`](./scenes/equal-mass-heated-samples/physics-truth-audit.md) = **PASS**  
PRI audit: [`scenes/equal-mass-heated-samples/physical-representation-integrity-audit.md`](./scenes/equal-mass-heated-samples/physical-representation-integrity-audit.md)

### 8.1 Runtime truth (unchanged)

Same-mass, same-heating:

| Sample | T₀ | Q | ΔT = Q/(c·m) | T = T₀+ΔT |
|---|---|---|---|---|
| water | 20 ℃ | 4200 J | 10 ℃ | 30 ℃ |
| sand | 20 ℃ | 4200 J | 50 ℃ | 70 ℃ |

### 8.2 Defect

Displayed:

```text
ΔT 10℃ → 30℃
ΔT 50℃ → 70℃
```

Runtime meaning: left token = ΔT, right token = Tfinal. Arrow joined **different** quantities. T₀ = 20 ℃ was not shown. A Grade-9 student could read “from 10 ℃ to 30 ℃”.

```text
Physics Truth: PASS
Physical Representation Integrity: defect (PRI-A / PRI-D / PRI-E, P1)
```

Not an evaluator defect. Not an L4–L6 defect.

### 8.3 Repair

Targeted display change only. Same official functions.

```text
温度：20℃ → 30℃
升温：10℃

温度：20℃ → 70℃
升温：50℃
```

Arrow endpoints are both temperature **state**. ΔT is a separate change line.

PRI-05-01 = **CLOSED**.  
Overall Scene 05 PRI = **PASS_WITH_REFINEMENTS** (PRI-05-02 / 03 / 04 remain).

PRE rerun: NO. POST rerun: NO.

### 8.4 What this example does not settle

- Scene 01–04 temperature / energy / force labels
- Whether every Scene must show T₀
- Interaction-contract issues (questions, CTAs, Tutor)
- Remaining Scene 05 P2/P3 findings

---

## 9. Tests (future Scenes and targeted repairs)

When a Scene shows quantitative physics:

- rendered change quantity is not the left side of a state arrow
- if an arrow is used, both ends are the same quantity
- displayed values equal runtime / official functions
- production display source contains no UI-side physics literals for those results

Do not treat a happy-path E2E count as a PRI pass.

---

## 10. Confirmations for this contract decision

```text
Scene 01–05 runtime changed: NO
Full Scene 01–05 PRI audit opened: NO
Physics / evaluator / L1–L6 / UPLP semantics changed: NO
PRE/POST rewritten: NO
metadata.status changed: NO
```
