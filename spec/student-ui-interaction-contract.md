# Student UI Interaction Contract

**Project:** `physics-cognitive-lab`  
**Purpose:** Define the minimum student-facing interaction quality required for every production Scene  
**Status:** Canonical UI/interaction contract  
**Scope:** Student-facing clarity, action semantics, feedback, tutor affordance, accessibility of task intent  
**Does not own:** Physics truth, physical representation integrity (quantity identity, units, arrows — [`physics-representation-integrity-contract.md`](./physics-representation-integrity-contract.md)), UPLP stage semantics, Physics Model semantics, evidence-level meanings, evaluator truth, lifecycle semantics

---

## 1. Why this contract exists

A Scene can be physically correct, pass engineering tests, and still fail the student.

Typical failures:

- options appear without a clear question;
- a button can be clicked but nothing visible happens;
- a blocked action gives no explanation;
- Tutor controls are ambiguous about what they do;
- a student must infer the question from the answer choices;
- the interface exposes internal project vocabulary rather than student language;
- the page technically advances but the learner does not know what was expected.

Therefore:

```text
Physics Correctness
≠ Interaction Correctness
≠ Learner Comprehension
```

This contract owns the middle layer.

---

## 2. Core student-facing rule

At every stage, a Grade-9 student should be able to answer three questions without reading source code or guessing from context:

1. **现在要我做什么？**
2. **我操作以后会发生什么？**
3. **如果不能继续，我该知道什么？**

If the UI does not make those three things clear, the Scene fails this contract even if the internal state machine is correct.

---

## 3. Required interaction invariants

### UI-01 — Every response group must have an explicit prompt

A radio group, checkbox group, text area, drag target, selector, or structured board must have a visible question or instruction.

Forbidden:

```text
○ 变小了
○ 几乎没变
○ 消失了
```

Required:

```text
质量发生了什么变化？

○ 变小了
○ 几乎没变
○ 质量消失了
```

Students must not need to infer the question from answer choices.

---

### UI-02 — One visual group = one semantic question

If two different quantities are being judged, they must not appear as two unlabeled option groups under one vague heading.

Required:

```text
质量发生了什么变化？
...

体积发生了什么变化？
...
```

The UI must expose the semantic dimension being judged.

---

### UI-03 — Primary CTA must describe the intended action

The main action should communicate what will happen next.

Prefer:

- `提交预测`
- `开始验证`
- `记下这个关系`
- `检查我的模型`
- `进入下一步`
- `给我一点提示`

Avoid ambiguous labels such as:

- `问一句`
- `继续`
- `确定`
- `完成一下`

unless context makes the action unambiguous.

---

### UI-04 — Every click must produce an understandable visible result

A primary action may result in:

```text
success → advance / confirm
incomplete → show what is missing
not accepted → show bounded feedback
loading → show progress
system failure → show retryable error
```

Forbidden:

```text
click → no visible change
```

A student must not have to guess whether:

- the answer was wrong;
- something is missing;
- the button is broken;
- the request is loading;
- the network failed.

---

### UI-05 — Blocked progression requires student-visible reason

Internal logic may return `canAdvance = false`, but the student must receive a visible explanation.

Example contract shape:

```ts
type StudentGateResult = {
  canAdvance: boolean;
  reasonCode?: string;
  studentFeedback?: string;
};
```

The exact runtime type may differ. The semantic requirement does not.

Feedback should be stage-appropriate and must not leak protected answers.

---

### UI-06 — Validation feedback must distinguish missing vs incorrect

Where possible:

```text
missing input
≠ invalid combination
≠ misconception
≠ system error
```

Do not use the same generic sentence for every failure state.

---

### UI-07 — Tutor affordance must state its purpose

Tutor access must not look like unrestricted chat unless unrestricted chat is actually intended.

For the current product, the preferred student meaning is:

```text
“我有点卡住了，给我一个不会直接告诉答案的提示。”
```

Preferred CTA:

```text
给我一点提示
```

Tutor interaction must:

- use current stage;
- use current Scene state;
- use relevant student evidence;
- respect stage-specific leak rules;
- escalate hints gradually;
- avoid repeating the same generic prompt;
- remain unavailable in AI_OFF and COMPLETE.

---

### UI-08 — Student-facing language must not expose internal architecture vocabulary

Do not expose terms such as:

- `TRANSFER`
- `AI_OFF`
- `L4/L5/L6`
- `evidence`
- `misconception`
- `SceneAdapter`
- `primaryModel`

unless the concept itself is being taught and has an age-appropriate Chinese label.

---

### UI-09 — Stage intent must be visually obvious

Every stage needs a clear local purpose.

Examples:

```text
先观察
先预测
动手验证
解释为什么
建立物理模型
换个情境试试
试试看考试题
独立挑战
```

The page should not rely only on global navigation to communicate intent.

---

### UI-10 — MODEL UI must expose what relation is being constructed

A MODEL screen may use cards, boards, ratios, chains, cases, or other grammars, but the student must know:

- what entities/quantities are being compared;
- what relation is being selected or constructed;
- what condition matters;
- what action completes the model step.

Structured UI is allowed. Hidden semantics are not.

---

### UI-11 — TRANSFER UI must clearly identify the new target

The student must know what new situation is being judged.

Do not mix multiple targets without visible labels.

If a transfer task is `partial-structure` or `boundary-contrast`, the interface must make the comparison target clear enough for the student to distinguish what transfers and what does not.

---

### UI-12 — EXAM UI must feel like Exam World, not another experiment panel

Preserve the intended sequence:

```text
题干
→ 识别题目在描述什么
→ 识别/选择关系
→ 最后出现正式选项
→ 提交答案
→ 提交理由
```

Do not reveal final options too early.

---

### UI-13 — AI_OFF must remove Tutor affordances completely

In AI_OFF:

- no hint button;
- no Tutor panel;
- no Tutor network request;
- no stale hint action;
- refresh must remain blocked from Tutor use.

---

### UI-14 — COMPLETE is terminal and understandable

COMPLETE must clearly communicate completion of the learning loop without claiming mastery or guaranteed score improvement.

No Tutor should remain active.

---

### UI-15 — Repeated actions must preserve user understanding

If a CTA can be clicked multiple times:

- repeated clicks must not silently duplicate state;
- loading state should prevent accidental duplicate submission where needed;
- retries should be understandable;
- history/evidence requirements remain append-only where governed elsewhere.

---

## 4. Required QuestionGroup semantics

Production Scenes should prefer a shared question primitive when practical.

Recommended conceptual API:

```ts
type QuestionGroupProps = {
  id: string;
  question: string;
  helperText?: string;
  required?: boolean;
  options?: Array<{
    id: string;
    label: string;
  }>;
  error?: string;
};
```

Contract requirements:

- `question` cannot be empty;
- `id` must be stable;
- options must be bound to that question;
- error/feedback must be rendered near the group;
- screen-reader semantics should associate the label with the controls.

The exact component name is not canonical. The semantics are.

---

## 5. Primary action contract

Every stage-level primary CTA must have:

```text
visible label
enabled/disabled or submit semantics
loading state if asynchronous
visible success/blocked/error outcome
no silent failure
```

A disabled button with no explanation is acceptable only when the missing requirement is obvious from adjacent UI. Otherwise, explain what is missing.

---

## 6. Hint interaction contract

Student intent:

```text
REQUEST_HINT
```

Meaning:

> “I am stuck. Give me the smallest useful help without giving me the protected answer.”

System behavior:

```text
current stage
+ Scene state
+ student attempts/evidence
+ previous hints
+ stage hint policy
→ allowed hint level
→ one bounded next-step hint
→ record hint usage
```

Stage intent:

| Stage | Hint may do | Hint must not do |
|---|---|---|
| OBSERVE | direct attention to observable features | explain the physics |
| DESCRIBE | help identify object/quantity/change | write the completed description |
| PREDICT | help identify what variable/result to think about | reveal the outcome |
| EXPERIMENT | clarify control/observation/comparison | tell the expected result |
| EXPLAIN | ask causal follow-up | supply the full causal explanation |
| MODEL | point to missing category/condition | provide the required model relation |
| TRANSFER | prompt comparison of structures/conditions | identify the final transferred relation |
| EXAM | help parse representation/model | reveal final answer |
| AI_OFF | unavailable | any Tutor action |
| COMPLETE | unavailable | any Tutor action |

Repeated hint requests may escalate gradually, but must remain inside the stage policy.

---

## 7. Testable UI contract assertions

Automated tests should be able to verify at least:

```text
every interactive answer group has a visible question/label
every primary CTA has non-empty visible text
invalid submit produces visible feedback
valid submit produces visible state change
loading state is visible for async actions
Tutor CTA purpose is clear
AI_OFF has no Tutor CTA
COMPLETE has no Tutor CTA
no blank question titles
no orphan radio/checkbox groups
no silent primary-action failure
```

These checks do not replace visual review.

---

## 8. Human visual review questions

For each key stage screenshot, ask:

1. 不看代码，我知道这一步让我做什么吗？
2. 每组选项，我知道它在回答哪个问题吗？
3. 我知道主按钮按下去意味着什么吗？
4. 如果不能继续，我知道为什么吗？
5. 我知道提示按钮是干什么的吗？
6. 页面有没有把答案或关键结构提前说出来？
7. 有没有开发者懂、学生不懂的词？
8. 页面是否把多个不同问题挤成一个含糊任务？

A screenshot review may identify a problem even when automated tests pass.

---

## 9. Change-impact classification

UI changes should be classified before deciding how much review to repeat.

### Level A — Presentation

Examples:

- spacing;
- typography;
- non-semantic layout;
- wording that does not change task meaning.

Required:

```text
engineering/UI regression
```

### Level B — Learning Interaction

Examples:

- Tutor hint behavior;
- CTA semantics;
- validation feedback;
- how the student commits an answer;
- interaction ordering without changing Physics Model semantics.

Required:

```text
engineering regression
+ targeted evidence impact review
```

### Level C — Model / Evidence Semantics

Examples:

- change to physics relation;
- change to model boundary;
- change to transfer requirement;
- change to evaluator meaning;
- change that can alter L4/L5/L6 evidence.

Required:

```text
affected PRE/readiness/POST gates as determined by canonical governance
```

Do not rerun the full lifecycle for every UI change.

---

## 10. Non-goals

This contract must not:

- redefine UPLP stages;
- change Physics Model semantics;
- assign L-levels;
- decide physical correctness;
- create a second evidence engine;
- require identical visual design across all models;
- force every Scene into one interaction grammar;
- treat one screenshot as learner validation.

---

## 11. One-line rule

> **A production Scene must never make a student infer the question, infer why an action failed, or infer what a Tutor control is for.**
