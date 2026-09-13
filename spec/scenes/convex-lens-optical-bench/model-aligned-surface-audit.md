# Scene 07 Model-Aligned Surface Audit

> Date: 2026-09-13  
> Scene id: `convex-lens-optical-bench`  
> Primary model: `convex-lens-imaging`  
> Kind: Scene-local gap table (not an architecture owner)  
> Written **before** React changes for model-aligned interaction + action-outcome hardening

This file does not own UPLP, Physics Truth, evaluators, Evidence Design, Scene DSL, or Interaction Shell. It records whether the current learner surface is traceable to:

```text
Physics Model
  → current cognitive objective
  → current evidence requirement
  → current learner task
  → current surface
```

---

## Ownership decision (Blocker A)

Existing contracts can own this by refinement. **Do not create** `spec/architecture/model-aligned-interaction-contract.md`.

| Need | Owner |
|---|---|
| Per-stage student question, response shape, surface justification, protected future structure, primary CTA | `architecture/learner-interaction-design-template.md` + Scene interaction plan |
| Every meaningful learner-facing element is traceable Model → objective → evidence requirement → task | `architecture/learner-interaction-runtime-contract.md` (framing + VisibleInteractionContext) |
| Official physics / MODEL grammar | Physics Model / construction contract |
| What counts as evidence | Evidence Claim Design / Evidence Design |
| Stage meanings | UPLP |

A new architecture file would be a parallel owner for naming only.

---

## Ownership decision (Blocker B)

Presentation must not infer an authoritative action result when the Scene / evaluator / progression already owns that result.

Required flow:

```text
student action
  → Scene-owned action
  → LensActionResult { session, outcome }
  → presentation mapping
  → learner-visible response
```

Current split (must remove):

| Stage | UI truth | Authoritative truth |
|---|---|---|
| OBSERVE | Lab `evaluateLensObservation()` | hook `saveObservation()` |
| DESCRIBE | Lab `evaluateLensDescription()` | hook `saveDescription()` |
| EXPLAIN | Lab `evaluateLensExplanation()` | hook `saveExplanation()` |
| MODEL | Lab `lensModelMissingLabels()` → committed if empty | `buildLensModelAttempt().correctStructure` |
| TRANSFER | Lab always `committed` | `buildLensTransferAttempt().accepted` |
| EXAM | Lab `canCommit` then always `committed`; also `buildLensExamAttempt` for local draft | hook `saveExamAttempt()` |
| AI_OFF | Lab `canCommit` then always `committed` | hook builders |

EXPERIMENT already follows the required flow. PREDICT commit already does. Draft keystrokes, exam step chrome, and radio selection are not evaluator-owned and stay local.

---

## EXPLAIN → MODEL boundary (do not silently rewrite)

**Decision: A — current EXPLAIN task is justified. Clearer scaffolding only.**

| Check | Finding |
|---|---|
| UPLP EXPLAIN | Causal account of **already-seen** phenomena. Student writes the relation. System must not write the complete explanation. |
| UPLP MODEL | Construct reusable structure from scratch. |
| Scene 07 Evidence Claim Design | L3 = one meeting or receivability **fragment**. L4 = station + two rays + meeting + image + authored bind. L4 is MODEL, not EXPLAIN. |
| Prior learner-visible evidence | OBSERVE / EXPERIMENT screen states: receive / not receive / see-through vs screen. Those results are already on the learner path. |
| Official rays | Stay hidden. Look-at-ray help is already illegal. EXPLAIN references to meeting are **textual**, not drawn. |

EXPLAIN asks the learner to **name** meeting vs backward-extension vs no-finite-meeting as an account of those screen outcomes. It does **not** ask the learner to assemble rays.

| Rejected alternative | Why |
|---|---|
| B. Missing intermediate UPLP bridge | No new stage is required if the student question names the already-seen screen results as the basis. |
| C. EXPLAIN is doing MODEL too early | EXPLAIN has no ray assembly, no construction editor, no official diagram. Moving construction into EXPLAIN would collapse L3 into L4. |

If anyone later wants EXPLAIN to require constructed rays, or MODEL to drop construction because EXPLAIN already named meeting mode: **STOP**. That changes Evidence / MODEL semantics. Mark architecture / pedagogy review required. Do not silently rewrite this boundary.

Scaffolding fix (copy / student question only): anchor EXPLAIN to “you already saw the screen can / cannot receive,” not “look at two rays.” Do not change `evaluateLensExplanation` or L3/L4 predicates.

---

## Gap table

| STAGE / SUBSTEP | MODEL / COGNITIVE INTENT | CURRENT UI | STUDENT QUESTION | EXPECTED RESPONSE SHAPE | UNJUSTIFIED / MISSING SURFACE | RISK | FIX NEEDED |
|---|---|---|---|---|---|---|---|
| ENTRY | Start the phenomenon, not the imaging table | Landing copy + start | 要不要先看这个光具座？ | start the lesson | none | low | Add plan fields only |
| OBSERVE | Attend to screen / see-through change; record what was seen | Bench manipulate + checklist | 动过之后，你确实看见了什么？ | select observed states (not every visible option is required) | Lab re-evaluates on submit; prompt is slightly vague (“注意到了什么”) | split-brain; learner may guess required IDs | One Scene action owns evaluate + write + outcome. Keep required IDs hidden. |
| DESCRIBE | Separate object, lens, F/2F, image, screen | 3 structured questions + sentence | 物体、透镜、F/2F、像、光屏是不是同一件东西？刚才动的是哪一样？ | object + quantity-set + change + own sentence | Lab `evaluateLensDescription` + hook evaluate again. Textarea is grounded (“不要只写变了”), not empty “写下想法”. | UI truth ≠ progression truth | One Scene action. Presentation only shows outcome. |
| PREDICT | Commit outcome + reason before intervention | Outcome radios + reason + lock | 物体换位置以后，你预计会看见什么？ | choose one predicted state + own-words reason | already Scene-owned via `applyLensPredictionCommit` | low | Plan fields only |
| EXPERIMENT | Five-part loop against locked prediction | Predict (later trials) + run + observed + compare + reflection | 这一次改了什么？看见的和刚才猜的一样吗？ | do → record observed pair → choose comparison → own-words reflection | already Scene-owned | low | Plan fields only |
| EXPLAIN | L3 fragment: meeting / receivability account of **seen** screen states | Meeting radios + screen radios + textarea. Question currently “光线会怎样相交？” | 你已经看见过屏接得到 / 接不到。该用真正相交、反向延长，还是有限远处不相交来说明？ | select meeting fragment + select screen/image fragment + own words (not table slogan) | Question language sounds like looking at rays that are not rendered. Official rays correctly hidden. Split-brain evaluate. | Learner hunts invisible rays; help already banned look-at-ray; UI may say committed while evaluator disagrees | Decision A: keep task. Rewrite student question / frame / textarea prompt to screen-outcome basis. One Scene action. Do not add ray construction. |
| MODEL 1 station | Choose object station relative to F/2F | Station picker on construction editor | 物体相对 F / 2F 在哪里？ | choose one station | Official image overlay off — correct. Bench marks belong. | low | Plan fields; step chrome stays local |
| MODEL 2 ray A | Assemble first required ray | Ray editor; student ray draws when complete | 第一条必做光线到达透镜前、过透镜后怎么走？ | construct one ray (kind + before + after + incident) | Look-at help only after that ray is drawn — already contracted | low | Plan fields |
| MODEL 3 ray B | Assemble second required ray | Same | 第二条必做光线怎么走？ | construct a second different required ray | same | low | Plan fields |
| MODEL 4 meeting | Name how the two student rays meet | Meeting radios | 这两条你装的光线是真正相交、反向延长，还是有限远处不相交？ | choose one meeting mode | Justified only after two student rays can exist. Official meeting mark must stay off. | If asked before rays exist, task is unsupported | Keep progressive disclosure. Help look-at meeting only if ≥2 constructed rays. |
| MODEL 5 image | Image consequence of that meeting | Image property pickers | 这样相遇以后，像在哪一侧、是什么性质、屏能不能接到？ | select side / nature / orientation / size / receivable | Official image overlay stays off — correct | low | Plan fields |
| MODEL 6 bind | Authored meeting→image bind | Textarea | 为什么这种会聚方式会带来这样的像？ | when meeting changes, image consequence follows (own sentence) | Must not accept table-row slogan as the bind | low | Plan fields |
| MODEL 7 review + submit | One evaluator owns acceptance | Review + 提交模型 | 这一条自己装的关系能不能交出去？ | submit the constructed relation | **Lab treats empty `lensModelMissingLabels` as committed.** Complete-but-wrong still looks successful. Missing labels may justify `missing` only. | UI committed ≠ `correctStructure` | Submit goes through `buildLensModelAttempt` only. Complete + not accepted → `rejected`. |
| TRANSFER | Same meeting→image on a new surface | Situation text + structured picks + reason | 这个新情境里，物体相对焦点在哪里？会聚和像怎样跟着变？ | select station + meeting + image + own words (not “都有凸透镜”) | No bench — correct. Lab always presents `committed` after save. | Rejected transfer looks recorded-as-success | Outcome from `accepted`. Incomplete → missing. Wrong structure / slogan → rejected. |
| EXAM | Exam World: stem → 考什么 → representation → model → answer | Stepped exam task | 这题在考哪一段成像关系？你选哪一个答案？ | representation + model recognition + choice + own-words reason | Step continue is draft chrome (OK). Submit: Lab gates then always `committed`, and rebuilds the attempt locally. | Third evaluation path | Submit is one Scene action. Step continue stays local. |
| AI_OFF | Independent judgment; zero help | Challenge + commit + post-check | 没有提示时，这一题的物距和会聚该怎么判断？ | structured judgment + reason; then post-check | Lab gates then always `committed` | UI committed ≠ module result | Commit / post-check return Scene outcomes. |
| COMPLETE | Terminal lookback; no mastery | Trace sentences | 你刚才留下了哪些自己的说法？ | read only | Copy must not say 掌握了 | low | Plan fields only |

---

## Surface rules taken into the fix

1. Every stage / MODEL substep in the interaction plan gets: Student question, Expected response shape, Surface justification, Protected future structure, Primary CTA meaning. No official answers in those fields.
2. EXPLAIN copy / framing anchors to already-seen screen outcomes. Evaluator unchanged.
3. React stops calling `evaluateLensObservation`, `evaluateLensDescription`, `evaluateLensExplanation`, and stops using `lensModelMissingLabels()` as success truth.
4. `lensModelMissingLabels` may appear only as the **message** of an already-decided `missing` result (incomplete construction). Non-missing labels never imply accepted MODEL.
5. No Universal\* extraction. No Scene DSL / Interaction Shell change. No Scene 03. No Physics Truth / L-level rewrite.
