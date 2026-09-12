# Scene 05 — Deterministic Physics State

> Scene-specific physics contract  
> Primary model: `specific-heat-capacity`  
> Named engine: `deterministic-equal-mass-heat-samples`  
> Production code: **not implemented**

The application must own this state. The LLM must never decide mass, temperature, absorbed energy, specific heat, or experimental results.

This is a Grade 9 pedagogical sample world, not a materials-science database.

Official typed rules live in
[`content/physics-models/specific-heat-capacity/physics-boundary.ts`](../../../content/physics-models/specific-heat-capacity/physics-boundary.ts).
That file is the numerical contract. It is not a registered SceneAdapter.

---

## 1. Types

```ts
export type HeatedSampleId = "water-100g" | "sand-100g" | "water-200g";
export type HeatingEnergyId = "Q-same" | "Q-double";
export type HeatComparisonMode =
  | "observe"
  | "same-mass-same-heating"
  | "same-material-different-mass"
  | "same-sample-different-energy";

export interface HeatedSampleState {
  id: HeatedSampleId;
  materialLabel: string;
  massKg: number;
  specificHeatJPerKgC: number;
  initialTemperatureC: number;
  absorbedEnergyJ: number;
}

export interface HeatSamplesSceneState {
  samples: HeatedSampleState[];
  comparisonMode: HeatComparisonMode;
  heatingEnergy: HeatingEnergyId;
}
```

Temperature change is **derived**:

```ts
function temperatureChangeC(sample: HeatedSampleState): number {
  if (sample.massKg <= 0) {
    throw new Error("Mass must be positive.");
  }
  return sample.absorbedEnergyJ / (sample.specificHeatJPerKgC * sample.massKg);
}
```

Same inputs → same output. No LLM on this path.

If water would pass 100℃, the engine must refuse `Q = c m ΔT` for that interval. The default catalog never crosses that line.

---

## 2. Intended catalog

Pedagogical numbers, not a claim of laboratory precision.

| id | material | m / kg | c / J·kg⁻¹·℃⁻¹ | T₀ / ℃ |
|---|---|---|---|---|
| water-100g | 水 | 0.10 | 4200 | 20 |
| sand-100g | 沙子 | 0.10 | 840 | 20 |
| water-200g | 水 | 0.20 | 4200 | 20 |

Official absorbed energy:

| id | Q / J | student cue |
|---|---|---|
| Q-same | 4200 | same heater, same clock time (approximation of equal energy input) |
| Q-double | 8400 | more energy into the same kind of sample |

Default intended outcomes:

| comparison | left | right | Q | ΔT left / ℃ | ΔT right / ℃ |
|---|---|---|---|---|---|
| same-mass-same-heating | water-100g | sand-100g | 4200 | 10 | 50 |
| same-material-different-mass | water-100g | water-200g | 4200 | 10 | 5 |
| same-sample-different-energy | water-100g | water-100g | 4200 vs 8400 | 10 | 20 |

Final temperatures stay at 30℃, 70℃, 25℃, and 40℃. No boiling.

---

## 3. Approximation

| Rule | Meaning |
|---|---|
| Units | Student-facing kg, ℃, J; c as J/(kg·℃) |
| Official Q | Discrete heating id → table value. Do not treat clock time as Q |
| Same heater / same time | Pedagogical cue that Q may be treated as similar |
| No phase change | Default catalog never reaches 100℃ for water |
| c treated constant | No temperature dependence of c |
| Measurement | Mass and temperature are given by the engine; this Scene does not teach instrument error |
| No calorimetry losses | No heat-to-surroundings course |

---

## 4. What production physics must not do

- invent sample values in the tutor
- compute official Q as `P × t` and then treat time as energy
- apply `Q = c m ΔT` across a melting or boiling interval
- decide whether metal “feels colder”
- replace Scene 01's energy → internal energy → temperature chain
- use array position to decide which sample is “correct”
