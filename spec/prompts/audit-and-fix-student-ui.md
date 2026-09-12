# Cursor Prompt — Cross-Scene Student UI Contract Audit and Repair

Use this prompt exactly for the Scene01–05 UI baseline pass.

---

## Mission

Audit and repair student-facing interaction quality across Scene01–05 using the project's canonical contracts.

This is **not** a Physics Model redesign.

Do not rerun or rewrite PRE/POST artifacts unless the changes actually alter evidence/model semantics.

Primary goals:

1. make every question explicit;
2. make every primary action understandable;
3. eliminate silent blocked actions;
4. make Tutor affordance semantics clear;
5. add automated cross-Scene UI contract tests;
6. produce screenshot evidence for human review;
7. identify, but do not silently resolve, any change that affects L4/L5/L6 evidence semantics.

---

## Required reading

Read in this order:

1. `PROJECT_BRAIN.md`
2. `spec/SPEC_ALIGNMENT_MANIFEST.md`
3. `AGENTS.md`
4. `spec/student-ui-interaction-contract.md`
5. `spec/universal-physics-learning-protocol.md`
6. `spec/evidence-design-contract.md`
7. `spec/physics-model-quality-review.md`
8. `spec/physics-model-implementation-protocol.md`
9. relevant Scene/model specs for Scene01–05
10. relevant existing UI/runtime tests
11. `DECISION_LOG.md`

Do not infer intended learning semantics from current UI bugs.

---

## Scope

Audit:

```text
Scene01 microwave-bread
Scene02 four-stroke-engine
Scene03 horizontal-force-cart
Scene04 equal-volume-material-samples
Scene05 equal-mass-heated-samples
```

Stages:

```text
ENTRY
OBSERVE
DESCRIBE
PREDICT
EXPERIMENT
EXPLAIN
MODEL
TRANSFER
EXAM
AI_OFF
COMPLETE
```

---

## Step 1 — Build an inventory before changing code

For every Scene/stage, identify:

```text
task heading
question groups
inputs
primary CTA
secondary CTA
Tutor CTA
validation feedback
success feedback
blocked feedback
loading state
AI_OFF/COMPLETE Tutor state
```

Produce an issue matrix before broad refactoring.

Classify each issue:

```text
U1 Missing task semantics
U2 Ambiguous action semantics
U3 Silent blocked action
U4 Incorrect feedback semantics
U5 Tutor interaction ambiguity
U6 AI_OFF/COMPLETE boundary violation
U7 Accessibility/control association
U8 Scene-specific wording/layout
U9 Evidence-impacting interaction
```

Also classify:

```text
P0 / P1 / P2 / P3
Shared / Local
Evidence impact: NONE / POSSIBLE / YES
```

---

## Step 2 — Add automated UI contract checks

Add tests that fail when:

```text
interactive response group has no visible question/label
primary CTA has empty/ambiguous text
invalid submit produces no visible feedback
valid submit produces no visible state change
async action has no visible pending state
Tutor CTA meaning is ambiguous
Tutor exists in AI_OFF
Tutor exists in COMPLETE
radio/checkbox group is orphaned from its prompt
```

Prefer shared helpers instead of 5 copies.

Do not create a second runtime framework.

---

## Step 3 — Explicit Scene04 regression

In `equal-volume-material-samples` MODEL:

Verify and repair:

1. Under “切开以后，比一比切开前和切开后”, every option group has a visible question.
2. The student can distinguish:
   - mass change;
   - volume change;
   - ratio/density relation.
3. Click “记下关系” with missing input:
   - visible feedback required.
4. Click with invalid/wrong relation:
   - visible bounded feedback required;
   - no silent failure.
5. Click with accepted relation:
   - visible confirmation or progression required.
6. Do not weaken the existing MODEL evidence gate.

Add regression tests for all cases.

---

## Step 4 — Tutor affordance baseline

Across Scene01–05:

Replace ambiguous Tutor semantics such as:

```text
问一句
问我一句
```

with a clear “request a hint” interaction if consistent with current product contract.

Preferred student CTA:

```text
给我一点提示
```

Required behavior:

```text
current stage
+ Scene state
+ student evidence/attempts
+ previous hints
+ stage hint policy
→ one bounded next-step hint
```

Do not implement unrestricted free-chat.

Required stage boundaries:

```text
OBSERVE: attention only, no explanation
DESCRIBE: help identify object/quantity/change, no completed answer
PREDICT: no outcome reveal
EXPERIMENT: clarify control/observation, no result reveal
EXPLAIN: causal prompting, no full explanation
MODEL: point to missing category/condition, do not provide required relation
TRANSFER: prompt comparison, do not state final transferred relation
EXAM: help parse representation, do not reveal answer
AI_OFF: no Tutor
COMPLETE: no Tutor
```

If the existing Tutor architecture cannot support stage-aware hints without changing evidence provenance or architecture, mark U9 and STOP before weakening evidence rules.

---

## Step 5 — Shared component strategy

If the same failure appears in 2+ Scenes, first inspect whether it belongs in a shared primitive such as:

```text
QuestionGroup
PrimaryAction
ValidationMessage
TutorHintPanel
StageShell
ExamQuestionStep
```

Only extract a shared component when semantics are truly shared.

Do not force model-specific MODEL grammars into one universal visual component.

---

## Step 6 — Interaction-path tests

For each affected primary CTA, test:

```text
no answer
partial answer
invalid/wrong answer where meaningful
accepted answer
double click where meaningful
refresh where meaningful
```

Assert:

```text
no/partial/invalid → visible feedback
accepted → visible state change
async → loading/pending state
no click → nothing behavior
```

---

## Step 7 — Screenshot review artifacts

Capture screenshots for each Scene at least at:

```text
OBSERVE
PREDICT
EXPERIMENT
MODEL
TRANSFER
EXAM
AI_OFF
```

Use deterministic test data.

Do not auto-declare screenshots “good”.

Produce them for human review.

---

## Step 8 — Evidence impact gate

Before changing anything that could affect MODEL / TRANSFER / AI_OFF evidence, ask:

```text
Does this change what the student must produce?
Does this change pre-commit vs post-commit provenance?
Does this change evaluator input?
Does this make a hint reveal the protected relation?
Does this change target binding?
Could this change L4/L5/L6 eligibility?
```

If all NO:

```text
Level A/B regression only
```

If any YES/POSSIBLE:

```text
mark U9
implement only the minimum safe UI change
add regression test
report TARGETED EVIDENCE REVIEW REQUIRED
```

Do not rewrite evidence semantics inside this task unless explicitly requested.

---

## Step 9 — Run tests

Run relevant:

```text
Vitest
Playwright
npx tsc --noEmit
```

Also run existing Scene E2E for Scene01–05.

No direct session-state mutation in E2E.

---

## Step 10 — Output

Return exactly:

### A. Inventory
Scenes/stages audited.

### B. Issue matrix
Columns:

```text
Scene
Stage
Contract rule
Issue type U1–U9
Severity P0–P3
Shared/Local
Evidence impact NONE/POSSIBLE/YES
Fix
Status
```

### C. Files created

### D. Files modified

### E. Shared-layer fixes

### F. Scene-specific fixes

### G. Scene04 regression result

### H. Tutor affordance result

### I. Automated UI contract test result

### J. Screenshot artifact list

### K. Typecheck / Vitest / Playwright result

### L. Evidence-impact findings

For every U9 item, state:

```text
Targeted evidence review required: YES/NO
Formal POST rerun required: YES/NO/UNKNOWN
Reason:
```

### M. Explicit confirmations

```text
Physics Model semantics changed: NO
UPLP stage semantics changed: NO
L1–L6 semantics changed: NO
Scene directly assigns L4/L5/L6: NO
AI_OFF Tutor enabled: NO
PRE rerun performed: NO
Historical POST rewritten: NO
Silent blocked primary actions remaining at P0/P1: NO
Unlabeled interactive option groups remaining at P0/P1: NO
```

If any confirmation cannot truthfully be `NO`, STOP and report the blocker instead of hiding it.

---

## Hard stop conditions

STOP if the requested repair would require:

```text
weakening UPLP
changing Physics Model meaning
changing L-level semantics
LLM deciding official correctness
Tutor operating in AI_OFF
new universal sceneId branches
inventing a new evidence pathway
silently changing evaluator meaning
```

---

## Final rule

> Fix the student-facing contract, not just the screenshot. Repeated failures belong at the shared layer; model-specific wording belongs in the Scene; evidence-impacting interaction changes must be surfaced for targeted review rather than silently absorbed.
