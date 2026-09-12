# Scene 02 — Deterministic Physics State

> Scene-specific physics contract  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

The application owns this state. The LLM must never decide stroke, valves, piston motion, combustion, experimental result, or mechanical output.

This is a Grade 9 pedagogical cycle, not an engineering simulation.

---

## 1. Types

```ts
export const EngineStroke = {
  INTAKE: "intake",
  COMPRESSION: "compression",
  POWER: "power",
  EXHAUST: "exhaust",
} as const;

export type EngineStroke = (typeof EngineStroke)[keyof typeof EngineStroke];

export type PistonDirection = "up" | "down" | "held";

export type WorkingGasState =
  | "fresh-mixture"
  | "compressed"
  | "combusted-hot"
  | "expanding"
  | "exhaust"
  | "compressed-unburned";

export type MechanicalOutput =
  | "none"
  | "input-required"
  | "main-output"
  | "blocked";

export type ChemicalConversion =
  | "not-started"
  | "occurring"
  | "occurred"
  | "skipped";

export type WorkTransfer =
  | "none"
  | "mechanical-to-gas"
  | "gas-to-mechanical"
  | "blocked";

export interface EnergyState {
  chemicalEnergyAvailable: boolean;
  chemicalToInternalConversion: ChemicalConversion;
  workTransfer: WorkTransfer;
  mechanicalEnergyOutput: MechanicalOutput;
}

export interface EngineExperimentConfig {
  combustionEnabled: boolean;
  pistonCanMove: boolean;
}

export interface EngineState extends EngineExperimentConfig {
  stroke: EngineStroke;
  /** 0 = top dead center, 1 = bottom dead center */
  pistonPosition: number;
  pistonDirection: PistonDirection;
  intakeValveOpen: boolean;
  exhaustValveOpen: boolean;
  combustionOccurred: boolean;
  combustionEventActive: boolean;
  workingGasState: WorkingGasState;
  crankshaftMoving: boolean;
  mechanicalOutput: MechanicalOutput;
  workTransfer: WorkTransfer;
  energyState: EnergyState;
}
```

`combustionEnabled` and `pistonCanMove` are student-controlled experiment variables. They are not LLM outputs.

Combustion is a **process/event** (`combustionEventActive`, `combustionOccurred`), not a `PhysicalQuantity`.

Pressure is **not** a field on `EngineState`. Do not encode “state change ⇒ pressure always increases.”

---

## 2. Pedagogical conventions

Cycle order:

```text
intake → compression → power → exhaust → intake
```

Piston:

- `0` = 上止点 (TDC)
- `1` = 下止点 (BDC)
- intake / power: direction `down` (`0 → 1`)
- compression / exhaust: direction `up` (`1 → 0`)
- locked system: direction `held`, position frozen

Valves are fully open or fully closed. No overlap.

Flywheel inertia may keep the **animation** stepping through strokes after a failed power stroke. That is visual continuity. It does **not** count as `mechanicalOutput: "main-output"`.

Losses exist in real engines. `EnergyState` does not compute efficiency. Teaching copy may say energy does not all become mechanical energy.

---

## 3. Canonical stroke table (normal run)

`combustionEnabled = true`, `pistonCanMove = true`.

| | Intake 吸气 | Compression 压缩 | Power 做功 | Exhaust 排气 |
|---|---|---|---|---|
| pistonDirection | down | up | down | up |
| pistonPosition path | 0 → 1 | 1 → 0 | 0 → 1 | 1 → 0 |
| intakeValveOpen | true | false | false | false |
| exhaustValveOpen | false | false | false | true |
| combustionEventActive | false | false | true at stroke start | false |
| combustionOccurred | false | false | true after event | remains true until next intake reset |
| workingGasState | `fresh-mixture` | `compressed` | `combusted-hot` then `expanding` | `exhaust` |
| crankshaftMoving | true | true | true | true |
| mechanicalOutput | none | input-required | **main-output** | none |
| chemicalEnergyAvailable | true | true | converting / then reduced | residual gases leaving |
| chemicalToInternalConversion | not-started | not-started | occurring → occurred | occurred (spent) |
| workTransfer | none | **mechanical-to-gas** | **gas-to-mechanical** | none |

Compression uses mechanical input to compress the mixture. That is `mechanicalOutput: "input-required"` and `workTransfer: "mechanical-to-gas"`. It is **supporting physical state**, not an additional primary learning target.

The main Grade 9 work transfer is only on the power stroke, after combustion, while the piston can move (`gas-to-mechanical` + `main-output`).

At the start of the next intake, reset `combustionOccurred` to `false` and restore `chemicalEnergyAvailable` for the new mixture.

---

## 4. Experiment A — `combustionEnabled = false`

Model experiment ID: `ignition-energy-release`

Question (already on the model):

> 如果压缩完成后没有发生正常燃烧，还会不会出现正常的主要动力输出？为什么？

Deterministic power-stroke overlay:

| Field | Value |
|---|---|
| combustionEventActive | false |
| combustionOccurred | false |
| workingGasState | `compressed-unburned` |
| chemicalToInternalConversion | `skipped` |
| workTransfer | `none` (not `gas-to-mechanical`) |
| mechanicalOutput | `none` (not `main-output`) |
| crankshaftMoving | may still animate for stepping; **not** main-output |

Causal meaning:

```text
no combustion
  → no normal chemical → internal conversion
  → no normal expansion work
  → no normal main mechanical output
```

OBSERVE autoplay of a *normal* cycle must not satisfy this experiment.

---

## 5. Experiment B — `pistonCanMove = false`

Model experiment ID: `immovable-mechanical-system`

Question (already on the model):

> 燃料正常燃烧，但高温气体无法推动机械部件运动。这个装置还能按原来的方式输出机械能吗？

Deterministic overlay (power stroke, combustion still enabled):

| Field | Value |
|---|---|
| pistonDirection | `held` |
| pistonPosition | frozen (typically 0, TDC) |
| combustionEventActive | true at event |
| combustionOccurred | true |
| workingGasState | `combusted-hot` |
| chemicalToInternalConversion | `occurred` |
| workTransfer | `blocked` |
| mechanicalOutput | `blocked` |
| crankshaftMoving | false |

Causal meaning:

```text
combustion may occur
working-gas internal energy / state may change
but work on the mechanical system is not completed
→ no normal mechanical output
```

Do not treat “气体变热了” as mechanical energy output.

---

## 6. Required functions

Implemented in `lib/physics/engine/`. Visualization must call these. It must not recompute stroke, valves, combustion, or output.

```ts
function getStrokeState(
  stroke: EngineStroke,
  config: EngineExperimentConfig,
): EngineState;

function advanceStroke(state: EngineState): EngineState;

function runEngineCycle(config: EngineExperimentConfig): EngineState[];

function runCombustionDisabledExperiment(): EngineExperimentResult;

function runLockedMechanicalSystemExperiment(): EngineExperimentResult;
```

`EngineExperimentResult` must include the config, the power-stroke `EngineState`, and a conceptual outcome flag such as `mainOutputOccurred: boolean`. Values come only from these functions.

---

## 7. Visualization boundary

The UI interpolates piston position, rod angle, crank angle, valve lift, gas region, and combustion intensity **between** stroke snapshots.

Interpolation is presentation. It must not create a second `EngineState`.

`crankshaftMoving` is kinematic continuity. It does **not** imply `mechanicalOutput === "main-output"`.

Default observation visuals must not display the energy chain  
`化学能 → 内能 → 做功 → 机械能`.

---

## 8. Explicit non-claims

The table must not be implemented as:

- combustion directly rotating the crankshaft;
- pressure monotonically increasing through expansion;
- all chemical energy becoming mechanical energy;
- every stroke producing main mechanical output.
