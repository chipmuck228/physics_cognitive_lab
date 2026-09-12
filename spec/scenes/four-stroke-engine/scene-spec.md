# Scene 02 — Scene Specification

> Version: 0.1 — Scene-specific specification  
> Scene ID: `four-stroke-engine`  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

## Architecture alignment

This file is **not** a source of truth for UPLP, the Physics Model schema, or the model library.

- Universal stages, hint ladder, tutor permissions, AI_OFF: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Model contract: [`../../physics-model-schema.md`](../../physics-model-schema.md)
- Canonical IDs: [`../../physics-model-library.md`](../../physics-model-library.md)
- Concrete model: [`../../../content/physics-models/chemical-energy-internal-energy-mechanical-energy/`](../../../content/physics-models/chemical-energy-internal-energy-mechanical-energy/)

If this file conflicts with those documents, they win.

---

## 1. Scene identity

```ts
const fourStrokeEngineScene = {
  id: "four-stroke-engine",
  primaryModel: "chemical-energy-internal-energy-mechanical-energy",
  secondaryModels: [
    "mechanical-work-energy-transfer",
    "force-changes-motion-state",
  ],
  phenomenonId: "four-stroke-internal-combustion-engine",
  visualType: "interactive",
  physicsEngine: "deterministic-four-stroke-engine",
} as const;
```

Both secondary IDs are already registered in `physics-model-library.md`.

They may later help explain “做功” and “力改变运动状态”. They must not become a second MODEL task in this loop.

---

## 2. Purpose

Help a Grade 9 student construct and use:

```text
燃料的化学能
        ↓ 燃烧（过程/条件，不是物理量节点）
工作物质内能 / 状态变化
        ↓ 做功（EnergyRelation.mechanism = work）
机械系统获得机械能
```

Driving question (student-facing):

> 燃料为什么能让发动机持续转起来？

At completion, the student should be able to answer:

> 发动机为什么能把燃料中的能量变成机械运动？

with a causal chain, not a memorized stroke list.

---

## 3. What this Scene is not

Do not teach or simulate:

- detailed combustion chemistry;
- thermodynamic cycles, entropy, enthalpy;
- exact *p*–*V* curves;
- realistic efficiency / torque equations;
- valve-timing overlap, ignition advance, fluid dynamics.

Do not teach:

- “燃烧直接推动曲轴。”
- “气体内能增加后压强永远增加。”
- “全部化学能最终都变成了机械能。”

Real engines have losses. The Scene may say that once, as a boundary. Loss accounting is not the learning target.

Four stroke names belong to this Scene's representation. They are not the Physics Model.

---

## 4. Observable environment

The student can see a simplified single-cylinder engine:

- piston position and direction;
- intake valve open/closed;
- exhaust valve open/closed;
- ignition / combustion event (when it happens);
- working-gas appearance (fresh / compressed / hot expanding / exhaust);
- crankshaft motion;
- whether this stroke is the **main mechanical output**.

Controls (future): play, pause, step one stroke, replay, then later experiment toggles `combustionEnabled` and `pistonCanMove`.

ENTRY / OBSERVE must **not** display the energy-chain label  
`化学能 → 内能 → 机械能`.

---

## 5. Student-facing language

Internal stage IDs remain UPLP English.

Scene 02 student copy (Chinese):

| Internal | Student UI |
|---|---|
| ENTRY | 开始探索 |
| OBSERVE | 先观察 |
| DESCRIBE | 用物理语言描述 |
| PREDICT | 先预测 |
| EXPERIMENT | 动手验证 |
| EXPLAIN | 解释为什么 |
| MODEL | 建立物理模型 |
| TRANSFER | 换个情境试试 |
| EXAM | 试试看考试题 |
| AI_OFF | 独立挑战 |
| COMPLETE | 回头看看 |

Do not expose: transfer, misconception, evidence, AI_OFF, model evaluator, Physics State, stage machine.

These labels instantiate UPLP. They do not rename the stages.

---

## 6. Future UI composition (do not implement now)

Physical scene stays primary. This is not a chatbot.

```text
┌─────────────────────────────────────────────────────────────┐
│ 产品名          进度点                       返回 / 重新开始 │
│ 当前步骤中文名                                               │
│ 当前问题（九年级中文）                                       │
├──────────────────────────────┬──────────────────────────────┤
│                              │ 任务卡                       │
│  大型发动机可视化             │ 学生要做的事                 │
│  气缸 / 活塞 / 气门 / 曲轴    │ 输入 / 选择 / 对照           │
│  燃烧提示（仅当事件发生）     │ 可选：问一句                 │
│                              │                              │
│  播放 / 暂停 / 逐步 / 重放    │                              │
└──────────────────────────────┴──────────────────────────────┘
```

Stage exceptions:

- **MODEL** may replace the engine view with a causal-chain workspace.
- **EXAM** visually switches to Exam World (no engine).
- **AI_OFF** hides tutor controls completely.

Reuse: `LearningShell`, `StageHeader`, `StageProgress`, `TutorPanel`, `ExamQuestion`, `IndependentChallenge`. Extend model-builder evidence for this chain rather than cloning a second tutor architecture.

### Visualization components (Phase 2)

```text
components/physics/engine/
  FourStrokeEngine.tsx
  EngineCylinder.tsx
  EnginePiston.tsx
  EngineConnectingRod.tsx
  EngineCrankshaft.tsx
  EngineValve.tsx
  CombustionEffect.tsx
  WorkingGas.tsx
  EngineControls.tsx
  EngineStateDebug.tsx
  EngineDemo.tsx
```

Development/demo route: `/dev/engine`. Not the student Scene.

Learning components remain future work:

```text
components/learning/
  EngineObservationTask.tsx
  EnginePredictionPanel.tsx
  EngineExperimentPanel.tsx
  EngineModelBuilder.tsx
```

### Physics modules

Implemented in `lib/physics/engine/`. Visualization reads `EngineState`; it does not recompute it.

```ts
getStrokeState(stroke, config): EngineState
advanceStroke(state): EngineState
runEngineCycle(config): EngineState[]
runCombustionDisabledExperiment(config): EngineExperimentResult
runLockedMechanicalSystemExperiment(config): EngineExperimentResult
```

---

## 7. Implementation order when UI is requested

1. `EngineState` + cycle table tests  
2. experiment result functions  
3. Scene evidence gates on the universal progression engine  
4. visualization + OBSERVE/DESCRIBE  
5. PREDICT/EXPERIMENT closure  
6. EXPLAIN/MODEL builder  
7. TRANSFER referencing existing model targets  
8. Exam World using existing exam patterns  
9. AI_OFF using existing independent challenges  

Never: build the page first, then invent a second model.
