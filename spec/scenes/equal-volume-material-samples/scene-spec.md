# Scene 04 — Equal-volume material samples

> Version: 0.2 — Scene-specific specification  
> Scene ID: `equal-volume-material-samples`  
> Primary model: `density-mass-volume`  
> Production UI: implemented (`/scenes/equal-volume-material-samples`); quality-reviewed prototype

## Architecture alignment

This file is **not** a source of truth for UPLP, the Physics Model schema, or the model library.

- Universal stages: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Model contract: [`../../physics-model-schema.md`](../../physics-model-schema.md)
- Canonical IDs: [`../../physics-model-library.md`](../../physics-model-library.md)
- Concrete model: [`../../../content/physics-models/density-mass-volume/`](../../../content/physics-models/density-mass-volume/)
- Implementation protocol: [`../../physics-model-implementation-protocol.md`](../../physics-model-implementation-protocol.md)
- Quality review: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)
- Worked example: [`../../reviews/examples/density-mass-volume.md`](../../reviews/examples/density-mass-volume.md)

If this file conflicts with those documents, they win.

---

## 1. Scene identity

```ts
const equalVolumeMaterialSamplesScene = {
  id: "equal-volume-material-samples",
  primaryModel: "density-mass-volume",
  secondaryModels: ["measurement-mass", "measurement-volume"],
  phenomenonId: "equal-volume-material-samples",
  visualType: "interactive",
  physicsEngine: "deterministic-equal-volume-samples",
} as const;
```

Secondary IDs are already registered. They may later help students read a balance or a volume scale. They must not become a second MODEL task in this loop.

---

## 2. Purpose

Help a Grade 9 student construct and use:

```text
mass
volume
        ÷
density ρ = m / V
```

Driving question (student-facing):

> 两块看起来差不多大的东西，为什么一块更沉？

Do **not** open OBSERVE with “密度等于质量除以体积”.

---

## 3. What this Scene is not

Do not teach or simulate:

- buoyancy, floating, or Archimedes’ principle as the learning target;
- atomic packing or crystal structure;
- temperature-dependent expansion as a learning target;
- a full measurement-error course;
- realistic material catalogs beyond a small deterministic sample set.

Do not teach:

- “更大的密度一定更大。”
- “更重的密度一定更大。”
- “切开以后密度会变小。”
- “密度大就一定会沉。”

---

## 4. MODEL builder — runtime validation point

Do **not** reuse Scene 02’s four-slot energy chain.  
Do **not** reuse Scene 03’s three-case force/motion board.

The builder must express a **ratio / quantitative relation**:

```text
[质量 m]  ÷  [体积 V]  =  [密度 ρ]
```

plus controlled comparisons that come from **one** ratio:

- same V, different m → larger ρ
- same m, different V → smaller ρ
- uniform cut: m and V change together in the same proportion, so m/V is unchanged

Assembling `ρ = m / V` alone is not valid MODEL evidence.  
“Because it is the same material” is not enough for the cut.

A two-row comparison table is an allowed pedagogical composite. It must not merge mass and density in the canonical ontology.

---

## 5. Deterministic boundary

Named engine: `deterministic-equal-volume-samples`.

Official values are computed as `density = mass / volume` for `volume > 0`. The LLM must not invent masses, volumes, or densities.

See [`physics-state.md`](./physics-state.md). Production physics code is **not** in this change.

---

## 6. Production sitting (when implemented)

TRANSFER required pair (implementation choice):

- one successful `full-model` (equal cups of liquids, or irregular stone)
- the hollow / outer-size `boundary-contrast`

The float/sink `partial-structure` target is available but not required in one sitting.

EXAM may use all five canonical patterns or a representative subset. Overlay already covers all five.

AI_OFF uses both canonical challenges.
