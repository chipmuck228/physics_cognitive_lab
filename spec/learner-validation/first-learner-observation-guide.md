# First Learner Observation Guide

> Kind: operational execution guide  
> Date: 2026-09-12  
> Decision: D051  
> Scene: `horizontal-force-cart`  
> Primary model: `force-changes-motion-state`  
> Status: quality-reviewed prototype. **Not** learner-validated.

This Guide converts the approved prep into a simple sequence a parent / observer can follow.

It does **not** change Scene behavior, evaluators, UI, runtime, UPLP, L1–L6, the Evidence Design Contract, Physics Model status, or the semantics of `learner-validation-prep.md` and `templates/first-session-review.md`.

```text
THIS GUIDE ≠ LEARNER VALIDATION
ONE SESSION ≠ THE PRODUCT WORKS
DO NOT TRY TO MAKE THE SESSION SUCCEED
TRY TO MAKE THE OBSERVATION TRUE
```

---

## 1. Purpose

The purpose of the first observation is **not** to prove that the product works.

The purpose is to observe whether a real Grade-9 learner:

1. can complete the cognitive loop;
2. understands what each stage asks them to do;
3. constructs the intended Physics Model rather than only clicking labels;
4. transfers the model to another situation;
5. recognizes an important boundary case;
6. can independently use the model during AI_OFF;
7. becomes confused, bored, stuck, rush-clicks, or wants to quit.

The central comparison is:

```text
PRODUCT EVIDENCE
        vs
OBSERVED LEARNER THINKING
```

Especially:

| Product evidence | Observer question |
|---|---|
| L4 / `constructedValidCausalModel` | Did the learner actually construct the model? |
| L5 / `successfulTransfer` | Did the learner actually recognize and reuse the deep relation? |
| L6 / `independentAiOffSuccess` | Did the learner independently reason with the model? |

---

## 2. Core Observer Principle

**DO NOT TRY TO MAKE THE SESSION SUCCEED.**

**TRY TO MAKE THE OBSERVATION TRUE.**

If the learner:

- gets something wrong;
- misunderstands;
- becomes stuck;
- guesses;
- rush-clicks;
- becomes bored;
- asks to stop;

these are observations, not failures of the observation session.

The observer must **not** rescue the learner merely to reach COMPLETE.

A stopped session is valid data.

---

## 3. Before the Session

```text
SCENE = horizontal-force-cart
ROUTE = /scenes/horizontal-force-cart
STORAGE KEY = physics-lab.session.horizontal-force-cart.v1
```

Checklist:

- [ ] Open Scene 03: `horizontal-force-cart` (`/scenes/horizontal-force-cart`).
- [ ] Reset to a clean session. Use the product’s normal reset if available (「重新开始」). Otherwise clear **only** `physics-lab.session.horizontal-force-cart.v1`. Do not clear unrelated browser data.
- [ ] Assign an anonymous session ID. Format example: `LV-YYYYMMDD-01`.
- [ ] Do **not** record: full name, email, school, precise location, or unnecessary demographics.
- [ ] Open / prepare [`templates/first-session-review.md`](templates/first-session-review.md) or a simple raw observation sheet.
- [ ] Prepare a place to save the original session JSON after completion (local file named with the anonymous ID).
- [ ] Confirm the observer understands: the **product tutor is allowed normally until AI_OFF**. Observer tutoring is **not** allowed.

Adult present. No identity stored in the product.

---

## 4. Opening Script

Use this Grade-9 Chinese script. Do not add physics explanation before starting.

> 请一边做一边说出你现在怎么想。  
> 不用解释得很完整，也不用担心说错。  
> 我们想知道哪些地方好理解，哪些地方容易卡住。  
> 我不会告诉你答案，也不会教你物理。  
> 如果你不想出声，也可以安静做，卡住的时候跟我说一声就行。

If they go silent, at most one reminder: 「你方便的话，可以说说你现在在想什么。」

Do not ask them to “use the force model” or “talk about net force.”

---

## 5. During the Session

The learner operates the product.

The observer watches.

Do **not** manually guide the learner through the intended cognitive path.

Record high-information moments rather than every click.

Record especially:

- learner’s original words;
- hesitation;
- guesses;
- help requests;
- hint usage;
- repeated attempts;
- confusion;
- misconception statements;
- rush-click behavior;
- boredom;
- abandonment signals;
- moments where the learner explains a relation in their own words.

Whenever possible, preserve the learner’s exact wording.

Do **not** rewrite their words into physics terminology during observation.

---

## 6. Five Signals to Watch Closely

### Signal 1 — MODEL

Ask internally:

Can the learner express something like:

```text
current motion state
+
net-force condition
→
motion-state change
```

without merely repeating the visible UI?

Watch for:

- meaningful causal / conditional explanation;
- repeating labels;
- click-through;
- memorized slogans;
- “I just picked this because it looked right.”

Do **not** require textbook-perfect language.

Do **not** teach the model.

### Signal 2 — TRANSFER

Watch whether the learner sees **the same deep physical relation**, rather than merely a similar-looking situation.

Ask internally:

- Are they transferring the model?
- Or matching surface cues?

Preserve any explanation they give.

### Signal 3 — Boundary / Zero Net Force

Watch carefully for reasoning around the zero-net-force case.

Especially observe whether the learner falls back to ideas such as:

「没有力就会停。」

Do **not** correct this during observation.

Record what they actually believe.

### Signal 4 — AI_OFF

Tutor support must remain unavailable as designed.

Watch whether the learner can reconstruct / use the model independently.

Distinguish:

- independent reasoning
- from remembering the layout or wording from the immediately previous page.

Do **not** provide physics help during AI_OFF.

### Signal 5 — Task Understanding

Find the **first** place where the learner appears not to know:

「这个页面到底要我做什么？」

This may be different from not knowing the physics.

Record it separately.

---

## 7. Classify Stuck Moments

Whenever the learner is stuck, classify the block **before** doing anything.

### A. UI / PROCEDURAL BLOCK

Examples:

- cannot find the button;
- does not realize the page scrolls;
- does not understand how to submit.

Observer **may** provide one neutral procedural clarification.

Example: 「这个页面还可以往下看。」

Do not indicate the correct physics choice.

### B. TASK-UNDERSTANDING BLOCK

The learner can operate the page but does not understand what the task is asking them to judge.

Observer **may** use one neutral question such as:

「你觉得这个页面现在想让你判断什么？」

Do not reinterpret the physics task for them.

### C. PHYSICS-REASONING BLOCK

The learner understands the task but does not know the physics or holds a misconception.

Example: 「没有力它肯定会停。」

Observer **must not** explain or correct the physics.

Record it.

Allow the product’s normal tutor where the stage permits it.

During AI_OFF, do not rescue with tutor content.

---

## 8. Rescue Rule

Do **not** treat “8 minutes” as a rigid scientific threshold.

It is only an operational reference from the prep protocol.

Consider rescue / end when:

- the learner has been meaningfully blocked for several minutes;
- the learner explicitly asks to stop;
- the learner becomes clearly distressed or frustrated;
- continuing is producing no new information.

**Allowed rescue:** one neutral procedural clarification.

Examples:

- 「你可以看看页面上还有没有别的操作。」
- 「我不能告诉你选哪个，但如果是不知道怎么操作，我可以告诉你按钮怎么用。」

**Not allowed:**

- physics hints;
- rephrasing the correct relation;
- pointing toward an answer;
- saying 「再想想合力」;
- reminding them of the model;
- explaining why an answer is wrong.

If still blocked: record the block and stop if appropriate.

A stopped session is valid observation data.

---

## 9. What to Record

For important moments record:

| Field | What to write |
|---|---|
| SESSION ID | Anonymous only, e.g. `LV-20260912-01` |
| STAGE | ENTRY / OBSERVE / DESCRIBE / PREDICT / EXPERIMENT / EXPLAIN / MODEL / TRANSFER / EXAM / AI_OFF / COMPLETE |
| APPROXIMATE TIME | Clock or minutes from start |
| WHAT THE LEARNER DID | Clicks, writes, skips, restarts |
| WHAT THE LEARNER SAID | Prefer exact quote |
| HELP REQUESTED? | YES / NO |
| PRODUCT HINT USED? | YES / NO |
| OBSERVER RESCUE? | YES / NO |
| BLOCK TYPE | UI / TASK / PHYSICS / NONE |
| CONFUSION SIGNAL | Reread, freeze, “看不懂” |
| MISCONCEPTION SIGNAL | e.g. 「没有力就会停」 |
| RUSH-CLICK / GUESS SIGNAL | Fast clicks, “随便选” |
| CONTINUE / STOP | CONTINUE / RESCUE-CONTINUE / STOP |
| OBSERVER NOTE | Strategy, affect; not a conclusion |

Do **not** turn observations into conclusions while the session is running.

---

## 10. What NOT to Record as Learning

During observation remember:

- completion ≠ understanding
- correct answer ≠ reasoning
- correct MODEL clicks ≠ constructed mental model
- correct reasoning ≠ model construction
- MODEL construction ≠ transfer
- one transfer ≠ general transfer ability
- AI_OFF success ≠ durable learning
- one learner ≠ population evidence
- enjoyment ≠ learning
- frustration ≠ product failure by itself

---

## 11. Immediately After the Session

Before changing the product or discussing improvements:

**SAVE TWO RAW SOURCES.**

### Source A — Raw Observer Notes

Preserve:

- exact learner quotes;
- stuck points;
- help requests;
- observer rescue;
- guesses;
- notable behavior;
- approximate timing.

Do **not** clean the learner’s language.

### Source B — Raw Session JSON

Copy the original value from:

```text
physics-lab.session.horizontal-force-cart.v1
```

Save it unchanged. Name the file with the anonymous session ID.

Do **not** first:

- normalize;
- summarize;
- remove failed attempts;
- rewrite fields;
- calculate conclusions.

Raw evidence comes first.

How to copy: stay on `/scenes/horizontal-force-cart` → developer tools → Application / Storage → Local Storage → copy that key’s JSON.

Inspection of fields (predictions, MODEL, transfer, AI_OFF, hints, events) is described in [`learner-validation-prep.md`](learner-validation-prep.md) §7. Do that **after** the raw file is saved.

---

## 12. Post-Session Questions

Ask after the learner has finished or stopped.

Use neutral wording.

1. 哪一步最难？难在什么地方？
2. 有没有哪一步其实是在猜？
3. 如果现在不用这个页面，你会怎么解释刚才这个物理规律？
4. 骑车、球、气垫上的物体和刚才的小车，你觉得是同一类问题，还是不一样？为什么？
5. 刚才页面里的提示，是帮你想明白了，还是主要告诉你应该往哪里选？
6. 如果还有另一个类似的探究，你愿意继续做吗？为什么？
7. 有没有哪一段让你觉得无聊、着急，或者想停下来？

Record answers as close to the learner’s own words as possible.

Do **not** ask: 「你是不是学会了？」

---

## 13. Fill the First Session Review

After preserving raw evidence, fill:

[`templates/first-session-review.md`](templates/first-session-review.md)

Use:

**OBSERVED** for direct evidence such as:

- quote;
- click;
- attempt;
- timestamp;
- hint use;
- session field.

**INFERRED** for reviewer interpretation based on observed evidence.

**NOT YET SUPPORTED** for claims that this single observation cannot establish.

Do not silently turn inference into observation.

---

## 14. First Learner Evidence Review

Do **not** immediately ask:

“What should we change in the product?”

First perform:

```text
PRODUCT EVIDENCE
        vs
OBSERVED LEARNER THINKING
```

Audit especially:

### L4

Product: `constructedValidCausalModel`

Ask: Did the learner actually construct the force/motion model?  
Or did the interaction allow them to reach the evidence through recognition / click-through?

### L5

Product: `successfulTransfer`

Ask: Did the learner identify the same deep relation in the new target?  
Or did they use surface similarity / remembered interaction patterns?

### L6

Product: `independentAiOffSuccess`

Ask: Did the learner independently reconstruct / use the model?  
Or did they reproduce something immediately remembered from the scaffolded stages?

Official L-levels are derived product flags. They are **not** proof of understanding.

---

## 15. Do Not Change the Product Yet

After one observation:

Do **not** automatically:

- rewrite Scene 03;
- change evaluators;
- change UPLP;
- change L1–L6;
- change the Evidence Design Contract;
- promote model status;
- mark anything `validated`;
- generalize findings to all Grade-9 students.

First review the evidence.

A surprising learner behavior may represent:

- one learner;
- unclear UI;
- unclear task wording;
- a physics misconception;
- cognitive overload;
- structured click-through;
- tutor dependence;
- genuine model failure.

These require different responses.

---

## 16. What to Bring to Learner Evidence Review

Prepare:

1. completed `first-session-review.md`;
2. important learner quotes, preferably verbatim;
3. every significant stuck point: stage, block type, what happened, how they continued;
4. every observer rescue and exact wording;
5. answers to the seven post-session questions;
6. raw Scene 03 session JSON;
7. observer’s 1–3 most surprising observations.

Keep **RAW EVIDENCE** separate from **OBSERVER INTERPRETATION**.

---

## 17. Decision After Review

The first observation should **not** automatically lead to a product change.

Possible next decisions include:

- observe a second learner;
- observe the same Scene again;
- inspect one suspected evidence mismatch;
- make one focused Scene 03 repair;
- refine observation protocol;
- observe Scene 04;
- reconsider one Evidence Design assumption.

Choose only after Learner Evidence Review.

---

## 18. Explicit Non-Claims

One observation does **not** establish:

- learner validation;
- effectiveness;
- improved physics thinking;
- improved transfer ability;
- improved exam performance;
- reduced need for practice;
- tutor effectiveness;
- Grade-9 population behavior;
- production readiness.

The first observation is evidence discovery.

---

## 19. Canonical Sequence

```text
PREPARE
  ↓
RESET SCENE
  ↓
ASSIGN ANONYMOUS SESSION ID
  ↓
OPEN RAW OBSERVATION NOTES
  ↓
READ OPENING SCRIPT
  ↓
STUDENT OPERATES
  ↓
OBSERVER WATCHES WITHOUT TEACHING
  ↓
CLASSIFY STUCK MOMENTS
  ↓
USE PROCEDURAL RESCUE ONLY IF NEEDED
  ↓
FINISH OR STOP NATURALLY
  ↓
SAVE RAW OBSERVER NOTES
  ↓
SAVE RAW SESSION JSON
  ↓
ASK POST-SESSION QUESTIONS
  ↓
COMPLETE FIRST-SESSION REVIEW
  ↓
RUN LEARNER EVIDENCE REVIEW
  ↓
ONLY THEN DECIDE WHETHER PRODUCT CHANGES ARE NEEDED
```

---

## 20. Relationship to Other Documents

Document ownership:

| Document | Owns |
|---|---|
| [`learner-validation-prep.md`](learner-validation-prep.md) | WHY / WHAT to observe |
| `first-learner-observation-guide.md` (this file) | HOW to execute the first observation |
| [`templates/first-session-review.md`](templates/first-session-review.md) | HOW to record / review one session |
| Future Learner Validation Protocol | If later created, broader multi-session methodology |

This Guide must **not** redefine UPLP, the Evidence Design Contract, Physics Model lifecycle, or L1–L6.

Prep still owns the first Scene choice, learner questions, local-storage inspection fields, and instrumentation-gap classification. This Guide does not replace those sections.
