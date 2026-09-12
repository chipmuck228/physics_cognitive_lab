# chemical-energy-internal-energy-mechanical-energy

Reusable Physics Model. Not a page, and not the four-stroke engine itself.

## Model

`chemical-energy-internal-energy-mechanical-energy`

Chinese title: 化学能—内能—机械能转化

## Primary reusable structure

```text
fuel chemical energy
        ↓  (combustion as enabling process/condition)
working-gas internal-energy / state change
        ↓  (energy transfer by work)
mechanical energy
```

Combustion is a process that enables the first conversion.
It is not a PhysicalQuantity.

Pressure is not part of this reusable causal chain.

The four strokes (吸气 → 压缩 → 做功 → 排气) belong to the **Scene representation**.
They are not the Physics Model.

## Anchor Scene

Four-stroke Internal Combustion Engine

Scene specification (not production UI): `spec/scenes/four-stroke-engine/`

Future Scene declaration:

```ts
{
  primaryModel: "chemical-energy-internal-energy-mechanical-energy",
  secondaryModels: [
    "mechanical-work-energy-transfer",
    "force-changes-motion-state"
  ]
}
```

Secondary models are supporting connections. They are not automatically new learning targets.

## Transfer

- Near / medium motorcycle and lab piston devices: `transferMode = full-model`
- Far steam piston: `transferMode = partial-structure`
  - transferable: internal-energy/state change → work → mechanical energy
  - not automatically transferable: fuel chemical energy → internal energy

## Grade 9 core idea

燃料燃烧时，燃料的化学能发生转化，使工作物质的内能和状态发生变化；工作物质可以通过做功把能量传递给机械系统，最终表现为机械能。

## Status

`draft` until a Scene and full UPLP loop exist. This folder is the model definition, evaluator, and evidence contract only.
