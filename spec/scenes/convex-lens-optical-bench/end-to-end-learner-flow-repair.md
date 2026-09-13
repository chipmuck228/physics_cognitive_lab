# Scene 07 End-to-End Learner Flow Repair

> Date: 2026-09-13  
> Scene id: `convex-lens-optical-bench`  
> Kind: Scene07-local repair plan. **Not** an architecture owner.  
> Does not change UPLP, Physics Model, Evidence Design, L-levels, Transfer, AI_OFF, or Scene DSL.

Invariant for every substep:

1. What am I solving now?  
2. Why am I doing this?  
3. What can I operate now?  
4. Does the page really provide that operation?  
5. What visible change happens after I act?  
6. If I cannot continue, do I know exactly why?  
7. After completion, do I know what happens next?  

Any “no” = FLOW BROKEN.

---

## Cross-cutting ownership

```text
React draft / gesture
  → Scene-owned action
  → deterministic physics / evaluator / progression
  → LensActionResult
  → UI presentation
```

Interaction Trace ≠ Evidence. No L-levels from traces.

---

## ENTRY

| Field | Value |
|---|---|
| Learner question | 要不要先看这个光具座？ |
| Learner goal | 开始看装置，先不要背五种情况 |
| Visible controls | 开始观察 |
| Allowed action | start-lesson |
| Visible result | Enter OBSERVE; bench appears |
| Blocking | none |
| Blocked reason | — |
| Completion | start clicked |
| Next | OBSERVE |

---

## OBSERVE

| Field | Value |
|---|---|
| Learner question | 动过之后，你确实看见了什么？ |
| Learner goal | 先看见变化，再记下确实看见的 |
| Visible controls | station hits, 换一个物体位置看一看, 移动光屏, observation checkboxes, 提交观察 |
| Allowed action | move-object, move-screen, record observation |
| Visible result | bench / screen change; then DESCRIBE if sufficient |
| Blocking | submit without required seen changes |
| Blocked reason | 再动一动物体或光屏，把你确实看见的变化记下来。 |
| Completion | sufficient observation committed |
| Next | DESCRIBE |

---

## DESCRIBE

| Field | Value |
|---|---|
| Learner question | 你能把物体、透镜、像、光屏分开说吗？ |
| Learner goal | 对着光具座把几样东西分开说 |
| Visible controls | three structure radios + own-words + 记下我的说法 |
| Allowed action | submit-description |
| Visible result | saved; enter PREDICT if sufficient |
| Blocking | missing structure or own words |
| Blocked reason | 先对着光具座回答三个问题，再用自己的话写一句。 |
| Completion | sufficient description |
| Next | PREDICT |

---

## PREDICT (trial 1, then later trials on EXPERIMENT)

| Field | Value |
|---|---|
| Learner question | 物体换位置以后，你预计会看见什么？ |
| Learner goal | 先留下猜测，再去动手 |
| Visible controls | outcome radios, reason, 锁定预测 |
| Allowed action | commit-prediction |
| Visible result | prediction locked; trial start state prepared; enter / stay in verification |
| Blocking | missing outcome or own-words reason |
| Blocked reason | 先选你预计会看见什么，再用自己的话写理由。 |
| Completion | locked prediction for the current trial |
| Next | that trial’s required intervention |

After lock, learner-visible copy must say the prediction is locked and name the exact intervention. Do not make the learner infer what to move.

---

## EXPERIMENT — shared loop

Four official trials. Visible: `第 N / 4 次验证`.

Per trial status, all visible:

- 预测：已锁定 / 还没锁定  
- 动手：已完成 / 还没做  
- 看见：已记下 / 还没记  
- 对照：已记下 / 还没对照  
- 想法：已写下 / 还没写  

Loop:

```text
prediction locked
  → current trial names required intervention
  → bench exposes only that capability
  → learner performs it
  → Scene action validates
  → deterministic after-state applies
  → observation unlocks
  → prediction vs observation surface
  → learner judges same / partial / different
  → reflection + 记下想法，完成本轮
  → 第 N 次验证完成
  → 开始第 N+1 次验证   (or leave EXPERIMENT after 4)
```

Observation is unavailable until the required intervention succeeds.  
Comparison is learner judgment. Do not auto-decide.  
Do not hide trial completion behind “记下这次想法” without saying the trial will close.  
Do not silently swap trials.

Invalid intervention: physics unchanged + exact blocked reason.  
Missing complete-trial pieces: exact missing list, never generic “不能继续”.

---

## EXPERIMENT trial 1 — `compare-real-image-across-2f`

| Field | Value |
|---|---|
| Learner question | 同一块透镜，物体从 2F 以外移到 F 与 2F 之间。实际会怎样？ |
| Learner goal | 自己完成这次改变，再对照预测 |
| Visible controls | station hits (object side); no screen move; no cover |
| Allowed action | move-object → `between-f-and-2f` |
| Starting state | `beyond-2f`, screen at image plane, uncovered |
| Target after-state | existing `prepareLensExperimentState(A)` |
| Visible result | object at F–2F; real image larger / farther |
| Invalid | other station, screen, cover |
| Blocked reason | 这次要把物体从 2F 外移到 F 和 2F 之间，不是做别的改变。 |
| Completion | intervention + observed + comparison + reflection |
| Next | 第 1 次验证完成 → 开始第 2 次验证 |

---

## EXPERIMENT trial 2 — `probe-object-at-f`

| Field | Value |
|---|---|
| Learner question | 物体正好放在焦点上。光屏还能接到清晰像吗？ |
| Learner goal | 自己把物体放到焦点上，看有限远处能不能接到清晰像 |
| Visible controls | station hits; no screen; no cover |
| Allowed action | move-object → `at-f` |
| Starting state | trial 1 after-state (`between-f-and-2f`) |
| Target after-state | existing `prepareLensExperimentState(B)` |
| Visible result | no finite image |
| Invalid | other station / screen / cover |
| Blocked reason | 这次要把物体放到焦点上。 |
| Completion | same five-part close |
| Next | 第 2 次验证完成 → 开始第 3 次验证 |

Must lock a new prediction before this intervention.

Before that lock, bench caption and task context must say
`先锁定这一次的预测，再去光具座上动手。`
They must not reuse the post-lock intervention sentence
(`你的预测已经锁定…`). Station hits stay hidden until lock.

---

## EXPERIMENT trial 3 — `probe-object-inside-f`

| Field | Value |
|---|---|
| Learner question | 物体放到焦点以内。光屏还能不能接到像？ |
| Learner goal | 自己把物体移进焦点以内 |
| Visible controls | station hits; no screen; no cover |
| Allowed action | move-object → `inside-f` |
| Starting state | trial 2 after-state (`at-f`) |
| Target after-state | existing `prepareLensExperimentState(C)` |
| Visible result | virtual / screen never receives |
| Invalid | other station / screen / cover |
| Blocked reason | 这次要把物体放到焦点以内。 |
| Completion | same five-part close |
| Next | 第 3 次验证完成 → 开始第 4 次验证 |

---

## EXPERIMENT trial 4 — `cover-part-of-lens`

| Field | Value |
|---|---|
| Learner question | 光屏已经接到清晰实像。遮住透镜一部分，像会少掉一半吗？ |
| Learner goal | 自己遮住透镜一部分 |
| Visible controls | 遮住透镜一部分 (explicit cover action). No station jumping. |
| Allowed action | cover-lens |
| Starting state | `beyond-2f`, screen at image plane, uncovered (apparatus prepared on prediction lock; this is not the intervention) |
| Target after-state | existing `prepareLensExperimentState(D)` |
| Visible result | whole image still there, usually dimmer |
| Invalid | moving object or screen |
| Blocked reason | 这次不要换物体位置，只要遮住透镜一部分。 |
| Completion | same five-part close |
| Next | 第 4 次验证完成 → EXPLAIN |

Cover is the smallest explicit learner action that matches the official intervention. It is not hidden inside `runExperiment()`.

---

## EXPLAIN

| Field | Value |
|---|---|
| Learner question | 该用真正相交、反向延长，还是有限远处不相交来说明已经看见的光屏结果？ |
| Learner goal | L3 account of already-seen results |
| Visible controls | meeting + screen fragments, own words, 记下我的说明 |
| Allowed action | submit-explanation |
| Visible result | EXPLAIN saved; enter MODEL if sufficient |
| Blocking | slogan / missing bind |
| Blocked reason | existing EXPLAIN missing copy |
| Completion | sufficient explanation |
| Next | MODEL |

Official rays stay hidden.

---

## MODEL (7 steps)

| Step | Question | Controls | Allowed | Next blocked reason |
|---|---|---|---|---|
| 1 | 物体相对 F / 2F 在哪里？ | station radios + bench hits | choose station | 还需要先选出物体相对 F / 2F 在哪里。 |
| 2 | 第一条光线怎么走？ | ray pickers | construct ray A | 还需要完成第一条光线的种类、实际或反向延长、透镜前路径和透镜后路径。 |
| 3 | 第二条光线怎么走？ | ray pickers | construct ray B | 还需要完成第二条光线的种类、实际或反向延长、透镜前路径和透镜后路径。 |
| 4 | 光线怎样相遇？ | meeting radios | classify meeting | 还需要选出过透镜后光线怎样相遇。 |
| 5 | 像会怎样？ | image radios | classify image | 还需要选出像在哪一侧、是实像还是虚像、正立还是倒立、大小，以及光屏能不能接到。 |
| 6 | 会聚方式怎样决定像？ | textarea | author bind | 还需要用一句话写出为什么会聚方式会带来这样的像。 |
| 7 | 检查后再提交 | 提交模型 | submit | evaluator missing / rejected copy; no internals |

Disabled 下一步 must show the missing-action **or inconsistency** reason. Official image / official rays stay hidden. Learner-ray projection remains canonical.

Follow-up: each MODEL step uses Scene07-local `evaluateLensModelStep`. Final submit still uses the construction evaluator. Rejection shows `模型还不能提交` and `回到第 N 步修改`. Trial 4 must render `lens-partial-cover` on the lens when `lensPartiallyCovered`.

---

## TRANSFER / EXAM / AI_OFF / COMPLETE

Unchanged semantics. Visible next action on each page. AI_OFF: no Help. Back/revisit does not mutate authoritative progress.

---

## What this repair does not do

Does not change official experiment IDs or `prepareLensExperimentState` after-states.  
Does not create a universal experiment engine.  
Does not claim learner validation.
