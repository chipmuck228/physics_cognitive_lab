# ohms-law

Reusable Physics Model. Not a page, and not a pretty circuit drawing.

## Model

`ohms-law`

Chinese title: 欧姆定律：电流、电压与电阻的关系

This canonical ID already existed in [`spec/physics-model-library.md`](../../../spec/physics-model-library.md). This folder fills the previously empty definition. It does **not** invent a duplicate ID.

`metadata.status` is **prototype**. POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Quality-reviewed prototype. Not learner-validated.

## Primary reusable structure

```text
I = U / R
        ↓ equivalently, not a new cause
U = I R
R = U / I

same R, larger U → larger I
same U, larger R → smaller I

R is a property of the conductor under stated conditions.
R = U / I measures or computes R; it does not manufacture R.
```

This is **not** formula recitation and **not** an electricity survey.

MODEL presentation: **quantitative relation / ratio board**.

Assembling `I = U / R` alone is not valid MODEL evidence.

**MODEL completeness** (designer checklist, not student evidence):

1. identify I, U, R as distinct quantities
2. core relation I = U / R (or an equivalent form)
3. same R: larger U → larger I
4. same U: larger R → smaller I
5. rearrangement is not a new cause; R is not made by U and I
6. closed circuit, and R treated as constant for the comparison

**L4 construction evidence** is one coherent board plus authored control→I bind. Six correct structured options must fail. See `spec/scenes/simple-resistor-circuit/evidence-claim-design.md`.

## Distinctions the model must keep

- current ≠ voltage ≠ resistance
- proportional: I ∝ U when R is held constant
- inversely proportional: I ∝ 1/R when U is held constant
- algebraic rearrangement ≠ “who determines whom”
- open circuit: I = 0 is not the same claim as “there is no voltage”
- a glowing filament is a boundary, not this model’s unrestricted conclusion

## Out of scope for this primary

Not required to complete `ohms-law`, therefore not Scene 06 teaching targets:

- `series-circuit` / `parallel-circuit` as models
- electric power / electrical energy
- resistivity / material science of resistors
- Kirchhoff, AC, semiconductors as a course

Meter connection (ammeter in series, voltmeter in parallel) is Physical Representation Integrity, not a second primary model.

## Secondary models

None.

Nearby Library IDs `electric-current`, `voltage-potential-difference`, and `electrical-resistance` name quantity ideas already owned by this model’s quantities. Promoting them here would widen the Scene into an electricity survey.

## Intended anchor Scene

Simple resistor circuit.

Scene id: `simple-resistor-circuit`

Named engine: `deterministic-simple-resistor-circuit`

Production Scene: `/scenes/simple-resistor-circuit`.

Named engine: `deterministic-simple-resistor-circuit`

## Quantitative contract

Official derivation lives in `physics-boundary.ts`. Catalog numbers are pedagogical engine values. They must not become hardcoded UI truth.

## Quality

PRE: `spec/reviews/pre/ohms-law.md`

POST: `spec/reviews/post/ohms-law.md`
