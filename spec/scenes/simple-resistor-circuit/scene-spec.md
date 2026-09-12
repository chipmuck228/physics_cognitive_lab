# Scene 06 — Simple resistor circuit

> Version: 0.1 — Scene-specific design specification  
> Scene ID: `simple-resistor-circuit`  
> Primary model: `ohms-law`  
> Production UI: **not implemented**

This file is design only. It does not authorize React, a SceneAdapter, or evaluators.

## Architecture alignment

This file is **not** a source of truth for UPLP, the Physics Model schema, or the model library.

- Universal stages: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Model contract: [`../../physics-model-schema.md`](../../physics-model-schema.md)
- Canonical IDs: [`../../physics-model-library.md`](../../physics-model-library.md)
- Concrete model: [`../../../content/physics-models/ohms-law/`](../../../content/physics-models/ohms-law/)
- PRI: [`../../physics-representation-integrity-contract.md`](../../physics-representation-integrity-contract.md)
- Representation plan: [`./physical-representation-plan.md`](./physical-representation-plan.md)
- Numerical contract: [`./physics-state.md`](./physics-state.md)
- PRE: [`../../reviews/pre/ohms-law.md`](../../reviews/pre/ohms-law.md)

If this file conflicts with those documents, they win.

## 1. Scene identity

```ts
const simpleResistorCircuitScene = {
  id: "simple-resistor-circuit",
  primaryModel: "ohms-law",
  secondaryModels: [],
  phenomenonId: "one-resistor-variable-source",
  visualType: "interactive",
  physicsEngine: "deterministic-simple-resistor-circuit",
} as const;
```

This is the **intended** anchor Scene. It is not a production Scene.

Primary may only be `ohms-law`. Do not silently upgrade `series-circuit` or `parallel-circuit`.

## 2. Purpose

Help a Grade 9 student construct and use:

```text
I = U / R
```

as a **relation among three quantities**, with two controlled comparisons:

- same R: larger U → larger I
- same U: larger R → smaller I

Do not open the Scene with the sentence “电流等于电压除以电阻”.

## 3. Pedagogical boundaries

This Scene must **not** conclude:

- reciting `I = U / R` is the model
- voltage and current manufacture resistance
- `U = I R` and `R = U / I` are different physical laws
- voltage “flows” along the wire
- larger resistance always means larger current
- every electrical device keeps a constant R
- the student has now learned series/parallel, power, or electrical energy

Ammeter-in-series / voltmeter-in-parallel, if shown, are measurement connections for this one resistor. They are not a second MODEL task.

## 4. MODEL builder — intended grammar

Do **not** reuse Scene 02’s energy chain.  
Do **not** reuse Scene 03’s force/motion board.  
Do **not** reuse Scene 04/05 tables as a copied UI.

Intended grammar: quantitative relation / ratio board owned by `ohms-law`.

`MINIMUM_L4_MODEL_COMPLETENESS` is a designer checklist. L4 student evidence is `MINIMUM_L4_CONSTRUCTION_EVIDENCE` plus the Evidence Claim Design. Do not implement six independent completeness radios.

Formula assembly alone does not count. Six correct structured options do not count.

## 5. Secondary-model report

Schema allows `secondaryModels`. Library nearby IDs:

| Library ID | Why it is nearby | Used as Scene 06 secondary? |
|---|---|---|
| `electric-current` | quantity identity of I | No |
| `voltage-potential-difference` | quantity identity of U | No |
| `electrical-resistance` | quantity identity of R | No |
| `series-circuit` | topology | No |
| `parallel-circuit` | topology | No |
| `electric-power` | P = U I | No |
| `electrical-energy` | energy delivery | No |

I, U, and R are quantities of `ohms-law`. Promoting the quantity models would widen teaching scope. Series/parallel are not required to complete the primary.

`secondaryModels = []`.

## 6. Implementation status

Not implemented. Do not treat this spec as a page contract. Readiness was not run.
