# Scene 04 — Deterministic Physics State

> Scene-specific physics contract  
> Primary model: `density-mass-volume`  
> Production code: `lib/physics/equal-volume-material-samples/`

The application must own this state. The LLM must never decide mass, volume, density, or experimental results.

This is a Grade 9 pedagogical sample world, not a materials-science database.

---

## 1. Types

```ts
export type SampleId = "iron-cube" | "wood-cube" | "compact-metal" | "large-plastic";

export interface SampleState {
  id: SampleId;
  materialLabel: string;
  massG: number;
  volumeCm3: number;
  hollow: boolean;
}

export interface DensitySceneState {
  samples: SampleState[];
  comparisonMode: "observe" | "same-volume" | "same-mass" | "cut-uniform";
  cutFactor: 1 | 0.5;
}
```

Density is **derived**:

```ts
function densityGPerCm3(sample: SampleState): number {
  if (sample.volumeCm3 <= 0) {
    throw new Error("Volume must be positive.");
  }
  return sample.massG / sample.volumeCm3;
}
```

Same inputs → same output. No LLM on this path.

---

## 2. Intended catalog

Pedagogical numbers, not a claim of laboratory precision.

| id | material | mass / g | volume / cm³ | ρ / g·cm⁻³ | notes |
|---|---|---|---|---|---|
| iron-cube | 铁 | 79 | 10 | 7.9 | same-volume pair |
| wood-cube | 木 | 6 | 10 | 0.6 | same-volume pair |
| compact-metal | 金属小块 | 20 | 2.5 | 8.0 | same-mass pair |
| large-plastic | 塑料块 | 20 | 20 | 1.0 | same-mass pair |

Uniform cut: multiply `massG` and `volumeCm3` by `cutFactor`. Density unchanged.

Hollow objects are **not** in the default catalog. If a later transfer uses a hollow ball, `hollow: true` means `volumeCm3` is outer volume and the derived value is average density, not material density.

---

## 3. Approximation

| Rule | Meaning |
|---|---|
| Units | Student-facing g and cm³ |
| Exact ratio | `m / V`; do not round into a different physical value |
| Uniform solids | Default samples have no cavities |
| No buoyancy | Floating/sinking is not computed |
| No thermal expansion | Temperature is fixed |
| Measurement | Mass and volume are given by the engine; this Scene does not teach instrument error |

---

## 4. What production physics must not do

- invent sample values in the tutor
- use array position to decide which sample is “correct”
- treat outer size as density
- compute whether an object floats
