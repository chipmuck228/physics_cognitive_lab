# Interaction Alignment Audit

Status: CANONICAL REVIEW CONTRACT

## 1. Purpose

Interaction Alignment Audit verifies that a designed cognitive task is faithfully executable and visible in the learner-facing product.

It answers:

> Does the implemented interaction actually let the learner perform the cognitive action the learning design says they are performing?

It does NOT prove that the learner understood the physics.

It does NOT replace:
- Physics Model Quality Review
- Evidence Design Contract
- Engineering tests
- Learner Validation

It audits alignment across:

Physics Model
→ Cognitive Task
→ Learner Capability
→ Learner Action
→ Physical / UI Consequence
→ Feedback
→ Progression
→ Evidence input

---

## 2. Three different kinds of correctness

### Engineering correctness

Question:

> Does the software run as implemented?

Examples:
- unit tests
- integration tests
- E2E
- typecheck
- build

### Interaction alignment correctness

Question:

> Do task, action, representation, feedback, progression, and evidence agree with each other?

This contract owns this question.

### Learning effectiveness

Question:

> Does the learner actually understand, construct the model, transfer it, and use it independently?

Only Learner Validation can support this claim.

Passing E2E does not imply Interaction Alignment PASS.

Passing Interaction Alignment does not imply learner understanding.

---

## 3. Required alignment chain

For every meaningful learner subtask, the following chain must be traceable:

```text
Physics / Model Requirement
        ↓
Cognitive Task
        ↓
Required Learner Capability
        ↓
Visible Interaction
        ↓
Semantic Learner Action
        ↓
Authoritative System Consequence
        ↓
Learner-visible Consequence
        ↓
Feedback / Blocked Reason
        ↓
Progression Condition
        ↓
Evidence Input
```

If one link is missing or contradicts another link, the interaction is misaligned.

---

## 4. Six required invariants

### IA-1 Task ↔ Capability Alignment

If the UI asks the learner to perform an action, the current surface must actually provide that capability.

Example failure:

> “遮住透镜上半部”

but there is no visible or executable cover action.

Rule:

```text
requested learner action
→ executable current capability
```

No imaginary actions.

### IA-2 Action ↔ Representation Alignment

A meaningful learner action must produce a learner-visible consequence consistent with the authoritative state.

Example failure:

```text
cover-lens
→ lensPartiallyCovered = true
```

but the rendered lens still looks completely uncovered.

Rule:

```text
authoritative state change
→ faithful visible representation
```

The renderer must not hide, contradict, invent, or silently repair the physical action.

### IA-3 Local ↔ Global Validation Alignment

A local step must not claim completion if its own semantic structure already contradicts the final evaluator.

Example failure:

Step 2 says a ray is complete because all fields are non-empty, but those fields already form an internally inconsistent ray.

Rule:

```text
local completion
→ locally valid structure
```

The final evaluator may still reject cross-step inconsistencies.

Do not weaken the final evaluator.

### IA-4 Progress ↔ Visibility Alignment

If progression requires multiple substeps, trials, or conditions, the learner must be able to see:

- where they are,
- what is complete,
- what remains,
- what happens next.

Example failure:

Four experiment trials are required, but the learner sees only one generic `EXPERIMENT` stage.

Rule:

```text
hidden progression requirement
→ learner-visible progress state
```

### IA-5 Blocked State ↔ Reason Alignment

If the learner cannot continue, the product must expose why in learner language.

Rule:

```text
blocked / disabled
→ visible reason
→ repairable next action
```

Never:
- silent no-op
- unexplained disabled button
- generic “不能继续”

Do not reveal protected answers.

### IA-6 Evidence ↔ Interaction Alignment

Evidence may only depend on learner actions that actually occurred through the intended interaction.

Rule:

```text
claimed evidence
→ attributable learner action
→ correct provenance
```

UI completion, animation, system-generated output, post-check confirmation, or interaction trace alone must not fabricate understanding evidence.

Interaction Trace ≠ Evidence.

---

## 5. Audit unit

Audit the smallest meaningful cognitive subtask.

Not only the UPLP stage.

Examples:

```text
PREDICT / lock prediction
EXPERIMENT / perform intervention
EXPERIMENT / record observation
EXPERIMENT / compare
MODEL / construct ray A
MODEL / classify meeting
EXAM / identify representation
```

A stage may contain several audit units.

---

## 6. Audit record

Use this compact table:

| Field | Audit |
|---|---|
| Stage / Subtask | |
| Cognitive task | |
| Required capability | |
| Visible control / surface | |
| Semantic learner action | |
| Authoritative owner | |
| Expected state consequence | |
| Expected visible consequence | |
| Blocked condition + visible reason | |
| Progression condition | |
| Evidence input / provenance | |
| IA-1 | PASS / FAIL / N/A |
| IA-2 | PASS / FAIL / N/A |
| IA-3 | PASS / FAIL / N/A |
| IA-4 | PASS / FAIL / N/A |
| IA-5 | PASS / FAIL / N/A |
| IA-6 | PASS / FAIL / N/A |

Keep the record concrete.

Do not describe intended behavior when the implementation does something else.

---

## 7. Adversarial audit questions

For each audit unit ask:

1. Does the page ask the learner to do something they cannot actually do?
2. Can the learner act but see no corresponding result?
3. Can a locally invalid structure be marked complete?
4. Can the learner become blocked without knowing why?
5. Can progression depend on hidden work?
6. Can evidence be produced without the intended learner action?
7. Can the UI display a state different from the authoritative physical state?
8. Can React infer success while the Scene/evaluator rejects it?
9. Can the system perform the intended learner action on the learner's behalf?
10. Can a test pass even though a first-time learner would not know the next action?

Any YES requires review.

---

## 8. Verdicts

Use exactly one:

```text
INTERACTION_ALIGNMENT_PASS
INTERACTION_ALIGNMENT_PASS_WITH_REFINEMENTS
INTERACTION_ALIGNMENT_BLOCKED
```

`PASS_WITH_REFINEMENTS` is allowed only when remaining issues do not break the learner's cognitive path.

Examples of BLOCKED:

- requested capability missing
- meaningful physical action invisible
- enabled action silently does nothing
- required progression hidden
- learner cannot repair a rejected state
- local completion contradicts same-level semantic validity
- Evidence can be created without intended learner action

---

## 9. Position in the Physics Model pipeline

The implementation pipeline becomes:

```text
Physics Model
↓
PRE Quality Review
↓
Implementation Readiness
↓
Evidence Claim Design
↓
Interaction Design
↓
Implementation
↓
Engineering Tests
↓
Interaction Alignment Audit
↓
POST Evidence Review
↓
Prototype
↓
Learner Validation
```

Interaction Alignment Audit happens after a real learner-facing implementation exists.

It may also be used during implementation as a development check.

---

## 10. Relationship to E2E

E2E asks:

> Can this scripted path execute?

Interaction Alignment Audit asks:

> Is the learner-facing meaning of that path internally coherent?

E2E should verify known alignment invariants where possible.

Examples:

- requested control exists
- action produces visible response
- blocked action shows reason
- progress is visible
- physical state has corresponding representation

But E2E cannot prove:
- pedagogical clarity
- model understanding
- transfer
- independent learning

---

## 11. Relationship to other contracts

### UPLP

Owns:
- cognitive learning sequence

### Physics Model

Owns:
- canonical physical/model truth

### Evidence Design Contract

Owns:
- what learner behavior may justify a claim

### Learner Interaction Runtime

Owns:
- execution architecture for task, draft, feedback, help, navigation, progress

### Interaction Alignment Audit

Owns:
- whether those layers agree in the implemented learner experience

### Learner Validation

Owns:
- what real learners actually understand and can independently do

---

## 12. Non-goals

This contract must NOT become:

- Scene DSL
- Universal Scene Renderer
- universal Physics UI grammar
- universal evaluator
- automatic pedagogy judge
- learner-validation substitute

It audits alignment.

It does not decide Physics Truth or learning effectiveness.
