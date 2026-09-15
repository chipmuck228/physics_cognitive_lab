# Learner Workspace Layout

> Kind: architecture candidate  
> Status: **PILOT / NOT YET UNIVERSALIZED**  
> Date: 2026-09-15  
> First consumer: Scene 07  
> Second layout consumer (composition only): Scene 02 ENTRY → EXPLAIN  
> Decision: D068; D069 notes Scene 02 may compose the same slots without unifying domain UI

```text
UNIVERSAL_LAYOUT_CANDIDATE
+
SCENE07_PILOT

≠ UNIVERSAL_LAYOUT_VALIDATED
≠ LEARNER_VALIDATED
```

This document unifies **information responsibilities** for a learner-facing
page. It does not unify domain UI.

---

## 1. Purpose

A learner should be able to answer four questions immediately:

Physical World

1. 我现在在研究什么？
2. 图里这些物理东西是什么？

Current Task

3. 我现在要做什么？
4. 做完以后怎么继续？

Cognitive difficulty should come from physics, not from searching the page.

---

## 2. Non-goals

LearnerWorkspace MUST NOT own:

- physics or Physics Truth
- evaluator correctness
- progression / UPLP stage meanings
- evidence / L4–L6
- MODEL relation grammar
- transfer semantics
- exam semantics
- AI_OFF acceptance
- Scene-specific task meaning
- ray / circuit / heat / force domain UI

Do not create:

- UniversalSceneRenderer
- UniversalPhysicsWorkspace
- UniversalModelRenderer

This is not a Scene DSL extension.

The Interaction Shell freeze (`SUFFICIENT_EVIDENCE_TO_FREEZE`) still wins
for whether reusable chrome may absorb domain semantics. This layout is a
**slot primitive**, not a domain shell. Scene 07 is the first pilot. Scene 02
may compose the same World / Task / Support slots for layout only. It must
keep engine playback, energy MODEL, and Engine* tasks. Do not migrate
Scene 01, 03–06 from this document. Do not force Scene 07 domain widgets
onto Scene 02.

---

## 3. Regions

| Region | Owns | Must not become |
|---|---|---|
| World | phenomenon, apparatus, manipulable objects, visible state, spatial reference, object-level vocabulary | a decorative illustration or a theory page |
| Task lead | one current question / current action | a lesson article |
| Task body | response controls and one primary CTA | a second copy of the instruction |
| Support | feedback, help, tutor, cognitive trace — only when needed | equal visual weight with the current action |

```text
┌───────────────────────────────────────────────────────────┐
│ Stage / Progress  (product chrome, not this layout)       │
├──────────────────────────────┬────────────────────────────┤
│ PHYSICAL WORLD               │ CURRENT TASK               │
│ phenomenon                   │ one question               │
│ apparatus                    │ response / action          │
│ visible state                │ primary CTA                │
│ contextual vocabulary        │                            │
├──────────────────────────────┴────────────────────────────┤
│ Support — only when needed                                │
└───────────────────────────────────────────────────────────┘
```

This diagram describes **responsibility**. It is not a 50/50 pixel requirement.

---

## 4. Tests the layout must support

### 3-Second Action Test

A first-time Grade 9 learner should answer within about 3 seconds:

> 现在这个页面要我做什么？

without reading explanatory paragraphs.

### One-Screen One-Question Test

The primary task area normally contains **one** dominant cognitive question.
Do not place multiple equivalent descriptions of the same task on the page.

### One cognitive moment → one obvious action

Supporting copy may exist. It must remain visually secondary and must add
**new** information.

---

## 5. Vocabulary placement

Physics terms should be grounded in the Physical World, near the visible
referent, as:

```text
TERM + VISIBLE REFERENT + SHORT EXPLANATION
```

Do not put all vocabulary in one large theory card in the task column.
Do not leak target Physics Truth (imaging table, real/virtual rules, size
rules, screen-receivability rules).

---

## 6. Stage-dependent emphasis

| Emphasis | Typical stages | World : Task (conceptual) |
|---|---|---|
| `world` | OBSERVE, EXPERIMENT | about 65–70% / 30–35% |
| `task` | ENTRY, DESCRIBE, PREDICT | task may take more space |

MODEL, TRANSFER, EXAM, and AI_OFF may need different compositions. This
pilot does not claim those stages.

---

## 7. Responsive behavior

Desktop: World \| Task

Mobile / narrow:

1. Current action / question (`lead`)
2. Physical World
3. Task response + primary CTA
4. Support

Do not stack desktop cards in arbitrary source order.

---

## 8. Ownership vs LearningShell

`LearningShell` continues to own product chrome: home, back, start over,
stage progress, footer.

`LearnerWorkspace` owns World / lead / task / support placement for a
pilot stage. Scene 07 ENTRY–EXPERIMENT uses it. Later Scene 07 stages keep
the existing shell split.

---

## 9. Copy rules for consumers

- No evaluator language in learner UI (“不要只写‘变了’”).
- Translate internal requirements into physical questions.
- Natural Grade 9 Chinese.
- UI scaffold (“现在移动光屏”) is allowed. Physics-answer scaffold is not.

---

## 10. Status

PILOT. Scene 07 first implementation. Not universal. Not learner-validated.
