# Scene 02 — Interaction Script

> Scene-specific student experience  
> Scene ID: `four-stroke-engine`  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

This file instantiates UPLP for this Scene. It does **not** own stage order, stage semantics, H1–H5, or AI permission policy.

- Stages and AI_OFF: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Physics state: [`physics-state.md`](./physics-state.md)
- Stage mapping: [`learning-flow.md`](./learning-flow.md)
- Concrete model: [`../../../content/physics-models/chemical-energy-internal-energy-mechanical-energy/`](../../../content/physics-models/chemical-energy-internal-energy-mechanical-energy/)

`S00`–`S12` are script labels mapped onto UPLP stages. They are not a second global state machine.

All student-facing copy is Simplified Chinese. Internal IDs stay English.

---

## Interaction philosophy

Each stage should create a cognitive action, not display the answer.

The four strokes are what the student can **see**. The thing to construct is the energy chain.

Do not open with:

```text
化学能 → 内能 → 机械能
```

Do not close with:

> 你已经完全掌握内燃机。

---

## S00 — ENTRY · 开始探索

### Student sees

A simplified single-cylinder engine. No energy-chain caption. Stroke names may appear later as labels of motion, not as the learning goal.

Headline:

> 燃料为什么能让发动机持续转起来？

CTA:

> 开始探索

### Student action

Start.

### System

Create a physical question. Do not teach the chain.

### AI

None.

---

## S01 — OBSERVE · 先观察

### Student sees

Piston, intake valve, exhaust valve, ignition/combustion event, crankshaft.

### Interaction

Play / pause / step one stroke / replay.

The student watches **one complete cycle**. This run is observation only.

### Prompt

> 先不背名称。你看到了哪些东西在什么时候发生变化？

### Required action

Watch a full cycle. Write a raw observation.

### Evidence

`rawObservation` about this engine.

### AI

ASK / ENCOURAGE only. Do not inject 化学能、内能、机械能 as required vocabulary.

### Forbidden

Treat this autoplay as EXPERIMENT evidence.

---

## S02 — DESCRIBE · 用物理语言描述

### Prompt cluster

> 活塞在哪些阶段向上？哪些阶段向下？

> 什么时候进气门打开？什么时候排气门打开？

> 什么时候出现燃烧？

> 哪个阶段看起来最可能在推动机械系统？

### Required action

Answer in physical language about **observable facts**.

Textbook names 吸气 / 压缩 / 做功 / 排气 are helpful if the student uses them, but they are **not** the gate.

### Pass (semantic, not length)

The description must show:

1. piston direction changes across the cycle;
2. a valve event **or** the combustion event;
3. a distinction between the power event and the other strokes.

### AI

ASK / HINT / ENCOURAGE. Focus on what changed, when.

### Forbidden

Require the full energy model. Accept any non-empty string.

---

## S03 — PREDICT · 先预测

Prediction is authored **before** the matching intervention.

### Experiment A question

From model experiment `ignition-energy-release`:

> 如果压缩完成后没有发生正常燃烧，还会不会出现正常的主要动力输出？为什么？

### Experiment B question

From model experiment `immovable-mechanical-system`:

> 燃料正常燃烧，但高温气体无法推动机械部件运动。这个装置还能按原来的方式输出机械能吗？为什么？

### Required action

For each experiment: `prediction` + `reason`.

### AI

ASK / HINT / CHALLENGE. Never reveal the deterministic result.

---

## S04 — EXPERIMENT · 动手验证

### Student sees

Controls for one condition at a time:

- 燃烧能否发生 (`combustionEnabled`)
- 机械部件能否运动 (`pistonCanMove`)

After the student runs the intervention, the **application** shows the cycle result.

### Prompt

> 改一个条件，看看是不是和你想的一样。

### Required closure (each experiment)

1. 预测  
2. 改条件  
3. 看到的结果  
4. 预测和结果比一比  
5. 这次动手让你看清了什么  

Missing any part → experiment not complete.

### Deterministic outcomes (do not let the LLM narrate them as physics)

**A — 关掉燃烧**

没有正常燃烧 → 没有正常的内能/状态变化路径 → 没有正常膨胀做功 → 没有正常的主要机械输出。

**B — 卡住机械系统**

燃烧仍可能发生，气体仍可能变热，但做功到机械能这一步完不成 → 没有正常机械输出。

### AI

None. Physical result is application state.

---

## S05 — EXPLAIN · 解释为什么

### Prompts

> 为什么做功过程能够让机械系统运动？

> 机械运动的能量最初来自哪里？中间经过了什么过程？

### Required action

Student-authored causal attempt.

### AI

May use UPLP H1–H5. Must not immediately output:

```text
化学能 → 内能 → 做功 → 机械能
```

as the student's answer.

EXPLAIN prepares MODEL. It does not replace MODEL.

---

## S06 — MODEL · 建立物理模型

### Student sees

A causal-chain workspace. The engine visualization **may** be replaced for this stage.

Combustion appears as an **enabling process/event**, not as a 物理量 chip.

### Prompt

> 把能量从燃料到机械运动的过程连起来。

### Preferred nodes (student labels)

- 燃料的化学能  
- 工作气体的内能/状态  
- 机械系统  
- 机械能  

### Preferred relations

- 能量转化  
- 导致状态变化  
- 做功  

### Required action

Structured construction. A long paragraph alone is not enough.

### Pass

See [`evidence-contract.md`](./evidence-contract.md). Keyword presence is not L4.

### AI

May point at a missing link. Must not build the complete student model.

---

## S07–S09 — TRANSFER · 换个情境试试

Do not rewrite the stories. Use the model targets.

### Near — `near-motorcycle-piston-engine`

> 一辆摩托车靠活塞发动机行驶。汽油在气缸里燃烧后，车子能向前走。你觉得能量是怎样一步步到车轮上的？

Expected: full chain. `TransferMode = full-model`.

### Medium — `medium-lab-combustion-piston`

> 实验室里有一个简易装置：少量可燃气体在封闭气缸中被点燃，活塞被推出去。这个装置没有完整的四个冲程图，也没有汽车外壳。你还能用刚才的想法解释吗？

Expected: full chain without relying on four-stroke names.

### Far — `far-steam-piston`

> 蒸汽机里，高温蒸汽膨胀，推动活塞运动。这里没有汽油在气缸里燃烧。哪些想法还能用？哪些不能直接搬过来？

`TransferMode = partial-structure`.

Transferable:

```text
内能/状态变化 → 做功 → 机械能
```

Not automatically transferable:

```text
燃料化学能 → 内能
```

Recognizing “有活塞” is not success.

### AI

Must not name the shared model before the student attempts.

---

## S10 — EXAM · 试试看考试题

Visual switch to Exam World. Engine hidden.

Do **not** start with: stem + four choices + click.

Sequence (UPLP):

1. 出示题干  
2. 这道题主要在考什么？  
3. 你准备用哪个物理关系/模型？  
4. 再出示/开放选项  
5. 作答  
6. 写一句理由  

Store `selectedAnswer` and `reasoning` separately.

Questions come from the model's `examPatterns`. Do not invent a second bank.

Copy:

> 现在先不看发动机。先把题目想清楚，再选答案。

---

## S11 — AI_OFF · 独立挑战

Tutor hidden. No hint buttons. No leftover tutor text as a clue. No API call.

Use:

- `ai-off-unfamiliar-combustion-piston`
- `ai-off-condition-locked-mechanism`

Prompt chrome:

> 这一次，自己来。这一页没有提示。

Both challenges must be attempted with `llmUsed = false`.

---

## S12 — COMPLETE · 回头看看

Reflection, evidence-oriented:

> 今天真正要抓住的，不是四个冲程的名字，而是燃料中的能量怎样经过物理过程变成机械运动。

Do not say the student has mastered the internal-combustion engine.

Official L1–L6 still come from `deriveModelEvidenceLevel`, not from this screen.
