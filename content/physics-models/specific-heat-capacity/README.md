# specific-heat-capacity

Reusable Physics Model. Not a page, and not the water-and-sand dishes themselves.

## Model

`specific-heat-capacity`

Chinese title: 比热容、质量与温度变化

This canonical ID already existed in [`spec/physics-model-library.md`](../../../spec/physics-model-library.md) as family G4. This folder fills the previously empty definition. It does **not** invent a duplicate ID.

## Primary reusable structure

```text
Q = c · m · ΔT
        ↓  equivalently
c = Q / (m ΔT)
```

Controlled comparisons come from **one** relation:

- same m, same ΔT, larger c → larger Q
- same m, same Q, larger c → smaller ΔT
- same c, same Q, larger m → smaller ΔT
- same c, same m, larger Q → larger ΔT

C13: knowing that temperature rose is not enough to determine Q or c. Mass and the relevant energy must also be considered.

This is **not** Scene 01's energy → internal energy → temperature chain and **not** a force/motion board.

MODEL presentation: **quantitative product / ratio board**.

Assembling `Q = c m ΔT` alone is not valid MODEL evidence.

Minimum L4 evidence (all required):

1. core relation Q = c m ΔT (or c = Q / (m ΔT))
2. same m + same ΔT + larger c → larger Q
3. same m + same Q + larger c → smaller ΔT
4. same c + same Q + larger m → smaller ΔT
5. no phase change, and heating time is not Q
6. C13: temperature rise alone is insufficient

## Distinctions the model must keep

- temperature ≠ absorbed energy
- heating time ≠ Q
- hotter ≠ more heat unless m, c, and ΔT are controlled
- more mass ≠ higher temperature rise when Q is the same
- heating does not always raise temperature (phase change)
- this model does not replace `energy-internal-energy-temperature`
- this model does not decide heat-transfer direction by itself

## Production anchor Scene

Equal-mass heated samples (water vs sand).

Scene id: `equal-mass-heated-samples`

Scene spec: [`spec/scenes/equal-mass-heated-samples/`](../../../spec/scenes/equal-mass-heated-samples/)

Production Scene: `/scenes/equal-mass-heated-samples`. The official numerical boundary is implemented in `lib/physics/equal-mass-heated-samples/` from `physics-boundary.ts`.

```ts
{
  primaryModel: "specific-heat-capacity",
  secondaryModels: ["measurement-mass", "measurement-temperature"]
}
```

Secondary models are supporting connections. They are **not** additional learning targets.

## Transfer

- Near two pots of water and oil: `transferMode = full-model`
- Medium coastal vs inland: `transferMode = full-model`
- Far car cooling water: `transferMode = full-model`
- Far ice-water heated: `transferMode = boundary-contrast`
- Partial microwave bread: `transferMode = partial-structure`
  - transferable: Q = c m ΔT can apply when there is a ΔT and no phase-change takeover
  - not automatically transferable: this formula replaces Scene 01's energy chain

## Grade 9 core idea

比热容是单位质量升高单位温度需要的能量。比较升温或吸热必须同时看 Q、m、c 和 ΔT。

Do not open a Scene with the sentence “热量等于比热容乘质量乘温度变化”.

## Status

`prototype` after Scene 05 POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Not learner-validated.
