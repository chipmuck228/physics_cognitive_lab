# Scene 03 — AI Guardrails

> Scene-specific tutor constraints  
> Primary model: `force-changes-motion-state`

Universal semantics are owned by UPLP. Stage-allowed actions are owned by `STAGE_TUTOR_POLICY`. Model copy lives in `tutor-policy.ts`.

This file only adds **Scene 03** constraints. It does not redefine H1–H5.

---

## 1. Universal references

- Stages, hint ladder, AI_OFF: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Allowed actions: `lib/learning/stage-policy.ts`
- Model leakage rules and H1–H5 prompts: `content/physics-models/force-changes-motion-state/tutor-policy.ts`

If this file conflicts with UPLP, UPLP wins.

Tutor request payload is adapter-owned. Universal tutor code must not special-case `horizontal-force-cart`.

---

## 2. Per-stage Scene behavior

| Stage | Allowed (UPLP) | Scene must | Scene must not |
|---|---|---|---|
| ENTRY | none | Open with a question | Display 力能改变物体运动状态 |
| OBSERVE | ASK, ENCOURAGE | Ask what changed, when | Inject the textbook rule; name 合力 as the required first word |
| DESCRIBE | ASK, HINT, ENCOURAGE | Focus on object, initial motion, force arrow, change | Require F=ma; complete the model |
| PREDICT | ASK, HINT, CHALLENGE | Keep the student authoring prediction + reason | Reveal Experiment A/B/C tick results |
| EXPERIMENT | none | Application owns `CartState` | LLM deciding speed, direction, or net force |
| EXPLAIN | ASK, HINT, CHALLENGE, ENCOURAGE, EXPLAIN | Progressive H1–H5 | Dump the complete relation as the student's answer |
| MODEL | ASK, HINT, CHALLENGE | Point at a missing slot | Place the relation for the student |
| TRANSFER | ASK, HINT, CHALLENGE | Wait for an attempt | Say “这和刚才是同一个力和运动的关系” first |
| EXAM | ASK, HINT, CHALLENGE, EXPLAIN | Preserve Exam World sequence | Skip to four choices; grade by LLM as official score |
| AI_OFF | **no call** | Hide tutor; `llmUsed = false` | Hidden clues from earlier hints; LLM grading |
| COMPLETE | none | Evidence-oriented reflection | “你已经完全掌握力与运动” |

EXPLAIN action, when UPLP allows it, must stay short (`maxExplanationLength` on the model policy) and come **after** student speech.

---

## 3. Physics the tutor must never assert

Reject / fall back if the tutor output claims:

- 有力就一定运动;
- 物体运动就一定受到向前的力;
- 没有力物体就会停下 / 合力为零就一定静止;
- 平衡力就是没有力;
- 力的方向必须和运动方向相同;
- 快慢变了就是方向变了;
- 需要用 F=ma 才能判断运动状态是否改变.

These match model misconceptions `fcms-M1`–`fcms-M6`. They are not new architecture.

On PREDICT / EXPERIMENT, also reject any output that states the deterministic tick before or instead of the physics rule, for example:

- “再向右推，速度档一定从 2 变成 3” as an LLM-invented kinematic claim;
- “合力为零，小车下一帧会停在轨道中间”.

The application already knows the tick table in [`physics-state.md`](./physics-state.md).

---

## 4. Answer-leakage rejection

Treat as leakage (reject, use safe fallback, keep the task alive):

1. Complete relation given as the student answer:

   `当前运动状态 + 合力/方向关系 → 运动状态变化`

2. MODEL board narrated slot-by-slot for the student to copy.

3. TRANSFER: naming the shared model before an attempt.

4. EXAM: revealing `correctAnswer` from `examPatterns`.

5. PREDICT: stating `lastChange` for the upcoming run.

6. Opening OBSERVE with 力能改变物体运动状态.

Adapter `looksLikeTutorLeak` should own these Scene 03 patterns. Do not add them as a universal `sceneId` branch.

---

## 5. AI_OFF / COMPLETE

No tutor component, no request, no hidden prior-hint strip that still answers the challenge.

Official evaluation is deterministic overlay + structured evidence. Not LLM grading.
