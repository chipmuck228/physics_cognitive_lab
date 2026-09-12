# Scene 03 — Scene Specification

> Version: 0.1 — Scene-specific specification  
> Scene ID: `horizontal-force-cart`  
> Primary model: `force-changes-motion-state`

## Architecture alignment

This file is **not** a source of truth for UPLP, the Physics Model schema, or the model library.

- Universal stages, hint ladder, tutor permissions, AI_OFF: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Model contract: [`../../physics-model-schema.md`](../../physics-model-schema.md)
- Canonical IDs: [`../../physics-model-library.md`](../../physics-model-library.md)
- Concrete model: [`../../../content/physics-models/force-changes-motion-state/`](../../../content/physics-models/force-changes-motion-state/)

If this file conflicts with those documents, they win.

---

## 1. Scene identity

```ts
const horizontalForceCartScene = {
  id: "horizontal-force-cart",
  primaryModel: "force-changes-motion-state",
  secondaryModels: ["force-equilibrium", "inertia-motion-state"],
  phenomenonId: "horizontal-cart-net-force",
  visualType: "interactive",
  physicsEngine: "deterministic-horizontal-force-cart",
} as const;
```

Both secondary IDs are already registered in `physics-model-library.md`.

They may later help explain 受力平衡 and 惯性. They must not become a second MODEL task in this loop.

---

## 2. Purpose

Help a Grade 9 student construct and use:

```text
object + current motion state
        +
net-force condition
        +
force direction relative to motion
        ↓
change in motion state
```

Driving question (student-facing):

> 这个小车什么时候会走得更快、更慢，或者改变方向？

At completion, the student should be able to answer:

> 合力怎样改变物体的运动状态？合力为零时又怎样？

with the relation above, not the sentence “力能改变物体运动状态” copied from the textbook.

Do **not** open OBSERVE with that textbook sentence.

---

## 3. What this Scene is not

Do not teach or simulate:

- full 2D vectors or force decomposition;
- numerical F=ma integration;
- realistic friction, rolling resistance, or air drag as a learning target;
- force sensors;
- rotation, collisions, or variable mass;
- Newton's second law as a calculation course;
- a complete inertia / Newton's first law MODEL task.

Do not teach:

- “有力就一定运动。”
- “物体运动就一定受到向前的力。”
- “没有力物体就会停下。”
- “平衡力就是没有力。”
- “力的方向必须和运动方向相同。”
- “快慢变了就是方向变了。”

Friction is omitted as an **explicit** approximation. If a later Scene teaches friction, it must use `friction-force`, not silently rewrite this model.

The cart, speed ticks, and force arrows belong to this Scene's representation. They are not the Physics Model.

---

## 4. Observable environment

One object on one horizontal track.

The student can see:

- the cart;
- whether it is initially stationary or already moving;
- a qualitative force arrow (none / left / right);
- motion direction;
- qualitative speed (still / slow / medium / fast);
- whether speed increased, decreased, stayed the same, or reversed.

Controls (future): play, pause, replay observation; then experiment operations that set `netForce` to same-as-motion, opposite-to-motion, or zero.

Playback of the opening demo is OBSERVE only.

---

## 5. MODEL builder — runtime validation point

Do **not** reuse Scene 02's four-slot linear energy-chain UI.

The builder must express this model's relational structure:

```text
[当前运动状态]
        +
[合力：为零 / 与运动同向 / 与运动反向]
        ↓
[运动状态变化：加快 / 减慢 / 改变方向 / 不变]
        +
[条件：一维、忽略摩擦]
```

Appropriate UI:

- a **relation board**, not a conversion conveyor;
- one slot for current motion state;
- one slot for net-force condition and direction relation;
- one slot for resulting change;
- a condition chip for the zero-net-force boundary.

Inappropriate UI:

- four energy-form nodes in a line;
- “化学能 → 内能 → 做功 → 机械能” recycled with relabeled boxes;
- a free-text box whose length is treated as L4.

This is a deliberate test that MODEL evidence is adapter-owned and does not assume an engine-shaped graph.

---

## 6. Future implementation shape

When production work starts, follow:

Physics Model (already in `content/physics-models/force-changes-motion-state/`)
→ evaluator / experiments / transfer / exam / AI_OFF (already defined)
→ Scene adapter + `sceneData`
→ qualitative physics module
→ UI last

Do not begin with a new page that hard-codes pedagogy.

Universal progression must look up `getSceneAdapter("horizontal-force-cart")`. Do not add `if (sceneId === "horizontal-force-cart")` to universal code.

Scene-specific work lives in `LearningSession.sceneData`. Do not add `scene03Answers` as a universal top-level field.

---

## 7. Runtime assumptions this Scene will validate

| Assumption | Expected |
|---|---|
| MODEL is not a four-node energy chain | Scene-owned MODEL UI; universal runtime does not require energy nodes |
| Tutor context is adapter-owned | `getTutorContext` supplies cart physics summary |
| `sceneData` carries Scene-specific drafts | watched demo, describe draft; experiment records stay on universal arrays |
| Progression needs no `sceneId` branch | `completion[stage](session)` only |
| AssessmentOverlay supports a non-engine model | overlay already drafted on this model |
| AI_OFF protocol works unchanged | no tutor; independent response first; deterministic post-check |
| Evidence accumulation does not require engine-shaped semantics | adapter writes generic `AccumulatedModelEvidence` flags |

Findings that are **not** Scene workarounds:

- `ModelEvaluatorSpec.requiredComponents` must be model-owned (schema TypeScript generalized in this design pass).
- Shared `PredictionEvidence.experimentId` / `ExperimentEvidence.experimentId` are generic `string`s. Scene 03 experiment records use the universal prediction and experiment arrays. Drafts stay in `sceneData`.

---

## 8. Student-facing language

Grade 9 Chinese. Introduce 合力, 运动状态, 方向 progressively after observation. Do not require F=ma.

Scene 03 Chinese stage labels should use the shared `STUDENT_STAGE_LABELS` registry. Do not silently rewrite Scene 01 copy.
