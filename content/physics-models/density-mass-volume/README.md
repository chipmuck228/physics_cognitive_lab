# density-mass-volume

Reusable Physics Model. Not a page, and not the equal-volume samples themselves.

## Model

`density-mass-volume`

Chinese title: 密度、质量与体积

This canonical ID already existed in [`spec/physics-model-library.md`](../../../spec/physics-model-library.md). This folder fills the previously empty definition. It does **not** invent a duplicate ID.

## Primary reusable structure

```text
mass
volume
        ↓  ratio
density ρ = m / V
```

This is **not** an energy-conversion chain and **not** a force/motion relation board.

MODEL presentation: **ratio-quantitative** (comparison table / ratio board).

Do not reduce it to:

```text
energy A → energy B → energy C
```

or to Scene 03's three-case force board.

## Distinctions the model must keep

- density ≠ mass
- density ≠ volume / apparent size
- heavier ≠ denser unless volume is controlled
- bigger ≠ denser unless mass is controlled
- cutting a uniform sample does not change density
- average density of a hollow object ≠ material density without a volume condition
- density alone does not decide floating / sinking

## Anchor Scene

Equal-volume material samples (two same-size solids).

Scene specification (not production UI): `spec/scenes/equal-volume-material-samples/`

```ts
{
  primaryModel: "density-mass-volume",
  secondaryModels: ["measurement-mass", "measurement-volume"]
}
```

Secondary models are supporting connections. They are **not** additional learning targets.

## Transfer

- Near equal cups of liquids: `transferMode = full-model`
- Medium irregular stone: `transferMode = full-model`
- Far hollow vs solid: `transferMode = boundary-contrast`
- Far float/sink: `transferMode = partial-structure`
  - transferable: ρ = m / V
  - not automatically transferable: density alone explains floating

## Grade 9 core idea

密度是单位体积的质量。比较密度必须同时看质量和体积。

Do not open a Scene with the sentence “密度等于质量除以体积”.

## Status

`prototype` after Scene 04 POST `LEARNING_EVIDENCE_PASS`. Not learner-validated.
