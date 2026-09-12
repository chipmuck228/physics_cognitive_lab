# Interaction Shell Contract

> Date: 2026-09-12  
> Kind: architecture contract  
> Status: `SUFFICIENT_EVIDENCE_TO_FREEZE`  
> Does not own: UPLP stage meanings, Physics Model schema, Scene DSL, evidence/L-levels, PRI quantity identity, student-facing copy quality  
> Related: `spec/student-ui-interaction-contract.md` owns whether a student can see the question and act. This contract owns whether reusable React chrome may absorb domain semantics.

This document records the boundary learned from cross-scene reuse of two interaction primitives across three Physics Models. It does not authorize further extraction, a Scene 07 start, or widening `sceneDslV01Schema`.

---

## 1. What an interaction shell is

A reusable **interaction shell** is a presentation + interaction primitive that owns learner-facing UI structure and does not own domain semantics.

It renders a repeated interaction shape. Scene-specific wrappers supply copy, option IDs, and callbacks. Evaluators, physics, and evidence stay outside the shell.

Proven examples:

- `ChecklistObserveTask`
- `OutcomePredictTask`

```text
Same UPLP stage
≠
same interaction shell
```

A shell is identified by **interaction shape**, not by stage name.

OBSERVE in Scene 03, 04, and 05 can share a checklist-plus-demo shell. OBSERVE in Scene 01 (single radio + own words + official result) does not. PREDICT in Scene 03–05 can share an outcome-plus-reason shell. That does not make every PREDICT stage the same primitive.

Do not name a shell after a UPLP stage if the stage has more than one production interaction shape.

---

## 2. Allowed responsibilities

Interaction shells MAY own:

- layout
- generic form controls
- radio / checkbox / text input rendering
- generic locked / disabled state
- loading state
- generic feedback presentation
- CTA rendering
- generic testid / aria plumbing
- callback invocation
- generic visual composition

These are chrome. They must remain parameterizable by props and content from the Scene wrapper.

---

## 3. Forbidden responsibilities

Interaction shells MUST NOT own:

- deterministic physics
- official physics values
- physics calculations
- model-specific formulas
- evaluator logic
- evidence acceptance
- evidence accumulation
- `deriveModelEvidenceLevel`
- L4 / L5 / L6 decisions
- `sceneId` / `modelId` branches
- target-specific transfer semantics
- `transferMode` logic
- MODEL grammar
- AI_OFF pre-commit gates
- AI_OFF post-check rules
- Tutor permissions
- misconception-specific grading
- PRI-sensitive domain representation

If a proposed shell needs one of these, it is not a shell. Keep the logic in Scene/model code.

---

## 4. Data flow

Intended direction:

```text
Scene / model content
        ↓
Scene-specific wrapper
        ↓
Interaction shell
        ↓
student event
        ↓
Scene-specific handler / evaluator
```

The shell must not reverse this direction.

Content does not live inside the generic shell. The shell does not decide sufficiency, compute official values, or write learning-state flags. It invokes callbacks. The wrapper and learning modules interpret those events.

---

## 5. Adoption rule

A Scene may adopt an existing shell only if all of the following hold:

1. The existing interaction shape matches.
2. Differences fit through existing props and Scene content.
3. Shell production code does not need `sceneId` or `modelId` branches.
4. Physics, evidence, and evaluators stay outside.
5. Learner-visible behavior stays equivalent.
6. Generic-shell growth is zero, or a clearly cross-scene presentation parameter (testid, optional aria/id). Domain-specific props are not that.
7. Reuse produces a real reduction in Scene-specific complexity or duplicated chrome.

If a Scene requires adding domain-specific props: **do not force adoption.**

Report the miss. Leave the Scene-specific task in place. Do not grow a proven shell merely to host one more consumer.

Worked drop-ins: Scene 05 then Scene 03 onto `ChecklistObserveTask` and `OutcomePredictTask` with shell production diff `0`.

---

## 6. Extraction rule

A new shell may be extracted only when:

- at least two existing production implementations are materially the same
- the repeated structure is interaction chrome, not domain semantics
- the second real consumer can be identified **before** extraction
- no DSL widening is required
- no evaluator or physics movement is required
- expected net complexity is positive

Prefer adoption of proven shells over creation of new shells.

Duplication of React markup is not sufficient. Two DESCRIBE tasks that both use radio groups are not one `UniversalDescribeTask` if their semantic slots differ and a shared schema would flatten them.

---

## 7. Anti-patterns

Prohibited:

- `UniversalDescribeTask` keyed by `sceneId`
- `UniversalModelBoard`
- a generic shell with `transferMode` branches
- a generic AI_OFF component that owns `canCommit*`
- a generic Exam shell that switches on `pattern.id` internally
- an evidence-predicate string dispatcher inside UI chrome
- moving official physics values into presentational components
- widening `sceneDslV01Schema` because a repeated UI exists
- adding optional props only to force one Scene to fit

Also prohibited: treating `LookbackCompleteView` as universal Complete, or treating QuestionGroup as a stage shell.

---

## 8. Current status

**PROVEN REUSABLE**

| Shell | Interaction shape | Consumers |
|---|---|---|
| `ChecklistObserveTask` | instruction + demo play/pause + checkbox list + needMore/saved + submit | Scene 03, 04, 05 |
| `OutcomePredictTask` | instruction + question + outcome radios + authored reason + lock/committed + submit | Scene 03, 04, 05 |

**PROVEN ATOM**

- `QuestionGroup` — one question bound to one radio group. Not a stage shell.

**CONDITIONAL / NOT GENERAL**

- `LookbackCompleteView` — demonstrated-list + review. Fits Scene 04 (and the same demonstrated-list chrome on Scene 02/03). Does **not** fit Scene 05 Complete, which has no demonstrated list. Do not optionalize demonstrated solely to force Heat/Ohms/Microwave through this view.

**CANDIDATE ONLY**

- `ChoiceGroupsPlusWordsTask` — N labeled radio groups + own words + missing-structure feedback + submit. Possible later chrome for several DESCRIBE tasks. Not extracted. Must not be named `DescribeTask` and must not encode `{object, size, mass}` or other model field keys.

**DO NOT GENERALIZE NOW**

- Transfer
- AI_OFF
- MODEL boards
- Experiment
- Exam World
- structured Explain family

---

## 9. Evidence basis

Production reuse only. Test and spec LOC are not reuse savings.

| Event | Consumer | Primary model | Generic-shell LOC delta | Scene-specific production LOC |
|---|---|---|---|---|
| Original extraction | Scene 04 | `density-mass-volume` | paid once: 197 (87 + 110) | wrappers 92 |
| Second consumer | Scene 05 | `specific-heat-capacity` | **0** | **−78** (170 → 92) |
| Third consumer | Scene 03 | `force-changes-motion-state` | **0** | **−73** (164 → 91) |

This demonstrates reusable **interaction structure**.

It does **not** demonstrate:

- learner learning
- universal stage equivalence
- Scene DSL validation
- that remaining stages should migrate
- that a quality-reviewed prototype is learner-validated

---

## 10. Relation to Scene DSL

```text
Reusable Interaction Shell
≠
Scene DSL
```

Repeated React chrome does not justify declarative schema growth.

`sceneDslV01Schema` remains a separate experiment and boundary. It is Scene-04-shaped. Scene 03 and Scene 05 consume the two proven shells through wrappers and existing content modules. They do not enter that schema.

Do not create `cartSceneDsl`, `heatSceneDsl`, or a generic config registry to “complete” this contract.

---

## 11. Freeze decision

Current abstraction phase status:

**SUFFICIENT_EVIDENCE_TO_FREEZE**

Meaning:

Do not continue extracting shells merely because duplication exists.

Three different Physics Models now share two interaction primitives with zero generic-shell growth on the second and third consumers. That is enough evidence that the primitive is real. It is not a license to harvest the rest of the UI.

Future extraction should be demand-driven by a new Scene, or by an existing pair of demonstrably identical production interactions that already meet the adoption and extraction rules.

After this contract, return to the Physics Model implementation pipeline:

canonical model design → PRE quality review → readiness → Evidence Claim Design → one-pass implementation → PRI check for new quantitative UI → adversarial evaluator tests → engineering gates → POST learning-evidence review.

Do not start Scene 07 from leftover chrome.

---

## 12. Governance

This contract owns **whether reusable interaction chrome may absorb domain semantics**.

It does not own:

- UPLP stage meanings or AI_OFF policy (`universal-physics-learning-protocol.md`)
- Physics Model fields or `metadata.status` (`physics-model-schema.md`, `physics-model-library.md`)
- evidence justification or L-level meaning (`evidence-design-contract.md`)
- student-visible quantity identity (`physics-representation-integrity-contract.md`)
- student-facing question/action quality (`student-ui-interaction-contract.md`)
- how a ready model becomes a Scene (`physics-model-implementation-protocol.md`)

When this document disagrees with a Scene UI file, the designated owners above still win for their domains. This document wins only for the shell-reuse boundary.
