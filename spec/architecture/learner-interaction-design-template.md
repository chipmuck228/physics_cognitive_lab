# Learner Interaction Design Template

> Date: 2026-09-13  
> Kind: pre-implementation worksheet  
> Status: DESIGN  
> When: after Evidence Claim Design, **before** React coding for a new or rebuilt Scene  
> Does not replace: UPLP, Physics Model, Evidence Claim Design, PRI, Interaction Shell Contract

Fill one row-block per UPLP stage the Scene implements (minimum OBSERVE → EXAM; also ENTRY / AI_OFF / COMPLETE as short forms).

Do **not** paste Physics Truth tables, official formulas, or evaluator implementations into this file.

---

## 0. Scene header

```text
Scene id:
Primary model id:
Author:
Date:
Reference Interaction Plan version: v1
```

Constraints already decided (do not reopen here):

- UPLP stage meanings
- official physics
- evaluators / L-claim design
- AI_OFF evidence rules
- Scene DSL freeze
- Interaction Shell freeze

---

## 1. Per-stage block

Copy this block for each stage.

```text
### Stage: OBSERVE | DESCRIBE | PREDICT | EXPERIMENT | EXPLAIN | MODEL | TRANSFER | EXAM | AI_OFF | COMPLETE | ENTRY

Cognitive objective
  What the student must think or do (one sentence). UPLP action, not the official result.

Student question
  The exact question the learner is answering now.
  One learner-facing question. Not the official answer.

Expected response shape
  The form of thinking / output expected. Examples:
  - choose one state
  - compare A and B
  - object + quantity + change
  - when ___ changes, ___ changes
  - cause → mechanism → consequence
  - construct one relation
  - select relation + write own words
  Do NOT put the official answer here.

Context
  现在是什么情况

Goal
  这一步要解决什么

Focus
  先看 / 比较什么

Visible capabilities
  List only controls that will actually be on screen.
  Mark each: working-path | review-preview | hidden-in-review | blocked+reason

Visible references
  Learner-visible objects / representations that help may mention now
  (screen, image, ray, meter, arrow, …). Visibility only — no Physics Truth.

Surface justification
  Why each important visible element belongs on this screen now.
  Trace: Physics Model → current cognitive objective → current evidence
  requirement → current learner task. If an element cannot be traced, it
  does not belong.

Protected future structure
  What the learner must not see yet (later-stage grammar, official
  diagram, finished table, hidden official rays, exam options, …).

Student action
  The primary thing they do (manipulate, select, write, construct, return).

Primary CTA meaning
  What exactly will happen when the main action is used
  (evaluate + write evidence + maybe advance; run physics; save draft
  step; …). Not a second copy of the button label.

Response type
  applied | committed | advanced | missing | rejected | blocked | loading | system-error | review-applied | discarded

Draft ownership
  persisted-key | ephemeral | none
  Hydrate when: progress / experiment-id / committed-count — never on help.

Evaluator
  Name only of the existing or planned Scene/model evaluator.
  Do not write the predicate.

Feedback mapping
  failureKind or gate → missing | inconsistent | think_again | blocked
  Student sentence (no official choice).

Help intents
  Only intents whose actions/controls/objects/cues are in the current
  VisibleInteractionContext (capabilities + references).
  AI_OFF / COMPLETE: none.

Revisit behavior
  If viewed later: preview physics? which controls stay? what is discarded on return?

Cognitive trace output
  What process event is worth recording (not an L-level).

Progression rule
  Which existing completion predicate / advanceIfReady condition.
  Runtime does not invent a new unlock.

Protected answer / leak boundary
  What help, Tutor, and feedback must not say.
```

---

## 2. Stage-specific prompts (fill, do not invent physics)

### ENTRY

- Cognitive objective: start the phenomenon, not the model.
- Visible capabilities: start only.
- Help: none.
- Revisit: N/A.

### OBSERVE

Must include manipulate → attend → record if the Scene has a bench.  
Do not tell the student that every visible option is required.

### DESCRIBE

Questions grounded in the visible apparatus.  
Final authored sentence remains student-owned.

### PREDICT

Commit before intervention.  
Do not reveal the official outcome.

### EXPERIMENT

If the Scene uses the five-part loop, name the changed variable and show the committed prediction during compare.  
Deterministic results stay in physics code, not here.

### EXPLAIN

Student writes the relation. Help may ask an intermediate question. No complete explanation from the system.

### MODEL

Name the **Scene grammar** (chain / cases / ratio / identities / rays) by reference only.  
List substeps if progressive disclosure is used.  
One final evaluator still owns acceptance. Runtime must not turn MODEL into recognition of a finished diagram.

### TRANSFER

Establish the new physical situation before asking for model application.  
Do not list official target structure as the “hint.”

### EXAM

Exam World order: 题干 → 考什么 → 表征 → 模型 → 作答.  
Options stay hidden until the plan says they appear.

### AI_OFF

No help, no Tutor, no leftover hints.  
Independent commit rules stay in the Scene AI_OFF module — name them, do not copy them.

### COMPLETE

Terminal. No mastery claim. No Tutor.

---

## 3. Cross-cutting checks (tick before coding)

- [ ] Progress and View are named separately if Back exists.  
- [ ] No enabled control is a silent no-op.  
- [ ] One help entry, bound to VisibleInteractionContext (capabilities + references).  
- [ ] Draft hydrate will not run on help/preview writes.  
- [ ] Feedback kinds come from deterministic gates, not LLM.  
- [ ] PRI-sensitive numbers are not redescribed in this template.  
- [ ] No new Scene DSL fields proposed “because the form repeats.”  
- [ ] No `UniversalModelBoard` implied by the MODEL block.  
- [ ] Leak boundary reviewed against UPLP stage permissions.
- [ ] Every stage / substep names the student question and expected response shape.
- [ ] Every important visible element has a surface justification.
- [ ] Protected future structure is named (what must not appear yet).
- [ ] Primary CTA meaning is named (what the main action actually does).

---

## 4. Fit to existing shells

If OBSERVE or PREDICT matches a **frozen** shell (`ChecklistObserveTask`, `OutcomePredictTask`), write:

```text
Shell adoption: yes / no
Shell name:
Why the interaction shape matches:
Domain props that would have to be added (must be none):
```

If a domain prop would be required: **do not adopt**. Keep a Scene task.

---

## 5. What this template is not

- Not Evidence Claim Design.  
- Not a Physics Model.  
- Not a substitute for PRE/POST quality review.  
- Not authorization to extract a generic runtime.  
- Not learner validation.

After this worksheet is filled, implementation follows `physics-model-implementation-protocol.md` and the Learner Interaction Runtime / State contracts.
