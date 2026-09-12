# energy-internal-energy-temperature

Reusable Physics Model. Not a page, and not the microwave or the bread.

## Model

`energy-internal-energy-temperature`

Chinese title: 能量传递、内能与温度

This canonical ID already existed in [`spec/physics-model-library.md`](../../../spec/physics-model-library.md). This folder fills the previously empty definition.

## Phenomenon vs model

Phenomenon: bread becomes warmer during microwave heating.

Model:

```text
energy transfer into / out of a system
        ↓
internal energy of the system changes
        ↓
temperature may change
        +
conditions: not a stored-heat substance;
            temperature ≠ internal energy;
            energy in does not always raise temperature
```

Do not define the model as “microwave heats bread.”

## Not this model

- microwave electromagnetic mechanism
- heat-transfer direction
- heat vs work as the primary distinction
- Q = c m ΔT
- phase-change energy as the primary target
- microscopic temperature interpretation as the primary target

## Status

`prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Quality-reviewed prototype. Not learner-validated.

Evidence claims: [`spec/scenes/microwave-bread/evidence-claim-design.md`](../../../spec/scenes/microwave-bread/evidence-claim-design.md)
POST: [`spec/reviews/post/energy-internal-energy-temperature.md`](../../../spec/reviews/post/energy-internal-energy-temperature.md)
