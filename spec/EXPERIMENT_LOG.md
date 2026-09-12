# Physics Cognitive Lab — Experiment Log

> Version: 0.2 — Governance aligned; historical experiment entries preserved
> Purpose: Record evidence from prototypes and real students. This file must never be used to manufacture certainty.

> Authority: Research/evidence log only. This file does not define product architecture, stage semantics, Physics Model IDs, or AI policy. Architectural conflicts are resolved by the UPLP / Physics Model Schema / Physics Model Library contract.

## Experiment Template

### E### — [Short Name]

**Date:**

**Objective:**

**Hypothesis:**

**Participants:**

**Prior knowledge/context:**

**Prototype/version:**

**Procedure:**

**Observed behavior:**

**Student quotes / representative responses:**

**Where students got stuck:**

**Where students showed insight:**

**AI behavior issues:**

**Physics/content issues:**

**Engagement observations:**

**Transfer observations:**

**AI-Off observations:**

**What changed because of this experiment:**

**Evidence strength:** Low / Medium / High

**Follow-up experiment:**

---

## E000 — Design-Only Baseline

**Date:** 2026-09-11

**Objective:** Establish the first testable hypothesis before student testing.

**Hypothesis:**
A 10–15 minute interactive environment can guide a Grade 9 learner from everyday description of a thermal phenomenon to a basic physical model, then to transfer and an independent exam-style response.

**Participants:** None.

**Evidence:** None.

**Status:** Design hypothesis only.

**Important:** No learning effectiveness claim should be made from this entry.

---

## E000A — Implementation Foundation Checkpoint

**Date:** 2026-09-11

**Objective:** Verify that the first coded prototype preserves deterministic physics rules, explicit stage control, and session persistence before tutor integration.

**Hypothesis:**
If the prototype first implements the scene, physics engine, state machine, and local persistence, then later AI and assessment work can be added without weakening the core guardrails.

**Participants:** None.

**Prior knowledge/context:**
This checkpoint evaluates software readiness only. It does not evaluate student learning.

**Prototype/version:**
Repository checkpoint with landing page, microwave scene, deterministic heating engine, session storage, and initial automated tests.

**Procedure:**
- run the microwave-bread scene
- start the investigation
- run heating
- verify the result is deterministic
- refresh and verify the current stage persists
- run automated tests for physics and learning rules

**Observed behavior:**
- the scene loads and the bread-heating interaction runs
- heating results are deterministic under the current approximation
- the session restores after refresh
- stage and tutor guardrails are encoded in tests

**Student quotes / representative responses:**
None.

**Where students got stuck:**
Not evaluated.

**Where students showed insight:**
Not evaluated.

**AI behavior issues:**
No tutor route implemented yet.

**Physics/content issues:**
The coded journey currently stops before observation capture, explanation, transfer, exam mode, and AI-Off assessment.

**Engagement observations:**
Not evaluated.

**Transfer observations:**
Not evaluated.

**AI-Off observations:**
The boundary exists in state and policy, but not yet in a complete user flow.

**What changed because of this experiment:**
- confirmed that the current build is a foundation checkpoint rather than full MVP completion
- documented the need to track implementation status separately from target learning specs

**Evidence strength:** Low

**Follow-up experiment:**
Implement observation capture and staged advancement through `DESCRIBE` and `PREDICT`, then run the first think-aloud pilot.

---

## Future Experiment Queue

### E001 — First Think-Aloud Pilot

Goal:
Observe 3–5 Grade 9 students completing the microwave-bread environment.

Focus:
- where they hesitate;
- what words they naturally use;
- whether they understand “temperature increase”;
- whether they can explain energy transfer;
- where AI help becomes necessary;
- whether model construction feels meaningful.

### E002 — AI vs AI-Light Interaction

Compare:
- frequent tutor conversation;
- short staged prompts.

Outcome:
Identify whether heavy conversation reduces student agency.

### E003 — Transfer Test

Original:
microwave bread

Transfer:
hot-water bag, rubbing hands, electric kettle.

Outcome:
Measure whether students independently identify the shared model.

### E004 — Exam Transfer Test

Compare pre/post performance on carefully matched exam-style questions.

Outcome:
Determine whether the learning environment produces measurable problem-representation improvement.

### E005 — AI-Off Test

Remove all AI support from final tasks.

Outcome:
Measure whether reasoning remains after scaffolding is removed.
