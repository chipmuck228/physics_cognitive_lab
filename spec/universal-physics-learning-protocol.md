# Universal Physics Learning Protocol (UPLP)

**项目：** physics-cognitive-lab  
**文档状态：** v0.2 — Design Draft  
**定位：** 跨物理模型、跨现象、跨考试表示的统一认知学习协议  
**适用对象：** 以九年级物理为第一目标人群，未来可扩展至其他学段

---


## Architecture Contract & Cross-References

This document is one part of the architecture contract:

1. [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) — **HOW** a student learns and demonstrates a Physics Model.
2. [`physics-model-schema.md`](./physics-model-schema.md) — **WHAT** every valid Physics Model must contain.
3. [`physics-model-library.md`](./physics-model-library.md) — **WHICH** Physics Models exist, their coverage status, and how they relate.

Supporting: [`cognitive-action-taxonomy.md`](./cognitive-action-taxonomy.md) owns canonical C1–C14 IDs. [`physics-model-implementation-protocol.md`](./physics-model-implementation-protocol.md) owns how a ready model is implemented as a Scene. [`physics-model-quality-review.md`](./physics-model-quality-review.md) owns whether a model's physics, pedagogy, and learning-evidence claims are justified. Those documents must not redefine stage semantics in this document.

### Source of truth

- Learning stages, stage semantics, evidence flow, AI role by stage, and the universal cognitive loop are defined **only in this document**.
- Physics Model fields, type contracts, completeness requirements, and model-level content structure are defined **only in `physics-model-schema.md`**.
- Canonical model IDs, model families, curriculum coverage, model graph, priorities, and lifecycle inventory are defined **only in `physics-model-library.md`**.
- Other documents may reference these definitions but must not independently redefine them. If duplicated text conflicts, the designated source-of-truth document wins.

### Required relationship

Every learning loop MUST declare one `primaryModel` that conforms to `physics-model-schema.md` and exists (or is being added) in `physics-model-library.md`. A Scene is an implementation of that model under this Universal Protocol; it is not an isolated learning flow.

### Cursor required reading order

Before implementing or modifying any Physics Model, Scene, learning flow, tutor policy, transfer task, Exam World, or AI_OFF challenge, Cursor MUST read in this order:

```text
1. spec/universal-physics-learning-protocol.md
2. spec/physics-model-schema.md
3. spec/physics-model-library.md
4. the concrete model definition
5. the Scene-specific specification, if any
```

Interpretation:

```text
Protocol = HOW students learn a model
Schema   = WHAT a valid model contains
Library  = WHICH models exist and how they relate
Scene    = WHERE a model becomes observable and interactive
```

---
## 1. 设计目标

`physics-cognitive-lab` 的核心不是让学生“做更多题”，也不是让 LLM “讲更多知识”。

核心目标：

> 帮助学生在真实/可操作的物理现象中，逐步建立、检验、修正并迁移可复用的物理模型。

因此，系统的最小教学单位不是“题目”，也不是“实验动画”，而是：

> **Physics Model（物理模型）**

一个模型可以通过多个不同现象、实验和考试表示被反复调用。

---

## 2. 核心架构原则

### 2.1 三个角色

```text
APP = TRACK
LLM = ENGINE
STUDENT = THINKER / DRIVER
```

### APP 负责

- 物理世界和确定性模拟
- 学习状态机
- 学习进度
- 证据记录
- 模型评价
- 阶段性 AI 权限
- Assessment
- AI_OFF 强制执行

### LLM 负责

- 提问
- 最小提示
- 鼓励
- 挑战
- 必要时解释
- 识别学生当前表达中的潜在错误模型
- 根据当前证据调整对话

LLM 不负责决定实验物理结果、决定学习阶段、修改物理状态或在 AI_OFF 阶段提供帮助。

### STUDENT 负责

- 观察
- 描述
- 预测
- 操作
- 比较预测与结果
- 解释
- 建模
- 修正模型
- 迁移
- 独立解决新问题

---

## 3. Universal Learning Loop

所有 Physics Model 默认使用统一认知闭环：

```text
ENTRY
  ↓
OBSERVE
  ↓
DESCRIBE
  ↓
PREDICT
  ↓
EXPERIMENT
  ↓
EXPLAIN
  ↓
MODEL
  ↓
TRANSFER
  ↓
EXAM
  ↓
AI_OFF
  ↓
COMPLETE
```

这是统一协议，不要求每个 Scene 机械执行完全相同的页面。

`MODEL_REVISION`、`CONDITION_CHECK`、`QUANTITATIVE_REASONING` 等可以作为阶段内部子流程，而不必立即增加全局 Stage。

---

## 4. 学生语言原则

内部术语和学生术语严格分离。

| Internal Stage | Student UI |
|---|---|
| OBSERVE | 先观察 |
| DESCRIBE | 说说你看到的 |
| PREDICT | 猜一猜 |
| EXPERIMENT | 动手试试 |
| EXPLAIN | 想想为什么 |
| MODEL | 建立你的解释 |
| TRANSFER | 换个情况试试 |
| EXAM | 像考试一样做 |
| AI_OFF | 独立挑战 |

禁止把以下内部术语直接暴露给学生：

- Transfer
- Cognitive Goal
- Misconception
- Evidence
- Physics State
- State Machine
- AI_OFF
- Learning Objective

原则：

> **让系统知道正在训练什么，但不要求学生知道教育学术语。**

---

## 5. Physics Model 的认知定义

每个模型至少回答：

1. 学生最终应该能够解释什么现象？
2. 需要识别哪些物理量？
3. 哪些量之间存在因果关系？
4. 能量在哪里转移/转化？
5. 模型成立需要什么条件？
6. 哪些相似现象不能直接使用这个模型？
7. 最容易形成哪些错误模型？
8. 可以操纵哪些变量？
9. 哪些实验/反事实测试最有信息量？
10. 哪些新情境可以检验迁移？
11. 该模型在考试中有哪些表示方式？
12. AI_OFF 如何证明学生可以独立调用该模型？

---

## 6. Physics Model Contract

`PhysicsModel` 的 canonical schema **只在** [`physics-model-schema.md`](./physics-model-schema.md) 中定义。

UPLP 不重复定义 `PhysicsModel` interface，避免 Protocol 与 Schema 发生 drift。对本协议而言，只依赖以下约束：

- 每个学习闭环必须声明一个 `primaryModel`；
- `primaryModel` 必须符合 `physics-model-schema.md`；
- 该 canonical model ID 必须存在于 `physics-model-library.md`，或在同一变更中加入 Library；
- Scene-specific spec 只能实例化/配置模型，不能重新定义 `PhysicsModel` contract。

字段、类型、完整性规则与 model-content organization 均以 `physics-model-schema.md` 为唯一 source of truth。

---

## 7. Phenomenon / Scene / Model 三者关系

三者不要混为一谈：

```text
Physics Model
      │
      ├── Phenomenon A
      │      └── Scene A
      ├── Phenomenon B
      │      └── Scene B
      └── Phenomenon C
             └── Scene C
```

例如：

```text
Model: 能量 → 内能 → 温度变化

Scenes:
- 微波炉加热面包
- 热水袋
- 烧水
```

因此：

> Scene 是模型的学习入口，不是产品知识体系的最小单位。

---

# 8. Universal Stage Protocol

## 8.1 OBSERVE — 先观察

目标：建立第一手现象证据。

学生可以看、操作、暂停、重播、比较状态。

AI 允许：

- ASK
- ENCOURAGE

AI 不应直接解释、给出核心模型或答案。

Evidence：

```ts
observation = {
  rawDescription,
  observedVariables,
  observedChanges
}
```

Exit Gate：学生必须产生与当前现象相关的有效观察证据。

---

## 8.2 DESCRIBE — 说说你看到的

目标：从生活语言逐渐进入物理语言。

例如：

```text
“面包变热了”
    ↓
“面包的温度升高了”
```

不要一开始强迫学生说完整教材句子。

Evidence 至少包含与模型相关的：

- 对象
- 物理量/可观察变量
- 变化方向或状态

AI 允许 ASK / HINT / ENCOURAGE，但不得泄露核心模型。

---

## 8.3 PREDICT — 猜一猜

必须包含：

```text
预测结果 + 预测理由
```

而不是只有一个结果。

AI 可以帮助学生明确预测，但不能替学生预测。

---

## 8.4 EXPERIMENT — 动手试试

实验必须形成：

```text
Prediction
    ↓
Intervention
    ↓
Result
    ↓
Prediction vs Result
    ↓
Reflection
```

统一 Evidence：

```ts
experimentAttempt = {
  intervention,
  prediction,
  result,
  predictionMatch,
  reflection,
  repeatedExperiment?: boolean
}
```

重要约束：

> 初始 OBSERVE 阶段自动运行的现象展示，不得自动满足 EXPERIMENT evidence。

必须存在学生主动进行的、具有信息增量的操作。

---

## 8.5 EXPLAIN — 想想为什么

目标：建立因果解释：

```text
现象
 ↓
中间状态
 ↓
原因
 ↓
结果
```

AI 可以 ASK / HINT / CHALLENGE / ENCOURAGE；必要时可以短解释，但应优先建立在学生已经说出的内容上。

---

# 9. MODEL — 建立你的解释

这是整个协议的核心。

学生需要从零散观察形成：

```text
Input / Cause
      ↓
Intermediate State
      ↓
Physical Interaction / Transformation
      ↓
Observed Outcome
```

涉及能量时：

```text
Energy source
      ↓
Energy transfer / conversion
      ↓
State change
      ↓
Observable outcome
```

例如微波炉：

```text
能量进入
  ↓
内能发生变化
  ↓
温度升高
```

例如内燃机：

```text
燃料中的化学能
  ↓
燃烧后气体内能/状态发生变化
  ↓
气体推动活塞
  ↓
机械运动
```

模型评价至少分离：

1. 结构是否完整
2. 因果关系是否合理
3. 物理量是否混淆
4. 是否满足适用条件
5. 是否能解释观察现象

不要因为学生使用了正确术语就判定“模型正确”。

---

# 10. MODEL REVISION

模型修正可以作为 MODEL 内部循环：

```text
Model
 ↓
Counterexample / New evidence
 ↓
发现解释不足
 ↓
Revise
 ↓
Model 2
```

目标：

> 学生能够发现自己的模型不能解释新证据，并主动修改模型。

---

# 11. TRANSFER — 换个情况试试

学生 UI 不使用“迁移”。

迁移难度分层：

```text
Level 1 — Near Transfer
相似对象 + 相似条件

Level 2 — Medium Transfer
对象变化，但底层机制相同

Level 3 — Far Transfer
表面现象明显不同，需要识别深层模型

Level 4 — Exam Representation
从真实现象转到文字/图表/选择题/计算题

Level 5 — Independent Challenge
AI 消失后独立调用模型
```

不要告诉学生“这和刚才是同一个模型”，而要让学生自己发现底层关系。

---

# 12. EXAM — 像考试一样做

Exam World 必须与实验 World 在视觉和交互上有明确区别。

顺序：

```text
Exam Question
     ↓
这道题主要在问什么？
     ↓
需要哪个物理关系/模型？
     ↓
查看选项
     ↓
作答
     ↓
解释理由
```

必须分别记录：

```ts
examAttempt = {
  representationRecognition,
  modelRecognition,
  answer,
  reasoning,
  correct
}
```

原则：

> 选对答案 ≠ 调用了正确模型。

---

# 13. AI_OFF — 独立挑战

进入后：

```ts
llmEnabled = false;
tutorVisible = false;
allowedActions = [];
```

应用层强制禁止调用 LLM。

AI_OFF 应提供：

- 新情境
- 未直接见过的表述
- 必要的考试式问题
- 不提供隐藏 hint

最终证据包括：

1. 现象/题意识别
2. 物理量识别
3. 模型选择
4. 因果解释或计算
5. 最终答案

---

# 14. COMPLETE — 反思

不要简单显示“恭喜，你掌握了 XX”。

建议：

> “刚才你发现了什么？”

> “如果换一个完全不同的情况，你觉得还能用这个想法吗？”

完成只代表闭环完成，不代表一次学习活动即可证明完全掌握。

---

# 15. AI Guardrail Protocol

核心原则：

> **AI 应该推动学生思考，而不是替学生完成认知动作。**

| Stage | ASK | HINT | CHALLENGE | ENCOURAGE | EXPLAIN |
|---|---:|---:|---:|---:|---:|
| OBSERVE | ✓ |  |  | ✓ |  |
| DESCRIBE | ✓ | ✓ |  | ✓ |  |
| PREDICT | ✓ | ✓ | ✓ | ✓ |  |
| EXPERIMENT | 由 App 主导 |  |  |  |  |
| EXPLAIN | ✓ | ✓ | ✓ | ✓ | 条件允许 |
| MODEL | ✓ | ✓ | ✓ |  | 谨慎 |
| TRANSFER | ✓ | ✓ | ✓ | ✓ | 谨慎 |
| EXAM | ✓ | ✓ | ✓ | ✓ | 条件允许 |
| AI_OFF |  |  |  |  |  |

### Answer Leakage Rule

AI 不得：

- 直接给当前任务最终答案
- 直接给核心模型结构
- 换一种说法暗示完整答案
- 在学生尚未尝试前给出完整解释
- 通过选项排除间接泄露答案

---

# 16. Hint Ladder

```text
H1 — Encourage
“再看看。”

H2 — Focus
“你可以重点看看哪个部件发生了变化。”

H3 — Relationship
“这个变化和哪个物理量有关？”

H4 — Constraint
“如果只改变一个条件，其他条件不变，会怎样？”

H5 — Partial Structure
“你已经找到能量变化了，再想想它怎样导致最后的现象。”
```

提示越接近完整模型，越需要谨慎。

---

# 17. Misconception-aware Tutoring

每个模型应有自己的错误模型集合。

通用基础集合包括：

- M01 把热当成物体储存的东西
- M02 认为吸收能量一定导致温度升高
- M03 认为温度越高内能一定越大
- M04 认为所有“变热”都是同一种过程
- M05 认为说出正确术语就代表理解
- M06 混淆温度、热和内能
- M07 认为答对选择题就代表模型正确
- M08 认为表面相似就可以使用相同解法
- M09 认为温度变化本身就能确定能量转移机制
- M10 认为必须使用高级微观理论才能解释九年级问题

流程：

```text
diagnose
   ↓
select minimal intervention
   ↓
ask / hint / challenge
   ↓
collect new evidence
```

而不是直接纠正。

---

# 18. Universal Evidence Model

跨所有模型统一记录：

```ts
interface CognitiveEvidence {
  observation?: ObservationEvidence;
  description?: DescriptionEvidence;
  prediction?: PredictionEvidence;
  experiment?: ExperimentEvidence;
  explanation?: ExplanationEvidence;
  model?: ModelEvidence;
  transfer?: TransferEvidence;
  exam?: ExamEvidence;
  independent?: IndependentEvidence;
}
```

不同 Scene 使用同一套学习分析结构。

---

# 19. Model Mastery 不等于 Stage Completion

Stage Completion：

> 学生完成了当前任务。

Model Evidence：

> 学生已经表现出可以独立调用模型的证据。

建议掌握证据逐级增强：

```text
Recognition
   ↓
Description
   ↓
Causal Explanation
   ↓
Model Construction
   ↓
Near Transfer
   ↓
Far Transfer
   ↓
Exam Application
   ↓
Independent Application
```

最终掌握度应更多依赖后半部分，而不是一次答题。

---

# 20. Physics Model Coverage Framework

不要追求穷尽所有物理现象。

目标：

> **覆盖课程要求学生能够独立调用的核心物理模型。**

采用三层覆盖：

### Layer 1 — Curriculum Coverage

覆盖：

- 核心概念
- 核心规律
- 核心实验
- 核心公式
- 核心现象
- 常见考试情境

### Layer 2 — Model Coverage

把多个表面现象归入共同底层模型。

例如：

```text
微波炉
热水袋
烧水
```

可能共享：

```text
能量转移
→ 内能变化
→ 温度变化
```

### Layer 3 — Transfer Coverage

每个重要模型至少需要：

```text
Core example
Near transfer
Medium transfer
Far transfer
Exam representation
AI_OFF challenge
```

---

# 21. Model Graph

未来 Physics Model Library 应形成图结构：

```text
                ENERGY
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
     TRANSFER              CONVERSION
        │                     │
   ┌────┴────┐          ┌─────┼─────┐
   ↓         ↓          ↓     ↓     ↓
热传递      做功       化学能  内能  机械能
                          │
                 ┌────────┴────────┐
                 ↓                 ↓
              内燃机             其他系统
```

学生最终建立的不是孤立知识点，而是可连接的物理模型网络。

---

# 22. Model → Scene → Exam

每个模型需要建立：

```text
Model
  ↓
Phenomenon
  ↓
Interactive Scene
  ↓
Cognitive Evidence
  ↓
Transfer
  ↓
Exam Representation
  ↓
AI_OFF
```

考试不是学习流程之外的东西，而是物理模型的一种表示方式。

核心桥梁：

```text
REALITY
   ↓
PHYSICAL MODEL
   ↓
EXAM REPRESENTATION
```

---

# 23. Scene 02 示例：四冲程内燃机

内部模型：

```text
chemical energy
→ internal energy/state change
→ mechanical energy
```

同时包含：

```text
four-stroke-cycle
```

学生入口：

> **发动机为什么会转？**

核心闭环：

```text
观察活塞和曲轴运动
        ↓
用物理语言描述
        ↓
预测某个冲程的作用
        ↓
拆分四个过程
        ↓
干预“燃烧/做功”并比较结果
        ↓
解释为什么活塞运动
        ↓
建立能量转化模型
        ↓
换个情况试试
        ↓
考试表示
        ↓
独立挑战
```

---

# 24. Universal Engine Architecture

推荐代码架构：

```text
PhysicsModel
      ↓
LearningEngine
      ↓
StageRenderer
      ↓
SceneAdapter
      ↓
PhysicsSimulation
```

其中：

- PhysicsModel：定义“学什么”
- LearningEngine：定义“怎么学”
- StageRenderer：定义当前认知动作如何呈现
- SceneAdapter：定义物理世界如何操作
- PhysicsSimulation：定义物理结果如何确定性产生

---

# 25. Cursor 的未来开发方式

不要再给 Cursor：

> “再做一个实验。”

而应该：

> “按照 PhysicsModel Schema 新增一个模型，并为它提供 Scene Adapter、实验数据、误区、迁移、考试表示和 AI policy。”

新模式：

```text
Human
 ↓
定义 PhysicsModel
 ↓
Cursor 根据 Schema
 ↓
实现 Scene
 ↓
统一 Learning Engine
 ↓
统一 Evidence
 ↓
统一 AI Guardrail
 ↓
统一测试
```

---

# 26. New Physics Model Definition of Done

### Model

- [ ] Core idea
- [ ] Quantities
- [ ] Causal relations
- [ ] Conditions
- [ ] Counterexamples
- [ ] Misconceptions

### Scene

- [ ] Observable phenomenon
- [ ] Student manipulation
- [ ] Deterministic physics state
- [ ] Experiment intervention

### Cognition

- [ ] Observation
- [ ] Description
- [ ] Prediction
- [ ] Experiment
- [ ] Explanation
- [ ] Model construction
- [ ] Model revision or boundary check

### Transfer

- [ ] Near transfer
- [ ] Medium transfer
- [ ] Far transfer

### Exam

- [ ] Representation recognition
- [ ] Model recognition
- [ ] Answer
- [ ] Reasoning

### AI

- [ ] Stage policy
- [ ] Hint ladder
- [ ] Misconception handling
- [ ] Answer leakage tests
- [ ] AI unavailable fallback

### Independent

- [ ] AI_OFF challenge
- [ ] No LLM call
- [ ] No hidden hints
- [ ] New scenario
- [ ] Independent evidence

### Engineering

- [ ] Unit tests
- [ ] Component tests
- [ ] E2E
- [ ] Persistence
- [ ] Production build

---

# 27. 当前 MVP 的应用方式

先用两个差异明显的模型验证 Universal Protocol：

```text
Model 01
能量 → 内能 → 温度变化
        ↓
微波炉加热面包

Model 02
化学能 → 内能 → 机械能
        ↓
四冲程内燃机
```

如果两个模型都能通过同一 Learning Engine 完成：

```text
Observe
→ Describe
→ Predict
→ Experiment
→ Explain
→ Model
→ Transfer
→ Exam
→ AI_OFF
```

则说明 Universal Physics Learning Protocol 已具备跨模型复用能力。

---

# 28. 当前文档边界

本协议目前定义：

- 统一认知流程
- Model-first 架构
- Evidence
- AI Guardrail
- Transfer
- Exam
- AI_OFF
- Model Library 的结构

暂不定义：

- 中国具体教材版本的完整模型清单
- 每个模型的最终课程内容
- 每个模型的具体物理模拟算法
- 中考全部题型
- 教师后台
- 学习推荐算法
- 长期 mastery scoring 的最终公式

这些应在后续文档中单独定义。

---

# 29. 后续设计文件

建议：

```text
/spec/
├── universal-physics-learning-protocol.md   ← 本文档
├── physics-model-schema.md
├── physics-model-library.md
├── model-coverage-matrix.md
├── scene-schema.md
├── cognitive-evidence-schema.md
├── ai-guardrail-spec.md
├── transfer-spec.md
├── exam-representation-spec.md
└── independent-assessment-spec.md
```

下一份最重要的文件：

> **physics-model-schema.md**

它将把“物理模型”从理念变成 Cursor 可以稳定执行的数据结构和开发契约。
