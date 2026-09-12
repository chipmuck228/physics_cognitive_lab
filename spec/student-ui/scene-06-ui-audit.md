# Scene 06 Student UI Interaction Audit

> Date: 2026-09-12  
> Scene: `simple-resistor-circuit`  
> Contract: [`../student-ui-interaction-contract.md`](../student-ui-interaction-contract.md)  
> Screenshots: `screenshots/scene-06-{observe,predict,experiment,model,transfer,exam,ai-off}.png`

This is interaction quality, not Physics Truth, PRI, or learner validation.

---

## Stage checks

| Stage | Visible question | Semantic grouping | CTA | Blocked-action reason | Internal words | Verdict |
|---|---|---|---|---|---|---|
| OBSERVE | 你看见了什么？把对的都勾上。 | three checkboxes | 记下我看见的 | 这三项都要勾上 | none | PASS |
| DESCRIBE | 你在看什么 / 哪几个量 / 有什么不同 | QuestionGroup | 记下我的说法 | 先把三个问题和一句话都写上 | none | PASS |
| PREDICT | experiment-specific current question | outcome + reason | 先记下我的猜测 | 先选电流会怎样，再写理由 | none | PASS |
| EXPERIMENT | 哪个量没变 / 电流怎样 / 和猜测比 | sequential cards | 对照读数 / 记下… | 先写下猜测才能对照 | none | PASS |
| EXPLAIN | 是不是一回事 + one-control questions | QuestionGroup | 记下我的说明 | 还没有写完 | none | PASS |
| MODEL | one board, explicit questions, authored sentence | OhmsRelationBoard | 提交关系 | missing vs incorrect ValidationMessage | none | PASS |
| TRANSFER | 还能不能用 / 哪些不能直接搬 | judgments + filament probes | 提交这次判断 | 先判断哪些还能用… | none | PASS |
| EXAM | 题干 → 考什么 → 关系 → 选项 | Exam World, no lab | 下一步 / 提交这道题 | 先想清楚题目在问什么… | none | PASS |
| AI_OFF | challenge question + 选择你的判断 | pre-commit then post-check | 记下我的判断 | 先选判断、勾出用到的想法… | none | PASS |

Student-facing stage labels use 看一看 / 写出关系 / 换个样子 / 自己做. No L4/L5/L6, evaluator, provenance, or “transfer” as an internal noun.

Tutor: present where UPLP allows; absent in EXPERIMENT / AI_OFF / COMPLETE. CTA remains 给我一点提示.

---

## MODEL lock (interaction)

MODEL is **not** six independent “completion radios.”  
I, U, R, relation, two comparisons, rearrangement reject, condition, and one authored sentence sit on one board.  
Empty submit shows missing feedback. Six clicks + formula text show incorrect feedback and do not advance.

---

## Verdict

`STUDENT_UI_PASS_WITH_REFINEMENTS`

Refinement: MODEL and EXPLAIN still show both the Tutor panel and “给我一个台阶.” That dual-hint pattern already exists on Scene 05. It is interaction chrome, not a silent button.

No claim that students understood the questions.
