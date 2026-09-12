# Scene 03 — Deterministic Physics State

> Scene-specific physics contract  
> Primary model: `force-changes-motion-state`

The application owns this state. The LLM must never decide net force, speed tick, direction, experimental result, or whether motion state changed.

This is a Grade 9 pedagogical 1D world, not a Newtonian integrator.

---

## 1. Types (design; not production code yet)

```ts
export type TrackDirection = "left" | "right";

export type SpeedTick = 0 | 1 | 2 | 3;
// 0 = 静止, 1 = 慢, 2 = 中, 3 = 快

export type NetForceState = "zero" | "left" | "right";

export type MotionStateChange =
  | "unchanged"
  | "started-moving"
  | "sped-up"
  | "slowed-down"
  | "reversed";

export interface CartState {
  positionTick: number;
  speedTick: SpeedTick;
  motionDirection: TrackDirection | "none";
  netForce: NetForceState;
  lastChange: MotionStateChange;
}
```

`positionTick` is only for animation placement. It is **not** a physical quantity the student must report in SI units.

---

## 2. Approximation

| Rule | Meaning |
|---|---|
| One dimension | Horizontal track only |
| Discrete force | `zero` / `left` / `right`; no magnitude slider |
| Discrete speed | Four ticks; not m/s integration |
| Friction omitted | Explicit. Horizontal drag is not modeled |
| Net force is app-owned | The control sets `netForce`; the student does not compute a vector sum |
| Equal qualitative strength | Nonzero left and nonzero right have the same pedagogical strength |
| Animation interpolates | Tweens may smooth a tick change; they never define physics truth |

Mass is constant and hidden. Do not teach mass as a Scene 03 variable.

---

## 3. Deterministic tick rule

One pedagogical step:

1. Read `speedTick`, `motionDirection`, `netForce`.
2. Write the next discrete state. Same inputs → same outputs.

### 3.1 Zero net force

If `netForce === "zero"`:

- `speedTick` unchanged;
- `motionDirection` unchanged;
- `lastChange = "unchanged"`.

A moving cart with zero net force does **not** stop.

### 3.2 Force with no current motion

If `speedTick === 0` and `netForce !== "zero"`:

- `motionDirection` becomes the force direction;
- `speedTick` becomes `1`;
- `lastChange = "started-moving"`.

### 3.3 Force same as motion

If moving and `netForce` matches `motionDirection`:

- `speedTick` increases by 1, capped at `3`;
- direction unchanged;
- `lastChange = "sped-up"` (or `"unchanged"` if already `3` — avoid this cap in required experiments).

### 3.4 Force opposite to motion

If moving and `netForce` is opposite `motionDirection`:

- `speedTick` decreases by 1;
- if the result is `> 0`, direction unchanged and `lastChange = "slowed-down"`;
- if the result would be `0` and the force **remains** applied for a following step, the next step uses §3.2: start moving in the force direction (`lastChange = "reversed"`).

Required Experiment B should show at least **slowed-down**. Reversal is allowed if pedagogically useful, but it is not required to pass EXPERIMENT.

---

## 4. What this Scene is NOT simulating

- F = ma, variable acceleration, or SI unit answers;
- 2D / 3D vectors;
- realistic friction, rolling, or air resistance;
- collisions, rotation, or deformation;
- force sensors or measured newton values;
- “the animation looked smooth, therefore physics said X”.

Animation is a view of the last committed `CartState`.

---

## 5. Observation demo (OBSERVE only)

App-owned playback, not an experiment:

1. Cart at rest, `netForce = "zero"` — stays still.
2. `netForce` becomes `"right"` — cart starts moving and speeds up one tick.

The student should be able to notice 开始运动 and 越来越快 without being told the rule.

This playback must never satisfy EXPERIMENT evidence.

---

## 6. Experiment mapping

| experimentId | Initial | Intervention | Expected truth |
|---|---|---|---|
| `force-with-motion` | moving right, speed 1 or 2 | `netForce = "right"` | `sped-up` |
| `force-against-motion` | moving right, speed 2 | `netForce = "left"` | `slowed-down` (reversal optional if force continues) |
| `zero-net-force-while-moving` | moving right, speed 2 | `netForce = "zero"` | `unchanged` |

The LLM must not author these rows.

---

## 7. Persistence

Store `CartState` inside `LearningSession.physicsState` as adapter-owned state:

```ts
{
  sceneId: "horizontal-force-cart",
  state: CartState
}
```

Do not reuse `EngineState` or microwave temperature fields.
