# force-changes-motion-state

Reusable Physics Model. Not a page, and not the horizontal cart itself.

## Model

`force-changes-motion-state`

Chinese title: 力改变物体的运动状态

This canonical ID already existed in [`spec/physics-model-library.md`](../../../spec/physics-model-library.md). This folder fills the previously empty definition. It does **not** invent a duplicate ID.

## Primary reusable structure

```text
object + current motion state
        +
net-force condition
        +
force direction relative to motion
        ↓
change in motion state
(speed up / slow down / reverse / unchanged)
```

This is **not** an energy-conversion chain.

Do not reduce it to:

```text
energy A → energy B → energy C → energy D
```

## Distinctions the model must keep

- force ≠ motion
- force present ≠ object must be moving
- motion present ≠ force must act in the motion direction
- balanced forces ≠ no forces
- zero net force ≠ object must be stationary
- speed change ≠ direction change

## Anchor Scene

Horizontal cart on one dimension.

Scene specification (not production UI): `spec/scenes/horizontal-force-cart/`

```ts
{
  primaryModel: "force-changes-motion-state",
  secondaryModels: ["force-equilibrium", "inertia-motion-state"]
}
```

Secondary models are supporting connections. They are **not** additional learning targets.

## Transfer

- Near bicycle speeding up: `transferMode = full-model`
- Medium ball slowed by an opposite force: `transferMode = full-model`
- Far hover / air-track constant velocity: `transferMode = boundary-contrast`
  - transferable: zero net force → motion state unchanged
  - not automatically transferable: nonzero same-direction / opposite-direction speed-change relations as if a force were still driving the motion

## Grade 9 core idea

物体受到的合力可以改变它的运动状态。合力为零时，运动状态保持不变。力不是维持运动所必须的“向前的力”。

Do not open a Scene with that sentence.

## Status

Quality-reviewed prototype after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Not learner-validated. Do not write `validated`.
