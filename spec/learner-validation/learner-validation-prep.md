# Learner Validation Prep

> Kind: minimal observation-protocol preparation  
> Date: 2026-09-12  
> Decision: D050  
> Status: protocol ready for one informal observation  
> Not: learner validation, statistical study, analytics, Scene implementation, or a `validated` claim

This document prepares **one** real Grade-9 observation of **one** existing quality-reviewed prototype.

It does **not** authorize changing `metadata.status`, UPLP stages, L1–L6 meanings, evaluators, Scene behavior, or the Evidence Design Contract.

```text
THIS PREP ≠ LEARNER VALIDATION
ONE SESSION ≠ POPULATION EVIDENCE
CORRECT COMPLETION ≠ UNDERSTANDING
```

---

## 1. Purpose

Prepare the smallest practical protocol that lets an observer watch a Grade-9 learner use an existing prototype and answer the highest-risk product questions.

The first session should help us see:

1. Can the learner complete the cognitive loop without external rescue?
2. Do they construct the intended Physics Model, or only follow UI cues?
3. Can they perform near transfer?
4. Can they recognize a boundary / non-transfer case?
5. Can they use the model during AI_OFF without tutor support?
6. Where do they become confused, bored, stuck, or quit?
7. How long does a complete loop roughly take?
8. What kinds of hints are actually needed?

Do **not** try to prove learning effectiveness statistically.

This is exploratory preparation. After one session we will know whether we can observe at all, and what the first friction looks like.

---

## 2. First validation Scene

```text
FIRST_VALIDATION_SCENE = SCENE_03
SCENE_ID = horizontal-force-cart
MODEL_ID = force-changes-motion-state
ROUTE = /scenes/horizontal-force-cart
STATUS = quality-reviewed prototype
LEARNER-VALIDATED = no
```

### 2.1 Comparison: Scene 03 vs Scene 04

| Criterion | Scene 03 cart / force-motion | Scene 04 samples / density |
|---|---|---|
| Conceptual accessibility (Grade 9) | Everyday: push, slow down, keep going | More abstract: ratio ρ = m/V |
| Interaction complexity | Push a cart; three qualitative cases | Compare samples; numbers and a ratio table |
| MODEL clarity | Three-case condition board (same / opposite / zero) | Ratio board; formula can look like the model |
| Transfer design | Bicycle + ball (full-model) + hover (boundary) | Cups/stone (full-model) + hollow (boundary) |
| Boundary-case value | Classic “no force ⇒ must stop” | Hollow / relevant volume; strong but more loaded |
| AI_OFF quality | Hover sled + balanced tug; pre-commit only | Sealed packages + proportional invariance |
| Reading-heavy UI | Radios on MODEL / transfer; still spoken in daily words | Tables, numbers, and ratio language |
| Quantitative burden | Low | Higher; arithmetic can look like “stuck” |
| Likelihood of revealing true understanding | High: wrong physics is audible in speech | Medium: “质量除以体积” can be a label, not a model |
| Ease of observing reasoning | High think-aloud fit | Harder; numbers can hide guessing |
| POST residual | `PASS_WITH_REFINEMENTS`; click-through risk | `PASS`; cleaner official evidence, still radio-led |
| Distance from energy family (01/02/05) | Far | Far |

Scene 04 remains a strong **second** observation if the first session shows that a qualitative force Scene is completable. It is not first because a first watch should not mix “cannot divide” with “does not have the model.”

### 2.2 Why Scene 03

- Grade-9 learners can talk about a moving cart without first needing a formula vocabulary.
- The high-risk product question is “constructed model vs following UI.” Scene 03’s residual POST risk is exactly that: visible three-case click-through. Speech will show whether they say “没有力就会停” while clicking “运动状态不变.”
- Near transfer (bicycle) and boundary (hover / zero net force) are discussable in ordinary language.
- Quantitative burden is low, so stall/quit is more likely about the loop or the model, not arithmetic.
- It is not another energy Scene, which matches the five-scene milestone recommendation.

Do **not** modify the Scene for this observation.

---

## 3. Learner questions

No quantitative pass threshold. These are observation questions, not scoring rubrics.

### Q1 — Independent completion

**QUESTION:** Can this learner finish ENTRY → COMPLETE on Scene 03 without an adult doing the physics or clicking the intended answers?

**WHY IT MATTERS:** If a motivated Grade-9 learner cannot finish the loop, later transfer/AI_OFF questions are secondary. The product may be unusable before it is invalid.

**OBSERVABLE EVIDENCE:** Stage events through COMPLETE, or the last stage reached; whether the observer had to rescue; whether the learner asked to stop.

**WARNING SIGNAL:** Quit before EXPERIMENT; long freeze on MODEL/TRANSFER; adult takeover; “你帮我点一下.”

### Q2 — MODEL vs UI following

**QUESTION:** After MODEL, does the learner talk about current motion + net force → motion-state change, or only repeat the labels they just clicked?

**WHY IT MATTERS:** Official L4 can be produced by a completed relation board. That is not the same as a constructed mental model.

**OBSERVABLE EVIDENCE:** Think-aloud during MODEL; own-words explanation after MODEL; later reuse of the same relation in transfer/AI_OFF without looking back at the board.

**WARNING SIGNAL:** Fast correct clicks + empty or copied wording; “我选这个因为它看起来对”; cannot say the three cases unless the radios are visible.

### Q3 — Near transfer

**QUESTION:** Can they treat the bicycle (or ball) as the same force/motion relation, not as a new puzzle?

**WHY IT MATTERS:** Near transfer is the first check that the model left the cart.

**OBSERVABLE EVIDENCE:** Transfer attempt on `near-bicycle-speeding-up` (and/or `medium-ball-opposite-force`): `accepted`, `judgments`, `response` / explanation text, plus what they said.

**WARNING SIGNAL:** Correct radios + generic text (“因为力”); “这跟小车没关系”; surface cue selected as the reason.

### Q4 — Boundary / non-transfer

**QUESTION:** On the hover case, can they refuse “must stop when there is no forward force” and keep “zero net force → motion unchanged”?

**WHY IT MATTERS:** Overgeneralization is the highest-information misconception for this model (`force means motion`, `zero ⇒ stop`).

**OBSERVABLE EVIDENCE:** Transfer attempt on `far-hover-constant-velocity`; failureKinds such as `zero-net-force-misread`, `missing-zero-net-force-boundary`, `force-motion-conflation`; spoken “没有力就会停.”

**WARNING SIGNAL:** Applies same-direction speed-up to a zero-force hover; says the slider must stop; treats “no push” as “no model.”

### Q5 — AI_OFF without tutor

**QUESTION:** With the tutor hidden, can they use the model on the hover sled and the balanced tug?

**WHY IT MATTERS:** Assisted completion is not independent use. This is the product’s hard AI_OFF boundary.

**OBSERVABLE EVIDENCE:** `independentAssessment.challengeAttempts` for `ai-off-unfamiliar-hover-sled` and `ai-off-condition-tug-moving-crate`; pre-commit `studentReasoning`; `accepted`; `llmUsed === false`; no `aiInteractions` on AI_OFF.

**WARNING SIGNAL:** Answer-only; waits for a hint that will not come; asks the observer to be the tutor; post-check clicked without a prior reason.

### Q6 — Cognitive load / confusion

**QUESTION:** Where does the learner become confused, reread, or say they do not know what the page wants?

**WHY IT MATTERS:** Confusion can be a model problem, a UI-leading problem, or a reading-load problem. The first session must locate it, not collapse it into “the model failed.”

**OBSERVABLE EVIDENCE:** Stage at freeze; repeated failed submits; “这一步想让我判断什么？”; time gap between `stage_entered` events; hint requests.

**WARNING SIGNAL:** Freeze longer than about eight minutes on one stage; looping the same click; abandoning MODEL or TRANSFER.

### Q7 — Engagement / abandonment

**QUESTION:** Do they stay curious, get bored, or want to quit — and at which stage?

**WHY IT MATTERS:** Enjoyment is not learning, but abandonment tells us whether a complete loop is even a realistic session length.

**OBSERVABLE EVIDENCE:** Visible affect; “好长啊”; requests to stop; total duration from `startedAt` to last event; last stage if incomplete.

**WARNING SIGNAL:** Ask to stop before EXPERIMENT; rush-click to finish; “还有多少关.”

---

## 4. Observer protocol

The observer is **not** a tutor and **not** a second product.

### 4.1 Allowed

- Ask the learner to think aloud **if they are comfortable**.
- Ask only neutral clarification:
  - 「你现在在想什么？」
  - 「你为什么选这个？」
  - 「你觉得这一步想让你判断什么？」
- Record confusion, stuck points, help requests, and visible strategy.
- Let the in-product tutor work as the product already allows (ENTRY → EXAM). Do not add extra hints.
- Stay silent during AI_OFF except for rescue (below).

### 4.2 Not allowed

- Explain the physics.
- Tell the learner the correct answer.
- Point to the right option.
- Reinterpret the model for them.
- Give hints that are not already in the product, before a defined rescue.
- Call the tutor API, or ask the learner to open a hint, on their behalf.
- Collect full name, email, school, precise location, or demographics.

### 4.3 Rescue rule

Rescue is a **stop / procedural** valve, not teaching.

**RESCUE CONDITION** (any one):

1. The learner is completely blocked on the **same stage** for about **eight minutes**, with no new attempt, and says they do not know what to do.
2. The learner **explicitly wants to stop**.
3. The learner is distressed.

**WHEN RESCUE TRIGGERS, the observer may do only one of:**

- Record `STOP`, thank the learner, and end the task; or
- Give **one** predefined procedural line, then return to silence.

**Predefined procedural lines** (choose at most one; do not invent physics content):

- 「这一页要你自己先选或写一点想法，再点下面的按钮。」
- 「左边的小车可以推一下看看。」
- 「如果字被挡住了，可以往下滚。」
- 「我现在不能告诉你选哪个。你可以说说你在犹豫什么。」

After one procedural line, if they are still blocked, **end the session**. Do not escalate into an explanation of force and motion.

Record every rescue on the sheet: time, stage, which line (if any), and whether the session continued.

### 4.4 Product tutor

Before AI_OFF, the learner may use the in-product tutor. That is part of the observation, not a protocol violation.

During AI_OFF and COMPLETE, the product must not call the tutor. The observer must not become a replacement tutor.

---

## 5. Think-aloud script

Optional. Grade-9 Chinese. Do not coach physics.

Read once at the start, then stop talking:

> 请一边做一边说出你现在怎么想。  
> 不用解释得很完整，也不用担心说错。  
> 我们想知道哪些地方好理解，哪些地方容易卡住。  
> 我不会告诉你答案，也不会教你物理。  
> 如果你不想出声，也可以安静做，卡住的时候跟我说一声就行。

If they go silent, at most one reminder:

> 你方便的话，可以说说你现在在想什么。

Do not ask them to “use the force model” or “talk about net force.”

---

## 6. Observation sheet

Use one row per notable moment, or at least one row per stage. Paper or a local text file is enough.

Do **not** write: full name, email, account, school, precise location, or demographic profiling.

| Field | What to write |
|---|---|
| SESSION ID | Anonymous label only, e.g. `LV-20260912-01` |
| SCENE | `SCENE_03` / `horizontal-force-cart` |
| DATE/TIME OPTIONAL | Local date; clock time optional |
| TOTAL DURATION | Wall-clock minutes, filled after |
| STAGE | ENTRY / OBSERVE / DESCRIBE / PREDICT / EXPERIMENT / EXPLAIN / MODEL / TRANSFER / EXAM / AI_OFF / COMPLETE |
| WHAT THE LEARNER DID | Clicks, pushes, writes, skips, restarts |
| WHAT THE LEARNER SAID | Short quotes; do not tidy into physics |
| HELP REQUESTED? | Y/N; what they asked |
| HINT USED? | In-product tutor used? Which stage? |
| CONFUSION SIGNAL | Reread, freeze, “看不懂”, wrong page assumption |
| ERROR / MISCONCEPTION SIGNAL | e.g. “没有力就会停”; force = motion |
| OBSERVER NOTE | Strategy, affect, rescue |
| STOP / CONTINUE | CONTINUE / RESCUE-CONTINUE / STOP |

Printable blank rows:

```text
SESSION ID: LV-__________     SCENE: SCENE_03     DATE: __________     DURATION: ____ min

STAGE | DID | SAID | HELP? | HINT? | CONFUSION | MISCONCEPTION | NOTE | STOP/CONTINUE
------|-----|------|-------|-------|-----------|---------------|------|---------------
ENTRY |     |      |       |       |           |               |      |
OBSERVE |   |      |       |       |           |               |      |
DESCRIBE |  |      |       |       |           |               |      |
PREDICT |   |      |       |       |           |               |      |
EXPERIMENT | |     |       |       |           |               |      |
EXPLAIN |   |      |       |       |           |               |      |
MODEL |     |      |       |       |           |               |      |
TRANSFER |  |      |       |       |           |               |      |
EXAM |      |      |       |       |           |               |      |
AI_OFF |    |      |       |       |           |               |      |
COMPLETE |  |      |       |       |           |               |      |
```

The observer may add extra rows if one stage has several distinct moments.

---

## 7. Local evidence inspection guide

After the session, inspect **only fields that already exist**. Do not invent product fields.

### 7.1 Where the session lives

Browser `localStorage` key:

```text
physics-lab.session.horizontal-force-cart.v1
```

Defined in `lib/learning/session-storage.ts`.

How to open it:

1. Stay on `/scenes/horizontal-force-cart`.
2. Open developer tools → Application / Storage → Local Storage.
3. Copy the JSON value for that key.
4. Save a local file named with the **anonymous sheet ID**, e.g. `LV-20260912-01.json`.
5. Do not upload it to a vendor. Do not store a student name in the filename.

The product `sessionId` is a random UUID created in `lib/learning/session.ts`. It is not a student identity. Use the sheet’s `LV-…` label in notes. Do not treat the UUID as a person.

Reset to a clean session **before** the observation:

- Click the product control 「重新开始」, or
- In the console: `localStorage.removeItem("physics-lab.session.horizontal-force-cart.v1")` then reload.

### 7.2 Top-level fields that exist today

| Question | Existing field | How to read it |
|---|---|---|
| Which Scene | `sceneId` | Must be `horizontal-force-cart` |
| How far they got | `stage`, `completed` | Last official stage; `completed === true` only after COMPLETE |
| When it started | `startedAt` | ISO timestamp |
| Predictions | `predictions[]` | `experimentId`, `prediction`, `reasoning`, `committed`, `timestamp` |
| Experiment attempts | `experimentEvidence[]` | `experimentId`, `prediction`, `reflection`, `comparison`, `sufficient`, `timestamp` |
| MODEL attempts | `modelAttempts[]` | `correctStructure`, `failureKinds`, `conditions`, `timestamp` |
| Transfer attempts | `transferAttempts[]` | `targetId` / `scenarioId`, `transferMode`, `accepted`, `response`, `judgments`, `failureKinds`, `surfaceCueSelected` |
| Exam attempts | `examAttempts[]` | `questionId`, `selectedAnswer`, `reasoning`, `correct` / `correctness` |
| AI_OFF attempts | `independentAssessment` | `challengeAttempts[]`, `llmUsed`, `completedWithoutAI` |
| Hint / tutor use | `aiInteractions[]` | `stage`, `action` (`ASK` / `HINT` / `CHALLENGE` / `ENCOURAGE` / `EXPLAIN`), `timestamp` |
| Stage timing (raw) | `events[]` | `type`, `stage`, `timestamp`; `stage_entered` marks stage changes |
| Drafts not yet committed | `sceneData` | `describeDraft`, `explainDraft`, `modelDraft`, `transferDraft`, `examDraft`, `aiOffDraft`, `watchedObserveDemo` |
| Observations / descriptions / explanations | `observations[]`, `descriptions[]`, `explanations[]` | Text plus Scene flags such as `sufficient` |

Cart experiment IDs:

```text
force-with-motion
force-against-motion
zero-net-force-while-moving
```

Transfer target IDs:

```text
near-bicycle-speeding-up          (full-model)
medium-ball-opposite-force        (full-model)
far-hover-constant-velocity       (boundary-contrast)
```

AI_OFF challenge IDs:

```text
ai-off-unfamiliar-hover-sled
ai-off-condition-tug-moving-crate
```

Official L4 requires a completed three-case MODEL (`modelAttempts[].correctStructure === true` via `hasCompletedCartModel`).  
Official L5 requires that MODEL **and** transfer completion: at least one accepted full-model target **and** accepted hover boundary (`hasCompletedCartTransfer`).  
Official L6 additionally requires both AI_OFF challenges accepted, `llmUsed === false`, and no tutor use during AI_OFF/COMPLETE.

The session JSON does **not** store `"L4"` / `"L5"` / `"L6"`. Those strings are derived later by `accumulateCartSceneEvidence` → `deriveModelEvidenceLevel`. Treat any derived level as **product evidence**, not as proof the learner understood.

### 7.3 How to derive duration and hint counts without new code

These are **observer calculations**, not missing product features.

**Rough total duration**

```text
last_event.timestamp − startedAt
```

Use `events` with `type === "session_completed"` if present; otherwise the last event.

**Rough time on a stage**

```text
next stage_entered.timestamp − this stage_entered.timestamp
```

Filter `events` where `type === "stage_entered"`.

**Attempt counts**

```text
predictions.length
experimentEvidence.length
modelAttempts.length
transferAttempts.length
examAttempts.length
independentAssessment.challengeAttempts.length
```

**Hint / tutor use**

```text
aiInteractions.filter(item => item.action === "HINT").length
aiInteractions grouped by item.stage
```

Any `aiInteractions` or `events` with `type === "ai_interaction"` on stage `AI_OFF` or `COMPLETE` is a protocol / product-boundary incident. Record it.

### 7.4 Fields that do not exist — do not invent them

The current session does **not** have:

- a dedicated `hintCount` field
- a dedicated `durationMs` or per-stage duration summary
- a one-click export button
- an observer-notes field
- student name, school, or demographics
- cloud telemetry
- an official stored L-level

---

## 8. Instrumentation gap

First observation can proceed with current local data.

```text
CODE CHANGES REQUIRED BEFORE FIRST OBSERVATION = NO
```

### 8.1 Required before first observation

**None in product code.**

Required as **human process** only:

- printed or local observation sheet
- anonymous session ID
- clean `localStorage` reset
- after-session JSON copy from `localStorage`
- adult present; no identity stored in the product

### 8.2 Nice-to-have (do not build now)

| Proposed field | WHY NEEDED | WHERE STORED | LOCAL OR EXPORTED | PERSONAL DATA? | REQUIRED OR NICE-TO-HAVE |
|---|---|---|---|---|---|
| One-click local JSON export | Slightly easier than DevTools copy | Browser download only | Exported local file | NO, if no name is added | NICE-TO-HAVE |
| Derived time-on-stage report | Faster than subtracting `events` | Derived from existing `events` | Local | NO | NICE-TO-HAVE |
| Dedicated hint-use count | Faster than filtering `aiInteractions` | Derivable today | Local | NO | NICE-TO-HAVE |
| Dedicated attempt counters | Faster than `array.length` | Derivable today | Local | NO | NICE-TO-HAVE |
| Completion duration field | Faster than timestamp subtract | Derivable today | Local | NO | NICE-TO-HAVE |

Do **not** add: third-party analytics, cloud telemetry, user identity, behavioral profiling, or an event stream “just in case.”

---

## 9. Post-session questions

Ask after the learner stops, whether they reached COMPLETE or not. Short. Do not ask 「你是不是学会了？」

1. 刚才整段里，哪一步最难？难在什么地方？
2. 有没有哪一步你其实是在猜的？是哪一步？
3. 如果现在不用这个页面，你会怎么解释这个规律？
4. 骑车、球、气垫那几题，你觉得和刚才的小车是同一类问题，还是不一样的问题？
5. 如果用过页面里的提示：它是帮你自己想明白了，还是主要告诉你下一步点哪里？
6. 如果还有另一个类似的探究，你会愿意再做一次吗？为什么？
7. 有没有哪一段让你觉得无聊、着急、或者想停下来？

Write answers on the review, not into `localStorage`.

---

## 10. Interpretation rules

### 10.1 Guardrails

- Correct completion ≠ understanding.
- Correct MODEL clicks ≠ constructed mental model.
- Correct transfer ≠ general transfer ability.
- AI_OFF success on two tasks ≠ durable learning.
- One learner ≠ population evidence.
- Learner frustration ≠ model failure by itself.
- Learner enjoyment ≠ learning by itself.
- Official L4/L5/L6 flags ≠ learner validation.
- A rescue that ends the session is data, not a product verdict.
- Scene 03 POST already warned about three-case click-through. A clean official path is expected to be possible without understanding.

### 10.2 What may be recorded as OBSERVED

Facts an observer or the JSON can point to:

- reached stage X at time T
- clicked / wrote / said Y
- asked for help
- used N in-product hints at stages …
- `modelAttempts[].correctStructure`
- `transferAttempts[].accepted` and `failureKinds`
- AI_OFF `accepted`, `studentReasoning`, `llmUsed`
- quit or rescue at stage X
- wall-clock duration

### 10.3 What may be recorded as INFERRED

Judgments that go beyond the record, labeled as inference:

- “they seemed to be following labels”
- “they probably hold zero-force-must-stop”
- “the page felt too long”
- “hints replaced thinking”

An inference needs a cited OBSERVED basis (quote, click pattern, or field). If the basis is missing, do not write the inference.

### 10.4 What is NOT YET SUPPORTED

Do not write as findings:

- this Scene teaches Grade 9 force/motion
- students can transfer in general
- AI_OFF proves mastery
- the model should be `validated`
- exam scores will rise
- Scene 04 / 01 / 02 / 05 would behave the same
- the UPLP loop is validated

---

## 11. First-session workflow

### BEFORE

1. Open `/scenes/horizontal-force-cart`.
2. Reset to a clean session (「重新开始」 or remove the localStorage key, then reload).
3. Assign anonymous session ID (`LV-YYYYMMDD-01`).
4. Prepare the observation sheet and this protocol.
5. Confirm an adult is present. Do not collect identity in the product.
6. Optional: read the think-aloud script once.

### DURING

1. Do not teach physics.
2. Observe. Record stage-level notes.
3. Allow the product tutor normally until AI_OFF.
4. Note hint use, help requests, stuck points, and affect.
5. If a rescue condition hits, record it and stop or give one procedural line.

### AFTER

1. Copy the localStorage JSON. Label the file with the anonymous session ID.
2. Inspect predictions, experiments, MODEL, transfer, AI_OFF, hints, completion, and evidence flags using §7.
3. Ask the post-session questions (§9).
4. Fill `spec/learner-validation/templates/first-session-review.md`.
5. Compare observed behavior with official evidence claims (completion vs speech vs flags).
6. Do **not** change `metadata.status`. Do **not** write `validated`.

---

## 12. Explicit non-claims

This prep does **not**:

- validate any Physics Model or Scene
- change UPLP, L1–L6, Schema lifecycle, or the Evidence Design Contract
- change Scene 03 (or any Scene) behavior or evaluators
- collect student identity or personal profiles
- require analytics infrastructure, dashboards, A/B tests, or control groups
- set quantitative pass thresholds
- authorize Scene 06
- claim that one successful observation would prove the product works

Success of **this prep task** is: we can run one real observation safely and learn something useful without building new architecture.

---

## 13. Decision pointer

Recorded as **D050**. First observation Scene is Scene 03. Code changes are not required before that observation.
