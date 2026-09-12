# Scene 05 Physics Truth Audit

> Date: 2026-09-12  
> Scene: `equal-mass-heated-samples`  
> Primary model: `specific-heat-capacity`  
> Screenshot under review: equal-mass water vs sand after same heating  
> Not: UI redesign, evaluator rewrite, PRE/POST rewrite, `metadata.status`

```text
Physics Model semantics changed: NO
UPLP semantics changed: NO
Evaluator semantics changed: NO
L1-L6 semantics changed: NO
```

Audited displayed values:

| Slot | Label | m | Q | Shown temperature line |
|---|---|---|---|---|
| left | 水 | 0.1 kg | 4200 J | `ΔT 10℃ → 30℃` |
| right | 沙子 | 0.1 kg | 4200 J | `ΔT 50℃ → 70℃` |

---

## 1. Where the numbers are born

**Owner:** `content/physics-models/specific-heat-capacity/physics-boundary.ts`

That file is the numerical contract. Production engine code imports it. It is not a registered SceneAdapter.

| Quantity | Source | Value |
|---|---|---|
| water mass | `HEATED_SAMPLE_CATALOG["water-100g"].massKg` | `0.1` |
| sand mass | `HEATED_SAMPLE_CATALOG["sand-100g"].massKg` | `0.1` |
| water c | `specificHeatJPerKgC` | `4200` |
| sand c | `specificHeatJPerKgC` | `840` |
| T₀ both | `initialTemperatureC` | `20` |
| this heating | `OFFICIAL_HEATING_ENERGY_J["Q-same"]` | `4200` |

Scene wiring:

```text
HEATED_SAMPLE_CATALOG
  → heatSampleFromSpec()          // copies m, c, T₀, label into live state
  → officialAbsorbedEnergyJ()     // writes Q onto the heated sample
  → officialTemperatureChangeC()  // ΔT = Q / (c · m)
  → officialFinalTemperatureC()   // T = T₀ + ΔT
```

`createInitialHeatState` / `runHeatObserveDemo` / `runHeatExperiment` all copy from this catalog. `defaultHeatSamplesScenePhysics` wraps `createInitialHeatState`. The adapter `runExperiment` calls `runSceneHeatExperiment` → `runHeatExperiment`.

`spec/scenes/equal-mass-heated-samples/physics-state.md` documents the same table. Its header still says production physics is **not implemented**. That header is stale. The numbers in the table match the contract.

---

## 2. Does the formula actually compute?

**Yes.** ΔT is not a stored outcome table.

```ts
// physics-boundary.ts
deltaT = absorbedEnergyJ / (sample.specificHeatJPerKgC * sample.massKg)
finalT = sample.initialTemperatureC + deltaT
```

Check against the screenshot:

| Sample | Q / (c · m) | ΔT | T₀ + ΔT |
|---|---|---|---|
| water-100g | 4200 / (4200 · 0.1) | 10 | 30 |
| sand-100g | 4200 / (840 · 0.1) | 50 | 70 |

Q itself is a **discrete heating-id lookup**, not `P × t`. That matches the Scene rule: same clock time is a student cue, not official energy.

Guards that run on this path:

- `massKg > 0`
- `specificHeatJPerKgC > 0`
- water must not cross 100 ℃ (`Q = c m ΔT` refused across boiling)

Tests that lock the computed outcomes (not a display fixture):

- `tests/physics-models/specific-heat-capacity.test.ts` — catalog × official Q → 10 / 50 / 5 / 20
- `tests/physics/equal-mass-heated-samples.test.ts` — `runHeatExperiment` then `temperatureChangeC`

---

## 3. Display layer: hardcoded?

**Physics numbers: no.**  
`components/physics/heat/EqualMassHeatedSamples.tsx` does not contain `10`, `30`, `50`, `70`, or `4200`.

| On screen | Binding |
|---|---|
| 水 / 沙子 | `sample.materialLabel` from catalog copy |
| `0.1 kg` | `sample.massKg` from live state |
| `Q 4200 J` | `sample.absorbedEnergyJ` written by `officialAbsorbedEnergyJ` |
| `ΔT 10℃` / `ΔT 50℃` | `temperatureChangeC(sample)` → `officialTemperatureChangeC(catalog[id], Q)` |
| `30℃` / `70℃` | `finalTemperatureC(sample)` → `officialFinalTemperatureC` |

`HeatProductBoard` also has no catalog literals.

Hardcoded in the display file, **not** physics:

- dish colors `#c5e4f3` / `#d6c09a`
- copy keys from `HEAT_COPY` (units, “还没加热”, “温度还没读出来”)

**Display-semantics note (not a wrong number):**

The line is

```text
ΔT {deltaT} ℃ → {finalT} ℃
```

so the student sees `ΔT 10℃ → 30℃`. That is **ΔT then final T**, not T₀ → T. T₀ = 20 ℃ is not printed. A Grade-9 reader can misread `10℃ → 30℃` as “started at 10”. The values are correct; the arrow pairing is easy to misread.

**Coupling note:**

`temperatureChangeC` recomputes from `HEATED_SAMPLE_CATALOG[sample.sampleId]` plus live `absorbedEnergyJ`. It does **not** use `sample.massKg` / `sample.specificHeatJPerKgC` from the live object. Today those fields are always copied from the same catalog, so they match. If a future writer mutated live `massKg` without changing `sampleId`, the card would show the mutated mass and a catalog-based ΔT.

---

## 4. Do evaluators use the same source?

Split by evaluator kind.

### Physics / experiment outcome

**Same source.**  
`lib/learning/heat-experiment.ts` `runSceneHeatExperiment` → `runHeatExperiment` → catalog + `officialAbsorbedEnergyJ` + official ΔT functions. The student-facing experiment gate then scores **qualitative** comparisons (`massComparison`, `energyComparison`, `deltaTComparison`), not the literals 10 / 50.

### Scene MODEL (`evaluateHeatModelStructure`)

**Does not recompute 10 / 50 / 4200.**  
It checks structured relation choices (`Q = c m ΔT`, same-m/same-Q, conditions). That is correct: MODEL evidence is relation construction, not “did the student type 10”.

It imports `MINIMUM_L4_MODEL_EVIDENCE` from `content/physics-models/specific-heat-capacity/evaluator.ts`. No catalog import.

### Canonical text evaluator (`extractSpecificHeatSignals`)

**Does not own Scene numbers.**  
Keyword / relation signals only. No `HEATED_SAMPLE_CATALOG`.

### OBSERVE

**Does not own Scene numbers.**  
Option ids (`same-mass`, `different-rise`). Sufficient if both are selected.

### EXAM calculation item

**Same formula, different authored numbers.**  
`exam-calculate-q-from-c-m-delta-t`: 2 kg water, c = 4.2×10³ J/(kg·℃), 20 ℃ → 30 ℃, Q = 8.4×10⁴ J.

That is an exam-pattern stem, not a live call to `officialAbsorbedEnergyJ`. 20 → 30 happens to match the water sample’s T₀ / T_final, but mass and Q are not the Scene catalog. This is allowed exam transfer, not a second Scene physics table.

---

## 5. Verdict

| Question | Answer |
|---|---|
| Where do the screenshot numbers come from? | `physics-boundary.ts` catalog + `Q-same` + `Q = c m ΔT` |
| Does the formula actually compute ΔT / T? | **Yes** |
| Is official Q `P × t`? | **No** — heating-id table |
| Does the display hardcode 10 / 30 / 50 / 70 / 4200? | **No** |
| Does the physics engine share that source? | **Yes** |
| Does the MODEL / text evaluator recompute those numbers? | **No** — relation / language, by design |
| Does EXAM use the live catalog? | **No** — separate authored numbers, same formula |

**Physics-truth status: PASS**

Open, non-blocking:

1. Temperature line can be misread as T₀ → T (`ΔT 10℃ → 30℃`). Copy-only if repaired later.
2. Live `massKg` is displayed; ΔT is catalog-keyed by `sampleId`. Safe today; brittle if state is later edited in place.
3. `physics-state.md` still claims production physics is unimplemented.

No P0 / P1 physics-truth bug. No code change in this audit.
