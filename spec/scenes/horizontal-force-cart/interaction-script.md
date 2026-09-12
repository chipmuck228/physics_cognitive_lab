# Scene 03 — Interaction Script

> Scene-specific student experience  
> Scene ID: `horizontal-force-cart`  
> Primary model: `force-changes-motion-state`

This file instantiates UPLP for this Scene. It does **not** own stage order, stage semantics, H1–H5, or AI permission policy.

- Stages and AI_OFF: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Physics state: [`physics-state.md`](./physics-state.md)
- Stage mapping: [`learning-flow.md`](./learning-flow.md)
- Concrete model: [`../../../content/physics-models/force-changes-motion-state/`](../../../content/physics-models/force-changes-motion-state/)

`S00`–`S12` are script labels mapped onto UPLP stages. They are not a second global state machine.

All student-facing copy is Simplified Chinese. Internal IDs stay English.

---

## Interaction philosophy

Each stage should create a cognitive action, not display the answer.

The cart is what the student can **see**. The thing to construct is the force / motion-state relation.

Do not open with:

```text
力能改变物体运动状态。
```

Do not close with:

> 你已经完全掌握力与运动。

---

## S00 — ENTRY · 开始探索

### Student sees

A simplified cart on one straight track. No force-rule caption.

Headline:

> 这个小车什么时候会走得更快、更慢，或者改变方向？

CTA:

> 开始探索

### Student action

Start.

### System

Create a physical question. Do not teach the rule.

### AI

None.

---

## S01 — OBSERVE · 先观察

### Student sees

Cart, track, later a force arrow, motion.

### Interaction

Play / pause / replay.

The student watches the **opening demo**. This run is observation only.

### Prompt

> 先不要下结论。你看到了哪些东西在什么时候发生变化？

### Required action

Watch the demo. Select structured observations.

Suggested options (mix of targets and distractors):

- 小车一开始是停着的
- 后来它开始运动
- 它越来越快
- 画面里有一辆小车（not sufficient alone）
- 每个时候它都在掉头（distractor）
- 它有轮子所以一定会越来越快（distractor）

### Evidence

`rawObservation` about this cart.

### AI

ASK / ENCOURAGE only. Do not inject the textbook rule.

### Forbidden

Treat this autoplay as EXPERIMENT evidence.

---

## S02 — DESCRIBE · 用物理语言描述

### Prompt cluster

> 你看到的物体是什么？

> 它一开始是静止还是已经在动？

> 力的箭头朝哪边？有没有箭头？

> 后来是开始运动、加快、减慢，还是方向变了？

### Required action

Structured fields first. Own-words sentence second.

### Pass (semantic, not length)

The description must show:

1. the object is the cart;
2. initial motion state;
3. force direction (including “no obvious horizontal force” if that was visible);
4. a motion-state change (start / speed up / slow down / reverse), not only “它动了”.

### AI

ASK / HINT / ENCOURAGE. Focus on what changed, when.

---

## S03 — PREDICT · 先预测

### Setup

Cart already moving to the right. No result yet.

### Prompt

> 小车已经在向右运动。如果再给它一个向右的水平力，它的运动快慢会怎样变？请先选结果，再写一句理由。

### Outcomes

`sped-up` / `slowed-down` / `unchanged` / `reversed` / `unsure`

### Required action

Commit before run.

### AI

ASK / HINT / CHALLENGE. Must not state the next tick.

### Forbidden

Start the intervention first.

---

## S04–S06 — EXPERIMENT · 动手验证

Three complementary cuts. Each follows:

prediction → intervention → result → comparison → reflection

### S04 Experiment A · `force-with-motion`

> 顺着运动方向再推一下。

Expected truth: 变快.

### S05 Experiment B · `force-against-motion`

Experiment-local prediction (tutor off):

> 小车仍在向右。如果给它一个向左的力，运动状态会怎样变？

Expected truth: 变慢. Optional later reversal if the force stays on.

### S06 Experiment C · `zero-net-force-while-moving`

Experiment-local prediction (tutor off):

> 小车已经在向右运动。如果水平合力变为零，它会不会立刻停下来？

Expected truth: 不立刻停；快慢和方向保持不变.

### System

Application owns `CartState`. LLM silent.

### Forbidden

Replay the OBSERVE demo as a substitute. Repeat the same cut as drilling.

---

## S07 — EXPLAIN · 解释为什么

### Prompt

> 把三次实验放在一起看：合力怎样改变运动状态？力和运动是同一件事吗？合力为零时，物体一定静止吗？

### Structured choices (not a single sentence gate)

- 力和运动是不是同一件事
- 合力与运动同向时快慢怎样
- 合力与运动反向时快慢怎样
- 合力为零时运动状态怎样

Then own words.

### Pass

Must not accept as sufficient:

- 有力就一定运动
- 物体运动就一定受到向前的力
- 没有力物体就会停下
- 平衡力就是没有力

### AI

Progressive H1–H5. Do not dump the full relation.

---

## S08 — MODEL · 建立物理模型

### Student sees

Relation board:

```text
当前运动状态  +  合力 / 方向关系  →  运动状态变化
条件：一维、忽略摩擦；合力为零则不变
```

Not four energy boxes in a line.

### Prompt

> 把“现在怎么运动、合力怎样、运动状态怎样变”连起来。不要只抄一句话。

### AI

May point at a missing slot. Must not place the relation for the student.

---

## S09 — TRANSFER · 换个情境试试

Use the model scenarios. Do not say “这也有轮子” as the intended hint.

Near: 自行车越蹬越快  
Medium (scaffold): 球被迎面挡住后变慢  
Far: 气垫导轨上已经在滑动、水平合力为零

### AI

Wait for an attempt. Do not name the shared model first.

---

## S10 — EXAM · 试试看考试题

Hide the cart. Exam World sequence. Stage label: 试试看考试题.

> 现在先不看小车。先把题目想清楚，再选答案。

---

## S11 — AI_OFF · 独立挑战

No tutor chrome. No leftover hint list.

Hover sled, then tug-of-war on a moving crate.

Independent judgment + reason first. Post-check second.

---

## S12 — COMPLETE · 回头看看

> 今天真正要抓住的，不是这辆小车的样子，而是合力怎样改变运动状态，以及合力为零时运动状态为什么可以不变。
